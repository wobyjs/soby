
/* IMPORT */

import isObservableWritable from '~/methods/is_observable_writable'
import target from '~/methods/target'
import { readable } from '~/objects/callable'
import type { Observable, ObservableReadonly, Env } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const readonly = <T>(observable: Observable<T> | ObservableReadonly<T>, options?: { stack?: Stack, env?: Env }): ObservableReadonly<T> => {

  if (isObservableWritable(observable)) {

    return readable(target(observable), options?.stack)

  } else {

    return observable

  }

}

/* EXPORT */

export default readonly
