import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 5: NESTED QUERIES (SUBQUERIES)
# ==============================================================================
def build_sec_nested():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">5. Nested Queries / Subqueries — Inner &amp; Correlated Queries</h2>
  <div class="link-badges">
    <a href="https://www.geeksforgeeks.org/sql/nested-queries-in-sql/" target="_blank" rel="noopener" class="badge-link">GFG Nested Queries ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Asking a Question to Answer a Question</strong>
  Suppose you want to find all students who scored above the class average. First, you have to ask: <i>"What IS the class average?"</i> (Inner Query). Once the inner query gives you <code>8.18</code>, the outer query answers: <i>"Now give me all students with CGPA &gt; 8.18."</i>
</div>
'''

    # Variety 1: Single-Row Subquery in WHERE
    cards.append(make_card(
        badge="SINGLE-ROW",
        title="1. Single-Row Subquery with Comparison Operator (Above Average Scorers)",
        what_it_does="The inner query executes first, returning a single scalar value (the average CGPA of 8.18). The outer query then compares each student's CGPA against this scalar.",
        sql="SELECT RollNo, StudentName, Dept, CGPA\nFROM Students\nWHERE CGPA > (SELECT AVG(CGPA) FROM Students);",
        headers=["RollNo", "StudentName", "Dept", "CGPA"],
        rows=[
            [101, "Aarav Sharma", "CSE", "8.95"],
            [102, "Diya Nair", "ECE", "9.40"]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Inner Result:</b> <code>SELECT AVG(CGPA) FROM Students;</code> evaluates to <code>8.18</code>."
    ))

    # Variety 2: Multi-Row Subquery with IN
    cards.append(make_card(
        badge="MULTI-ROW IN",
        title="2. Multi-Row Subquery with IN — Matching a Result List",
        what_it_does="The inner query returns a list of department IDs located in 'Tech Block A'. The outer query returns all students who belong to ANY department in that returned list.",
        sql="SELECT RollNo, StudentName, DeptID\nFROM Students\nWHERE DeptID IN (\n    SELECT DeptID FROM Departments WHERE Building = 'Tech Block A'\n);",
        headers=["RollNo", "StudentName", "DeptID"],
        rows=[
            [101, "Aarav Sharma", 1],
            [103, "Kabir Verma", 1]
        ]
    ))

    # Variety 3: Multi-Row Subquery with NOT IN
    cards.append(make_card(
        badge="MULTI-ROW NOT IN",
        title="3. Multi-Row Subquery with NOT IN — Excluding a Category",
        what_it_does="Retrieves students whose department is NOT in the list of non-engineering or humanities blocks.",
        sql="SELECT StudentName, DeptID\nFROM Students\nWHERE DeptID NOT IN (\n    SELECT DeptID FROM Departments WHERE Building = 'Annex B'\n);",
        headers=["StudentName", "DeptID"],
        rows=[
            ["Aarav Sharma", 1],
            ["Diya Nair", 2],
            ["Kabir Verma", 1]
        ]
    ))

    # Variety 4: Multi-Row with ANY / SOME
    cards.append(make_card(
        badge="OPERATOR ANY",
        title="4. Multi-Row Subquery with > ANY (Greater than At Least One)",
        what_it_does="Evaluates to true if the student's CGPA is greater than <b>at least one</b> student from the MECH department. (Equivalent to greater than the MIN of MECH).",
        sql="SELECT StudentName, Dept, CGPA\nFROM Students\nWHERE CGPA > ANY (\n    SELECT CGPA FROM Students WHERE Dept = 'MECH'\n);",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[
            ["Aarav Sharma", "CSE", "8.95"],
            ["Diya Nair", "ECE", "9.40"],
            ["Kabir Verma", "CSE", "7.60"],
            ["Rohan Das", "ECE", "8.15"]
        ]
    ))

    # Variety 5: Multi-Row with ALL
    cards.append(make_card(
        badge="OPERATOR ALL",
        title="5. Multi-Row Subquery with >= ALL (Greater than Every Single One)",
        what_it_does="Evaluates to true only if the student's CGPA is greater than or equal to <b>all</b> students from the CSE department (equivalent to greater than MAX of CSE).",
        sql="SELECT StudentName, Dept, CGPA\nFROM Students\nWHERE CGPA >= ALL (\n    SELECT CGPA FROM Students WHERE Dept = 'CSE'\n);",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[
            ["Diya Nair", "ECE", "9.40"]
        ]
    ))

    # Variety 6: Correlated Subquery with EXISTS
    cards.append(make_card(
        badge="EXISTS",
        title="6. Correlated Subquery with EXISTS — Row-by-Row Dependency",
        what_it_does="A correlated subquery references columns from the outer query (<code>d.DeptID = s.DeptID</code>). It is re-evaluated for each department. <code>EXISTS</code> returns true as soon as the first matching student is found (short-circuit evaluation).",
        sql="SELECT d.DeptID, d.DeptName\nFROM Departments d\nWHERE EXISTS (\n    SELECT 1 FROM Students s WHERE s.DeptID = d.DeptID\n);",
        headers=["DeptID", "DeptName"],
        rows=[
            [1, "CSE"],
            [2, "ECE"]
        ],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>High Performance:</b> <code>EXISTS</code> stops scanning the table immediately when the first match is found."
    ))

    # Variety 7: Correlated Subquery with NOT EXISTS
    cards.append(make_card(
        badge="NOT EXISTS",
        title="7. Correlated Subquery with NOT EXISTS — Finding Empty Departments",
        what_it_does="Returns departments that have zero enrolled students.",
        sql="SELECT d.DeptID, d.DeptName\nFROM Departments d\nWHERE NOT EXISTS (\n    SELECT 1 FROM Students s WHERE s.DeptID = d.DeptID\n);",
        headers=["DeptID", "DeptName"],
        rows=[
            [3, "Civil"]
        ]
    ))

    # Variety 8: Scalar Subquery in SELECT
    cards.append(make_card(
        badge="SELECT SUBQUERY",
        title="8. Scalar Subquery in SELECT Clause — Inlining Class Benchmarks",
        what_it_does="Computes an aggregate benchmark in the <code>SELECT</code> projection, placing the overall college average beside each individual student's score for immediate variance comparison.",
        sql="SELECT StudentName,\n       CGPA,\n       (SELECT ROUND(AVG(CGPA), 2) FROM Students) AS CollegeAvg,\n       ROUND(CGPA - (SELECT AVG(CGPA) FROM Students), 2) AS VarianceFromAvg\nFROM Students\nWHERE CGPA IS NOT NULL;",
        headers=["StudentName", "CGPA", "CollegeAvg", "VarianceFromAvg"],
        rows=[
            ["Aarav Sharma", "8.95", "8.18", "+0.77"],
            ["Diya Nair", "9.40", "8.18", "+1.22"],
            ["Kabir Verma", "7.60", "8.18", "-0.58"],
            ["Meera Iyer", "6.80", "8.18", "-1.38"],
            ["Rohan Das", "8.15", "8.18", "-0.03"]
        ]
    ))

    # Variety 9: Derived Table in FROM Clause
    cards.append(make_card(
        badge="DERIVED TABLE",
        title="9. Derived Table in FROM Clause (Subquery as Temporary Table)",
        what_it_does="Places a subquery in the <code>FROM</code> clause. MySQL treats the subquery result as an inline temporary table. <b>Rule:</b> Every derived table in MySQL MUST have an alias (here <code>DeptMetrics</code>).",
        sql="SELECT DeptMetrics.Dept, DeptMetrics.AvgCGPA\nFROM (\n    SELECT Dept, ROUND(AVG(CGPA), 2) AS AvgCGPA\n    FROM Students\n    WHERE CGPA IS NOT NULL\n    GROUP BY Dept\n) AS DeptMetrics\nWHERE DeptMetrics.AvgCGPA > 8.00;",
        headers=["Dept", "AvgCGPA"],
        rows=[
            ["ECE", "8.78"],
            ["CSE", "8.28"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_nested builder compiled successfully.")
