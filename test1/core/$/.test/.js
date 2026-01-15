// Tests for the $ function
import { describe, it } from "fava";
import { $, observable } from "../../src/index.js";

// Test for $ function
const $Tests = describe("$");

$Tests("should create a reactive property", (t) => {
  const o = observable(1);
  const r = $(o);
  t.is(r(), 1);
  o(2);
  t.is(r(), 2);
});

$Tests("should be untrackable", (t) => {
  const o = observable(1);
  let count = 0;
  const r = $(o);
  $(() => {
    count++;
    t.is(r(), 1);
  });
  o(2);
  t.is(count, 1);
});

$Tests("should be readonly", (t) => {
  const o = observable(1);
  const r = $(o);
  t.throws(() => r(2), TypeError);
});

export { $Tests };