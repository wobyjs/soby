
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';

/* MAIN */

describe('isObservable', it => {

  it('checks if a value is an observable', t => {

    t.true($.isObservable($()));
    t.true($.isObservable($(123)));
    t.true($.isObservable($(false)));
    t.true($.isObservable($.memo(() => { })));

    t.false($.isObservable());
    t.false($.isObservable(null));
    t.false($.isObservable({}));
    t.false($.isObservable([]));
    t.false($.isObservable($.effect(() => { })));

  });

});
