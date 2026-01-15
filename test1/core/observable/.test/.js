// Tests for the observable function
import { describe, it } from "fava";
import { observable, effect } from "../../src/index.js";

// Test for observable function
const observableTests = describe("observable");

observableTests("should create an observable", (t) => {
  const o = observable(1);
  t.is(o(), 1);
});

observableTests("should update the value", (t) => {
  const o = observable(1);
  t.is(o(), 1);
  o(2);
  t.is(o(), 2);
});

observableTests("should notify effects when updated", (t) => {
  const o = observable(1);
  let count = 0;

  effect(() => {
    count++;
    o();
  });

  t.is(count, 1);
  o(2);
  t.is(count, 2);
});

observableTests("should return the same value until updated", (t) => {
  const o = observable(1);
  t.is(o(), 1);
  t.is(o(), 1);
  t.is(o(), 1);
});

observableTests("should work with complex values", (t) => {
  const obj = { a: 1, b: 2 };
  const o = observable(obj);
  
  t.deepEqual(o(), obj);
  
  const newObj = { a: 2, b: 3 };
  o(newObj);
  t.deepEqual(o(), newObj);
});

export { observableTests };