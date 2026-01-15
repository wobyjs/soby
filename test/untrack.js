
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('untrack', it => {

  it('does not pass on any eventual dispose function', t => {

    $.root((stack) => {

      $.untrack((dispose, stack) => {

        t.is(dispose, undefined);

      });

    });

  });

  it('does not leak memos', t => {

    const o = $(1);

    let cleaned = false;

    const memo1 = $.memo((stack) => {

      o();

      $.untrack((stack) => {

        const memo2 = $.memo((stack) => {

          $.cleanup((stack) => {

            cleaned = true;

          });

        });

        memo2();

      });

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

    $.effect((stack) => {

      o();

      $.untrack((stack) => {

        $.effect((stack) => {

          $.cleanup((stack) => {

            cleaned = true;

          });

        });

      });

    });

    await tick();

    t.is(cleaned, false);

    o(2);

    await tick();

    t.is(cleaned, true);

  });

  it('returns non-functions as is', t => {

    const values = [0, -0, Infinity, NaN, 'foo', true, false, {}, [], Promise.resolve(), new Map(), new Set(), null, undefined, Symbol()];

    for (const value of values) {

      t.is(value, $.untrack(value));

    }

  });

  it('supports getting without creating dependencies in a memo', t => {

    const a = $(1);
    const b = $(2);
    const c = $(3);
    const d = $(0);

    let calls = 0;

    const memo = $.memo((stack) => {
      calls += 1;
      a();
      a();
      d($.untrack((stack) => b()));
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

    $.effect((stack) => {
      calls += 1;
      a();
      a();
      d($.untrack((stack) => b()));
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

    $.effect((stack) => {

      calls += 1;

      $.untrack((stack) => {

        o();

        const memo = $.memo((stack) => {

          o();

        });

        memo();

        o();

      });

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

    $.effect((stack) => {

      calls += 1;

      $.untrack((stack) => {

        o();

        $.effect((stack) => {

          o();

        });

        o();

      });

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

    $.effect((stack) => {

      calls += 1;

      $.untrack((stack) => {

        o();

        $.root((stack) => {

          o();

        });

        o();

      });

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

    $.effect((stack) => {

      sequence += 'p';

      $.untrack((stack) => {

        o();

        $.effect((stack) => {

          sequence += 'c';

          o();

        });

      });

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
