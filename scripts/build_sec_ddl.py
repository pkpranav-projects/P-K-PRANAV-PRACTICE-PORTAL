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
        what_it_does="Creates a brand-new table in the active database schema. Defines column names, exact data types, and primary key constraint to ensure no duplicate student IDs can ever be entered.",
        sql="CREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    StudentName VARCHAR(50) NOT NULL,\n    Dept VARCHAR(10) DEFAULT 'CSE',\n    CGPA DECIMAL(3, 2),\n    JoinDate DATE NOT NULL\n);",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.02 sec"]],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Table Verification:</b> Run <code>DESCRIBE Students;</code> to inspect the newly created column schema."
    ))

    # Variety 2: ALTER TABLE ADD COLUMN
    cards.append(make_card(
        badge="ALTER ADD",
        title="2. ALTER TABLE ADD COLUMN — Adding a New Attribute",
        what_it_does="Adds a new column to an existing table populated with data, without disturbing any existing records. Existing rows will receive NULL for this column unless a DEFAULT is specified.",
        sql="ALTER TABLE Students\nADD COLUMN Email VARCHAR(100) UNIQUE AFTER StudentName;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Variety 3: ALTER TABLE MODIFY COLUMN
    cards.append(make_card(
        badge="ALTER MODIFY",
        title="3. ALTER TABLE MODIFY COLUMN — Changing Data Type or Nullability",
        what_it_does="Expands column size (e.g., from VARCHAR(50) to VARCHAR(80)) or changes constraints (e.g. adding NOT NULL). MySQL validates existing data to ensure no truncation occurs.",
        sql="ALTER TABLE Students\nMODIFY COLUMN StudentName VARCHAR(80) NOT NULL;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Variety 4: ALTER TABLE RENAME COLUMN
    cards.append(make_card(
        badge="ALTER RENAME",
        title="4. ALTER TABLE RENAME COLUMN — Renaming an Identifier",
        what_it_does="Renames a column while keeping its existing data type and constraints intact (MySQL 8.0+ syntax).",
        sql="ALTER TABLE Students\nRENAME COLUMN JoinDate TO EnrollmentDate;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Variety 5: ALTER TABLE DROP COLUMN
    cards.append(make_card(
        badge="ALTER DROP",
        title="5. ALTER TABLE DROP COLUMN — Removing an Unused Column",
        what_it_does="Permanently removes a column and all values stored inside it across all rows. Irreversible unless backed up.",
        sql="ALTER TABLE Students\nDROP COLUMN Email;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Variety 6: ALTER TABLE ADD CONSTRAINT
    cards.append(make_card(
        badge="ADD CONSTRAINT",
        title="6. ALTER TABLE ADD CONSTRAINT — Adding an Explicit CHECK Rule",
        what_it_does="Attaches a domain constraint rule to enforce valid CGPA values (must be between 0.00 and 10.00). Any future INSERT or UPDATE violating this rule will be rejected with an error.",
        sql="ALTER TABLE Students\nADD CONSTRAINT chk_student_cgpa CHECK (CGPA >= 0.00 AND CGPA <= 10.00);",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]],
        card_class="card-amber",
        status_badge="badge-amber"
    ))

    # Variety 7: TRUNCATE TABLE
    cards.append(make_card(
        badge="TRUNCATE",
        title="7. TRUNCATE TABLE — High-Speed Table Emptying",
        what_it_does="Deletes all rows from the table by dropping and recreating the underlying data pages. Resets the AUTO_INCREMENT counter back to 1. Operates much faster than DELETE.",
        sql="TRUNCATE TABLE Students;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]]
    ))

    # Variety 8: DROP TABLE
    cards.append(make_card(
        badge="DROP TABLE",
        title="8. DROP TABLE IF EXISTS — Complete Table Removal",
        what_it_does="Completely purges the table definition, data, indexes, and triggers from the database dictionary. <code>IF EXISTS</code> prevents syntax errors if the table does not exist.",
        sql="DROP TABLE IF EXISTS Students;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_ddl builder compiled successfully.")
