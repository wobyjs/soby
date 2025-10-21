
/* IMPORT */

import { SYMBOL_OBSERVABLE, SYMBOL_OBSERVABLE_FROZEN, SYMBOL_OBSERVABLE_READABLE, SYMBOL_OBSERVABLE_WRITABLE } from '~/symbols'
import { isFunction } from '~/utils'
import type { IObservable, UpdateFunction, Observable, ObservableReadonly } from '~/types'
import type { Stack } from '~/methods/debugger'
import { deepResolve } from '~/methods/deep_resolve'

/* MAIN - FUNCTIONS */

function frozenFunction<T>(this: T): T {
  if (arguments.length) {
    throw new Error('A readonly Observable can not be updated')
  } else {
    return this
  }
}

function readableFunction<T>(this: IObservable<T>): T {
  if (arguments.length) {
    throw new Error('A readonly Observable can not be updated')
  } else {
    return this.get()
  }
}

function writableFunction<T>(this: IObservable<T>, fn: UpdateFunction<T> | T): T {
  if (arguments.length) {
    if (isFunction(fn)) {
      return this.update(fn)
    } else {
      return this.set(fn!) //TSC
    }
  } else {
    return this.get()
  }
}

/* MAIN - GENERATORS */

const frozen = <T>(value: T): ObservableReadonly<T> => {
  // value.stack = stack
  const fn = frozenFunction.bind(value) as ObservableReadonly<T> //TSC
  fn[SYMBOL_OBSERVABLE] = true
  fn[SYMBOL_OBSERVABLE_FROZEN] = true
  return fn
}

const readable = <T>(value: IObservable<T>, stack?: Stack): ObservableReadonly<T> => {
  //TODO: Make a frozen one instead if disposed
  value.stack = stack
  const fn = readableFunction.bind(value as any) as ObservableReadonly<T> //TSC
  fn.valueOf = () => deepResolve(fn)
  fn.toString = () => fn.valueOf().toString()
  fn[SYMBOL_OBSERVABLE] = true
  fn[SYMBOL_OBSERVABLE_READABLE] = value
  return fn
}

/**
 * Creates a writable observable function with enhanced type information.
 * The returned function can be used as both a getter and setter for the observable value.
 * 
 * @param value - The observable instance to wrap
 * @param stack - Optional debugging stack trace
 * @returns A function that acts as both getter and setter with proper type annotations
 */
const writable = <T>(value: IObservable<T>, stack?: Stack): Observable<T> & { [SYMBOL_OBSERVABLE]: true, [SYMBOL_OBSERVABLE_WRITABLE]: IObservable<T> } => {
  value.stack = stack
  const fn = writableFunction.bind(value as any) as ObservableReadonly<T> //TSC
  fn.valueOf = () => deepResolve(fn)
  fn.toString = () => fn.valueOf().toString()
  fn[SYMBOL_OBSERVABLE] = true
  fn[SYMBOL_OBSERVABLE_WRITABLE] = value
  return fn as any
}

/* EXPORT */



export { frozen, readable, writable }
