
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('get', it => {

  it('creates a dependency in a memo', t => {

    const o = $(1);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      return $.get(o);
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

  it('creates a dependency in an effect', async t => {

    const o = $(1);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      $.get(o);
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

  it('gets the value out of a function', t => {

    const o = () => 123;

    t.is($.get(o), 123);

  });

  it('gets the value out of an observable', t => {
    const o = $(123);

    t.is($.get(o), 123);

  });

  it('gets the value out of a non-function and non-observable', t => {

    t.is($.get(123), 123);

  });

  it('gets, optionally, the value out only of an observable', t => {

    const fn = () => 123;
    const o = $(123);

    t.is($.get(fn, false), fn);
    t.is($.get(o, false), 123);

  });

});
