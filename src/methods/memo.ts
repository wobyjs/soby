
/* IMPORT */

import isObservableFrozen from '~/methods/is_observable_frozen'
import isUntracked from '~/methods/is_untracked'
import { frozen, readable } from '~/objects/callable'
import Memo from '~/objects/memo'
import type { MemoFunction, MemoOptions, ObservableReadonly } from '~/types'
import { callStack } from './debugger'

/* MAIN */

const memo = <T>(fn: MemoFunction<T>, options?: MemoOptions<T | undefined>): ObservableReadonly<T> => {
  const stack = options?.stack ?? callStack()

  if (isObservableFrozen(fn)) {

    return fn as any

  } else if (isUntracked(fn)) {

    return frozen(fn(stack))

  } else {

    const memo = new Memo(fn, options)
    const observable = readable(memo.observable, stack)

    return observable

  }

}

/* EXPORT */

export default memo
