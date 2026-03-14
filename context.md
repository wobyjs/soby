# Context Architecture Documentation

## Overview

The context system in soby is a **hierarchical, symbol-based dependency injection mechanism** that enables reactive state management across component boundaries and lexical scopes. It works through arrow functions `() => {}` chains by leveraging **execution context switching** rather than lexical scoping.

---

## Core Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SUPER_ROOT (Global Owner)                        │
│  - parent: undefined                                                    │
│  - context: {} (empty base context)                                     │
│  - OWNER: SuperRoot instance (global singleton)                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ lazyArrayPush (parent-child link)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CONTEXT (IContext)                            │
│  - parent: IOwner (points to SUPER_ROOT or parent Context)              │
│  - context: { ...OWNER.context, ...newContext } (merged context)        │
│  - extends Owner class                                                  │
│  - wrap(fn, owner, observer, stack): T                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ lazyArrayPush (parent-child link)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          OBSERVER / ROOT / SUSPENSE                     │
│  - parent: IOwner (points to Context or parent Observer)                │
│  - context: Contexts = OWNER.context (inherited from current OWNER)     │
│  - Observes reactive changes                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Class Hierarchy

```
Owner (Base Class)
  │
  ├── SuperRoot (Singleton Root)
  │     └── context: {} (empty base)
  │     └── parent: undefined
  │
  ├── Context
  │     └── context: { ...OWNER.context, ...newContext } (merged)
  │     └── parent: IOwner
  │     └── wrap(fn, owner, observer, stack): T
  │
  ├── Observer
  │     └── context: Contexts = OWNER.context (inherited)
  │     └── parent: IOwner
  │     └── status: number (dirty tracking)
  │
  ├── Root
  │     └── context: Contexts = OWNER.context (inherited)
  │     └── parent: IOwner
  │     └── registered?: true
  │
  └── Suspense
        └── context: Contexts = OWNER.context (inherited)
        └── parent: IOwner
```

---

## How Context Works Across Arrow Functions `() => {}`

### Key Insight: Execution Context vs Lexical Context

The context system **does NOT rely on lexical scoping**. Instead, it uses **dynamic execution context switching** via global state manipulation.

```typescript
// Global state holders (from superroot.ts)
export let SUPER_OWNER: ISuperRoot = new SuperRoot()
export let OWNER: IContext | IObserver | IRoot | ISuperRoot | ISuspense = SUPER_OWNER
export const setOwner = (value) => OWNER = value

// From context.ts methods
export let OBSERVER: IObserver | undefined
export const setObserver = (value) => OBSERVER = value
```

### The Magic: `wrap()` Method

The `wrap()` method in `Owner` class (`owner.ts:85-110`) is the core mechanism:

```typescript
wrap<T>(fn: WrappedFunction<T>, owner, observer, stack?): T {
  const ownerPrev = OWNER      // 1. Save current global OWNER
  const observerPrev = OBSERVER // 2. Save current global OBSERVER

  setOwner(owner)              // 3. Set new OWNER (context switch)
  setObserver(observer)        // 4. Set new OBSERVER

  try {
    return fn(stack)           // 5. Execute function with NEW context
  } catch (error) {
    this.catch(error, false)   // 6. Error handling with bubbling
    return UNAVAILABLE
  } finally {
    setOwner(ownerPrev)        // 7. Restore previous OWNER
    setObserver(observerPrev)  // 8. Restore previous OBSERVER
  }
}
```

### Why Arrow Functions Work

```typescript
// Example usage
const MySymbol = Symbol('myData')

// Create a context boundary
context({ [MySymbol]: 'value' }, () => {
  // Inside this arrow function, OWNER points to the new Context
  // Any nested context() or reactive calls will see the merged context
  
  return someComponent()  // This can call context(MySymbol) anywhere in its call stack
})

// Even though the arrow function creates a new lexical scope,
// the global OWNER/OBSERVER variables are temporarily switched
// during execution, so ALL code running inside sees the new context
```

---

## Multiple/Nested/Hierarchical Context Passing

### 1. Context Merging Strategy

When a new `Context` is created (`context.ts:21-29`):

```typescript
constructor(context: Contexts) {
  super()
  // Merge parent context with new values (shallow merge)
  this.context = { ...OWNER.context, ...context }
  // Register as child of current OWNER
  lazyArrayPush(this.parent, 'contexts', this)
}
```

### 2. Nested Context Example

```typescript
const SymA = Symbol('A')
const SymB = Symbol('B')
const SymC = Symbol('C')

// Level 0: SuperRoot (empty context)
// context(SymA) = undefined

context({ [SymA]: 'value-a' }, () => {
  // Level 1: Context { [SymA]: 'value-a' }
  // context(SymA) = 'value-a'
  // context(SymB) = undefined
  
  context({ [SymB]: 'value-b' }, () => {
    // Level 2: Context { [SymA]: 'value-a', [SymB]: 'value-b' }
    // context(SymA) = 'value-a' (inherited)
    // context(SymB) = 'value-b' (local)
    // context(SymC) = undefined
    
    context({ [SymC]: 'value-c' }, () => {
      // Level 3: Context { [SymA]: 'value-a', [SymB]: 'value-b', [SymC]: 'value-c' }
      // All three symbols accessible here
    })
  })
})
```

### 3. Context Shadowing/Overriding

```typescript
const SymX = Symbol('X')

context({ [SymX]: 'outer' }, () => {
  // context(SymX) = 'outer'
  
  context({ [SymX]: 'inner' }, () => {
    // context(SymX) = 'inner' (shadows outer value)
  })
  
  // Back to 'outer' after inner context exits
})
```

---

## Context Consumption Flow

### Reading Context Values

From `methods/context.ts:12-26`:

```typescript
function context<T>(symbol: symbol): T | undefined
function context<T>(context: Contexts, fn: ContextFunction<T>): T
function context<T>(symbolOrContext: symbol | Contexts, fn?: ContextFunction<T>) {
  if (isSymbol(symbolOrContext)) {
    // READING: Get value from current OWNER's context chain
    return OWNER.context[symbolOrContext]
  } else {
    // CREATING: New context boundary
    const stack = callStack()
    return new Context(symbolOrContext).wrap(fn || noop, undefined as any, undefined, stack)
  }
}
```

### Context Lookup Chain

```
┌──────────────────────────────────────────────────────────────┐
│  context(MySymbol) lookup:                                   │
│                                                              │
│  1. Check OWNER.context[MySymbol]                            │
│  2. If undefined, value is undefined (no prototype chain)    │
│     (but context was merged from parent at creation time)    │
└──────────────────────────────────────────────────────────────┘
```

**Important**: Context values are **merged at creation time** via spread operator:
```typescript
this.context = { ...OWNER.context, ...context }
```

This means:
- Parent context values are copied (shallow copy)
- New values override parent values with same symbol
- Changes to parent context AFTER child creation won't propagate

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXECUTION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: Initial State
┌──────────────────────────────────────────┐
│ GLOBAL STATE:                            │
│   OWNER = SUPER_OWNER                    │
│   OBSERVER = undefined                   │
│                                          │
│ SUPER_OWNER.context = {}                 │
└──────────────────────────────────────────┘

Step 2: context({ [SymA]: 'A' }, () => { ... })
┌──────────────────────────────────────────┐
│ 1. Create new Context instance           │
│    - context = { ...{}, [SymA]: 'A' }    │
│    - parent = SUPER_OWNER                │
│                                          │
│ 2. Call context.wrap(fn, ...)            │
│    - Save: ownerPrev = SUPER_OWNER       │
│    - Set:  OWNER = new Context           │
│    - Execute: fn()                       │
│      ┌────────────────────────────────┐  │
│      │ Inside fn():                   │  │
│      │   OWNER.context[SymA] = 'A' ✓  │  │
│      │   Can call context(SymA) ✓     │  │
│      └────────────────────────────────┘  │
│    - Restore: OWNER = SUPER_OWNER        │
└──────────────────────────────────────────┘

Step 3: Nested context({ [SymB]: 'B' }, () => { ... })
┌──────────────────────────────────────────┐
│ 1. Create another Context                │
│    - context = { [SymA]: 'A', [SymB]: 'B' }
│    - parent = previous Context           │
│                                          │
│ 2. wrap() switches OWNER again           │
│    - Now OWNER points to 2nd Context     │
│    - Both SymA and SymB accessible       │
└──────────────────────────────────────────┘
```

---

## Why It Works Across `() => {}` Chains

### The Problem (Lexical Scoping)

Normally, JavaScript closures capture variables lexically:

```javascript
// LEXICAL: Inner function can't access outer scope variables
// if they're not in the closure chain
```

### The Solution (Dynamic Scoping via Global State)

Soby uses **dynamic scoping** through global variables:

```typescript
// Global state acts as "ambient" context
let OWNER = SUPER_OWNER

// wrap() temporarily changes this global
function wrap(fn) {
  const prev = OWNER
  OWNER = newContext  // Switch context
  const result = fn() // Execute - ANY code can access OWNER
  OWNER = prev        // Restore
  return result
}

// Even deeply nested calls see the switched context
context({ [Sym]: 'val' }, () => {
  outerFn()  // Can access context
})

function outerFn() {
  innerFn()  // Can STILL access context
}

function innerFn() {
  const val = context(Sym)  // ✓ Works! OWNER is still switched
}
```

### Key Properties

| Property | Description |
|----------|-------------|
| **Dynamic** | Context follows execution, not lexical structure |
| **Transparent** | No need to pass context through function parameters |
| **Composable** | Multiple contexts can be nested arbitrarily |
| **Isolated** | Each execution path has its own context chain |
| **Restored** | Original context always restored after execution |

---

## Real-World Usage Pattern

```typescript
// Define context symbols
const ThemeContext = Symbol('theme')
const UserContext = Symbol('user')

// Create context provider
function App() {
  return context(
    { 
      [ThemeContext]: 'dark',
      [UserContext]: { name: 'Alice' }
    },
    () => <Layout />
  )
}

// Consume context anywhere in component tree
function Layout() {
  return <Header />
}

function Header() {
  return <Toolbar />
}

function Toolbar() {
  // Can access context even though not passed as props
  const theme = context(ThemeContext)  // 'dark'
  const user = context(UserContext)    // { name: 'Alice' }
  return <div>{user.name} - {theme}</div>
}
```

---

## Error Handling & Context

From `owner.ts:38-60`:

```typescript
catch(error: Error, silent: boolean): boolean {
  const { errorHandler } = this
  
  if (errorHandler) {
    errorHandler(error)
    return true
  } else {
    // Bubble up to parent
    if (this.parent?.catch(error, true)) return true
    
    if (silent) return false
    throw error  // Re-throw if unhandled
  }
}
```

Error handlers are also part of the context hierarchy and bubble up through the parent chain.

---

## Disposal & Cleanup

From `owner.ts:62-75`:

```typescript
dispose(deep: boolean): void {
  // Dispose children
  lazyArrayEachRight(this.contexts, onDispose)
  lazyArrayEachRight(this.observers, onDispose)
  lazyArrayEachRight(this.suspenses, onDispose)
  lazyArrayEachRight(this.cleanups, onCleanup)
  
  // Clear references
  this.cleanups = undefined
  this.disposed = deep
  this.errorHandler = undefined
  // ...
}
```

When a context is disposed:
1. All child contexts are disposed
2. All observers are disposed
3. All cleanup functions run
4. References are cleared

---

## FAQ: Common Questions

### Q1: Must everything be under one root in a tree?

**No.** Each reactive computation can create its own independent tree:

```typescript
// Tree 1: Completely independent from Tree 2
root(() => {
  context({ [SymA]: 'A' }, () => {
    // This creates: SuperRoot → Root → Context
    // Independent ownership tree
  })
})

// Tree 2: Another independent tree
root(() => {
  context({ [SymB]: 'B' }, () => {
    // This creates: SuperRoot → Root → Context (different branch)
    // Cannot access SymA from Tree 1
  })
})
```

**Key Points:**
- Every `root()` call creates a new top-level owner under `SUPER_OWNER`
- `SUPER_OWNER` is the only true singleton - it's the universal root
- Multiple independent trees can coexist, but they **cannot share context** unless explicitly passed
- Context only flows **downward** within a single tree branch

### Q2: Is it possible to attach an orphan child/leaf into a context (inside other thread/worker)?

**Short Answer: No, not directly.** Here's why:

#### Problem 1: Single-threaded Global State

```typescript
// The context system relies on synchronous global state switching
export let OWNER: IContext | IObserver | IRoot | ISuperRoot | ISuspense = SUPER_OWNER
export const setOwner = (value) => OWNER = value

// wrap() method switches context synchronously
wrap<T>(fn, owner, observer, stack): T {
  const ownerPrev = OWNER      // Save
  setOwner(owner)              // Switch (synchronous!)
  try {
    return fn(stack)           // Execute
  } finally {
    setOwner(ownerPrev)        // Restore (synchronous!)
  }
}
```

**Workers/threads have separate memory spaces** - they cannot access the main thread's `OWNER` global.

#### Problem 2: Execution Context Doesn't Cross Async Boundaries

```typescript
// This WON'T work:
context({ [Sym]: 'value' }, () => {
  setTimeout(() => {
    // By now, OWNER has been restored to previous value
    // This callback runs in a DIFFERENT execution context
    const val = context(Sym)  // undefined! ❌
  }, 1000)
})
```

#### Workaround: Manual Context Passing

If you need to use context in async/worker scenarios, you must **explicitly capture and transfer** the context:

```typescript
// Option 1: Capture context values before async boundary
const Sym = Symbol('data')

context({ [Sym]: 'value' }, () => {
  // Capture the context value BEFORE leaving the context
  const capturedValue = context(Sym)
  
  // Now use capturedValue in worker/async
  worker.postMessage({ value: capturedValue })
  // or
  setTimeout(() => {
    console.log(capturedValue)  // ✓ Works (closed over value, not context)
  }, 1000)
})

// Option 2: Re-establish context in the worker
worker.onmessage = (event) => {
  // Worker must recreate its OWN context tree
  context({ [Sym]: event.data.value }, () => {
    // Now context works inside worker
  })
}
```

#### Visual: Context Boundary Limitations

```
┌─────────────────────────────────────────────────────────────┐
│ Main Thread                                                 │
│                                                             │
│  context({ [Sym]: 'value' }, () => {                       │
│    ┌─────────────────────────────────────────────────────┐  │
│    │ OWNER points to Context with Sym                    │  │
│    │ context(Sym) = 'value' ✓                            │  │
│    │                                                      │  │
│    │  worker.postMessage({...})  ←── Context STOPS here   │  │
│    └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          │ (no context crosses)             │
│                          ▼                                  │
├─────────────────────────────────────────────────────────────┤
│ Web Worker / Thread                                         │
│                                                             │
│  onmessage = (e) => {                                      │
│    ┌─────────────────────────────────────────────────────┐  │
│    │ OWNER = SUPER_OWNER (default, no context)           │  │
│    │ context(Sym) = undefined ❌                         │  │
│    │                                                      │  │
│    │ Must recreate:                                      │  │
│    │ context({ [Sym]: e.data.value }, () => {...})       │  │
│    └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Q3: Can I manually attach a context to an existing owner?

**Yes, but indirectly.** You can create a new context that inherits from any current point in the tree:

```typescript
// Current tree: SuperRoot → Context_A
context({ [SymA]: 'A' }, () => {
  // Somewhere deep in the tree...
  
  // Create a NEW context that becomes a child of current OWNER
  context({ [SymB]: 'B' }, () => {
    // Now: { [SymA]: 'A', [SymB]: 'B' }
    // This new context is automatically attached as child of Context_A
  })
})
```

However, you **cannot**:
- Attach a context to an already-disposed owner
- Attach a context across different threads
- Share a context instance between two separate trees

### Q4: What happens if I try to use context outside any tree?

```typescript
// At top level, before any root/context
const val = context(MySymbol)  // Returns undefined

// Because OWNER = SUPER_OWNER, and SUPER_OWNER.context = {}
```

This is safe but useless - you'll always get `undefined` because the super root has an empty context.

---

## Summary

The soby context system achieves **dependency injection without prop drilling** by:

1. **Global State Switching**: Using `OWNER` and `OBSERVER` globals that are temporarily switched during execution
2. **Hierarchical Merging**: Child contexts inherit parent values via object spread at creation time
3. **Symbol-based Keys**: Using symbols prevents naming collisions across libraries
4. **Execution-based Access**: Context is accessed via the current `OWNER`, not lexical scope
5. **Automatic Restoration**: `finally` blocks ensure context is always restored after execution

**Limitations:**
- Context is **single-threaded** - doesn't cross worker boundaries
- Context is **synchronous** - doesn't survive async boundaries without explicit capture
- Context is **tree-scoped** - independent trees cannot share context implicitly

This design enables React-like context patterns while working seamlessly with solid-style fine-grained reactivity.
