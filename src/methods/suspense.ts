
/* IMPORT */

import boolean from '~/methods/boolean'
import effect from '~/methods/effect'
import get from '~/methods/get'
import Suspense from '~/objects/suspense'
import type { SuspenseFunction, FunctionMaybe, Env } from '~/types'
import { Stack } from './debugger'

/* MAIN */

const suspense = <T>(when: FunctionMaybe<unknown>, fn: SuspenseFunction<T>, options?: { stack?: Stack, env?: Env }): T => {

  const suspense = new Suspense()
  const condition = boolean(when)
  const toggle = () => suspense.toggle(get(condition))

  effect(toggle, { sync: true, env: options?.env ?? 'browser', stack: options?.stack })

  return suspense.wrap(fn, undefined as any, undefined, options?.stack)

}

/* EXPORT */

export default suspense
