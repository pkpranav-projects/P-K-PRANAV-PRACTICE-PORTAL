import sys
sys.stdout.reconfigure(encoding='utf-8')

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MySQL Full Masterclass (Basics to Advanced & Exam Mastery)</title>
  <style>
    :root {
      --bg: #000000;
      --surface: #0a0a0a;
      --surface-hover: #141414;
      --card: #050505;
      --border: #1e2430;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-soft: rgba(56, 189, 248, 0.12);
      --green: #10b981;
      --green-soft: rgba(16, 185, 129, 0.12);
      --amber: #fbbf24;
      --amber-soft: rgba(251, 191, 36, 0.12);
      --code-bg: #000000;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.65;
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar Navigation */
    aside {
      width: 320px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 0.4rem;
    }
    .brand-sub {
      font-size: 0.78rem;
      color: var(--muted);
      margin-bottom: 1.2rem;
    }

    .search-box {
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.55rem 0.8rem;
      color: var(--text);
      font-size: 0.85rem;
      margin-bottom: 1.2rem;
      outline: none;
    }
    .search-box:focus { border-color: var(--accent); }

    nav ul { list-style: none; }
    nav li { margin-bottom: 0.35rem; }
    nav a {
      display: block;
      padding: 0.45rem 0.7rem;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.15s;
    }
    nav a:hover {
      background: var(--surface-hover);
      color: var(--accent);
    }
    .phase-badge {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--green);
      margin-top: 1rem;
      margin-bottom: 0.4rem;
      padding-left: 0.5rem;
      display: block;
    }

    /* Main Content Area */
    main {
      flex: 1;
      padding: 2.5rem 3.5rem;
      max-width: 1100px;
      overflow-y: auto;
    }

    .hero {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 2.2rem;
      margin-bottom: 2.5rem;
      position: relative;
    }
    .hero h1 {
      font-size: 2.3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #38bdf8 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.8rem;
    }
    .hero p {
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.7;
    }

    /* Topic Section Cards */
    .topic-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      scroll-margin-top: 2rem;
    }
    .topic-card h2 {
      font-size: 1.5rem;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.6rem;
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .topic-card h3 {
      font-size: 1.15rem;
      color: var(--accent);
      margin-top: 1.5rem;
      margin-bottom: 0.6rem;
    }
    .topic-card p {
      color: #cbd5e1;
      margin-bottom: 1rem;
      line-height: 1.75;
    }

    /* Callout & Memory Tricks */
    .callout {
      background: rgba(56, 189, 248, 0.08);
      border-left: 4px solid var(--accent);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1.2rem 0;
      color: #e2e8f0;
      font-size: 0.95rem;
    }
    .callout-amber {
      background: rgba(251, 191, 36, 0.08);
      border-left-color: var(--amber);
    }
    .callout-green {
      background: rgba(16, 185, 129, 0.08);
      border-left-color: var(--green);
    }
    .callout b { color: #f8fafc; font-weight: 700; }

    /* Code Container */
    .code-box {
      position: relative;
      margin: 1.2rem 0;
    }
    .code-box pre {
      background: #000000;
      border: 1px solid var(--border);
      border-left: 4px solid var(--green);
      border-radius: 10px;
      padding: 1.2rem 1.4rem;
      padding-top: 2.2rem;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.92rem;
      line-height: 1.65;
      color: #e2e8f0;
      white-space: pre-wrap;
    }
    .copy-btn {
      position: absolute;
      top: 0.55rem;
      right: 0.55rem;
      background: rgba(16, 185, 129, 0.15);
      color: var(--green);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 0.25rem 0.65rem;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .copy-btn:hover {
      background: var(--green);
      color: #000000;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.25rem 0;
      background: #000000;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      font-size: 0.9rem;
    }
    th {
      background: #0a0a0a;
      color: var(--accent);
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #141922;
      color: #cbd5e1;
    }
    tr:nth-child(even) td { background-color: #030303; }
    tr:hover td { background-color: #0c0c0c; }

    code.inline {
      background: #0d121c;
      color: var(--accent);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0.15rem 0.45rem;
      font-size: 0.88em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    /* Interactive Quiz Box */
    .quiz-card {
      background: #080c14;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.8rem;
      margin-top: 2rem;
    }
    .question-block {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #141922;
    }
    .question-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.8rem;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
    }
    .quiz-option {
      background: #000000;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.65rem 1rem;
      color: #cbd5e1;
      font-size: 0.88rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
    }
    .quiz-option:hover {
      background: var(--surface-hover);
      border-color: var(--accent);
    }
    .quiz-option.correct {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: var(--green) !important;
      color: #34d399 !important;
      font-weight: 700;
    }
    .quiz-option.wrong {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: #ef4444 !important;
      color: #fca5a5 !important;
    }
    .explanation-box {
      margin-top: 0.6rem;
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.82rem;
      display: none;
    }

    @media (max-width: 900px) {
      body { flex-direction: column; }
      aside { width: 100%; height: auto; position: static; }
      main { padding: 1.5rem; }
      .options-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside>
    <div class="brand">
      <span>🐬 MySQL Masterclass</span>
    </div>
    <div class="brand-sub">Basics to Advanced & Exam Mastery (ELI5)</div>
    <input type="text" id="searchInput" class="search-box" placeholder="Search topics, syntax, queries..." onkeyup="filterNav()">

    <nav>
      <span class="phase-badge">Phase 1 — Basics & SQL</span>
      <ul>
        <li><a href="#t1">1. What is MySQL?</a></li>
        <li><a href="#t2">2. MySQL vs SQL</a></li>
        <li><a href="#t3">3. Types of SQL Commands</a></li>
        <li><a href="#t4">4. Create Database & USE</a></li>
        <li><a href="#t5">5. Create Table & Data Types</a></li>
        <li><a href="#t6">6. Insert & Select Data</a></li>
        <li><a href="#t7">7. Update & Delete Data</a></li>
        <li><a href="#t8">8. DELETE vs TRUNCATE vs DROP</a></li>
      </ul>

      <span class="phase-badge">Phase 2 — Filtering & Sorting</span>
      <ul>
        <li><a href="#t9">9. The WHERE Clause</a></li>
        <li><a href="#t10">10. DISTINCT Keyword</a></li>
        <li><a href="#t11">11. ORDER BY (ASC/DESC)</a></li>
        <li><a href="#t12">12. LIMIT & Pagination</a></li>
        <li><a href="#t13">13. BETWEEN, IN, and LIKE</a></li>
        <li><a href="#t14">14. NULL & 3-Valued Logic</a></li>
      </ul>

      <span class="phase-badge">Phase 3 — Aggregates & Grouping</span>
      <ul>
        <li><a href="#t15">15. Aggregate Functions & GROUP BY</a></li>
        <li><a href="#t16">16. HAVING vs WHERE & Query Order</a></li>
      </ul>

      <span class="phase-badge">Phase 4 — Keys, Constraints & Joins</span>
      <ul>
        <li><a href="#t17">17. Primary Key, FK & Constraints</a></li>
        <li><a href="#t18">18. Relationships (1:1, 1:N, M:N)</a></li>
        <li><a href="#t19">19. SQL Joins (INNER, LEFT, RIGHT, SELF)</a></li>
      </ul>

      <span class="phase-badge">Phase 5 — Advanced SQL</span>
      <ul>
        <li><a href="#t20">20. Subqueries & Derived Tables</a></li>
        <li><a href="#t21">21. EXISTS Operator</a></li>
        <li><a href="#t22">22. UNION vs UNION ALL</a></li>
        <li><a href="#t23">23. CASE Expressions</a></li>
        <li><a href="#t24">24. Views (Updatable & Check Option)</a></li>
        <li><a href="#t25">25. Indexes & EXPLAIN Plan</a></li>
        <li><a href="#t26">26. Stored Procedures, Triggers & Cursors</a></li>
      </ul>

      <span class="phase-badge">Phase 6 — Transactions & Design</span>
      <ul>
        <li><a href="#t27">27. ACID Properties</a></li>
        <li><a href="#t28">28. COMMIT, ROLLBACK & SAVEPOINT</a></li>
        <li><a href="#t29">29. Normalization (1NF to BCNF)</a></li>
        <li><a href="#t30">30. Security, GRANT & Prepared Stmts</a></li>
        <li><a href="#functions">📚 Essential Functions Cheat-Sheet</a></li>
        <li><a href="#quiz">🎯 Final Mastery Check (8 Questions)</a></li>
      </ul>
    </nav>
  </aside>

  <!-- Main Content -->
  <main>
    <div class="hero">
      <h1>MySQL Full Masterclass</h1>
      <p>A comprehensive, exam-ready guide covering foundational relational concepts to advanced database architecture. Uses a single unified <b>College Database</b> schema throughout to make every query easy to follow.</p>
    </div>

    <!-- PHASE 1 -->
    <div class="topic-card" id="t1">
      <h2>1. What is MySQL?</h2>
      <p><b>MySQL</b> is an open-source <b>Relational Database Management System (RDBMS)</b> that stores, organizes, modifies, and retrieves data organized into tabular relations.</p>
      <div class="callout callout-green">
        <b>Core Architecture Terms:</b><br>
        • <b>Database:</b> A container/schema storing interrelated tables.<br>
        • <b>Table:</b> Two-dimensional grid composed of horizontal rows and vertical columns.<br>
        • <b>Row (Tuple/Record):</b> One complete data instance (e.g. Student Arun).<br>
        • <b>Column (Attribute/Field):</b> A named category storing specific data types (e.g. <code>marks</code>).
      </div>
      <h3>The Master College Schema Table: <code>Student</code></h3>
      <table>
        <thead>
          <tr>
            <th>id (PK)</th>
            <th>name</th>
            <th>age</th>
            <th>department</th>
            <th>marks</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Arun</td><td>19</td><td>CYS</td><td>85.50</td></tr>
          <tr><td>2</td><td>Priya</td><td>20</td><td>CSE</td><td>92.00</td></tr>
          <tr><td>3</td><td>Rahul</td><td>19</td><td>CYS</td><td>76.00</td></tr>
          <tr><td>4</td><td>Divya</td><td>21</td><td>ECE</td><td>88.50</td></tr>
          <tr><td>5</td><td>Kiran</td><td>20</td><td>CSE</td><td>67.00</td></tr>
        </tbody>
      </table>
    </div>

    <div class="topic-card" id="t2">
      <h2>2. MySQL vs SQL</h2>
      <p><b>SQL (Structured Query Language):</b> The international ANSI standard declarative language used to communicate with relational databases.</p>
      <p><b>MySQL:</b> The database management software engine that runs as a background service, stores files on disk, and parses/executes SQL commands.</p>
      <div class="callout">
        <b>Analogy:</b> SQL is English (the language); MySQL is the person listening and performing the requested tasks.
      </div>
    </div>

    <div class="topic-card" id="t3">
      <h2>3. Types of SQL Commands</h2>
      <p>Every SQL statement belongs to one of five functional command sub-languages:</p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Full Form</th>
            <th>Commands</th>
            <th>Key Property</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>DDL</b></td><td>Data Definition Language</td><td><code>CREATE, ALTER, DROP, TRUNCATE, RENAME</code></td><td>Modifies database schema; <b>auto-commits immediately</b>.</td></tr>
          <tr><td><b>DML</b></td><td>Data Manipulation Language</td><td><code>INSERT, UPDATE, DELETE</code></td><td>Modifies data rows; can be undone with <code>ROLLBACK</code>.</td></tr>
          <tr><td><b>DQL</b></td><td>Data Query Language</td><td><code>SELECT</code></td><td>Retrieves data without mutating table state.</td></tr>
          <tr><td><b>DCL</b></td><td>Data Control Language</td><td><code>GRANT, REVOKE</code></td><td>Configures user authentication and security permissions.</td></tr>
          <tr><td><b>TCL</b></td><td>Transaction Control Language</td><td><code>COMMIT, ROLLBACK, SAVEPOINT</code></td><td>Guarantees atomic multi-statement transaction execution.</td></tr>
        </tbody>
      </table>
      <div class="callout callout-amber">
        <b>Memory Trick:</b> <b>D</b>esign (DDL), <b>M</b>odify (DML), <b>Q</b>uery (DQL), <b>C</b>ontrol (DCL), <b>T</b>ransaction (TCL).
      </div>
    </div>

    <div class="topic-card" id="t4">
      <h2>4. Create Database & USE</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- 1. Create a new database
CREATE DATABASE college;

-- 2. Inspect available databases on the server
SHOW DATABASES;

-- 3. Select the active database session
USE college;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t5">
      <h2>5. Create Table & Data Types</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>CREATE TABLE Student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT,
    department VARCHAR(30),
    marks DECIMAL(5,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inspect table schema definition
DESCRIBE Student;</code></pre>
      </div>
      <h3>Essential Data Types Explained:</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Storage / Meaning</th>
            <th>Lab Exam Example</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>INT</code></td><td>4-byte integer (-2.14B to +2.14B)</td><td><code>id INT</code>, <code>age INT</code></td></tr>
          <tr><td><code>VARCHAR(N)</code></td><td>Variable text up to N characters (saves space)</td><td><code>name VARCHAR(50)</code></td></tr>
          <tr><td><code>DECIMAL(p, s)</code></td><td>Exact fixed-point (p = total digits, s = decimal places)</td><td><code>marks DECIMAL(5,2)</code> &rarr; e.g. 999.99</td></tr>
          <tr><td><code>PRIMARY KEY</code></td><td>Unique identifier; forbids NULLs; builds clustered index</td><td><code>id INT PRIMARY KEY</code></td></tr>
          <tr><td><code>AUTO_INCREMENT</code></td><td>Automatically generates sequential integers ($1, 2, 3...$)</td><td>Unique row IDs without manual input</td></tr>
          <tr><td><code>NOT NULL</code></td><td>Enforces that every record must supply a value</td><td>Prevents missing student names</td></tr>
        </tbody>
      </table>
    </div>

    <div class="topic-card" id="t6">
      <h2>6. Insert & Select Data</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Insert multiple student rows in a single batch
INSERT INTO Student (name, age, department, marks) VALUES
('Arun', 19, 'CYS', 85.50),
('Priya', 20, 'CSE', 92.00),
('Rahul', 19, 'CYS', 76.00),
('Divya', 21, 'ECE', 88.50),
('Kiran', 20, 'CSE', 67.00);

-- Display all rows and columns (* = all)
SELECT * FROM Student;

-- Column projection (retrieves only specified columns)
SELECT name, marks FROM Student;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t7">
      <h2>7. Update & Delete Data</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Update Priya's marks with WHERE filter
UPDATE Student 
SET marks = 95.00 
WHERE name = 'Priya';

-- Delete Kiran's record (id = 5)
DELETE FROM Student 
WHERE id = 5;</code></pre>
      </div>
      <div class="callout callout-amber">
        <b>⚠️ Critical Exam Warning:</b> Running <code>UPDATE</code> or <code>DELETE</code> without a <code>WHERE</code> clause mutates or erases <b>EVERY ROW</b> in the table! If MySQL displays Error 1175 (Safe Updates), temporarily run: <code>SET SQL_SAFE_UPDATES = 0;</code>
      </div>
    </div>

    <div class="topic-card" id="t8">
      <h2>8. DELETE vs TRUNCATE vs DROP</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>DELETE</th>
            <th>TRUNCATE</th>
            <th>DROP</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>Language Type</b></td><td>DML</td><td>DDL</td><td>DDL</td></tr>
          <tr><td><b>WHERE Clause</b></td><td>Allowed (Selective)</td><td>Forbidden (All rows)</td><td>Not applicable</td></tr>
          <tr><td><b>Speed</b></td><td>Slow (Logs row-by-row)</td><td>Fast (Deallocates pages)</td><td>Instant (Drops definition)</td></tr>
          <tr><td><b>Auto-Increment</b></td><td>Retains current counter</td><td>Resets counter to 1</td><td>Table destroyed</td></tr>
          <tr><td><b>Rollback (InnoDB)</b></td><td>Can be rolled back</td><td>Auto-commits immediately</td><td>Auto-commits immediately</td></tr>
          <tr><td><b>Table Structure</b></td><td>Preserved</td><td>Preserved</td><td>Completely Deleted</td></tr>
        </tbody>
      </table>
    </div>

    <!-- PHASE 2 -->
    <div class="topic-card" id="t9">
      <h2>9. The WHERE Clause & Comparison Operators</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Marks strictly greater than 80
SELECT * FROM Student WHERE marks > 80;

-- Logical AND (Both conditions must be TRUE)
SELECT * FROM Student WHERE department = 'CYS' AND marks > 80;

-- Logical OR (At least one condition must be TRUE)
SELECT * FROM Student WHERE department = 'CYS' OR department = 'CSE';

-- Comparison Operators: = (equal), != or <> (not equal), >, <, >=, <=</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t10">
      <h2>10. DISTINCT Keyword</h2>
      <p>Eliminates duplicate values from the query result set.</p>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Shows unique departments: 'CYS', 'CSE', 'ECE'
SELECT DISTINCT department FROM Student;

-- Multi-column distinct: Unique department + age pairs
SELECT DISTINCT department, age FROM Student;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t11">
      <h2>11. ORDER BY (ASC / DESC)</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Ascending (Lowest marks first)
SELECT * FROM Student ORDER BY marks ASC;

-- Descending (Highest marks first)
SELECT * FROM Student ORDER BY marks DESC;

-- Multi-column sort: Department alphabetically, then marks descending
SELECT * FROM Student ORDER BY department ASC, marks DESC;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t12">
      <h2>12. LIMIT & Pagination</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Top 3 students with highest marks
SELECT * FROM Student 
ORDER BY marks DESC 
LIMIT 3;

-- Pagination: LIMIT count OFFSET offset (Skip first 2, take next 2)
SELECT * FROM Student 
ORDER BY marks DESC 
LIMIT 2 OFFSET 2;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t13">
      <h2>13. BETWEEN, IN, and LIKE</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Inclusive range [70, 90]
SELECT * FROM Student WHERE marks BETWEEN 70 AND 90;

-- Discrete set matching
SELECT * FROM Student WHERE department IN ('CYS', 'CSE');

-- Wildcard '%': Match zero or more characters (Names starting with 'A')
SELECT * FROM Student WHERE name LIKE 'A%';

-- Wildcard '_': Match exactly ONE character (Names with exactly 5 letters)
SELECT * FROM Student WHERE name LIKE '_____';</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t14">
      <h2>14. NULL & Three-Valued Logic</h2>
      <p>In SQL, <code>NULL</code> denotes missing, unassigned, or unknown information. It is <b>not equal to zero</b>, nor is it an empty string <code>''</code>.</p>
      <div class="callout callout-amber">
        <b>Examiner Trap:</b> Never write <code>WHERE age = NULL</code>! Comparisons with NULL evaluate to <b>UNKNOWN</b>. Always write:
      </div>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>SELECT * FROM Student WHERE age IS NULL;
SELECT * FROM Student WHERE age IS NOT NULL;

-- Built-in fallback: If age is NULL, display 18
SELECT name, IFNULL(age, 18) AS display_age FROM Student;</code></pre>
      </div>
    </div>

    <!-- PHASE 3 -->
    <div class="topic-card" id="t15">
      <h2>15. Aggregate Functions & GROUP BY</h2>
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Purpose</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>COUNT(*)</code></td><td>Counts total rows including NULLs</td><td><code>SELECT COUNT(*) FROM Student;</code></td></tr>
          <tr><td><code>COUNT(col)</code></td><td>Counts non-NULL values in column</td><td><code>SELECT COUNT(age) FROM Student;</code></td></tr>
          <tr><td><code>SUM(col)</code></td><td>Calculates arithmetic total</td><td><code>SELECT SUM(marks) FROM Student;</code></td></tr>
          <tr><td><code>AVG(col)</code></td><td>Calculates mean value</td><td><code>SELECT AVG(marks) FROM Student;</code></td></tr>
          <tr><td><code>MAX(col)</code></td><td>Returns highest value</td><td><code>SELECT MAX(marks) FROM Student;</code></td></tr>
          <tr><td><code>MIN(col)</code></td><td>Returns lowest value</td><td><code>SELECT MIN(marks) FROM Student;</code></td></tr>
        </tbody>
      </table>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Average marks calculated separately for each department
SELECT department, COUNT(*) AS total_students, ROUND(AVG(marks), 2) AS avg_marks
FROM Student
GROUP BY department;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t16">
      <h2>16. HAVING vs WHERE & Logical Query Order</h2>
      <div class="callout">
        • <b>WHERE:</b> Filters individual rows <i>before</i> grouping. Cannot contain aggregate functions.<br>
        • <b>HAVING:</b> Filters summarized groups <i>after</i> grouping. Operates on aggregates.
      </div>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>SELECT department, ROUND(AVG(marks), 2) AS avg_marks
FROM Student
WHERE marks >= 60          -- 1. Filter rows first
GROUP BY department        -- 2. Group by department
HAVING AVG(marks) > 80     -- 3. Filter groups with avg > 80
ORDER BY avg_marks DESC    -- 4. Sort results
LIMIT 5;                   -- 5. Paginate</code></pre>
      </div>
      <div class="callout callout-green">
        <b>Execution Sequence:</b> <code>FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; DISTINCT &rarr; ORDER BY &rarr; LIMIT</code>
      </div>
    </div>

    <!-- PHASE 4 -->
    <div class="topic-card" id="t17">
      <h2>17. Primary Key, Foreign Key & Integrity Constraints</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Parent Table
CREATE TABLE Department (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);

-- Child Table with Foreign Key
CREATE TABLE StudentDetails (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Table demonstrating CHECK and DEFAULT
CREATE TABLE Exam (
    exam_id INT PRIMARY KEY,
    marks INT CHECK (marks BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'Pending'
);</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t18">
      <h2>18. Relationship Types (1:1, 1:N, M:N)</h2>
      <p>• <b>One-to-One (1:1):</b> One student has exactly one passport record. Implemented by placing a Foreign Key with a <code>UNIQUE</code> constraint.</p>
      <p>• <b>One-to-Many (1:N):</b> One department has multiple students. Implemented by placing <code>dept_id</code> as Foreign Key in the <code>Student</code> table.</p>
      <p>• <b>Many-to-Many (M:N):</b> Students enroll in multiple courses, and courses have multiple students. Requires an intermediary <b>Junction Table</b>:</p>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>CREATE TABLE StudentCourse (
    student_id INT,
    course_id INT,
    semester INT DEFAULT 1,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE
);</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t19">
      <h2>19. All SQL Joins Complete Guide</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- 1. INNER JOIN (Only matching rows)
SELECT S.name, D.dept_name
FROM StudentDetails S
INNER JOIN Department D ON S.dept_id = D.dept_id;

-- 2. LEFT JOIN (All students + matching dept, NULL if unassigned)
SELECT S.name, D.dept_name
FROM StudentDetails S
LEFT JOIN Department D ON S.dept_id = D.dept_id;

-- 3. RIGHT JOIN (All departments + matching students, NULL if empty dept)
SELECT S.name, D.dept_name
FROM StudentDetails S
RIGHT JOIN Department D ON S.dept_id = D.dept_id;

-- 4. FULL OUTER JOIN (MySQL emulates via UNION of LEFT + RIGHT)
SELECT S.name, D.dept_name FROM StudentDetails S LEFT JOIN Department D ON S.dept_id = D.dept_id
UNION
SELECT S.name, D.dept_name FROM StudentDetails S RIGHT JOIN Department D ON S.dept_id = D.dept_id;

-- 5. CROSS JOIN (Cartesian product: M × N rows)
SELECT S.name, D.dept_name
FROM StudentDetails S
CROSS JOIN Department D;

-- 6. SELF JOIN (Hierarchical parent-child / mentor-student)
SELECT E.name AS Student, M.name AS Mentor
FROM StudentDetails E
LEFT JOIN StudentDetails M ON E.mentor_id = M.id;</code></pre>
      </div>
    </div>

    <!-- PHASE 5 -->
    <div class="topic-card" id="t20">
      <h2>20. Subqueries & Derived Tables</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Single-Value Subquery: Students scoring above average
SELECT name, marks 
FROM Student 
WHERE marks > (SELECT AVG(marks) FROM Student);

-- Derived Table in FROM (MySQL requires an alias like 'AS temp')
SELECT AVG(dept_count) FROM (
    SELECT department, COUNT(*) AS dept_count 
    FROM Student 
    GROUP BY department
) AS temp;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t21">
      <h2>21. EXISTS Operator</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Find departments that have at least one enrolled student
SELECT D.dept_name 
FROM Department D
WHERE EXISTS (
    SELECT 1 
    FROM StudentDetails S 
    WHERE S.dept_id = D.dept_id
);</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t22">
      <h2>22. UNION vs UNION ALL</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- UNION: Combines and sorts to remove duplicates (slower)
SELECT name FROM Student
UNION
SELECT name FROM StudentDetails;

-- UNION ALL: Concatenates directly, keeps duplicates (faster)
SELECT name FROM Student
UNION ALL
SELECT name FROM StudentDetails;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t23">
      <h2>23. CASE Expressions</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>SELECT name, marks,
    CASE 
        WHEN marks >= 90 THEN 'Distinction'
        WHEN marks >= 75 THEN 'First Class'
        WHEN marks >= 50 THEN 'Pass'
        ELSE 'Fail'
    END AS result_status
FROM Student;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t24">
      <h2>24. Views (Updatable & WITH CHECK OPTION)</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Create View
CREATE VIEW TopStudents AS
SELECT id, name, department, marks
FROM Student
WHERE marks >= 85
WITH CHECK OPTION;

-- Query the view like a real table
SELECT * FROM TopStudents WHERE department = 'CYS';

-- Drop View
DROP VIEW TopStudents;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t25">
      <h2>25. Indexes & Query Optimization (EXPLAIN)</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- Create secondary index on student name
CREATE INDEX idx_student_name ON Student(name);

-- Composite index (Department and Marks)
CREATE INDEX idx_dept_marks ON Student(department, marks);

-- Inspect query execution plan
EXPLAIN SELECT * FROM Student WHERE department = 'CYS' AND marks > 80;

-- Drop Index
DROP INDEX idx_student_name ON Student;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t26">
      <h2>26. Stored Procedures, Triggers & Cursors</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- 1. STORED PROCEDURE WITH IN & OUT PARAMETERS
DELIMITER //
CREATE PROCEDURE GetDeptAvg(IN deptName VARCHAR(30), OUT avgMarks DECIMAL(5,2))
BEGIN
    SELECT AVG(marks) INTO avgMarks 
    FROM Student 
    WHERE department = deptName;
END //
DELIMITER ;

-- Call procedure and read OUT variable
CALL GetDeptAvg('CYS', @cys_avg);
SELECT @cys_avg AS CYS_Average;

-- 2. TRIGGER EXAMPLE: Audit logging on marks update
CREATE TABLE MarksAudit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    old_marks DECIMAL(5,2),
    new_marks DECIMAL(5,2),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER trg_after_marks_update
AFTER UPDATE ON Student
FOR EACH ROW
BEGIN
    IF OLD.marks != NEW.marks THEN
        INSERT INTO MarksAudit (student_id, old_marks, new_marks)
        VALUES (OLD.id, OLD.marks, NEW.marks);
    END IF;
END //
DELIMITER ;</code></pre>
      </div>
    </div>

    <!-- PHASE 6 -->
    <div class="topic-card" id="t27">
      <h2>27. ACID Properties</h2>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Core Definition</th>
            <th>Exam Explanation</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>Atomicity</b></td><td>All or Nothing</td><td>Either every SQL operation in transaction succeeds, or all are rolled back.</td></tr>
          <tr><td><b>Consistency</b></td><td>Valid State Transition</td><td>Database strictly transitions from one valid state to another, obeying all integrity rules.</td></tr>
          <tr><td><b>Isolation</b></td><td>Concurrent Independence</td><td>Concurrent transactions cannot observe uncommitted dirty data or interfere with each other.</td></tr>
          <tr><td><b>Durability</b></td><td>Crash Survivability</td><td>Once <code>COMMIT</code> is returned, written data is persisted to non-volatile disk.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="topic-card" id="t28">
      <h2>28. COMMIT, ROLLBACK & SAVEPOINT</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>START TRANSACTION;

-- Operation 1: Give grace marks
UPDATE Student SET marks = marks + 5 WHERE id = 1;

-- Create rollback point
SAVEPOINT before_second_update;

-- Operation 2
UPDATE Student SET marks = marks + 10 WHERE id = 2;

-- Undo operation 2 only
ROLLBACK TO SAVEPOINT before_second_update;

-- Permanently save operation 1
COMMIT;</code></pre>
      </div>
    </div>

    <div class="topic-card" id="t29">
      <h2>29. Normalization (1NF, 2NF, 3NF, BCNF)</h2>
      <div class="callout callout-green">
        <b>Core Purpose:</b> Eliminate insertion, deletion, and update anomalies by splitting monolithic tables into clean, linked relations.
      </div>
      <table>
        <thead>
          <tr>
            <th>Normal Form</th>
            <th>Requirement</th>
            <th>What it Eliminates</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>1NF</b></td><td>Atomic cells; single value per cell; primary key exists</td><td>Multi-valued cells, comma-separated lists</td></tr>
          <tr><td><b>2NF</b></td><td>In 1NF + No partial dependencies</td><td>Non-key columns depending on only part of a composite key</td></tr>
          <tr><td><b>3NF</b></td><td>In 2NF + No transitive dependencies ($X \to Y \to Z$)</td><td>Non-key columns depending on other non-key columns</td></tr>
          <tr><td><b>BCNF</b></td><td>Strict 3NF: For every $X \to Y$, $X$ must be a Super Key</td><td>Remaining functional dependency anomalies</td></tr>
        </tbody>
      </table>
    </div>

    <div class="topic-card" id="t30">
      <h2>30. Security, GRANT & Prepared Statements</h2>
      <div class="code-box">
        <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
        <pre><code>-- 1. Create a dedicated database user
CREATE USER 'exam_user'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!';

-- 2. Grant least privilege permissions
GRANT SELECT, INSERT ON college.Student TO 'exam_user'@'localhost';

-- 3. Revoke permissions
REVOKE INSERT ON college.Student FROM 'exam_user'@'localhost';

-- 4. Reload privilege tables
FLUSH PRIVILEGES;</code></pre>
      </div>
      <div class="callout callout-amber">
        <b>SQL Injection Prevention:</b> Never concatenate user text into SQL strings. Always use parameterized queries with <code>?</code> placeholders in host applications.
      </div>
    </div>

    <!-- ESSENTIAL FUNCTIONS -->
    <div class="topic-card" id="functions">
      <h2>📚 Essential Functions Cheat-Sheet</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Function</th>
            <th>Description & Example</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>String</b></td><td><code>CONCAT(a, b)</code></td><td>Joins text: <code>CONCAT('Dept: ', department)</code></td></tr>
          <tr><td><b>String</b></td><td><code>UPPER(s), LOWER(s)</code></td><td>Converts case: <code>UPPER(name)</code></td></tr>
          <tr><td><b>String</b></td><td><code>SUBSTRING(s, pos, len)</code></td><td>Extracts text: <code>SUBSTRING(name, 1, 3)</code></td></tr>
          <tr><td><b>Numeric</b></td><td><code>ROUND(num, dec)</code></td><td>Rounds value: <code>ROUND(marks, 1)</code></td></tr>
          <tr><td><b>Numeric</b></td><td><code>CEIL(n), FLOOR(n)</code></td><td>Ceiling & floor integers: <code>CEIL(85.1) = 86</code></td></tr>
          <tr><td><b>Date</b></td><td><code>NOW(), CURDATE()</code></td><td>Current timestamp or date: <code>CURDATE()</code></td></tr>
          <tr><td><b>Date</b></td><td><code>DATEDIFF(d1, d2)</code></td><td>Days difference between two dates</td></tr>
          <tr><td><b>NULL</b></td><td><code>IFNULL(v, alt)</code></td><td>Replaces NULL with fallback: <code>IFNULL(age, 18)</code></td></tr>
          <tr><td><b>NULL</b></td><td><code>COALESCE(v1, v2...)</code></td><td>Returns first non-NULL argument in list</td></tr>
        </tbody>
      </table>
    </div>

    <!-- FINAL QUIZ -->
    <div class="quiz-card" id="quiz">
      <h2 style="color:var(--accent);margin-bottom:0.5rem;">🎯 Final Mastery Check (8 Questions)</h2>
      <p style="color:var(--muted);margin-bottom:1.5rem;">Click an option to immediately test your understanding. Explanations appear dynamically.</p>

      <div class="question-block" id="q1">
        <div class="question-title">1. Which command retrieves records from a database table?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(1, 'A', false)">A. INSERT</button>
          <button class="quiz-option" onclick="answer(1, 'B', true)">B. SELECT</button>
          <button class="quiz-option" onclick="answer(1, 'C', false)">C. ALTER</button>
          <button class="quiz-option" onclick="answer(1, 'D', false)">D. DROP</button>
        </div>
        <div class="explanation-box" id="exp-1"><b>Correct: B. SELECT</b> — SELECT is the Data Query Language (DQL) command used to query and retrieve rows. INSERT adds rows, ALTER modifies schema, and DROP destroys tables.</div>
      </div>

      <div class="question-block" id="q2">
        <div class="question-title">2. Which clause filters individual records before any grouping occurs?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(2, 'A', false)">A. HAVING</button>
          <button class="quiz-option" onclick="answer(2, 'B', false)">B. ORDER BY</button>
          <button class="quiz-option" onclick="answer(2, 'C', true)">C. WHERE</button>
          <button class="quiz-option" onclick="answer(2, 'D', false)">D. GROUP BY</button>
        </div>
        <div class="explanation-box" id="exp-2"><b>Correct: C. WHERE</b> — WHERE filters individual rows before grouping. HAVING filters aggregated group results after GROUP BY.</div>
      </div>

      <div class="question-block" id="q3">
        <div class="question-title">3. Which constraint uniquely identifies each record and strictly forbids NULL values?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(3, 'A', false)">A. Foreign Key</button>
          <button class="quiz-option" onclick="answer(3, 'B', true)">B. Primary Key</button>
          <button class="quiz-option" onclick="answer(3, 'C', false)">C. Unique Key</button>
          <button class="quiz-option" onclick="answer(3, 'D', false)">D. Default Key</button>
        </div>
        <div class="explanation-box" id="exp-3"><b>Correct: B. Primary Key</b> — A Primary Key uniquely identifies each row and never allows NULLs. A Unique Key permits NULL values in standard SQL.</div>
      </div>

      <div class="question-block" id="q4">
        <div class="question-title">4. Which join preserves ALL rows from the left table, even if there is no match in the right table?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(4, 'A', false)">A. INNER JOIN</button>
          <button class="quiz-option" onclick="answer(4, 'B', false)">B. CROSS JOIN</button>
          <button class="quiz-option" onclick="answer(4, 'C', true)">C. LEFT JOIN</button>
          <button class="quiz-option" onclick="answer(4, 'D', false)">D. SELF JOIN</button>
        </div>
        <div class="explanation-box" id="exp-4"><b>Correct: C. LEFT JOIN</b> — LEFT JOIN returns 100% of rows from the left table; unmatched columns from the right table are filled with NULL.</div>
      </div>

      <div class="question-block" id="q5">
        <div class="question-title">5. Which aggregate function returns the count of rows?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(5, 'A', false)">A. SUM()</button>
          <button class="quiz-option" onclick="answer(5, 'B', true)">B. COUNT()</button>
          <button class="quiz-option" onclick="answer(5, 'C', false)">C. AVG()</button>
          <button class="quiz-option" onclick="answer(5, 'D', false)">D. MAX()</button>
        </div>
        <div class="explanation-box" id="exp-5"><b>Correct: B. COUNT()</b> — COUNT(*) counts all rows; SUM() calculates arithmetic totals.</div>
      </div>

      <div class="question-block" id="q6">
        <div class="question-title">6. Which Transaction Control Language (TCL) command permanently saves all changes to disk?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(6, 'A', false)">A. ROLLBACK</button>
          <button class="quiz-option" onclick="answer(6, 'B', false)">B. SAVEPOINT</button>
          <button class="quiz-option" onclick="answer(6, 'C', true)">C. COMMIT</button>
          <button class="quiz-option" onclick="answer(6, 'D', false)">D. REVOKE</button>
        </div>
        <div class="explanation-box" id="exp-6"><b>Correct: C. COMMIT</b> — COMMIT makes all updates permanent and writes them to the durability log. ROLLBACK discards uncommitted changes.</div>
      </div>

      <div class="question-block" id="q7">
        <div class="question-title">7. In a LIKE clause, which wildcard operator matches ZERO or MORE characters?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(7, 'A', false)">A. _ (Underscore)</button>
          <button class="quiz-option" onclick="answer(7, 'B', true)">B. % (Percent)</button>
          <button class="quiz-option" onclick="answer(7, 'C', false)">C. * (Asterisk)</button>
          <button class="quiz-option" onclick="answer(7, 'D', false)">D. # (Hash)</button>
        </div>
        <div class="explanation-box" id="exp-7"><b>Correct: B. % (Percent)</b> — % matches any number of characters (including zero). The underscore (_) matches exactly ONE single character.</div>
      </div>

      <div class="question-block" id="q8">
        <div class="question-title">8. Which command removes both the table's data AND its schema structure completely?</div>
        <div class="options-grid">
          <button class="quiz-option" onclick="answer(8, 'A', false)">A. DELETE</button>
          <button class="quiz-option" onclick="answer(8, 'B', false)">B. TRUNCATE</button>
          <button class="quiz-option" onclick="answer(8, 'C', true)">C. DROP TABLE</button>
          <button class="quiz-option" onclick="answer(8, 'D', false)">D. UPDATE</button>
        </div>
        <div class="explanation-box" id="exp-8"><b>Correct: C. DROP TABLE</b> — DROP TABLE destroys the schema definition, all data, and indexes. TRUNCATE removes all rows but retains the empty table structure.</div>
      </div>
    </div>
  </main>

  <script>
    function copyCode(btn) {
      const pre = btn.parentElement.querySelector('pre');
      navigator.clipboard.writeText(pre.innerText).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      });
    }

    function filterNav() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      document.querySelectorAll('nav li').forEach(li => {
        const txt = li.textContent.toLowerCase();
        li.style.display = txt.includes(q) ? 'block' : 'none';
      });
    }

    function answer(qNum, opt, isCorrect) {
      const block = document.getElementById('q' + qNum);
      const btns = block.querySelectorAll('.quiz-option');
      btns.forEach(b => {
        b.disabled = true;
        b.classList.remove('correct', 'wrong');
      });
      event.target.classList.add(isCorrect ? 'correct' : 'wrong');
      const exp = document.getElementById('exp-' + qNum);
      exp.style.display = 'block';
      exp.style.background = isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
      exp.style.border = isCorrect ? '1px solid #10b981' : '1px solid #ef4444';
      exp.style.color = isCorrect ? '#34d399' : '#fca5a5';
    }
  </script>
</body>
</html>
"""

dest_path = r'c:\Users\P K PRANAV\Downloads\MySQL_Full_Masterclass.html'
with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Generated standalone masterclass at: {dest_path}")
