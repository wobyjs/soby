
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';

/* MAIN */

describe('root', it => {

  it('allows child computations to escape their parents', t => {

    $.root((stack) => {

      const outer = $(0);
      const inner = $(0);

      let memo1;
      let memo2 = [];

      const pull = () => {
        memo1();
        memo2.forEach(memo => memo());
      };

      let outerCalls = 0;
      let innerCalls = 0;

      memo1 = $.memo((stack) => {
        outer();
        outerCalls += 1;
        $.root((stack) => {
          memo2.push($.memo((stack) => {
            inner();
            innerCalls += 1;
          }));
        });
      });

      t.is(outerCalls, 0);
      t.is(innerCalls, 0);
      pull();
      t.is(outerCalls, 1);
      t.is(innerCalls, 1);

      outer(1);
      outer(2);

      t.is(outerCalls, 1);
      t.is(innerCalls, 1);
      pull();
      t.is(outerCalls, 2);
      t.is(innerCalls, 2);

      inner(1);

      t.is(outerCalls, 2);
      t.is(innerCalls, 2);
      pull();
      t.is(outerCalls, 2);
      t.is(innerCalls, 4);

    });

  });

  it('can be disposed', t => {

    $.root((stack, dispose) => {

      let calls = 0;

      const a = $(0);
      const b = $.memo((stack) => {
        calls += 1;
        return a();
      });

      t.is(calls, 0);
      t.is(b(), 0);
      t.is(calls, 1);

      a(1);

      t.is(calls, 1);
      t.is(b(), 1);
      t.is(calls, 2);

      dispose();

      a(2);

      t.is(calls, 2);
      t.is(b(), 1);
      t.is(calls, 2);

    });

  });

  it('can be disposed from a child computation', t => {

    $.root((stack, dispose) => {

      let calls = 0;

      const a = $(0);

      const memo = $.memo((stack) => {
        calls += 1;
        if (a()) dispose();
        return a();
      });

      t.is(calls, 0);
      t.is(memo(), 0);
      t.is(calls, 1);

      a(1);

      t.is(calls, 1);
      t.is(memo(), 1);
      t.is(calls, 2);

      a(2);

      t.is(calls, 2);
      t.is(memo(), 1);
      t.is(calls, 2);

    });

  });

  it('can be disposed from a child computation of a child computation', t => {

    $.root((stack, dispose) => {

      let calls = 0;

      const a = $(0);

      const memo1 = $.memo((stack) => {
        calls += 1;
        a();
        const memo2 = $.memo((stack) => {
          if (a()) dispose();
        });
        $.untrack(memo2);
      });

      t.is(calls, 0);
      t.is(memo1(), undefined);
      t.is(calls, 1);

      a(1);

      t.is(calls, 1);
      t.is(memo1(), undefined);
      t.is(calls, 2);

      a(2);

      t.is(calls, 2);
      t.is(memo1(), undefined);
      t.is(calls, 2);

    });

  });

  it('persists through the entire scope when used at top level', t => {

    $.root((stack) => {

      const a = $(1);

      const b = $.memo((stack) => a());

      a(2);

      const c = $.memo((stack) => a());

      a(3);

      t.is(b(), 3);
      t.is(c(), 3);

    });

  });

  it('returns whatever the function returns', t => {

    const result = $.root(() => 123);

    t.is(result, 123);

  });

});
