
/* IMPORT */

import { isFunction } from '~/utils'
import type { Resolvable, Resolved } from '../types'

/* MAIN */

//TODO: This function is pretty ugly, maybe it can be written better?

export function deepResolve<T>(value: T): T extends Resolvable ? Resolved<T> : never
export function deepResolve<T>(value: T): any { //TSC

  if (isFunction(value)) {

    return deepResolve(value())

  }

  if (value instanceof Array) {

    const resolved = new Array(value.length)

    for (let i = 0, l = resolved.length; i < l; i++) {

      resolved[i] = deepResolve(value[i])

    }

    return resolved

  } else {

    return value

  }

}

