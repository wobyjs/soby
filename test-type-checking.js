// Test file to verify the Observable type checking functionality

import $ from './dist/index.js';

console.log('Testing Observable type checking functionality...');

// Test 1: String type checking
console.log('\n=== Test 1: String type checking ===');
try {
    // Using the observable method from the main library
    const stringObservable = $.observable('initial', { type: 'string' });

    console.log('Setting valid string value...');
    stringObservable('new value');
    console.log('Success!');

    console.log('Setting invalid number value...');
    stringObservable(123); // This should throw an error
    console.log('ERROR: Should have thrown an error!');
} catch (error) {
    console.log('Error caught as expected:', error.message);
}

// Test 2: Number type checking
console.log('\n=== Test 2: Number type checking ===');
try {
    const numberObservable = $.observable(0, { type: 'number' });

    console.log('Setting valid number value...');
    numberObservable(42);
    console.log('Success!');

    console.log('Setting invalid string value...');
    numberObservable('string'); // This should throw an error
    console.log('ERROR: Should have thrown an error!');
} catch (error) {
    console.log('Error caught as expected:', error.message);
}

// Test 3: No type checking (default behavior)
console.log('\n=== Test 3: No type checking (default) ===');
try {
    const noCheckObservable = $.observable('initial');

    console.log('Setting string value...');
    noCheckObservable('new value');
    console.log('Success!');

    console.log('Setting number value (no type checking)...');
    noCheckObservable(123); // This should work since no type checking
    console.log('Success! (No type checking enforced)');
} catch (error) {
    console.log('Error caught:', error.message);
}

console.log('\nAll tests completed!');