
/* IMPORT */

import { isFunction } from '~/utils'
import isObservable from './is_observable'
import type { Resolvable, Resolved } from '../types'

/* MAIN */

//TODO: This function is pretty ugly, maybe it can be written better?

export function deepResolve<T>(value: T, returnFunction?: boolean): T extends Resolvable ? Resolved<T> : never
export function deepResolve<T>(value: T, returnFunction: boolean = false): any { //TSC

  if (isFunction(value)) {

    // Unwrap observables
    if (isObservable(value)) {
      return deepResolve(value(), returnFunction)
    }

    // Plain function handling
    if (returnFunction) {
      return value  // Return function as-is when explicitly requested
    }

    // Call plain functions and resolve their result
    return deepResolve(value(), returnFunction)
  }

  if (value instanceof Array) {

    const resolved = new Array(value.length)

    for (let i = 0, l = resolved.length; i < l; i++) {

      resolved[i] = deepResolve(value[i], returnFunction)

    }

    return resolved
  } else {

    return value

  }

}

