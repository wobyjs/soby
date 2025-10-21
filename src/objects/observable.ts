
/* IMPORT */

import { DIRTY_MAYBE_NO, DIRTY_YES, UNINITIALIZED } from '~/constants'
import { OBSERVER } from '~/context'
import Scheduler from '~/objects/scheduler.sync'
import { is, nope } from '~/utils'
import type { IObserver, EqualsFunction, UpdateFunction, ObservableOptions } from '~/types'
import { callStack, Stack } from '~/methods/debugger'

/* MAIN */

class Observable<T = unknown> {

  /* VARIABLES */

  parent?: IObserver
  value: T
  equals?: EqualsFunction<T>
  observers: Set<IObserver> = new Set();
  //@ts-ignore
  stack?: Stack
  options?: ObservableOptions<T>

  /* CONSTRUCTOR */

  constructor(value: T, options?: ObservableOptions<T>, parent?: IObserver) {

    this.value = value
    this.options = options

    if (parent) {

      this.parent = parent

    }

    if (options?.equals !== undefined) {

      this.equals = options.equals || nope

    }

  }

  /* API */

  get(): T {

    if (!this.parent?.disposed) {

      this.parent?.update(this.stack)

      OBSERVER?.observables.link(this)

    }

    return this.value

  }

  set(value: T): T {

    // Type checking based on options.type
    if (this.options?.type !== undefined) {
      const expectedType = this.options.type

      // Handle string literal types
      if (typeof expectedType === 'string') {
        const actualType = typeof value
        // Special handling for null which has typeof 'object'
        if (expectedType === 'object' && value === null) {
          // This is valid
        }
        // Special handling for undefined values
        else if (actualType === 'undefined') {
          // This is valid
        }
        else if (actualType !== expectedType) {
          throw new TypeError(`Expected value of type '${expectedType}', but received '${actualType}'`)
        }
      }
      // Handle constructor types (built-in types like String, Number, Boolean, etc.)
      else if (typeof expectedType === 'function') {
        // Use a more type-safe approach for checking built-in constructors
        try {
          // Check if it's one of the built-in primitive types by name
          const constructorName = (expectedType as any).name

          if (constructorName === 'String' && typeof value !== 'string') {
            throw new TypeError(`Expected value of type 'string', but received '${typeof value}'`)
          } else if (constructorName === 'Number' && typeof value !== 'number') {
            throw new TypeError(`Expected value of type 'number', but received '${typeof value}'`)
          } else if (constructorName === 'Boolean' && typeof value !== 'boolean') {
            throw new TypeError(`Expected value of type 'boolean', but received '${typeof value}'`)
          } else if (constructorName === 'Function' && typeof value !== 'function') {
            throw new TypeError(`Expected value of type 'function', but received '${typeof value}'`)
          } else if (constructorName === 'Object' && (typeof value !== 'object' || value === null)) {
            throw new TypeError(`Expected value of type 'object', but received '${typeof value}'`)
          } else if (constructorName === 'Symbol' && typeof value !== 'symbol') {
            throw new TypeError(`Expected value of type 'symbol', but received '${typeof value}'`)
          } else if (constructorName === 'BigInt' && typeof value !== 'bigint') {
            throw new TypeError(`Expected value of type 'bigint', but received '${typeof value}'`)
          } else if (constructorName === 'Undefined' && value !== undefined) {
            throw new TypeError(`Expected value of type 'undefined', but received '${typeof value}'`)
          } else if (constructorName && constructorName !== 'String' && constructorName !== 'Number' &&
            constructorName !== 'Boolean' && constructorName !== 'Function' &&
            constructorName !== 'Object' && constructorName !== 'Symbol' &&
            constructorName !== 'BigInt' && constructorName !== 'Undefined') {
            // This should be a custom constructor
            if (!(value instanceof expectedType)) {
              throw new TypeError(`Expected value to be instance of '${constructorName}', but received '${typeof value}'`)
            }
          }
        } catch (e) {
          // Only catch non-TypeError exceptions to avoid swallowing intentional type errors
          if (!(e instanceof TypeError)) {
            // If there's any issue with the type checking, we skip it to avoid runtime errors
            // This is a safety measure for edge cases
          } else {
            // Re-throw TypeError exceptions as they are intentional
            throw e
          }
        }
      }
      // Handle generic T type - this is for TypeScript's compile-time type checking
      // At runtime, we can't validate generic types, so we skip validation
    }

    const equals = this.equals || is
    const fresh = (this.value === UNINITIALIZED) || !equals(value, this.value)

    if (!fresh) return value

    this.value = value

    this.stack = callStack()

    Scheduler.counter += 1

    this.stale(DIRTY_YES, this.stack)

    Scheduler.counter -= 1

    Scheduler.flush()

    return value

  }

  stale(status: number, stack?: Stack): void {

    for (const observer of this.observers) {

      if (observer.status !== DIRTY_MAYBE_NO || observer.observables.has(this)) { // Maybe this is a potential future dependency we haven't re-read yet

        if (observer.sync) {

          observer.status = Math.max(observer.status, status)

          Scheduler.schedule(observer, stack)

        } else {

          observer.stale(status, stack)

        }

      }

    }

  }

  update(fn: UpdateFunction<T>, stack?: Stack): T {

    const value = fn(this.value)

    return this.set(value)

  }

}

/* EXPORT */

export default Observable
