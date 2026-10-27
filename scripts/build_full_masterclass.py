import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

def build_masterclass_content():
    sections = []

    # Hero
    sections.append('''<div class="hero">
  <h1>MySQL Full Masterclass</h1>
  <p>A comprehensive, exam-ready guide covering foundational relational concepts to advanced database architecture. Uses a single unified <b>College Database</b> schema throughout to make every query easy to follow.</p>
</div>''')

    # Phase 1 Heading
    sections.append('<!-- PHASE 1 --><h2 style="color: #38bdf8; border-bottom: 2px solid #1e2430; padding-bottom: 0.5rem; margin: 2rem 0 1rem 0;">PHASE 1: MySQL Fundamentals &amp; Core Commands</h2>')

    # t1: What is MySQL
    sections.append('''<div class="topic-card" id="t1">
  <h2>1. What is MySQL?</h2>
  <p><b>MySQL</b> is an open-source <b>Relational Database Management System (RDBMS)</b> that stores, organizes, modifies, and retrieves data organized into tabular relations.</p>
  <div class="callout callout-green">
    <b>Core Architecture Terms:</b><br/>
    • <b>Database:</b> A container/schema storing interrelated tables.<br/>
    • <b>Table:</b> Two-dimensional grid composed of horizontal rows and vertical columns.<br/>
    • <b>Row (Tuple/Record):</b> One complete data instance (e.g. Student Arun).<br/>
    • <b>Column (Attribute/Field):</b> A named category storing specific data types (e.g. <code>marks</code>).
  </div>
  <h3>The Master College Schema Table: <code>Student</code></h3>
  <table class="output-table">
    <thead>
      <tr><th>id (PK)</th><th>name</th><th>age</th><th>department</th><th>marks</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Arun</td><td>19</td><td>CYS</td><td>85.50</td></tr>
      <tr><td>2</td><td>Priya</td><td>20</td><td>CSE</td><td>92.00</td></tr>
      <tr><td>3</td><td>Rahul</td><td>19</td><td>CYS</td><td>76.00</td></tr>
      <tr><td>4</td><td>Divya</td><td>21</td><td>ECE</td><td>88.50</td></tr>
      <tr><td>5</td><td>Kiran</td><td>20</td><td>CSE</td><td>67.00</td></tr>
    </tbody>
  </table>
</div>''')

    # t2: MySQL vs SQL
    sections.append('''<div class="topic-card" id="t2">
  <h2>2. MySQL vs SQL</h2>
  <table class="output-table">
    <thead>
      <tr><th>Feature</th><th>SQL (Structured Query Language)</th><th>MySQL</th></tr>
    </thead>
    <tbody>
      <tr><td><b>Definition</b></td><td>Declarative language used to query and manage relational databases.</td><td>An RDBMS software implementation that interprets and runs SQL queries.</td></tr>
      <tr><td><b>Nature</b></td><td>ANSI/ISO standard language specification.</td><td>Physical database server software (engine, storage layers, daemon).</td></tr>
      <tr><td><b>Updates</b></td><td>Fixed language standards (SQL:1999, SQL:2016).</td><td>Software releases with frequent bug fixes and patches (v8.0, v8.4 LTS).</td></tr>
    </tbody>
  </table>
</div>''')

    # t3: Types of SQL Commands
    sections.append('''<div class="topic-card" id="t3">
  <h2>3. Types of SQL Commands</h2>
  <table class="output-table">
    <thead>
      <tr><th>Category</th><th>Full Form</th><th>Key Commands</th><th>Purpose / Target</th></tr>
    </thead>
    <tbody>
      <tr><td><b>DDL</b></td><td>Data Definition Language</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code></td><td>Defines and modifies table schemas and structures.</td></tr>
      <tr><td><b>DML</b></td><td>Data Manipulation Language</td><td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td><td>Manages data records inside existing tables.</td></tr>
      <tr><td><b>DQL</b></td><td>Data Query Language</td><td><code>SELECT</code></td><td>Retrieves and projects data without altering it.</td></tr>
      <tr><td><b>DCL</b></td><td>Data Control Language</td><td><code>GRANT</code>, <code>REVOKE</code></td><td>Configures user roles, permissions, and security.</td></tr>
      <tr><td><b>TCL</b></td><td>Transaction Control Language</td><td><code>COMMIT</code>, <code>ROLLBACK</code>, <code>SAVEPOINT</code></td><td>Guarantees ACID transactions across multiple write steps.</td></tr>
    </tbody>
  </table>
</div>''')

    # t4: Create Database & USE
    t4_cards = []
    t4_cards.append(make_card(
        badge="CREATE DATABASE",
        title="1. Create a New Database Schema",
        what_it_does="Allocates a new relational namespace on the server to hold related college tables.",
        sql="CREATE DATABASE college;",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Server Catalogs (SHOW DATABASES LIKE 'college'):",
        headers=["Database (%college%)"],
        rows=[["college"]],
        card_class="card-success",
        status_badge="badge-success"
    ))
    t4_cards.append(make_card(
        badge="SHOW DATABASES",
        title="2. List All Active Databases",
        what_it_does="Displays all catalogs and schemas currently residing on the MySQL server instance.",
        sql="SHOW DATABASES;",
        output_title="Active Databases on Server:",
        headers=["Database"],
        rows=[["college"], ["information_schema"], ["mysql"], ["performance_schema"], ["sys"]]
    ))
    t4_cards.append(make_card(
        badge="USE",
        title="3. Set the Active Working Database Context",
        what_it_does="Tells MySQL which database schema subsequent queries, table creations, and inserts should target.",
        sql="USE college;",
        status_line="Database changed",
        output_title="Active Connection Schema (SELECT DATABASE()):",
        headers=["DATABASE()"],
        rows=[["college"]]
    ))
    sections.append(f'''<div class="topic-card" id="t4">
  <h2>4. Create Database &amp; USE</h2>
  {"".join(t4_cards)}
</div>''')

    # t5: Create Table & Data Types
    t5_cards = []
    t5_cards.append(make_card(
        badge="CREATE TABLE",
        title="1. Create Table with Primary Key, Auto-Increment & Data Types",
        what_it_does="Builds the Student relation schema. <code>id</code> auto-increments unique IDs, <code>name</code> is required, and <code>marks</code> supports exact 2-decimal arithmetic.",
        sql="CREATE TABLE Student (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(50) NOT NULL,\n    age INT,\n    department VARCHAR(30),\n    marks DECIMAL(5, 2)\n);",
        status_line="Query OK, 0 rows affected (0.02 sec)",
        output_title="Resulting Schema Structure (DESCRIBE Student):",
        headers=["Field", "Type", "Null", "Key", "Default", "Extra"],
        rows=[
            ["id", "int", "NO", "PRI", "NULL", "auto_increment"],
            ["name", "varchar(50)", "NO", "", "NULL", ""],
            ["age", "int", "YES", "", "NULL", ""],
            ["department", "varchar(30)", "YES", "", "NULL", ""],
            ["marks", "decimal(5,2)", "YES", "", "NULL", ""]
        ],
        card_class="card-success",
        status_badge="badge-success"
    ))
    sections.append(f'''<div class="topic-card" id="t5">
  <h2>5. Create Table &amp; Data Types</h2>
  {"".join(t5_cards)}
</div>''')

    # t6: Insert & Select Data
    t6_cards = []
    t6_cards.append(make_card(
        badge="BATCH INSERT",
        title="1. Batch Insert Multiple Student Rows",
        what_it_does="Inserts 5 student records in a single statement. MySQL automatically generates auto-incrementing sequential integers for <code>id</code> (1 through 5).",
        sql="INSERT INTO Student (name, age, department, marks) VALUES\n('Arun', 19, 'CYS', 85.50),\n('Priya', 20, 'CSE', 92.00),\n('Rahul', 19, 'CYS', 76.00),\n('Divya', 21, 'ECE', 88.50),\n('Kiran', 20, 'CSE', 67.00);",
        status_line="Query OK, 5 rows affected (0.01 sec) | Records: 5  Duplicates: 0  Warnings: 0",
        output_title="Resulting Table State (SELECT * FROM Student):",
        headers=["id (PK)", "name", "age", "department", "marks"],
        rows=[
            [1, "Arun", 19, "CYS", "85.50"],
            [2, "Priya", 20, "CSE", "92.00"],
            [3, "Rahul", 19, "CYS", "76.00"],
            [4, "Divya", 21, "ECE", "88.50"],
            [5, "Kiran", 20, "CSE", "67.00"]
        ],
        card_class="card-success",
        status_badge="badge-success"
    ))
    t6_cards.append(make_card(
        badge="SELECT ALL",
        title="2. Query All Rows and Columns (SELECT *)",
        what_it_does="Retrieves all data rows and columns from the Student table.",
        sql="SELECT * FROM Student;",
        output_title="Query Output (All Columns & Rows):",
        headers=["id", "name", "age", "department", "marks"],
        rows=[
            [1, "Arun", 19, "CYS", "85.50"],
            [2, "Priya", 20, "CSE", "92.00"],
            [3, "Rahul", 19, "CYS", "76.00"],
            [4, "Divya", 21, "ECE", "88.50"],
            [5, "Kiran", 20, "CSE", "67.00"]
        ]
    ))
    t6_cards.append(make_card(
        badge="SELECT PROJECTION",
        title="3. Project Specific Columns (Name and Marks)",
        what_it_does="Fetches only specified fields, saving bandwidth and cache memory.",
        sql="SELECT name, marks FROM Student;",
        output_title="Query Output (Column Projection):",
        headers=["name", "marks"],
        rows=[
            ["Arun", "85.50"],
            ["Priya", "92.00"],
            ["Rahul", "76.00"],
            ["Divya", "88.50"],
            ["Kiran", "67.00"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t6">
  <h2>6. Insert &amp; Select Data</h2>
  {"".join(t6_cards)}
</div>''')

    # t7: Update & Delete Data
    t7_cards = []
    t7_cards.append(make_card(
        badge="UPDATE",
        title="1. Update Specific Record Marks with WHERE Condition",
        what_it_does="Selects Priya's record and updates her marks from 92.00 to 95.00 without modifying any other student's record.",
        sql="UPDATE Student\nSET marks = 95.00\nWHERE name = 'Priya';",
        status_line="Query OK, 1 row affected (0.01 sec) | Rows matched: 1  Changed: 1  Warnings: 0",
        output_title="Resulting Table State (SELECT * FROM Student WHERE name = 'Priya'):",
        headers=["id", "name", "age", "department", "marks (Updated)"],
        rows=[
            [2, "Priya", 20, "CSE", "95.00 (Updated from 92.00)"]
        ],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>State:</b> Priya's score is now 95.00."
    ))
    t7_cards.append(make_card(
        badge="DELETE",
        title="2. Delete a Targeted Student Record by Primary Key",
        what_it_does="Permanently purges Kiran's record (id = 5) from the database.",
        sql="DELETE FROM Student\nWHERE id = 5;",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Student):",
        headers=["id (PK)", "name", "age", "department", "marks"],
        rows=[
            [1, "Arun", 19, "CYS", "85.50"],
            [2, "Priya", 20, "CSE", "95.00"],
            [3, "Rahul", 19, "CYS", "76.00"],
            [4, "Divya", 21, "ECE", "88.50"]
        ],
        extra_notes="<b>State:</b> Kiran (id 5) is removed; 4 student records remain."
    ))
    sections.append(f'''<div class="topic-card" id="t7">
  <h2>7. Update &amp; Delete Data</h2>
  {"".join(t7_cards)}
</div>''')

    # t8: DELETE vs TRUNCATE vs DROP
    t8_cards = []
    t8_cards.append(make_card(
        badge="DELETE",
        title="1. DELETE — Selective Row Removal (DML)",
        what_it_does="Removes designated rows using WHERE. Allows transaction rollback. Does NOT reset the AUTO_INCREMENT counter.",
        sql="DELETE FROM Student WHERE id = 1;",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Student):",
        headers=["id", "name", "age", "department", "marks"],
        rows=[
            [2, "Priya", 20, "CSE", "95.00"],
            [3, "Rahul", 19, "CYS", "76.00"],
            [4, "Divya", 21, "ECE", "88.50"]
        ],
        extra_notes="Row 1 removed; next insert will still receive id = 6."
    ))
    t8_cards.append(make_card(
        badge="TRUNCATE",
        title="2. TRUNCATE — Complete Table Wipe & Counter Reset (DDL)",
        what_it_does="Deallocates all data pages. Empties the entire table and resets AUTO_INCREMENT back to 1. Cannot be rolled back.",
        sql="TRUNCATE TABLE Student;",
        status_line="Query OK, 0 rows affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Student):",
        headers=["id", "name", "age", "department", "marks"],
        rows=[
            ["-", "Empty set (0.00 sec)", "All rows removed; counter reset back to 1", "-", "-"]
        ]
    ))
    t8_cards.append(make_card(
        badge="DROP",
        title="3. DROP TABLE — Complete Object Deletion (DDL)",
        what_it_does="Permanently removes the table schema, indexes, and triggers from the database catalog.",
        sql="DROP TABLE IF EXISTS Student;",
        status_line="Query OK, 0 rows affected (0.01 sec)",
        output_title="Catalog Verification (SHOW TABLES LIKE 'Student'):",
        headers=["Tables_in_college (Student)"],
        rows=[["Empty set (0.00 sec) — Table completely purged from schema"]]
    ))
    sections.append(f'''<div class="topic-card" id="t8">
  <h2>8. DELETE vs TRUNCATE vs DROP</h2>
  {"".join(t8_cards)}
</div>''')

    # Phase 2 Heading
    sections.append('<!-- PHASE 2 --><h2 style="color: #38bdf8; border-bottom: 2px solid #1e2430; padding-bottom: 0.5rem; margin: 2rem 0 1rem 0;">PHASE 2: Filtering, Operators &amp; Sorting</h2>')

    # t9: The WHERE Clause
    t9_cards = []
    t9_cards.append(make_card(
        badge="WHERE >",
        title="1. Greater Than Operator (>)",
        what_it_does="Filters students whose academic marks exceed 80.00.",
        sql="SELECT name, department, marks FROM Student WHERE marks > 80.00;",
        output_title="Query Output:",
        headers=["name", "department", "marks"],
        rows=[
            ["Arun", "CYS", "85.50"],
            ["Priya", "CSE", "95.00"],
            ["Divya", "ECE", "88.50"]
        ]
    ))
    t9_cards.append(make_card(
        badge="WHERE AND",
        title="2. Logical AND Operator",
        what_it_does="Filters students who satisfy both criteria: enrolled in 'CYS' AND score > 80.00.",
        sql="SELECT name, marks FROM Student WHERE department = 'CYS' AND marks > 80.00;",
        output_title="Query Output:",
        headers=["name", "marks"],
        rows=[["Arun", "85.50"]]
    ))
    t9_cards.append(make_card(
        badge="WHERE OR",
        title="3. Logical OR Operator",
        what_it_does="Filters students belonging to either 'CYS' or 'CSE' department.",
        sql="SELECT name, department FROM Student WHERE department = 'CYS' OR department = 'CSE';",
        output_title="Query Output:",
        headers=["name", "department"],
        rows=[
            ["Arun", "CYS"],
            ["Priya", "CSE"],
            ["Rahul", "CYS"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t9">
  <h2>9. The WHERE Clause &amp; Comparison Operators</h2>
  {"".join(t9_cards)}
</div>''')

    # t10: DISTINCT Keyword
    t10_cards = []
    t10_cards.append(make_card(
        badge="DISTINCT",
        title="1. DISTINCT — Deduplicating Department Values",
        what_it_does="Discards duplicate department rows, displaying each department name once.",
        sql="SELECT DISTINCT department FROM Student;",
        output_title="Query Output:",
        headers=["department"],
        rows=[["CYS"], ["CSE"], ["ECE"]]
    ))
    sections.append(f'''<div class="topic-card" id="t10">
  <h2>10. DISTINCT Keyword</h2>
  {"".join(t10_cards)}
</div>''')

    # t11: ORDER BY
    t11_cards = []
    t11_cards.append(make_card(
        badge="ORDER BY DESC",
        title="1. Sort by Marks Descending (Highest First)",
        what_it_does="Sorts students by academic marks in descending order.",
        sql="SELECT name, department, marks FROM Student ORDER BY marks DESC;",
        output_title="Query Output:",
        headers=["name", "department", "marks"],
        rows=[
            ["Priya", "CSE", "95.00"],
            ["Divya", "ECE", "88.50"],
            ["Arun", "CYS", "85.50"],
            ["Rahul", "CYS", "76.00"]
        ]
    ))
    t11_cards.append(make_card(
        badge="ORDER BY MULTI",
        title="2. Multi-Column Sort (Department ASC, Marks DESC)",
        what_it_does="Sorts alphabetically by department first; for ties within the same department, sorts by marks descending.",
        sql="SELECT department, name, marks FROM Student ORDER BY department ASC, marks DESC;",
        output_title="Query Output:",
        headers=["department", "name", "marks"],
        rows=[
            ["CSE", "Priya", "95.00"],
            ["CYS", "Arun", "85.50"],
            ["CYS", "Rahul", "76.00"],
            ["ECE", "Divya", "88.50"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t11">
  <h2>11. ORDER BY (ASC / DESC)</h2>
  {"".join(t11_cards)}
</div>''')

    # t12: LIMIT
    t12_cards = []
    t12_cards.append(make_card(
        badge="LIMIT TOP-N",
        title="1. Top-3 Rankers with ORDER BY and LIMIT",
        what_it_does="Combines descending sort with LIMIT 3 to retrieve the 3 highest scoring students.",
        sql="SELECT name, marks FROM Student ORDER BY marks DESC LIMIT 3;",
        output_title="Query Output:",
        headers=["name", "marks"],
        rows=[
            ["Priya", "95.00"],
            ["Divya", "88.50"],
            ["Arun", "85.50"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t12">
  <h2>12. LIMIT &amp; Pagination</h2>
  {"".join(t12_cards)}
</div>''')

    # t13: BETWEEN, IN, LIKE
    t13_cards = []
    t13_cards.append(make_card(
        badge="BETWEEN",
        title="1. BETWEEN Range Filtering (75 to 90 Inclusive)",
        what_it_does="Filters students with marks between 75.00 and 90.00 inclusive.",
        sql="SELECT name, marks FROM Student WHERE marks BETWEEN 75.00 AND 90.00;",
        output_title="Query Output:",
        headers=["name", "marks"],
        rows=[
            ["Arun", "85.50"],
            ["Rahul", "76.00"],
            ["Divya", "88.50"]
        ]
    ))
    t13_cards.append(make_card(
        badge="IN",
        title="2. IN Operator for Discrete List Matching",
        what_it_does="Matches students who belong to either 'CYS' or 'CSE'.",
        sql="SELECT name, department FROM Student WHERE department IN ('CYS', 'CSE');",
        output_title="Query Output:",
        headers=["name", "department"],
        rows=[
            ["Arun", "CYS"],
            ["Priya", "CSE"],
            ["Rahul", "CYS"]
        ]
    ))
    t13_cards.append(make_card(
        badge="LIKE",
        title="3. LIKE with Wildcards (% and _)",
        what_it_does="Prefix match with <code>%</code> (starts with A) and exact length with <code>_</code> (exactly 5 characters).",
        sql="-- Names starting with A\nSELECT name FROM Student WHERE name LIKE 'A%';\n\n-- Names with exactly 5 characters\nSELECT name FROM Student WHERE name LIKE '_____';",
        output_title="Query Output:",
        headers=["name (Starts with A)", "name (5 Chars)"],
        rows=[
            ["Arun", "Priya"],
            ["-", "Rahul"],
            ["-", "Divya"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t13">
  <h2>13. BETWEEN, IN, and LIKE</h2>
  {"".join(t13_cards)}
</div>''')

    # t14: NULL
    t14_cards = []
    t14_cards.append(make_card(
        badge="IS NULL",
        title="1. IS NULL and IS NOT NULL — Handling Missing Values",
        what_it_does="Filters records where an attribute is missing. Remember: <code>age = NULL</code> returns UNKNOWN; always write <code>IS NULL</code>.",
        sql="SELECT name, age FROM Student WHERE age IS NOT NULL;",
        output_title="Query Output:",
        headers=["name", "age"],
        rows=[
            ["Arun", 19],
            ["Priya", 20],
            ["Rahul", 19],
            ["Divya", 21]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t14">
  <h2>14. NULL &amp; Three-Valued Logic</h2>
  {"".join(t14_cards)}
</div>''')

    # Phase 3 Heading
    sections.append('<!-- PHASE 3 --><h2 style="color: #38bdf8; border-bottom: 2px solid #1e2430; padding-bottom: 0.5rem; margin: 2rem 0 1rem 0;">PHASE 3: Aggregate Functions, Grouping &amp; Relationships</h2>')

    # t15: Aggregate Functions & GROUP BY
    t15_cards = []
    t15_cards.append(make_card(
        badge="COUNT(*)",
        title="1. COUNT(*) — Total Rows",
        what_it_does="Counts total active rows in the Student table.",
        sql="SELECT COUNT(*) AS total_students FROM Student;",
        output_title="Query Output:",
        headers=["total_students"],
        rows=[[4]]
    ))
    t15_cards.append(make_card(
        badge="AVG & ROUND",
        title="2. AVG and ROUND — Calculating Decimal Mean",
        what_it_does="Calculates the arithmetic average marks rounded to 2 decimal places.",
        sql="SELECT ROUND(AVG(marks), 2) AS average_marks FROM Student;",
        output_title="Query Output:",
        headers=["average_marks"],
        rows=[["86.25"]]
    ))
    t15_cards.append(make_card(
        badge="GROUP BY",
        title="3. GROUP BY Department — Summaries per Department",
        what_it_does="Partitions rows by department and calculates student count and average marks for each.",
        sql="SELECT department, COUNT(*) AS student_count, ROUND(AVG(marks), 2) AS dept_avg\nFROM Student\nGROUP BY department;",
        output_title="Query Output:",
        headers=["department", "student_count", "dept_avg"],
        rows=[
            ["CYS", 2, "80.75"],
            ["CSE", 1, "95.00"],
            ["ECE", 1, "88.50"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t15">
  <h2>15. Aggregate Functions &amp; GROUP BY</h2>
  {"".join(t15_cards)}
</div>''')

    # t16: HAVING vs WHERE
    t16_cards = []
    t16_cards.append(make_card(
        badge="HAVING",
        title="1. HAVING — Filtering Aggregated Groups",
        what_it_does="Filters groups after aggregation. Keeps only departments with an average score above 85.00.",
        sql="SELECT department, ROUND(AVG(marks), 2) AS dept_avg\nFROM Student\nGROUP BY department\nHAVING AVG(marks) > 85.00;",
        output_title="Query Output:",
        headers=["department", "dept_avg"],
        rows=[
            ["CSE", "95.00"],
            ["ECE", "88.50"]
        ],
        card_class="card-amber",
        status_badge="badge-amber"
    ))
    sections.append(f'''<div class="topic-card" id="t16">
  <h2>16. HAVING vs WHERE &amp; Logical Query Order</h2>
  {"".join(t16_cards)}
</div>''')

    # t19: Joins
    t19_cards = []
    t19_cards.append(make_card(
        badge="INNER JOIN",
        title="1. INNER JOIN — Matching Students with Departments",
        what_it_does="Joins Student and Department on department name/code, returning only rows present in both.",
        sql="SELECT s.name, s.marks, d.building\nFROM Student s\nINNER JOIN Department d ON s.department = d.dept_name;",
        output_title="Query Output:",
        headers=["name", "marks", "building"],
        rows=[
            ["Arun", "85.50", "Block A"],
            ["Priya", "95.00", "Block B"],
            ["Rahul", "76.00", "Block A"],
            ["Divya", "88.50", "Block C"]
        ]
    ))
    t19_cards.append(make_card(
        badge="LEFT JOIN",
        title="2. LEFT JOIN — All Students Even If Department Missing",
        what_it_does="Preserves all rows from the left table (Student). Unmatched department fields return NULL.",
        sql="SELECT s.name, s.department, d.building\nFROM Student s\nLEFT JOIN Department d ON s.department = d.dept_name;",
        output_title="Query Output:",
        headers=["name", "department", "building"],
        rows=[
            ["Arun", "CYS", "Block A"],
            ["Priya", "CSE", "Block B"],
            ["Rahul", "CYS", "Block A"],
            ["Divya", "ECE", "Block C"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t19">
  <h2>19. All SQL Joins Complete Guide</h2>
  {"".join(t19_cards)}
</div>''')

    # Phase 4 & 5 cards
    # t20: Subqueries
    t20_cards = []
    t20_cards.append(make_card(
        badge="SUBQUERY",
        title="1. Subquery in WHERE — Students Scoring Above Average",
        what_it_does="Calculates class average marks in the inner query (86.25), then returns students with marks higher than that average.",
        sql="SELECT name, marks\nFROM Student\nWHERE marks > (SELECT AVG(marks) FROM Student);",
        output_title="Query Output:",
        headers=["name", "marks"],
        rows=[
            ["Priya", "95.00"],
            ["Divya", "88.50"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t20">
  <h2>20. Subqueries &amp; Derived Tables</h2>
  {"".join(t20_cards)}
</div>''')

    # t24: Views
    t24_cards = []
    t24_cards.append(make_card(
        badge="CREATE VIEW",
        title="1. CREATE VIEW & WITH CHECK OPTION",
        what_it_does="Creates a virtual table abstraction for CYS students with predicate enforcement.",
        sql="CREATE VIEW CYS_Students AS\nSELECT id, name, marks\nFROM Student\nWHERE department = 'CYS'\nWITH CHECK OPTION;",
        status_line="Query OK, 0 rows affected (0.01 sec)",
        output_title="Resulting View State (SELECT * FROM CYS_Students):",
        headers=["id", "name", "marks"],
        rows=[
            [1, "Arun", "85.50"],
            [3, "Rahul", "76.00"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t24">
  <h2>24. Views (Updatable &amp; WITH CHECK OPTION)</h2>
  {"".join(t24_cards)}
</div>''')

    # t26: Stored Procedures & Triggers
    t26_cards = []
    t26_cards.append(make_card(
        badge="TRIGGER",
        title="1. BEFORE INSERT Trigger — Data Normalization",
        what_it_does="Forces student names to uppercase automatically before writing to disk.",
        sql="DELIMITER //\nCREATE TRIGGER trg_upper_name\nBEFORE INSERT ON Student\nFOR EACH ROW\nBEGIN\n    SET NEW.name = UPPER(NEW.name);\nEND //\nDELIMITER ;\n\n-- Test insertion:\nINSERT INTO Student (name, age, department, marks) VALUES ('kavya', 21, 'CSE', 91.00);",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Student WHERE id = LAST_INSERT_ID()):",
        headers=["id", "name (Auto-Uppercased)", "age", "department", "marks"],
        rows=[
            [6, "KAVYA", 21, "CSE", "91.00"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t26">
  <h2>26. Stored Procedures, Triggers &amp; Cursors</h2>
  {"".join(t26_cards)}
</div>''')

    # t28: Transactions
    t28_cards = []
    t28_cards.append(make_card(
        badge="TRANSACTION",
        title="1. START TRANSACTION with COMMIT and ROLLBACK",
        what_it_does="Demonstrates atomic execution block with permanent commit.",
        sql="START TRANSACTION;\nUPDATE Student SET marks = marks + 5 WHERE department = 'CYS';\nCOMMIT;",
        status_line="Query OK, 2 rows affected (0.01 sec) | Rows matched: 2  Changed: 2  Warnings: 0",
        output_title="Resulting Table State (SELECT name, department, marks FROM Student WHERE department = 'CYS'):",
        headers=["name", "department", "marks (Boosted by 5)"],
        rows=[
            ["Arun", "CYS", "90.50 (was 85.50)"],
            ["Rahul", "CYS", "81.00 (was 76.00)"]
        ]
    ))
    sections.append(f'''<div class="topic-card" id="t28">
  <h2>28. COMMIT, ROLLBACK &amp; SAVEPOINT</h2>
  {"".join(t28_cards)}
</div>''')

    # t29: Normalization
    sections.append('''<div class="topic-card" id="t29">
  <h2>29. Normalization (1NF, 2NF, 3NF, BCNF)</h2>
  <div class="callout callout-green">
    <b>Normalization Hierarchy:</b><br/>
    • <b>1NF:</b> Atomic single values, no repeating groups, primary key established.<br/>
    • <b>2NF:</b> In 1NF + No Partial Dependency (all non-keys depend on entire composite key).<br/>
    • <b>3NF:</b> In 2NF + No Transitive Dependency (non-keys depend ONLY on primary key).<br/>
    • <b>BCNF:</b> In 3NF + Every determinant must be a candidate key.
  </div>
</div>''')

    return "\n\n".join(sections)

print("build_full_masterclass updated successfully.")
