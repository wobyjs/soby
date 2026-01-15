
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable } from './helpers.js';


/* MAIN */

describe('ternary', it => {

  it('does not resolve values again when the condition changes but the reuslt branch is the same', t => {

    let sequence = '';

    const condition = $(1);

    const valueTrue = () => {
      sequence += 't';
    };

    const valueFalse = () => {
      sequence += 'f';
    };

    const memo = $.ternary(condition, valueTrue, valueFalse);

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

  it('resolves the first value before returning it', t => {

    const result = $.ternary(true, () => () => 123, 321);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 123);

  });

  it('resolves the second value before returning it', t => {

    const result = $.ternary(false, 123, () => () => 321);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 321);

  });

  it('returns a memo to the first or second value with a functional condition', t => {

    const o = $(false);

    const result = $.ternary(o, 123, 321);

    t.is(result(), 321);

    o(true);

    t.is(result(), 123);

    o(false);

    t.is(result(), 321);

  });

  it('returns a memo to the first value with a truthy condition', t => {

    t.is($.ternary(true, 123, 321)(), 123);
    t.is($.ternary('true', 123, 321)(), 123);

  });

  it('returns a memo to the value with a falsy condition', t => {

    t.is($.ternary(false, 123, 321)(), 321);
    t.is($.ternary(0, 123, 321)(), 321);

  });

});
