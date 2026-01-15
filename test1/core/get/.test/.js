// Tests for the get function
import { describe, it } from "fava";
import { get, observable } from "../../src/index.js";

// Test for get function
const getTests = describe("get");

getTests("should get value from observable", (t) => {
  const o = observable(42);
  t.is(get(o), 42);
});

getTests("should work with plain values", (t) => {
  t.is(get(123), 123);
});

getTests("should work with functions", (t) => {
  const o = observable(5);
  const result = get(() => o() * 2);
  t.is(result, 10);
});

export { getTests };