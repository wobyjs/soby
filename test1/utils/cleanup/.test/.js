// Tests for the cleanup function
import { describe, it } from "fava";
import { cleanup, effect, observable } from "../../src/index.js";

// Test for cleanup function
const cleanupTests = describe("cleanup");

cleanupTests("should run cleanup function when effect is disposed", (t) => {
  const obs = observable(1);
  let cleanupCalled = false;
  
  const dispose = effect(() => {
    obs();
    cleanup(() => {
      cleanupCalled = true;
    });
  });
  
  t.false(cleanupCalled);
  dispose();
  t.true(cleanupCalled);
});

cleanupTests("should run cleanup when effect re-runs", (t) => {
  const obs = observable(1);
  let cleanupCount = 0;
  
  effect(() => {
    obs();
    cleanup(() => {
      cleanupCount++;
    });
  });
  
  t.is(cleanupCount, 0);
  obs(2); // This should trigger the effect to re-run, calling the previous cleanup
  t.is(cleanupCount, 1);
  obs(3); // Another re-run
  t.is(cleanupCount, 2);
});

cleanupTests("should not run cleanup initially", (t) => {
  const obs = observable(1);
  let cleanupCount = 0;
  
  effect(() => {
    obs();
    cleanup(() => {
      cleanupCount++;
    });
  });
  
  t.is(cleanupCount, 0); // Cleanup shouldn't run on initial execution
});

export { cleanupTests };