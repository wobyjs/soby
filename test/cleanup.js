
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('cleanup', it => {

  it('calls callbacks in reverse order', async t => {

    let sequence = '';

    const dispose = $.root((stack, dispose) => {

      $.effect(() => {

        $.cleanup(() => sequence += 'a');

        $.effect(() => {

          $.cleanup(() => sequence += 'A');

          $.cleanup(() => sequence += 'B');

        });

        $.effect(() => {

          $.cleanup(() => sequence += 'C');

          $.cleanup(() => sequence += 'D');

        });

        $.cleanup(() => sequence += 'b');

      });

      return dispose;

    });

    await tick();

    t.is(sequence, '');

    dispose();

    t.is(sequence, 'DCBAba');

  });

  it('does not cause the parent memo to re-execute', t => {

    const disposed = $(false);

    let calls = 0;

    const memo = $.memo(() => {

      calls += 1;

      if (disposed()) return;

      const o = $(0);

      o(0);

      $.cleanup(() => {

        o(o() + Math.random());

      });

    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    disposed(true);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);

  });

  it('does not cause the parent effect to re-execute', async t => {

    const disposed = $(false);

    let calls = 0;

    $.effect(() => {

      calls += 1;

      if (disposed()) return;

      const o = $(0);

      o(0);

      $.cleanup(() => {

        o(o() + Math.random());

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    disposed(true);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('registers a function to be called when the parent computation is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      const memo = $.memo(() => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      });

      memo();
      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent computation updates', t => {

    const o = $(0);

    let sequence = '';

    const memo = $.memo(() => {

      o();

      $.cleanup(() => {
        sequence += 'a';
      });

      $.cleanup(() => {
        sequence += 'b';
      });

    });

    t.is(memo(), undefined);
    t.is(sequence, '');

    o(1);

    t.is(memo(), undefined);
    t.is(sequence, 'ba');

    o(2);

    t.is(memo(), undefined);
    t.is(sequence, 'baba');

    o(3);

    t.is(memo(), undefined);
    t.is(sequence, 'bababa');

  });

  it('registers a function to be called when the parent effect is disposed', async t => {

    let sequence = '';

    await $.root(async (stack, dispose) => {

      $.effect(() => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      });

      await tick();

      dispose();

      t.is(sequence, 'ba');

    });

  });

  it('registers a function to be called when the parent init effect is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.effect(() => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      }, { sync: 'init' });

      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent sync effect is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.effect(() => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      }, { sync: true });

      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent sync memo is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.memo(() => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      }, { sync: true });

      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent context is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.context({}, () => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      });

      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent suspense is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.suspense(false, () => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      });

      dispose();

    });

    t.is(sequence, 'ba');

  });

  it('registers a function to be called when the parent effect updates', async t => {

    const o = $(0);

    let sequence = '';

    $.effect(() => {

      o();

      $.cleanup(() => {
        sequence += 'a';
      });

      $.cleanup(() => {
        sequence += 'b';
      });

    });

    await tick();

    t.is(sequence, '');

    o(1);

    await tick();

    t.is(sequence, 'ba');

    o(2);

    await tick();

    t.is(sequence, 'baba');

    o(3);

    await tick();

    t.is(sequence, 'bababa');

  });

  it('registers a function to be called when the parent root is disposed', t => {

    $.root((stack, dispose) => {

      const o = $(0);

      let sequence = '';

      $.cleanup(() => {
        sequence += 'a';
      });

      $.cleanup(() => {
        sequence += 'b';
      });

      t.is(sequence, '');

      o(1);
      o(2);

      t.is(sequence, '');

      dispose();

      t.is(sequence, 'ba');

      dispose();
      dispose();
      dispose();

      t.is(sequence, 'ba');

    });

  });

  it('registers a function to be called when the parent suspense is disposed', t => {

    let sequence = '';

    $.root((stack, dispose) => {

      $.suspense(false, () => {

        $.cleanup(() => {
          sequence += 'a';
        });

        $.cleanup(() => {
          sequence += 'b';
        });

      });

      dispose();

      t.is(sequence, 'ba');

    });

  });

  it('returns undefined', t => {

    const result1 = $.cleanup(() => { });
    const result2 = $.cleanup(() => 123);
    const result3 = $.cleanup(() => () => { });

    t.is(result1, undefined);
    t.is(result2, undefined);
    t.is(result3, undefined);

  });

  it('supports a callable object', async t => {

    const o = $(0);

    let sequence = '';

    $.effect(() => {

      o();

      const onCleanupA = {
        call: thiz => {
          sequence += 'a';
          t.is(thiz, onCleanupA);
        }
      };

      const onCleanupB = {
        call: thiz => {
          sequence += 'b';
          t.is(thiz, onCleanupB);
        }
      };

      $.cleanup(onCleanupA);

      $.cleanup(onCleanupB);

    });

    await tick();

    t.is(sequence, '');

    o(1);

    await tick();

    t.is(sequence, 'ba');

    o(2);

    await tick();

    t.is(sequence, 'baba');

    o(3);

    await tick();

    t.is(sequence, 'bababa');

  });

});
