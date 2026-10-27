import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 6: NORMALIZATION (1NF, 2NF, 3NF, BCNF, 4NF)
# ==============================================================================
def build_sec_norm():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">6. Normalization — Database Design from 1NF to 5NF</h2>
  <div class="link-badges">
    <a href="https://www.geeksforgeeks.org/dbms/normal-forms-in-dbms/" target="_blank" rel="noopener" class="badge-link">GFG Normalization ↗</a>
    <a href="https://medium.com/@nkharshbachhav/normalization-in-dbms-1nf-2nf-3nf-bcnf-4cnf-5cnf-1ef07f82e39d" target="_blank" rel="noopener" class="badge-link">Medium Normal Forms ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Organizing a Messy Bedroom into Shelves</strong>
  <b>Normalization</b> is the step-by-step process of organizing database tables to eliminate redundant duplicate data and prevent three critical anomalies:
  • <b>Insertion Anomaly:</b> Inability to add a department until a student enrolls.<br/>
  • <b>Update Anomaly:</b> Having to update the HOD's phone number in 500 rows instead of 1.<br/>
  • <b>Deletion Anomaly:</b> Deleting the last student in a department accidentally erases the department itself!
</div>
'''

    # UNF to 1NF
    cards.append(make_card(
        badge="1NF",
        title="1. First Normal Form (1NF) — Enforcing Atomic (Indivisible) Values",
        what_it_does="<b>Rule:</b> Every column cell must contain a single, atomic value. No comma-separated lists, arrays, or repeating groups are allowed, and a unique Primary Key must be defined.",
        sql="-- Unnormalized Table (Violates 1NF with comma-separated phone numbers & subjects)\n-- RollNo | Name  | PhoneNumbers            | Courses\n-- 101    | Aarav | 9840112233, 9840556677  | Database, Networks\n\n-- Converted to 1NF (Atomic rows with composite primary key: RollNo, Course)\nCREATE TABLE Student_1NF (\n    RollNo INT,\n    StudentName VARCHAR(50),\n    PhoneNumber VARCHAR(15),\n    Course VARCHAR(50),\n    PRIMARY KEY (RollNo, PhoneNumber, Course)\n);",
        headers=["RollNo", "StudentName", "PhoneNumber", "Course"],
        rows=[
            [101, "Aarav", "9840112233", "Database"],
            [101, "Aarav", "9840112233", "Networks"],
            [101, "Aarav", "9840556677", "Database"],
            [101, "Aarav", "9840556677", "Networks"]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>1NF Condition:</b> Each attribute contains only atomic values, and each record is unique."
    ))

    # 1NF to 2NF
    cards.append(make_card(
        badge="2NF",
        title="2. Second Normal Form (2NF) — Removing Partial Dependencies",
        what_it_does="<b>Rule:</b> The table must be in 1NF, AND no non-prime attribute may depend on only a part of a composite candidate key. Every non-key column must depend on the <i>entire</i> primary key.",
        sql="-- In the table below with Composite PK (RollNo, CourseCode):\n-- StudentName depends ONLY on RollNo (Partial Dependency! Violates 2NF)\n-- Grade depends on BOTH (RollNo, CourseCode)\n\n-- Decomposed into two 2NF tables:\nCREATE TABLE Students (\n    RollNo INT PRIMARY KEY,\n    StudentName VARCHAR(50)\n);\n\nCREATE TABLE CourseEnrollment (\n    RollNo INT,\n    CourseCode VARCHAR(10),\n    Grade VARCHAR(2),\n    PRIMARY KEY (RollNo, CourseCode),\n    FOREIGN KEY (RollNo) REFERENCES Students(RollNo)\n);",
        headers=["Table 1: Students", "Table 2: CourseEnrollment"],
        rows=[
            ["(101, 'Aarav Sharma')", "(101, 'CS101', 'A')"],
            ["(102, 'Diya Nair')", "(102, 'EC201', 'O')"]
        ],
        extra_notes="<b>2NF Rule:</b> Table is in 1NF + No Partial Dependencies (applies when PK is composite)."
    ))

    # 2NF to 3NF
    cards.append(make_card(
        badge="3NF",
        title="3. Third Normal Form (3NF) — Removing Transitive Dependencies",
        what_it_does="<b>Rule:</b> The table must be in 2NF, AND no non-prime attribute may depend on another non-prime attribute (<code>X &rarr; Y</code> and <code>Y &rarr; Z</code> where <code>Z</code> is transitively dependent on <code>X</code>).",
        sql="-- Violating Table: RollNo (PK) -> DeptCode -> HOD_Name\n-- HOD_Name depends on DeptCode (a non-key attribute). Violates 3NF!\n\n-- Decompose into two clean 3NF tables:\nCREATE TABLE Department (\n    DeptCode VARCHAR(10) PRIMARY KEY,\n    DeptName VARCHAR(50),\n    HOD_Name VARCHAR(50)\n);\n\nCREATE TABLE Students_3NF (\n    RollNo INT PRIMARY KEY,\n    StudentName VARCHAR(50),\n    DeptCode VARCHAR(10),\n    FOREIGN KEY (DeptCode) REFERENCES Department(DeptCode)\n);",
        headers=["Department Table", "Students Table"],
        rows=[
            ["('CSE', 'Computer Science', 'Dr. Ramesh')", "(101, 'Aarav', 'CSE')"],
            ["('ECE', 'Electronics', 'Dr. Sunita')", "(102, 'Diya', 'ECE')"]
        ],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>3NF Condition:</b> Table is in 2NF + No Transitive Dependencies (every non-key depends ONLY on the Primary Key)."
    ))

    # 3NF to BCNF
    cards.append(make_card(
        badge="BCNF",
        title="4. Boyce-Codd Normal Form (BCNF) — Strict Determinant Rule",
        what_it_does="<b>Rule:</b> For every functional dependency <code>X &rarr; Y</code>, <code>X</code> must be a super key. BCNF addresses edge cases in 3NF where overlapping candidate keys exist.",
        sql="-- Scenario: (StudentID, Subject) -> Professor, but Professor -> Subject\n-- A professor teaches only ONE subject, but multiple professors teach the subject.\n-- Here Professor -> Subject, but Professor is NOT a super key! Violates BCNF.\n\n-- Decompose into two BCNF tables:\nCREATE TABLE ProfessorSubject (\n    Professor VARCHAR(50) PRIMARY KEY,\n    Subject VARCHAR(50)\n);\n\nCREATE TABLE StudentProfessor (\n    StudentID INT,\n    Professor VARCHAR(50),\n    PRIMARY KEY (StudentID, Professor),\n    FOREIGN KEY (Professor) REFERENCES ProfessorSubject(Professor)\n);",
        headers=["ProfessorSubject (BCNF)", "StudentProfessor (BCNF)"],
        rows=[
            ["('Dr. Alan', 'Algorithms')", "(101, 'Dr. Alan')"],
            ["('Dr. Grace', 'Compilers')", "(102, 'Dr. Grace')"]
        ],
        extra_notes="<b>BCNF Rule:</b> 'Every determinant must be a candidate key'."
    ))

    # BCNF to 4NF
    cards.append(make_card(
        badge="4NF",
        title="5. Fourth Normal Form (4NF) — Eliminating Multi-Valued Dependencies",
        what_it_does="<b>Rule:</b> The table must be in BCNF, AND it must contain no multi-valued dependencies (<code>X &twoheadrightarrow; Y</code>). If a student has independent sets of hobbies and spoken languages, storing them together causes Cartesian explosion.",
        sql="-- Violating Table: Student ->> Hobby and Student ->> Language (Independent!)\n-- Decompose into two independent 4NF relations:\nCREATE TABLE StudentHobbies (\n    StudentID INT,\n    Hobby VARCHAR(30),\n    PRIMARY KEY (StudentID, Hobby)\n);\n\nCREATE TABLE StudentLanguages (\n    StudentID INT,\n    Language VARCHAR(30),\n    PRIMARY KEY (StudentID, Language)\n);",
        headers=["StudentHobbies", "StudentLanguages"],
        rows=[
            ["(101, 'Cricket')", "(101, 'English')"],
            ["(101, 'Chess')", "(101, 'German')"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_norm builder compiled successfully.")
