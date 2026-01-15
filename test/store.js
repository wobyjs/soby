
/* IMPORT */

import { describe } from 'fava';
import { setTimeout as delay } from 'node:timers/promises';
import $ from '../dist/index.js';
import { SYMBOL_STORE_VALUES } from '../dist/symbols.js';
import { tick } from './helpers.js';

/* MAIN */

describe('store', it => {

  describe('mutable', () => {

    describe('base', () => {

      it('is both a getter and a setter, for shallow primitive properties', t => {

        const o = $.store({ value: undefined });

        t.is(o.value, undefined);

        o.value = 123;

        t.is(o.value, 123);

        o.value = 321;

        t.is(o.value, 321);

        o.value = undefined;

        t.is(o.value, undefined);

      });

      it('is both a getter and a setter, for shallow non-primitive properties', t => {

        const obj1 = { foo: 123 };
        const obj2 = [];

        const o = $.store({ value: obj1 });

        t.deepEqual(o.value, obj1);

        o.value = obj2;

        t.deepEqual(o.value, obj2);

        o.value = obj1;

        t.deepEqual(o.value, obj1);

      });

      it('is both a getter and a setter, for deep primitive properties', t => {

        const o = $.store({ deep: { value: undefined } });

        t.is(o.deep.value, undefined);

        o.deep.value = 123;

        t.is(o.deep.value, 123);

        o.deep.value = 321;

        t.is(o.deep.value, 321);

        o.deep.value = undefined;

        t.is(o.deep.value, undefined);

      });

      it('is both a getter and a setter, for deep non-primitive properties', t => {

        const obj1 = { foo: 123 };
        const obj2 = [];

        const o = $.store({ deep: { value: obj1 } });

        t.deepEqual(o.deep.value, obj1);

        o.deep.value = obj2;

        t.deepEqual(o.deep.value, obj2);

        o.deep.value = obj1;

        t.deepEqual(o.deep.value, obj1);

      });

      it('creates a dependency in a memo when getting a shallow property', t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        const memo = $.memo((stack) => {
          calls += 1;
          return o.value;
        });

        t.is(calls, 0);
        t.is(memo(), 1);
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        t.is(memo(), 2);
        t.is(calls, 2);

        o.value = 3;

        t.is(calls, 2);
        t.is(memo(), 3);
        t.is(calls, 3);

      });

      it('creates a dependency in an effect when getting a shallow property', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect((stack) => {
          calls += 1;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value = 3;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('creates a dependency in a memo when getting a deep property', t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        const memo = $.memo((stack) => {
          calls += 1;
          return o.deep.value;
        });

        t.is(calls, 0);
        t.is(memo(), 1);
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        t.is(memo(), 2);
        t.is(calls, 2);

        o.deep.value = 3;

        t.is(calls, 2);
        t.is(memo(), 3);
        t.is(calls, 3);

      });

      it('creates a dependency in an effect when getting a deep property', async t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        $.effect((stack) => {
          calls += 1;
          o.deep.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.deep.value = 3;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('creates a single dependency in an memo even if getting a shallow property multiple times', t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        const memo = $.memo((stack) => {
          calls += 1;
          o.value;
          o.value;
          o.value;
          return o.value;
        });

        t.is(calls, 0);
        t.is(memo(), 1);
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        t.is(memo(), 2);
        t.is(calls, 2);

        o.value = 3;

        t.is(calls, 2);
        t.is(memo(), 3);
        t.is(calls, 3);

      });

      it('creates a single dependency in an effect even if getting a shallow property multiple times', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect((stack) => {
          calls += 1;
          o.value;
          o.value;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value = 3;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('creates a single dependency in a memo even if getting a deep property multiple times', async t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        const memo = $.memo((stack) => {
          calls += 1;
          o.deep.value;
          o.deep.value;
          o.deep.value;
          return o.deep.value;
        });

        t.is(calls, 0);
        t.is(memo(), 1);
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        t.is(memo(), 2);
        t.is(calls, 2);

        o.deep.value = 3;

        t.is(calls, 2);
        t.is(memo(), 3);
        t.is(calls, 3);

      });

      it('creates a single dependency in an effect even if getting a deep property multiple times', async t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        $.effect((stack) => {
          calls += 1;
          o.deep.value;
          o.deep.value;
          o.deep.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.deep.value = 3;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('does not access a getter when setting without a setter', t => {

        t.plan(2);

        const o = $.store({
          get value() {
            calls += 1;
          }
        });

        let calls = 0;

        try {
          o.value = 0;
        } catch (error) {
          t.is(error instanceof Error, true);
        }

        t.is(calls, 0);

      });

      it('does not access a getter when performing an in property check', t => {

        const o = $.store({
          get value() {
            calls += 1;
          }
        });

        let calls = 0;

        t.is('value' in o, true);
        t.is(calls, 0);

      });

      it('does not create a dependency in a memo when creating', t => {

        let o;
        let calls = 0;

        const memo = $.memo(() => {
          calls += 1;
          o = $.store({ value: 1 });
        });

        t.is(calls, 0);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 1);

      });

      it('does not create a dependency in an effect when creating', async t => {

        let o;
        let calls = 0;

        $.effect(() => {
          calls += 1;
          o = $.store({ value: 1 });
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('does not create a dependency in a memo when setting a shallow property', t => {

        let o = $.store({ value: 0 });
        let calls = 0;

        const memo = $.memo(() => {
          calls += 1;
          o.value = 1;
        });

        t.is(calls, 0);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 1);

      });

      it('does not create a dependency in an effect when setting a shallow property', async t => {

        let o = $.store({ value: 0 });
        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value = 1;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('does not create a dependency in a memo when getting a parent property of the one being updated', t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        const memo = $.memo(() => {
          calls += 1;
          o.deep;
        });

        t.is(calls, 0);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.deep.value = 3;

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 1);

      });

      it('does not create a dependency in an effect when getting a parent property of the one being updated', async t => {

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.deep;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.deep.value = 2;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o.deep.value = 3;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('does create a dependency (on the parent) in a memo when setting a deep property', t => { //FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        const memo = $.memo(() => {
          calls += 1;
          o.deep.value = 2;
        });

        t.is(calls, 0);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.deep.value = 3;

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 1);

        o.deep = {};

        t.is(calls, 1);
        t.is(memo(), undefined);
        t.is(calls, 2);

      });

      it('does create a dependency (on the parent) in an effect when setting a deep property', async t => { //FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

        const o = $.store({ deep: { value: 1 } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.deep.value = 2;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.deep.value = 3;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o.deep = {};

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('preserves references to existing stores, without re-proxying them', t => {

        const obj = { foo: 123 };
        const o1 = $.store({ value: obj });
        const o2 = $.store({ value: obj });
        const o3 = $.store({ value: o1 });
        const o4 = $.store({ value: o2 });

        t.true(o1.value === o2.value);
        t.true(o2.value === o3.value.value);
        t.true(o3.value === o1);
        t.true(o3.value.value === o4.value.value);

      });

      it.skip('preserves references to existing stores, without triggering dependents', async t => {

        const inner = $.store({ foo: 1 });
        const outer = $.store({ value: inner });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          outer.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        outer.value = inner;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        outer.value = outer.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        outer.value = $.store.unwrap(inner);

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('properly forgets about getters and setters when deleting them', t => {

        let calls = 0;

        const o = $.store({
          get b() {
            calls += 1;
          },
          set b(value) {
            calls += 1;
          }
        });

        delete o.b;

        o.b;
        o.b = 3;

        t.is(calls, 0);

      });

      it('respects the get proxy trap invariant about non-writable non-configurable properties', t => {

        const object = Object.defineProperties({}, {
          nonConfigurable: {
            value: {},
            configurable: false,
            writable: true
          },
          nonWritable: {
            value: {},
            configurable: true,
            writable: false
          },
          nonConfigurableNonWritable: {
            value: {},
            configurable: false,
            writable: false
          }
        });

        const o = $.store(object);

        t.is($.isStore(o.nonConfigurable), true);
        t.is($.isStore(o.nonWritable), true);
        t.is($.isStore(o.nonConfigurableNonWritable), false);

      });

      it('returns a frozen object as is', t => {

        const frozen = Object.freeze({ user: { name: 'John' } });

        let o = $.store(frozen);

        t.is(Object.isFrozen(o), true);
        t.is($.isStore(o), false);

        t.is(Object.isFrozen(o.user), false);
        t.is($.isStore(o.user), false);

      });

      it('returns a deep frozen object as is', t => {

        const frozen = Object.freeze({ user: { name: 'John' } });

        let o = $.store({ deep: frozen });

        t.is(Object.isFrozen(o), false);
        t.is($.isStore(o), true);

        t.is(Object.isFrozen(o.deep), true);
        t.is($.isStore(o.deep), false);

      });

      it('returns primitive values as is', t => {

        const o = $.store(123);

        t.is(o, 123);

      });

      it('returns unproxied "__proto__", "prototype" and "constructor" properties', t => {

        const a = {};
        const b = {};
        const c = {};
        const sa = $.store({ prototype: a });
        const sb = $.store({ '__proto__': b });
        const sc = $.store({ constructor: c });

        t.false($.isStore(sa.__proto__));
        t.false($.isStore(sb.prototype));
        t.false($.isStore(sc.constructor));

      });

      it('returns unproxied "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf", properties', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.hasOwnProperty;
          o.isPrototypeOf;
          o.propertyIsEnumerable;
          o.toLocaleString;
          o.toSource;
          o.toString;
          o.valueOf;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.hasOwnProperty = 1;
        o.isPrototypeOf = 1;
        o.propertyIsEnumerable = 1;
        o.toLocaleString = 1;
        o.toSource = 1;
        o.toString = 1;
        o.valueOf = 1;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('returns the value being set', t => {

        const o = $.store({ value: undefined });

        t.is(o.value = 123, 123);

      });

      it('supports a custom equality function', t => {

        const equals = (next, prev) => (next % 10) === (prev % 10);
        const o = $.store({ value: 0 }, { equals });

        t.is(o.value, 0);

        o.value = 10;

        t.is(o.value, 0);

        o.value = 11;

        t.is(o.value, 11);

      });

      it('supports a false equality function', async t => {

        const o = $.store({ value: true }, { equals: false });

        let calls = 0;

        $.effect(() => {

          calls += 1;

          o.value;

        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = true;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports a custom equality function, when setting property descriptors', t => {

        const equals = (next, prev) => (next % 10) === (prev % 10);
        const o = $.store({ value: 0 }, { equals });

        t.is(o.value, 0);

        Object.defineProperty(o, 'value', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: 10
        });

        t.is(o.value, 0);

        Object.defineProperty(o, 'value', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: 11
        });

        t.is(o.value, 11);

      });

      it('supports a custom equality function, which is inherited also', t => {

        const equals = (next, prev) => (next % 10) === (prev % 10);
        const o = $.store({ nested: { value: 0 } }, { equals });

        t.is(o.nested.value, 0);

        o.nested.value = 10;

        t.is(o.nested.value, 0);

        o.nested.value = 11;

        t.is(o.nested.value, 11);

      });

      it('supports a custom equality function, which cannot be overridden', t => {

        const equals1 = (next, prev) => (next % 10) === (prev % 10);
        const equals2 = (next, prev) => next === 'a';
        const other = $.store({ value: 0 }, { equals: equals2 });
        const o = $.store({ value: 0, other }, { equals: equals1 });

        t.is(o.value, 0);

        o.value = 10;

        t.is(o.value, 0);

        o.value = 11;

        t.is(o.value, 11);

        o.value = 'a';

        t.is(o.value, 'a');

        // --------

        t.is(o.other.value, 0);

        o.other.value = 10;

        t.is(o.other.value, 10);

        o.other.value = 11;

        t.is(o.other.value, 11);

        o.other.value = 'a';

        t.is(o.other.value, 11);

        o.other.value = 'b'

        t.is(o.other.value, 'b');

      });

      it('supports setting functions as is', t => {

        const fn = () => { };
        const o = $.store({ value: () => { } });

        o.value = fn;

        t.is(o.value, fn);

      });

      it('supports wrapping a plain object', t => {

        const o = $.store({});

        t.true($.isStore(o));

      });

      it('supports wrapping a deep array inside a plain object', t => {

        const o = $.store({ value: [] });

        t.true($.isStore(o.value));

      });

      it('supports wrapping a deep plain object inside a plain object', t => {

        const o = $.store({ value: {} });

        t.true($.isStore(o.value));

      });

      it('supports wrapping an array', t => {

        const o = $.store([]);

        t.true($.isStore(o));

      });

      it('supports wrapping a deep array inside an array', t => {

        const o = $.store([[]]);

        t.true($.isStore(o[0]));

      });

      it('supports wrapping a deep plain object inside an array', t => {

        const o = $.store([{}]);

        t.true($.isStore(o[0]));

      });

      it('supports reacting to deleting a shallow property', async t => {

        const o = $.store({ value: 123 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports not reacting when deleting a shallow property that was undefined', async t => {

        const o = $.store({ value: undefined });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports reacting to deleting a deep property', async t => {

        const o = $.store({ deep: { value: 123 } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.deep.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.deep.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports not reacting when deleting a deep property that was undefined', async t => {

        const o = $.store({ deep: { value: undefined } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.deep.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.deep.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports not reacting when setting a primitive property to itself', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 1;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports not reacting when setting a non-primitive property to itself', async t => {

        const o = $.store({ deep: { value: 2 } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.deep.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.deep = o.deep;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports not reacting when setting a non-primitive property to itself, when reading all values', async t => {

        const o = $.store([0]);

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o[SYMBOL_STORE_VALUES];
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o[0] = o[0];

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports not reacting when reading the length on a array, when reading all values, if the length does not actually change', async t => {

        const o = $.store({ value: [0] });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value.length;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value.splice(0, 1, 1);

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports not reacting when reading the length on a non-array, when reading all values, if the length does not actually change', async t => { //TODO

        const o = $.store({ length: 0 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o[SYMBOL_STORE_VALUES];
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.length = o.length;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

      });

      it('supports reacting to own keys', async t => {

        const o = $.store({ foo: 1, bar: 2, baz: 3 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.qux = 4;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.foo = 2;
        o.bar = 3;
        o.baz = 4;
        o.qux = 5;

        t.is(calls, 2);
        await tick();
        t.is(calls, 2);

        delete o.foo;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('supports reacting to properties read by a getter, for plain objects', async t => {

        const o = $.store({ foo: 1, bar: 2, get fn() { return this.foo + this.bar; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn, 12);

        o.bar = 20;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);
        t.is(o.fn, 30);

      });

      it.skip('supports reacting to properties read by a getter, for a class', async t => {

        class Class {
          foo = 1;
          bar = 2;
          get fn() {
            return this.foo + this.bar;
          }
        }

        const o = $.store(new Class());

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn, 12);

        o.bar = 20;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);
        t.is(o.fn, 30);

      });

      it('supports reacting to properties read by a regular function', async t => {

        const o = $.store({ foo: 1, bar: 2, fn() { return this.foo + this.bar; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn();
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn(), 12);

        o.bar = 20;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);
        t.is(o.fn(), 30);

      });

      it('supports reacting to properties read by a regular function, called via the call method', async t => {

        const o = $.store({ foo: 1, bar: 2, fn() { return this.foo + this.bar; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn.call(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn.call(o), 12);

        o.bar = 20;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);
        t.is(o.fn.call(o), 30);

      });

      it('supports reacting to properties read by a regular function, called via the apply method', async t => {

        const o = $.store({ foo: 1, bar: 2, fn() { return this.foo + this.bar; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn.apply(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn.apply(o), 12);

        o.bar = 20;

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);
        t.is(o.fn.apply(o), 30);

      });

      it('supports reacting to changes in the length property of an array, when indirectly deleting values', async t => {

        const o = $.store([1, 2, 3]);

        let calls = '';

        $.effect(() => {
          o[0];
          calls += '0';
        });

        $.effect(() => {
          o[1];
          calls += '1';
        });

        $.effect(() => {
          o[2];
          calls += '2';
        });

        t.is(calls, '');
        await tick();
        t.is(calls, '012');
        t.is(o[0], 1);
        t.is(o[1], 2);
        t.is(o[2], 3);
        t.is(o.length, 3);

        o.length = 1;

        await tick();
        t.is(calls, '01212');
        t.is(o[0], 1);
        t.is(o[1], undefined);
        t.is(o[2], undefined);
        t.is(o.length, 1);

      });

      it('supports reacting to changes in the length property of an array, when indirectly deleting the presence of properties', async t => {

        const o = $.store([1, 2, 3]);

        let calls = '';

        $.effect(() => {
          '0' in o;
          calls += '0';
        });

        $.effect(() => {
          '1' in o;
          calls += '1';
        });

        $.effect(() => {
          '2' in o;
          calls += '2';
        });

        t.is(calls, '');
        await tick();
        t.is(calls, '012');
        t.is(0 in o, true);
        t.is(1 in o, true);
        t.is(2 in o, true);
        t.is(o.length, 3);

        o.length = 1;

        await tick();
        t.is(calls, '01212');
        t.is(0 in o, true);
        t.is(1 in o, false);
        t.is(2 in o, false);
        t.is(o.length, 1);

      });

      it('supports reacting to changes in the length property of an array, when indirectly deleting some keys', async t => {

        const o = $.store([1, 2, 3]);

        let calls = 0;

        $.effect(() => {
          Object.keys(o);
          calls += 1;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.length = 1;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports reacting to changes in the length property of an array, when it happens indiretly by inserting a new item', async t => {

        const o = $.store(['foo']);

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.join(' ');
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o[1] = 'bar';

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o[3] = 'baz';

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

      });

      it('supports batching implicitly', async t => {

        const o = $.store({ foo: 1, bar: 2 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo;
          o.bar;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 10;
        o.bar = 20;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.foo, 10);
        t.is(o.bar, 20);

      });

      it('supports batching setters automatically', async t => {

        const o = $.store({ foo: 1, bar: 2, set fn(increment) { this.foo += increment; this.bar += increment; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo;
          o.bar;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.fn = 1;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.foo, 2);
        t.is(o.bar, 3);

      });

      it('supports batching deletions automatically', async t => {

        const o = $.store({ foo: 1, bar: 2 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo;
          if ('foo' in o) { }
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.foo;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports batching additions automatically', async t => {

        const o = $.store({ bar: 2 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo;
          if ('foo' in o) { }
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.foo = 1;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports reacting to changes in deep arrays', async t => {

        const o = $.store({ value: [1, 2] });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value.length;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value.pop();

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value.pop();

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

        o.value.push(1);

        t.is(calls, 3);
        await tick();
        t.is(calls, 4);

      });

      it('supports reacting to changes in top-level arrays', async t => {

        const o = $.store([1, 2]);

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.length;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.pop();

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.pop();

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

        o.push(1);

        t.is(calls, 3);
        await tick();
        t.is(calls, 4);

      });

      it('supports reacting to changes at a specific index in deep arrays', async t => {

        const o = $.store({ value: [1, 2] });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value[0];
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value.pop();

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o.value.push(10);

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o.value[0] = 123;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value.unshift(1);

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

        o.value.unshift(1);

        t.is(calls, 3);
        await tick();
        t.is(calls, 3);

        o.value.unshift(2);

        t.is(calls, 3);
        await tick();
        t.is(calls, 4);

      });

      it('supports reacting to changes at a specific index in top-level arrays', async t => {

        const o = $.store([1, 2]);

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o[0];
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.pop();

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o.push(10);

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);

        o[0] = 123;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.unshift(1);

        t.is(calls, 2);
        await tick();
        t.is(calls, 3);

        o.unshift(1);

        t.is(calls, 3);
        await tick();
        t.is(calls, 3);

        o.unshift(2);

        t.is(calls, 3);
        await tick();
        t.is(calls, 4);

      });

      it('supports reacting to changes on custom classes', async t => {

        class Foo {
          constructor() {
            this.foo = 0;
            return $.store(this);
          }
        }

        class Bar extends Foo {
          constructor() {
            super();
            this.bar = 0;
            return $.store(this);
          }
        }

        const foo = new Foo();
        const bar = new Bar();

        let calls = '';

        $.effect(() => {
          foo.foo;
          calls += 'f';
        });

        $.effect(() => {
          bar.bar;
          calls += 'b';
        });

        t.is(calls, '');
        await tick();
        t.is(calls, 'fb');

        foo.foo += 1;

        t.is(calls, 'fb');
        await tick();
        t.is(calls, 'fbf');

        bar.bar += 1;

        t.is(calls, 'fbf');
        await tick();
        t.is(calls, 'fbfb');

      });

      it('supports batching array methods automatically', async t => {

        const o = $.store({ value: [1, 2, 3] });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value.forEach(() => { });
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value.forEach((value, index) => {
          o.value[index] = value * 2;
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports reacting to in property checks, deleting', async t => {

        const o = $.store({ value: undefined });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        delete o.value;

        t.is(calls, 2);
        await tick();
        t.is(calls, 2);

      });

      it('supports reacting to in property checks, adding', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = undefined;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value = undefined;

        t.is(calls, 2);
        await tick();
        t.is(calls, 2);

      });

      it.skip('supports reacting to hasOwnProperty property checks, deleting', async t => { // This is problematic to support, too many built-ins read descriptors, with no intention of tracking

        const o = $.store({ value: undefined });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if (o.hasOwnProperty('value')) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        delete o.value;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        delete o.value;

        t.is(calls, 2);
        await tick();
        t.is(calls, 2);

      });

      it.skip('supports reacting to hasOwnProperty property checks, adding', async t => { // This is problematic to support, too many built-ins read descriptors, with no intention of tracking

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if (o.hasOwnProperty('value')) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = undefined;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

        o.value = undefined;

        t.is(calls, 2);
        await tick();
        t.is(calls, 2);

      });

      it('survives reading a value inside a discarded root', async t => {

        const o = $.store({ value: 123 });

        let calls = 0;

        $.root((stack, dispose) => {

          o.value;

          $.root(() => {

            o.value;

          });

          dispose();

        });

        $.effect(() => {

          calls += 1;

          o.value;

        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        o.value = 321;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);

      });

      it('supports reacting to changes of keys caused by Object.defineProperty, adding enumerable property', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, undefined);

        Object.defineProperty(o, 'value', {
          enumerable: true,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.value, 123);

      });

      it('supports reacting to changes of keys caused by Object.defineProperty, deleting enumerable property', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 1);

        Object.defineProperty(o, 'value', {
          enumerable: false,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.value, 123);

      });

      it('supports not reacting to changes of keys caused by Object.defineProperty, overriding enumerable property', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 1);

        Object.defineProperty(o, 'value', {
          enumerable: true,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 123);

      });

      it('supports not reacting to changes of keys caused by Object.defineProperty, adding non-enumerable property', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          Object.keys(o);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, undefined);

        Object.defineProperty(o, 'value', {
          enumerable: false,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 123);

      });

      it('supports reacting to changes of in caused by Object.defineProperty, adding enumerable property', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, undefined);

        Object.defineProperty(o, 'value', {
          enumerable: true,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.value, 123);

      });

      it('supports not reacting to changes of in caused by Object.defineProperty, making the property non-enumerable', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 1);

        Object.defineProperty(o, 'value', {
          enumerable: false,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 123);

      });

      it('supports not reacting to changes of in caused by Object.defineProperty, overriding enumerable property', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 1);

        Object.defineProperty(o, 'value', {
          enumerable: true,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is(o.value, 123);

      });

      it('supports reacting to changes of in caused by Object.defineProperty, adding non-enumerable property', async t => {

        const o = $.store({});

        let calls = 0;

        $.effect(() => {
          calls += 1;
          if ('value' in o) { }
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.value, undefined);

        Object.defineProperty(o, 'value', {
          enumerable: false,
          value: 123
        });

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.value, 123);

      });

      it('supports reacting to changes in getters caused by Object.defineProperty, addition', async t => {

        const o = $.store({ foo: 1, bar: 2 });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.fn);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [undefined]);

        Object.defineProperty(o, 'fn', {
          get: function () {
            return this.foo + this.bar;
          }
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.deepEqual(args, [undefined, 3]);

      });

      it('supports reacting to changes in getters caused by Object.defineProperty, override with value', async t => {

        const o = $.store({ foo: 1, bar: 2, get fn() { return this.foo + this.bar; } });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.fn);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [3]);

        Object.defineProperty(o, 'fn', {
          value: 123
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.deepEqual(args, [3, 123]);

      });

      it('supports reacting to changes in getters caused by Object.defineProperty, override with new getter', async t => {

        const o = $.store({ foo: 1, bar: 2, get fn() { return this.foo + this.bar; } });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.fn);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [3]);

        Object.defineProperty(o, 'fn', {
          get: function () {
            return (this.foo + this.bar) * 10;
          }
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.deepEqual(args, [3, 30]);

      });

      it('supports not reacting to changes in getters caused by Object.defineProperty, override with same getter', async t => {

        const o = $.store({ foo: 1, bar: 2, get fn() { return this.foo + this.bar; } });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.fn);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [3]);

        Object.defineProperty(o, 'fn', {
          get: Object.getOwnPropertyDescriptor(o, 'fn').get
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [3]);

      });

      it('supports not reacting to changes for a provably equivalent property descriptors set by Object.defineProperty', async t => {

        const o = $.store({ foo: 1, bar: 2, get baz() { return 1; }, set baz(value) { } });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.foo);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [1]);

        Object.defineProperty(o, 'foo', Object.getOwnPropertyDescriptor(o, 'foo'));
        Object.defineProperty(o, 'bar', Object.getOwnPropertyDescriptor(o, 'bar'));
        Object.defineProperty(o, 'baz', Object.getOwnPropertyDescriptor(o, 'baz'));

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [1]);

      });

      it('supports reacting to changes in setters caused by Object.defineProperty, addition', async t => {

        const o = $.store({ foo: 1, bar: 2 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn = 3;
          o.fn;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o.fn, 3);
        t.is(o._fn, undefined);

        Object.defineProperty(o, 'fn', {
          set: function (value) {
            return this._fn = value * 10;
          }
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.fn, undefined);
        t.is(o._fn, 30);

      });

      it.skip('supports reacting to changes in setters caused by Object.defineProperty, override with new setter', async t => { //TODO: Maybe too expensive to support

        const o = $.store({ foo: 1, bar: 2, set fn(value) { this._fn = value; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn = 3;
          o.fn;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o._fn, 3);

        Object.defineProperty(o, 'fn', {
          set: function (value) {
            return this._fn = value * 10;
          }
        }
        );

        t.is(calls, 1);
        await tick();
        // t.is ( calls, 2 );
        // t.is ( o._fn, 30 );

      });

      it('supports not reacting to changes in setters caused by Object.defineProperty, override with same setter', async t => {

        const o = $.store({ foo: 1, bar: 2, set fn(value) { this._fn = value; } });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.fn = 3;
          o.fn;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is(o._fn, 3);

        Object.defineProperty(o, 'fn', {
          set: Object.getOwnPropertyDescriptor(o, 'fn').set
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is(o._fn, 3);

      });

      it('supports reacting to changes of value caused by Object.defineProperty', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.value);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [1]);

        Object.defineProperty(o, 'value', {
          value: 123
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.deepEqual(args, [1, 123]);

      });

      it('supports not reacting to changes of value caused by Object.defineProperty', async t => {

        const o = $.store({ value: 123 });

        let calls = 0;
        let args = [];

        $.effect(() => {
          calls += 1;
          args.push(o.value);
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [123]);

        Object.defineProperty(o, 'value', {
          value: 123
        }
        );

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.deepEqual(args, [123]);

      });

      it('treats number and string properties the same way', async t => {

        const o = $.store([0]);

        let callsNumber = 0;
        let callsString = 0;

        $.effect(() => {
          callsNumber += 1;
          o[0];
        });

        $.effect(() => {
          callsString += 1;
          o['0'];
        });

        t.is(callsNumber, 0);
        t.is(callsString, 0);
        await tick();
        t.is(callsNumber, 1);
        t.is(callsString, 1);

        o[0] = 1;

        t.is(callsNumber, 1);
        t.is(callsString, 1);
        await tick();
        t.is(callsNumber, 2);
        t.is(callsString, 2);

        o['0'] = 2;

        t.is(callsNumber, 2);
        t.is(callsString, 2);
        await tick();
        t.is(callsNumber, 3);
        t.is(callsString, 3);

      });

    });

    describe('on', () => {

      it('automatically batches listeners', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o.foo = 2;
        o.foo = 3;
        o.bar = 2;
        o.bar = 3;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

      });

      it('automatically waits for an async batch to resolve', async t => {

        const o = $.store({ foo: 1 });

        let calls = '';

        $.effect(() => {

          o.foo;

          calls += 'r';

        });

        $.store.on(o, () => {

          calls += 's';

        });

        await tick();

        t.is(calls, 'r');

        await $.batch(async () => {

          await delay(25);

          o.foo = 2;

          await delay(25);

          t.is(calls, 'r');

        });

        await tick();

        t.is(calls, 'rrs');

      });

      it('detects when a new property is added', async t => {

        const o = $.store({ foo: 1 });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o.bar = undefined;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

      });

      it('detects when a new property is added with Object.defineProperty', async t => {

        const o = $.store({ foo: 1 });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        Object.defineProperty(o, 'bar', {
          value: 1
        });

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

      });

      it('detects when a property is deleted', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        delete o.bar;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

      });

      it('detects when nothing changes when setting', async t => {

        const o = $.store({ foo: { value: 1 }, bar: { value: 1 } });

        let calls = 0;

        $.store.on([() => o.foo.value, o.bar], () => calls += 1);

        o.foo.value = 1;

        t.is(calls, 0);

        await tick();

        t.is(calls, 0);

      });

      it('returns a dispose function', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        const dispose = $.store.on([() => o.foo, o], () => calls += 1);

        dispose();

        o.foo = 2;
        o.bar = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 0);

      });

      it('supports listening to a single primitive', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        $.store.on(() => o.foo, () => calls += 1);

        o.foo = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.bar = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 1);

      });

      it('supports listening to multiple primitives', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        $.store.on([() => o.foo, () => o.bar], () => calls += 1);

        o.foo = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.bar = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to a single store, object', async t => {

        const o = $.store({ foo: 1, bar: 1 });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o.foo = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.bar = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to a single store, array', async t => {

        const o = $.store([1, 2]);

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o[2] = 3;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o[2] = 3;

        t.is(calls, 1);

        await tick();

        o.length = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to a single store, deep array', async t => {

        const o = $.store({ value: [1, 2] });

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o.value[2] = 3;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.value[2] = 3;

        t.is(calls, 1);

        await tick();

        t.is(calls, 1);

        o.length = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to multiple stores', async t => {

        const o = $.store({ foo: { value: 1 }, bar: { value: 1 } });

        let calls = 0;

        $.store.on([o.foo, o.bar], () => calls += 1);

        o.foo.value = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.bar.value = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to multiple primitives and stores', async t => {

        const o = $.store({ foo: { value: 1 }, bar: { value: 1 } });

        let calls = 0;

        $.store.on([() => o.foo.value, o.bar], () => calls += 1);

        o.foo.value = 2;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.bar.value = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports listening to a single store under multiple, fully pre-traversed, parents', async t => {

        const value = { value: 1 };
        const o = $.store({ foo: { deep1: value }, bar: { deep2: value } });

        let calls = '';

        o.foo.deep1.value;
        o.bar.deep2.value;

        $.store.on(o.foo, () => calls += '1');
        $.store.on(o.bar, () => calls += '2');

        o.foo.deep1.value = 2;

        t.is(calls, '');

        await tick();

        t.is(calls, '12');

        o.bar.deep2.value = 3;

        t.is(calls, '12');

        await tick();

        t.is(calls, '1212');

      });

      it('supports listening to a raw observable', async t => {

        const o = $(1);

        let calls = '';

        $.store.on(o, () => calls += 'a');
        $.store.on(() => o(), () => calls += 'b');

        t.is(calls, '');

        o(2);

        t.is(calls, '');

        await tick()

        t.is(calls, 'ab');

      });

      it.skip('supports listening to a single store under multiple, not fully pre-traversed, parents', async t => { //TODO: This seems unimplementable without traversing the entire structure ahead of time, which is expensive

        const value = { value: 1 };
        const o = $.store({ foo: { deep1: value }, bar: { deep2: value } });

        let calls = '';

        $.store.on(o.foo, () => calls += '1');
        $.store.on(o.bar, () => calls += '2');

        o.foo.deep1.value = 2;

        t.is(calls, '');

        await delay(50);

        t.is(calls, '12');

        o.bar.deep2.value = 3;

        t.is(calls, '12');

        await delay(50);

        t.is(calls, '1212');

      });

      it('supports not reacting when setting a primitive property to itself', async t => {

        const o = $.store({ value: 1 });

        let calls = 0;

        $.store.on(() => o.value, () => {
          calls += 1;
        });

        t.is(calls, 0);

        o.value = 1;

        await tick();

        t.is(calls, 0);

      });

      it('supports not reacting when setting a non-primitive property to itself', async t => {

        const o = $.store({ deep: { value: 2 } });

        let calls = 0;

        $.store.on(o, () => {
          calls += 1;
        });

        t.is(calls, 0);

        o.deep = o.deep;

        await tick();

        t.is(calls, 0);

      });

      it('supports circular references', async t => {

        const circular = {};

        circular.circular = circular;

        const o = $.store(circular);

        let calls = 0;

        $.store.on(o, () => calls += 1);

        o.circular.circular.circular.circular.circular.value = 1;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        o.circular.circular.circular.circular.circular.circular.circular.value = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

    });

    describe('onRoots', () => {

      it('can detect additions', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        $.store._onRoots(store, roots => {
          t.is(roots.length, 2);
          t.true(roots[0] === store.c);
          t.true(roots[1] === store.d);
        });

        store.c = { id: 'c' };
        store.d = { id: 'd' };

        await tick();

      });

      it('can detect deletions', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        const a = store.a;
        const b = store.b;

        $.store._onRoots(store, roots => {
          t.is(roots.length, 2);
          t.true(roots[0] === a);
          t.true(roots[1] === b);
        });

        delete store.a;
        delete store.b;

        await tick();

      });

      it('can detect mutations', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        $.store._onRoots(store, roots => {
          t.is(roots.length, 2);
          t.true(roots[0] === store.a);
          t.true(roots[1] === store.b);
        });

        store.a.value = 1;
        store.b.value = 1;

        await tick();

      });

      it('can detect defined properties', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        $.store._onRoots(store, roots => {
          t.is(roots.length, 1);
          t.true(roots[0] === store.c);
        });

        Object.defineProperty(store, 'c', {
          enumerable: true,
          configurable: true,
          value: {
            id: 'c'
          }
        });

        await tick();

      });

      it('can detect defined properties that overwrite', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        const a = store.a;

        $.store._onRoots(store, roots => {
          t.is(roots.length, 2);
          t.true(roots[0] === a);
          t.true(roots[1] === store.a);
        });

        Object.defineProperty(store, 'a', {
          enumerable: true,
          configurable: true,
          value: {
            id: 'c'
          }
        });

        await tick();

      });

      it('can deduplicate mutations', async t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        $.store._onRoots(store, roots => {
          t.is(roots.length, 2);
          t.true(roots[0] === store.a);
          t.true(roots[1] === store.b);
        });

        store.a.foo = 1;
        store.b.foo = 1;
        store.a.bar = 1;
        store.b.bar = 1;

        await tick();

      });

      it('supports circular references', async t => {

        const circular = {};

        circular.circular = circular;

        const store = $.store({ circular });

        let calls = 0;

        $.store._onRoots(store, roots => {
          calls += 1;
          t.is(roots.length, 1);
          t.true(roots[0] === store.circular);
        });

        store.circular.circular.circular.circular.circular.value = 1;

        t.is(calls, 0);

        await tick();

        t.is(calls, 1);

        store.circular.circular.circular.circular.circular.circular.circular.value = 2;

        t.is(calls, 1);

        await tick();

        t.is(calls, 2);

      });

      it('supports only top-level stores', t => {

        const store = $.store({ a: { id: 'a' }, b: { id: 'b' } });

        try {

          $.store._onRoots(store.a, () => { });

        } catch (error) {

          t.true(error instanceof Error);
          t.is(error.message, 'Only top-level stores are supported');

        }

      });

    });

    describe('reconcile', () => {

      it('reconciles a store with another', t => {

        const data = { foo: { deep: { value: 123, value2: true } }, arr1: ['a', 'b', 'c'], arr2: ['a', 'b'] };
        const dataNext = { foo: { deep: { value: 321, value3: 123 } }, arr1: ['d', 'e'], arr2: ['d', 'e', 'f'], value: true };

        const o = $.store(data);

        t.notDeepEqual(o, dataNext);

        $.store.reconcile(o, dataNext);

        t.deepEqual(o, dataNext);

      });

      it('can shrink the size of a top-level array', t => {

        const data = ['a', 'b', 'c'];
        const dataNext = ['a', 'b'];

        const o = $.store(data);

        t.notDeepEqual(o, dataNext);

        $.store.reconcile(o, dataNext);

        t.deepEqual(o, dataNext);

      });

      it('can grow the size of a top-level array', t => {

        const data = ['a', 'b'];
        const dataNext = ['a', 'b', 'c'];

        const o = $.store(data);

        t.notDeepEqual(o, dataNext);

        $.store.reconcile(o, dataNext);

        t.deepEqual(o, dataNext);

      });

    });

    describe('untrack', () => {

      it('does nothing for primitives', t => {

        const o = $.store({ foo: $.store.untrack(123) });

        t.is(o.foo, 123);

      });

      it('supports bailing out of tracking for an outer object', async t => {

        const o = $.store($.store.untrack({}));

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is($.isStore(o), false);

        o.value = 123;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is($.isStore(o), false);

      });

      it('supports bailing out of tracking for an inner object', async t => {

        const o = $.store({ foo: $.store.untrack({}) });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo.value;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);
        t.is($.isStore(o.foo), false);

        o.foo.value = 123;

        t.is(calls, 1);
        await tick();
        t.is(calls, 1);
        t.is($.isStore(o.foo), false);

      });

    });

    describe('unwrap', () => {

      it('supports unwrapping a plain object', t => {

        const wrapped = $.store({ value: [] });

        t.true($.isStore(wrapped));
        t.true($.isStore(wrapped.value));

        const unwrapped = $.store.unwrap(wrapped);

        t.false($.isStore(unwrapped));
        t.false($.isStore(unwrapped.value));

      });

      it('supports unwrapping an array', t => {

        const wrapped = $.store([{}]);

        t.true($.isStore(wrapped));
        t.true($.isStore(wrapped[0]));

        const unwrapped = $.store.unwrap(wrapped);

        t.false($.isStore(unwrapped));
        t.false($.isStore(unwrapped[0]));

      });

      it('supports wrapping, unwrapping, and re-wrapping without losing reactivity', async t => {

        const o = $.store({ foo: 1 });

        let calls = 0;

        $.effect(() => {
          calls += 1;
          o.foo;
        });

        t.is(calls, 0);
        await tick();
        t.is(calls, 1);

        const rewrapped = $.store($.store.unwrap(o));

        rewrapped.foo = 10;

        t.is(calls, 1);
        await tick();
        t.is(calls, 2);
        t.is(o.foo, 10);
        t.is(rewrapped.foo, 10);

      });

      it('supports unwrapping properly after setting a store into the other, directly', t => {

        const store1 = $.store({ foo: 1 });
        const store2 = $.store({ bar: 1 });

        store1.deep = store2;

        t.true($.isStore(store1.deep));
        t.false($.isStore($.store.unwrap(store1).deep));

      });

      it('supports unwrapping properly after setting a store into the other, with defineProperty', t => {

        const store1 = $.store({ foo: 1 });
        const store2 = $.store({ bar: 1 });

        Object.defineProperty(store1, 'deep', {
          enumerable: true,
          configurable: true,
          value: store2
        });

        t.true($.isStore(store1.deep));
        t.false($.isStore($.store.unwrap(store1).deep));

      });

    });

  });

});
