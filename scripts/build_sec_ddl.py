import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 1A: DDL (DATA DEFINITION LANGUAGE)
# ==============================================================================
def build_sec_ddl():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">1A. DDL (Data Definition Language) — Create, Alter, Drop, Truncate</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_create_table.asp" target="_blank" rel="noopener" class="badge-link">W3Schools CREATE TABLE ↗</a>
    <a href="https://www.w3schools.com/sql/sql_alter.asp" target="_blank" rel="noopener" class="badge-link">W3Schools ALTER TABLE ↗</a>
    <a href="https://www.w3schools.com/sql/sql_drop_table.asp" target="_blank" rel="noopener" class="badge-link">W3Schools DROP TABLE ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Building the Physical House</strong>
  <b>DDL</b> commands are like an architect drawing and building the structure of a house. You decide how many rooms (tables) to build, what each shelf holds (data types), and set boundary walls (constraints). DDL commands permanently alter the database structure and trigger an automatic commit in MySQL.
</div>

<div class="callout callout-green">
  <b>Quick Reference: Common SQL Data Types in Lab Exams</b><br/>
  • <code>INT</code>: Whole integers (e.g. 101, 2500)<br/>
  • <code>VARCHAR(n)</code>: Variable-length strings up to n characters (e.g. <code>VARCHAR(50)</code>)<br/>
  • <code>DECIMAL(p, s)</code>: Fixed-point exact decimals (e.g. <code>DECIMAL(4, 2)</code> allows up to 99.99)<br/>
  • <code>DATE</code>: Calendar date in <code>'YYYY-MM-DD'</code> format<br/>
  • <code>BOOLEAN</code>: Synonymous with <code>TINYINT(1)</code> (0 = false, 1 = true)
</div>
'''

    # Variety 1: CREATE TABLE
    cards.append(make_card(
        badge="CREATE TABLE",
        title="1. CREATE TABLE with Primary Key, Types, and Defaults",
        what_it_does="Creates the Student relation schema. <code>RollNo</code> is the unique Primary Key, <code>StudentName</code> is required, <code>Dept</code> defaults to 'CSE', and <code>CGPA</code> stores exact 2-decimal ratings.",
        sql="CREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    StudentName VARCHAR(50) NOT NULL,\n    Dept VARCHAR(10) DEFAULT 'CSE',\n    CGPA DECIMAL(3, 2),\n    JoinDate DATE NOT NULL\n);",
        status_line="Query OK, 0 rows affected (0.02 sec)",
        output_title="Resulting Schema Structure (DESCRIBE Students):",
        headers=["Field", "Type", "Null", "Key", "Default", "Extra"],
        rows=[
            ["RollNo", "int", "NO", "PRI", "NULL", ""],
            ["StudentName", "varchar(50)", "NO", "", "NULL", ""],
            ["Dept", "varchar(10)", "YES", "", "CSE", ""],
            ["CGPA", "decimal(3,2)", "YES", "", "NULL", ""],
            ["JoinDate", "date", "NO", "", "NULL", ""]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Schema Created:</b> 5 columns allocated with primary key index on <code>RollNo</code>."
    ))

    # Variety 2: ALTER TABLE ADD COLUMN
    cards.append(make_card(
        badge="ALTER ADD",
        title="2. ALTER TABLE ADD COLUMN — Adding an Email Column with UNIQUE Constraint",
        what_it_does="Adds a new column to an existing table without disturbing any records. Existing rows receive NULL unless a default is specified.",
        sql="ALTER TABLE Students\nADD COLUMN Email VARCHAR(100) UNIQUE AFTER StudentName;",
        status_line="Query OK, 0 rows affected (0.02 sec) | Records: 0  Duplicates: 0  Warnings: 0",
        output_title="Resulting Schema Structure (DESCRIBE Students):",
        headers=["Field", "Type", "Null", "Key", "Default", "Extra"],
        rows=[
            ["RollNo", "int", "NO", "PRI", "NULL", ""],
            ["StudentName", "varchar(50)", "NO", "", "NULL", ""],
            ["Email", "varchar(100)", "YES", "UNI", "NULL", ""],
            ["Dept", "varchar(10)", "YES", "", "CSE", ""],
            ["CGPA", "decimal(3,2)", "YES", "", "NULL", ""],
            ["JoinDate", "date", "NO", "", "NULL", ""]
        ],
        extra_notes="<b>Schema Update:</b> <code>Email</code> column successfully positioned after <code>StudentName</code> with UNIQUE index."
    ))

    # Variety 3: ALTER TABLE MODIFY COLUMN
    cards.append(make_card(
        badge="ALTER MODIFY",
        title="3. ALTER TABLE MODIFY COLUMN — Expanding Column Width to 80 Characters",
        what_it_does="Expands column size from VARCHAR(50) to VARCHAR(80) to accommodate longer student names. Validates existing data to ensure no truncation occurs.",
        sql="ALTER TABLE Students\nMODIFY COLUMN StudentName VARCHAR(80) NOT NULL;",
        status_line="Query OK, 0 rows affected (0.01 sec) | Records: 0  Duplicates: 0  Warnings: 0",
        output_title="Resulting Schema Structure (DESCRIBE Students):",
        headers=["Field", "Type (Updated)", "Null", "Key", "Default", "Extra"],
        rows=[
            ["RollNo", "int", "NO", "PRI", "NULL", ""],
            ["StudentName", "varchar(80)", "NO", "", "NULL", ""],
            ["Email", "varchar(100)", "YES", "UNI", "NULL", ""],
            ["Dept", "varchar(10)", "YES", "", "CSE", ""],
            ["CGPA", "decimal(3,2)", "YES", "", "NULL", ""],
            ["JoinDate", "date", "NO", "", "NULL", ""]
        ]
    ))

    # Variety 4: ALTER TABLE RENAME COLUMN
    cards.append(make_card(
        badge="ALTER RENAME",
        title="4. ALTER TABLE RENAME COLUMN — Renaming JoinDate to EnrollmentDate",
        what_it_does="Renames column identifier while keeping data type and constraints intact (MySQL 8.0+ standard syntax).",
        sql="ALTER TABLE Students\nRENAME COLUMN JoinDate TO EnrollmentDate;",
        status_line="Query OK, 0 rows affected (0.01 sec) | Records: 0  Duplicates: 0  Warnings: 0",
        output_title="Resulting Schema Structure (DESCRIBE Students):",
        headers=["Field (Renamed)", "Type", "Null", "Key", "Default", "Extra"],
        rows=[
            ["RollNo", "int", "NO", "PRI", "NULL", ""],
            ["StudentName", "varchar(80)", "NO", "", "NULL", ""],
            ["Email", "varchar(100)", "YES", "UNI", "NULL", ""],
            ["Dept", "varchar(10)", "YES", "", "CSE", ""],
            ["CGPA", "decimal(3,2)", "YES", "", "NULL", ""],
            ["EnrollmentDate", "date", "NO", "", "NULL", ""]
        ]
    ))

    # Variety 5: ALTER TABLE DROP COLUMN
    cards.append(make_card(
        badge="ALTER DROP",
        title="5. ALTER TABLE DROP COLUMN — Removing the Email Column",
        what_it_does="Permanently drops a column and all data stored within it from the table schema.",
        sql="ALTER TABLE Students\nDROP COLUMN Email;",
        status_line="Query OK, 0 rows affected (0.01 sec) | Records: 0  Duplicates: 0  Warnings: 0",
        output_title="Resulting Schema Structure (DESCRIBE Students):",
        headers=["Field", "Type", "Null", "Key", "Default", "Extra"],
        rows=[
            ["RollNo", "int", "NO", "PRI", "NULL", ""],
            ["StudentName", "varchar(80)", "NO", "", "NULL", ""],
            ["Dept", "varchar(10)", "YES", "", "CSE", ""],
            ["CGPA", "decimal(3,2)", "YES", "", "NULL", ""],
            ["EnrollmentDate", "date", "NO", "", "NULL", ""]
        ]
    ))

    # Variety 6: ALTER TABLE ADD CONSTRAINT
    cards.append(make_card(
        badge="ADD CONSTRAINT",
        title="6. ALTER TABLE ADD CONSTRAINT — Enforcing Named Range CHECK Constraint",
        what_it_does="Enforces that CGPA must always fall between 0.00 and 10.00. Any insert or update violating this check is instantly rejected by the engine.",
        sql="ALTER TABLE Students\nADD CONSTRAINT chk_student_cgpa CHECK (CGPA >= 0.00 AND CGPA <= 10.00);",
        status_line="Query OK, 0 rows affected (0.02 sec) | Records: 0  Duplicates: 0  Warnings: 0",
        output_title="Active Constraints (information_schema.TABLE_CONSTRAINTS):",
        headers=["CONSTRAINT_NAME", "CONSTRAINT_TYPE", "ENFORCED"],
        rows=[
            ["PRIMARY", "PRIMARY KEY", "YES"],
            ["chk_student_cgpa", "CHECK", "YES"]
        ],
        card_class="card-amber",
        status_badge="badge-amber"
    ))

    # Variety 7: TRUNCATE TABLE
    cards.append(make_card(
        badge="TRUNCATE",
        title="7. TRUNCATE TABLE — High-Speed Table Emptying & Counter Reset",
        what_it_does="Deletes all rows by deallocating and re-initializing the underlying table pages. Resets the AUTO_INCREMENT counter to 1 while preserving the full column schema.",
        sql="TRUNCATE TABLE Students;",
        status_line="Query OK, 0 rows affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo", "StudentName", "Dept", "CGPA", "EnrollmentDate"],
        rows=[
            ["-", "Empty set (0.00 sec)", "0 rows remaining in table. Table schema intact.", "-", "-"]
        ]
    ))

    # Variety 8: DROP TABLE
    cards.append(make_card(
        badge="DROP TABLE",
        title="8. DROP TABLE IF EXISTS — Complete Object Removal from Database",
        what_it_does="Completely removes the table definition, data, indexes, and triggers from the database catalog.",
        sql="DROP TABLE IF EXISTS Students;",
        status_line="Query OK, 0 rows affected (0.01 sec)",
        output_title="Catalog Verification (SHOW TABLES LIKE 'Students'):",
        headers=["Tables_in_college (Students)"],
        rows=[
            ["Empty set (0.00 sec) — Table completely purged from schema"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_ddl builder compiled with detailed resulting schema tables.")
