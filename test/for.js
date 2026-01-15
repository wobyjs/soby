
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { isReadable, call, tick } from './helpers.js';

/* MAIN */

describe('for', () => {

  describe('keyed', it => {

    it('calls the mapper function with an observable to the index', t => {

      const array = $(['a', 'b', 'c']);
      const argsRaw = [];
      const args = [];

      const memo = $.for(array, (value, index) => {
        isReadable(t, index);
        argsRaw.push(index);
        args.push(index());
        return value;
      });

      t.deepEqual(memo(), ['a', 'b', 'c']);
      t.deepEqual(argsRaw.map(call), [0, 1, 2]);
      t.deepEqual(args, [0, 1, 2]);

      array(['a', 'b', 'c', 'd']);

      t.deepEqual(memo(), ['a', 'b', 'c', 'd']);
      t.deepEqual(argsRaw.map(call), [0, 1, 2, 3]);
      t.deepEqual(args, [0, 1, 2, 3]);

      array(['d', 'c', 'a', 'b']);

      t.deepEqual(memo(), ['d', 'c', 'a', 'b']);
      t.deepEqual(argsRaw.map(call), [2, 3, 1, 0]);
      t.deepEqual(args, [0, 1, 2, 3]);

    });

    it('calls the mapper function with the raw index in some simple cases', t => {

      const array = ['a', 'b', 'c'];
      const args = [];

      const memo = $.for(array, (value, index) => {
        args.push(index);
        return value;
      });

      t.deepEqual(memo(), ['a', 'b', 'c']);
      t.deepEqual(args, [0, 1, 2]);

    });

    it('disposes of any reactivity when the values array is emptied', t => {

      const array = $([1, 2, 3]);
      const args = [];

      const memo = $.for(array, value => {
        $.cleanup(() => {
          args.push(value);
        });
        return value;
      });

      t.deepEqual(memo(), [1, 2, 3]);

      array([]);

      t.deepEqual(memo(), []);
      t.deepEqual(args, [1, 2, 3]);

    });

    it('disposes of any reactivity when the parent computation is disposed', t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = $.root((stack, dispose) => {
        const memo = $.memo(() => {
          const memo = $.for(array, value => {
            const memo = $.memo(() => {
              args.push(value());
            });
            memo();
          });
          memo();
        });
        memo();
        return dispose;
      });

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity when the parent effect is disposed', async t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = await $.root(async (stack, dispose) => {
        $.effect(() => {
          const memo = $.for(array, value => {
            const memo = $.memo(() => {
              args.push(value());
            });
            memo();
          });
          memo();
        });
        await tick();
        return dispose;
      });

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity when the parent root is disposed', t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = $.root((stack, dispose) => {
        const memo = $.for(array, value => {
          const memo = $.memo(() => {
            args.push(value());
          });
          memo();
        });
        memo();
        return dispose;
      });

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity created for items that got deleted', t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const memo = $.for(array, value => {
        const memo = $.memo(() => {
          args.push(value());
          return value();
        });
        return memo;
      });

      t.deepEqual(memo().map(call), [1, 2]);
      t.deepEqual(args, [1, 2]);

      o1(11);

      t.deepEqual(memo().map(call), [11, 2]);
      t.deepEqual(args, [1, 2, 11]);

      o2(22);

      t.deepEqual(memo().map(call), [11, 22]);
      t.deepEqual(args, [1, 2, 11, 22]);

      array([o1]);

      t.deepEqual(memo().map(call), [11]);
      t.deepEqual(args, [1, 2, 11, 22]);

      o1(111);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 2, 11, 22, 111]);

      o2(22);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 2, 11, 22, 111]);

    });

    it('disposes of any reactivity created for duplicated items', t => {

      const o = $(1);
      const array = $([o, o]);
      const args = [];

      const memo = $.for(array, value => {
        const memo = $.memo(() => {
          args.push(value());
          return value();
        });
        return memo;
      });

      t.deepEqual(memo().map(call), [1, 1]);
      t.deepEqual(args, [1, 1]);

      o(11);

      t.deepEqual(memo().map(call), [11, 11]);
      t.deepEqual(args, [1, 1, 11, 11]);

      o(22);

      t.deepEqual(memo().map(call), [22, 22]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22]);

      array([o]);

      t.deepEqual(memo().map(call), [22]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22]);

      o(111);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22, 111]);

    });

    it('renders only results for unknown values', t => {

      const array = $([1, 2, 3]);
      const args = [];

      const memo = $.for(array, value => {
        args.push(value);
        return value;
      });

      t.deepEqual(memo(), [1, 2, 3]);
      t.deepEqual(args, [1, 2, 3]);

      array([1, 2, 3, 4]);

      t.deepEqual(memo(), [1, 2, 3, 4]);
      t.deepEqual(args, [1, 2, 3, 4]);

      array([1, 2, 3, 4, 5]);

      t.deepEqual(memo(), [1, 2, 3, 4, 5]);
      t.deepEqual(args, [1, 2, 3, 4, 5]);

    });

    it('resolves the fallback value before returning it', t => {

      const result = $.for([], () => () => 123, () => () => 321);

      isReadable(t, result);
      isReadable(t, result());
      isReadable(t, result()());

      t.is(result()()(), 321);

    });

    it('resolves the fallback once value before returning it, even if needed multiple times in a sequence', t => {

      const o = $([]);

      let calls = 0;

      const memo = $.for(o, () => () => 123, () => () => {
        calls += 1;
        return 321;
      });

      t.is(calls, 0);
      t.is(memo()()(), 321);
      t.is(calls, 1);

      o([]);

      t.is(calls, 1);
      t.is(memo()()(), 321);
      t.is(calls, 1);

      o([]);

      t.is(calls, 1);
      t.is(memo()()(), 321);
      t.is(calls, 1);

    });

    it('resolves the mapped value before returning it', t => {

      const result = $.for([1], () => () => () => 123);

      isReadable(t, result);
      isReadable(t, result()[0]);
      isReadable(t, result()[0]());

      t.is(result()[0]()(), 123);

    });

    it('returns a memo to an empty array for an empty array and missing fallback', t => {

      t.deepEqual($.for([], () => () => 123)(), []);

    });

    it('returns a memo to fallback for an empty array and a provided fallback', t => {

      t.is($.for([], () => () => 123, 123)(), 123);

    });

    it('returns a memo to the same array if all values were cached', t => {

      const external = $(0);
      const values = $([1, 2, 3]);

      const valuesWithExternal = () => {
        external();
        return values();
      };

      let calls = 0;

      const result = $.for(valuesWithExternal, value => {
        calls += 1;
        return value;
      });

      t.is(calls, 0);

      const result1 = result();

      t.is(calls, 3);
      t.deepEqual(result1, [1, 2, 3]);

      external(1);

      const result2 = result();

      t.is(calls, 3);
      t.deepEqual(result2, [1, 2, 3]);
      t.is(result1, result2);

      values([3, 2, 1]);

      const result3 = result();

      t.is(calls, 3);
      t.deepEqual(result3, [3, 2, 1]);
      t.not(result1, result3);

      values([3, 2]);

      const result4 = result();

      t.is(calls, 3);
      t.deepEqual(result4, [3, 2]);

      external(2);

      const result5 = result();

      t.is(calls, 3);
      t.deepEqual(result5, [3, 2]);
      t.is(result4, result5);

    });

    it('works with an undefined array', t => {

      const memo = $.for(undefined, t.fail);

      t.deepEqual(memo().map(call), []);

    });

    it('works with an array of non-unique values', t => {

      const array = $([1, 1, 2]);
      const args = [];

      const memo = $.for(array, value => {
        const memo = $.memo(() => {
          args.push(value);
          return value;
        });
        return memo;
      });

      t.deepEqual(memo().map(call), [1, 1, 2]);
      t.deepEqual(args, [1, 1, 2]);

      array([2, 2, 1]);

      t.deepEqual(memo().map(call), [2, 2, 1]);
      t.deepEqual(args, [1, 1, 2, 2]);

    });

  });

  describe('unkeyed', it => {

    it('calls the mapper function with an observable to the index', t => {

      const array = $(['a', 'b', 'c']);
      const argsRaw = [];
      const args = [];

      const memo = $.for(array, (value, index) => {
        isReadable(t, index);
        argsRaw.push(index);
        args.push(index());
        return value;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), ['a', 'b', 'c']);
      t.deepEqual(argsRaw.map(call), [0, 1, 2]);
      t.deepEqual(args, [0, 1, 2]);

      array(['a', 'b', 'c', 'd']);

      t.deepEqual(memo().map(call), ['a', 'b', 'c', 'd']);
      t.deepEqual(argsRaw.map(call), [0, 1, 2, 3]);
      t.deepEqual(args, [0, 1, 2, 3]);

      array(['d', 'c', 'a', 'b']);

      t.deepEqual(memo().map(call), ['d', 'c', 'a', 'b']);
      t.deepEqual(argsRaw.map(call), [2, 3, 1, 0]);
      t.deepEqual(args, [0, 1, 2, 3]);

    });

    it('calls the mapper function with the raw index in some simple cases', t => {

      const array = ['a', 'b', 'c'];
      const args = [];

      const memo = $.for(array, (value, index) => {
        args.push(index);
        return value;
      }, { unkeyed: true });

      t.deepEqual(memo(), ['a', 'b', 'c']);
      t.deepEqual(args, [0, 1, 2]);

    });

    it('calls the mapper function with an observable to the value', t => {

      const array = $(['a', 'b', 'c']);
      const argsRaw = [];
      const args = [];

      const memo = $.for(array, (value) => {
        isReadable(t, value);
        argsRaw.push(value);
        args.push(value());
        return value;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), ['a', 'b', 'c']);
      t.deepEqual(argsRaw.map(call), ['a', 'b', 'c']);
      t.deepEqual(args, ['a', 'b', 'c']);

      array(['a', 'b', 'c', 'd']);

      t.deepEqual(memo().map(call), ['a', 'b', 'c', 'd']);
      t.deepEqual(argsRaw.map(call), ['a', 'b', 'c', 'd']);
      t.deepEqual(args, ['a', 'b', 'c', 'd']);

      array(['e', 'b', 'c', 'd']);

      t.deepEqual(memo().map(call), ['e', 'b', 'c', 'd']);
      t.deepEqual(argsRaw.map(call), ['e', 'b', 'c', 'd']);
      t.deepEqual(args, ['a', 'b', 'c', 'd']);

    });

    it('disposes of any reactivity when the values array is emptied', t => {

      const array = $([1, 2, 3]);
      const args = [];

      const memo = $.for(array, value => {
        $.cleanup(() => {
          args.push(value());
        });
        return value;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), [1, 2, 3]);
      t.deepEqual(args, []);

      array([]);

      t.deepEqual(memo().map(call), []);
      t.deepEqual(args, [1, 2, 3]);

    });

    it('disposes of any reactivity when the parent computation is disposed', async t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = $.root((stack, dispose) => {
        const memo = $.memo(() => {
          const memo = $.for(array, value => {
            const memo = $.memo(() => {
              args.push(value());
            });
            $.effect(() => {
              memo();
            });
            return memo;
          }, [], { unkeyed: true });
          memo();
        });
        memo();
        return dispose;
      });

      t.deepEqual(args, []);
      await tick();
      t.deepEqual(args, [1, 2]);

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);
      await tick();
      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity when the parent effect is disposed', async t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = $.root((stack, dispose) => {
        $.effect(() => {
          const memo = $.for(array, value => {
            const memo = $.memo(() => {
              args.push(value());
            });
            $.effect(() => {
              memo();
            });
            return memo;
          }, [], { unkeyed: true });
          memo();
        });
        return dispose;
      });

      t.deepEqual(args, []);
      await tick();
      t.deepEqual(args, [1, 2]);

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);
      await tick();
      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity when the parent root is disposed', async t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const dispose = $.root((stack, dispose) => {
        const memo = $.for(array, value => {
          const memo = $.memo(() => {
            args.push(value());
          });
          $.effect(() => {
            memo();
          });
          return memo;
        }, [], { unkeyed: true });
        $.effect(() => {
          memo();
        });
        return dispose;
      });

      t.deepEqual(args, []);
      await tick();
      t.deepEqual(args, [1, 2]);

      dispose();

      t.deepEqual(args, [1, 2]);

      o1(11);
      o2(22);

      t.deepEqual(args, [1, 2]);
      await tick();
      t.deepEqual(args, [1, 2]);

    });

    it('disposes of any reactivity created for items that got deleted', async t => {

      const o1 = $(1);
      const o2 = $(2);
      const array = $([o1, o2]);
      const args = [];

      const memo = $.for(array, value => {
        const memo = $.memo(() => {
          args.push(value());
          return value();
        }, [], { unkeyed: true });
        return memo;
      });

      t.deepEqual(memo().map(call), [1, 2]);
      t.deepEqual(args, [1, 2]);

      o1(11);

      t.deepEqual(memo().map(call), [11, 2]);
      t.deepEqual(args, [1, 2, 11]);

      o2(22);

      t.deepEqual(memo().map(call), [11, 22]);
      t.deepEqual(args, [1, 2, 11, 22]);

      array([o1]);

      t.deepEqual(memo().map(call), [11]);
      t.deepEqual(args, [1, 2, 11, 22]);

      o1(111);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 2, 11, 22, 111]);

      o2(22);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 2, 11, 22, 111]);

    });

    it('disposes of any reactivity created for duplicated items', t => {

      const o = $(1);
      const array = $([o, o]);
      const args = [];

      const memo = $.for(array, value => {
        return $.memo(() => {
          args.push(value());
          return value();
        }, [], { unkeyed: true });
      });

      t.deepEqual(memo().map(call), [1, 1]);
      t.deepEqual(args, [1, 1]);

      o(11);

      t.deepEqual(memo().map(call), [11, 11]);
      t.deepEqual(args, [1, 1, 11, 11]);

      o(22);

      t.deepEqual(memo().map(call), [22, 22]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22]);

      array([o]);

      t.deepEqual(memo().map(call), [22]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22]);

      o(111);

      t.deepEqual(memo().map(call), [111]);
      t.deepEqual(args, [1, 1, 11, 11, 22, 22, 111]);

    });

    it('renders only results for unknown values', t => {

      const array = $([1, 2, 3]);
      const args = [];

      const memo = $.for(array, value => {
        args.push(value());
        return value;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), [1, 2, 3]);
      t.deepEqual(args, [1, 2, 3]);

      array([1, 2, 3, 4]);

      t.deepEqual(memo().map(call), [1, 2, 3, 4]);
      t.deepEqual(args, [1, 2, 3, 4]);

      array([1, 2, 3, 4, 5]);

      t.deepEqual(memo().map(call), [1, 2, 3, 4, 5]);
      t.deepEqual(args, [1, 2, 3, 4, 5]);

    });

    it('reuses leftover items if possible', t => {

      const array = $([1, 2, 3]);
      const argsRaw = [];
      const args = [];

      const memo = $.for(array, value => {
        argsRaw.push(value);
        args.push(value());
        return value;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), [1, 2, 3]);
      t.deepEqual(argsRaw.map(call), [1, 2, 3]);
      t.deepEqual(args, [1, 2, 3]);

      array([1, 3, 4, 5]);

      t.deepEqual(memo().map(call), [1, 3, 4, 5]);
      t.deepEqual(argsRaw.map(call), [1, 4, 3, 5]);
      t.deepEqual(args, [1, 2, 3, 5]);

    });

    it('resolves the fallback value before returning it', t => {

      const result = $.for([], () => () => 123, () => () => 321, { unkeyed: true });

      isReadable(t, result);
      isReadable(t, result());
      isReadable(t, result()());

      t.is(result()()(), 321);

    });

    it('resolves the fallback once value before returning it, even if needed multiple times in a sequence', t => {

      const o = $([]);

      let calls = 0;

      const memo = $.for(o, () => () => 123, () => () => {
        calls += 1;
        return 321;
      }, { unkeyed: true });

      t.is(calls, 0);
      t.is(memo()()(), 321);
      t.is(calls, 1);

      o([]);

      t.is(calls, 1);
      t.is(memo()()(), 321);
      t.is(calls, 1);

      o([]);

      t.is(calls, 1);
      t.is(memo()()(), 321);
      t.is(calls, 1);

    });

    it('resolves the mapped value before returning it', t => {

      const result = $.for([1], () => () => () => 123, [], { unkeyed: true });

      isReadable(t, result);
      isReadable(t, result()[0]);
      isReadable(t, result()[0]());

      t.is(result()[0]()(), 123);

    });

    it('returns a memo to an empty array for an empty array and missing fallback', t => {

      t.deepEqual($.for([], () => () => 123)(), [], { unkeyed: true });

    });

    it('returns a memo to fallback for an empty array and a provided fallback', t => {

      t.is($.for([], () => () => 123, 123)(), 123, { unkeyed: true });

    });

    it('returns a memo to the same array if all values were cached', t => {

      const external = $(0);
      const values = $([1, 2, 3]);

      const valuesWithExternal = () => {
        external();
        return values();
      };

      let calls = 0;

      const result = $.for(valuesWithExternal, value => {
        calls += 1;
        return value();
      }, [], { unkeyed: true });

      t.is(calls, 0);

      const result1 = result();

      t.is(calls, 3);
      t.deepEqual(result1, [1, 2, 3]);

      external(1);

      const result2 = result();

      t.is(calls, 3);
      t.deepEqual(result2, [1, 2, 3]);
      t.is(result1, result2);

      values([3, 2, 1]);

      const result3 = result();

      t.is(calls, 3);
      t.deepEqual(result3, [3, 2, 1]);
      t.not(result1, result3);

      values([3, 2]);

      const result4 = result();

      t.is(calls, 3);
      t.deepEqual(result4, [3, 2]);

      external(2);

      const result5 = result();

      t.is(calls, 3);
      t.deepEqual(result5, [3, 2]);
      t.is(result4, result5);

    });

    //TODO: add a test for suspending pooled results

    it('supports pooling', t => {

      const array = $([1, 2, 3]);
      const args = [];

      const count = $(0);
      let calls = 0;

      const memo = $.for(array, value => {
        args.push(value());
        $.effect(() => {
          calls += 1;
          count();
        }, { sync: true });
        return value;
      }, [], { unkeyed: true, pooled: true });

      t.deepEqual(memo().map(call), [1, 2, 3]);
      t.deepEqual(args, [1, 2, 3]);

      t.is(calls, 3);
      count(prev => prev + 1);
      t.is(calls, 6);

      array([]);

      t.deepEqual(memo().map(call), []);
      t.deepEqual(args, [1, 2, 3]);

      t.is(calls, 6);
      count(prev => prev + 1);
      t.is(calls, 6);

      array([1, 2, 3]);

      t.deepEqual(memo().map(call), [1, 2, 3]);
      t.deepEqual(args, [1, 2, 3]);

      t.is(calls, 9);
      count(prev => prev + 1);
      t.is(calls, 12);

    });

    it('works with an undefined array', t => {

      const memo = $.for(undefined, t.fail, [], { unkeyed: true });

      t.deepEqual(memo().map(call), []);

    });

    it('works with an array of non-unique values', t => {

      const array = $([1, 1, 2]);
      const args = [];

      const memo = $.for(array, value => {
        const memo = $.memo(() => {
          args.push(value());
          return value();
        });
        return memo;
      }, [], { unkeyed: true });

      t.deepEqual(memo().map(call), [1, 1, 2]);
      t.deepEqual(args, [1, 1, 2]);

      array([2, 2, 1]);

      t.deepEqual(memo().map(call), [2, 2, 1]);
      t.deepEqual(args, [1, 1, 2, 2]);

    });

  });

});
