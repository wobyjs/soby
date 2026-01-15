
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isFrozen, isReadable, call, } from './helpers.js';

/* MAIN */

describe('memo', it => {

  it('can return frozen observables, statically', t => {

    const memo = $.memo(() => 123);

    isReadable(t, memo);

    memo();

    isFrozen(t, memo);

  });

  it('can return frozen observables, dynamically', t => {

    const o = $(1);
    const memo = $.memo(() => $.untrack(o) ? o() : 123);

    isReadable(t, memo);

    memo();

    isReadable(t, memo);

    o(0);
    memo();

    isFrozen(t, memo);

  });

  it('bypasses the comparator function on first run', t => {

    const o1 = $.memo((opts) => 123, { equals: (opts) => true });

    t.is(o1(), 123);

    const o2 = $.memo((opts) => undefined, { equals: (opts) => true });

    t.is(o2(), undefined);

  });

  it('can not be running multiple times concurrently', t => {

    const o = $(0);

    let executions = 0;

    const result = $.memo((opts) => {

      executions += 1;

      const value = o();

      t.is(executions, 1);

      if (value === 0) o(1);
      if (value === 1) o(2);
      if (value === 2) o(3);

      t.is(executions, 1);

      executions -= 1;

      t.is(executions, 0);

      return value;

    });

    t.is(result(), 3);

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 1', t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    const memo = $.memo((opts) => {

      calls += 1;

      if (!$.untrack(a)) a(a() + 1);

      b();

    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 2);

    a(2);

    t.is(calls, 2);
    t.is(memo(), undefined);
    t.is(calls, 2);

    b(1);

    t.is(calls, 2);
    t.is(memo(), undefined);
    t.is(calls, 3);

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 2', t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    const memo = $.memo((opts) => {

      calls += 1;

      a();
      b(Math.random());
      b();

    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    a(2);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 3', t => {

    const branch = $(false);
    const o = new Array(100).fill(0).map(() => $(0));
    const oo = [...o, ...o];

    let calls = 0;

    const memo = $.memo((opts) => {

      calls += 1;

      oo.forEach(o => o());

      if ($.untrack(branch)) return;

      oo.forEach(o => o());

    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    branch(true);
    o[0](1);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);

    o[0](2);

    t.is(calls, 2);
    t.is(memo(), undefined);
    t.is(calls, 3);

  });

  it('cleans up inner memos', t => {

    const o = $(0);
    const active = $(true);

    let calls = 0;

    const memo1 = $.memo((opts) => {

      if (!active()) return;

      const memo2 = $.memo((opts2) => {

        calls += 1;

        o();

      });

      $.untrack(memo2);

    });

    t.is(calls, 0);
    t.is(memo1(), undefined);
    t.is(calls, 1);

    active(false);
    o(1);

    t.is(calls, 1);
    t.is(memo1(), undefined);
    t.is(calls, 1);

  });

  it('does not throw when disposing of itself', t => {

    t.notThrows(() => {

      $.root((stack, dispose) => {

        const memo = $.memo((stack) => {

          dispose();

          return 1;

        });

        memo();

      });

    });

  });

  it('returns a readable observable', t => {

    const o = $.memo((stack) => { });

    isReadable(t, o);

  });

  it('returns an observable with the return of the function', t => {

    const a = $(1);
    const b = $(2);
    const c = $.memo((stack) => a() + b());

    t.true($.isObservable(c));
    t.is(c(), 3);

  });

  it('returns an observable with value undefined if the function does not return anything', t => {

    const o = $.memo(() => { });

    t.true($.isObservable(o));
    t.is(o(), undefined);

  });

  it('supports any number of dependencies', t => {

    for (const nr of [1, 2, 3, 4, 5]) {

      const oo = new Array(nr).fill(0).map(() => $(0));

      let calls = 0;

      const memo = $.memo((stack) => {
        calls += 1;
        oo.map(call);
      });

      t.is(calls, 0);
      t.is(memo(), undefined);
      t.is(calls, 1);

      for (const [i, o] of Array.from(oo.entries())) {

        o(prev => prev + 1);

        t.is(calls, i + 1);
        t.is(memo(), undefined);
        t.is(calls, i + 2);

      }

    }

  });

  it('supports a custom equality function', t => {

    const o = $(2);
    const equals = value => (value % 2 === 0);
    const oPlus1 = $.memo((stack) => o() + 1, { equals });

    t.is(oPlus1(), 3);

    o(3);

    t.is(oPlus1(), 3);

    o(4);

    t.is(oPlus1(), 5);

    o(5);

    t.is(oPlus1(), 5);

  });

  it('supports dynamic dependencies', t => {

    const a = $(1);
    const b = $(2);
    const bool = $(false);
    const c = $.memo((stack) => bool() ? a() : b());

    t.is(c(), 2);

    a(10);

    t.is(c(), 2);

    b(20);

    t.is(c(), 20);

    bool(true);

    t.is(c(), 10);

  });

  it('supports manually registering a function to be called when the parent computation updates', t => {

    const o = $(0);

    let sequence = '';

    const memo = $.memo((stack) => {

      o();

      $.cleanup((stack) => {
        sequence += 'a';
      });

      $.cleanup((stack) => {
        sequence += 'b';
      });

    });

    t.is(memo(), undefined);
    t.is(sequence, '');

    o(1);

    t.is(memo(), undefined);
    t.is(sequence, 'ba');

    o(2);

    t.is(memo(), undefined);
    t.is(sequence, 'baba');

    o(3);

    t.is(memo(), undefined);
    t.is(sequence, 'bababa');

  });

  it('supports refreshing itself even if its last dependency did not actually change', t => {

    const o = $(0);
    const memo = $.memo(() => Math.min(0, o()));

    let calls = 0;

    const memo2 = $.memo((stack) => {
      o();
      memo();
      calls += 1;
    });

    t.is(calls, 0);
    t.is(memo2(), undefined);
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    t.is(memo2(), undefined);
    t.is(calls, 2);

  });

  it('supports synchronous memos', t => {

    const o = $(0);

    let calls = 0;

    $.memo((stack) => {
      calls += 1;
      o();
    }, { sync: true });

    t.is(calls, 1);

    o(1);

    t.is(calls, 2);

  });

  it('supports checking dependecies for updates on synchronous memos also', t => {

    const o = $(0);
    const memo = $.memo(o, { equals: (stack) => true });

    let calls = 0;

    $.memo((stack) => {

      calls += 1;

      memo();

    }, { sync: true });

    t.is(calls, 1);

    o(1);

    t.is(calls, 1);

  });

  it('updates the observable with the last value when causing itself to re-execute', t => {

    const o = $(0);

    const memo = $.memo((stack) => {

      let value = o();

      if (!o()) o(1);

      return value;

    });

    t.is(memo(), 1);

  });

  it('updates the observable when the dependencies change', t => {

    const a = $(1);
    const b = $(2);
    const c = $.memo((stack) => a() + b());

    a(3);
    b(7);

    t.is(c(), 10);

  });

  it('updates the observable when the dependencies change inside other computations', t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    const memo1 = $.memo((stack) => {
      calls += 1;
      return a();
    });

    t.is(calls, 0);
    t.is(memo1(), 0);
    t.is(calls, 1);

    const memo2 = $.memo((stack) => {
      a(1);
      b();
      a(0);
    });

    t.is(calls, 1);
    t.is(memo1(), 0);
    t.is(calls, 1);

    memo2();

    t.is(calls, 1);
    t.is(memo1(), 0);
    t.is(calls, 2);

    b(1);
    memo2();

    t.is(calls, 2);
    t.is(memo1(), 0);
    t.is(calls, 3);

    a(1);
    memo2();

    t.is(calls, 3);
    t.is(memo1(), 1);
    t.is(calls, 4);

  });

});
