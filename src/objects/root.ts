
/* IMPORT */

import { OWNER } from './superroot'
import { lazySetAdd, lazySetDelete } from '~/lazy'
import Owner from '~/objects/owner'
import { SYMBOL_SUSPENSE } from '~/symbols'
import type { IOwner, ISuspense, Contexts, IContext, IObserver, IRoot, ISuperRoot, WrappedFunction } from '~/types'
import type { Stack } from '~/methods/debugger'

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

  wrap<T>(fn: WrappedFunction<T>, _owner: IContext | IObserver | IRoot | ISuperRoot | ISuspense, _observer: IObserver | undefined, stack?: Stack): T {
    return super.wrap(fn, this, undefined, stack)
  }

  dispose(deep: boolean): void {

    if (this.registered) {

      lazySetDelete(this.parent, 'roots', this)

    }

    super.dispose(deep)

  }


}

/* EXPORT */

export default Root
