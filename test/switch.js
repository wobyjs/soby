
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, } from './helpers.js';

/* MAIN */
describe('switch', it => {

  it('does not resolve values again when the condition changes but the reuslt case is the same', t => {

    let sequence = '';

    const condition = $(0);

    const value0 = () => {
      sequence += '0';
    };

    const value1 = () => {
      sequence += '1';
    };

    const valueDefault = () => {
      sequence += 'd';
    };

    const memo = $.switch(condition, [[0, value0], [1, value1], [valueDefault]]);

    t.is(memo()(), undefined);

    condition(0);

    t.is(sequence, '0');

    condition(1);

    t.is(memo()(), undefined);

    condition(1);

    t.is(memo()(), undefined);

    t.is(sequence, '01');

    condition(2);

    t.is(memo()(), undefined);

    condition(3);

    t.is(memo()(), undefined);

    t.is(sequence, '01d');

  });

  it('resolves the value of a case before returning it', t => {

    const result = $.switch(1, [[1, () => () => '1'], [2, '2'], [1, '1.1']]);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), '1');

  });

  it('resolves the value of the default case before returning it', t => {

    const result = $.switch(2, [[1, '1'], [() => () => 'default'], [2, '2'][1, '1.1']]);

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 'default');

  });

  it('resolves the fallback value before returning it', t => {

    const result = $.switch(2, [[1, '1']], () => () => 'fallback');

    isReadable(t, result);
    isReadable(t, result());
    isReadable(t, result()());

    t.is(result()()(), 'fallback');

  });

  it('resolves the fallback once value before returning it, even if needed multiple times in a sequence', t => {

    const o = $(2);

    let calls = 0;

    const memo = $.switch(o, [[1, '1']], () => () => {
      calls += 1;
      return 321;
    });

    t.is(calls, 0);

    t.is(memo()()(), 321);

    t.is(calls, 1);

    o(3);

    t.is(memo()()(), 321);

    t.is(calls, 1);

    o(4);

    t.is(memo()()(), 321);

    t.is(calls, 1);

  });

  it('returns a memo to matching case or the default case with a functional condition', t => {

    const o = $(1);

    const result = $.switch(o, [[1, '1'], [2, '2'], [1, '1.1'], ['default']]);

    t.is(result(), '1');

    o(2);

    t.is(result(), '2');

    o(3);

    t.is(result(), 'default');

  });

  it('returns a memo to the value of the default case if no case before it matches', t => {

    const result = $.switch(2, [[1, '1'], ['default'], [2, '2'][1, '1.1']]);

    t.is(result(), 'default');

  });

  it('returns a memo to the value of the first matching case', t => {

    const result1 = $.switch(1, [[1, '1'], [2, '2'], [1, '1.1']]);

    t.is(result1(), '1');

    const result2 = $.switch(2, [[1, '1'], [2, '2'], [1, '1.1']]);

    t.is(result2(), '2');

  });

  it('returns a memo to undefined if no condition matches and there is no default case', t => {

    const result = $.switch(1, [[2, '2'], [3, '3']]);

    t.is(result(), undefined);

  });

  it('returns a memo to fallback if no condition matches and there is no default case', t => {

    const result = $.switch(1, [[2, '2'], [3, '3']], 123);

    t.is(result(), 123);

  });

  it('treats 0 and -0 as different values', t => {

    const condition = $(0);

    const memo = $.switch(condition, [[0, '0'], [-0, '-0']]);

    t.is(memo(), '0');

    condition(-0);

    t.is(memo(), '-0');

  });

});
