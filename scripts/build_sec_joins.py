import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 3: ALL SQL JOINS
# ==============================================================================
def build_sec_joins():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">3. All SQL JOINS — Complete Relational Guide</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_join.asp" target="_blank" rel="noopener" class="badge-link">W3Schools JOINS ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Matching Name Tags at a Conference</strong>
  You have a list of Attendees (Students) and a list of Reserved Tables (Departments).
  <b>INNER JOIN</b>: Only people who have a reserved table (everyone else sits out).
  <b>LEFT JOIN</b>: Everyone on the attendee list, whether they have a table or not.
  <b>RIGHT JOIN</b>: Every reserved table, even if some tables are completely empty.
  <b>FULL OUTER JOIN</b>: Everyone and every table combined.
</div>

<div class="callout callout-green">
  <b>Relational Setup Tables for Join Demonstrations</b><br/>
  <b>Table A: <code>Students</code></b> (RollNo, StudentName, DeptID)<br/>
  • (101, 'Aarav', 1), (102, 'Diya', 2), (103, 'Kabir', 1), (104, 'Meera', NULL)<br/>
  <b>Table B: <code>Departments</code></b> (DeptID, DeptName, Building)<br/>
  • (1, 'CSE', 'Block A'), (2, 'ECE', 'Block B'), (3, 'Civil', 'Block C')<br/>
  <i>Notice: Meera has no department (DeptID is NULL), and Civil has no students!</i>
</div>
'''

    # Variety 1: INNER JOIN
    cards.append(make_card(
        badge="INNER JOIN",
        title="1. INNER JOIN — Exact Matches Across Both Tables",
        what_it_does="Returns only rows where the join condition matches in BOTH tables. Excludes Meera (who has no DeptID) and excludes Civil (which has no enrolled students).",
        sql="SELECT s.RollNo, s.StudentName, d.DeptName, d.Building\nFROM Students s\nINNER JOIN Departments d ON s.DeptID = d.DeptID;",
        headers=["RollNo", "StudentName", "DeptName", "Building"],
        rows=[
            [101, "Aarav", "CSE", "Block A"],
            [102, "Diya", "ECE", "Block B"],
            [103, "Kabir", "CSE", "Block A"]
        ],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Variety 2: LEFT JOIN
    cards.append(make_card(
        badge="LEFT JOIN",
        title="2. LEFT (OUTER) JOIN — All Left Rows + Matching Right Rows",
        what_it_does="Returns ALL rows from the left table (<code>Students</code>). If a student has no corresponding department, the department columns are populated with <code>NULL</code>.",
        sql="SELECT s.RollNo, s.StudentName, d.DeptName, d.Building\nFROM Students s\nLEFT JOIN Departments d ON s.DeptID = d.DeptID;",
        headers=["RollNo", "StudentName", "DeptName", "Building"],
        rows=[
            [101, "Aarav", "CSE", "Block A"],
            [102, "Diya", "ECE", "Block B"],
            [103, "Kabir", "CSE", "Block A"],
            [104, "Meera", "NULL", "NULL"]
        ]
    ))

    # Variety 3: RIGHT JOIN
    cards.append(make_card(
        badge="RIGHT JOIN",
        title="3. RIGHT (OUTER) JOIN — All Right Rows + Matching Left Rows",
        what_it_does="Returns ALL rows from the right table (<code>Departments</code>). If a department has no enrolled students (like Civil), student columns return <code>NULL</code>.",
        sql="SELECT s.StudentName, d.DeptID, d.DeptName, d.Building\nFROM Students s\nRIGHT JOIN Departments d ON s.DeptID = d.DeptID;",
        headers=["StudentName", "DeptID", "DeptName", "Building"],
        rows=[
            ["Aarav", 1, "CSE", "Block A"],
            ["Kabir", 1, "CSE", "Block A"],
            ["Diya", 2, "ECE", "Block B"],
            ["NULL", 3, "Civil", "Block C"]
        ]
    ))

    # Variety 4: FULL OUTER JOIN (UNION Simulation)
    cards.append(make_card(
        badge="FULL OUTER JOIN",
        title="4. FULL OUTER JOIN (MySQL Emulation using UNION)",
        what_it_does="MySQL does not natively support the <code>FULL OUTER JOIN</code> keyword. In exams and MySQL environments, you simulate it by taking the <code>UNION</code> of a <code>LEFT JOIN</code> and a <code>RIGHT JOIN</code>.",
        sql="SELECT s.StudentName, d.DeptName\nFROM Students s\nLEFT JOIN Departments d ON s.DeptID = d.DeptID\nUNION\nSELECT s.StudentName, d.DeptName\nFROM Students s\nRIGHT JOIN Departments d ON s.DeptID = d.DeptID;",
        headers=["StudentName", "DeptName"],
        rows=[
            ["Aarav", "CSE"],
            ["Diya", "ECE"],
            ["Kabir", "CSE"],
            ["Meera", "NULL"],
            ["NULL", "Civil"]
        ],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Top Viva Question:</b> 'How do you perform a FULL OUTER JOIN in MySQL?' Answer: 'Combine LEFT JOIN and RIGHT JOIN with UNION'."
    ))

    # Variety 5: CROSS JOIN
    cards.append(make_card(
        badge="CROSS JOIN",
        title="5. CROSS JOIN — Cartesian Product (M × N Combinations)",
        what_it_does="Pairs every single student with every single department without an ON condition. If Students has 4 rows and Departments has 3 rows, CROSS JOIN produces exactly 4 &times; 3 = 12 rows.",
        sql="SELECT s.StudentName, d.DeptName\nFROM Students s\nCROSS JOIN Departments d\nLIMIT 6;",
        headers=["StudentName", "DeptName"],
        rows=[
            ["Aarav", "CSE"],
            ["Aarav", "ECE"],
            ["Aarav", "Civil"],
            ["Diya", "CSE"],
            ["Diya", "ECE"],
            ["Diya", "Civil"]
        ]
    ))

    # Variety 6: SELF JOIN
    cards.append(make_card(
        badge="SELF JOIN",
        title="6. SELF JOIN — Table Joined with Itself (Student-Mentor Hierarchy)",
        what_it_does="Joins two instances of the same table using aliases (<code>s</code> for Student and <code>m</code> for Senior Mentor) based on <code>s.MentorID = m.RollNo</code>.",
        sql="SELECT s.StudentName AS Student,\n       IFNULL(m.StudentName, 'No Mentor Assigned') AS Mentor\nFROM Students s\nLEFT JOIN Students m ON s.MentorID = m.RollNo;",
        headers=["Student", "Mentor"],
        rows=[
            ["Aarav", "Diya"],
            ["Diya", "No Mentor Assigned"],
            ["Kabir", "Aarav"],
            ["Meera", "Diya"]
        ]
    ))

    # Variety 7: LEFT ANTI-JOIN
    cards.append(make_card(
        badge="ANTI-JOIN",
        title="7. LEFT ANTI-JOIN — Finding Orphan Rows Without Matches",
        what_it_does="Combines a <code>LEFT JOIN</code> with <code>WHERE right.Key IS NULL</code> to find records in the first table that have NO corresponding entry in the second table (e.g. students not enrolled in any department).",
        sql="SELECT s.RollNo, s.StudentName\nFROM Students s\nLEFT JOIN Departments d ON s.DeptID = d.DeptID\nWHERE d.DeptID IS NULL;",
        headers=["RollNo", "StudentName"],
        rows=[[104, "Meera"]]
    ))

    # Variety 8: NATURAL JOIN
    cards.append(make_card(
        badge="NATURAL JOIN",
        title="8. NATURAL JOIN — Implicit Equi-Join on Identical Column Names",
        what_it_does="Automatically joins two tables based on all columns having the exact same name and compatible data types across both tables (here, <code>DeptID</code>).",
        sql="SELECT RollNo, StudentName, DeptName\nFROM Students\nNATURAL JOIN Departments;",
        headers=["RollNo", "StudentName", "DeptName"],
        rows=[
            [101, "Aarav", "CSE"],
            [102, "Diya", "ECE"],
            [103, "Kabir", "CSE"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_joins builder compiled successfully.")
