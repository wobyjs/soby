#!/usr/bin/env node

/**
 * Run all soby tests individually to avoid conflicts
 * This prevents one failing test from stopping the entire suite
 */

import { spawn } from 'child_process';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const testDir = __dirname;

// Test files to run (excluding index.js and files with 'x' in name)
const testFiles = [
    '$.js',
    'batch.js',
    'boolean.js',
    'cleanup.js',
    'context.js',
    'dispose.js',
    'effect.js',
    'for.js',
    'get.js',
    'if.js',
    'isBatching.js',
    'isObservable.js',
    'isStore.js',
    'memo.js',
    'observable.js',
    'owner.js',
    'readonly.js',
    'resolve.js',
    'root.js',
    'store.js',
    'suspended.js',
    'suspense.js',
    'switch.js',
    'ternary.js',
    'tick.js',
    'tryCatch.js',
    'untrack.js',
    'untracked.js',
    'with.js',
    'S-like propagation.js'
];

async function runTest(testFile) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Running ${testFile}...`);

        const child = spawn('node', [join(testDir, testFile)], {
            stdio: 'inherit',
            cwd: testDir
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${testFile} passed`);
                resolve({ file: testFile, passed: true });
            } else {
                console.log(`❌ ${testFile} failed with code ${code}`);
                resolve({ file: testFile, passed: false, code });
            }
        });

        child.on('error', (error) => {
            console.log(`💥 ${testFile} errored: ${error.message}`);
            resolve({ file: testFile, passed: false, error });
        });
    });
}

async function runAllTests() {
    console.log('🚀 Starting individual test execution...\n');

    const results = [];
    let passed = 0;
    let failed = 0;

    // Run tests sequentially to avoid resource conflicts
    for (const testFile of testFiles) {
        const result = await runTest(testFile);
        results.push(result);

        if (result.passed) {
            passed++;
        } else {
            failed++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total tests: ${testFiles.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success rate: ${((passed / testFiles.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Failed tests:');
        results
            .filter(r => !r.passed)
            .forEach(r => console.log(`  - ${r.file}`));
    }

    console.log('\n🏁 Test execution completed!');

    // Exit with failure code if any tests failed
    process.exit(failed > 0 ? 1 : 0);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Test execution interrupted');
    process.exit(1);
});

// Run the tests
runAllTests().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});