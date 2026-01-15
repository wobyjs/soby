import isObservableFrozen from '~/methods/is_observable_frozen'
import isUntracked from '~/methods/is_untracked'
import { frozen, readable } from '~/objects/callable'
import Memo from '~/objects/memo'
import type { MemoFunction, MemoOptions, ObservableReadonly } from '~/types'
import { callStack } from './debugger'

/* IMPORT */

/* MAIN */

/**
 * Creates a memoized computed value that automatically tracks its dependencies.
 * 
 * Unlike React's useMemo, this function does NOT require a dependency array.
 * Dependencies are automatically tracked when accessed within the memo function
 * using the `$()` syntax.
 * 
 * @example
 * ```typescript
 * // ✅ Correct Woby/Soby pattern - no dependency array needed
 * const doubled = memo(() => {
 *   return $(count) * 2 // Automatically tracks 'count' as a dependency
 * })
 * 
 * // ❌ React pattern - DO NOT use dependency arrays in Woby/Soby
 * const doubled = memo(() => {
 *   return $(count) * 2
 * }, [count]) // This array will be ignored!
 * ```
 * 
 * @param fn - The function to compute the memoized value. Dependencies are automatically tracked
 *             when observables are accessed using `$()` within this function.
 * @param options - Optional memo options (NOT a dependencies array)
 * @returns An observable readonly value that updates when its dependencies change
 * 
 * @see {@link effect} for creating side effects
 * @see {@link $} for accessing observable values
 */
const memo = <T>(fn: MemoFunction<T>, options?: MemoOptions<T | undefined>): ObservableReadonly<T> => {
  const stack = options?.stack ?? callStack()
  const env = options?.env

  if (isObservableFrozen(fn)) {

    return fn as any

  } else if (isUntracked(fn)) {

    return frozen(fn({ stack, env }))

  } else {

    const memo = new Memo(fn, options)
    const observable = readable(memo.observable, stack)

    return observable

  }
}

/* EXPORT */

export default memo