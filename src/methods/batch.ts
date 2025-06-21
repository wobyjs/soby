
/* IMPORT */

import { setBatch } from '~/context'
import { noop } from '~/utils'
import type { BatchFunction, CallbackFunction } from '~/types'
import type { Stack } from './debugger'

/* HELPERS */

let counter: number = 0
let resolve: CallbackFunction = noop

/* MAIN */

const batch = async <T>(fn: BatchFunction<T>, stack?: Stack): Promise<Awaited<T>> => {

  if (!counter) {

    setBatch(new Promise<Stack | void>(r => resolve = r))

  }

  try {

    counter += 1

    return await fn()

  } finally {

    counter -= 1

    if (!counter) {

      setBatch(undefined)
      resolve(stack)

    }

  }

}

/* MAIN */

export default batch
