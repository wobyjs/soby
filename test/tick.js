
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import isObservableFrozen from '../dist/methods/is_observable_frozen.js';
import isObservableReadable from '../dist/methods/is_observable_readable.js';
import isObservableWritable from '../dist/methods/is_observable_writable.js';

/* MAIN */

describe('tick', it => {

  it('flushes any scheduled effects immediately', t => {

    const o = $(0);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      o();
    });

    t.is(calls, 0);
    $.tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    $.tick();
    t.is(calls, 2);

  });

  it('flushes any scheduled effects recursively', t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      if ($.untrack(b) >= 5) return;
      b(a() + 1);
    });

    $.effect(() => {
      calls += 1;
      if ($.untrack(a) >= 5) return;
      a(b() + 1);
    });

    t.is(calls, 0);
    $.tick();
    t.is(calls, 7);

  });

});
