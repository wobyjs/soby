// Tests for the readonly function
import { describe, it } from "fava";
import { readonly, observable } from "../../src/index.js";

// Test for readonly function
const readonlyTests = describe("readonly");

readonlyTests("should make observables readonly", (t) => {
  const source = observable(42);
  const readOnlyObs = readonly(source);
  
  t.is(readOnlyObs(), 42);
  
  // Should not be able to set values on readonly
  t.throws(() => readOnlyObs(100), TypeError);
});

readonlyTests("should reflect changes from source", (t) => {
  const source = observable(1);
  const readOnlyObs = readonly(source);
  
  t.is(readOnlyObs(), 1);
  
  source(2);
  t.is(readOnlyObs(), 2);
  
  source(42);
  t.is(readOnlyObs(), 42);
});

readonlyTests("should work with complex values", (t) => {
  const source = observable({ a: 1, b: 2 });
  const readOnlyObs = readonly(source);
  
  t.deepEqual(readOnlyObs(), { a: 1, b: 2 });
  
  source({ a: 3, b: 4 });
  t.deepEqual(readOnlyObs(), { a: 3, b: 4 });
});

export { readonlyTests };