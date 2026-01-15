import Effect from '~/objects/effect'
import type { DisposeFunction, EffectFunction, EffectOptions } from '~/types'
import { Stack } from './debugger'

/* IMPORT */

/* MAIN */

/**
 * Creates an effect that automatically tracks its dependencies.
 * 
 * Unlike React's useEffect, this function does NOT require a dependency array.
 * Dependencies are automatically tracked when accessed within the effect function
 * using the `$()` syntax.
 * 
 * @example
 * ```typescript
 * // ✅ Correct Woby/Soby pattern - no dependency array needed
 * useEffect(() => {
 *   console.log($(count)) // Automatically tracks 'count' as a dependency
 * })
 * 
 * // ❌ React pattern - DO NOT use dependency arrays in Woby/Soby
 * useEffect(() => {
 *   console.log($(count))
 * }, [count]) // This array will be ignored!
 * ```
 * 
 * @param fn - The effect function to run. Dependencies are automatically tracked
 *             when observables are accessed using `$()` within this function.
 * @param options - Optional effect options (NOT a dependencies array)
 * @returns A dispose function to clean up the effect
 * 
 * @see {@link memo} for creating memoized computed values
 * @see {@link $} for accessing observable values
 */
const effect = (fn: EffectFunction, options?: EffectOptions): DisposeFunction => {

  const effect = new Effect(fn, options)
  const dispose = (opts?: { stack?: Stack, env?: any }) => effect.dispose(true)

  return dispose

}

/* EXPORT */

export default effect