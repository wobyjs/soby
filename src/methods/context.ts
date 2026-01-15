
/* IMPORT */

import { OWNER } from '../objects/superroot'
import Context from '~/objects/context'
import { isSymbol } from '~/utils'
import type { ContextFunction, Contexts } from '~/types'
import { callStack } from './debugger'

/* MAIN */

function context<T>(symbol: symbol): T | undefined
function context<T>(fn: ContextFunction<T>): T
function context<T>(context: Contexts, fn: ContextFunction<T>): T
function context<T>(symbolOrContext: symbol | Contexts | ContextFunction<T>, fn?: ContextFunction<T>) {

  if (isSymbol(symbolOrContext)) {
    return OWNER.context[symbolOrContext]

  } else {
    // Check if fn is undefined and the symbolOrContext is actually a function
    // This handles the case: $.context((stack) => ...)
    if (fn === undefined && typeof symbolOrContext === 'function') {
      const stack = callStack()
      return new Context({}).wrap((opts) => (symbolOrContext as ContextFunction<T>)(opts), undefined as any, undefined, stack)
    }

    const stack = callStack()
    return new Context(symbolOrContext as Contexts).wrap((opts) => fn!(opts), undefined as any, undefined, stack)
  }

}

/* EXPORT */

export default context
