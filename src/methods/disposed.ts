/* IMPORT */

import cleanup from '~/methods/cleanup'
import { readable } from '~/objects/callable'
import Observable from '~/objects/observable'
import type { ObservableReadonly, Env } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const disposed = (options?: { stack?: Stack, env?: Env }): ObservableReadonly<boolean> => {

  const observable = new Observable(false)
  const toggle = () => observable.set(true)

  // Register the cleanup in the current context
  // This ensures that when the context is disposed/re-run, the observable is updated
  cleanup(toggle)

  // Don't pass stack to readable as it changes the observable behavior
  return readable(observable, undefined)

}

/* EXPORT */

export default disposed