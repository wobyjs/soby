
/* IMPORT */

import { describe } from 'fava';
import { setTimeout as delay } from 'node:timers/promises';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('isBatching', it => {

  it('checks if automatic batching is active, for async effects', async t => {

    t.false($.isBatching());

    $.effect(() => {

      t.true($.isBatching());

    });

    t.true($.isBatching());

    await tick();

    t.false($.isBatching());

  });

  it('checks if automatic batching is active, for sync effects', async t => {

    t.false($.isBatching());

    $.effect(() => {

      // t.true ( $.isBatching () ); //FIXME: this should probably be "true" ideally

    }, { sync: true });

    t.false($.isBatching());

  });

  it('checks if manual batching is active', async t => {

    t.false($.isBatching());

    await $.batch(async () => {
      t.true($.isBatching());
      await delay(50);
      t.true($.isBatching());
      await $.batch(async () => {
        t.true($.isBatching());
        await $.batch(() => {
          t.true($.isBatching());
        });
        t.true($.isBatching());
      });
      t.true($.isBatching());
      await delay(50);
      t.true($.isBatching());
    });

    t.false($.isBatching());

  });

});
