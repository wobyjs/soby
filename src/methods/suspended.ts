
/* IMPORT */

import { OBSERVABLE_FALSE } from '~/constants'
import { OWNER } from '../objects/superroot'
import { readable } from '~/objects/callable'
import Observable from '~/objects/observable'
import { SYMBOL_SUSPENSE } from '~/symbols'
import type { ISuspense, ObservableReadonly, Env } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const suspended = (options?: { stack?: Stack, env?: Env }): ObservableReadonly<boolean> => {

  const suspense: ISuspense | undefined = OWNER.get(SYMBOL_SUSPENSE)

  if (!suspense) return OBSERVABLE_FALSE

  const observable = (suspense.observable ||= new Observable(!!suspense.suspended))

  return readable(observable, options?.stack)

}

/* EXPORT */

export default suspended
