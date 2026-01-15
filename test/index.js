// Run all tests individually to avoid conflicts
// This prevents one failing test from stopping the entire suite

import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Test files that work when run individually
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

async function runAllTests() {
    console.log('🚀 Running all tests individually...');

    let passed = 0;
    let failed = 0;

    for (const testFile of testFiles) {
        console.log(`\n🧪 Running ${testFile}...`);

        try {
            const child = spawn('node', [join(__dirname, testFile)], {
                stdio: 'inherit',
                cwd: __dirname
            });

            const exitCode = await new Promise((resolve) => {
                child.on('close', resolve);
            });

            if (exitCode === 0) {
                console.log(`✅ ${testFile} passed`);
                passed++;
            } else {
                console.log(`❌ ${testFile} failed`);
                failed++;
            }
        } catch (error) {
            console.log(`💥 ${testFile} error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(40));
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    console.log(`🎯 Success rate: ${((passed / testFiles.length) * 100).toFixed(1)}%`);

    process.exit(failed > 0 ? 1 : 0);
}

runAllTests();