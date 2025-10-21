
/* IMPORT */

import { OWNER } from './superroot'
import { lazyArrayPush } from '~/lazy'
import Owner from '~/objects/owner'
import type { IOwner, ContextFunction, Contexts, IContext, IObserver, IRoot, ISuperRoot, ISuspense } from '~/types'
import { Stack } from '~/methods/debugger'

/* MAIN */

class Context extends Owner {

  /* VARIABLES */

  parent: IOwner = OWNER;
  context: Contexts

  /* CONSTRUCTOR */

  constructor(context: Contexts) {

    super()

    this.context = { ...OWNER.context, ...context }

    lazyArrayPush(this.parent, 'contexts', this)

  }

  /* API */

  wrap<T>(fn: ContextFunction<T>, owner: IContext | IObserver | IRoot | ISuperRoot | ISuspense, observer: IObserver | undefined, stack?: Stack): T {

    return super.wrap(fn, this, undefined, stack)

  }

}

/* EXPORT */

export default Context
