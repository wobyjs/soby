
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, } from './helpers.js';

/* MAIN */

describe('if', it => {

  it('does not resolve values again when the condition changes but the reuslt branch is the same', t => {

    let sequence = '';

    const condition = $(1);

    const valueTrue = () => {
      sequence += 't';
    };

    const valueFalse = () => {
      sequence += 'f';
    };

    const memo = $.if(condition, valueTrue, valueFalse);

    condition(2);

    t.is(memo()(), undefined);

    condition(3);

    t.is(memo()(), undefined);

    t.is(sequence, 't');

    condition(0);

    t.is(memo()(), undefined);

    condition(false);

    t.is(memo()(), undefined);

    t.is(sequence, 'tf');

    condition(4);

    t.is(memo()(), undefined);

    condition(5);

    t.is(memo()(), undefined);

    t.is(sequence, 'tft');

  });

  it('resolves the fallback value before returning it', t => {

    const result = $.if(false, 123, () => () => 123);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 123);

  });

  it('resolves the fallback once value before returning it, even if needed multiple times in a sequence', t => {

    const o = $(0);

    let calls = 0;

    const memo = $.if(o, () => () => 123, () => () => {
      calls += 1;
      return 321;
    });

    t.is(calls, 0);

    t.is(memo()()(), 321);

    t.is(calls, 1);

    o(false);

    t.is(memo()()(), 321);

    t.is(calls, 1);

    o(NaN);

    t.is(memo()()(), 321);

    t.is(calls, 1);

  });

  it('resolves the value before returning it', t => {

    const result = $.if(true, () => () => 123);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 123);

  });

  it('returns a memo to the value or undefined with a functional condition', t => {

    const o = $(false);

    const result = $.if(o, 123);

    t.is(result(), undefined);

    o(true);

    t.is(result(), 123);

    o(false);

    t.is(result(), undefined);

  });

  it('returns a memo to the value with a truthy condition', t => {

    t.is($.if(true, 123)(), 123);
    t.is($.if('true', 123)(), 123);

  });

  it('returns a memo to the value with a falsy condition', t => {

    t.is($.if(false, 123)(), undefined);
    t.is($.if(0, 123)(), undefined);

  });

  it('returns a memo to undefined for a falsy condition and missing fallback', t => {

    t.is($.if(false, 123)(), undefined);

  });

  it('returns a memo to fallback for a falsy condition and a provided fallback', t => {

    t.is($.if(false, 123, 321)(), 321);

  });

});
