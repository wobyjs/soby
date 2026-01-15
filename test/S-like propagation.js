
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';

/* MAIN */

describe('S-like propagation', it => {

  it('only propagates in topological order', t => {

    //    a1
    //   /  \
    //  /    \
    // b1     b2
    //  \    /
    //   \  /
    //    c1

    let sequence = '';

    const a1 = $(0);

    const b1 = $.memo(() => {
      sequence += 'b1';
      return a1() + 1;
    });

    const b2 = $.memo(() => {
      sequence += 'b2';
      return a1() + 1;
    });

    const c1 = $.memo(() => {
      b1();
      b2();
      sequence += 'c1';
    });

    t.is(sequence, '');
    t.is(c1(), undefined);
    t.is(sequence, 'b1b2c1');

    a1(1);

    t.is(sequence, 'b1b2c1');
    t.is(c1(), undefined);
    t.is(sequence, 'b1b2c1b1b2c1');

  });

  it('only propagates once with linear convergences', t => {

    //         d
    //         |
    // +---+---+---+---+
    // v   v   v   v   v
    // f1  f2  f3  f4  f5
    // |   |   |   |   |
    // +---+---+---+---+
    //         v
    //         g

    const d = $(0);

    let calls = 0;

    const f1 = $.memo(() => {
      return d();
    });

    const f2 = $.memo(() => {
      return d();
    });

    const f3 = $.memo(() => {
      return d();
    });

    const f4 = $.memo(() => {
      return d();
    });

    const f5 = $.memo(() => {
      return d();
    });

    const g = $.memo(() => {
      calls += 1;
      return f1() + f2() + f3() + f4() + f5();
    });

    t.is(calls, 0);
    t.is(g(), 0);
    t.is(calls, 1);

    d(1);

    t.is(calls, 1);
    t.is(g(), 5)
    t.is(calls, 2);

  });

  it('only propagates once with exponential convergence', t => {

    //     d
    //     |
    // +---+---+
    // v   v   v
    // f1  f2 f3
    //   \ | /
    //     O
    //   / | \
    // v   v   v
    // g1  g2  g3
    // +---+---+
    //     v
    //     h

    const d = $(0);

    let calls = 0;

    const f1 = $.memo(() => {
      return d();
    });

    const f2 = $.memo(() => {
      return d();
    });

    const f3 = $.memo(() => {
      return d();
    });

    const g1 = $.memo(() => {
      return f1() + f2() + f3();
    });

    const g2 = $.memo(() => {
      return f1() + f2() + f3();
    });

    const g3 = $.memo(() => {
      return f1() + f2() + f3();
    });

    const h = $.memo(() => {
      calls += 1;
      return g1() + g2() + g3();
    });

    t.is(calls, 0);
    t.is(h(), 0);
    t.is(calls, 1);

    d(1);

    t.is(calls, 1);
    t.is(h(), 9);
    t.is(calls, 2);

  });

  it('parent supports going from one to two subscriptions', t => {

    const a = $(0);
    const b = $(0);

    let calls = 0;

    const memo = $.memo(() => {

      calls += 1;

      if (!a()) return 1;

      b();

      return 2;

    });

    t.is(calls, 0);
    t.is(memo(), 1);
    t.is(calls, 1);

    a(1);

    t.is(calls, 1);
    t.is(memo(), 2);
    t.is(calls, 2);

    a(2);

    t.is(calls, 2);
    t.is(memo(), 2);
    t.is(calls, 3);

    b(1);

    t.is(calls, 3);
    t.is(memo(), 2);
    t.is(calls, 4);

  });

});
