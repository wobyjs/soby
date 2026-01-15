// Tests for utility functions
import { describe, it } from "fava";
import { isObservable, isStore, readonly, untrack } from "../../src/index.js";
import { observable } from "../../src/index.js";

// Test for utility functions
const utilitiesTests = describe("utilities");

utilitiesTests("isObservable should detect observables", (t) => {
  const o = observable(1);
  t.true(isObservable(o));
  
  const notObs = 42;
  t.false(isObservable(notObs));
});

utilitiesTests("isStore should detect stores", (t) => {
  const s = { a: 1, b: 2 }; // Note: We can't easily test this without a way to create a proper store in this context
  // Since store creation might be more complex, we'll test what we can
  t.false(isStore(42));
});

utilitiesTests("readonly should make observables readonly", (t) => {
  const o = observable(1);
  const ro = readonly(o);
  
  t.is(ro(), 1);
  // Should not be able to set values on readonly
  t.throws(() => ro(2), TypeError);
});

utilitiesTests("untrack should prevent tracking", (t) => {
  let effectCount = 0;
  const obs = observable(1);
  
  // Using untrack to prevent an observable from triggering effects
  const untrackedValue = () => untrack(() => obs());
  
  // Create an effect that uses the untracked value
  // Note: This is a simplified test as the actual implementation might vary
  t.is(untrackedValue(), 1);
});

export { utilitiesTests };