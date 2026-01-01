const { exec } = require('child_process');
const path = require('path');

const runInDocker = (test) => {
    return new Promise((resolve) => {
        const imageName = 'autotestx-runner';
        const containerName = `test-${test._id}-${Date.now()}`;

        // Command to run the docker container with environment variables
        const cmd = `docker run --name ${containerName} --rm \
      -e TEST_NAME="${test.testName}" \
      -e FILE_PATH="${test.filePath}" \
      -e FAILURE_RATE="${test.failureRate}" \
      ${imageName}`;

        console.log(`Executing Docker: ${cmd}`);

        exec(cmd, (error, stdout, stderr) => {
            const status = error ? 'failed' : 'passed';
            resolve({
                status,
                stdout,
                stderr
            });
        });
    });
};

module.exports = { runInDocker };
