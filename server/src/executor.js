const { spawn, spawnSync } = require('node:child_process');
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

// Levenshtein distance for typo tolerance
function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Compare two single tokens with numeric tolerance & common label typos
function compareSingleToken(tA, tE) {
  if (tA === tE) return true;
  if (tA.toLowerCase() === tE.toLowerCase()) return true;

  // Numerical comparison with floating point tolerance (e.g. 450.0 vs 450.00, 18.333333 vs 18.33)
  const numA = Number(tA);
  const numE = Number(tE);
  if (!isNaN(numA) && !isNaN(numE) && tA !== '' && tE !== '') {
    const diff = Math.abs(numA - numE);
    if (diff <= 0.05) return true;
    if (Math.abs(numE) > 0 && diff / Math.abs(numE) < 0.002) return true;
  }

  // Label typo tolerance (e.g., 'sun:' vs 'sum:', 'avg:' vs 'average:')
  const cleanA = tA.toLowerCase().replace(/[:=,]/g, '');
  const cleanE = tE.toLowerCase().replace(/[:=,]/g, '');
  if (cleanA === cleanE) return true;
  if (levenshteinDistance(cleanA, cleanE) <= 1 && Math.max(cleanA.length, cleanE.length) >= 3) return true;
  if ((cleanA === 'avg' && cleanE === 'average') || (cleanA === 'average' && cleanE === 'avg')) return true;
  if ((cleanA === 'tot' && cleanE === 'sum') || (cleanA === 'total' && cleanE === 'sum')) return true;

  return false;
}

// Intelligent multi-layered Output Comparator supporting differing logic & formatting
function isOutputMatch(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false;

  const normA = normalizeOutput(actual);
  const normE = normalizeOutput(expected);

  // 1. Strict exact match
  if (normA === normE) return true;

  // 2. Case-insensitive match
  if (normA.toLowerCase() === normE.toLowerCase()) return true;

  // 3. Line by line comparison
  const linesA = normA.split('\n').map(l => l.trim()).filter(Boolean);
  const linesE = normE.split('\n').map(l => l.trim()).filter(Boolean);

  if (linesA.length === linesE.length) {
    let allLinesMatch = true;
    for (let i = 0; i < linesE.length; i++) {
      const la = linesA[i];
      const le = linesE[i];
      if (la === le || la.toLowerCase() === le.toLowerCase()) continue;

      // Tokenize line by whitespace and punctuation
      const tokensA = la.match(/[a-zA-Z0-9_.]+|[:=,]/g) || [];
      const tokensE = le.match(/[a-zA-Z0-9_.]+|[:=,]/g) || [];

      if (tokensA.length === tokensE.length) {
        let lineMatch = true;
        for (let j = 0; j < tokensE.length; j++) {
          if (!compareSingleToken(tokensA[j], tokensE[j])) {
            lineMatch = false;
            break;
          }
        }
        if (lineMatch) continue;
      }

      // Check if line is formatted as: Label: Number
      const matchA = la.match(/^([a-zA-Z\s]+)[:=]?\s*(-?\d+(?:\.\d+)?)$/);
      const matchE = le.match(/^([a-zA-Z\s]+)[:=]?\s*(-?\d+(?:\.\d+)?)$/);
      if (matchA && matchE) {
        const labelA = matchA[1].trim();
        const labelE = matchE[1].trim();
        const valA = parseFloat(matchA[2]);
        const valE = parseFloat(matchE[2]);
        if (compareSingleToken(labelA, labelE) && Math.abs(valA - valE) <= 0.05) {
          continue;
        }
      }

      allLinesMatch = false;
      break;
    }
    if (allLinesMatch) return true;
  }

  // 4. Number stream comparison: If all numbers extracted from output match expected numbers in order
  const numsA = normA.match(/-?\d+(?:\.\d+)?/g);
  const numsE = normE.match(/-?\d+(?:\.\d+)?/g);
  if (numsA && numsE && numsA.length === numsE.length && numsE.length > 0) {
    let numbersMatch = true;
    for (let i = 0; i < numsE.length; i++) {
      const vA = parseFloat(numsA[i]);
      const vE = parseFloat(numsE[i]);
      if (Math.abs(vA - vE) > 0.05 && (Math.abs(vE) === 0 || Math.abs(vA - vE) / Math.abs(vE) > 0.002)) {
        numbersMatch = false;
        break;
      }
    }
    if (numbersMatch) {
      return true;
    }
  }

  // 5. Permutation / Unordered set of lines match (for set/graph/hashmap problems)
  if (linesA.length === linesE.length && linesE.length > 1) {
    const sortedA = [...linesA].sort();
    const sortedE = [...linesE].sort();
    if (sortedA.every((line, idx) => line.toLowerCase() === sortedE[idx].toLowerCase())) {
      return true;
    }
  }

  return false;
}

// Extract primary class name for Java if public, or default to Main
function extractClassName(code) {
  const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  if (match) {
    return match[1];
  }
  const anyClass = code.match(/class\s+([A-Za-z0-9_]+)/);
  return anyClass ? anyClass[1] : 'Main';
}

// Detect available C++ compiler
let cachedCppCompiler = undefined;
function findCppCompiler() {
  if (cachedCppCompiler !== undefined) return cachedCppCompiler;

  const candidates = [
    'C:\\Users\\P K PRANAV\\AppData\\Local\\Microsoft\\WinGet\\Packages\\MartinStorsjo.LLVM-MinGW.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\\llvm-mingw-20260908-ucrt-x86_64\\bin\\clang++.exe',
    'clang++',
    'g++',
    'gcc',
    'C:\\Users\\P K PRANAV\\AppData\\Local\\Microsoft\\WinGet\\Packages\\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\\mingw64\\bin\\g++.exe',
    'C:\\winlibs\\bin\\g++.exe',
    'C:\\MinGW\\bin\\g++.exe',
    'C:\\msys64\\mingw64\\bin\\g++.exe',
    'C:\\msys64\\ucrt64\\bin\\g++.exe',
    'C:\\Program Files\\LLVM\\bin\\clang++.exe'
  ];

  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { shell: false, timeout: 2500 });
      if (res.status === 0 || (res.stdout && res.stdout.length > 0)) {
        cachedCppCompiler = cmd;
        return cmd;
      }
    } catch {}
  }

  cachedCppCompiler = null;
  return null;
}

// Detect Python interpreter
let cachedPython = undefined;
function findPythonInterpreter() {
  if (cachedPython !== undefined) return cachedPython;

  const candidates = [
    'python',
    'py',
    'C:\\Users\\P K PRANAV\\AppData\\Local\\Programs\\Python\\Python312\\python.exe',
    'python3'
  ];

  for (const cmd of candidates) {
    try {
      const res = spawnSync(cmd, ['--version'], { shell: false, timeout: 2500 });
      if (res.status === 0 || (res.stdout && res.stdout.length > 0) || (res.stderr && res.stderr.length > 0)) {
        cachedPython = cmd;
        return cmd;
      }
    } catch {}
  }

  cachedPython = 'python';
  return 'python';
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

// Compile C++ code
function compileCpp(dir, cppFile, exeName) {
  return new Promise((resolve) => {
    const compiler = findCppCompiler();
    if (!compiler) {
      return resolve({
        success: false,
        status: 'Compiler Error',
        error: 'No C++ compiler (g++ / clang++) found in system PATH. Install MinGW-w64 or Clang to compile C++ natively, or use Python 3 / Java which are fully active and available.'
      });
    }

    const binDir = path.dirname(compiler);
    const args = ['-O2', '-std=c++20', cppFile, '-o', exeName];
    const comp = spawn(compiler, args, {
      cwd: dir,
      shell: false,
      env: { ...process.env, PATH: `${binDir};${process.env.PATH}` }
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      comp.kill();
      resolve({
        success: false,
        status: 'Compilation Timeout',
        error: 'Compilation exceeded time limit of 10s'
      });
    }, COMPILE_TIMEOUT_MS);

    comp.stdout.on('data', (d) => { stdout += d.toString(); });
    comp.stderr.on('data', (d) => { stderr += d.toString(); });

    comp.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        status: 'Compiler Error',
        error: `Could not launch C++ compiler (${compiler}): ${err.message}`
      });
    });

    comp.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return;
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          status: 'Compilation Error',
          error: stderr || stdout || 'C++ compilation failed with exit code ' + code
        });
      }
    });
  });
}

// Run compiled C++ executable
function runCpp(dir, exeName, input = '', timeoutMs = EXECUTION_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const exePath = path.join(dir, exeName);
    const compiler = findCppCompiler();
    const binDir = compiler ? path.dirname(compiler) : '';
    const proc = spawn(exePath, [], {
      cwd: dir,
      shell: false,
      env: { ...process.env, PATH: binDir ? `${binDir};${process.env.PATH}` : process.env.PATH }
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let bufferExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
      resolve({
        status: 'Time Limit Exceeded',
        stdout: stdout.slice(0, 5000),
        stderr: 'Time Limit Exceeded (execution exceeded ' + (timeoutMs / 1000) + 's)',
        executionTimeMs: timeoutMs,
        exitCode: -1
      });
    }, timeoutMs);

    if (input) {
      proc.stdin.write(input);
      if (!input.endsWith('\n')) {
        proc.stdin.write('\n');
      }
    }
    proc.stdin.end();

    proc.stdout.on('data', (d) => {
      stdout += d.toString();
      if (stdout.length > MAX_BUFFER_SIZE) {
        bufferExceeded = true;
        proc.kill();
      }
    });

    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        status: 'Runtime Error',
        stdout,
        stderr: err.message,
        executionTimeMs: Date.now() - startTime,
        exitCode: 1
      });
    });

    proc.on('close', (code) => {
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

// Compile / syntax check Python code
function checkPythonSyntax(dir, pyFile) {
  return new Promise((resolve) => {
    const pythonCmd = findPythonInterpreter();
    const check = spawn(pythonCmd, ['-m', 'py_compile', pyFile], {
      cwd: dir,
      shell: false
    });

    let stderr = '';
    check.stderr.on('data', (d) => { stderr += d.toString(); });

    check.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          status: 'Compilation Error',
          error: stderr || 'Python syntax verification failed.'
        });
      }
    });

    check.on('error', (err) => {
      resolve({
        success: false,
        status: 'Compiler Error',
        error: `Python launcher error: ${err.message}`
      });
    });
  });
}

// Run Python script
function runPython(dir, pyFile, input = '', timeoutMs = EXECUTION_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const pythonCmd = findPythonInterpreter();
    const startTime = Date.now();
    const py = spawn(pythonCmd, ['-u', pyFile], {
      cwd: dir,
      shell: false,
      env: { ...process.env, PYTHONUNBUFFERED: '1', PYTHONIOENCODING: 'utf-8' }
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let bufferExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      py.kill('SIGKILL');
      resolve({
        status: 'Time Limit Exceeded',
        stdout: stdout.slice(0, 5000),
        stderr: 'Time Limit Exceeded (execution exceeded ' + (timeoutMs / 1000) + 's)',
        executionTimeMs: timeoutMs,
        exitCode: -1
      });
    }, timeoutMs);

    if (input) {
      py.stdin.write(input);
      if (!input.endsWith('\n')) {
        py.stdin.write('\n');
      }
    }
    py.stdin.end();

    py.stdout.on('data', (d) => {
      stdout += d.toString();
      if (stdout.length > MAX_BUFFER_SIZE) {
        bufferExceeded = true;
        py.kill();
      }
    });

    py.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    py.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        status: 'Runtime Error',
        stdout,
        stderr: err.message,
        executionTimeMs: Date.now() - startTime,
        exitCode: 1
      });
    });

    py.on('close', (code) => {
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
          stderr: stderr || `Python exited with code ${code}`,
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

// Run SQL code via sql_runner.py
function runSql(tempDir, sqlCode, input, questionId = '') {
  return new Promise((resolve) => {
    const pythonExe = findPythonInterpreter();
    const runnerScript = path.resolve(__dirname, 'sql_runner.py');
    const codeFile = path.join(tempDir, 'solution.sql');
    fs.writeFileSync(codeFile, sqlCode, 'utf8');

    const inputFile = path.join(tempDir, 'input.txt');
    fs.writeFileSync(inputFile, input || '', 'utf8');

    const proc = spawn(pythonExe, [runnerScript, questionId || 'generic', codeFile, inputFile], {
      cwd: tempDir,
      shell: false,
      timeout: EXECUTION_TIMEOUT_MS
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        if (code !== 0) {
          resolve({
            status: 'Runtime Error',
            stdout: '',
            stderr: stderr || stdout || `SQL runner failed with code ${code}`,
            executionTimeMs: 0,
            exitCode: code || 1
          });
        } else {
          resolve({
            status: 'Success',
            stdout: stdout.trim(),
            stderr,
            executionTimeMs: 10,
            exitCode: 0
          });
        }
      }
    });
  });
}

// Clean up execution directory safely
function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (err) {}
}

// Universal Multi-Language Code Executor (Java, C++, Python, SQL)
const CodeExecutor = {
  // Execute single run (with custom or sample input)
  runSingle: async (arg1, arg2, arg3, arg4) => {
    let language = 'java';
    let sourceCode = '';
    let input = '';
    let questionId = '';

    if (arg4 !== undefined) {
      language = arg1 || 'java';
      sourceCode = arg2 || '';
      input = arg3 || '';
      questionId = arg4 || '';
    } else if (arg3 !== undefined) {
      language = arg1 || 'java';
      sourceCode = arg2 || '';
      input = arg3 || '';
    } else if (arg2 !== undefined) {
      if (['java', 'cpp', 'c++', 'python', 'py', 'sql', 'mysql'].includes(String(arg1).toLowerCase())) {
        language = arg1;
        sourceCode = arg2 || '';
      } else {
        language = 'java';
        sourceCode = arg1 || '';
        input = arg2 || '';
      }
    } else {
      sourceCode = arg1 || '';
    }

    const lang = (language || 'java').toLowerCase();
    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), `arena_${lang}_run_${runId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      if (lang === 'sql' || lang === 'mysql') {
        return await runSql(tempDir, sourceCode, input, questionId);
      } else if (lang === 'python' || lang === 'py') {
        const pyFile = path.join(tempDir, 'solution.py');
        fs.writeFileSync(pyFile, sourceCode, 'utf8');

        // Check syntax first
        const syntaxResult = await checkPythonSyntax(tempDir, 'solution.py');
        if (!syntaxResult.success) {
          return {
            status: syntaxResult.status,
            stdout: '',
            stderr: syntaxResult.error,
            executionTimeMs: 0,
            exitCode: 1
          };
        }

        return await runPython(tempDir, 'solution.py', input);
      } else if (lang === 'cpp' || lang === 'c++') {
        const cppFile = path.join(tempDir, 'solution.cpp');
        fs.writeFileSync(cppFile, sourceCode, 'utf8');

        // Compile
        const compileResult = await compileCpp(tempDir, 'solution.cpp', 'solution.exe');
        if (!compileResult.success) {
          return {
            status: compileResult.status,
            stdout: '',
            stderr: compileResult.error,
            executionTimeMs: 0,
            exitCode: 1
          };
        }

        return await runCpp(tempDir, 'solution.exe', input);
      } else {
        // Default: Java
        const className = extractClassName(sourceCode);
        const javaFile = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(javaFile, sourceCode, 'utf8');

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

        return await runJava(tempDir, className, input);
      }
    } finally {
      cleanupDir(tempDir);
    }
  },

  // Submit and evaluate code against test cases
  evaluateSubmission: async (arg1, arg2, arg3, arg4) => {
    let language = 'java';
    let sourceCode = '';
    let testCases = [];
    let questionId = '';

    if (arg4 !== undefined) {
      language = arg1 || 'java';
      sourceCode = arg2 || '';
      testCases = arg3 || [];
      questionId = arg4 || '';
    } else if (arg3 !== undefined) {
      language = arg1 || 'java';
      sourceCode = arg2 || '';
      testCases = arg3 || [];
    } else if (arg2 !== undefined) {
      if (Array.isArray(arg2)) {
        language = 'java';
        sourceCode = arg1 || '';
        testCases = arg2;
      } else {
        language = arg1 || 'java';
        sourceCode = arg2 || '';
      }
    } else {
      sourceCode = arg1 || '';
    }

    const lang = (language || 'java').toLowerCase();
    const runId = crypto.randomBytes(8).toString('hex');
    const tempDir = path.join(os.tmpdir(), `arena_${lang}_sub_${runId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      let runnerFunc = null;

      if (lang === 'sql' || lang === 'mysql') {
        runnerFunc = (tcInput) => runSql(tempDir, sourceCode, tcInput, questionId);
      } else if (lang === 'python' || lang === 'py') {
        const pyFile = path.join(tempDir, 'solution.py');
        fs.writeFileSync(pyFile, sourceCode, 'utf8');

        const syntaxResult = await checkPythonSyntax(tempDir, 'solution.py');
        if (!syntaxResult.success) {
          return {
            status: syntaxResult.status,
            passedCount: 0,
            totalCount: testCases.length,
            executionTimeMs: 0,
            errorMessage: syntaxResult.error,
            testResults: testCases.map((tc, idx) => ({
              testIndex: idx + 1,
              passed: false,
              status: syntaxResult.status,
              isHidden: tc.isHidden || false
            }))
          };
        }

        runnerFunc = (tcInput) => runPython(tempDir, 'solution.py', tcInput);
      } else if (lang === 'cpp' || lang === 'c++') {
        const cppFile = path.join(tempDir, 'solution.cpp');
        fs.writeFileSync(cppFile, sourceCode, 'utf8');

        const compileResult = await compileCpp(tempDir, 'solution.cpp', 'solution.exe');
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

        runnerFunc = (tcInput) => runCpp(tempDir, 'solution.exe', tcInput);
      } else {
        // Java
        const className = extractClassName(sourceCode);
        const javaFile = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(javaFile, sourceCode, 'utf8');

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

        runnerFunc = (tcInput) => runJava(tempDir, className, tcInput);
      }

      // Evaluate each test case
      let passedCount = 0;
      let totalExecutionTime = 0;
      const testResults = [];
      let overallStatus = 'Accepted';
      let firstFailureMessage = null;

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const res = await runnerFunc(tc.input);
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
          const exceptionMatch = (res.stderr || '').match(/([a-zA-Z0-9_.]+(?:Exception|Error|Fault))/);
          const exceptionName = exceptionMatch ? exceptionMatch[1] : 'Runtime Exception';
          let hint = '';
          if ((res.stderr || '').includes('InputMismatchException')) {
            hint = 'InputMismatchException: The test input contains decimal numbers. Ensure you use sc.nextDouble() / parseFloat instead of sc.nextInt().';
          } else if ((res.stderr || '').includes('ArrayIndexOutOfBoundsException')) {
            hint = 'ArrayIndexOutOfBoundsException: Array index accessed out of range. Check loop boundaries and array size.';
          } else if ((res.stderr || '').includes('NullPointerException')) {
            hint = 'NullPointerException: Attempted to access a method or field on a null reference.';
          } else if ((res.stderr || '').includes('NoSuchElementException')) {
            hint = 'NoSuchElementException: Attempted to read more input than was provided. Check sc.hasNext() before reading.';
          } else if ((res.stderr || '').includes('NumberFormatException')) {
            hint = 'NumberFormatException: String could not be parsed as a valid number.';
          }

          const diagnosticMsg = hint ? `${exceptionName}: ${hint}` : (tc.isHidden ? exceptionName : res.stderr);

          testResults.push({
            testIndex: i + 1,
            passed: false,
            status: 'Runtime Error',
            isHidden: tc.isHidden || false,
            input: tc.input,
            expected: normalizeOutput(tc.expectedOutput),
            expectedOutput: normalizeOutput(tc.expectedOutput),
            actual: 'Runtime Exception: ' + exceptionName,
            actualOutput: 'Runtime Exception: ' + exceptionName,
            stderr: diagnosticMsg,
            errorMessage: diagnosticMsg,
            executionTimeMs: res.executionTimeMs
          });
          if (overallStatus === 'Accepted') {
            overallStatus = 'Runtime Error';
            firstFailureMessage = `Test case ${i + 1} runtime error: ${diagnosticMsg}`;
          }
          continue;
        }

        const normalizedActual = normalizeOutput(res.stdout);
        const normalizedExpected = normalizeOutput(tc.expectedOutput);
        const isMatch = isOutputMatch(normalizedActual, normalizedExpected);

        if (isMatch) {
          passedCount++;
          testResults.push({
            testIndex: i + 1,
            passed: true,
            status: 'Passed',
            isHidden: tc.isHidden || false,
            input: tc.input,
            expected: normalizedExpected,
            expectedOutput: normalizedExpected,
            actual: normalizedActual,
            actualOutput: normalizedActual,
            executionTimeMs: res.executionTimeMs
          });
        } else {
          testResults.push({
            testIndex: i + 1,
            passed: false,
            status: 'Wrong Answer',
            isHidden: tc.isHidden || false,
            input: tc.input,
            expected: normalizedExpected,
            expectedOutput: normalizedExpected,
            actual: normalizedActual,
            actualOutput: normalizedActual,
            executionTimeMs: res.executionTimeMs
          });
          if (overallStatus === 'Accepted') {
            overallStatus = 'Wrong Answer';
            firstFailureMessage = null; // Do not show as compiler diagnostic
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
  CodeExecutor,
  JavaExecutor: CodeExecutor, // backwards compatibility
  normalizeOutput,
  isOutputMatch,
  findCppCompiler,
  findPythonInterpreter
};
