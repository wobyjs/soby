
/* IMPORT */

import isObservableWritable from '~/methods/is_observable_writable'
import target from '~/methods/target'
import { readable } from '~/objects/callable'
import type { Observable, ObservableReadonly } from '~/types'
import type { Stack } from './debugger'

/* MAIN */

const readonly = <T>(observable: Observable<T> | ObservableReadonly<T>, stack?: Stack): ObservableReadonly<T> => {

  if (isObservableWritable(observable)) {

    return readable(target(observable), stack)

  } else {

    return observable

  }

}

/* EXPORT */

export default readonly
