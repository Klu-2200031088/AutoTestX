/**
 * Simulates or executes test cases within a Docker container environment.
 * 
 * @param {Array} testCases - List of test case objects from the database.
 * @returns {Promise<Array>} - A promise that resolves to a list of execution results.
 */
const runInDocker = async (testCases) => {
    // In a real implementation, this might build a Docker image or pull one.
    // For now, we simulate the container overhead and execution results.

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];

        // Simulate Docker startup overhead (random 200ms - 800ms)
        const dockerOverhead = Math.floor(Math.random() * 600) + 200;

        // Simulate the actual test duration inside the container
        const testDuration = Math.floor(Math.random() * 1500) + 300;
        const totalDuration = dockerOverhead + testDuration;

        // Simulate a 95% pass rate in the stable container environment
        const status = Math.random() > 0.05 ? 'passed' : 'failed';

        const containerId = `atx-${Math.random().toString(36).substring(7)}`;

        results.push({
            testId: test._id,
            testName: test.testName,
            status: status,
            duration: totalDuration,
            riskScore: test.riskScore || 0,
            orderIndex: i + 1, // Using orderIndex as requested in recent schema updates
            executionOrder: i + 1, // Backwards compatibility for UI mapping if needed
            logs: `[DOCKER] Container ${containerId} started.
[DOCKER] Pulling image: autotestx-runner:latest... OK
[DOCKER] Copying ${test.filePath} to /app/tests/... OK
[DOCKER] Running test: ${test.testName}
[DOCKER] Simulation: Executing logic with riskScore ${test.riskScore}...
[DOCKER] Result: ${status.toUpperCase()}
[DOCKER] Cleaning up container... OK
[DOCKER] Total time (container overhead included): ${totalDuration}ms`
        });

        // Optional: artificially slow down to simulate sequential container runs
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    return results;
};

module.exports = { runInDocker };
