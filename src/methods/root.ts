
/* IMPORT */

import Root from '~/objects/root'
import type { WrappedDisposableFunction } from '~/types'
import { callStack } from './debugger'

/* MAIN */

const root = <T>(fn: WrappedDisposableFunction<T>): T => {
  const stack = callStack()
  return new Root(true).wrap(fn, undefined as any, undefined as any, stack)

}

/* EXPORT */

export default root
