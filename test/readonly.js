
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, } from './helpers.js';

/* MAIN */

describe('readonly', it => {

  it('returns the same readonly observable if it gets passed a frozen one', t => {

    const o = $.memo(() => 123);
    const ro = $.readonly(o);

    t.true(o === ro);

  });

  it('returns the same readonly observable if it gets passed one', t => {

    const o = $(1);
    const ro = $.readonly(o);

    isReadable(t, ro);

    t.is(o(), 1);
    t.is(ro(), 1);

    o(2);

    t.is(o(), 2);
    t.is(ro(), 2);

    const ro2 = $.readonly(o);
    const rro = $.readonly(ro);

    t.is(ro2(), 2);
    t.is(rro(), 2);

    t.true(ro !== ro2); //TODO: Maybe cache read-only Observables and make this ===
    t.true(ro === rro);

  });

  it('throws when attempting to set', t => {

    const ro = $.readonly($());

    t.throws(() => ro(1), { message: 'A readonly Observable can not be updated' });

  });

});
