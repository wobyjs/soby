
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('with', it => {

  it('calls the functions with no arguments, even for a root', t => {

    $.root((stack) => {

      const runWithRoot = $.with();

      runWithRoot((stack, ...args) => {

        t.deepEqual(args, []);

      });

    });

  });

  it('can execute a function as if it happend inside another owner', t => {

    $.root((stack) => {

      const name = Symbol();
      const value = { value: 123 };
      const context = { [name]: value };

      $.context((stack) => {

        const runWithOuter = $.with();

        $.root((stack) => {

          const value2 = { value: 321 };
          const context2 = { [name]: value2 };

          $.context((stack) => {

            t.is($.context(name), undefined);

            runWithOuter((stack) => {

              t.is($.context(name), undefined);

            });

          });

        });

      });

    });

  });

  it('returns whatever the function returns', t => {

    t.is($.with()((stack) => 123), 123);

  });

  it('does not override pre-exiting dependencies of effects', async t => {

    const o = $(0);

    let calls = 0;
    let runWith;

    $.effect((stack) => {
      calls += 1;
      o();
      runWith = $.with();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    runWith((stack) => { });

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('does not override pre-exiting dependencies of effects', t => {

    const o = $(0);

    let calls = 0;
    let runWith;

    const memo = $.memo((stack) => {
      calls += 1;
      o();
      runWith = $.with();
    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    runWith((stack) => { });

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);

  });

});
