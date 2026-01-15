// Tests for the untrack function
import { describe, it } from "fava";
import { untrack, observable, effect } from "../../src/index.js";

// Test for untrack function
const untrackTests = describe("untrack");

untrackTests("should prevent tracking in effects", (t) => {
  let effectCount = 0;
  const trackedObs = observable(1);
  const untrackedObs = observable(10);

  effect(() => {
    effectCount++;
    trackedObs();
    untrack(() => {
      untrackedObs(); // This should not trigger the effect when untrackedObs changes
    });
  });

  t.is(effectCount, 1);
  
  trackedObs(2); // This should trigger the effect
  t.is(effectCount, 2);
  
  untrackedObs(20); // This should NOT trigger the effect
  t.is(effectCount, 2);
});

untrackTests("should return the result of the function", (t) => {
  const obs = observable(5);
  const result = untrack(() => obs() * 2);
  
  t.is(result, 10);
});

untrackTests("should work with nested untrack calls", (t) => {
  let effectCount = 0;
  const obs1 = observable(1);
  const obs2 = observable(2);

  effect(() => {
    effectCount++;
    obs1();
    untrack(() => {
      obs2();
      untrack(() => {
        return obs2() * 2;
      });
    });
  });

  t.is(effectCount, 1);
  
  obs1(2); // Should trigger effect
  t.is(effectCount, 2);
  
  obs2(5); // Should not trigger effect
  t.is(effectCount, 2);
});

export { untrackTests };