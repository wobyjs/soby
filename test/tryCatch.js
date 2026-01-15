
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, settle } from './helpers.js';

/* MAIN */

describe('tryCatch', it => {

  //TODO: These "settle" calls look a bit ugly, but maybe no way around them with a lazy system?

  it('can catch and recover from errors', t => {

    const o = $(false);

    let err;
    let recover;

    const fallback = ({ error, reset }) => {
      err = error;
      recover = reset;
      return 'fallback';
    };

    const regular = () => {
      if (o()) throw 'whoops';
      return 'regular';
    };

    const memo = $.tryCatch(regular, fallback);

    t.is(settle(memo), 'regular');

    o(true);

    t.is(settle(memo), 'fallback');
    t.true(err instanceof Error);
    t.is(err.message, 'whoops');

    o(false);

    recover();

    t.is(settle(memo), 'regular');

  });

  it('casts thrown errors to Error instances', t => {

    const fallback = ({ error }) => {
      t.true(error instanceof Error);
      t.is(error.message, 'err');
    };

    const regular = () => {
      throw 'err';
    };

    const memo = $.tryCatch(regular, fallback);

    settle(memo);

  });

  it('resolves the fallback before returning it', t => {

    const result = $.tryCatch(() => { throw 'err' }, () => () => () => 123);

    settle(result);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 123);

  });

  it('resolves the value before returning it', t => {

    const result = $.tryCatch(() => () => 123, () => { });

    settle(result);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 123);

  });

  it('supports error handlers that throw', t => {

    let calls = '';

    const result = $.tryCatch(() => {

      return $.tryCatch(() => {

        return $.memo(() => {

          throw new Error();

        });

      }, () => {

        calls += 'b';
        throw new Error();
        calls += 'c';

      });

    }, () => {

      calls += 'a';

    });

    settle(result);
    settle(result); //FIXME: Is is correct that this is needed though?

    t.is(calls, 'ba');

  });

});
