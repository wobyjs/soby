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

      // Handle string literal types and constructor types
      if (typeof expectedType === 'string' || typeof expectedType === 'function') {
        // Use a more type-safe approach for checking types
        try {
          // Handle string types - both string literal and String constructor
          if (expectedType === 'string' || expectedType === String) {
            if (typeof value !== 'string') {
              throw new TypeError(`Expected value of type 'string', but received '${typeof value}'`)
            }
          }
          // Handle number types - both string literal and Number constructor
          else if (expectedType === 'number' || expectedType === Number) {
            if (typeof value !== 'number') {
              throw new TypeError(`Expected value of type 'number', but received '${typeof value}'`)
            }
          }
          // Handle boolean types - both string literal and Boolean constructor
          // Enhanced to support HTML boolean behavior
          else if (expectedType === 'boolean' || expectedType === Boolean) {
            // For boolean types, we allow boolean, string, or undefined values
            // and convert them using HTML boolean rules
            if (typeof value !== 'boolean' && typeof value !== 'string' && value !== undefined) {
              throw new TypeError(`Expected value of type 'boolean', 'string', or 'undefined' for boolean, but received '${typeof value}'`)
            }
          }
          // Handle function types - both string literal and Function constructor
          // For functions, we check if the value is an array and the first element is a function
          else if (expectedType === 'function' || expectedType === Function) {
            // Check if value is an array with a function as the first element (React-like convention)
            if (Array.isArray(value) && typeof value[0] === 'function') {
              // This is valid - function stored in array
            }
            // Also allow direct function values for backward compatibility
            else if (typeof value === 'function') {
              // This is valid - direct function
            }
            else {
              throw new TypeError(`Expected value of type 'function' (as [fn] array or direct function), but received '${typeof value}'`)
            }
          }
          // Handle object types - both string literal and Object constructor
          else if (expectedType === 'object' || expectedType === Object) {
            if (typeof value !== 'object' || value === null) {
              throw new TypeError(`Expected value of type 'object', but received '${typeof value}'`)
            }
          }
          // Handle symbol types - both string literal and Symbol constructor
          else if (expectedType === 'symbol' || expectedType === (Symbol as any)) {
            if (typeof value !== 'symbol') {
              throw new TypeError(`Expected value of type 'symbol', but received '${typeof value}'`)
            }
          }
          // Handle bigint types - both string literal and BigInt constructor
          else if (expectedType === 'bigint' || expectedType === (BigInt as any)) {
            if (typeof value !== 'bigint') {
              throw new TypeError(`Expected value of type 'bigint', but received '${typeof value}'`)
            }
          }
          // Handle undefined types - both string literal and custom handling
          else if (expectedType === 'undefined') {
            if (value !== undefined) {
              throw new TypeError(`Expected value of type 'undefined', but received '${typeof value}'`)
            }
          }
          // Handle custom constructor types (excluding built-in types)
          else if (typeof expectedType === 'function') {
            // Check if it's one of the built-in primitive types by name
            const constructorName = (expectedType as any).name

            // Only handle custom constructors that are not built-in types
            // We need to make sure we don't handle built-in constructors here
            // since they should have been handled above
            const isBuiltInConstructor =
              constructorName === 'String' ||
              constructorName === 'Number' ||
              constructorName === 'Boolean' ||
              constructorName === 'Function' ||
              constructorName === 'Object' ||
              constructorName === 'Symbol' ||
              constructorName === 'BigInt'

            if (constructorName && !isBuiltInConstructor) {
              // This should be a custom constructor
              if (!(value instanceof expectedType)) {
                throw new TypeError(`Expected value to be instance of '${constructorName}', but received '${typeof value}'`)
              }
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