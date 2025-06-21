
/* IMPORT */

import Effect from '~/objects/effect'
import type { DisposeFunction, EffectFunction, EffectOptions } from '~/types'
import { Stack } from './debugger'

/* MAIN */

const effect = (fn: EffectFunction, options?: EffectOptions): DisposeFunction => {

  const effect = new Effect(fn, options)
  const dispose = (stack?: Stack) => effect.dispose(true)

  return dispose

}

/* EXPORT */

export default effect
