// Tests for the boolean function
import { describe, it } from "fava";
import { boolean, observable } from "../../src/index.js";

// Test for boolean function
const booleanTests = describe("boolean");

booleanTests("should convert values to boolean observables", (t) => {
  const boolObs = boolean(observable(true));
  t.is(boolObs(), true);
});

booleanTests("should handle falsy values", (t) => {
  const falseBool = boolean(observable(false));
  t.is(falseBool(), false);
  
  const zeroBool = boolean(observable(0));
  t.is(zeroBool(), false);
  
  const nullBool = boolean(observable(null));
  t.is(nullBool(), false);
  
  const undefinedBool = boolean(observable(undefined));
  t.is(undefinedBool(), false);
});

booleanTests("should handle truthy values", (t) => {
  const trueBool = boolean(observable(true));
  t.is(trueBool(), true);
  
  const oneBool = boolean(observable(1));
  t.is(oneBool(), true);
  
  const strBool = boolean(observable("hello"));
  t.is(strBool(), true);
  
  const objBool = boolean(observable({}));
  t.is(objBool(), true);
});

booleanTests("should update when source changes", (t) => {
  const source = observable(0);
  const boolObs = boolean(source);
  
  t.is(boolObs(), false); // 0 is falsy
  
  source(1);
  t.is(boolObs(), true); // 1 is truthy
  
  source("");
  t.is(boolObs(), false); // empty string is falsy
});

export { booleanTests };