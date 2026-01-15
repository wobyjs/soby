// Tests for the isObservable function
import { describe, it } from "fava";
import { isObservable, observable } from "../../src/index.js";

// Test for isObservable function
const isObservableTests = describe("isObservable");

isObservableTests("should detect observables", (t) => {
  const obs = observable(42);
  t.true(isObservable(obs));
});

isObservableTests("should return false for non-observables", (t) => {
  t.false(isObservable(42));
  t.false(isObservable("string"));
  t.false(isObservable({}));
  t.false(isObservable([]));
  t.false(isObservable(null));
  t.false(isObservable(undefined));
  t.false(isObservable(() => {}));
});

isObservableTests("should work with different types of values", (t) => {
  t.true(isObservable(observable(1)));
  t.true(isObservable(observable("test")));
  t.true(isObservable(observable({})));
  t.true(isObservable(observable([])));
  t.true(isObservable(observable(null)));
});

export { isObservableTests };