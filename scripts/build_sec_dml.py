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
        title="1. Insert a Single Row with Explicit Column Names (Industry Best Practice)",
        what_it_does="Inserts one complete record by explicitly naming each destination column. This is the safest method because future schema modifications (such as adding or reordering columns) will never break your insert scripts.",
        sql="INSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate)\nVALUES (101, 'Aarav Sharma', 'CSE', 8.95, '2024-08-01');",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "1 row affected", "0.01 sec"]],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Table State After Command:</b> Row (101, 'Aarav Sharma', 'CSE', 8.95, '2024-08-01') is persisted to storage."
    ))

    # Variety 2: Insert Single Row Positional
    cards.append(make_card(
        badge="INSERT POSITIONAL",
        title="2. Insert a Single Row without Column List (Positional Insert)",
        what_it_does="Inserts values in the exact physical order that columns were defined during <code>CREATE TABLE</code>. Faster to type in lab exams, but fragile in production systems if table schema changes.",
        sql="INSERT INTO Students\nVALUES (102, 'Diya Nair', 'ECE', 9.40, '2024-08-01');",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "1 row affected", "0.01 sec"]]
    ))

    # Variety 3: Bulk Multi-Row Insert
    cards.append(make_card(
        badge="BULK INSERT",
        title="3. Insert Multiple Rows at Once (High-Performance Bulk Insert)",
        what_it_does="Inserts multiple tuples using a single comma-separated <code>VALUES</code> list. This executes in a single transaction commit, reducing disk I/O overhead by up to 10x compared to separate single inserts.",
        sql="INSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate) VALUES\n(103, 'Kabir Verma', 'CSE', 7.60, '2024-08-02'),\n(104, 'Meera Iyer', 'MECH', 6.80, '2024-08-03'),\n(105, 'Rohan Das', 'ECE', 8.15, '2024-08-03');",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "3 rows affected", "3", "0", "0"]],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Variety 4: Insert with NULL / Default
    cards.append(make_card(
        badge="INSERT NULL",
        title="4. Insert Row with Missing Optional Data (NULL / Default Handling)",
        what_it_does="Omits optional columns from the column list, or explicitly passes <code>NULL</code>. The database fills omitted columns with their specified <code>DEFAULT</code> constraint value or sets them to <code>NULL</code>.",
        sql="-- Sneha joined before receiving her first semester CGPA\nINSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate)\nVALUES (106, 'Sneha Patel', 'IT', NULL, '2024-08-04');",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "1 row affected", "0.01 sec"]]
    ))

    # Variety 5: INSERT INTO ... SELECT
    cards.append(make_card(
        badge="INSERT SELECT",
        title="5. Insert Data from Another Table (Table Copy / Migration)",
        what_it_does="Extracts filtered data from an existing table and immediately writes it into another archive or backup table. Eliminates manual exports/imports.",
        sql="INSERT INTO Students_Archive (RollNo, StudentName, Dept, CGPA, JoinDate)\nSELECT RollNo, StudentName, Dept, CGPA, JoinDate\nFROM Students\nWHERE CGPA < 7.00;",
        headers=["Query Status", "Rows Affected", "Records", "Duplicates", "Warnings"],
        rows=[["Query OK", "1 row affected", "1", "0", "0"]],
        extra_notes="<b>Archived Row:</b> Meera Iyer (MECH, 6.80) was copied into <code>Students_Archive</code>."
    ))

    # Variety 6: Single-Column UPDATE
    cards.append(make_card(
        badge="UPDATE SINGLE",
        title="6. Update a Single Column of a Specific Row",
        what_it_does="Modifies the value of one column for records satisfying the <code>WHERE</code> condition. Always specify the Primary Key in the <code>WHERE</code> clause when targeting a single row.",
        sql="UPDATE Students\nSET CGPA = 9.10\nWHERE RollNo = 101;",
        headers=["Query Status", "Rows Matched", "Changed", "Warnings"],
        rows=[["Query OK", "1", "1", "0"]],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Result:</b> Aarav Sharma's CGPA was updated from 8.95 to 9.10."
    ))

    # Variety 7: Multi-Column UPDATE
    cards.append(make_card(
        badge="UPDATE MULTI",
        title="7. Update Multiple Columns Simultaneously",
        what_it_does="Applies changes across multiple attributes in a single statement by separating assignments with commas. Ideal for department transfers with grade conversions.",
        sql="UPDATE Students\nSET Dept = 'CSE', CGPA = 8.50\nWHERE RollNo = 105;",
        headers=["Query Status", "Rows Matched", "Changed", "Warnings"],
        rows=[["Query OK", "1", "1", "0"]],
        extra_notes="<b>Result:</b> Rohan Das transferred to 'CSE' and had his CGPA adjusted to 8.50."
    ))

    # Variety 8: Computed UPDATE
    cards.append(make_card(
        badge="COMPUTED UPDATE",
        title="8. Update Using an Arithmetic Expression (Percentage Grace Boost)",
        what_it_does="Reads the existing column value, applies a mathematical calculation (here a 5% bonus multiplier), rounds it, and writes back the computed result for all eligible records.",
        sql="UPDATE Students\nSET CGPA = ROUND(CGPA * 1.05, 2)\nWHERE Dept = 'ECE';",
        headers=["Query Status", "Rows Matched", "Changed", "Warnings"],
        rows=[["Query OK", "1", "1", "0"]],
        extra_notes="<b>Result:</b> Diya Nair's CGPA increased from 9.40 to 9.87."
    ))

    # Variety 9: DELETE Specific Row
    cards.append(make_card(
        badge="DELETE ROW",
        title="9. Delete a Specific Record by Primary Key",
        what_it_does="Removes exactly one targeted tuple from the table based on its unique Primary Key. <b>Caution:</b> If you forget the <code>WHERE</code> clause, EVERY row in the table will be deleted!",
        sql="DELETE FROM Students\nWHERE RollNo = 106;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "1 row affected", "0.01 sec"]],
        extra_notes="<b>Result:</b> Sneha Patel (RollNo 106) was removed from the active student table."
    ))

    # Variety 10: DELETE Conditional
    cards.append(make_card(
        badge="DELETE CONDITION",
        title="10. Delete Records Matching Multiple Criteria",
        what_it_does="Combines logical operators (<code>AND</code>, <code>OR</code>) to purge rows matching complex criteria.",
        sql="DELETE FROM Students\nWHERE Dept = 'MECH' AND CGPA < 7.00;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "1 row affected", "0.01 sec"]]
    ))

    # Variety 11: DELETE IN list
    cards.append(make_card(
        badge="DELETE IN",
        title="11. Delete Records with an IN Membership Condition",
        what_it_does="Removes all rows whose column matches any element in the specified value list. Very useful for bulk cleanup by category or department codes.",
        sql="DELETE FROM Students\nWHERE Dept IN ('CIVIL', 'CHEM', 'BIOTECH');",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.00 sec"]]
    ))

    # Comparative Matrix
    comparison = '''<div class="callout callout-amber" style="margin-top: 2rem;">
  <b>Exam & Viva Master Matrix: DELETE vs TRUNCATE vs DROP</b>
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

print("sec_dml builder compiled successfully.")
