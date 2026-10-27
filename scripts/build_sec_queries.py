import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 1C: COMPLETE SQL QUERIES & FILTERING
# ==============================================================================
def build_sec_queries():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">1C. Complete SQL Queries — Filtering, Matching, and Sorting</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_select.asp" target="_blank" rel="noopener" class="badge-link">W3Schools SELECT ↗</a>
    <a href="https://www.w3schools.com/sql/sql_where.asp" target="_blank" rel="noopener" class="badge-link">W3Schools WHERE ↗</a>
    <a href="https://www.w3schools.com/sql/sql_like.asp" target="_blank" rel="noopener" class="badge-link">W3Schools LIKE ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Searching and Filtering a Spreadsheet</strong>
  <b>DQL (Data Query Language)</b> is like filtering and sorting columns in Excel:
  <b>SELECT</b> picks which columns to show.
  <b>WHERE</b> sets the filter criteria (e.g., only students in CSE with marks above 80).
  <b>ORDER BY</b> sorts them from highest to lowest.
  <b>LIMIT</b> keeps only the top 3 on your screen.
</div>
'''

    # Variety 1: SELECT Specific Columns
    cards.append(make_card(
        badge="PROJECTION",
        title="1. SELECT Specific Columns (Projection)",
        what_it_does="Retrieves only designated columns rather than fetching every field with <code>SELECT *</code>. Minimizes network bandwidth and database memory consumption.",
        sql="SELECT RollNo, StudentName, CGPA FROM Students;",
        headers=["RollNo", "StudentName", "CGPA"],
        rows=[
            [101, "Aarav Sharma", "8.95"],
            [102, "Diya Nair", "9.40"],
            [103, "Kabir Verma", "7.60"],
            [104, "Meera Iyer", "6.80"],
            [105, "Rohan Das", "8.15"],
            [106, "Sneha Patel", "NULL"]
        ]
    ))

    # Variety 2: DISTINCT
    cards.append(make_card(
        badge="DISTINCT",
        title="2. SELECT DISTINCT — Eliminating Duplicate Values",
        what_it_does="Scans the result set and removes all duplicate entries, displaying each unique department name exactly once.",
        sql="SELECT DISTINCT Dept FROM Students;",
        headers=["Dept"],
        rows=[["CSE"], ["ECE"], ["MECH"], ["IT"]]
    ))

    # Variety 3: AND Condition
    cards.append(make_card(
        badge="WHERE AND",
        title="3. WHERE with AND Condition — Conjunction Filtering",
        what_it_does="Returns rows that simultaneously satisfy <b>both</b> conditions: department must be 'CSE' AND CGPA must be at least 8.00.",
        sql="SELECT StudentName, Dept, CGPA\nFROM Students\nWHERE Dept = 'CSE' AND CGPA >= 8.00;",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[["Aarav Sharma", "CSE", "8.95"]]
    ))

    # Variety 4: OR Condition
    cards.append(make_card(
        badge="WHERE OR",
        title="4. WHERE with OR Condition — Disjunction Filtering",
        what_it_does="Returns rows where <b>at least one</b> condition is true: student belongs to either the 'ECE' department OR 'MECH' department.",
        sql="SELECT StudentName, Dept, CGPA\nFROM Students\nWHERE Dept = 'ECE' OR Dept = 'MECH';",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[
            ["Diya Nair", "ECE", "9.40"],
            ["Meera Iyer", "MECH", "6.80"],
            ["Rohan Das", "ECE", "8.15"]
        ]
    ))

    # Variety 5: NOT Condition
    cards.append(make_card(
        badge="WHERE NOT",
        title="5. WHERE with NOT Condition — Negation Filtering",
        what_it_does="Inverts a boolean condition, returning all students who are NOT enrolled in the 'CSE' department.",
        sql="SELECT StudentName, Dept FROM Students WHERE NOT Dept = 'CSE';",
        headers=["StudentName", "Dept"],
        rows=[
            ["Diya Nair", "ECE"],
            ["Meera Iyer", "MECH"],
            ["Rohan Das", "ECE"],
            ["Sneha Patel", "IT"]
        ]
    ))

    # Variety 6: BETWEEN ... AND
    cards.append(make_card(
        badge="BETWEEN",
        title="6. BETWEEN ... AND ... — Inclusive Range Filtering",
        what_it_does="Filters values falling between lower and upper limits. <b>Note:</b> Both boundary endpoints (7.50 and 9.00) are included in the results.",
        sql="SELECT StudentName, CGPA\nFROM Students\nWHERE CGPA BETWEEN 7.50 AND 9.00;",
        headers=["StudentName", "CGPA"],
        rows=[
            ["Aarav Sharma", "8.95"],
            ["Kabir Verma", "7.60"],
            ["Rohan Das", "8.15"]
        ]
    ))

    # Variety 7: IN Clause
    cards.append(make_card(
        badge="IN OPERATOR",
        title="7. IN (...) — Matching Against a Discrete List",
        what_it_does="Cleaner and faster alternative to chaining multiple <code>OR</code> conditions. Matches rows where department is either 'CSE' or 'ECE'.",
        sql="SELECT StudentName, Dept FROM Students WHERE Dept IN ('CSE', 'ECE');",
        headers=["StudentName", "Dept"],
        rows=[
            ["Aarav Sharma", "CSE"],
            ["Diya Nair", "ECE"],
            ["Kabir Verma", "CSE"],
            ["Rohan Das", "ECE"]
        ]
    ))

    # Variety 8: LIKE Prefix
    cards.append(make_card(
        badge="LIKE PREFIX",
        title="8. LIKE 'A%' — Prefix Pattern Matching",
        what_it_does="<code>%</code> represents zero or more characters. <code>'A%'</code> finds all names that start with the letter 'A'.",
        sql="SELECT RollNo, StudentName FROM Students WHERE StudentName LIKE 'A%';",
        headers=["RollNo", "StudentName"],
        rows=[[101, "Aarav Sharma"]]
    ))

    # Variety 9: LIKE Suffix
    cards.append(make_card(
        badge="LIKE SUFFIX",
        title="9. LIKE '%Nair' — Suffix Pattern Matching",
        what_it_does="Finds all student records whose name ends with the family surname 'Nair'.",
        sql="SELECT RollNo, StudentName FROM Students WHERE StudentName LIKE '%Nair';",
        headers=["RollNo", "StudentName"],
        rows=[[102, "Diya Nair"]]
    ))

    # Variety 10: LIKE Substring
    cards.append(make_card(
        badge="LIKE SUBSTRING",
        title="10. LIKE '%ar%' — Substring Pattern Matching",
        what_it_does="Finds any student whose name contains the substring 'ar' anywhere inside.",
        sql="SELECT RollNo, StudentName FROM Students WHERE StudentName LIKE '%ar%';",
        headers=["RollNo", "StudentName"],
        rows=[
            [101, "Aarav Sharma"],
            [103, "Kabir Verma"]
        ]
    ))

    # Variety 11: LIKE Exact Length Underscore
    cards.append(make_card(
        badge="LIKE UNDERSCORE",
        title="11. LIKE '____' (4 Underscores) — Exact Character Length Matching",
        what_it_does="Each underscore <code>_</code> matches exactly one character. <code>'____'</code> matches any first name containing exactly 4 characters (e.g. Diya).",
        sql="SELECT RollNo, StudentName FROM Students WHERE StudentName LIKE 'Di__ %';",
        headers=["RollNo", "StudentName"],
        rows=[[102, "Diya Nair"]]
    ))

    # Variety 12: IS NULL vs IS NOT NULL
    cards.append(make_card(
        badge="IS NULL",
        title="12. IS NULL & IS NOT NULL — Handling Unknown Values",
        what_it_does="In SQL, <code>NULL</code> represents an unknown state. Using <code>= NULL</code> evaluates to <i>UNKNOWN</i> (neither true nor false). You <b>must</b> use <code>IS NULL</code> or <code>IS NOT NULL</code>.",
        sql="-- Find students with missing CGPA\nSELECT StudentName, Dept FROM Students WHERE CGPA IS NULL;\n\n-- Find students who have an assigned CGPA\nSELECT StudentName, CGPA FROM Students WHERE CGPA IS NOT NULL;",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[
            ["Sneha Patel", "IT", "NULL"],
            ["Aarav Sharma", "CSE", "8.95"]
        ],
        extra_notes="<b>Viva Trap:</b> Never write <code>WHERE CGPA = NULL</code>! Always write <code>WHERE CGPA IS NULL</code>."
    ))

    # Variety 13: ORDER BY
    cards.append(make_card(
        badge="ORDER BY",
        title="13. ORDER BY (ASC / DESC) — Sorting Result Sets",
        what_it_does="Sorts output records. <code>DESC</code> puts highest marks on top; <code>ASC</code> (default) sorts from lowest to highest.",
        sql="SELECT StudentName, Dept, CGPA\nFROM Students\nWHERE CGPA IS NOT NULL\nORDER BY CGPA DESC;",
        headers=["StudentName", "Dept", "CGPA"],
        rows=[
            ["Diya Nair", "ECE", "9.40"],
            ["Aarav Sharma", "CSE", "8.95"],
            ["Rohan Das", "ECE", "8.15"],
            ["Kabir Verma", "CSE", "7.60"],
            ["Meera Iyer", "MECH", "6.80"]
        ]
    ))

    # Variety 14: LIMIT and OFFSET Pagination
    cards.append(make_card(
        badge="LIMIT & OFFSET",
        title="14. LIMIT with OFFSET — Pagination (Page 1 vs Page 2)",
        what_it_does="Restricts result row counts for web pagination. <code>LIMIT 3 OFFSET 0</code> returns the first page (top 3 rankers); <code>LIMIT 3 OFFSET 3</code> returns the next page (students ranked 4 to 6).",
        sql="-- Page 1: Top 3 Students\nSELECT StudentName, CGPA FROM Students WHERE CGPA IS NOT NULL ORDER BY CGPA DESC LIMIT 3 OFFSET 0;\n\n-- Page 2: Next 3 Students\nSELECT StudentName, CGPA FROM Students WHERE CGPA IS NOT NULL ORDER BY CGPA DESC LIMIT 3 OFFSET 3;",
        headers=["Rank", "StudentName", "CGPA (Page 1)"],
        rows=[
            ["#1", "Diya Nair", "9.40"],
            ["#2", "Aarav Sharma", "8.95"],
            ["#3", "Rohan Das", "8.15"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_queries builder compiled successfully.")
