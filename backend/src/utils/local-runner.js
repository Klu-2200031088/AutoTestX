/**
 * Simulates the execution of test cases locally.
 * 
 * @param {Array} testCases - List of test case objects from the database.
 * @returns {Promise<Array>} - A promise that resolves to a list of execution results.
 */
const simulateLocalExecution = async (testCases) => {
  return testCases.map((test, index) => {
    // Generate a random duration between 500ms and 2500ms
    const mockDuration = Math.floor(Math.random() * 2000) + 500;
    
    // Simulate a 90% pass rate
    const status = Math.random() > 0.1 ? 'passed' : 'failed';
    
    return {
      testId: test._id,
      testName: test.testName,
      status: status,
      duration: mockDuration,
      executionOrder: index + 1,
      logs: `[LOCAL] Running ${test.testName}...\n[LOCAL] File: ${test.filePath}\n[LOCAL] Finished in ${mockDuration}ms with status: ${status}`
    };
  });
};

module.exports = { simulateLocalExecution };
