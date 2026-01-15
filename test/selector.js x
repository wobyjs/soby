
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, tick } from './helpers.js';

/* MAIN */

describe('selector', it => {

  it('returns an observable', async t => {

    const source = $(0);
    const selector = $.selector(source);
    const selected = selector(1);

    isReadable(t, selected);

    await tick();

    t.false(selected());

    source(1);

    await tick();

    t.false(selected());

  });

  it('efficiently tells when the provided item is the selected one', async t => {

    const values = [1, 2, 3, 4, 5];
    const selected = $(-1);

    const select = value => selected(value);
    const selector = $.selector(selected);

    let sequence = '';

    values.forEach(value => {

      $.effect(() => {

        sequence += value;

        if (!selector(value)()) return;

        sequence += value;

      });

    });

    await tick();

    t.is(sequence, '12345');

    select(1);

    await tick();

    t.is(sequence, '12345');

    select(2);

    await tick();

    t.is(sequence, '12345');

    select(-1);

    await tick();

    t.is(sequence, '12345');

  });

  it('memoizes the source function', async t => {

    const values = [0, 1, 2, 3, 4];

    const selectedFactor1 = $(0);
    const selectedFactor2 = $(1);
    const selected = () => selectedFactor1() * selectedFactor2();
    const selector = $.selector(selected);

    let sequence = '';

    values.forEach(value => {

      $.effect(() => {

        sequence += value;

        if (!selector(value)()) return;

        sequence += value;

      });

    });

    await tick();

    t.is(sequence, '001234');

    selectedFactor2(2);

    await tick();

    t.is(sequence, '001234');

  });

  it('survives checking a value inside a discarded root', async t => {

    const selected = $(-1);
    const selector = $.selector(selected);

    let calls = 0;

    $.root((stack, dispose) => {

      selector(1)();

      $.root(() => {

        selector(1)();

      });

      dispose();

    });

    $.effect(() => {

      calls += 1;

      selector(1)();

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    selected(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('treats 0 and -0 as the same value values', t => {

    const selected = $(0);
    const selector = $.selector(selected);

    // console.log('selector(0)', selector(0)(), selector(0))
    // console.log('selector(0)', selector(-0)(), selector(-0))
    t.true(selector(0)());
    t.true(selector(-0)());

  });

  it('works inside suspense', t => {

    $.suspense(true, () => {

      const selected = $(-1);

      const selector = $.selector(selected);

      t.is(selector(1)(), false);

      selected(1);

      t.is(selector(1)(), false);

    });

  });

  it('works with stores', t => {

    const store = $.store({ value: 0 });
    const selector = $.selector(() => store.value);
    const selected = selector(1);

    isReadable(t, selected);

    t.false(selected());

    store.value = 1;

    t.true(selected());

  });

});
