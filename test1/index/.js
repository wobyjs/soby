// Main test index file that imports all split test files
import { $Tests } from "./core/$.test.js";
import { batchTests } from "./reactivity/batch.test.js";
import { effectTests } from "./reactivity/effect.test.js";
import { memoTests } from "./reactivity/memo.test.js";
import { observableTests } from "./core/observable.test.js";
import { storeTests } from "./store/store.test.js";
import { utilitiesTests } from "./utils/utilities.test.js";

// Export all test suites
export {
  $Tests,
  batchTests,
  effectTests,
  memoTests,
  observableTests,
  storeTests,
  utilitiesTests
};

// Run all tests by importing them
// Each imported module will automatically register its tests