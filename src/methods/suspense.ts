
/* IMPORT */

import boolean from '~/methods/boolean'
import effect from '~/methods/effect'
import get from '~/methods/get'
import Suspense from '~/objects/suspense'
import type { SuspenseFunction, FunctionMaybe } from '~/types'

/* MAIN */

const suspense = <T>(when: FunctionMaybe<unknown>, fn: SuspenseFunction<T>, stack?: Error): T => {

  const suspense = new Suspense()
  const condition = boolean(when)
  const toggle = () => suspense.toggle(get(condition))

  effect(toggle, { sync: true, stack: stack })

  return suspense.wrap(fn, undefined as any, undefined, stack)

}

/* EXPORT */

export default suspense
