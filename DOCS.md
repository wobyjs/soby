# Woby Effect System Documentation

## Key Difference from React

Woby's `useEffect` and `useMemo` work differently from React's equivalents. The most important difference is that **Woby does not require dependency arrays**.

### React vs Woby Patterns

```typescript
// ❌ React pattern - DO NOT use this in Woby
useEffect(() => {
  console.log(count)
}, [count])

// ✅ Woby pattern - No dependency array needed
useEffect(() => {
  console.log($(count))
})

// ❌ React pattern - DO NOT use this in Woby
const doubled = useMemo(() => count * 2, [count])

// ✅ Woby pattern - No dependency array needed
const doubled = useMemo(() => $(count) * 2)
```

## How Dependency Tracking Works

Woby automatically tracks dependencies when you access observables using `$()` within effect functions:

```typescript
// Woby automatically tracks that this effect depends on 'count' and 'name'
useEffect(() => {
  console.log(`Count: ${$(count)}, Name: ${$(name)}`)
  // This effect will re-run whenever 'count' or 'name' changes
})
```

## Effect Options

While dependency arrays are not needed, you can still pass options to effects:

```typescript
useEffect(() => {
  console.log($(count))
}, {
  // Woby effect options (not dependencies)
  once: true,
  sync: false
})
```

## Best Practices

1. **Always use `$()`** when accessing observable values in effects
2. **Never pass dependency arrays** - they are not supported and will be ignored
3. **Group related logic** in separate effects for better performance
4. **Use early returns** to skip unnecessary work when dependencies haven't changed meaningfully

## Common Anti-Patterns to Avoid

```typescript
// ❌ Don't use React-style dependency arrays
useEffect(() => {
  console.log($(count))
}, [count]) // This array will be ignored!

// ❌ Don't access observables outside of the effect function for tracking
const currentValue = $(count)
useEffect(() => {
  console.log(currentValue) // This won't track 'count' as a dependency
})

// ✅ Do access observables inside the effect function
useEffect(() => {
  console.log($(count)) // This will properly track 'count' as a dependency
})
```