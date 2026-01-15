
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';

/* MAIN */

describe('boolean', it => {

  it('returns a boolean for static values', t => {

    t.true($.boolean('true'));
    t.false($.boolean(''));

  });

  it('returns a function for dynamic values', t => {

    const o = $('true');
    const bool = $.boolean(o);

    t.true(bool());

    o('');

    t.false(bool());

  });

});
