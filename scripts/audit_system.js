const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

console.log('==============================================');
console.log('       PRANAV ARENA SYSTEM AUDIT REPORT       ');
console.log('==============================================\n');

let issues = [];

// 1. Audit Bank Files
const root = path.resolve(__dirname, '..');
const bank1Path = path.join(root, 'questions.json');
const bank2Path = path.join(root, 'questions_bank2.json');
const bank3Path = path.join(root, 'questions_bank3.json');

function auditBank(filePath, bankName, expectedPrefix) {
  if (!fs.existsSync(filePath)) {
    issues.push(`CRITICAL: ${bankName} file not found at ${filePath}`);
    return [];
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    issues.push(`CRITICAL: ${bankName} JSON parse error: ${e.message}`);
    return [];
  }

  console.log(`[✓] ${bankName}: Found ${data.length} questions`);

  const seenIds = new Set();
  data.forEach((q, idx) => {
    if (!q.id) {
      issues.push(`${bankName} item at index ${idx} is missing an 'id'`);
    } else {
      if (seenIds.has(q.id)) {
        issues.push(`${bankName} duplicate question id: ${q.id}`);
      }
      seenIds.add(q.id);
    }

    if (!q.title || q.title.trim() === '') {
      issues.push(`${bankName} question ${q.id} has empty title`);
    }

    if (!q.description || q.description.trim() === '') {
      issues.push(`${bankName} question ${q.id} has empty description`);
    }

    if (!q.topic || q.topic.trim() === '') {
      issues.push(`${bankName} question ${q.id} has empty topic`);
    }

    if (!['Easy', 'Medium', 'Hard'].includes(q.difficulty)) {
      issues.push(`${bankName} question ${q.id} has invalid difficulty: '${q.difficulty}'`);
    }

    if (!Array.isArray(q.testCases) || q.testCases.length === 0) {
      issues.push(`${bankName} question ${q.id} has no testCases array`);
    } else {
      q.testCases.forEach((tc, tcIdx) => {
        if (typeof tc.input !== 'string') {
          issues.push(`${bankName} question ${q.id} testCase[${tcIdx}] input is not a string`);
        }
        if (typeof tc.expectedOutput !== 'string') {
          issues.push(`${bankName} question ${q.id} testCase[${tcIdx}] expectedOutput is not a string`);
        }
      });
    }
  });

  return data;
}

const b1 = auditBank(bank1Path, 'Bank 1 (Original)', 'java-');
const b2 = auditBank(bank2Path, 'Bank 2 (Masterclass)', 'bank2-');
const b3 = auditBank(bank3Path, 'Bank 3 (Lab Tests)', 'bank3-');

console.log(`\nTotal questions across files: ${b1.length + b2.length + b3.length}`);

// 2. Audit SQLite Database
console.log('\n--- Auditing SQLite Database ---');
const dbPath = path.join(root, 'server', 'arena.db');
if (!fs.existsSync(dbPath)) {
  issues.push(`CRITICAL: arena.db does not exist at ${dbPath}`);
} else {
  try {
    const db = new DatabaseSync(dbPath);
    const count = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
    const b1Count = db.prepare("SELECT COUNT(*) as count FROM questions WHERE bank = 'bank1'").get().count;
    const b2Count = db.prepare("SELECT COUNT(*) as count FROM questions WHERE bank = 'bank2'").get().count;
    const b3Count = db.prepare("SELECT COUNT(*) as count FROM questions WHERE bank = 'bank3'").get().count;

    console.log(`[✓] arena.db connected. Total questions: ${count}`);
    console.log(`    - Bank 1: ${b1Count}`);
    console.log(`    - Bank 2: ${b2Count}`);
    console.log(`    - Bank 3: ${b3Count}`);

    if (count !== b1.length + b2.length + b3.length) {
      issues.push(`Database total (${count}) does not match sum of bank files (${b1.length + b2.length + b3.length})`);
    }

    const missingRecommendedLang = db.prepare("SELECT COUNT(*) as count FROM questions WHERE recommendedLanguage IS NULL OR recommendedLanguage = ''").get().count;
    if (missingRecommendedLang > 0) {
      issues.push(`Database has ${missingRecommendedLang} questions with missing recommendedLanguage`);
    } else {
      console.log(`[✓] All ${count} questions have recommendedLanguage populated`);
    }

    // Check languages distribution
    const langDist = db.prepare("SELECT recommendedLanguage, COUNT(*) as count FROM questions GROUP BY recommendedLanguage").all();
    console.log('    - Recommended Language distribution:', langDist);

  } catch (e) {
    issues.push(`SQLite query error: ${e.message}`);
  }
}

// 3. Check Screenshot Files
console.log('\n--- Auditing Screenshots ---');
const qDirs = [
  path.join(root, 'questions'),
  path.join(root, 'questions2cpp'),
  path.join(root, 'questions3'),
  path.join(root, 'questions4')
];

let allDiskScreenshots = new Set();
qDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => allDiskScreenshots.add(f.toLowerCase()));
  }
});
console.log(`[✓] Found ${allDiskScreenshots.size} total screenshot files on disk across 4 directories`);

function parseScreenshotList(raw) {
  if (!raw || typeof raw !== 'string') return [];
  const trimmed = raw.trim();
  const files = [];

  const rangeRegex = /Screenshot\s*\((\d+)\)\.png\s*-\s*Screenshot\s*\((\d+)\)\.png/gi;
  let match;
  while ((match = rangeRegex.exec(trimmed)) !== null) {
    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    for (let n = min; n <= max; n++) {
      files.push(`Screenshot (${n}).png`);
    }
  }

  const extraRegex = /,\s*\((\d+)\)\.png/gi;
  while ((match = extraRegex.exec(trimmed)) !== null) {
    files.push(`Screenshot (${match[1]}).png`);
  }

  if (files.length > 0) return Array.from(new Set(files));

  const singleRegex = /Screenshot\s*\(\d+\)\.png/gi;
  const singleMatches = trimmed.match(singleRegex);
  if (singleMatches && singleMatches.length > 0) {
    return Array.from(new Set(singleMatches));
  }

  if (trimmed.toLowerCase().endsWith('.png')) return [trimmed];
  return [];
}

let missingScreenshots = 0;
let totalScreenshotsVerified = 0;
[...b1, ...b3].forEach(q => {
  const list = parseScreenshotList(q.sourceScreenshot);
  list.forEach(file => {
    totalScreenshotsVerified++;
    if (!allDiskScreenshots.has(file.toLowerCase())) {
      missingScreenshots++;
      issues.push(`Question ${q.id} references screenshot '${file}' which was not found on disk`);
    }
  });
});
if (missingScreenshots === 0) {
  console.log(`[✓] All ${totalScreenshotsVerified} screenshot page references resolve to existing files on disk!`);
}

// 4. Audit Search for any leftover "neo" (case-insensitive) in client source
console.log('\n--- Auditing for Forbidden "neo" References ---');
let neoCount = 0;
function scanForNeo(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') scanForNeo(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      // match word "neo" not part of other words like "neon" or "Neovim" unless intended
      const matches = content.match(/\bneo\b/gi);
      if (matches) {
        matches.forEach(m => {
          neoCount++;
          issues.push(`Found forbidden '${m}' reference in ${path.relative(root, full)}`);
        });
      }
    }
  });
}
scanForNeo(path.join(root, 'client', 'src'));
if (neoCount === 0) {
  console.log('[✓] Zero "neo" references found in client source');
}

// Summary
console.log('\n==============================================');
if (issues.length === 0) {
  console.log('🎉 AUDIT PASSED: ZERO SYSTEM ERRORS DETECTED!');
} else {
  console.log(`⚠️ AUDIT FOUND ${issues.length} ISSUE(S):`);
  issues.forEach((iss, i) => console.log(`  ${i + 1}. ${iss}`));
}
console.log('==============================================');
