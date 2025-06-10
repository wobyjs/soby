
/* IMPORT */

import { DIRTY_MAYBE_YES, UNAVAILABLE, UNINITIALIZED } from '~/constants'
import { callStack } from '~/methods/debugger'
import Observable from '~/objects/observable'
import Observer from '~/objects/observer'
import type { IObservable, MemoFunction, MemoOptions } from '~/types'

/* MAIN */

class Memo<T = unknown> extends Observer {

  /* VARIABLES */

  fn: MemoFunction<T>
  observable: IObservable<T>
  sync?: boolean

  /* CONSTRUCTOR */

  constructor(fn: MemoFunction<T>, options?: MemoOptions<T>) {

    super()

    this.fn = fn
    this.observable = new Observable<T>(UNINITIALIZED, options, this)

    const { stack } = options ?? { stack: callStack('Stack should be initialized in options') }

    if (options?.sync === true) {

      this.sync = true

      this.update(stack)

    }

  }

  /* API */

  run(stack?: Error): void {

    const result = super.refresh(this.fn, stack)

    if (!this.disposed && this.observables.empty()) {

      this.disposed = true

    }

    if (result !== UNAVAILABLE) {

      this.observable.set(result, stack)

    }

  }

  stale(status: number, stack?: Error): void {

    const statusPrev = this.status

    if (statusPrev >= status) return

    this.status = status

    if (statusPrev === DIRTY_MAYBE_YES) return

    this.observable.stale(DIRTY_MAYBE_YES, stack)

  }

}

/* EXPORT */

export default Memo
