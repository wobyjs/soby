// Tests for the root function
import { describe, it } from "fava";
import { root, observable, effect } from "../../src/index.js";

// Test for root function
const rootTests = describe("root");

rootTests("should create a root scope", (t) => {
  let disposed = false;
  const cleanup = () => {
    disposed = true;
  };

  const dispose = root((dispose) => {
    effect(() => {
      const obs = observable(1);
      obs();
    });
    return cleanup;
  });

  t.false(disposed);
  dispose();
  t.true(disposed);
});

rootTests("should dispose of all inner effects", (t) => {
  let effectCount = 0;
  let disposed = false;
  
  const dispose = root((dispose) => {
    const obs = observable(1);
    
    effect(() => {
      effectCount++;
      obs();
    });
    
    return () => {
      disposed = true;
    };
  });

  t.is(effectCount, 1);
  const obs2 = observable(2);
  obs2(); // Trigger any potential updates
  t.is(effectCount, 1); // Should not have increased
  
  dispose();
  t.true(disposed);
});

export { rootTests };