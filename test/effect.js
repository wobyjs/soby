
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { call, tick } from './helpers.js';

/* MAIN */

describe('effect', it => {

  it('can not be running multiple times concurrently', async t => {

    const o = $(0);

    let executions = 0;

    $.effect((stack) => {

      executions += 1;

      const value = o();

      t.is(executions, 1);

      if (value === 0) o(1);
      if (value === 1) o(2);
      if (value === 2) o(3);

      t.is(executions, 1);

      executions -= 1;

      t.is(executions, 0);

    });

    await tick();

  });

  it('checks if the returned value is actually a function', async t => {

    await t.notThrowsAsync(async () => {

      $.effect((opts) => 123);

      await tick();

    });

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 1', async t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    $.effect((opts) => {

      calls += 1;

      if (!$.untrack(a)) a(a() + 1);

      b();

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 2);

    a(2);

    t.is(calls, 2);
    await tick();
    t.is(calls, 2);

    b(1);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 2', async t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    $.effect((opts) => {

      calls += 1;

      a();
      b(Math.random());
      b();

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    a(2);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('cleans up dependencies properly when causing itself to re-execute, scenario 3', async t => {

    const branch = $(false);
    const o = new Array(500).fill(0).map(() => $(0));
    const oo = [...o, ...o];

    let calls = 0;

    $.effect((opts) => {

      calls += 1;

      oo.forEach(o => o());

      if ($.untrack(branch)) return;

      oo.forEach(o => o());

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    branch(true);
    o[0](1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    o[0](2);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('cleans up inner effects', async t => {

    const o = $(0);
    const active = $(true);

    let calls = 0;

    $.effect((opts) => {

      if (!active()) return;

      $.effect((opts2) => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    active(false);
    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('returns a disposer', async t => {

    const a = $(1);
    const b = $(2);
    const c = $();

    const dispose = $.effect((opts) => {
      c(a() + b());
    });

    await tick();

    t.is(c(), 3);

    dispose();

    a(2);

    await tick();

    t.is(c(), 3);

  });

  it('returns undefined to the function', async t => {

    const a = $(1);
    const aPrev = $();

    $.effect((opts) => {

      aPrev(opts?.prev);

      return a();

    });

    await tick();

    t.is(a(), 1);
    t.is(aPrev(), undefined);

    a(2);

    await tick();

    t.is(a(), 2);
    t.is(aPrev(), undefined);

    a(3);

    await tick();

    t.is(a(), 3);
    t.is(aPrev(), undefined);

    a(4);

    await tick();

    t.is(a(), 4);
    t.is(aPrev(), undefined);

  });

  it('supports any number of dependencies', async t => {

    for (const nr of [1, 2, 3, 4, 5]) {

      const oo = new Array(nr).fill(0).map(() => $(0));

      let calls = 0;

      $.effect((stack) => {
        calls += 1;
        oo.map(call);
      });

      t.is(calls, 0);
      await tick();
      t.is(calls, 1);

      for (const [i, o] of Array.from(oo.entries())) {

        o(prev => prev + 1);

        t.is(calls, i + 1);
        await tick();
        t.is(calls, i + 2);

      }

    }

  });

  it('supports dynamic dependencies', async t => {

    const a = $(1);
    const b = $(2);
    const c = $();
    const bool = $(false);

    $.effect((stack) => {
      c(bool() ? a() : b());
    });

    await tick();

    t.is(c(), 2);

    a(10);

    await tick();

    t.is(c(), 2);

    b(20);

    await tick();

    t.is(c(), 20);

    bool(true);

    await tick();

    t.is(c(), 10);

  });

  it('supports manually registering a function to be called when the parent effect updates', async t => {

    const o = $(0);

    let sequence = '';

    $.effect((stack) => {

      o();

      $.cleanup((stack) => {
        sequence += 'a';
      });

      $.cleanup((stack) => {
        sequence += 'b';
      });

    });

    await tick();

    t.is(sequence, '');

    o(1);

    await tick();

    t.is(sequence, 'ba');

    o(2);

    await tick();

    t.is(sequence, 'baba');

    o(3);

    await tick();

    t.is(sequence, 'bababa');

  });

  it('supports automatically registering a function to be called when the parent effect updates', async t => {

    const o = $(0);

    let sequence = '';

    $.effect((stack) => {

      o();

      return (stack) => {
        sequence += 'a';
        sequence += 'b';
      };

    });

    await tick();

    t.is(sequence, '');

    o(1);

    await tick();

    t.is(sequence, 'ab');

    o(2);

    await tick();

    t.is(sequence, 'abab');

    o(3);

    await tick();

    t.is(sequence, 'ababab');

  });

  it('supports synchronous effects', t => {

    const o = $(0);

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o();
    }, { sync: true });

    t.is(calls, 1);

    o(1);

    t.is(calls, 2);

  });

  it('supports synchronous effects only on init', async t => {

    const o = $(0);

    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      o();
    }, { sync: 'init' });

    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('supports checking dependecies for updates on synchronous effects also', t => {

    const o = $(0);
    const memo = $.memo(o, { equals: () => true });

    let calls = 0;

    $.effect((stack) => {

      calls += 1;

      memo();

    }, { sync: true });

    t.is(calls, 1);

    o(1);

    t.is(calls, 1);

  });

  it('supports refreshing itself even if its last dependency did not actually change', t => {

    const o = $(0);
    const memo = $.memo(() => Math.min(0, o()));

    let calls = 0;

    $.effect((stack) => {
      o();
      memo();
      calls += 1;
    });

    t.is(calls, 0);
    $.tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    $.tick();
    t.is(calls, 2);

  });

  it('updates when the dependencies change', async t => {

    const a = $(1);
    const b = $(2);
    const c = $();

    $.effect((stack) => {
      c(a() + b());
    });

    a(3);
    b(7);

    await tick();

    t.is(c(), 10);

  });

  it('updates when the dependencies change inside other effects', async t => {

    const a = $(0);
    const b = $(0);
    let calls = 0;

    $.effect((stack) => {
      calls += 1;
      a();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    $.effect((stack) => {
      a(1);
      b();
      a(0);
    });

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    b(1);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

    a(1);

    t.is(calls, 3);
    await tick();
    t.is(calls, 4);

  });

});
