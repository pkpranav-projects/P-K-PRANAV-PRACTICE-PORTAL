const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, '..', 'arena.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    inputFormat TEXT,
    outputFormat TEXT,
    constraints TEXT,
    sampleInput TEXT,
    sampleOutput TEXT,
    testCases TEXT,
    topic TEXT,
    difficulty TEXT,
    sourceScreenshot TEXT,
    explanation TEXT,
    referenceSolution TEXT,
    starterCode TEXT,
    extractionStatus TEXT,
    bank TEXT DEFAULT 'bank1'
  );

  CREATE TABLE IF NOT EXISTS drafts (
    questionId TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questionId TEXT NOT NULL,
    status TEXT NOT NULL,
    passedCount INTEGER NOT NULL,
    totalCount INTEGER NOT NULL,
    executionTimeMs INTEGER,
    errorMessage TEXT,
    testResults TEXT,
    code TEXT NOT NULL,
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    questionId TEXT PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS revision (
    questionId TEXT PRIMARY KEY,
    reason TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Ensure bank column exists on preexisting databases
try {
  db.exec("ALTER TABLE questions ADD COLUMN bank TEXT DEFAULT 'bank1'");
} catch (e) {
  // column already exists
}

// Seed questions from both Bank 1 (Photo Portal) and Bank 2 (Masterclass)
function seedQuestions() {
  const insertOrReplace = db.prepare(`
    INSERT INTO questions (
      id, title, description, inputFormat, outputFormat, constraints,
      sampleInput, sampleOutput, testCases, topic, difficulty,
      sourceScreenshot, explanation, referenceSolution, starterCode, extractionStatus, bank
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      inputFormat = excluded.inputFormat,
      outputFormat = excluded.outputFormat,
      constraints = excluded.constraints,
      sampleInput = excluded.sampleInput,
      sampleOutput = excluded.sampleOutput,
      testCases = excluded.testCases,
      topic = excluded.topic,
      difficulty = excluded.difficulty,
      sourceScreenshot = excluded.sourceScreenshot,
      explanation = excluded.explanation,
      referenceSolution = excluded.referenceSolution,
      starterCode = excluded.starterCode,
      extractionStatus = excluded.extractionStatus,
      bank = excluded.bank
  `);

  // Bank 1: Screenshot Exam Questions
  const bank1Path = path.join(__dirname, '..', '..', 'questions.json');
  if (fs.existsSync(bank1Path)) {
    try {
      const data1 = JSON.parse(fs.readFileSync(bank1Path, 'utf8'));
      for (const q of data1) {
        insertOrReplace.run(
          q.id,
          q.title,
          q.description,
          q.inputFormat || '',
          q.outputFormat || '',
          JSON.stringify(q.constraints || []),
          q.sampleInput || '',
          q.sampleOutput || '',
          JSON.stringify(q.testCases || []),
          q.topic || 'General',
          q.difficulty || 'Medium',
          q.sourceScreenshot || '',
          q.explanation || '',
          q.referenceSolution || '',
          q.starterCode || '',
          q.extractionStatus || 'verified',
          'bank1'
        );
      }
      console.log(`Synchronized ${data1.length} questions for Bank 1 (Screenshot Portal).`);
    } catch (e) {
      console.error('Error loading Bank 1 questions:', e.message);
    }
  }

  // Bank 2: Masterclass & Modern Java Practice Questions
  const bank2Path = path.join(__dirname, '..', '..', 'questions_bank2.json');
  if (fs.existsSync(bank2Path)) {
    try {
      const data2 = JSON.parse(fs.readFileSync(bank2Path, 'utf8'));
      for (const q of data2) {
        insertOrReplace.run(
          q.id,
          q.title,
          q.description,
          q.inputFormat || '',
          q.outputFormat || '',
          JSON.stringify(q.constraints || []),
          q.sampleInput || '',
          q.sampleOutput || '',
          JSON.stringify(q.testCases || []),
          q.topic || 'General',
          q.difficulty || 'Medium',
          q.sourceScreenshot || 'Masterclass & Reference Source',
          q.explanation || '',
          q.referenceSolution || '',
          q.starterCode || '',
          q.extractionStatus || 'verified',
          'bank2'
        );
      }
      console.log(`Synchronized ${data2.length} questions for Bank 2 (Masterclass).`);
    } catch (e) {
      console.error('Error loading Bank 2 questions:', e.message);
    }
  }
}

seedQuestions();

// DB Query helpers
const dbHelpers = {
  getQuestions: (filters = {}) => {
    let query = `
      SELECT q.id, q.title, q.topic, q.difficulty, q.sourceScreenshot, q.bank,
             CASE WHEN b.questionId IS NOT NULL THEN 1 ELSE 0 END as isBookmarked,
             CASE WHEN r.questionId IS NOT NULL THEN 1 ELSE 0 END as isRevision,
             (SELECT status FROM submissions WHERE questionId = q.id ORDER BY id DESC LIMIT 1) as lastStatus,
             CASE WHEN EXISTS(SELECT 1 FROM submissions WHERE questionId = q.id AND status = 'Accepted') THEN 'Solved'
                  WHEN EXISTS(SELECT 1 FROM submissions WHERE questionId = q.id) THEN 'Attempted'
                  ELSE 'Not Started' END as userStatus
      FROM questions q
      LEFT JOIN bookmarks b ON q.id = b.questionId
      LEFT JOIN revision r ON q.id = r.questionId
      WHERE 1=1
    `;
    const params = [];

    if (filters.bank && filters.bank !== 'all') {
      query += ` AND q.bank = ?`;
      params.push(filters.bank);
    }
    if (filters.topic && filters.topic !== 'all') {
      query += ` AND q.topic = ?`;
      params.push(filters.topic);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      query += ` AND q.difficulty = ?`;
      params.push(filters.difficulty);
    }
    if (filters.search) {
      query += ` AND (q.title LIKE ? OR q.description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    let rows = db.prepare(query).all(...params);

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'bookmarked') {
        rows = rows.filter(r => r.isBookmarked === 1);
      } else if (filters.status === 'revision') {
        rows = rows.filter(r => r.isRevision === 1);
      } else {
        rows = rows.filter(r => r.userStatus.toLowerCase() === filters.status.toLowerCase());
      }
    }

    if (filters.sort) {
      if (filters.sort === 'title') {
        rows.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.sort === 'difficulty') {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        rows.sort((a, b) => (order[a.difficulty] || 2) - (order[b.difficulty] || 2));
      } else if (filters.sort === 'topic') {
        rows.sort((a, b) => a.topic.localeCompare(b.topic));
      }
    }

    return rows;
  },

  getQuestionById: (id) => {
    const q = db.prepare(`
      SELECT q.*,
             CASE WHEN b.questionId IS NOT NULL THEN 1 ELSE 0 END as isBookmarked,
             CASE WHEN r.questionId IS NOT NULL THEN 1 ELSE 0 END as isRevision,
             d.code as draftCode,
             CASE WHEN EXISTS(SELECT 1 FROM submissions WHERE questionId = q.id AND status = 'Accepted') THEN 'Solved'
                  WHEN EXISTS(SELECT 1 FROM submissions WHERE questionId = q.id) THEN 'Attempted'
                  ELSE 'Not Started' END as userStatus
      FROM questions q
      LEFT JOIN bookmarks b ON q.id = b.questionId
      LEFT JOIN revision r ON q.id = r.questionId
      LEFT JOIN drafts d ON q.id = d.questionId
      WHERE q.id = ?
    `).get(id);

    if (!q) return null;

    return {
      ...q,
      constraints: JSON.parse(q.constraints || '[]'),
      testCases: JSON.parse(q.testCases || '[]')
    };
  },

  saveDraft: (questionId, code) => {
    const stmt = db.prepare(`
      INSERT INTO drafts (questionId, code, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(questionId) DO UPDATE SET code = excluded.code, updatedAt = CURRENT_TIMESTAMP
    `);
    return stmt.run(questionId, code);
  },

  getDraft: (questionId) => {
    return db.prepare('SELECT code, updatedAt FROM drafts WHERE questionId = ?').get(questionId);
  },

  toggleBookmark: (questionId) => {
    const exists = db.prepare('SELECT 1 FROM bookmarks WHERE questionId = ?').get(questionId);
    if (exists) {
      db.prepare('DELETE FROM bookmarks WHERE questionId = ?').run(questionId);
      return false;
    } else {
      db.prepare('INSERT INTO bookmarks (questionId) VALUES (?)').run(questionId);
      return true;
    }
  },

  toggleRevision: (questionId, reason = '') => {
    const exists = db.prepare('SELECT 1 FROM revision WHERE questionId = ?').get(questionId);
    if (exists) {
      db.prepare('DELETE FROM revision WHERE questionId = ?').run(questionId);
      return false;
    } else {
      db.prepare('INSERT INTO revision (questionId, reason) VALUES (?, ?)').run(questionId, reason);
      return true;
    }
  },

  addSubmission: (sub) => {
    const stmt = db.prepare(`
      INSERT INTO submissions (
        questionId, status, passedCount, totalCount, executionTimeMs, errorMessage, testResults, code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      sub.questionId,
      sub.status,
      sub.passedCount,
      sub.totalCount,
      sub.executionTimeMs || 0,
      sub.errorMessage || '',
      JSON.stringify(sub.testResults || []),
      sub.code
    );
  },

  getSubmissions: (limit = 50, questionId = null) => {
    let query = `
      SELECT s.*, q.title as questionTitle, q.topic, q.difficulty
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
    `;
    const params = [];
    if (questionId) {
      query += ` WHERE s.questionId = ?`;
      params.push(questionId);
    }
    query += ` ORDER BY s.id DESC LIMIT ?`;
    params.push(limit);

    const rows = db.prepare(query).all(...params);
    return rows.map(r => ({
      ...r,
      testResults: JSON.parse(r.testResults || '[]')
    }));
  },

  getStats: () => {
    const totalQuestions = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
    
    // Bank specific totals and solved
    const bank1Total = db.prepare("SELECT COUNT(*) as count FROM questions WHERE bank = 'bank1'").get().count;
    const bank2Total = db.prepare("SELECT COUNT(*) as count FROM questions WHERE bank = 'bank2'").get().count;

    const bank1Solved = db.prepare(`
      SELECT COUNT(DISTINCT q.id) as count
      FROM questions q
      JOIN submissions s ON q.id = s.questionId
      WHERE q.bank = 'bank1' AND s.status = 'Accepted'
    `).get().count;

    const bank2Solved = db.prepare(`
      SELECT COUNT(DISTINCT q.id) as count
      FROM questions q
      JOIN submissions s ON q.id = s.questionId
      WHERE q.bank = 'bank2' AND s.status = 'Accepted'
    `).get().count;

    const solvedRows = db.prepare(`
      SELECT DISTINCT questionId FROM submissions WHERE status = 'Accepted'
    `).all();
    const solvedCount = solvedRows.length;

    const attemptedRows = db.prepare(`
      SELECT DISTINCT questionId FROM submissions WHERE status != 'Accepted'
        AND questionId NOT IN (SELECT questionId FROM submissions WHERE status = 'Accepted')
    `).all();
    const attemptedCount = attemptedRows.length;

    const notStartedCount = Math.max(0, totalQuestions - solvedCount - attemptedCount);
    const revisionCount = db.prepare('SELECT COUNT(*) as count FROM revision').get().count;
    const bookmarkCount = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get().count;

    const allSubs = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) as accepted FROM submissions").get();
    const totalSubmissions = allSubs.total || 0;
    const accuracy = totalSubmissions > 0 ? Math.round((allSubs.accepted / totalSubmissions) * 100) : 0;

    // Topic wise
    const topicStats = db.prepare(`
      SELECT q.topic,
             COUNT(DISTINCT q.id) as total,
             COUNT(DISTINCT CASE WHEN s.status = 'Accepted' THEN q.id END) as solved
      FROM questions q
      LEFT JOIN submissions s ON q.id = s.questionId
      GROUP BY q.topic
    `).all();

    // Difficulty wise
    const difficultyStats = db.prepare(`
      SELECT q.difficulty,
             COUNT(DISTINCT q.id) as total,
             COUNT(DISTINCT CASE WHEN s.status = 'Accepted' THEN q.id END) as solved
      FROM questions q
      LEFT JOIN submissions s ON q.id = s.questionId
      GROUP BY q.difficulty
    `).all();

    // Recent activity (last 10 submissions)
    const recentActivity = db.prepare(`
      SELECT s.id, s.questionId, q.title, s.status, s.passedCount, s.totalCount, s.executionTimeMs, s.submittedAt
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      ORDER BY s.id DESC LIMIT 8
    `).all();

    // Goal preference
    const goalRow = db.prepare("SELECT value FROM settings WHERE key = 'dailyGoal'").get();
    const dailyGoal = goalRow ? parseInt(goalRow.value, 10) : 3;

    // Solved today count
    const solvedToday = db.prepare(`
      SELECT COUNT(DISTINCT questionId) as count
      FROM submissions
      WHERE status = 'Accepted'
        AND date(submittedAt) = date('now')
    `).get().count;

    return {
      totalQuestions,
      bank1Total,
      bank1Solved,
      bank2Total,
      bank2Solved,
      solvedCount,
      attemptedCount,
      notStartedCount,
      revisionCount,
      bookmarkCount,
      totalSubmissions,
      accuracy,
      completionPercentage: totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0,
      topicStats,
      difficultyStats,
      recentActivity,
      dailyGoal,
      solvedToday
    };
  },

  getSettings: () => {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {
      theme: 'system',
      editorFontSize: 14,
      editorTabSize: 4,
      dailyGoal: 3,
      autoSave: true,
      soundEffects: false
    };
    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }
    return settings;
  },

  setSetting: (key, value) => {
    const stmt = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    return stmt.run(key, typeof value === 'string' ? value : JSON.stringify(value));
  },

  exportAll: () => {
    const questions = db.prepare('SELECT * FROM questions').all();
    const drafts = db.prepare('SELECT * FROM drafts').all();
    const submissions = db.prepare('SELECT * FROM submissions').all();
    const bookmarks = db.prepare('SELECT * FROM bookmarks').all();
    const revision = db.prepare('SELECT * FROM revision').all();
    const settings = db.prepare('SELECT * FROM settings').all();

    return {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      data: {
        questions,
        drafts,
        submissions,
        bookmarks,
        revision,
        settings
      }
    };
  },

  importAll: (backup) => {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup file format');
    }
    const { drafts, submissions, bookmarks, revision, settings } = backup.data;

    db.exec('BEGIN TRANSACTION');
    try {
      if (drafts) {
        db.exec('DELETE FROM drafts');
        const stmt = db.prepare('INSERT INTO drafts (questionId, code, updatedAt) VALUES (?, ?, ?)');
        for (const d of drafts) stmt.run(d.questionId, d.code, d.updatedAt);
      }
      if (submissions) {
        db.exec('DELETE FROM submissions');
        const stmt = db.prepare('INSERT INTO submissions (id, questionId, status, passedCount, totalCount, executionTimeMs, errorMessage, testResults, code, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const s of submissions) stmt.run(s.id, s.questionId, s.status, s.passedCount, s.totalCount, s.executionTimeMs, s.errorMessage, s.testResults, s.code, s.submittedAt);
      }
      if (bookmarks) {
        db.exec('DELETE FROM bookmarks');
        const stmt = db.prepare('INSERT INTO bookmarks (questionId, createdAt) VALUES (?, ?)');
        for (const b of bookmarks) stmt.run(b.questionId, b.createdAt);
      }
      if (revision) {
        db.exec('DELETE FROM revision');
        const stmt = db.prepare('INSERT INTO revision (questionId, reason, createdAt) VALUES (?, ?, ?)');
        for (const r of revision) stmt.run(r.questionId, r.reason, r.createdAt);
      }
      if (settings) {
        db.exec('DELETE FROM settings');
        const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
        for (const s of settings) stmt.run(s.key, s.value);
      }
      db.exec('COMMIT');
      return true;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  },

  resetProgress: () => {
    db.exec('BEGIN TRANSACTION');
    try {
      db.exec('DELETE FROM drafts');
      db.exec('DELETE FROM submissions');
      db.exec('DELETE FROM bookmarks');
      db.exec('DELETE FROM revision');
      db.exec('COMMIT');
      return true;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  }
};

module.exports = {
  db,
  dbHelpers
};
