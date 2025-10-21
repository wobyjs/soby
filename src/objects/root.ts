
/* IMPORT */

import { OWNER } from './superroot'
import { lazySetAdd, lazySetDelete } from '~/lazy'
import Owner from '~/objects/owner'
import { SYMBOL_SUSPENSE } from '~/symbols'
import type { IOwner, ISuspense, WrappedDisposableFunction, Contexts, IContext, IObserver, IRoot, ISuperRoot, WrappedFunction, DisposeFunction } from '~/types'
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

    const dispose: DisposeFunction = (disposeStack?: Stack) => this.dispose(true)

    // Create a wrapper that accepts the stack parameter from Owner.wrap and passes both stack and dispose to the original function
    const wrapper: WrappedFunction<T> = (callStack?: Stack) => fn(callStack, dispose)

    return super.wrap(wrapper, this, undefined, stack as any)

  }

}

/* EXPORT */

export default Root
