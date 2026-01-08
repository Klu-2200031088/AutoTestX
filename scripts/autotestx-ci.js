const axios = require('axios');

/**
 * AutoTestX CI Utility
 * Use this script in your GitHub Actions or Jenkins pipelines to trigger an AI-orchestrated test run.
 * 
 * Usage: node autotestx-ci.js <ProjectId> <ApiUrl>
 */

const runCI = async () => {
    const projectId = process.argv[2] || process.env.AUTOTESTX_PROJECT_ID;
    const apiUrl = process.argv[3] || process.env.AUTOTESTX_API_URL || 'http://localhost:5000/api';

    // Detect Metadata from CI Environment (GitHub Actions support)
    const commitId = process.env.GITHUB_SHA || process.argv[4] || 'manual';
    const branch = process.env.GITHUB_REF_NAME || process.argv[5] || 'unknown';

    if (!projectId) {
        console.error('Error: PROJECT_ID is required.');
        process.exit(1);
    }

    console.log(`[AUTOTESTX CI] Triggering execution for Project ID: ${projectId}`);
    console.log(`[AUTOTESTX CI] Branch: ${branch} | Commit: ${commitId}`);
    console.log(`[AUTOTESTX CI] Targeting API: ${apiUrl}`);

    try {
        const response = await axios.post(`${apiUrl}/execute/run`, {
            projectId,
            commitId,
            branch
        });
        const { summary, passed, failed, details } = response.data;

        console.log('\n================ EXECUTION SUMMARY ================');
        console.log(summary);
        console.log(`PASSED: ${passed}`);
        console.log(`FAILED: ${failed}`);
        console.log('===================================================\n');

        if (failed > 0) {
            console.log('[AUTOTESTX CI] Pipeline FAILED due to test failures.');
            process.exit(1);
        } else {
            console.log('[AUTOTESTX CI] Pipeline SUCCESS.');
            process.exit(0);
        }
    } catch (err) {
        console.error('[AUTOTESTX CI] Execution failed:', err.message);
        process.exit(1);
    }
};

runCI();
