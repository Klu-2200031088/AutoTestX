// This script runs inside the Docker container to simulate a test execution
const testName = process.env.TEST_NAME || 'Unknown Test';
const filePath = process.env.FILE_PATH || 'no/path';
const failureRate = parseFloat(process.env.FAILURE_RATE || '0');

console.log(`--- Docker Execution Start ---`);
console.log(`Running Test: ${testName}`);
console.log(`Path: ${filePath}`);

// Simulate work
setTimeout(() => {
    const isPassed = Math.random() > failureRate;
    console.log(`Status: ${isPassed ? 'passed' : 'failed'}`);
    console.log(`--- Docker Execution End ---`);
    process.exit(isPassed ? 0 : 1);
}, 1000);
