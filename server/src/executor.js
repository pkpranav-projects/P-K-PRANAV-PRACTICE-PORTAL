const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const EXECUTION_TIMEOUT_MS = 6000;
const COMPILE_TIMEOUT_MS = 10000;
const MAX_BUFFER_SIZE = 1024 * 1024; // 1MB

// Normalize output for reliable comparison
function normalizeOutput(text) {
  if (typeof text !== 'string') return '';
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .split('\n');
  return lines.map(line => line.trimEnd()).join('\n');
}

// Extract primary class name if public, or default to Main
function extractClassName(code) {
  const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  if (match) {
    return match[1];
  }
  const anyClass = code.match(/class\s+([A-Za-z0-9_]+)/);
  return anyClass ? anyClass[1] : 'Main';
}

// Compile Java code
function compileJava(dir, className) {
  return new Promise((resolve) => {
    const javaFile = `${className}.java`;
    const javac = spawn('javac', [javaFile], {
      cwd: dir,
      shell: false
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      javac.kill();
      resolve({
        success: false,
        status: 'Compilation Timeout',
        error: 'Compilation exceeded time limit of 10s'
      });
    }, COMPILE_TIMEOUT_MS);

    javac.stdout.on('data', (d) => { stdout += d.toString(); });
    javac.stderr.on('data', (d) => { stderr += d.toString(); });

    javac.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        status: 'Compiler Error',
        error: `Could not launch javac: ${err.message}. Ensure JDK is installed and on PATH.`
      });
    });

    javac.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return;
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          status: 'Compilation Error',
          error: stderr || stdout || 'Compilation failed with exit code ' + code
        });
      }
    });
  });
}

// Run compiled Java class
function runJava(dir, className, input = '', timeoutMs = EXECUTION_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    // Memory limit: -Xmx256m, headless, security flags
    const java = spawn('java', ['-Xmx256m', '-Dfile.encoding=UTF-8', className], {
      cwd: dir,
      shell: false
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let bufferExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      java.kill('SIGKILL');
      resolve({
        status: 'Time Limit Exceeded',
        stdout: stdout.slice(0, 5000),
        stderr: 'Time Limit Exceeded (execution exceeded ' + (timeoutMs / 1000) + 's)',
        executionTimeMs: timeoutMs,
        exitCode: -1
      });
    }, timeoutMs);

    if (input) {
      java.stdin.write(input);
      // Ensure newline if not present so Scanner.nextLine() or next() doesn't hang
      if (!input.endsWith('\n')) {
        java.stdin.write('\n');
      }
    }
    java.stdin.end();

    java.stdout.on('data', (d) => {
      stdout += d.toString();
      if (stdout.length > MAX_BUFFER_SIZE) {
        bufferExceeded = true;
        java.kill();
      }
    });

    java.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    java.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        status: 'Runtime Error',
        stdout,
        stderr: err.message,
        executionTimeMs: Date.now() - startTime,
        exitCode: 1
      });
    });

    java.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return;
      const executionTimeMs = Date.now() - startTime;

      if (bufferExceeded) {
        return resolve({
          status: 'Output Limit Exceeded',
          stdout: stdout.slice(0, 5000),
          stderr: 'Output size exceeded maximum buffer (1MB)',
          executionTimeMs,
          exitCode: code
        });
      }

      if (code !== 0) {
        return resolve({
          status: 'Runtime Error',
          stdout,
          stderr: stderr || `Process exited with code ${code}`,
          executionTimeMs,
          exitCode: code
        });
      }

      resolve({
        status: 'Success',
        stdout,
        stderr,
        executionTimeMs,
        exitCode: code
      });
    });
  });
}

// Clean up execution directory safely
function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (err) {
    // ignore cleanup errors
  }
}

// Core execution engine
const JavaExecutor = {
  // Execute single run (with custom or sample input)
  runSingle: async (sourceCode, input = '') => {
    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), `java_arena_run_${runId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      const className = extractClassName(sourceCode);
      const javaFile = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(javaFile, sourceCode, 'utf8');

      // 1. Compile
      const compileResult = await compileJava(tempDir, className);
      if (!compileResult.success) {
        return {
          status: compileResult.status,
          stdout: '',
          stderr: compileResult.error,
          executionTimeMs: 0,
          exitCode: 1
        };
      }

      // 2. Run
      const runResult = await runJava(tempDir, className, input);
      return runResult;
    } finally {
      cleanupDir(tempDir);
    }
  },

  // Submit and evaluate code against test cases
  evaluateSubmission: async (sourceCode, testCases = []) => {
    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), `java_arena_sub_${runId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      const className = extractClassName(sourceCode);
      const javaFile = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(javaFile, sourceCode, 'utf8');

      // 1. Compile
      const compileResult = await compileJava(tempDir, className);
      if (!compileResult.success) {
        return {
          status: compileResult.status,
          passedCount: 0,
          totalCount: testCases.length,
          executionTimeMs: 0,
          errorMessage: compileResult.error,
          testResults: testCases.map((tc, idx) => ({
            testIndex: idx + 1,
            passed: false,
            status: compileResult.status,
            isHidden: tc.isHidden || false
          }))
        };
      }

      // 2. Evaluate each test case
      let passedCount = 0;
      let totalExecutionTime = 0;
      const testResults = [];
      let overallStatus = 'Accepted';
      let firstFailureMessage = null;

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const res = await runJava(tempDir, className, tc.input);
        totalExecutionTime += res.executionTimeMs;

        if (res.status === 'Time Limit Exceeded') {
          testResults.push({
            testIndex: i + 1,
            passed: false,
            status: 'Time Limit Exceeded',
            isHidden: tc.isHidden || false,
            executionTimeMs: res.executionTimeMs
          });
          if (overallStatus === 'Accepted') {
            overallStatus = 'Time Limit Exceeded';
            firstFailureMessage = `Test case ${i + 1} timed out.`;
          }
          continue;
        }

        if (res.status === 'Runtime Error') {
          testResults.push({
            testIndex: i + 1,
            passed: false,
            status: 'Runtime Error',
            isHidden: tc.isHidden || false,
            stderr: tc.isHidden ? 'Runtime Exception occurred in hidden test case' : res.stderr,
            executionTimeMs: res.executionTimeMs
          });
          if (overallStatus === 'Accepted') {
            overallStatus = 'Runtime Error';
            firstFailureMessage = `Test case ${i + 1} failed with runtime error.`;
          }
          continue;
        }

        const normalizedActual = normalizeOutput(res.stdout);
        const normalizedExpected = normalizeOutput(tc.expectedOutput);
        const isMatch = normalizedActual === normalizedExpected;

        if (isMatch) {
          passedCount++;
          testResults.push({
            testIndex: i + 1,
            passed: true,
            status: 'Passed',
            isHidden: tc.isHidden || false,
            executionTimeMs: res.executionTimeMs
          });
        } else {
          testResults.push({
            testIndex: i + 1,
            passed: false,
            status: 'Wrong Answer',
            isHidden: tc.isHidden || false,
            input: tc.isHidden ? undefined : tc.input,
            expected: tc.isHidden ? undefined : normalizedExpected,
            actual: tc.isHidden ? undefined : normalizedActual,
            executionTimeMs: res.executionTimeMs
          });
          if (overallStatus === 'Accepted') {
            overallStatus = 'Wrong Answer';
            firstFailureMessage = `Wrong answer on test case ${i + 1}.`;
          }
        }
      }

      return {
        status: overallStatus,
        passedCount,
        totalCount: testCases.length,
        executionTimeMs: totalExecutionTime,
        errorMessage: firstFailureMessage,
        testResults
      };
    } finally {
      cleanupDir(tempDir);
    }
  }
};

module.exports = {
  JavaExecutor,
  normalizeOutput
};
