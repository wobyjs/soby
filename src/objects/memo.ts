
/* IMPORT */

import { DIRTY_MAYBE_YES, UNAVAILABLE, UNINITIALIZED } from '~/constants'
import Observable from '~/objects/observable'
import Observer from '~/objects/observer'
import type { IObservable, MemoFunction, MemoOptions } from '~/types'
import { callStack, Stack } from '~/methods/debugger'

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

    const { stack } = options ?? { stack: callStack('Memo init') }

    if (options?.sync === true) {

      this.sync = true

      this.update(stack)

    }

  }

  /* API */

  run(stack?: Stack): void {

    const result = super.refresh(this.fn, stack)

    if (!this.disposed && this.observables.empty()) {

      this.disposed = true

    }

    if (result !== UNAVAILABLE) {

      this.observable.set(result)

    }

  }

  stale(status: number, stack?: Stack): void {

    const statusPrev = this.status

    if (statusPrev >= status) return

    this.status = status

    if (statusPrev === DIRTY_MAYBE_YES) return

    this.observable.stale(DIRTY_MAYBE_YES, stack)

  }

}

/* EXPORT */

export default Memo
