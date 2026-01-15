
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('$', it => {

  it('is both a getter and a setter', t => {

    const o = $();

    t.is(o(), undefined);

    o(123);

    t.is(o(), 123);

    o(321);

    t.is(o(), 321);

    o(undefined);

    t.is(o(), undefined);

  });

  it('creates a dependency in a memo when getting', t => {

    const o = $(1);

    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      return o();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    t.is(memo(), 2);
    t.is(calls, 2);

    o(3);

    t.is(calls, 2);
    t.is(memo(), 3);
    t.is(calls, 3);

  });

  it('creates a dependency in an effect when getting', async t => {

    const o = $(1);

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    o(3);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('creates a single dependency in a memo even if getting multiple times', t => {

    const o = $(1);

    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      o();
      o();
      o();
      return o();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    t.is(memo(), 2);
    t.is(calls, 2);

    o(3);

    t.is(calls, 2);
    t.is(memo(), 3);
    t.is(calls, 3);

  });

  it('creates a single dependency in an effect even if getting multiple times', async t => {

    const o = $(1);

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o();
      o();
      o();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    o(3);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('does not create a dependency in a memo when instantiating', t => {

    let o;
    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      o = $(1);
    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 1);

  });

  it('does not create a dependency in an effect when instantiating', async t => {

    let o;
    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o = $(1);
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(2);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('does not create a dependency in a memo when setting', t => {

    let o = $(1);
    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      o(2);
    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    o(5);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 1);

  });

  it('does not create a dependency in an effect when setting', async t => {

    let o = $(1);
    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o(2);
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(5);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('does not create a dependency in a memo when setting with a function', t => {

    const o = $(1);

    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      o(prev => prev + 1);
      o(prev => prev + 1);
      o(prev => prev + 1);
    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    o(5);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 1);

  });

  it('does not create a dependency in an effect when setting with a function', async t => {

    const o = $(1);

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o(prev => prev + 1);
      o(prev => prev + 1);
      o(prev => prev + 1);
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(5);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('does not emit when the setter does not change the value', t => {

    const o = $(1);

    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      return o();
    });

    const filteredValues = [0, -0, Infinity, NaN, 'foo', true, false, {}, [], Promise.resolve(), new Map(), new Set(), null, undefined, () => { }, Symbol()];

    for (const [index, value] of filteredValues.entries()) {

      const callsExpectedBefore = index;
      const callsExpectedAfter = index + 1;

      t.is(calls, callsExpectedBefore);

      o(() => value);

      t.is(calls, callsExpectedBefore);
      t.is(memo(), value);
      t.is(calls, callsExpectedAfter);

      o(() => value);

      t.is(calls, callsExpectedAfter);
      t.is(memo(), value);
      t.is(calls, callsExpectedAfter);

    }

  });

  it('returns the value being set', t => {

    const o = $();

    t.is(o(123), 123);

  });

  it('returns the value being set even if equal to the previous value', t => {

    const equals = () => true;

    const o = $(0, { equals });

    t.is(o(), 0);
    t.is(o(123), 123)
    t.is(o(), 0);

  });

  it('supports an initial value', t => {

    const o = $(123);

    t.is(o(), 123);

  });

  it('supports a custom equality function', t => {

    const equals = (next, prev) => next[0] === prev[0];

    const valuePrev = [1];
    const valueNext = [2];

    const o = $(valuePrev, { equals });

    o(valuePrev);

    t.is(o(), valuePrev);

    o([1]);

    t.is(o(), valuePrev);

    o(valueNext);

    t.is(o(), valueNext);

    o([2]);

    t.is(o(), valueNext);

  });

  it('supports a false equality function', async t => {

    const equals = false;

    const o = $({ foo: true }, { equals });

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(o());

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    o(value => ({ ...value }));

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('supports updating with a new primitive value', t => {

    const o = $(1);

    t.is(o(prev => prev + 1), 2);
    t.is(o(), 2);

  });

  it('supports updating with a new object value', t => {

    const valuePrev = [];
    const valueNext = [];

    const o = $(valuePrev);

    t.is(o(() => valueNext), valueNext);
    t.is(o(), valueNext);

  });

  it('throws TypeError when setting value with incorrect type using string type option', t => {

    const o = $('initial value', { type: 'string' });

    // This should work fine
    t.is(o('new value'), 'new value');

    // This should throw a TypeError
    t.throws(() => o(123), { message: "Expected value of type 'string', but received 'number'" });

  });

  it('throws TypeError when setting value with incorrect type using constructor type option', t => {

    const o = $(0, { type: Number });

    // This should work fine
    t.is(o(123), 123);

    // This should throw a TypeError
    t.throws(() => o('123'), { message: "Expected value of type 'number', but received 'string'" });

  });

  it('works correctly with correct type values', t => {

    // Test with string type
    const stringObservable = $('initial', { type: 'string' });
    t.is(stringObservable('updated'), 'updated');

    // Test with number type
    const numberObservable = $(0, { type: 'number' });
    t.is(numberObservable(42), 42);

    // Test with boolean type
    const booleanObservable = $(false, { type: 'boolean' });
    t.is(booleanObservable(true), true);

    // Test with object type
    const objectObservable = $({}, { type: 'object' });
    t.deepEqual(objectObservable({ foo: 'bar' }), { foo: 'bar' });

    // Test with null (which is of type 'object' but rejected by implementation)
    t.throws(() => objectObservable(null), { message: "Expected value of type 'object', but received 'object'" });

  });

  it('works correctly with function type', t => {

    const func = () => 'test';
    const funcObservable = $(func, { type: 'function' });

    // This should work fine - to set a function value, wrap it in another function
    t.is(funcObservable(() => func), func);

    // Test with a different function
    const anotherFunc = () => 'another';
    t.is(funcObservable(() => anotherFunc), anotherFunc);

    // This should throw a TypeError
    t.throws(() => funcObservable('not a function'), { message: "Expected value of type 'function' (as [fn] array or direct function), but received 'string'" });

  });

  it('works correctly with symbol type', t => {

    const sym = Symbol('test');
    const symbolObservable = $(sym, { type: 'symbol' });

    // This should work fine
    t.is(symbolObservable(sym), sym);

    // Test with a different symbol
    const anotherSym = Symbol('another');
    t.is(symbolObservable(anotherSym), anotherSym);

    // This should throw a TypeError
    t.throws(() => symbolObservable('not a symbol'), { message: "Expected value of type 'symbol', but received 'string'" });

  });

  it('works correctly with custom class constructor type', t => {

    class TestClass {
      constructor(value) {
        this.value = value;
      }
    }

    const instance = new TestClass('test');
    const classObservable = $(instance, { type: TestClass });

    // This should work fine
    t.is(classObservable(instance).value, 'test');

    // Test with a different instance
    const anotherInstance = new TestClass('another');
    t.is(classObservable(anotherInstance).value, 'another');

    // This should throw a TypeError
    t.throws(() => classObservable({ value: 'not an instance' }), { message: "Expected value to be instance of 'TestClass', but received 'object'" });

  });

  it('works correctly with built-in constructor types', t => {

    // Test with Array constructor
    const arrayObservable = $([], { type: Array });
    t.deepEqual(arrayObservable([1, 2, 3]), [1, 2, 3]);

    // Test with Object constructor
    const objectObservable = $({}, { type: Object });
    t.deepEqual(objectObservable({ foo: 'bar' }), { foo: 'bar' });

  });

  it('works correctly with undefined type', t => {

    const undefinedObservable = $(undefined, { type: 'undefined' });

    // This should work fine
    t.is(undefinedObservable(undefined), undefined);

    // This should throw a TypeError
    t.throws(() => undefinedObservable(null), { message: "Expected value of type 'undefined', but received 'object'" });

  });

});
