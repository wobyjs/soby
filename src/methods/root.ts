
/* IMPORT */

import Root from '~/objects/root'
import type { WrappedDisposableFunction } from '~/types'
import { callStack } from './debugger'

/* MAIN */

const root = <T>(fn: WrappedDisposableFunction<T>): T => {
  const stack = callStack()
  const rootInstance = new Root(true)
  const dispose = () => rootInstance.dispose(true)
  const wrapper = () => fn(dispose)
  return rootInstance.wrap(wrapper, rootInstance, undefined as any, stack)
}

/* EXPORT */

export default root
