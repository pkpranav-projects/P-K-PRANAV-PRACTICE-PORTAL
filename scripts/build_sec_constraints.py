import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 4: ALL 7 DATABASE CONSTRAINTS
# ==============================================================================
def build_sec_constraints():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">4. All 7 Database Constraints — Integrity Enforcement</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_constraints.asp" target="_blank" rel="noopener" class="badge-link">W3Schools Constraints ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: The Security Guards of the Database</strong>
  Constraints are automatic validation rules enforced by the database engine at write time. If a user tries to enter a duplicate roll number, a negative mark, or an invalid email, the constraint instantly blocks the query and protects data integrity.
</div>
'''

    # Constraint 1: PRIMARY KEY
    cards.append(make_card(
        badge="PRIMARY KEY",
        title="1. PRIMARY KEY — Entity Integrity (Unique + NOT NULL)",
        what_it_does="Uniquely identifies each record in the relation. Combines <code>NOT NULL</code> and <code>UNIQUE</code> constraints into a single column. Automatically creates a clustered B-tree index in InnoDB.",
        sql="CREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    StudentName VARCHAR(50) NOT NULL\n);",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.02 sec"]],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Constraint 2: FOREIGN KEY CASCADE
    cards.append(make_card(
        badge="FK CASCADE",
        title="2. FOREIGN KEY with ON DELETE CASCADE — Referential Integrity",
        what_it_does="Links child records in <code>Enrollments</code> to the parent record in <code>Students</code>. If student RollNo 101 is deleted from the parent table, all of their enrolled course records are automatically deleted by the database engine.",
        sql="CREATE TABLE Enrollments (\n    EnrollID INT PRIMARY KEY,\n    RollNo INT,\n    CourseCode VARCHAR(10),\n    FOREIGN KEY (RollNo) REFERENCES Students(RollNo)\n        ON DELETE CASCADE\n        ON UPDATE CASCADE\n);",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.02 sec"]],
        extra_notes="<b>Cascade Effect:</b> Deleting student 101 automatically deletes all their matching rows in <code>Enrollments</code>."
    ))

    # Constraint 3: FOREIGN KEY SET NULL
    cards.append(make_card(
        badge="FK SET NULL",
        title="3. FOREIGN KEY with ON DELETE SET NULL — Orphan Grace",
        what_it_does="When a parent department is deleted, instead of deleting all students in that department, MySQL sets their <code>DeptID</code> column to <code>NULL</code>, keeping student records intact.",
        sql="CREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    DeptID INT,\n    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)\n        ON DELETE SET NULL\n);",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.02 sec"]]
    ))

    # Constraint 4: UNIQUE
    cards.append(make_card(
        badge="UNIQUE",
        title="4. UNIQUE Constraint — Disallowing Duplicate Attributes",
        what_it_does="Ensures that all values in a column are distinct across the table. Unlike <code>PRIMARY KEY</code>, a <code>UNIQUE</code> column allows one or more <code>NULL</code> entries in MySQL.",
        sql="ALTER TABLE Students\nADD CONSTRAINT uq_student_email UNIQUE (Email);",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Constraint 5: NOT NULL
    cards.append(make_card(
        badge="NOT NULL",
        title="5. NOT NULL Constraint — Mandatory Field Requirement",
        what_it_does="Ensures that an attribute can never store a missing or unknown NULL value. Attempting to insert a row without a name throws error 1048: <i>Column 'StudentName' cannot be null</i>.",
        sql="ALTER TABLE Students\nMODIFY COLUMN StudentName VARCHAR(50) NOT NULL;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Constraint 6: CHECK
    cards.append(make_card(
        badge="CHECK",
        title="6. CHECK Constraint — Domain Value Boundary Validation",
        what_it_does="Validates boolean domain rules on write operations. Enforces that CGPA must stay within 0.00 and 10.00 and Age must be at least 17.",
        sql="ALTER TABLE Students\nADD CONSTRAINT chk_marks_range CHECK (CGPA >= 0.00 AND CGPA <= 10.00);",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]],
        card_class="card-amber",
        status_badge="badge-amber"
    ))

    # Constraint 7: DEFAULT
    cards.append(make_card(
        badge="DEFAULT",
        title="7. DEFAULT Constraint — Automatic Fallback Values",
        what_it_does="Supplies a default value whenever an <code>INSERT</code> statement omits that specific column during row creation.",
        sql="ALTER TABLE Students\nALTER COLUMN Dept SET DEFAULT 'General';",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "0", "0", "0"]]
    ))

    # Constraint 8: Composite Primary Key
    cards.append(make_card(
        badge="COMPOSITE PK",
        title="8. Composite Primary Key — Multi-Attribute Uniqueness",
        what_it_does="Uses a combination of two or more columns together as the primary key. Prevents a student from enrolling in the exact same course more than once in a given semester.",
        sql="CREATE TABLE StudentCourseRegistrations (\n    RollNo INT,\n    CourseCode VARCHAR(10),\n    Semester INT,\n    PRIMARY KEY (RollNo, CourseCode, Semester)\n);",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.02 sec"]]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_constraints builder compiled successfully.")
