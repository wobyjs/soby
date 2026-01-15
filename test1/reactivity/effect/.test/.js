// Tests for the effect function
import { describe, it } from "fava";
import { effect, observable, untrack } from "../../src/index.js";

// Test for effect function
const effectTests = describe("effect");

effectTests("should run initially", (t) => {
  let count = 0;
  const a = observable(1);

  effect(() => {
    count++;
    a();
  });

  t.is(count, 1);
});

effectTests("should run when dependencies change", (t) => {
  let count = 0;
  const a = observable(1);

  effect(() => {
    count++;
    a();
  });

  t.is(count, 1);
  a(2);
  t.is(count, 2);
});

effectTests("should dispose of effects", (t) => {
  let count = 0;
  const a = observable(1);

  const dispose = effect(() => {
    count++;
    a();
  });

  t.is(count, 1);
  a(2);
  t.is(count, 2);

  dispose();
  a(3);
  t.is(count, 2); // Should not increase after disposal
});

effectTests("should not run when dependencies change if disposed", (t) => {
  let count = 0;
  const a = observable(1);

  const dispose = effect(() => {
    count++;
    a();
  });

  t.is(count, 1);
  dispose();
  a(2);
  t.is(count, 1); // Should not increase after disposal
});

export { effectTests };