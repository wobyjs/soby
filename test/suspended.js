
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isFrozen, tick } from './helpers.js';

/* MAIN */

describe('suspended', it => {

  it('returns an observable that tells if the parent got suspended or not', async t => {

    const a = $(1);
    const values = [];
    const branch = $(false);

    $.suspense(branch, () => {

      const suspended = $.suspended();

      $.effect(() => {

        values.push(suspended());

      }, { suspense: false });

    });

    await tick();

    branch(true);

    await tick();

    branch(false);

    await tick();

    t.deepEqual(values, [false, true, false]);

  });

  it('returns a readable observable', t => {

    const o = $.suspended();

    isFrozen(t, o);

  });

});
