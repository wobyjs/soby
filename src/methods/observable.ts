
/* IMPORT */

import { writable } from '~/objects/callable'
import ObservableClass from '~/objects/observable'
import type { ObservableOptions, Observable } from '~/types'
import { callStack } from './debugger'

/* MAIN */

function observable<T>(): Observable<T | undefined>
function observable<T>(value: undefined, options?: ObservableOptions<T | undefined>): Observable<T | undefined>
function observable<T>(value: T, options?: ObservableOptions<T>): Observable<T>
function observable<T>(value?: T, options?: ObservableOptions<T | undefined>) {
  const stack = callStack()
  return writable(new ObservableClass(value, options), stack)

}

/* EXPORT */

export default observable
