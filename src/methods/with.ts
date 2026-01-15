
/* IMPORT */

import { OWNER } from '../objects/superroot'
import { OBSERVER } from '~/context'
import type { WithFunction, Env } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const _with = (): (<T> (fn: WithFunction<T>, options?: { stack?: Stack, env?: Env }) => T) => {

  const owner = OWNER
  const observer = OBSERVER

  return <T>(fn: WithFunction<T>, options?: { stack?: Stack, env?: Env }): T => {

    return owner.wrap(() => fn(options), owner, observer as any, options?.stack, options?.env)

  }

}

/* EXPORT */

export default _with
