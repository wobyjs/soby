// Tests for the isStore function
import { describe, it } from "fava";
import { isStore, store } from "../../src/index.js";

// Test for isStore function
const isStoreTests = describe("isStore");

isStoreTests("should detect stores", (t) => {
  const s = store({ a: 1, b: 2 });
  t.true(isStore(s));
});

isStoreTests("should return false for non-stores", (t) => {
  t.false(isStore(42));
  t.false(isStore("string"));
  t.false(isStore({}));
  t.false(isStore([]));
  t.false(isStore(null));
  t.false(isStore(undefined));
  t.false(isStore(() => {}));
});

isStoreTests("should work with different store structures", (t) => {
  t.true(isStore(store({})));
  t.true(isStore(store({ a: 1 })));
  t.true(isStore(store({ nested: { value: true } })));
});

export { isStoreTests };