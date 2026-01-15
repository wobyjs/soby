
/* IMPORT */

import { describe } from 'fava';
import { setTimeout as delay } from 'node:timers/promises';
import $ from '../dist/index.js';
import { tick } from './helpers.js';
/* MAIN */

describe('batch', it => {

  it('batches synchronous changes implicitly, for a memo', t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      return a() + b();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    a(10);
    b(100);

    t.is(calls, 1);
    t.is(memo(), 110);
    t.is(calls, 2);

  });

  it('batches synchronous changes implicitly, for an effect', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    a(10);
    b(100);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('batches asynchronous changes implicitly, for a memo', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      return a() + b();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    a(10);
    await tick();
    b(100);

    t.is(calls, 1);
    t.is(memo(), 110);
    t.is(calls, 2);

  });

  it('batches asynchronous changes manually, for a memo', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      return a() + b();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    await $.batch(async () => {

      a(10);
      await tick();
      b(100);

      t.is(calls, 1);
      t.is(memo(), 110);
      t.is(calls, 2);

    });

  });

  it('batches asynchronous changes manually, for an effect', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    await $.batch(async () => {
      a(10);
      await tick();
      b(100);
      t.is(calls, 1);
    });

    await tick();

    t.is(calls, 2);

  });

  it('does not batch synchronous changes implicitly, for a manually pulled memo', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      return a() + b();
    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    a(10);

    t.is(calls, 1);
    t.is(memo(), 11);
    t.is(calls, 2);

    b(100);

    t.is(calls, 2);
    t.is(memo(), 110);
    t.is(calls, 3);

  });

  it('does not batch synchronous changes implicitly, for a synchronous effect', t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    }, { sync: true });

    t.is(calls, 1);

    a(10);

    t.is(calls, 2);

    b(100);

    t.is(calls, 3);

  });

  it('does not batch synchronous changes implicitly, for a synchronous memo', t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.memo(() => {
      calls += 1;
      a();
      b();
    }, { sync: true });

    t.is(calls, 1);

    a(10);

    t.is(calls, 2);

    b(100);

    t.is(calls, 3);

  });

  it('does not batch synchronous changes manually, for a synchronous effect', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    }, { sync: true });

    t.is(calls, 1);

    await $.batch(() => {
      a(10);
      b(100);
      t.is(calls, 3);
    });

  });

  it('does not batch synchronous changes manually, for a synchronous memo', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.memo(() => {
      calls += 1;
      a();
      b();
    }, { sync: true });

    t.is(calls, 1);

    await $.batch(() => {
      a(10);
      b(100);
      t.is(calls, 3);
    });

  });

  it('does not batch asynchronous changes implicitly, for an effect', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    a(10);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    b(100);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('does not swallow thrown errors, for sync functions', async t => {

    try {

      await $.batch(() => {

        throw new Error('Something');

      });

    } catch (error) {

      t.true(error instanceof Error);
      t.is(error.message, 'Something');

    }

  });

  it('does not swallow thrown errors, for async functions', async t => {

    try {

      await $.batch(async () => {

        await tick();

        throw new Error('Something');

      });

    } catch (error) {

      t.true(error instanceof Error);
      t.is(error.message, 'Something');

    }

  });

  it('returns the value being returned, wrapped in a promise, for sync functions', async t => {

    const o = $(0);

    const result = $.batch(() => o());

    t.true(result instanceof Promise);
    t.is(await result, 0);

  });

  it('returns the value being returned, wrapped in a promise, for async functions', async t => {

    const o = $(0);

    const result = $.batch(async () => {
      await tick();
      return o();
    });

    t.true(result instanceof Promise);
    t.is(await result, 0);

  });

  it('supports being nested', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    await $.batch(async () => {
      a(10);
      await tick();
      await $.batch(async () => {
        b(100);
      });
      await tick();
      t.is(calls, 1);
    });

    await tick();

    t.is(calls, 2);

  });

  it('supports multiple concurrent batch calls', async t => {

    const a = $(0);
    const b = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      b();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    const b1 = $.batch(async () => {
      a(10);
      await delay(10);
    });

    const b2 = $.batch(async () => {
      b(100);
      await delay(50);
    });

    await Promise.all([b1, b2]);

    await tick();

    t.is(calls, 2);

  });

});
