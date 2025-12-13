# Woby AI Assistant Guide

This guide is specifically for AI coding assistants to understand Woby patterns and avoid common anti-patterns.

## Key Principles for AI Assistants

### 1. No Dependency Arrays
Woby's `useEffect` and `useMemo` do NOT require dependency arrays like React:

```typescript
// ❌ Anti-pattern: React-style useEffect with dependency array
useEffect(() => {
  console.log(count)
}, [count])

// ✅ Woby pattern: No dependency array needed
useEffect(() => {
  console.log($(count))
})

// ❌ Anti-pattern: React-style useMemo with dependency array
const doubled = useMemo(() => count * 2, [count])

// ✅ Woby pattern: No dependency array needed
const doubled = useMemo(() => $(count) * 2)
```

### 2. Automatic Dependency Tracking
Dependencies are automatically tracked when you use `$()` in reactive contexts:

```typescript
// Woby automatically tracks that this effect depends on 'count' and 'name'
useEffect(() => {
  console.log(`Count: ${$(count)}, Name: ${$(name)}`)
  // This effect will re-run whenever 'count' or 'name' changes
})
```

### 3. Observable Access Pattern
Always use `$()` to access observable values in reactive contexts:

```typescript
// ❌ Anti-pattern: Direct observable access
useEffect(() => {
  console.log(count) // This won't track 'count' as a dependency
})

// ✅ Woby pattern: Use $() for observable access
useEffect(() => {
  console.log($(count)) // This will properly track 'count' as a dependency
})
```

## Common Anti-Patterns to Avoid

### React Patterns That Don't Work in Woby

1. **Dependency Arrays**: Never add dependency arrays to useEffect or useMemo
2. **useState**: Use `$()` instead of React's useState
3. **useCallback**: Not needed in Woby due to automatic tracking
4. **Direct Observable Access**: Always use `$()` in reactive contexts

### Correct Woby Patterns

1. **Observable Declaration**: `const count = $(0)`
2. **Observable Update**: `count(1)` or `count(prev => prev + 1)`
3. **Observable Access**: `$(count)` in reactive contexts
4. **Effects**: `useEffect(() => { console.log($(count)) })` (no deps array)
5. **Memoization**: `const doubled = useMemo(() => $(count) * 2)` (no deps array)

## When Helping Developers

When developers mention "useEffect" or "useMemo", always remind them:
- No dependency arrays are needed or supported
- Dependencies are automatically tracked with `$()`
- The function will re-run when any accessed observable changes

Example response:
> "In Woby, useEffect doesn't require a dependency array like React. Dependencies are automatically tracked when you access observables with $(). Simply use: useEffect(() => { console.log($(count)) })"