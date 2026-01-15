
/* IMPORT */

import { setTimeout as delay } from 'node:timers/promises';
import $ from '../dist/index.js';
import isObservableFrozen from '../dist/methods/is_observable_frozen.js';
import isObservableReadable from '../dist/methods/is_observable_readable.js';
import isObservableWritable from '../dist/methods/is_observable_writable.js';

/* HELPERS */

const isFrozen = (t, value) => {

  t.true($.isObservable(value));
  t.true(isObservableFrozen(value));
  t.true(typeof value.read === 'undefined');
  t.true(typeof value.write === 'undefined');
  t.true(typeof value.value === 'undefined');
  t.true(typeof value.bind === 'function');
  t.true(typeof value.apply === 'function');

  t.throws(() => value(Math.random()), { message: 'A readonly Observable can not be updated' });

};

const isReadable = (t, value) => {

  t.true($.isObservable(value));
  t.true(isObservableFrozen(value) || isObservableReadable(value));
  // t.true ( isObservableReadable ( value ) );
  t.true(typeof value.read === 'undefined');
  t.true(typeof value.write === 'undefined');
  t.true(typeof value.value === 'undefined');
  t.true(typeof value.bind === 'function');
  t.true(typeof value.apply === 'function');

  t.throws(() => value(Math.random()), { message: 'A readonly Observable can not be updated' });

};

const isWritable = (t, value) => {

  t.true($.isObservable(value));
  t.true(isObservableWritable(value));
  t.true(typeof value.read === 'undefined');
  t.true(typeof value.write === 'undefined');
  t.true(typeof value.value === 'undefined');
  t.true(typeof value.bind === 'function');
  t.true(typeof value.apply === 'function');

};

const call = fn => {

  return fn();

};

const settle = value => {

  let resolvedValue;

  $.effect(() => {

    let temp = value;

    while (typeof temp === 'function') {

      temp = temp();

    }

    resolvedValue = temp;

  }, { sync: true });

  return resolvedValue;

};

const tick = () => {

  return delay(1);

};

/* EXPORT */

export { isFrozen, isReadable, isWritable, call, settle, tick };
