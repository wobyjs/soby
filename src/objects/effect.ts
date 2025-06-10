
/* IMPORT */

import { lazyArrayPush } from '~/lazy'
import Observer from '~/objects/observer'
import Scheduler from '~/objects/scheduler.async'
import { SYMBOL_SUSPENSE } from '~/symbols'
import { isFunction } from '~/utils'
import type { ISuspense, EffectFunction, EffectOptions } from '~/types'

/* MAIN */

class Effect extends Observer {

  /* VARIABLES */

  fn: EffectFunction
  suspense?: ISuspense
  init?: true
  sync?: true

  /* CONSTRUCTOR */

  constructor(fn: EffectFunction, options?: EffectOptions) {

    super()

    this.fn = fn

    if (options?.suspense !== false) {

      const suspense = this.get(SYMBOL_SUSPENSE)

      if (suspense) {

        this.suspense = suspense

      }

    }

    if (options?.sync === true) {

      this.sync = true

    }

    const { stack } = options ?? { stack: new Error('Stack should be initialized in options') }

    if (options?.sync === 'init') {

      this.init = true

      this.update(stack)

    } else {

      this.schedule(stack)

    }

  }

  /* API */

  run(stack?: Error): void {

    const result = super.refresh(this.fn, stack)

    if (isFunction(result)) {

      lazyArrayPush(this, 'cleanups', result)

    }

  }

  schedule(stack?: Error): void {

    if (this.suspense?.suspended) return

    if (this.sync) {

      this.update(stack)

    } else {

      Scheduler.schedule(this, stack)

    }

  }

  stale(status: number, stack?: Error): void {

    const statusPrev = this.status

    if (statusPrev >= status) return

    this.status = status

    if (!this.sync || (statusPrev !== 2 && statusPrev !== 3)) { // It isn't currently executing, so let's schedule it

      this.schedule(stack)

    }

  }

  update(stack?: Error): void {

    if (this.suspense?.suspended) return

    super.update(stack)

  }

}

/* EXPORT */

export default Effect
