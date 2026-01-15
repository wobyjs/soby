
/* IMPORT */

import { describe } from 'fava';
import { setTimeout as delay } from 'node:timers/promises';
import $ from '../dist/index.js';
import { isReadable, tick } from './helpers.js';

/* MAIN */

describe('disposed', it => {

  it('returns an observable that tells if the parent got disposed or not', async t => {

    const a = $(1);
    const values = [];

    $.effect((stack) => {

      const disposed = $.disposed();

      values.push(disposed());

      a();

      setTimeout(() => {

        values.push(disposed());

      }, 10);

    });

    await tick();

    a(2);

    await tick();

    a(3);

    await delay(50);

    t.deepEqual(values, [false, false, false, true, true, false]);

  });

  it('returns a readable observable', t => {

    const o = $.disposed();

    isReadable(t, o);

  });

});
