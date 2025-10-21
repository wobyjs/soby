
/* IMPORT */

import Owner from '~/objects/owner'
import type { Contexts, IContext, IObserver, IRoot, ISuperRoot, ISuspense } from '~/types'

/* MAIN */

class SuperRoot extends Owner {

  /* VARIABLES */

  parent: undefined
  context: Contexts = {};

}

//move here to fix circle deps
export let SUPER_OWNER: ISuperRoot = new SuperRoot()
export let OWNER: IContext | IObserver | IRoot | ISuperRoot | ISuspense = SUPER_OWNER
export const setOwner = (value: IContext | IObserver | IRoot | ISuperRoot | ISuspense) => OWNER = value

export default SuperRoot
