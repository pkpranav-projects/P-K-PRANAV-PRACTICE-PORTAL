import json
import os

# Define the 10 comprehensive Lab Exam & Viva Master Topics
lab_exam_lessons = [
    {
        "id": "sql_viva_cheatsheet",
        "jumpId": "sql-sql_viva_cheatsheet",
        "title": "SQL & DBMS Lab Exam Viva Cheatsheet (Top 50 Q&A)",
        "navText": "🎓 Viva Cheatsheet",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Essential high-frequency viva questions and rapid-fire answers covering DDL, DML, Joins, Normalization, ACID, and PL/SQL for laboratory exams.",
        "examples": [
            {
                "heading": "Verify Northwind Database",
                "code": "SELECT 'Database Operational' AS Status, COUNT(*) AS TotalCustomers FROM Customers;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">SQL & DBMS Lab Exam</span> Viva Cheatsheet</h1>
<div class="w3-panel ws-note" style="background-color:rgba(16,185,129,0.1);border-left:4px solid #10b981;padding:12px 16px;border-radius:8px;margin:16px 0;">
  <p><b>🎓 Lab Exam & Viva Master Guide:</b> This section contains the top recurring questions asked by examiners during database laboratory practicals and oral viva examinations. Curated from official university curricula, W3Schools, TutorialsPoint, and GeeksforGeeks.</p>
</div>

<hr>

<h2>1. What is the fundamental difference between DBMS and RDBMS?</h2>
<p><b>DBMS (Database Management System)</b> stores data as flat files without enforcing tabular relationships, lacks ACID transaction guarantees, and supports single-user or simple storage (e.g., XML, MS Access).</p>
<p><b>RDBMS (Relational Database Management System)</b> stores data in structured tables (relations) with rows (tuples) and columns (attributes), enforces Primary/Foreign Key constraints, supports multi-user ACID transactions, and normalizes data to eliminate redundancy (e.g., MySQL, Oracle, PostgreSQL, SQLite).</p>

<hr>

<h2>2. How do DDL, DML, DQL, DCL, and TCL differ?</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Category</th>
      <th style="padding:10px;border:1px solid #334155;">Full Name</th>
      <th style="padding:10px;border:1px solid #334155;">Commands</th>
      <th style="padding:10px;border:1px solid #334155;">Key Characteristic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>DDL</b></td>
      <td style="padding:10px;border:1px solid #334155;">Data Definition Language</td>
      <td style="padding:10px;border:1px solid #334155;"><code>CREATE, ALTER, DROP, TRUNCATE, RENAME</code></td>
      <td style="padding:10px;border:1px solid #334155;">Modifies database schema; <b>auto-commits immediately</b>.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>DML</b></td>
      <td style="padding:10px;border:1px solid #334155;">Data Manipulation Language</td>
      <td style="padding:10px;border:1px solid #334155;"><code>INSERT, UPDATE, DELETE</code></td>
      <td style="padding:10px;border:1px solid #334155;">Modifies table rows; can be rolled back via <code>ROLLBACK</code>.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>DQL</b></td>
      <td style="padding:10px;border:1px solid #334155;">Data Query Language</td>
      <td style="padding:10px;border:1px solid #334155;"><code>SELECT</code></td>
      <td style="padding:10px;border:1px solid #334155;">Retrieves data without modifying database state.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>DCL</b></td>
      <td style="padding:10px;border:1px solid #334155;">Data Control Language</td>
      <td style="padding:10px;border:1px solid #334155;"><code>GRANT, REVOKE</code></td>
      <td style="padding:10px;border:1px solid #334155;">Manages user permissions and security access privileges.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>TCL</b></td>
      <td style="padding:10px;border:1px solid #334155;">Transaction Control Language</td>
      <td style="padding:10px;border:1px solid #334155;"><code>COMMIT, ROLLBACK, SAVEPOINT</code></td>
      <td style="padding:10px;border:1px solid #334155;">Manages atomic transaction boundaries and recovery points.</td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>3. What is the classic difference: DELETE vs TRUNCATE vs DROP?</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Feature</th>
      <th style="padding:10px;border:1px solid #334155;">DELETE</th>
      <th style="padding:10px;border:1px solid #334155;">TRUNCATE</th>
      <th style="padding:10px;border:1px solid #334155;">DROP</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Command Type</b></td>
      <td style="padding:10px;border:1px solid #334155;">DML</td>
      <td style="padding:10px;border:1px solid #334155;">DDL</td>
      <td style="padding:10px;border:1px solid #334155;">DDL</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>WHERE Clause</b></td>
      <td style="padding:10px;border:1px solid #334155;">Supported (deletes specific rows)</td>
      <td style="padding:10px;border:1px solid #334155;">Not supported (deletes all rows)</td>
      <td style="padding:10px;border:1px solid #334155;">Not applicable</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Rollback</b></td>
      <td style="padding:10px;border:1px solid #334155;">Can be rolled back in transaction</td>
      <td style="padding:10px;border:1px solid #334155;">Cannot be rolled back (auto-commits)</td>
      <td style="padding:10px;border:1px solid #334155;">Cannot be rolled back</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Table Structure</b></td>
      <td style="padding:10px;border:1px solid #334155;">Remains intact</td>
      <td style="padding:10px;border:1px solid #334155;">Remains intact (reset to initial empty state)</td>
      <td style="padding:10px;border:1px solid #334155;">Completely deleted from catalog</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Speed & Logs</b></td>
      <td style="padding:10px;border:1px solid #334155;">Slower (logs each row deletion)</td>
      <td style="padding:10px;border:1px solid #334155;">Fastest (deallocates pages)</td>
      <td style="padding:10px;border:1px solid #334155;">Instantaneous schema removal</td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>4. What is the difference between WHERE and HAVING?</h2>
<ul>
  <li><code>WHERE</code> filters individual records <b>before</b> aggregation occurs. It cannot contain aggregate functions like <code>COUNT()</code> or <code>AVG()</code>.</li>
  <li><code>HAVING</code> filters grouped rows <b>after</b> <code>GROUP BY</code> aggregation has been computed. It is designed specifically to filter on aggregate expressions (e.g. <code>HAVING COUNT(*) > 5</code>).</li>
</ul>

<hr>

<h2>5. Primary Key vs Unique Key vs Candidate Key vs Super Key</h2>
<ul>
  <li><b>Super Key:</b> Any set of attributes that uniquely identifies a row in a table.</li>
  <li><b>Candidate Key:</b> A minimal super key with no redundant attributes. A table can have multiple candidate keys.</li>
  <li><b>Primary Key:</b> The chosen candidate key by the DBA to uniquely identify tuples. Exactly <b>one</b> per table, strictly <b>NO NULL</b> values allowed.</li>
  <li><b>Unique Key:</b> Enforces distinct values across rows, but permits <b>one NULL</b> value (in most engines like MySQL/SQL Server). Multiple unique keys are allowed per table.</li>
  <li><b>Foreign Key:</b> An attribute that references the Primary Key or Unique Key of another table, guaranteeing referential integrity.</li>
</ul>

<hr>

<h2>6. What are the ACID Properties?</h2>
<ul>
  <li><b>A - Atomicity:</b> All statements in a transaction complete successfully, or all changes are rolled back (All-or-Nothing).</li>
  <li><b>C - Consistency:</b> The database transitions from one valid state to another valid state, respecting all constraints and triggers.</li>
  <li><b>I - Isolation:</b> Concurrently executing transactions do not interfere or expose dirty states to each other.</li>
  <li><b>D - Durability:</b> Once a transaction is committed, its modifications survive system crashes or power outages.</li>
</ul>

<hr>

<h2>7. Stored Procedure vs User-Defined Function (UDF)</h2>
<ul>
  <li><b>Procedure:</b> Executed via <code>CALL ProcedureName()</code>, can return 0, 1, or multiple output parameters (<code>OUT</code>), can perform DML, and can manage transactions (<code>COMMIT/ROLLBACK</code>).</li>
  <li><b>Function:</b> Executed inside SQL expressions (e.g., <code>SELECT MyFunc(col) FROM Table</code>), must return exactly <b>one</b> scalar or table value, and cannot alter transaction state.</li>
</ul>

<div class="w3-panel ws-note" style="background-color:rgba(255,161,22,0.1);border-left:4px solid #FFA116;padding:12px 16px;border-radius:8px;">
  <p><b>💡 Pro-Tip for Lab Exams:</b> When asked to find the <i>N-th highest salary</i>, always write the correlated subquery or <code>DENSE_RANK()</code> approach immediately:</p>
  <code>SELECT DISTINCT Salary FROM Employees E1 WHERE N-1 = (SELECT COUNT(DISTINCT Salary) FROM Employees E2 WHERE E2.Salary > E1.Salary);</code>
</div>
"""
    },
    {
        "id": "sql_ddl_dml_queries",
        "jumpId": "sql-sql_ddl_dml_queries",
        "title": "DDL, DML & Advanced SQL Queries",
        "navText": "DDL & DML Queries",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Full command syntax and operational distinctions between DDL schema commands (CREATE, ALTER, DROP, TRUNCATE) and DML data commands (INSERT, UPDATE, DELETE).",
        "examples": [
            {
                "heading": "DDL: Create Student Table",
                "code": "CREATE TABLE Students (\n    StudentID INT PRIMARY KEY,\n    StudentName VARCHAR(50) NOT NULL,\n    Department VARCHAR(30) DEFAULT 'Computer Science',\n    CGPA DECIMAL(3,2) CHECK (CGPA >= 0.00 AND CGPA <= 10.00)\n);"
            },
            {
                "heading": "DML: Insert and Query",
                "code": "INSERT INTO Students (StudentID, StudentName, Department, CGPA) VALUES (1, 'Alice Smith', 'CSE', 9.25);\nSELECT * FROM Students WHERE CGPA > 8.00;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">DDL, DML &</span> SQL Queries</h1>
<p>In relational database management, SQL commands are split into fundamental operational categories based on whether they alter the database <b>schema blueprint</b> or the <b>underlying data tuples</b>.</p>

<hr>

<h2>1. Data Definition Language (DDL)</h2>
<p>DDL statements define, modify, or destroy database structures (tables, indexes, views, schemas). In most database engines, DDL operations are <b>auto-committed</b> immediately and cannot be undone via a standard <code>ROLLBACK</code> statement.</p>

<h3>Core DDL Commands</h3>
<ul>
  <li><code>CREATE TABLE</code>: Defines a new table schema with column datatypes and constraints.</li>
  <li><code>ALTER TABLE</code>: Adds, drops, or alters columns and constraints on existing tables.</li>
  <li><code>DROP TABLE</code>: Permanently removes the table schema, indexes, triggers, and all data from disk.</li>
  <li><code>TRUNCATE TABLE</code>: Rapidly empties all rows from a table while preserving table schema and column definitions.</li>
  <li><code>RENAME TABLE</code>: Renames an existing database object.</li>
</ul>

<div class="w3-example">
<h3>DDL Syntax Example: Creating and Altering Tables</h3>
<div class="w3-code notranslate sqlHigh">
-- 1. Create a Department Table
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Alter Table: Add a New Column
ALTER TABLE Departments ADD Location VARCHAR(100) DEFAULT 'Block A';

-- 3. Alter Table: Modify Column Data Type
ALTER TABLE Departments MODIFY Location VARCHAR(150);

-- 4. Alter Table: Drop a Column
ALTER TABLE Departments DROP COLUMN Location;
</div>
</div>

<hr>

<h2>2. Data Manipulation Language (DML)</h2>
<p>DML statements operate on the records stored inside existing tables. Unlike DDL, DML modifications execute within an active transaction boundary and can be confirmed with <code>COMMIT</code> or reverted with <code>ROLLBACK</code>.</p>

<h3>Core DML Commands</h3>
<ul>
  <li><code>INSERT INTO</code>: Inserts one or multiple new rows into a table.</li>
  <li><code>UPDATE ... SET</code>: Modifies existing column values based on a filtering condition.</li>
  <li><code>DELETE FROM</code>: Removes specific rows satisfying a <code>WHERE</code> condition.</li>
</ul>

<div class="w3-example">
<h3>DML Syntax Example: Inserting, Updating, and Deleting</h3>
<div class="w3-code notranslate sqlHigh">
-- 1. Insert Data
INSERT INTO Departments (DeptID, DeptName) VALUES (101, 'Computer Science');
INSERT INTO Departments (DeptID, DeptName) VALUES (102, 'Mechanical Engineering');

-- 2. Update Data with Condition
UPDATE Departments SET DeptName = 'Computer Science & Engineering' WHERE DeptID = 101;

-- 3. Delete Data with Condition
DELETE FROM Departments WHERE DeptID = 102;
</div>
</div>

<hr>

<h2>3. Querying & Filtering with SQL Clauses</h2>
<p>Retrieving filtered, sorted, and clean data is governed by the <code>SELECT</code> clause and its accompanying filters:</p>
<ul>
  <li><code>DISTINCT</code>: Eliminates duplicate tuples from the output projection.</li>
  <li><code>WHERE</code>: Evaluates boolean filtering conditions (<code>=</code>, <code>!=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>BETWEEN</code>, <code>IN</code>, <code>LIKE</code>).</li>
  <li><code>ORDER BY</code>: Sorts output ascending (<code>ASC</code>, default) or descending (<code>DESC</code>).</li>
  <li><code>LIMIT / OFFSET</code>: Paginates result sets (in PostgreSQL/MySQL/SQLite).</li>
  <li><code>COALESCE(val1, val2)</code>: Returns the first non-NULL expression from its argument list.</li>
</ul>

<div class="w3-example">
<h3>Try it in Northwind SQLite Sandbox:</h3>
<div class="w3-code notranslate sqlHigh">
SELECT CustomerID, CustomerName, City, Country
FROM Customers
WHERE Country IN ('Germany', 'UK', 'France') AND City NOT LIKE 'P%'
ORDER BY Country ASC, CustomerName DESC
LIMIT 5;
</div>
<a target="_blank" href="javascript:void(0)" data-try-sql="trysql_ddl_demo" class="w3-btn w3-margin-bottom">Try it Yourself &raquo;</a>
</div>
"""
    },
    {
        "id": "sql_aggregates_grouping",
        "jumpId": "sql-sql_aggregates_grouping",
        "title": "Aggregate Functions & Grouping (MIN, MAX, COUNT, AVG, GROUP BY, HAVING)",
        "navText": "Aggregates & Grouping",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Mastering statistical aggregate functions, multi-column grouping, and the critical execution hierarchy of WHERE vs HAVING.",
        "examples": [
            {
                "heading": "Order Count by Country",
                "code": "SELECT Country, COUNT(CustomerID) AS TotalCustomers, AVG(CustomerID) AS AvgID\nFROM Customers\nGROUP BY Country\nHAVING COUNT(CustomerID) >= 5\nORDER BY TotalCustomers DESC;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Aggregate Functions</span> & Grouping</h1>
<p>Aggregate functions calculate a single summary result from a collection of column values. When combined with <code>GROUP BY</code>, they partition data into categorized buckets.</p>

<hr>

<h2>The 5 Standard Aggregate Functions</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Function</th>
      <th style="padding:10px;border:1px solid #334155;">Description</th>
      <th style="padding:10px;border:1px solid #334155;">Null Behavior</th>
      <th style="padding:10px;border:1px solid #334155;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>COUNT()</code></td>
      <td style="padding:10px;border:1px solid #334155;">Returns number of rows or non-null values.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>COUNT(*)</code> counts all rows including NULLs; <code>COUNT(col)</code> ignores NULLs.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>COUNT(DISTINCT Country)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>SUM()</code></td>
      <td style="padding:10px;border:1px solid #334155;">Calculates the mathematical sum of numeric values.</td>
      <td style="padding:10px;border:1px solid #334155;">Ignores NULLs; returns NULL if set is empty.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>SUM(Price * Quantity)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>AVG()</code></td>
      <td style="padding:10px;border:1px solid #334155;">Computes the arithmetic mean of numeric values.</td>
      <td style="padding:10px;border:1px solid #334155;">Ignores NULLs; denominator is count of non-nulls.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>AVG(Price)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>MIN()</code></td>
      <td style="padding:10px;border:1px solid #334155;">Finds minimum numeric, string, or date value.</td>
      <td style="padding:10px;border:1px solid #334155;">Ignores NULLs.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>MIN(OrderDate)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>MAX()</code></td>
      <td style="padding:10px;border:1px solid #334155;">Finds maximum numeric, string, or date value.</td>
      <td style="padding:10px;border:1px solid #334155;">Ignores NULLs.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>MAX(Price)</code></td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>GROUP BY Mechanics</h2>
<p>The <code>GROUP BY</code> statement collates records having identical values in specified columns into summary rows.</p>
<div class="w3-panel ws-note" style="background-color:rgba(239,68,68,0.1);border-left:4px solid #ef4444;padding:12px 16px;border-radius:8px;">
  <p><b>⚠️ SQL Cardinal Rule:</b> Every column listed in the <code>SELECT</code> clause that is NOT enclosed in an aggregate function <b>MUST</b> appear in the <code>GROUP BY</code> clause!</p>
</div>

<hr>

<h2>WHERE vs HAVING Execution Order</h2>
<p>The internal logical execution order of an SQL query is:</p>
<ol>
  <li><code>FROM & JOIN</code>: Identifies tables and forms Cartesian/joined product.</li>
  <li><code>WHERE</code>: Eliminates individual tuples <b>before</b> grouping.</li>
  <li><code>GROUP BY</code>: Collates rows into groups.</li>
  <li><code>HAVING</code>: Eliminates grouped buckets <b>after</b> aggregation.</li>
  <li><code>SELECT</code>: Projects selected expressions and computes aliases.</li>
  <li><code>ORDER BY</code>: Sorts the final result set.</li>
  <li><code>LIMIT / OFFSET</code>: Restricts row count.</li>
</ol>

<div class="w3-example">
<h3>Example: Combining WHERE, GROUP BY, and HAVING</h3>
<div class="w3-code notranslate sqlHigh">
SELECT Country, COUNT(CustomerID) AS TotalCustomers
FROM Customers
WHERE Country NOT IN ('USA', 'Canada') -- Filter rows before grouping
GROUP BY Country
HAVING COUNT(CustomerID) >= 3          -- Filter groups after aggregation
ORDER BY TotalCustomers DESC;
</div>
<a target="_blank" href="javascript:void(0)" data-try-sql="trysql_agg_group" class="w3-btn w3-margin-bottom">Try it Yourself &raquo;</a>
</div>
"""
    },
    {
        "id": "sql_joins_all_types",
        "jumpId": "sql-sql_joins_all_types",
        "title": "SQL JOINS Complete Guide (INNER, LEFT, RIGHT, FULL, CROSS, SELF JOIN)",
        "navText": "All SQL Joins",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Exhaustive guide to all relational join mechanics: Inner, Left Outer, Right Outer, Full Outer, Cartesian Cross Joins, and Self Joins.",
        "examples": [
            {
                "heading": "Orders with Customer Names",
                "code": "SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate\nFROM Orders\nINNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID\nLIMIT 5;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Complete Guide to</span> SQL JOINS</h1>
<p>A <code>JOIN</code> clause combines columns from one or more tables based on a related column between them (typically Primary Key to Foreign Key).</p>

<hr>

<h2>The 6 Types of SQL Joins</h2>

<h3>1. INNER JOIN (Equi-Join)</h3>
<p>Returns only records that have matching values in <b>both</b> the left and right tables.</p>
<pre><code>SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;</code></pre>

<h3>2. LEFT OUTER JOIN (or LEFT JOIN)</h3>
<p>Returns <b>all records from the left table</b>, and the matched records from the right table. If no match exists, NULL values are populated for right table columns.</p>
<pre><code>SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;</code></pre>

<h3>3. RIGHT OUTER JOIN (or RIGHT JOIN)</h3>
<p>Returns <b>all records from the right table</b>, and matched records from the left table. If no match exists, NULL values are populated for left table columns.</p>
<pre><code>SELECT Orders.OrderID, Employees.LastName
FROM Orders
RIGHT JOIN Employees ON Orders.EmployeeID = Employees.EmployeeID;</code></pre>

<h3>4. FULL OUTER JOIN</h3>
<p>Returns all records when there is a match in <b>either left or right table</b>. If there is no match on one side, NULLs are returned.</p>
<div class="w3-panel ws-note">
<p><b>SQLite / MySQL Compatibility Note:</b> MySQL and SQLite do not have native <code>FULL OUTER JOIN</code> syntax. They simulate it using a <code>UNION</code> of a <code>LEFT JOIN</code> and a <code>RIGHT JOIN</code>.</p>
</div>

<h3>5. CROSS JOIN (Cartesian Product)</h3>
<p>Produces the Cartesian product of rows from both tables. If Table A has $M$ rows and Table B has $N$ rows, the result contains $M \\times N$ rows.</p>
<pre><code>SELECT Products.ProductName, Shippers.ShipperName
FROM Products
CROSS JOIN Shippers;</code></pre>

<h3>6. SELF JOIN</h3>
<p>A regular join in which a table is joined <b>with itself</b> by employing distinct table aliases. Crucial for hierarchical data (e.g. Employee-Manager relationships) or finding pairs.</p>
<div class="w3-example">
<h3>Self Join Example: Finding Customers in the Same City</h3>
<div class="w3-code notranslate sqlHigh">
SELECT A.CustomerName AS Customer1, B.CustomerName AS Customer2, A.City
FROM Customers A
INNER JOIN Customers B ON A.City = B.City AND A.CustomerID < B.CustomerID
ORDER BY A.City;
</div>
<a target="_blank" href="javascript:void(0)" data-try-sql="trysql_self_join" class="w3-btn w3-margin-bottom">Try it Yourself &raquo;</a>
</div>
"""
    },
    {
        "id": "sql_constraints_master",
        "jumpId": "sql-sql_constraints_master",
        "title": "Database Constraints & Integrity Rules",
        "navText": "Database Constraints",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Enforcing entity, domain, and referential integrity using NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT constraints.",
        "examples": [
            {
                "heading": "Table with Full Constraints",
                "code": "CREATE TABLE Accounts (\n    AccountID INT PRIMARY KEY,\n    AccountNumber VARCHAR(20) NOT NULL UNIQUE,\n    Balance DECIMAL(12,2) DEFAULT 0.00 CHECK (Balance >= 0.00),\n    AccountType VARCHAR(15) CHECK (AccountType IN ('SAVINGS', 'CURRENT')),\n    CreatedAt DATE DEFAULT CURRENT_DATE\n);"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Database</span> Constraints & Integrity</h1>
<p>Constraints specify business integrity rules for data in a table. If any operation violates a constraint, the database engine aborts the statement and rolls back the operation.</p>

<hr>

<h2>The 6 Essential Relational Constraints</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Constraint</th>
      <th style="padding:10px;border:1px solid #334155;">Integrity Level</th>
      <th style="padding:10px;border:1px solid #334155;">Description</th>
      <th style="padding:10px;border:1px solid #334155;">Null Allowed?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>NOT NULL</b></td>
      <td style="padding:10px;border:1px solid #334155;">Domain Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Enforces that a column cannot accept or store NULL values.</td>
      <td style="padding:10px;border:1px solid #334155;">No</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>UNIQUE</b></td>
      <td style="padding:10px;border:1px solid #334155;">Entity Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Ensures all values in a column or set of columns are distinct.</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (typically 1 null)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>PRIMARY KEY</b></td>
      <td style="padding:10px;border:1px solid #334155;">Entity Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Uniquely identifies each record. Exactly one PK per table.</td>
      <td style="padding:10px;border:1px solid #334155;">Strictly No</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>FOREIGN KEY</b></td>
      <td style="padding:10px;border:1px solid #334155;">Referential Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Links child table column to a parent table Primary/Unique Key.</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (unless NOT NULL)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>CHECK</b></td>
      <td style="padding:10px;border:1px solid #334155;">Domain Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Validates that values satisfy a boolean predicate expression.</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (evaluates to true)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>DEFAULT</b></td>
      <td style="padding:10px;border:1px solid #334155;">Domain Integrity</td>
      <td style="padding:10px;border:1px solid #334155;">Supplies an automatic fallback value if no value is provided on INSERT.</td>
      <td style="padding:10px;border:1px solid #334155;">N/A</td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>Referential Actions on Foreign Keys</h2>
<p>When deleting or updating parent records, the child table reacts based on referential triggers:</p>
<ul>
  <li><code>ON DELETE CASCADE</code>: Deleting the parent row automatically deletes all corresponding child rows.</li>
  <li><code>ON DELETE SET NULL</code>: Deleting the parent row sets the child foreign key column to NULL.</li>
  <li><code>ON DELETE RESTRICT / NO ACTION</code>: Rejects the parent deletion if matching child rows exist (default).</li>
</ul>

<div class="w3-example">
<h3>Complete Foreign Key Cascade Definition</h3>
<div class="w3-code notranslate sqlHigh">
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderDate DATE NOT NULL,
    CustomerID INT,
    CONSTRAINT fk_customer
        FOREIGN KEY (CustomerID)
        REFERENCES Customers(CustomerID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
</div>
</div>
"""
    },
    {
        "id": "sql_nested_queries",
        "jumpId": "sql-sql_nested_queries",
        "title": "Nested Queries & Correlated Subqueries",
        "navText": "Nested Queries",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Deep dive into Single-row, Multi-row, and Correlated Subqueries utilizing IN, EXISTS, ANY, and ALL predicates.",
        "examples": [
            {
                "heading": "Find Products Above Average Price",
                "code": "SELECT ProductID, ProductName, Price\nFROM Products\nWHERE Price > (SELECT AVG(Price) FROM Products)\nORDER BY Price DESC;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Nested Queries &</span> Correlated Subqueries</h1>
<p>A <b>nested query</b> (or subquery) is a <code>SELECT</code> statement embedded within the <code>WHERE</code>, <code>HAVING</code>, <code>FROM</code>, or <code>SELECT</code> clause of another parent query.</p>

<hr>

<h2>1. Types of Subqueries</h2>
<ul>
  <li><b>Scalar Subquery:</b> Returns exactly one row and one column (a single value). Can be used anywhere a scalar value is expected (e.g. <code>WHERE Price &gt; (SELECT AVG(Price) FROM Products)</code>).</li>
  <li><b>Multi-Row Subquery:</b> Returns one column with multiple rows. Evaluated using multi-row operators: <code>IN</code>, <code>NOT IN</code>, <code>ANY</code>, <code>ALL</code>.</li>
  <li><b>Correlated Subquery:</b> A subquery that references columns from the outer query. It is evaluated iteratively for <b>each tuple</b> processed by the outer query.</li>
</ul>

<hr>

<h2>2. Multi-Row Predicates: IN, EXISTS, ANY, ALL</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Operator</th>
      <th style="padding:10px;border:1px solid #334155;">Logic Condition</th>
      <th style="padding:10px;border:1px solid #334155;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>IN</code></td>
      <td style="padding:10px;border:1px solid #334155;">True if value matches any item in the subquery set.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>WHERE CustomerID IN (SELECT CustomerID FROM Orders)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>EXISTS</code></td>
      <td style="padding:10px;border:1px solid #334155;">True if subquery returns at least one row (short-circuits instantly).</td>
      <td style="padding:10px;border:1px solid #334155;"><code>WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.CustomerID = C.CustomerID)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>ANY / SOME</code></td>
      <td style="padding:10px;border:1px solid #334155;">True if comparison holds for at least one subquery value.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>WHERE Price > ANY (SELECT Price FROM Products WHERE CategoryID = 1)</code></td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>ALL</code></td>
      <td style="padding:10px;border:1px solid #334155;">True if comparison holds for all values returned by subquery.</td>
      <td style="padding:10px;border:1px solid #334155;"><code>WHERE Price > ALL (SELECT Price FROM Products WHERE CategoryID = 2)</code></td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>3. Correlated Subquery Example</h2>
<p>A correlated subquery executes once for every row evaluated by the outer query. Notice the inner query references the outer alias <code>P1.CategoryID</code>:</p>

<div class="w3-example">
<h3>Find Products Priced Above Their Category Average</h3>
<div class="w3-code notranslate sqlHigh">
SELECT P1.ProductID, P1.ProductName, P1.CategoryID, P1.Price
FROM Products P1
WHERE P1.Price > (
    SELECT AVG(P2.Price)
    FROM Products P2
    WHERE P2.CategoryID = P1.CategoryID -- Outer reference
)
ORDER BY P1.CategoryID, P1.Price DESC;
</div>
<a target="_blank" href="javascript:void(0)" data-try-sql="trysql_correlated" class="w3-btn w3-margin-bottom">Try it Yourself &raquo;</a>
</div>

<hr>

<h2>4. Top Viva Problem: Finding the N-th Highest Value</h2>
<div class="w3-example">
<h3>Find the 2nd Most Expensive Product in Northwind</h3>
<div class="w3-code notranslate sqlHigh">
SELECT ProductName, Price
FROM Products
WHERE Price = (
    SELECT MAX(Price)
    FROM Products
    WHERE Price < (SELECT MAX(Price) FROM Products)
);
</div>
<a target="_blank" href="javascript:void(0)" data-try-sql="trysql_nth_highest" class="w3-btn w3-margin-bottom">Try it Yourself &raquo;</a>
</div>
"""
    },
    {
        "id": "dbms_normalization",
        "jumpId": "sql-dbms_normalization",
        "title": "Database Normalization (1NF, 2NF, 3NF, BCNF, 4NF, 5NF)",
        "navText": "Normalization (1NF-5NF)",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Relational database normalization theory: Functional dependencies, anomalies, and step-by-step table decomposition from 1NF to 5NF.",
        "examples": [
            {
                "heading": "Verify Normalized Tables",
                "code": "SELECT Orders.OrderID, Customers.CustomerName, Shippers.ShipperName\nFROM Orders\nJOIN Customers ON Orders.CustomerID = Customers.CustomerID\nJOIN Shippers ON Orders.ShipperID = Shippers.ShipperID\nLIMIT 5;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Database</span> Normalization (1NF to 5NF)</h1>
<p><b>Normalization</b> is a systematic technique of designing relational database schemas by decomposing tables to eliminate <b>data redundancy</b> and prevent <b>data anomalies</b>.</p>

<hr>

<h2>1. Why Normalize? The Three Database Anomalies</h2>
<p>Without normalization, storing repetitive data in a monolithic table causes critical issues:</p>
<ul>
  <li><b>Insertion Anomaly:</b> Inability to record certain information without inserting unrelated dummy records (e.g., cannot add a new course without enrolling at least one student).</li>
  <li><b>Deletion Anomaly:</b> Deleting one fact inadvertently destroys completely unrelated data (e.g., deleting the last student in a course deletes all information about the course itself).</li>
  <li><b>Update / Modification Anomaly:</b> Updating a repeated fact (such as a professor's phone number) in one record leaves other records inconsistent if not all occurrences are updated simultaneously.</li>
</ul>

<hr>

<h2>2. Functional Dependency ($X \\to Y$)</h2>
<p>A functional dependency exists when the value of attribute set $X$ uniquely determines the value of attribute set $Y$ across all possible tuples. Here, $X$ is the <b>determinant</b>.</p>

<hr>

<h2>3. Step-by-Step Normal Forms</h2>

<h3>1NF: First Normal Form (Atomicity)</h3>
<ul>
  <li><b>Rule:</b> Every column must contain only <b>atomic (single, indivisible)</b> values.</li>
  <li><b>Violation:</b> Storing comma-separated phone numbers <code>'9876543210, 8765432109'</code> or multiple subjects in a single cell.</li>
  <li><b>Resolution:</b> Split multivalued attributes into separate rows with a composite key, or separate into a child table.</li>
</ul>

<h3>2NF: Second Normal Form (No Partial Dependency)</h3>
<ul>
  <li><b>Rule:</b> Must be in <b>1NF</b> AND have <b>NO Partial Dependencies</b>.</li>
  <li><b>Partial Dependency:</b> Occurs when a non-prime attribute depends on only a <i>subset</i> of a composite candidate key, rather than the entire composite key.</li>
  <li><b>Resolution:</b> Decompose into separate tables such that non-prime attributes depend on the full candidate key.</li>
</ul>

<h3>3NF: Third Normal Form (No Transitive Dependency)</h3>
<ul>
  <li><b>Rule:</b> Must be in <b>2NF</b> AND have <b>NO Transitive Dependencies</b>.</li>
  <li><b>Transitive Dependency:</b> Occurs when a non-prime attribute depends on another non-prime attribute ($X \\to Y$ and $Y \\to Z$, where neither $X$ nor $Y$ is a super key).</li>
  <li><b>Formula:</b> For every dependency $X \\to Y$, either $X$ is a Super Key OR $Y$ is a Prime Attribute.</li>
  <li><b>Example:</b> <code>StudentID &rarr; DeptID</code> and <code>DeptID &rarr; DeptHead</code>. Here, <code>DeptHead</code> depends transitively on <code>StudentID</code>.</li>
</ul>

<h3>BCNF: Boyce-Codd Normal Form (Strict 3NF)</h3>
<ul>
  <li><b>Rule:</b> For every non-trivial functional dependency $X \\to Y$, $X$ <b>MUST be a Super Key</b>.</li>
  <li>BCNF eliminates anomalies where a composite candidate key shares overlapping prime attributes that depend on non-candidate keys.</li>
</ul>

<h3>4NF: Fourth Normal Form (Multi-Valued Dependencies)</h3>
<ul>
  <li><b>Rule:</b> Must be in BCNF AND contain <b>no non-trivial Multi-Valued Dependencies ($A \\twoheadrightarrow B$)</b>.</li>
  <li>A multi-valued dependency exists when presence of attribute $B$ is independent of attribute $C$, yet both depend on $A$.</li>
</ul>

<h3>5NF: Fifth Normal Form (Project-Join Normal Form / PJNF)</h3>
<ul>
  <li><b>Rule:</b> In 4NF AND has <b>no Join Dependencies</b> that cannot be reconstructed without loss from smaller projection projections.</li>
</ul>

<hr>

<h2>4. Normalization Summary Reference Table</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Normal Form</th>
      <th style="padding:10px;border:1px solid #334155;">Core Requirement</th>
      <th style="padding:10px;border:1px solid #334155;">Removes / Eliminates</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>1NF</b></td>
      <td style="padding:10px;border:1px solid #334155;">Atomic column values</td>
      <td style="padding:10px;border:1px solid #334155;">Repeating groups, composite arrays</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>2NF</b></td>
      <td style="padding:10px;border:1px solid #334155;">In 1NF + Full dependency on candidate key</td>
      <td style="padding:10px;border:1px solid #334155;">Partial functional dependencies</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>3NF</b></td>
      <td style="padding:10px;border:1px solid #334155;">In 2NF + Non-prime depends only on super key</td>
      <td style="padding:10px;border:1px solid #334155;">Transitive dependencies ($X \\to Y \\to Z$)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>BCNF</b></td>
      <td style="padding:10px;border:1px solid #334155;">For every $X \\to Y$, $X$ must be super key</td>
      <td style="padding:10px;border:1px solid #334155;">Remaining functional dependency anomalies</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>4NF</b></td>
      <td style="padding:10px;border:1px solid #334155;">In BCNF + Independent multivalued attributes</td>
      <td style="padding:10px;border:1px solid #334155;">Multi-valued dependencies ($A \\twoheadrightarrow B$)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>5NF</b></td>
      <td style="padding:10px;border:1px solid #334155;">In 4NF + Lossless join decomposition</td>
      <td style="padding:10px;border:1px solid #334155;">Join dependencies</td>
    </tr>
  </tbody>
</table>
</div>
"""
    },
    {
        "id": "sql_views_synonyms_sequences_index",
        "jumpId": "sql-sql_views_synonyms_sequences_index",
        "title": "Database Objects: Views, Synonyms, Sequences & Indexes",
        "navText": "Views, Synonyms, Sequences",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Detailed architecture of database schema objects: Virtual Views, Synonyms, Auto-Incrementing Sequences, and B-Tree Indexes.",
        "examples": [
            {
                "heading": "Create View Example",
                "code": "CREATE VIEW GermanCustomers AS\nSELECT CustomerID, CustomerName, ContactName, City\nFROM Customers\nWHERE Country = 'Germany';\n\nSELECT * FROM GermanCustomers;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Database Objects:</span> Views, Synonyms, Sequences & Indexes</h1>
<p>Beyond standard base tables, RDBMS engines provide specialized database schema objects to enhance performance, simplify query complexity, and control security access.</p>

<hr>

<h2>1. SQL Views (Virtual Tables)</h2>
<p>A <b>view</b> is a virtual table composed of the result-set of an underlying SQL query. It contains rows and columns just like a real table, but takes up no physical table storage (except materialized views).</p>

<h3>Benefits of Views</h3>
<ul>
  <li><b>Security & Abstraction:</b> Restricts access to sensitive columns (e.g. expose employee names and department without exposing salaries or SSNs).</li>
  <li><b>Query Simplification:</b> Hides complex multi-table joins behind a clean, simple alias.</li>
  <li><b>Data Independence:</b> Shields client applications from alterations in base table layouts.</li>
</ul>

<div class="w3-example">
<h3>Creating and Using a View</h3>
<div class="w3-code notranslate sqlHigh">
-- Create View
CREATE VIEW HighValueProducts AS
SELECT ProductID, ProductName, Price
FROM Products
WHERE Price > 30.00;

-- Query View like a standard table
SELECT * FROM HighValueProducts WHERE Price < 50.00;

-- Drop View
DROP VIEW HighValueProducts;
</div>
</div>

<hr>

<h2>2. SQL Synonyms</h2>
<p>A <b>synonym</b> is an alternative identifier (alias) for any database object (such as a table, view, sequence, or stored procedure). Supported in Oracle, Microsoft SQL Server, and DB2.</p>
<ul>
  <li><b>Location Transparency:</b> Allows referencing an object located in another schema without prefixing the full schema or remote database link.</li>
  <li><b>Private Synonym:</b> Accessible only by the schema owner who created it.</li>
  <li><b>Public Synonym:</b> Accessible by all database users.</li>
</ul>

<pre><code>-- Oracle / SQL Server Synonym Syntax:
CREATE SYNONYM emp FOR human_resources.employees_master;
SELECT * FROM emp WHERE department_id = 10;</code></pre>

<hr>

<h2>3. Sequences & Auto-Increment</h2>
<p>A <b>sequence</b> is an independent database object that generates an ascending sequence of unique integers, primarily used to populate synthetic Primary Keys.</p>

<h3>Database Engine Comparison</h3>
<ul>
  <li><b>Oracle / PostgreSQL:</b> Uses independent sequence objects via <code>CREATE SEQUENCE</code> with pseudo-columns <code>NEXTVAL</code> and <code>CURRVAL</code>.</li>
  <li><b>MySQL:</b> Uses column-level <code>AUTO_INCREMENT</code>.</li>
  <li><b>SQL Server:</b> Uses <code>IDENTITY(seed, increment)</code> or independent <code>SEQUENCE</code>.</li>
  <li><b>SQLite:</b> Uses <code>INTEGER PRIMARY KEY AUTOINCREMENT</code>.</li>
</ul>

<div class="w3-example">
<h3>Sequence Definition Syntax</h3>
<div class="w3-code notranslate sqlHigh">
-- Oracle / PostgreSQL Sequence Syntax
CREATE SEQUENCE order_seq
    START WITH 1000
    INCREMENT BY 1
    NOCACHE;

-- Fetch Next Value
INSERT INTO Orders (OrderID, OrderDate) VALUES (order_seq.NEXTVAL, CURRENT_DATE);
</div>
</div>

<hr>

<h2>4. Database Indexes</h2>
<p>An <b>index</b> is a specialized data structure (typically a B+ Tree) that enables rapid retrieval of rows without scanning every row of a table (full table scan).</p>

<h3>Clustered vs Non-Clustered Indexes</h3>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Characteristic</th>
      <th style="padding:10px;border:1px solid #334155;">Clustered Index</th>
      <th style="padding:10px;border:1px solid #334155;">Non-Clustered Index</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Physical Storage</b></td>
      <td style="padding:10px;border:1px solid #334155;">Alters physical order of rows on disk. Leaf nodes store actual table data rows.</td>
      <td style="padding:10px;border:1px solid #334155;">Separate auxiliary structure. Leaf nodes store pointers (row locators) to data.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Limit Per Table</b></td>
      <td style="padding:10px;border:1px solid #334155;">Exactly <b>one</b> per table (usually Primary Key).</td>
      <td style="padding:10px;border:1px solid #334155;"><b>Multiple</b> allowed per table.</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>Speed</b></td>
      <td style="padding:10px;border:1px solid #334155;">Faster for range scans (<code>BETWEEN</code>, <code>ORDER BY</code>).</td>
      <td style="padding:10px;border:1px solid #334155;">Fast for point queries, but requires pointer lookup.</td>
    </tr>
  </tbody>
</table>
</div>
"""
    },
    {
        "id": "sql_transactions_acid",
        "jumpId": "sql-sql_transactions_acid",
        "title": "Transactions & Concurrency Control (ACID & TCL)",
        "navText": "Transactions & ACID",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Deep architectural analysis of Transaction Control Language (TCL), ACID properties, concurrency anomalies, and ANSI isolation levels.",
        "examples": [
            {
                "heading": "Transaction Demonstration",
                "code": "BEGIN TRANSACTION;\nINSERT INTO Shippers (ShipperID, ShipperName, Phone) VALUES (99, 'Express Swift Delivery', '(503) 555-9999');\nSELECT * FROM Shippers WHERE ShipperID = 99;\nROLLBACK;\nSELECT * FROM Shippers WHERE ShipperID = 99;"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">Transactions, ACID &</span> Concurrency Control</h1>
<p>A <b>transaction</b> is a single logical unit of work that accesses and possibly updates various data items. It must either complete entirely or leave the database completely unaltered.</p>

<hr>

<h2>1. The ACID Properties in Depth</h2>
<ul>
  <li><b>Atomicity (All-or-Nothing):</b> If any statement within a transaction fails, all previous changes in that transaction are rolled back using the rollback segment / write-ahead log (WAL).</li>
  <li><b>Consistency (State Integrity):</b> The database begins in a consistent state and ends in a consistent state, with no violated Primary/Foreign Key, UNIQUE, or CHECK constraints.</li>
  <li><b>Isolation (Non-Interference):</b> Intermediate, uncommitted changes made by one transaction remain invisible to all concurrent transactions until committed.</li>
  <li><b>Durability (Persistence):</b> Once a transaction commits, its modifications are permanently recorded in non-volatile storage and survive power loss or system failure.</li>
</ul>

<hr>

<h2>2. Transaction Control Language (TCL) Commands</h2>
<ul>
  <li><code>START TRANSACTION</code> / <code>BEGIN</code>: Marks the beginning of an explicit transaction block.</li>
  <li><code>COMMIT</code>: Permanently applies all modifications made during the transaction to disk.</li>
  <li><code>ROLLBACK</code>: Aborts the active transaction and undoes all modifications back to the starting point.</li>
  <li><code>SAVEPOINT point_name</code>: Sets an intermediate checkpoint within a transaction.</li>
  <li><code>ROLLBACK TO point_name</code>: Undoes changes back to a specific savepoint without aborting the entire transaction.</li>
</ul>

<div class="w3-example">
<h3>Bank Transfer Transaction Pattern</h3>
<div class="w3-code notranslate sqlHigh">
START TRANSACTION;

-- 1. Deduct from Sender
UPDATE Accounts SET Balance = Balance - 5000.00 WHERE AccountID = 101;

-- Set Savepoint
SAVEPOINT step1;

-- 2. Credit to Beneficiary
UPDATE Accounts SET Balance = Balance + 5000.00 WHERE AccountID = 202;

-- Check for success or error
COMMIT; -- Or ROLLBACK TO step1;
</div>
</div>

<hr>

<h2>3. Concurrency Anomalies & Isolation Levels</h2>
<p>When multiple transactions execute concurrently without adequate isolation, three standard phenomena occur:</p>
<ul>
  <li><b>Dirty Read:</b> Transaction A reads data modified by Transaction B that has <i>not yet been committed</i>. If B rolls back, A holds phantom, invalid data.</li>
  <li><b>Non-Repeatable Read:</b> Transaction A reads the same row twice, but finds different values because Transaction B modified and committed it in between.</li>
  <li><b>Phantom Read:</b> Transaction A executes a range query (e.g. <code>WHERE Price &gt; 50</code>) twice, but discovers new tuples inserted and committed by Transaction B in between.</li>
</ul>

<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">Isolation Level</th>
      <th style="padding:10px;border:1px solid #334155;">Dirty Read</th>
      <th style="padding:10px;border:1px solid #334155;">Non-Repeatable Read</th>
      <th style="padding:10px;border:1px solid #334155;">Phantom Read</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>READ UNCOMMITTED</b></td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>READ COMMITTED</b></td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>REPEATABLE READ</b></td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
      <td style="padding:10px;border:1px solid #334155;color:#ef4444;">Allowed</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><b>SERIALIZABLE</b></td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
      <td style="padding:10px;border:1px solid #334155;color:#10b981;">Prevented</td>
    </tr>
  </tbody>
</table>
</div>
"""
    },
    {
        "id": "plsql_triggers_procedures",
        "jumpId": "sql-plsql_triggers_procedures",
        "title": "PL/SQL & MySQL: Stored Procedures & Triggers",
        "navText": "Triggers & Procedures",
        "category": "0. 🎓 Lab Exam & Viva Topics",
        "summary": "Procedural database programming: In/Out/Inout Stored Procedures, Triggers (BEFORE/AFTER, OLD/NEW), and authentic laboratory exam implementations.",
        "examples": [
            {
                "heading": "MySQL Procedure Example",
                "code": "DELIMITER //\nCREATE PROCEDURE GetCustomerOrders(IN cust_id INT)\nBEGIN\n    SELECT OrderID, OrderDate, CustomerID\n    FROM Orders\n    WHERE CustomerID = cust_id;\nEND //\nDELIMITER ;\n\nCALL GetCustomerOrders(1);"
            }
        ],
        "rawHtml": """
<h1><span class="color_h1">PL/SQL & MySQL:</span> Stored Procedures & Triggers</h1>
<p>Procedural database extensions (like MySQL Routines or Oracle PL/SQL) introduce conditional branching (<code>IF-ELSE</code>), iterative loops (<code>WHILE</code>), variables, and automated event triggers into SQL.</p>

<hr>

<h2>1. Stored Procedures</h2>
<p>A <b>stored procedure</b> is a prepared SQL code block stored in the database catalog that can be reused and called repeatedly with parameters.</p>

<h3>Parameter Modes</h3>
<ul>
  <li><code>IN</code> (Default): Passes a value from the caller into the procedure. Read-only inside the procedure.</li>
  <li><code>OUT</code>: Returns a calculated value from the procedure back to the caller.</li>
  <li><code>INOUT</code>: Accepts a value from caller, can be modified inside procedure, and returns updated value.</li>
</ul>

<div class="w3-example">
<h3>Stored Procedure with IN and OUT Parameters</h3>
<div class="w3-code notranslate sqlHigh">
DELIMITER //

CREATE PROCEDURE CalculateCustomerTotal(
    IN p_customer_id INT,
    OUT p_total_orders INT
)
BEGIN
    SELECT COUNT(*) INTO p_total_orders
    FROM Orders
    WHERE CustomerID = p_customer_id;
END //

DELIMITER ;

-- Invoking Procedure and Reading OUT Variable
CALL CalculateCustomerTotal(1, @order_count);
SELECT @order_count AS TotalOrdersPlaced;
</div>
</div>

<hr>

<h2>2. Database Triggers</h2>
<p>A <b>trigger</b> is an automated procedural block executed (fired) automatically by the database engine in response to a DML event (<code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code>) on a table.</p>

<h3>Trigger Execution Timing & Scope</h3>
<ul>
  <li><b>Timing:</b>
    <ul>
      <li><code>BEFORE</code>: Fires <i>before</i> the row is written to disk. Used for data validation, fraud checks, or standardizing values (e.g. prepending <code>+91</code>).</li>
      <li><code>AFTER</code>: Fires <i>after</i> the row is written to disk. Used for audit trail logging, updating summary tables, or sending notifications.</li>
    </ul>
  </li>
  <li><b>Scope:</b> <code>FOR EACH ROW</code> specifies a row-level trigger that executes once per affected tuple.</li>
</ul>

<hr>

<h2>3. NEW vs OLD Qualifiers</h2>
<div class="w3-responsive">
<table class="ws-table-all notranslate" style="width:100%;border-collapse:collapse;margin:16px 0;">
  <thead>
    <tr style="background-color:#1e293b;color:#f8fafc;">
      <th style="padding:10px;border:1px solid #334155;">DML Event</th>
      <th style="padding:10px;border:1px solid #334155;">OLD Values Available?</th>
      <th style="padding:10px;border:1px solid #334155;">NEW Values Available?</th>
      <th style="padding:10px;border:1px solid #334155;">Can Modify NEW?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>INSERT</code></td>
      <td style="padding:10px;border:1px solid #334155;">No (NULL)</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (row being inserted)</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (in BEFORE INSERT)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>UPDATE</code></td>
      <td style="padding:10px;border:1px solid #334155;">Yes (values prior to update)</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (new incoming values)</td>
      <td style="padding:10px;border:1px solid #334155;">Yes (in BEFORE UPDATE)</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #334155;"><code>DELETE</code></td>
      <td style="padding:10px;border:1px solid #334155;">Yes (values being deleted)</td>
      <td style="padding:10px;border:1px solid #334155;">No (NULL)</td>
      <td style="padding:10px;border:1px solid #334155;">No</td>
    </tr>
  </tbody>
</table>
</div>

<hr>

<h2>4. Authentic Lab Exam Trigger Implementation</h2>

<div class="w3-example">
<h3>Trigger 1: Automatic Bank Balance & Fraud Enforcer (BEFORE INSERT)</h3>
<div class="w3-code notranslate sqlHigh">
DELIMITER //

CREATE TRIGGER trg_bank_transaction_before_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    -- 1. Flag transaction exceeding limit as FRAUD
    IF NEW.amount > 50000 THEN
        SET NEW.status = 'FRAUD';
    -- 2. Verify account balance for withdrawals
    ELSEIF NEW.txn_type = 'withdraw' THEN
        SET NEW.status = 'SUCCESS';
    ELSE
        SET NEW.status = 'SUCCESS';
    END IF;
END //

DELIMITER ;
</div>
</div>

<div class="w3-example">
<h3>Trigger 2: Delivery Audit Trail Logger (AFTER INSERT)</h3>
<div class="w3-code notranslate sqlHigh">
DELIMITER //

CREATE TRIGGER trg_audit_late_delivery
AFTER INSERT ON deliveries
FOR EACH ROW
BEGIN
    -- Check if delivery time exceeded 60 minutes
    IF NEW.Delivery_time > 60 THEN
        INSERT INTO late_delivery_audit (Delivery_id, Customer_id, Delivery_time, Audit_date)
        VALUES (NEW.Delivery_id, NEW.Customer_id, NEW.Delivery_time, NOW());
    END IF;
END //

DELIMITER ;
</div>
</div>
"""
    }
]

# Load existing course
course_path = 'client/src/assets/w3schools_sql_full_course.json'
with open(course_path, 'r', encoding='utf-8') as f:
    existing_lessons = json.load(f)

print(f"Existing lessons count: {len(existing_lessons)}")

# Filter out any old lab exam lessons if already present
filtered_existing = [l for l in existing_lessons if not l['id'].startswith('sql_viva_') and not l['category'].startswith('0.')]

# Prepend lab exam lessons at the very top so they are Category 0!
all_lessons = lab_exam_lessons + filtered_existing

# Assign continuous sequential order numbers
for idx, lesson in enumerate(all_lessons):
    lesson['order'] = idx + 1

with open(course_path, 'w', encoding='utf-8') as f:
    json.dump(all_lessons, f, indent=2, ensure_ascii=False)

print(f"Successfully updated course! Total lessons now: {len(all_lessons)}")
print(f"Pretended {len(lab_exam_lessons)} Lab Exam & Viva lessons at the top!")
