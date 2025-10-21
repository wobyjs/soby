
/* IMPORT */

import type { IObserver } from '~/types'
import { Stack } from '~/methods/debugger'

/* MAIN - READ */

// This module relies on live-binding of exported variables to avoid a bunch of property accesses

let BATCH: Promise<Stack | void> | undefined
let OBSERVER: IObserver | undefined

/* MAIN - WRITE */

// Unfortunately live-bounded exports can't just be overridden, so we need these functions

const setBatch = (value: Promise<Stack | void> | undefined) => BATCH = value
const setObserver = (value: IObserver | undefined) => OBSERVER = value

/* EXPORT */

export { BATCH, OBSERVER/* , OWNER, SUPER_OWNER */ }
export { setBatch, setObserver/* , setOwner */ }
