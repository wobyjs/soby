
/* IMPORT */

import { OWNER } from '../objects/superroot'
import { OBSERVER } from '~/context'
import type { WithFunction } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const _with = (): (<T> (fn: WithFunction<T>, stack?: Stack) => T) => {

  const owner = OWNER
  const observer = OBSERVER

  return <T>(fn: WithFunction<T>, stack?: Stack): T => {

    return owner.wrap(() => fn(), owner, observer as any, stack)

  }


}

/* EXPORT */

export default _with
