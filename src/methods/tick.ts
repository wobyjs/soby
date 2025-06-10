
/* IMPORT */

import Scheduler from '~/objects/scheduler.async'

/* MAIN */

const tick = (stack?: Error): void => {

  Scheduler.flush(stack)

}

/* EXPORT */

export default tick
