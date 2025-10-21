
/* OBJECTS */
import type { Stack } from '~/methods/debugger'

type IContext = import('~/objects/context').default

type IEffect = import('~/objects/effect').default

type IMemo<T = unknown> = import('~/objects/memo').default<T>

type IObservable<T = unknown> = import('~/objects/observable').default<T>

type IObserver = import('~/objects/observer').default

type IOwner = import('~/objects/owner').default

type IRoot = import('~/objects/root').default

type ISchedulerAsync = typeof import('~/objects/scheduler.async').default

type ISchedulerSync = typeof import('~/objects/scheduler.sync').default

type ISuperRoot = import('~/objects/superroot').default

type ISuspense = import('~/objects/suspense').default

/* FUNCTIONS */

type BatchFunction<T = unknown> = () => PromiseMaybe<T>

type CallbackFunction = (stack?: Stack) => void

type CleanupFunction = (stack?: Stack) => void

type ContextFunction<T = unknown> = (stack?: Stack) => T

type DisposeFunction = (stack?: Stack) => void

type EffectFunction = (stack?: Stack) => CleanupFunction | void

type ErrorFunction = (error: Error) => void

type EqualsFunction<T = unknown> = (value: T, valuePrev: T) => boolean

type MapFunction<T = unknown, R = unknown> = (value: T, index: FunctionMaybe<number>) => R

type MapValueFunction<T = unknown, R = unknown> = (value: Indexed<T>, index: FunctionMaybe<number>) => R

type MemoFunction<T = unknown> = (stack?: Stack) => T

type ObserverFunction<T = unknown> = (stack?: Stack) => T

type SelectorFunction<T = unknown> = (value: T) => ObservableReadonly<boolean>

type SuspenseFunction<T = unknown> = (stack?: Stack) => T

type TryCatchFunction<T = unknown> = ({ error, reset }: { error: Error, reset: DisposeFunction }) => T

type UntrackFunction<T = unknown> = () => T

type UntrackedFunction<Arguments extends unknown[], T = unknown> = (...args: Arguments) => T

type UpdateFunction<T = unknown> = (value: T) => T

type WithFunction<T = unknown> = (stack?: Stack) => T

type WrappedFunction<T = unknown> = (stack?: Stack) => T

type WrappedDisposableFunction<T = unknown> = (stack?: Stack, dispose?: DisposeFunction) => T

/* EFFECT */

type EffectOptions = {
  suspense?: boolean,
  sync?: boolean | 'init'
  stack?: Stack
}

/* FOR */

type ForOptions = {
  pooled?: boolean,
  unkeyed?: boolean
}

/* MEMO */

type MemoOptions<T = unknown> = {
  equals?: EqualsFunction<T> | false,
  sync?: boolean
  stack?: Stack
}

/* OBSERVABLE */

type Observable<T = unknown> = {
  (): T,
  (fn: (value: T) => T): T,
  (value: T): T,
  readonly [ObservableSymbol]: true
}

type ObservableLike<T = unknown> = {
  (): T,
  (fn: (value: T) => T): T,
  (value: T): T
}

type ObservableReadonly<T = unknown> = {
  (): T,
  readonly [ObservableSymbol]: true
}

type ObservableReadonlyLike<T = unknown> = {
  (): T
}

type ObservableOptions<T = unknown> = {
  equals?: EqualsFunction<T> | false,
  type?: 'string' | 'function' | 'object' | 'number' | 'boolean' | 'symbol' | 'undefined' | 'bigint' | Constructor<any> | T
  /** 
   * Function to convert the observable value to a string representation for HTML attributes.
   * This is useful when binding observables to DOM element attributes.
   */
  toHtml?: (t: T) => string
  /** 
   * Function to convert a string value from HTML attributes back to the observable's type.
   * This is useful when binding HTML attributes back to observables.
   */
  fromHtml?: (s: string) => T
}

declare const ObservableSymbol: unique symbol

/* OWNER */

type Owner = {
  isSuperRoot: boolean,
  isRoot: boolean,
  isSuspense: boolean,
  isComputation: boolean
}

/* STORE */

type StoreOptions = {
  equals?: EqualsFunction<unknown> | false
}

/* OTHERS */

type ArrayMaybe<T = unknown> = T | T[]

type Callable<T extends CallableFunction> = (T & { call: CallableFunctionCall<T> }) | ({ call: CallableFunctionCall<T>, apply?: never })

type CallableFunction = (...args: any[]) => any

type CallableFunctionCall<T extends CallableFunction> = (thiz: any, ...args: Parameters<T>) => ReturnType<T>

type Constructor<T = unknown, Arguments extends unknown[] = []> = { new(...args: Arguments): T }

type Contexts = Record<symbol, any>

type FunctionMaybe<T = unknown> = (() => T) | T

type Indexed<T = unknown> = T extends ObservableReadonly<infer U> ? ObservableReadonly<U> : ObservableReadonly<T>

type LazyArray<T = unknown> = T[] | T | undefined

type LazySet<T = unknown> = Set<T> | T | undefined

type LazyValue<T = unknown> = T | undefined

type PromiseMaybe<T = unknown> = T | Promise<T>

type ResolvablePrimitive = null | undefined | boolean | number | bigint | string | symbol
type ResolvableArray = Resolvable[]
type ResolvableObject = { [Key in string | number | symbol]?: Resolvable }
type ResolvableFunction = () => Resolvable
type Resolvable = ResolvablePrimitive | ResolvableObject | ResolvableArray | ResolvableFunction

type Resolved<T = unknown> = T

/* EXPORT */

export type { IContext, IEffect, IMemo, IObservable, IObserver, IOwner, IRoot, ISchedulerAsync, ISchedulerSync, ISuperRoot, ISuspense }
export type { BatchFunction, CallbackFunction, CleanupFunction, ContextFunction, DisposeFunction, EffectFunction, ErrorFunction, EqualsFunction, MapFunction, MapValueFunction, MemoFunction, ObserverFunction, SelectorFunction, SuspenseFunction, TryCatchFunction, UntrackFunction, UntrackedFunction, UpdateFunction, WithFunction, WrappedFunction, WrappedDisposableFunction }
export type { EffectOptions }
export type { ForOptions }
export type { MemoOptions }
export type { Observable, ObservableLike, ObservableReadonly, ObservableReadonlyLike, ObservableOptions }
export type { Owner }
export type { StoreOptions }
export type { ArrayMaybe, Callable, CallableFunction, Constructor, Contexts, FunctionMaybe, Indexed, LazyArray, LazySet, LazyValue, PromiseMaybe, Resolvable, Resolved }
