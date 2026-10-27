import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 7: VIEWS, SYNONYMS, SEQUENCES, INDEXES
# ==============================================================================
def build_sec_objects():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">7. Views, Synonyms, Sequences, and Indexes</h2>
  <div class="link-badges">
    <a href="https://www.tutorialspoint.com/sql/sql-create-view.htm" target="_blank" rel="noopener" class="badge-link">TutorialsPoint Views ↗</a>
    <a href="https://www.geeksforgeeks.org/sql/sql-synonym/" target="_blank" rel="noopener" class="badge-link">GFG Synonym ↗</a>
    <a href="https://www.tutorialspoint.com/sql/sql-auto-increment.htm" target="_blank" rel="noopener" class="badge-link">TutorialsPoint Auto-Increment ↗</a>
    <a href="https://www.tutorialspoint.com/sql/sql-indexes.htm" target="_blank" rel="noopener" class="badge-link">TutorialsPoint Indexes ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Shortcuts, Indexes, and Number Dispensers</strong>
  • <b>View:</b> A saved virtual window showing filtered columns without duplicating table data on disk.<br/>
  • <b>Index:</b> The index at the back of a textbook that lets you jump directly to page 250 without reading page 1 to 249.<br/>
  • <b>Sequence / Auto-Increment:</b> The automatic token dispenser at a bank counter that hands out 101, 102, 103.<br/>
  • <b>Synonym:</b> A permanent alias or nickname for a complex or remote table.
</div>
'''

    # Variety 1: CREATE VIEW
    cards.append(make_card(
        badge="CREATE VIEW",
        title="1. CREATE VIEW — Creating a Security Abstraction Layer",
        what_it_does="Creates a virtual table based on a SQL query. Stores NO physical data on disk; instead, whenever the view is queried, MySQL executes the underlying SELECT statement. Perfect for hiding sensitive columns (like salary or passwords) from public users.",
        sql="CREATE VIEW StudentPublicDirectory AS\nSELECT RollNo, StudentName, Dept\nFROM Students\nWHERE Dept IS NOT NULL;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Variety 2: Querying a View
    cards.append(make_card(
        badge="QUERY VIEW",
        title="2. Querying a View with WHERE, ORDER BY, and Filtering",
        what_it_does="Views are queried with standard <code>SELECT</code> syntax just like physical tables. MySQL merges your outer query with the view's definition.",
        sql="SELECT RollNo, StudentName, Dept\nFROM StudentPublicDirectory\nWHERE Dept = 'CSE'\nORDER BY StudentName ASC;",
        headers=["RollNo", "StudentName", "Dept"],
        rows=[
            [101, "Aarav Sharma", "CSE"],
            [103, "Kabir Verma", "CSE"]
        ]
    ))

    # Variety 3: WITH CHECK OPTION
    cards.append(make_card(
        badge="CHECK OPTION",
        title="3. Updatable View with WITH CHECK OPTION — Enforcing Predicate Integrity",
        what_it_does="If an INSERT or UPDATE is performed through the view, <code>WITH CHECK OPTION</code> ensures that the modified rows continue to satisfy the view's <code>WHERE</code> condition. Attempting to insert an 'ECE' student through a 'CSE' view will be rejected with an error.",
        sql="CREATE VIEW CSE_Students_View AS\nSELECT RollNo, StudentName, Dept, CGPA\nFROM Students\nWHERE Dept = 'CSE'\nWITH CHECK OPTION;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Enforcement:</b> Inserting <code>(107, 'Maya', 'ECE', 9.0)</code> through <code>CSE_Students_View</code> throws: <i>CHECK OPTION failed</i>."
    ))

    # Variety 4: CREATE INDEX
    cards.append(make_card(
        badge="CREATE INDEX",
        title="4. CREATE INDEX — B-Tree Index for High-Speed Lookups",
        what_it_does="Creates an ordered B-Tree index structure on <code>StudentName</code>. Changes full table scans (O(N) search complexity) into rapid logarithmic lookups (O(log N)).",
        sql="CREATE INDEX idx_student_name ON Students(StudentName);",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "6", "0", "0"]]
    ))

    # Variety 5: EXPLAIN Query Plan
    cards.append(make_card(
        badge="EXPLAIN",
        title="5. EXPLAIN — Verifying Query Optimization & Index Usage",
        what_it_does="Prefixing a query with <code>EXPLAIN</code> reveals how the MySQL query optimizer executes it. Shows whether an index was picked (<code>key: idx_student_name</code>) and how many rows were examined.",
        sql="EXPLAIN SELECT * FROM Students WHERE StudentName = 'Aarav Sharma';",
        headers=["id", "select_type", "table", "type", "possible_keys", "key", "rows", "Extra"],
        rows=[
            [1, "SIMPLE", "Students", "ref", "idx_student_name", "idx_student_name", 1, "Using where"]
        ],
        extra_notes="<b>Optimization Proof:</b> <code>rows: 1</code> confirms the engine jumped directly to the exact row without scanning other records!"
    ))

    # Variety 6: Composite Index
    cards.append(make_card(
        badge="COMPOSITE INDEX",
        title="6. Composite Multi-Column Index — Leftmost Prefix Rule",
        what_it_does="Creates a composite index spanning two columns: <code>(Dept, CGPA)</code>. Accelerates queries filtering by <code>Dept</code> alone OR by <code>Dept</code> and <code>CGPA</code> together.",
        sql="CREATE INDEX idx_dept_cgpa ON Students(Dept, CGPA);",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "0 rows affected", "6", "0", "0"]]
    ))

    # Variety 7: AUTO_INCREMENT Sequence
    cards.append(make_card(
        badge="AUTO_INCREMENT",
        title="7. Sequences / AUTO_INCREMENT — Custom Seed & LAST_INSERT_ID()",
        what_it_does="In MySQL, sequences are implemented via the <code>AUTO_INCREMENT</code> table attribute. You can customize the starting seed value and retrieve the most recently generated ID using <code>LAST_INSERT_ID()</code>.",
        sql="-- Configure the starting sequence counter to 5001\nALTER TABLE Students AUTO_INCREMENT = 5001;\n\n-- Retrieve the auto-generated primary key from the current session\nSELECT LAST_INSERT_ID() AS last_generated_id;",
        headers=["last_generated_id"],
        rows=[[5001]]
    ))

    # Variety 8: SYNONYMS in SQL
    cards.append(make_card(
        badge="SYNONYM",
        title="8. Database Synonyms — Purpose, Oracle Syntax & MySQL Equivalent",
        what_it_does="A <b>Synonym</b> is a permanent alias for a table, view, or sequence, masking the underlying physical table location. In Oracle/PostgreSQL it is created with <code>CREATE SYNONYM</code>. In MySQL, the exact equivalent is accomplished using a <b>1-to-1 View</b> or query table aliases.",
        sql="-- Oracle / SQL Server Standard Syntax:\n-- CREATE SYNONYM ActiveStudents FOR CollegeDB.Prod.Students;\n\n-- MySQL Industry-Standard Equivalent (using View):\nCREATE VIEW ActiveStudents AS SELECT * FROM Students;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]],
        extra_notes="<b>Viva Tip:</b> If asked 'Does MySQL support CREATE SYNONYM?', answer: 'Not natively as a keyword, but MySQL achieves the exact same architectural abstraction using 1-to-1 Views or table aliases'."
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_objects builder compiled successfully.")
