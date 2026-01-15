
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('owner', it => {

  it('detects the super root', t => {

    const owner = $.owner();

    t.true(owner.isSuperRoot);
    t.false(owner.isRoot);
    t.false(owner.isSuspense);
    t.false(owner.isComputation);

  });

  it('detects a root', t => {

    $.root(() => {

      const owner = $.owner();

      t.false(owner.isSuperRoot);
      t.true(owner.isRoot);
      t.false(owner.isSuspense);
      t.false(owner.isComputation);

    });

  });

  it('detects an effect', async t => {

    $.effect(() => {

      const owner = $.owner();

      t.false(owner.isSuperRoot);
      t.false(owner.isRoot);
      t.false(owner.isSuspense);
      t.true(owner.isComputation);

    });

    await tick();

  });

  it('detects a memo', t => {

    const memo = $.memo(() => {

      const owner = $.owner();

      t.false(owner.isSuperRoot);
      t.false(owner.isRoot);
      t.false(owner.isSuspense);
      t.true(owner.isComputation);

    });

    memo();

  });

  it('detects a suspense', t => {

    $.suspense(false, () => {

      const owner = $.owner();

      t.false(owner.isSuperRoot);
      t.false(owner.isRoot);
      t.true(owner.isSuspense);
      t.false(owner.isComputation);

    });

  });

});

