// Tests for the store function
import { describe, it } from "fava";
import { store, observable, effect } from "../../src/index.js";

// Test for store function
const storeTests = describe("store");

storeTests("should create a store", (t) => {
  const s = store({ a: 1, b: 2 });
  t.is(s.a, 1);
  t.is(s.b, 2);
});

storeTests("should update store values", (t) => {
  const s = store({ a: 1, b: 2 });
  t.is(s.a, 1);
  t.is(s.b, 2);

  s.a = 3;
  t.is(s.a, 3);
  t.is(s.b, 2);
});

storeTests("should work with nested objects", (t) => {
  const s = store({ a: { b: { c: 1 } } });
  t.is(s.a.b.c, 1);

  s.a.b.c = 2;
  t.is(s.a.b.c, 2);
});

storeTests("should notify effects when updated", (t) => {
  const s = store({ a: 1 });
  let count = 0;

  effect(() => {
    count++;
    s.a;
  });

  t.is(count, 1);
  s.a = 2;
  t.is(count, 2);
});

storeTests("should preserve object references appropriately", (t) => {
  const initialData = { x: 1, y: { z: 2 } };
  const s = store(initialData);
  
  t.is(s.x, 1);
  t.deepEqual(s.y, { z: 2 });
});

export { storeTests };