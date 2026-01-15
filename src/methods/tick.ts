
/* IMPORT */

import Scheduler from '~/objects/scheduler.async'
import type { Env } from '~/types'
import { Stack } from './debugger'

/* MAIN */

const tick = (options?: { stack?: Stack, env?: Env }): void => {

  Scheduler.flush(options?.stack)

}

/* EXPORT */

export default tick
