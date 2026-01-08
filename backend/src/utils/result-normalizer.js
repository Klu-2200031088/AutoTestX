/**
 * Normalizes test execution results into a standardized format.
 * This ensures that regardless of the runner (Local, Docker, External),
 * the data is consistent for analytics and AI learning.
 */
const normalizeResult = (data) => {
    return {
        testId: data.testId || null,
        testName: data.testName || 'Unknown Test',
        status: data.status === 'passed' ? 'passed' : 'failed',
        duration: parseInt(data.duration) || 0,
        orderIndex: parseInt(data.orderIndex) || 0,
        riskScore: parseFloat(data.riskScore) || 0,
        logs: data.logs || '',
        metadata: data.metadata || {}
    };
};

module.exports = { normalizeResult };
