
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { SYMBOL_UNTRACKED } from '../dist/symbols.js';
import { tick } from './helpers.js';

/* MAIN */

describe('untracked', it => {

  it('does not pass on any eventual dispose function', t => {

    $.root(() => {

      $.untracked(dispose => {

        t.is(dispose, undefined);

      })();

    });

  });

  it('does not leak memos', t => {

    const o = $(1);

    let cleaned = false;

    const memo1 = $.memo(() => {

      o();

      $.untracked(() => {

        const memo2 = $.memo(() => {

          $.cleanup(() => {

            cleaned = true;

          });

        });

        memo2();

      })();

    });

    t.is(memo1(), undefined);
    t.is(cleaned, false);

    o(2);

    t.is(memo1(), undefined);
    t.is(cleaned, true);

  });

  it('does not leak effects', async t => {

    const o = $(1);

    let cleaned = false;

    $.effect(() => {

      o();

      $.untracked(() => {

        $.effect(() => {

          $.cleanup(() => {

            cleaned = true;

          });

        });

      })();

    });

    await tick();

    t.is(cleaned, false);

    o(2);

    await tick();

    t.is(cleaned, true);

  });

  it('marks the untracked function as such', t => {

    const untracked = $.untracked(() => { });

    t.is(untracked[SYMBOL_UNTRACKED], true);

  });

  it('wraps non-functions', t => {

    const values = [0, -0, Infinity, NaN, 'foo', true, false, {}, [], Promise.resolve(), new Map(), new Set(), null, undefined, Symbol()];

    for (const value of values) {

      t.is(value, $.untracked(value)());

    }

  });

  it('supports functions with arguments', t => {

    const sum = $.untracked((a, b) => a + b);

    t.is(sum(1, 2), 3);

  });

  it('supports getting without creating dependencies in a memo', t => {

    const a = $(1);
    const b = $(2);
    const c = $(3);
    const d = $(0);

    let calls = 0;

    const memo = $.memo(() => {
      calls += 1;
      a();
      a();
      d($.untracked(() => b())());
      c();
      c();
    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);
    t.is(d(), 2);

    b(4);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 1);
    t.is(d(), 2);

    a(5);
    c(6);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);
    t.is(d(), 4);

  });

  it('supports getting without creating dependencies in an effect', async t => {

    const a = $(1);
    const b = $(2);
    const c = $(3);
    const d = $(0);

    let calls = 0;

    $.effect(() => {
      calls += 1;
      a();
      a();
      d($.untracked(() => b())());
      c();
      c();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);
    t.is(d(), 2);

    b(4);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);
    t.is(d(), 2);

    a(5);
    c(6);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);
    t.is(d(), 4);

  });

  it('works with functions containing a memo', async t => {

    const o = $(0);

    let calls = 0;

    $.effect(() => {

      calls += 1;

      $.untracked(() => {

        o();

        const memo = $.memo(() => {

          o();

        });

        memo();

        o();

      })();

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('works with functions containing an effect', async t => {

    const o = $(0);

    let calls = 0;

    $.effect(() => {

      calls += 1;

      $.untracked(() => {

        o();

        $.effect(() => {

          o();

        });

        o();

      })();

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('works with functions containing a root', async t => {

    const o = $(0);

    let calls = 0;

    $.effect(() => {

      calls += 1;

      $.untracked(() => {

        o();

        $.root(() => {

          o();

        });

        o();

      })();

    });


    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('works on the top-level computation', async t => {

    const o = $(0);

    let sequence = '';

    $.effect(() => {

      sequence += 'p';

      $.untracked(() => {

        o();

        $.effect(() => {

          sequence += 'c';

          o();

        });

      })();

    });

    t.is(sequence, '');
    await tick();
    t.is(sequence, 'pc');

    o(1);

    t.is(sequence, 'pc');
    await tick();
    t.is(sequence, 'pcc');

  });

});
