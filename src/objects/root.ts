
/* IMPORT */

import { OWNER } from '~/context'
import { lazySetAdd, lazySetDelete } from '~/lazy'
import Owner from '~/objects/owner'
import { SYMBOL_SUSPENSE } from '~/symbols'
import type { IOwner, ISuspense, WrappedDisposableFunction, Contexts, IContext, IObserver, IRoot, ISuperRoot } from '~/types'
import { Stack } from '~/methods/debugger'

/* MAIN */

class Root extends Owner {

  /* VARIABLES */

  parent: IOwner = OWNER;
  context: Contexts = OWNER.context;
  registered?: true

  /* CONSTRUCTOR */

  constructor(register: boolean) {

    super()

    if (register) {

      const suspense: ISuspense | undefined = this.get(SYMBOL_SUSPENSE)

      if (suspense) {

        this.registered = true

        lazySetAdd(this.parent, 'roots', this)

      }

    }

  }

  /* API */

  dispose(deep: boolean): void {

    if (this.registered) {

      lazySetDelete(this.parent, 'roots', this)

    }

    super.dispose(deep)

  }

  wrap<T>(fn: WrappedDisposableFunction<T>, owner: IContext | IObserver | IRoot | ISuperRoot | ISuspense, observer: IObserver, stack?: Stack): T {

    const dispose = () => this.dispose(true)

    // Call fn with the correct parameter order: stack first, then dispose
    return super.wrap(() => fn(stack, dispose), this, undefined, stack as any)

  }

}

/* EXPORT */

export default Root
