
/* IMPORT */

import Scheduler from '~/objects/scheduler.async'
import { Stack } from './debugger'

/* MAIN */

const tick = (stack?: Stack): void => {

  Scheduler.flush(stack)

}

/* EXPORT */

export default tick
