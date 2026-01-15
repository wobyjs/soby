
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('suspense', it => {

  it('can accept a primitive falsy condition', async t => {

    const o = $(0);
    const suspended = 0;

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('can accept a primitive truthy condition', async t => {

    const o = $(0);
    const suspended = 1;

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    o(1);

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

  });

  it('can accept a function condition', async t => {

    const o = $(0);
    const suspended = $(true);
    const condition = () => !suspended();

    let calls = 0;

    $.suspense(condition, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(false);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

  });

  it('can suspend and unsuspend again when the condition changes', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(true);
    suspended(true);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

    suspended(false);
    suspended(false);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    suspended(1);
    suspended(1);

    o(2);

    t.is(calls, 2);
    await tick();
    t.is(calls, 2);

    suspended(0);
    suspended(0);

    t.is(calls, 2);
    await tick();
    t.is(calls, 3);

  });

  it('can suspend and unsuspend the execution of a an effect', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

    suspended(false);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('can suspend and unsuspend the execution of a sync effect', t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      }, { sync: true });

    });

    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);

    suspended(false);

    t.is(calls, 2);

  });

  it('can suspend and unsuspend the execution of an effect created in a context', async t => {

    const o = $(0);
    const suspended = $(false);

    let sequence = '';

    $.suspense(suspended, () => {

      $.context({}, () => {

        sequence += 'a';

        $.effect(() => {

          sequence += 'b';

          o();

        });

      });

    });

    t.is(sequence, 'a');
    await tick();
    t.is(sequence, 'ab');

    suspended(true);

    o(1);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'ab');

    suspended(false);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'abb');

  });

  it('can suspend and unsuspend the execution of an effect created in an effect', async t => {

    const o = $(0);
    const suspended = $(false);

    let sequence = '';

    $.suspense(suspended, () => {

      $.effect(() => {

        sequence += 'a';

        $.effect(() => {

          sequence += 'b';

          o();

        });

      });

    });

    t.is(sequence, '');
    await tick();
    t.is(sequence, 'ab');

    suspended(true);

    o(1);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'ab');

    suspended(false);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'abb');

  });

  it('can suspend and unsuspend the execution of an effect created in a memo', async t => {

    const o = $(0);
    const suspended = $(false);

    let sequence = '';

    $.suspense(suspended, () => {

      const memo = $.memo(() => {

        sequence += 'a';

        $.effect(() => {

          sequence += 'b';

          o();

        });

      });

      memo();

    });

    t.is(sequence, 'a');
    await tick();
    t.is(sequence, 'ab');

    suspended(true);

    o(1);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'ab');

    suspended(false);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'abb');

  });

  it('can suspend and unsuspend the execution of an effect created in a root', async t => {

    const o = $(0);
    const suspended = $(false);

    let sequence = '';

    $.suspense(suspended, () => {

      $.root(() => {

        sequence += 'a';

        $.effect(() => {

          sequence += 'b';

          o();

        });

      });

    });

    t.is(sequence, 'a');
    await tick();
    t.is(sequence, 'ab');

    suspended(true);

    o(1);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'ab');

    suspended(false);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'abb');

  });

  it('can suspend and unsuspend the execution of an effect created in a for', async t => {

    const o = $(0);
    const suspended = $(false);
    const array = [1, 2, 3];

    let calls = 0;

    $.suspense(suspended, () => {
      const memo = $.for(array, () => {
        $.effect(() => {
          calls += 1;
          o();
        });
      }, [], { unkeyed: true });
      memo();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 3);

    suspended(true);

    o(1);

    t.is(calls, 3);
    await tick();
    t.is(calls, 3);

    suspended(false);

    t.is(calls, 3);
    await tick();
    t.is(calls, 6);

  });

  it('can suspend and unsuspend the execution of an effect created in a forValue', async t => {

    const o = $(0);
    const suspended = $(false);
    const array = [1, 2, 3];

    let calls = 0;

    $.suspense(suspended, () => {
      const memo = $.for(array, () => {
        $.effect(() => {
          calls += 1;
          o();
        });
      }, [], { unkeyed: true });
      memo();
    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 3);

    suspended(true);

    o(1);

    t.is(calls, 3);
    await tick();
    t.is(calls, 3);

    suspended(false);

    t.is(calls, 3);
    await tick();
    t.is(calls, 6);

  });

  it('can suspend and unsuspend the execution of an effect created in a suspense', async t => {

    const o = $(0);
    const suspended = $(false);

    let sequence = '';

    $.suspense(suspended, () => {

      $.suspense(false, () => {

        sequence += 'a';

        $.effect(() => {

          sequence += 'b';

          o();

        });

      });

    });

    t.is(sequence, 'a');
    await tick();
    t.is(sequence, 'ab');

    suspended(true);

    o(1);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'ab');

    suspended(false);

    t.is(sequence, 'ab');
    await tick();
    t.is(sequence, 'abb');

  });

  it('can unsuspend only when all parents are unsuspended too', async t => {

    const o = $(0);
    const a = $(true);
    const b = $(true);
    const c = $(true);

    let sequence = '';

    $.suspense(a, () => {

      $.effect(() => {

        sequence += 'a';

        o();

      });

      $.suspense(b, () => {

        $.effect(() => {

          sequence += 'b';

          o();

        });

        $.suspense(c, () => {

          $.effect(() => {

            sequence += 'c';

            o();

          });

        });

      });

    });

    t.is(sequence, '');
    await tick();
    t.is(sequence, '');

    c(false);

    t.is(sequence, '');
    await tick();
    t.is(sequence, '');

    b(false);

    t.is(sequence, '');
    await tick();
    t.is(sequence, '');

    a(false);

    t.is(sequence, '');
    await tick();
    t.is(sequence, 'abc');

  });

  it('can suspend a lazily-crated effect', async t => {

    const o = $(0);
    const lazy = $(false);
    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {

      const memo = $.memo(() => {

        if (!lazy()) return;

        $.effect(() => {

          calls += 1;

          o();

        });

      });

      $.effect(() => {

        memo();

      }, { suspense: false });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    lazy(true);

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

  });

  it('can suspend a lazily-crated suspense', async t => {

    const o = $(0);
    const lazy = $(false);
    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {

      const memo = $.memo(() => {

        if (!lazy()) return;

        $.suspense(false, () => {

          $.effect(() => {

            calls += 1;

            o();

          });

        });

      });

      $.effect(() => {

        memo();

      }, { suspense: false });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    lazy(true);

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

  });

  it('can not suspend an effect with suspense disabled', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      }, { suspense: false });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

    suspended(false);

    t.is(calls, 2);
    await tick();
    t.is(calls, 2);

  });

  it('can not suspend a memo', t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    const memo = $.suspense(suspended, () => {

      return $.memo(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    t.is(memo(), undefined);
    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);
    t.is(memo(), undefined);
    t.is(calls, 2);

    suspended(false);

    t.is(calls, 2);
    t.is(memo(), undefined);
    t.is(calls, 2);

  });

  it('does not call immediately an unsuspended async effect', async t => {

    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {
      $.effect(() => {
        calls += 1;
      });
    });

    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);

    await tick();

    t.is(calls, 1);

  });

  it('does call immediately a sync effect', async t => {

    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {
      $.effect(() => {
        calls += 1;
      }, { sync: true });
    });

    t.is(calls, 0);

    suspended(false);

    t.is(calls, 1);

  });

  it('does call immediately an init effect', async t => {

    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {
      $.effect(() => {
        calls += 1;
      }, { sync: 'init' });
    });

    t.is(calls, 0);

    suspended(false);

    t.is(calls, 1);

  });

  it('returns whatever the function returns', t => {

    const result = $.suspense(false, () => {

      return 123;

    });

    t.is(result, 123);

  });

  it('starts unsuspended with no parent and a false condition', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.effect(() => {

        calls += 1;

        o();

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

    suspended(false);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('starts unsuspended with an unsuspended parent and a false condition', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(false, () => {

      $.suspense(suspended, () => {

        $.effect(() => {

          calls += 1;

          o();

        });

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    suspended(true);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 1);

    suspended(false);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('starts suspended with a suspended parent and a false condition', async t => {

    const o = $(0);
    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {

      $.suspense(false, () => {

        $.effect(() => {

          calls += 1;

          o();

        });

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);
    await tick();
    t.is(calls, 1);

    o(1);

    t.is(calls, 1);
    await tick();
    t.is(calls, 2);

  });

  it('starts suspended with an unuspended parent and a true condition', async t => {

    const o = $(0);
    const suspended = $(false);

    let calls = 0;

    $.suspense(suspended, () => {

      $.suspense(true, () => {

        $.effect(() => {

          calls += 1;

          o();

        });

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

  });

  it('starts suspended with a suspended parent and a true condition', async t => {

    const o = $(0);
    const suspended = $(true);

    let calls = 0;

    $.suspense(suspended, () => {

      $.suspense(true, () => {

        $.effect(() => {

          calls += 1;

          o();

        });

      });

    });

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

    suspended(false);

    t.is(calls, 0);
    await tick();
    t.is(calls, 0);

  });

  it('supports cleaning up suspended, but executed, effects', async t => {

    const suspended = $(false);

    let calls = 0;

    await $.root(async (stack, dispose) => {

      $.suspense(suspended, () => {

        $.effect(() => {

          $.cleanup(() => {

            calls += 1;

          });

        });

      });

      await tick();

      suspended(true);

      t.is(calls, 0);

      dispose();

      t.is(calls, 1);

    });

  });

  it('supports not cleaning suspended, and never executed, effects', async t => {

    const suspended = $(true);

    let calls = 0;

    await $.root(async (stack, dispose) => {

      $.suspense(suspended, () => {

        $.effect(() => {

          $.cleanup(() => {

            calls += 1;

          });

        });

      });

      await tick();

      dispose();

      t.is(calls, 0);

    });

  });

  it('supports unsuspending with a disposed always-suspended effect without causing the effect to be executed', async t => {

    const suspended = $(true);

    let calls = 0;

    await $.root(async (stack, dispose) => {

      $.suspense(suspended, () => {

        $.effect(() => {

          $.cleanup(() => {

            calls += 1;

          });
        });
      });

      await tick();

      suspended(true);

      t.is(calls, 0);

      dispose();

      t.is(calls, 0);

    });

  });

  it('supports unsuspending with a disposed always-suspended effect without causing the effect to be executed', async t => {

    const suspended = $(true);

    let calls = 0;

    await $.root(async (stack, dispose) => {

      $.suspense(suspended, () => {

        $.effect(() => {

          $.cleanup(() => {

            calls += 1;

          });
        });
      });

      await tick();

      dispose();

      t.is(calls, 0);

    });

  });

});
