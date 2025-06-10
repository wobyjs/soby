
/* IMPORT */

import isObservableWritable from '~/methods/is_observable_writable'
import target from '~/methods/target'
import { readable } from '~/objects/callable'
import type { Observable, ObservableReadonly } from '~/types'

/* MAIN */

const readonly = <T>(observable: Observable<T> | ObservableReadonly<T>, stack?: Error): ObservableReadonly<T> => {

  if (isObservableWritable(observable)) {

    return readable(target(observable), stack)

  } else {

    return observable

  }

}

/* EXPORT */

export default readonly
