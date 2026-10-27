import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 1B: DML (DATA MANIPULATION LANGUAGE)
# ==============================================================================
def build_sec_dml():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">1B. DML (Data Manipulation Language) — Insert, Update, Delete</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_insert.asp" target="_blank" rel="noopener" class="badge-link">W3Schools INSERT ↗</a>
    <a href="https://www.w3schools.com/sql/sql_update.asp" target="_blank" rel="noopener" class="badge-link">W3Schools UPDATE ↗</a>
    <a href="https://www.w3schools.com/sql/sql_delete.asp" target="_blank" rel="noopener" class="badge-link">W3Schools DELETE ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Putting Clothes in the Closet</strong>
  If DDL builds the physical wooden closet and its shelves, <b>DML</b> is how you handle the clothes inside:
  <b>INSERT</b> places fresh clothes into the closet.
  <b>UPDATE</b> irons or mends existing clothes.
  <b>DELETE</b> throws away old clothes you no longer wear.
</div>
'''

    # Variety 1: Insert Single Row Explicit
    cards.append(make_card(
        badge="INSERT EXPLICIT",
        title="1. Insert a Single Row with Explicit Column Names (Safest Method)",
        what_it_does="Inserts one complete record by explicitly naming each destination column. Prevents schema-drift errors if table columns are reordered or added in the future.",
        sql="INSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate)\nVALUES (101, 'Aarav Sharma', 'CSE', 8.95, '2024-08-01');",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "8.95", "2024-08-01"]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Data State:</b> Table now contains 1 row. Aarav Sharma is persisted with RollNo 101."
    ))

    # Variety 2: Insert Single Row Positional
    cards.append(make_card(
        badge="INSERT POSITIONAL",
        title="2. Insert a Single Row without Column List (Positional Insert)",
        what_it_does="Inserts values matching the exact physical column order of the table definition. Common in lab exams for rapid entry.",
        sql="INSERT INTO Students\nVALUES (102, 'Diya Nair', 'ECE', 9.40, '2024-08-01');",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "8.95", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.40", "2024-08-01"]
        ],
        extra_notes="<b>Data State:</b> Table now contains 2 rows. Diya Nair has been added."
    ))

    # Variety 3: Bulk Multi-Row Insert
    cards.append(make_card(
        badge="BULK INSERT",
        title="3. Insert Multiple Rows at Once (High-Performance Bulk Insert)",
        what_it_does="Inserts 3 student tuples in a single statement. Executes within a single transaction commit, reducing disk I/O overhead by up to 10x.",
        sql="INSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate) VALUES\n(103, 'Kabir Verma', 'CSE', 7.60, '2024-08-02'),\n(104, 'Meera Iyer', 'MECH', 6.80, '2024-08-03'),\n(105, 'Rohan Das', 'ECE', 8.15, '2024-08-03');",
        status_line="Query OK, 3 rows affected (0.01 sec) | Records: 3  Duplicates: 0  Warnings: 0",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "8.95", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.40", "2024-08-01"],
            [103, "Kabir Verma", "CSE", "7.60", "2024-08-02"],
            [104, "Meera Iyer", "MECH", "6.80", "2024-08-03"],
            [105, "Rohan Das", "ECE", "8.15", "2024-08-03"]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Data State:</b> Table now contains 5 rows."
    ))

    # Variety 4: Insert with NULL / Default
    cards.append(make_card(
        badge="INSERT NULL",
        title="4. Insert Row with Missing Optional Data (Explicit NULL)",
        what_it_does="Inserts a student record where the CGPA has not yet been awarded. Passing <code>NULL</code> explicitly indicates unknown/unassigned state.",
        sql="INSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate)\nVALUES (106, 'Sneha Patel', 'IT', NULL, '2024-08-04');",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "8.95", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.40", "2024-08-01"],
            [103, "Kabir Verma", "CSE", "7.60", "2024-08-02"],
            [104, "Meera Iyer", "MECH", "6.80", "2024-08-03"],
            [105, "Rohan Das", "ECE", "8.15", "2024-08-03"],
            [106, "Sneha Patel", "IT", "NULL", "2024-08-04"]
        ],
        extra_notes="<b>Data State:</b> Table now contains 6 rows. Notice Sneha Patel's CGPA is stored as <code>NULL</code>."
    ))

    # Variety 5: INSERT INTO ... SELECT
    cards.append(make_card(
        badge="INSERT SELECT",
        title="5. Insert Data from Another Table (Table Copy / Migration)",
        what_it_does="Extracts filtered data directly from the active table and inserts it into a separate historical archive table in a single atomic step.",
        sql="-- Archive students with CGPA < 7.00\nINSERT INTO Students_Archive (RollNo, StudentName, Dept, CGPA, JoinDate)\nSELECT RollNo, StudentName, Dept, CGPA, JoinDate\nFROM Students\nWHERE CGPA < 7.00;",
        status_line="Query OK, 1 row affected (0.01 sec) | Records: 1  Duplicates: 0  Warnings: 0",
        output_title="Archived Table State (SELECT * FROM Students_Archive):",
        headers=["RollNo", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [104, "Meera Iyer", "MECH", "6.80", "2024-08-03"]
        ],
        extra_notes="<b>Migration Effect:</b> Meera Iyer's record was duplicated into <code>Students_Archive</code>."
    ))

    # Variety 6: Single-Column UPDATE
    cards.append(make_card(
        badge="UPDATE SINGLE",
        title="6. Update a Single Column of a Specific Row",
        what_it_does="Modifies the CGPA for student 101 (Aarav Sharma) from 8.95 to 9.10 without disturbing any other student.",
        sql="UPDATE Students\nSET CGPA = 9.10\nWHERE RollNo = 101;",
        status_line="Query OK, 1 row affected (0.01 sec) | Rows matched: 1  Changed: 1  Warnings: 0",
        output_title="Resulting Table State (SELECT * FROM Students WHERE RollNo = 101):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA (Updated)", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "9.10", "2024-08-01"]
        ],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Before:</b> CGPA was 8.95 &rarr; <b>After:</b> CGPA is now 9.10."
    ))

    # Variety 7: Multi-Column UPDATE
    cards.append(make_card(
        badge="UPDATE MULTI",
        title="7. Update Multiple Columns Simultaneously",
        what_it_does="Updates both department and CGPA for student 105 (Rohan Das) in a single statement using a comma-separated SET list.",
        sql="UPDATE Students\nSET Dept = 'CSE', CGPA = 8.50\nWHERE RollNo = 105;",
        status_line="Query OK, 1 row affected (0.01 sec) | Rows matched: 1  Changed: 1  Warnings: 0",
        output_title="Resulting Table State (SELECT * FROM Students WHERE RollNo = 105):",
        headers=["RollNo (PK)", "StudentName", "Dept (Transferred)", "CGPA (Updated)", "JoinDate"],
        rows=[
            [105, "Rohan Das", "CSE", "8.50", "2024-08-03"]
        ],
        extra_notes="<b>Before:</b> Dept: ECE, CGPA: 8.15 &rarr; <b>After:</b> Dept: CSE, CGPA: 8.50."
    ))

    # Variety 8: Computed UPDATE
    cards.append(make_card(
        badge="COMPUTED UPDATE",
        title="8. Update Using an Arithmetic Expression (Percentage Grace Boost)",
        what_it_does="Calculates a 5% bonus multiplier on existing scores for all students in the ECE department and rounds the result to 2 decimals.",
        sql="UPDATE Students\nSET CGPA = ROUND(CGPA * 1.05, 2)\nWHERE Dept = 'ECE';",
        status_line="Query OK, 1 row affected (0.01 sec) | Rows matched: 1  Changed: 1  Warnings: 0",
        output_title="Resulting Table State (SELECT RollNo, StudentName, Dept, CGPA FROM Students WHERE Dept = 'ECE'):",
        headers=["RollNo", "StudentName", "Dept", "CGPA (5% Boosted)"],
        rows=[
            [102, "Diya Nair", "ECE", "9.87"]
        ],
        extra_notes="<b>Calculation:</b> 9.40 &times; 1.05 = 9.87. Diya Nair's grade was boosted."
    ))

    # Variety 9: DELETE Specific Row
    cards.append(make_card(
        badge="DELETE ROW",
        title="9. Delete a Specific Record by Primary Key",
        what_it_does="Removes exactly one targeted student (Sneha Patel, RollNo 106) from the active table.",
        sql="DELETE FROM Students\nWHERE RollNo = 106;",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "9.10", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.87", "2024-08-01"],
            [103, "Kabir Verma", "CSE", "7.60", "2024-08-02"],
            [104, "Meera Iyer", "MECH", "6.80", "2024-08-03"],
            [105, "Rohan Das", "CSE", "8.50", "2024-08-03"]
        ],
        extra_notes="<b>Verification:</b> Sneha Patel (RollNo 106) has been permanently deleted from the table."
    ))

    # Variety 10: DELETE Conditional
    cards.append(make_card(
        badge="DELETE CONDITION",
        title="10. Delete Records Matching Multiple Criteria",
        what_it_does="Deletes student records that satisfy both criteria: Dept = 'MECH' AND CGPA &lt; 7.00.",
        sql="DELETE FROM Students\nWHERE Dept = 'MECH' AND CGPA < 7.00;",
        status_line="Query OK, 1 row affected (0.01 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "9.10", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.87", "2024-08-01"],
            [103, "Kabir Verma", "CSE", "7.60", "2024-08-02"],
            [105, "Rohan Das", "CSE", "8.50", "2024-08-03"]
        ],
        extra_notes="<b>Verification:</b> Meera Iyer (104, MECH, 6.80) was deleted. 4 students remain."
    ))

    # Variety 11: DELETE IN list
    cards.append(make_card(
        badge="DELETE IN",
        title="11. Delete Records with an IN Membership Condition",
        what_it_does="Attempts to remove all rows matching departments ('CIVIL', 'CHEM'). Demonstrates safe behavior when no rows match criteria.",
        sql="DELETE FROM Students\nWHERE Dept IN ('CIVIL', 'CHEM');",
        status_line="Query OK, 0 rows affected (0.00 sec)",
        output_title="Resulting Table State (SELECT * FROM Students):",
        headers=["RollNo (PK)", "StudentName", "Dept", "CGPA", "JoinDate"],
        rows=[
            [101, "Aarav Sharma", "CSE", "9.10", "2024-08-01"],
            [102, "Diya Nair", "ECE", "9.87", "2024-08-01"],
            [103, "Kabir Verma", "CSE", "7.60", "2024-08-02"],
            [105, "Rohan Das", "CSE", "8.50", "2024-08-03"]
        ],
        extra_notes="<b>Result:</b> 0 rows matched; all existing students remain completely intact."
    ))

    # Comparative Matrix
    comparison = '''<div class="callout callout-amber" style="margin-top: 2rem;">
  <b>Exam &amp; Viva Master Matrix: DELETE vs TRUNCATE vs DROP</b>
</div>
<table class="output-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>DELETE (DML)</th>
      <th>TRUNCATE (DDL)</th>
      <th>DROP (DDL)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Command Type</b></td>
      <td>DML (Data Manipulation)</td>
      <td>DDL (Data Definition)</td>
      <td>DDL (Data Definition)</td>
    </tr>
    <tr>
      <td><b>WHERE Clause</b></td>
      <td>Allowed (filters rows)</td>
      <td>Not Allowed (wipes entire table)</td>
      <td>Not Allowed</td>
    </tr>
    <tr>
      <td><b>Rollback (TCL)</b></td>
      <td>Can be rolled back if in transaction</td>
      <td>Cannot be rolled back (Implicit Commit)</td>
      <td>Cannot be rolled back (Implicit Commit)</td>
    </tr>
    <tr>
      <td><b>Triggers Fired</b></td>
      <td>Fires <code>BEFORE/AFTER DELETE</code> triggers</td>
      <td>Does NOT fire any triggers</td>
      <td>Does NOT fire any triggers</td>
    </tr>
    <tr>
      <td><b>Auto-Increment</b></td>
      <td>Does NOT reset counter</td>
      <td><b>Resets counter back to 1</b></td>
      <td>Table deleted completely</td>
    </tr>
    <tr>
      <td><b>Execution Speed</b></td>
      <td>Slow (logs every row in undo log)</td>
      <td>Very Fast (deallocates storage pages)</td>
      <td>Instant (removes table from catalog)</td>
    </tr>
  </tbody>
</table>'''

    return intro + "\n" + "\n".join(cards) + "\n" + comparison

print("sec_dml builder compiled with detailed resulting data tables.")
