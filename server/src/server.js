const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const { spawnSync, exec, spawn } = require('node:child_process');
const { dbHelpers } = require('./db');
const { JavaExecutor, findCppCompiler, findPythonInterpreter } = require('./executor');
const { getCurriculum, documentsDir } = require('./curriculum');
const { getMasterclassData } = require('./masterclass');

function getEdgeExecutable() {
  const candidatePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Microsoft\\Edge\\Application\\msedge.exe') : null
  ].filter(Boolean);

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static routes to view original source screenshots across all question folders
const questionsDir4 = path.resolve(__dirname, '../../questions4');
const questionsDir1 = path.resolve(__dirname, '../../questions');
const questionsDir2 = path.resolve(__dirname, '../../questions2cpp');
const questionsDir3 = path.resolve(__dirname, '../../questions3');
const dbmsDir = path.resolve(__dirname, '../../DBMS questions');

// Smart screenshot resolver supporting ranges and direct names
app.get('/api/screenshots/:filename', (req, res, next) => {
  const raw = decodeURIComponent(req.params.filename);
  const match = raw.match(/Screenshot\s*\((\d+)\)\.png/i);
  const dirs = [dbmsDir, questionsDir4, questionsDir1, questionsDir2, questionsDir3];

  if (match) {
    const targetFile = `Screenshot (${match[1]}).png`;
    for (const d of dirs) {
      const fp = path.join(d, targetFile);
      if (fs.existsSync(fp)) {
        return res.sendFile(fp);
      }
    }
  } else {
    for (const d of dirs) {
      const fp = path.join(d, raw);
      if (fs.existsSync(fp)) {
        return res.sendFile(fp);
      }
    }
  }
  next();
});

app.use('/api/screenshots', express.static(dbmsDir));
app.use('/api/screenshots', express.static(questionsDir4));
app.use('/api/screenshots', express.static(questionsDir1));
app.use('/api/screenshots', express.static(questionsDir2));
app.use('/api/screenshots', express.static(questionsDir3));

// Health check endpoint verifying Java JDK, Python 3, and C++
app.get('/api/health', (req, res) => {
  let javaOk = false;
  let javacOk = false;
  let javaVersion = 'Unknown';
  let javacVersion = 'Unknown';

  try {
    const javaCheck = spawnSync('java', ['-version'], { encoding: 'utf8' });
    if (javaCheck.status === 0 || javaCheck.stderr) {
      javaOk = true;
      javaVersion = (javaCheck.stderr || javaCheck.stdout).split('\n')[0];
    }
  } catch (err) {
    javaOk = false;
  }

  try {
    const javacCheck = spawnSync('javac', ['-version'], { encoding: 'utf8' });
    if (javacCheck.status === 0 || javacCheck.stdout || javacCheck.stderr) {
      javacOk = true;
      javacVersion = (javacCheck.stdout || javacCheck.stderr).split('\n')[0];
    }
  } catch (err) {
    javacOk = false;
  }

  let pythonOk = false;
  let pythonVersion = 'Not detected';
  try {
    const pyCmd = findPythonInterpreter();
    const pyCheck = spawnSync(pyCmd, ['--version'], { encoding: 'utf8' });
    if (pyCheck.status === 0 || pyCheck.stdout) {
      pythonOk = true;
      pythonVersion = (pyCheck.stdout || pyCheck.stderr).trim().split('\n')[0];
    }
  } catch (err) {
    pythonOk = false;
  }

  let cppOk = false;
  let cppVersion = 'Not installed';
  try {
    const cppCmd = findCppCompiler();
    if (cppCmd) {
      const cppCheck = spawnSync(cppCmd, ['--version'], { encoding: 'utf8' });
      if (cppCheck.status === 0 || cppCheck.stdout) {
        cppOk = true;
        cppVersion = (cppCheck.stdout || '').split('\n')[0];
      }
    }
  } catch (err) {
    cppOk = false;
  }

  res.json({
    status: javaOk && javacOk ? 'ok' : 'degraded',
    java: {
      available: javaOk,
      version: javaVersion
    },
    javac: {
      available: javacOk,
      version: javacVersion
    },
    python: {
      available: pythonOk,
      version: pythonVersion
    },
    cpp: {
      available: cppOk,
      version: cppVersion
    },
    database: 'connected'
  });
});

// Questions list (supports bank1, bank2, or all)
app.get('/api/questions', (req, res) => {
  try {
    const { topic, difficulty, status, search, sort, bank } = req.query;
    const questions = dbHelpers.getQuestions({ topic, difficulty, status, search, sort, bank });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Java Masterclass & A-Z Methods Encyclopedia
app.get('/api/masterclass', (req, res) => {
  try {
    const data = getMasterclassData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Question
app.get('/api/questions/:id', (req, res) => {
  try {
    const q = dbHelpers.getQuestionById(req.params.id);
    if (!q) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Hide hidden test cases from workspace view for exam integrity
    const publicTestCases = q.testCases.map((tc, idx) => ({
      testIndex: idx + 1,
      input: tc.isHidden ? 'Hidden Test Case' : tc.input,
      expectedOutput: tc.isHidden ? 'Hidden' : tc.expectedOutput,
      isHidden: tc.isHidden || false
    }));

    // Exclude referenceSolution and explanation from initial load until revealed
    const { referenceSolution, explanation, ...safeQuestion } = q;

    res.json({
      ...safeQuestion,
      hasSolution: Boolean(referenceSolution),
      testCases: publicTestCases
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reveal solution
app.get('/api/questions/:id/solution', (req, res) => {
  try {
    const q = dbHelpers.getQuestionById(req.params.id);
    if (!q) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({
      id: q.id,
      title: q.title,
      referenceSolution: q.referenceSolution,
      explanation: q.explanation,
      extractionStatus: q.extractionStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save user draft code
app.post('/api/drafts/:id', (req, res) => {
  try {
    const { code, language } = req.body;
    if (typeof code !== 'string') {
      return res.status(400).json({ error: 'Code string is required' });
    }
    dbHelpers.saveDraft(req.params.id, code, language || 'java');
    res.json({ success: true, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user draft code for specific language
app.get('/api/drafts/:id', (req, res) => {
  try {
    const language = (req.query.language || 'java').toLowerCase();
    const draft = dbHelpers.getDraft(req.params.id, language);
    res.json({ draftCode: draft ? draft.code : null, updatedAt: draft ? draft.updatedAt : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle bookmark
app.post('/api/bookmarks/:id', (req, res) => {
  try {
    const isBookmarked = dbHelpers.toggleBookmark(req.params.id);
    res.json({ success: true, isBookmarked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle revision
app.post('/api/revision/:id', (req, res) => {
  try {
    const { reason } = req.body || {};
    const isRevision = dbHelpers.toggleRevision(req.params.id, reason);
    res.json({ success: true, isRevision });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run single execution (with custom or sample input)
app.post('/api/run', async (req, res) => {
  const { code, input, language } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Source code is required' });
  }

  try {
    const result = await JavaExecutor.runSingle(language || 'java', code, input || '', req.body.questionId || '');
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: 'Internal Execution Error',
      stdout: '',
      stderr: err.message,
      executionTimeMs: 0
    });
  }
});

// Submit code for full evaluation against test cases
app.post('/api/submit', async (req, res) => {
  const { questionId, code, language = 'java' } = req.body;
  if (!questionId || !code) {
    return res.status(400).json({ error: 'questionId and code are required' });
  }

  const question = dbHelpers.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  try {
    const evalResult = await JavaExecutor.evaluateSubmission(language, code, question.testCases, questionId);
    
    // Save submission record in SQLite
    dbHelpers.addSubmission({
      questionId,
      status: evalResult.status,
      passedCount: evalResult.passedCount,
      totalCount: evalResult.totalCount,
      executionTimeMs: evalResult.executionTimeMs,
      errorMessage: evalResult.errorMessage,
      testResults: evalResult.testResults,
      code,
      language: (language || 'java').toLowerCase()
    });

    res.json(evalResult);
  } catch (err) {
    res.status(500).json({
      status: 'Internal Execution Error',
      passedCount: 0,
      totalCount: question.testCases ? question.testCases.length : 0,
      errorMessage: err.message,
      testResults: []
    });
  }
});

// Submissions history
app.get('/api/submissions', (req, res) => {
  try {
    const { questionId, limit } = req.query;
    const history = dbHelpers.getSubmissions(limit ? parseInt(limit, 10) : 50, questionId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbHelpers.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = dbHelpers.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    dbHelpers.setSetting(key, value);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Study Curriculum & Documents
app.get('/api/documents', (req, res) => {
  try {
    const list = getCurriculum();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias for curriculum endpoint
app.get('/api/curriculum', (req, res) => {
  try {
    const list = getCurriculum();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inline PDF viewer endpoint (streams original PDF or companion web PDF for PPTX/DOCX/PPT)
app.get('/api/documents/view/:filename', (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.filename);
    const safeFilename = path.basename(rawName);
    const originalPath = path.join(documentsDir, safeFilename);
    const companionPdfPath = path.join(documentsDir, 'web_pdf', `${safeFilename}.pdf`);

    const ext = path.extname(safeFilename).toLowerCase();
    let servePath = null;
    let serveName = safeFilename;

    if (ext === '.pdf' && fs.existsSync(originalPath)) {
      servePath = originalPath;
    } else if (fs.existsSync(companionPdfPath)) {
      servePath = companionPdfPath;
      serveName = `${safeFilename}.pdf`;
    } else if (fs.existsSync(originalPath)) {
      servePath = originalPath;
    }

    if (!servePath || !fs.existsSync(servePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const isPdf = servePath.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(serveName)}"`);
    }
    return res.sendFile(servePath);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Open document directly: in Microsoft Edge or Office desktop app
app.post('/api/documents/open', (req, res) => {
  const { filename, app: requestedApp } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const safeFilename = path.basename(filename);
  const targetPath = path.join(documentsDir, safeFilename);
  const companionPdfPath = path.join(documentsDir, 'web_pdf', `${safeFilename}.pdf`);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'Document file not found in documentss folder' });
  }

  const ext = path.extname(safeFilename).toLowerCase();
  const isPdf = ext === '.pdf';
  const hasCompanionPdf = fs.existsSync(companionPdfPath);

  const viewUrl = `http://localhost:${PORT}/api/documents/view/${encodeURIComponent(safeFilename)}`;
  const rawUrl = `http://localhost:${PORT}/api/documents/raw/${encodeURIComponent(safeFilename)}`;

  if (requestedApp === 'edge') {
    // Open in Microsoft Edge via PowerShell Start-Process (handles running Edge instances flawlessly)
    const psCmd = `powershell -NoProfile -Command "Start-Process msedge -ArgumentList '${viewUrl}'"`;
    exec(psCmd, (err) => {
      if (err) {
        // Fallback: Windows protocol launch
        exec(`cmd.exe /c start microsoft-edge:"${viewUrl}"`, () => {});
      }
      return res.json({
        success: true,
        message: `Opened ${safeFilename} in Microsoft Edge (Zero download)`,
        url: viewUrl,
        filename: safeFilename
      });
    });
    return;
  }

  if (requestedApp === 'office') {
    const isPpt = ext.includes('ppt');
    const isWord = ext.includes('doc');
    const appLabel = isPpt ? 'Microsoft PowerPoint' : isWord ? 'Microsoft Word' : 'Microsoft Office';

    const cmd = `cmd.exe /c start "" "${targetPath}"`;
    exec(cmd, (err) => {
      if (err) {
        return res.status(500).json({
          error: `Failed to launch ${appLabel}`,
          fallbackUrl: viewUrl
        });
      }
      return res.json({
        success: true,
        message: `Opened ${safeFilename} in ${appLabel} (Zero download)`,
        url: viewUrl,
        fallbackUrl: viewUrl,
        filename: safeFilename
      });
    });
    return;
  }

  // System default handler
  const cmd = `cmd.exe /c start "" "${targetPath}"`;
  exec(cmd, (err) => {
    return res.json({
      success: true,
      message: `Opened ${safeFilename}`,
      url: viewUrl,
      filename: safeFilename
    });
  });
});

// Static preview routes
app.use('/api/documents/raw', express.static(documentsDir));
app.use('/api/documents/web_pdf', express.static(path.join(documentsDir, 'web_pdf')));

// Full data export
app.get('/api/export', (req, res) => {
  try {
    const backup = dbHelpers.exportAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="java_arena_backup.json"');
    res.json(backup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Data import / restore
app.post('/api/import', (req, res) => {
  try {
    const backup = req.body;
    dbHelpers.importAll(backup);
    res.json({ success: true, message: 'Backup restored successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reset user progress
app.post('/api/reset', (req, res) => {
  try {
    dbHelpers.resetProgress();
    res.json({ success: true, message: 'All user progress reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static build if available
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('PRANAV Practice JAVA: Frontend building or not found.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`PRANAV Practice JAVA running on http://localhost:${PORT}`);
});

