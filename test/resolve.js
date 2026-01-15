
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, tick } from './helpers.js';

/* MAIN */

describe('resolve', it => {

  it('properly disposes of inner memos', t => {

    const o = $(2);

    let calls = 0;

    const dispose = $.root((stack, dispose) => {

      const fn = () => {
        const memo = $.memo(() => {
          calls += 1;
          return o() ** 2;
        });
        $.effect(() => {
          memo();
        }, { sync: true });
      };

      const memo = $.resolve(fn);

      memo();

      return dispose;

    });

    t.is(calls, 1);

    o(3);

    t.is(calls, 2);

    dispose();

    o(4);

    t.is(calls, 2);

  });

  it('properly disposes of inner effects', async t => {

    const o = $(2);

    let calls = 0;

    const dispose = $.root((stack, dispose) => {

      const fn = () => {
        $.effect(() => {
          calls += 1;
          o() ** 2;
        });
      };

      const memo = $.resolve(fn);

      memo();

      return dispose;

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(3);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    dispose();

    o(4);

    t.is(calls, 2);
    await tick();
    t.is(calls, 2);

  });

  it('resolves an array', t => {

    const arr = [() => 123];
    const resolved = $.resolve(arr);

    isReadable(t, resolved[0]);

    t.is(resolved[0](), 123);

  });

  it('resolves a nested array', t => {

    const arr = [123, [() => 123]];
    const resolved = $.resolve(arr);

    isReadable(t, resolved[1][0]);

    t.is(resolved[1][0](), 123);

  });

  it('resolves an observable', t => {

    const o = $(123);
    const resolved = $.resolve(o);

    t.is(resolved, o);

  });

  it('resolves nested observable', t => {

    const a = $(123);
    const b = $(a);
    const resolved = $.resolve(b);

    t.is(resolved, b);
    t.is(resolved(), a);

  });

  it('resolves a plain object', t => {

    const ia = { foo: true };
    const ib = { foo: () => true };
    const ic = { foo: [() => true] };

    const oa = $.resolve(ia);
    const ob = $.resolve(ib);
    const oc = $.resolve(ic);

    t.is(oa, ia);
    t.is(ob, ib);
    t.is(oc, ic);

    t.false($.isObservable(ob.foo));
    t.false($.isObservable(oc.foo[0]));

  });

  it('resolves a primitive', t => {

    const symbol = Symbol();

    t.is($.resolve(null), null);
    t.is($.resolve(undefined), undefined);
    t.is($.resolve(true), true);
    t.is($.resolve(false), false);
    t.is($.resolve(123), 123);
    t.is($.resolve(123n), 123n);
    t.is($.resolve('foo'), 'foo');
    t.is($.resolve(symbol), symbol);

  });

  it('resolves a function', t => {

    const fn = () => 123;
    const resolved = $.resolve(fn);

    isReadable(t, resolved);

    t.is(resolved(), 123);

  });

  it('resolves nested functions', t => {

    const fn = () => () => 123;
    const resolved = $.resolve(fn);

    isReadable(t, resolved);
    isReadable(t, resolved());

    t.is(resolved()(), 123);

  });

  it('resolves mixed nested arrays and functions', t => {

    const arr = [() => [() => 123]];
    const resolved = $.resolve(arr);

    isReadable(t, resolved[0]);
    isReadable(t, resolved[0]()[0]);

    t.is(resolved[0]()[0](), 123);

  });

});
