
/* IMPORT */

import { describe } from 'fava';
import $ from '../dist/index.js';
import { tick } from './helpers.js';

/* MAIN */

describe('context', it => {

  it('can read and write context values inside an effect', async t => {

    $.effect((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        t.is($.context(name), value);

      });

    });

    await tick();

  });

  it('can read and write context values inside a memo', t => {

    const memo = $.memo((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        t.is($.context(name), value);

      });

    });

    memo();

  });

  it('can read and write context values inside a root', t => {

    $.root((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        t.is($.context(name), value);

      });

    });

  });

  it('can read and write context values inside a suspense', t => {

    $.suspense(false, (stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        t.is($.context(name), value);

      });

    });

  });

  it('can read and write context values inside a deep effect', async t => {

    $.effect((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        $.effect((stack) => {

          t.is($.context(name), value);

        });

      });

    });

    await tick();

  });

  it('can read and write context values inside a deep memo', t => {

    const memo1 = $.memo((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        const memo2 = $.memo((stack) => {

          t.is($.context(name), value);

        });
        memo2();

      });

    });

    memo1();

  });

  it('can read and write context values inside a deep root', t => {

    $.root((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        $.root((stack) => {

          t.is($.context(name), value);

        });

      });

    });

  });

  it('can read and write context values inside a deep suspense', t => {

    $.suspense(false, (stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        $.suspense(false, (stack) => {

          t.is($.context(name), value);

        });

      });

    });

  });

  it('returns whatever the function returns when setting', async t => {

    $.effect((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      const ret = $.context(context, (stack) => 123);

      t.is(ret, 123);

    });

    await tick();

  });

  it('returns undefined for unknown contexts', async t => {

    $.effect((stack) => {

      const ctx = Symbol();

      t.is($.context(ctx), undefined);

    });

    await tick();

  });

  it('supports overriding the outer context', t => {

    $.root((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const context = { [name]: value };

      $.context(context, (stack) => {

        t.is($.context(name), value);

        $.root((stack) => {

          const name2 = Symbol();
          const value2 = { foo: 321 };
          const context2 = { [name2]: value2 };

          $.context(context2, (stack) => {

            t.is($.context(name), value);
            t.is($.context(name2), value2);

          });

        });

        t.is($.context(name), value);

      });

    });

  });

  it('supports setting the value to undefined', async t => {

    $.effect((stack) => {

      const name = Symbol();
      const value = { foo: 123 };
      const contextYes = { [name]: value };
      const contextNo = { [name]: undefined };

      $.context(contextNo, (stack) => {

        $.context((stack) => {

          t.is($.context(name), undefined);

        });

      });

    });

    await tick();

  });

});
