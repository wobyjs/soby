
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';

/* MAIN */

describe('isStore', it => {

  it('checks if a value is a store', t => {

    t.true($.isStore($.store({})));
    t.true($.isStore($.store([])));

    t.false($.isStore());
    t.false($.isStore(null));
    t.false($.isStore({}));
    t.false($.isStore([]));

  });

});
