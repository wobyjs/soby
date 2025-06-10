
/* IMPORT */

import { DIRTY_MAYBE_NO, DIRTY_YES, UNINITIALIZED } from '~/constants'
import { OBSERVER } from '~/context'
import Scheduler from '~/objects/scheduler.sync'
import { is, nope } from '~/utils'
import type { IObserver, EqualsFunction, UpdateFunction, ObservableOptions } from '~/types'
import { callStack } from '~/methods/debugger'

/* MAIN */

class Observable<T = unknown> {

  /* VARIABLES */

  parent?: IObserver
  value: T
  equals?: EqualsFunction<T>
  observers: Set<IObserver> = new Set();
  //@ts-ignore
  stack?: Error

  /* CONSTRUCTOR */

  constructor(value: T, options?: ObservableOptions<T>, parent?: IObserver) {

    this.value = value

    if (parent) {

      this.parent = parent

    }

    if (options?.equals !== undefined) {

      this.equals = options.equals || nope

    }

  }

  /* API */

  get(stack?: Error): T {

    if (!this.parent?.disposed) {

      this.parent?.update(stack)

      OBSERVER?.observables.link(this)

    }

    return this.value

  }

  set(value: T, stack?: Error): T {

    const equals = this.equals || is
    const fresh = (this.value === UNINITIALIZED) || !equals(value, this.value)

    if (!fresh) return value

    this.value = value

    this.stack = callStack()

    Scheduler.counter += 1

    this.stale(DIRTY_YES, this.stack)

    Scheduler.counter -= 1

    Scheduler.flush()

    return value

  }

  stale(status: number, stack?: Error): void {

    for (const observer of this.observers) {

      if (observer.status !== DIRTY_MAYBE_NO || observer.observables.has(this)) { // Maybe this is a potential future dependency we haven't re-read yet

        if (observer.sync) {

          observer.status = Math.max(observer.status, status)

          Scheduler.schedule(observer, stack)

        } else {

          observer.stale(status, stack)

        }

      }

    }

  }

  update(fn: UpdateFunction<T>, stack?: Error): T {

    const value = fn(this.value)

    return this.set(value, stack)

  }

}

/* EXPORT */

export default Observable
