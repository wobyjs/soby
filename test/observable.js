
/* IMPORT */

import { describe } from 'fava';
import { observable } from '../dist/index.js';

/* MAIN */

describe('observable', it => {

  it('is both a getter and a setter', t => {

    const o = observable();

    t.is(o(), undefined);

    o(123);

    t.is(o(), 123);

    o(321);

    t.is(o(), 321);

    o(undefined);

    t.is(o(), undefined);

  });

});
