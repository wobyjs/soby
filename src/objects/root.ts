
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
    // Create a wrapper function that reorders the parameters
    const fnWithDispose = (stack?: Stack) => {
      // We need to call fn with dispose as the first parameter and stack as the second
      // But fn's type signature says stack is first and dispose is second
      // This is a mismatch between the type definition and actual usage
      // We'll cast to any to bypass the type checking
      return (fn as any)(dispose, stack)
    }

    return super.wrap(fnWithDispose, this, undefined, stack as any)

  }

}

/* EXPORT */

export default Root
