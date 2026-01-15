// Tests for the batch function
import { describe, it } from "fava";
import { batch, observable, effect } from "../../src/index.js";

// Test for batch function
const batchTests = describe("batch");

batchTests("should batch updates", (t) => {
  let count = 0;
  const a = observable(1);
  const b = observable(2);

  effect(() => {
    count++;
    a();
    b();
  });

  t.is(count, 1);

  batch(() => {
    a(2);
    b(3);
  });

  t.is(count, 2);
  t.is(a(), 2);
  t.is(b(), 3);
});

batchTests("should not batch nested calls", (t) => {
  let count = 0;
  const a = observable(1);

  effect(() => {
    count++;
    a();
  });

  t.is(count, 1);

  batch(() => {
    a(2);
    t.is(a(), 2); // Should be updated immediately within the batch
  });

  t.is(count, 2);
});

batchTests("should return the result of the function", (t) => {
  const result = batch(() => {
    return 42;
  });

  t.is(result, 42);
});

export { batchTests };