// Tests for the memo function
import { describe, it } from "fava";
import { memo, observable, effect } from "../../src/index.js";

// Test for memo function
const memoTests = describe("memo");

memoTests("should memoize computed values", (t) => {
  let computeCount = 0;
  const a = observable(1);
  const b = observable(2);

  const sum = memo(() => {
    computeCount++;
    return a() + b();
  });

  t.is(sum(), 3);
  t.is(computeCount, 1);

  t.is(sum(), 3);
  t.is(computeCount, 1); // Should not recompute if dependencies haven't changed

  a(2);
  t.is(sum(), 4);
  t.is(computeCount, 2); // Should recompute when dependency changes
});

memoTests("should only recompute when dependencies change", (t) => {
  let computeCount = 0;
  const a = observable(1);
  const b = observable(2);

  const sum = memo(() => {
    computeCount++;
    return a() + b();
  });

  t.is(sum(), 3);
  t.is(computeCount, 1);

  b(3);
  t.is(sum(), 4);
  t.is(computeCount, 2); // Should recompute when b changes
});

memoTests("should work with effects", (t) => {
  let computeCount = 0;
  let effectCount = 0;
  const a = observable(1);

  const doubled = memo(() => {
    computeCount++;
    return a() * 2;
  });

  effect(() => {
    effectCount++;
    doubled();
  });

  t.is(effectCount, 1);
  t.is(computeCount, 1);

  a(2);
  t.is(effectCount, 2); // Effect should run when memoized value changes
  t.is(computeCount, 2); // Memo should recompute
});

export { memoTests };