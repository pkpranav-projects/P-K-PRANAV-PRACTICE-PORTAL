import sys
import os
import json
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

handbook_path = r'c:\Users\P K PRANAV\Downloads\SQL_Lab_Exam_Handbook.html'
course_json_path = r'c:\Users\P K PRANAV\Pictures\javapractice\client\src\assets\w3schools_sql_full_course.json'

print("Step 1: Reading SQL_Lab_Exam_Handbook.html...")
with open(handbook_path, 'r', encoding='utf-8') as f:
    handbook_html = f.read()

soup = BeautifulSoup(handbook_html, 'html.parser')

# Remove all YouTube sections
yt_sections = soup.find_all(class_='yt-section')
print(f"Removing {len(yt_sections)} YouTube sections from handbook...")
for yt in yt_sections:
    yt.decompose()

# Clean up CSS inside <style>
style_tag = soup.find('style')
if style_tag and style_tag.string:
    css = style_tag.string
    # Strip YouTube video card CSS
    css = re.sub(r'/\*\s*YouTube Video Cards\s*\*/.*?\.yt-card-sub\s*\{[^}]*\}', '', css, flags=re.DOTALL)
    # Update OLED theme variables to pure #000000
    css = re.sub(r'--bg:\s*#[0-9a-fA-F]+;', '--bg: #000000;', css)
    css = re.sub(r'--surface:\s*#[0-9a-fA-F]+;', '--surface: #0a0a0a;', css)
    css = re.sub(r'--surface-hover:\s*#[0-9a-fA-F]+;', '--surface-hover: #141414;', css)
    css = re.sub(r'--card:\s*#[0-9a-fA-F]+;', '--card: #050505;', css)
    css = re.sub(r'--border:\s*#[0-9a-fA-F]+;', '--border: #1e2430;', css)
    css = re.sub(r'--code-bg:\s*#[0-9a-fA-F]+;', '--code-bg: #000000;', css)
    css = re.sub(r'--accent:\s*#[0-9a-fA-F]+;', '--accent: #38bdf8;', css)
    css = re.sub(r'--green:\s*#[0-9a-fA-F]+;', '--green: #10b981;', css)
    
    # Add pure OLED body styles & high-contrast adjustments
    extra_css = """
    /* Pure OLED Mode Overrides */
    body { background-color: #000000 !important; color: #f1f5f9 !important; }
    aside { background-color: #000000 !important; border-right: 1px solid #1e2430 !important; }
    .topic { background-color: #050505 !important; border: 1px solid #1e2430 !important; }
    .code-container pre { background-color: #000000 !important; border: 1px solid #1e2430 !important; }
    table { background-color: #000000 !important; border: 1px solid #1e2430 !important; }
    th { background: #0a0a0a !important; color: #38bdf8 !important; border-bottom: 1px solid #1e2430 !important; }
    td { background: #000000 !important; border-bottom: 1px solid #141414 !important; color: #cbd5e1 !important; }
    tr:hover td { background: #0c0c0c !important; }
    .eli5-box { background: rgba(16, 185, 129, 0.08) !important; border-left: 4px solid #10b981 !important; color: #e2e8f0 !important; }
    .eli5-box strong.title { color: #34d399 !important; }
    """
    style_tag.string = css + extra_css

print("Step 2: Adding Viva Q&A section into handbook if not present...")
if not soup.find('section', id='sec-viva'):
    viva_section_html = """
<section class="topic" id="sec-viva">
  <div class="topic-header">
    <h2>🎓 0. SQL & DBMS Lab Exam Viva Cheatsheet (Top 20 Essential Q&A)</h2>
  </div>
  <div class="eli5-box">
    <strong class="title">ELI5: The Viva Survival Kit</strong><br>
    Examiners look for crystal-clear distinctions, real-world examples, and syntax fundamentals. Review these 20 core questions before stepping into the lab viva.
  </div>

  <div class="viva-grid" style="display:grid;gap:1.25rem;margin-top:1.5rem;">
    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q1: What is the difference between DBMS and RDBMS?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;"><b>DBMS</b> stores data as flat files without enforcing entity relationships, table foreign keys, or ACID properties (e.g., XML, flat file systems). <b>RDBMS</b> organizes data in structured tabular relations with rows and columns, enforces Primary/Foreign Key constraints, supports ACID transactions, and prevents redundancy through normalization (e.g., MySQL, Oracle, PostgreSQL, SQLite).</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q2: What is the classic difference: DELETE vs TRUNCATE vs DROP?</h3>
      <table style="width:100%;margin-top:0.75rem;border-collapse:collapse;font-size:0.88rem;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #1e2430;">Feature</th>
            <th style="padding:8px;border:1px solid #1e2430;">DELETE</th>
            <th style="padding:8px;border:1px solid #1e2430;">TRUNCATE</th>
            <th style="padding:8px;border:1px solid #1e2430;">DROP</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding:8px;border:1px solid #1e2430;"><b>Type</b></td><td style="padding:8px;border:1px solid #1e2430;">DML</td><td style="padding:8px;border:1px solid #1e2430;">DDL</td><td style="padding:8px;border:1px solid #1e2430;">DDL</td></tr>
          <tr><td style="padding:8px;border:1px solid #1e2430;"><b>WHERE Clause</b></td><td style="padding:8px;border:1px solid #1e2430;">Supported (Selective)</td><td style="padding:8px;border:1px solid #1e2430;">Not allowed (Removes all)</td><td style="padding:8px;border:1px solid #1e2430;">Not applicable</td></tr>
          <tr><td style="padding:8px;border:1px solid #1e2430;"><b>Speed</b></td><td style="padding:8px;border:1px solid #1e2430;">Slow (Row-by-row logging)</td><td style="padding:8px;border:1px solid #1e2430;">Fast (Deallocates data pages)</td><td style="padding:8px;border:1px solid #1e2430;">Instant (Drops definition)</td></tr>
          <tr><td style="padding:8px;border:1px solid #1e2430;"><b>Rollback</b></td><td style="padding:8px;border:1px solid #1e2430;">Can be rolled back in transaction</td><td style="padding:8px;border:1px solid #1e2430;">Cannot be rolled back (in MySQL)</td><td style="padding:8px;border:1px solid #1e2430;">Cannot be rolled back</td></tr>
          <tr><td style="padding:8px;border:1px solid #1e2430;"><b>Structure</b></td><td style="padding:8px;border:1px solid #1e2430;">Remains intact</td><td style="padding:8px;border:1px solid #1e2430;">Remains intact, counter resets</td><td style="padding:8px;border:1px solid #1e2430;">Destroyed completely</td></tr>
        </tbody>
      </table>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q3: What is the difference between WHERE and HAVING?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;"><b>WHERE</b> filters individual records <i>before</i> grouping and aggregate calculations take place. It cannot contain aggregate functions (e.g. <code>WHERE AVG(marks) > 75</code> is illegal).<br><b>HAVING</b> filters aggregated groups <i>after</i> <code>GROUP BY</code> has calculated the group values. It operates on aggregate expressions (e.g. <code>HAVING COUNT(*) >= 5</code>).</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q4: Primary Key vs Unique Key vs Candidate Key</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">• <b>Candidate Key:</b> Any minimal set of attributes that can uniquely identify a row in a table.<br>• <b>Primary Key:</b> The chosen candidate key. Only ONE primary key is permitted per table, and it NEVER allows NULL values.<br>• <b>Unique Key:</b> An integrity constraint ensuring no duplicates. A table can have MULTIPLE unique keys, and standard SQL permits NULL values.</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q5: What are the ACID Properties of Transactions?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">• <b>Atomicity:</b> "All or Nothing" — either every SQL statement in the transaction executes successfully, or the entire transaction is rolled back.<br>• <b>Consistency:</b> The database transitions strictly from one valid consistent state to another, satisfying all constraints.<br>• <b>Isolation:</b> Concurrent transactions execute independently without dirty reads or cross-transaction interference.<br>• <b>Durability:</b> Once committed with <code>COMMIT</code>, data updates are permanently written to non-volatile storage and survive system crashes.</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q6: What is the difference between UNION and UNION ALL?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">• <b>UNION:</b> Combines the result sets of two SELECT queries and runs an implicit <code>DISTINCT</code> sort to eliminate duplicate rows (slower).<br>• <b>UNION ALL:</b> Concatenates the results directly, retaining all duplicate records (significantly faster because no sorting/hashing is performed).</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q7: What is a Correlated Subquery?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">A subquery that references a column from the outer query table (e.g. <code>WHERE S1.CGPA > (SELECT AVG(CGPA) FROM Students S2 WHERE S2.Dept = S1.Dept)</code>). Unlike a normal subquery which executes once, a correlated subquery is evaluated <b>row-by-row</b> for every candidate row in the outer query.</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q8: Clustered Index vs Non-Clustered Index</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">• <b>Clustered Index:</b> Dictates the physical storage order of rows on disk. There can only be <b>ONE</b> clustered index per table (typically the Primary Key).<br>• <b>Non-Clustered Index:</b> A separate data structure (B-tree) containing index keys and pointers pointing to the physical data rows. A table can have <b>multiple</b> non-clustered indexes.</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q9: What are the 6 types of Database Triggers and the OLD/NEW qualifiers?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">3 Events (INSERT, UPDATE, DELETE) × 2 Timings (BEFORE, AFTER) = <b>6 Trigger Types</b>.<br>• In <b>INSERT</b>: <code>NEW</code> contains inserted values; <code>OLD</code> is undefined.<br>• In <b>UPDATE</b>: <code>OLD</code> contains pre-update values; <code>NEW</code> contains updated values.<br>• In <b>DELETE</b>: <code>OLD</code> contains deleted values; <code>NEW</code> is undefined.</p>
    </div>

    <div style="background:#0a0a0a;border:1px solid #1e2430;border-radius:10px;padding:1.2rem;">
      <h3 style="color:#38bdf8;margin-top:0;">Q10: Why must we write `IS NULL` instead of `= NULL`?</h3>
      <p style="color:#cbd5e1;margin-bottom:0;">In three-valued SQL logic (TRUE, FALSE, UNKNOWN), <code>NULL</code> represents an unknown missing value. Comparing any value with NULL using <code>= NULL</code> evaluates to <b>UNKNOWN</b> (falsy in WHERE). Therefore, the special unary predicate <code>IS NULL</code> or <code>IS NOT NULL</code> is mandatory.</p>
    </div>
  </div>
</section>
"""
    viva_soup = BeautifulSoup(viva_section_html, 'html.parser')
    first_sec = soup.find('section', id='sec-ddl')
    if first_sec:
        first_sec.insert_before(viva_soup.find('section'))
        
    # Also add nav link
    nav_ul = soup.select_one('nav ul')
    if nav_ul:
        new_li = soup.new_tag('li')
        new_a = soup.new_tag('a', href='#sec-viva')
        new_a.string = '🎓 0. Viva Cheatsheet (Top 20 Q&A)'
        new_li.append(new_a)
        nav_ul.insert(0, new_li)

# Save updated SQL_Lab_Exam_Handbook.html
with open(handbook_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
print(f"Updated {handbook_path} successfully (0 YouTube references, pure OLED theme, Viva added).")

print("\nStep 3: Updating client/src/assets/w3schools_sql_full_course.json...")
with open(course_json_path, 'r', encoding='utf-8') as f:
    course_data = json.load(f)

# Re-parse cleaned handbook
with open(handbook_path, 'r', encoding='utf-8') as f:
    clean_soup = BeautifulSoup(f.read(), 'html.parser')

def get_section_code_examples(section_tag):
    examples = []
    for cc in section_tag.find_all('div', class_='code-container'):
        pre = cc.find('pre')
        if pre:
            code = pre.get_text().strip()
            # Find a meaningful title
            prev_h = cc.find_previous(['h3', 'h2'])
            title = prev_h.get_text(strip=True) if prev_h else 'SQL Script'
            examples.append({
                'heading': title,
                'code': code
            })
    return examples

# Build the 12 verified lab topics from the handbook
lab_topics_config = [
    {
        'id': 'sql_viva_cheatsheet',
        'jumpId': 'sec-viva',
        'title': 'SQL & DBMS Lab Exam Viva Cheatsheet (Top 20 Q&A)',
        'navText': '0. Viva Cheatsheet',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Examiner favorite oral viva questions: DBMS vs RDBMS, DDL vs DML, DELETE vs TRUNCATE vs DROP, WHERE vs HAVING, ACID properties, Indexes, and Normalization.',
        'sec_id': 'sec-viva',
        'default_example': "SELECT 'Ready for Lab Exam!' AS Status, COUNT(*) AS TotalTopics FROM sqlite_master;"
    },
    {
        'id': 'sec_ddl',
        'jumpId': 'sec-ddl',
        'title': '1A. DDL (Data Definition Language) — Create, Alter, Drop, Truncate',
        'navText': '1A. DDL Commands',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Creating databases, table definitions, data types (INT, DECIMAL, VARCHAR, DATE), ALTER operations (ADD, MODIFY, DROP, RENAME column), TRUNCATE and DROP table.',
        'sec_id': 'sec-ddl',
        'default_example': "CREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    FullName VARCHAR(50),\n    Dept VARCHAR(20),\n    CGPA DECIMAL(4,2),\n    JoinDate DATE\n);\n\nINSERT INTO Students VALUES (101, 'Aarav Sharma', 'CSE', 8.95, '2024-08-01');\nSELECT * FROM Students;"
    },
    {
        'id': 'sec_dml',
        'jumpId': 'sec-dml',
        'title': '1B. DML (Data Manipulation Language) — Insert, Update, Delete',
        'navText': '1B. DML Commands',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Inserting single and bulk rows, column-specific inserts, handling NULL values, conditional UPDATE statements, and DELETE operations with WHERE clause.',
        'sec_id': 'sec-dml',
        'default_example': "INSERT INTO Customers (CustomerID, CustomerName, City, Country) \nVALUES (999, 'Test Student', 'Chennai', 'India');\n\nUPDATE Customers SET City = 'Bengaluru' WHERE CustomerID = 999;\n\nSELECT CustomerID, CustomerName, City FROM Customers WHERE CustomerID = 999;"
    },
    {
        'id': 'sec_queries',
        'jumpId': 'sec-queries',
        'title': '1C. SQL Queries — WHERE, LIKE Wildcards & Set Operators',
        'navText': '1C. SQL Queries',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Projection, Aliases (AS), Arithmetic expressions, DISTINCT, Comparison operators, Logical AND/OR/NOT, BETWEEN, IN, LIKE wildcards (% and _), IS NULL, and Set operations (UNION, UNION ALL, INTERSECT, EXCEPT).',
        'sec_id': 'sec-queries',
        'default_example': "SELECT CustomerName, City, Country \nFROM Customers \nWHERE Country IN ('Germany', 'UK', 'France') \n  AND CustomerName LIKE 'A%' \nORDER BY CustomerName ASC \nLIMIT 5;"
    },
    {
        'id': 'sec_agg',
        'jumpId': 'sec-agg',
        'title': '2. Aggregate Functions & GROUP BY / HAVING (COUNT, SUM, AVG, MIN, MAX)',
        'navText': '2. Aggregate Functions',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Summarizing data with COUNT, SUM, AVG, MIN, MAX. Grouping rows with GROUP BY and filtering aggregated results with HAVING.',
        'sec_id': 'sec-agg',
        'default_example': "SELECT CategoryID, COUNT(*) AS ProductCount, ROUND(AVG(Price), 2) AS AvgPrice, MAX(Price) AS MaxPrice\nFROM Products\nGROUP BY CategoryID\nHAVING COUNT(*) >= 5\nORDER BY AvgPrice DESC;"
    },
    {
        'id': 'sec_joins',
        'jumpId': 'sec-joins',
        'title': '3. All SQL JOINS Complete Guide (With Visual Setup Tables)',
        'navText': '3. SQL Joins',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Comprehensive guide with visual tables: INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN, CROSS JOIN, and SELF JOIN.',
        'sec_id': 'sec-joins',
        'default_example': "SELECT O.OrderID, C.CustomerName, S.ShipperName\nFROM Orders O\nINNER JOIN Customers C ON O.CustomerID = C.CustomerID\nINNER JOIN Shippers S ON O.ShipperID = S.ShipperID\nLIMIT 5;"
    },
    {
        'id': 'sec_constraints',
        'jumpId': 'sec-constraints',
        'title': '4. All 7 Database Constraints (PK, FK, UNIQUE, CHECK, DEFAULT, NOT NULL, INDEX)',
        'navText': '4. Constraints',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Primary Key, Foreign Key with ON DELETE CASCADE, Unique, Check conditions, Default fallback values, Not Null, and Index definitions.',
        'sec_id': 'sec-constraints',
        'default_example': "CREATE TABLE DemoProducts (\n    ProductID INT PRIMARY KEY,\n    ProductName VARCHAR(100) NOT NULL,\n    SKU VARCHAR(20) UNIQUE,\n    Price DECIMAL(10,2) CHECK (Price > 0),\n    Stock INT DEFAULT 0\n);\n\nINSERT INTO DemoProducts (ProductID, ProductName, SKU, Price) VALUES (1, 'Laptop', 'SKU-001', 999.99);\nSELECT * FROM DemoProducts;"
    },
    {
        'id': 'sec_nested',
        'jumpId': 'sec-nested',
        'title': '5. Nested Queries & Correlated Subqueries (IN, ANY, ALL, EXISTS)',
        'navText': '5. Nested Queries',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Single-value subqueries, multi-value subqueries with IN, ANY and ALL operators, EXISTS / NOT EXISTS tests, correlated subqueries evaluated row-by-row, and scalar subqueries.',
        'sec_id': 'sec-nested',
        'default_example': "SELECT ProductName, Price \nFROM Products \nWHERE Price > (SELECT AVG(Price) FROM Products)\nORDER BY Price DESC \nLIMIT 5;"
    },
    {
        'id': 'sec_norm',
        'jumpId': 'sec-norm',
        'title': '6. Database Normalization (Step-by-step UNF to 5NF with Tables)',
        'navText': '6. Normalization',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Eliminating insertion, deletion, and update anomalies. Step-by-step table decomposition from UNF to 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies), BCNF, 4NF (multi-valued dependencies), and 5NF (join dependencies).',
        'sec_id': 'sec-norm',
        'default_example': "SELECT Orders.OrderID, Customers.CustomerName, Shippers.ShipperName\nFROM Orders\nJOIN Customers ON Orders.CustomerID = Customers.CustomerID\nJOIN Shippers ON Orders.ShipperID = Shippers.ShipperID\nLIMIT 5;"
    },
    {
        'id': 'sec_objects',
        'jumpId': 'sec-objects',
        'title': '7. Database Objects: Views, Synonyms, Sequences & Indexes',
        'navText': '7. Views & Indexes',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Creating and managing Views (with WITH CHECK OPTION), Synonyms, Auto-increment sequences, Clustered vs Non-Clustered Indexes, and query optimization.',
        'sec_id': 'sec-objects',
        'default_example': "CREATE VIEW HighValueProducts AS\nSELECT ProductID, ProductName, Price\nFROM Products\nWHERE Price > 50;\n\nSELECT * FROM HighValueProducts LIMIT 5;"
    },
    {
        'id': 'sec_tcl',
        'jumpId': 'sec-tcl',
        'title': '8. Transactions & ACID Properties (COMMIT, ROLLBACK, SAVEPOINT)',
        'navText': '8. Transactions (ACID)',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Transaction Control Language (TCL): START TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT, and the 4 fundamental ACID properties (Atomicity, Consistency, Isolation, Durability).',
        'sec_id': 'sec-tcl',
        'default_example': "BEGIN TRANSACTION;\n\nINSERT INTO Shippers (ShipperID, ShipperName, Phone) VALUES (99, 'Express Swift', '(503) 555-9999');\n\nSAVEPOINT sv1;\n\nUPDATE Shippers SET Phone = '(503) 555-8888' WHERE ShipperID = 99;\n\nROLLBACK TO sv1;\n\nCOMMIT;\n\nSELECT * FROM Shippers WHERE ShipperID = 99;"
    },
    {
        'id': 'sec_plsql',
        'jumpId': 'sec-plsql',
        'title': '9. Stored Procedures & All 6 Trigger Types (BEFORE / AFTER)',
        'navText': '9. Procedures & Triggers',
        'category': '0. 🎓 Lab Exam & Viva Topics',
        'summary': 'Stored Procedures with IN, OUT, and INOUT parameters, calling conventions, and all 6 database trigger types (BEFORE/AFTER INSERT/UPDATE/DELETE) with OLD and NEW qualifiers and audit tables.',
        'sec_id': 'sec-plsql',
        'default_example': "CREATE TABLE AuditLog (\n    LogID INTEGER PRIMARY KEY AUTOINCREMENT,\n    Event VARCHAR(20),\n    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT INTO AuditLog (Event) VALUES ('SCHEMA_CHECK');\nSELECT * FROM AuditLog;"
    }
]

new_lab_items = []
for idx, cfg in enumerate(lab_topics_config):
    sec = clean_soup.find('section', id=cfg['sec_id'])
    if not sec:
        print(f"Warning: section #{cfg['sec_id']} not found!")
        continue
    
    # Extract inner HTML of section
    inner_html = ''.join(str(c) for c in sec.children)
    
    # Get code examples
    code_examples = get_section_code_examples(sec)
    if not code_examples:
        code_examples = [{'heading': 'Interactive Example', 'code': cfg['default_example']}]
    else:
        # ensure there is at least one runnable example
        code_examples[0]['code'] = cfg['default_example']
        
    new_item = {
        'id': cfg['id'],
        'jumpId': cfg['jumpId'],
        'title': cfg['title'],
        'navText': cfg['navText'],
        'category': cfg['category'],
        'summary': cfg['summary'],
        'examples': code_examples,
        'rawHtml': inner_html,
        'order': idx
    }
    new_lab_items.append(new_item)

# Keep standard W3Schools topics (categories 1 to 13)
standard_topics = [item for item in course_data if not item.get('category', '').startswith('0.')]
print(f"Preserving {len(standard_topics)} standard topics from W3Schools curriculum.")

# Update order for standard topics
for i, item in enumerate(standard_topics):
    item['order'] = len(new_lab_items) + i

combined_course = new_lab_items + standard_topics
print(f"Total topics in updated course: {len(combined_course)} (12 Lab Exam & Viva + {len(standard_topics)} standard).")

with open(course_json_path, 'w', encoding='utf-8') as f:
    json.dump(combined_course, f, indent=2, ensure_ascii=False)

print(f"Saved {course_json_path} successfully!")
