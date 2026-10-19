const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const { spawnSync, exec } = require('node:child_process');
const { dbHelpers } = require('./db');
const { JavaExecutor } = require('./executor');
const { getCurriculum, documentsDir } = require('./curriculum');
const { getMasterclassData } = require('./masterclass');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static route to view original source screenshots
const questionsDir = path.resolve(__dirname, '../../questions');
app.use('/api/screenshots', express.static(questionsDir));

// Health check endpoint verifying Java JDK
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
    const { code } = req.body;
    if (typeof code !== 'string') {
      return res.status(400).json({ error: 'Code string is required' });
    }
    dbHelpers.saveDraft(req.params.id, code);
    res.json({ success: true, updatedAt: new Date().toISOString() });
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
  const { code, input } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Java source code is required' });
  }

  try {
    const result = await JavaExecutor.runSingle(code, input || '');
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
  const { questionId, code } = req.body;
  if (!questionId || !code) {
    return res.status(400).json({ error: 'questionId and code are required' });
  }

  const question = dbHelpers.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  try {
    const evalResult = await JavaExecutor.evaluateSubmission(code, question.testCases);
    
    // Save submission record in SQLite
    dbHelpers.addSubmission({
      questionId,
      status: evalResult.status,
      passedCount: evalResult.passedCount,
      totalCount: evalResult.totalCount,
      executionTimeMs: evalResult.executionTimeMs,
      errorMessage: evalResult.errorMessage,
      testResults: evalResult.testResults,
      code
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

// Open document directly in user's OS native viewer without downloading
app.post('/api/documents/open', (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const safeFilename = path.basename(filename);
  const targetPath = path.join(documentsDir, safeFilename);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'Document file not found in documentss folder' });
  }

  // Windows command to open file in registered default application
  const cmd = `powershell -Command "Start-Process -FilePath '${targetPath.replace(/'/g, "''")}'"`;
  exec(cmd, (err) => {
    if (err) {
      console.error('Failed to open document:', err);
      return res.status(500).json({ error: 'Failed to launch default application' });
    }
    res.json({ success: true, message: `Opened ${safeFilename} in native system viewer` });
  });
});

// Optional static preview
app.use('/api/documents/raw', express.static(documentsDir));

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

