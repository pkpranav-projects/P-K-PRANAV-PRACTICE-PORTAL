import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 2: AGGREGATE FUNCTIONS & GROUP BY / HAVING
# ==============================================================================
def build_sec_agg():
    cards = []
    
    # Context schema table
    intro = '''<div class="topic-header">
  <h2 class="topic-title">2. Aggregate Functions &amp; GROUP BY / HAVING</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/sql/sql_aggregate_functions.asp" target="_blank" rel="noopener" class="badge-link">W3Schools Aggregates ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: The Class Scorekeeper</strong>
  Imagine you are the teacher summarizing exam results. <b>COUNT</b> tells you how many students attended. <b>SUM</b> calculates the total marks accumulated. <b>AVG</b> computes the class mean. <b>MAX</b> and <b>MIN</b> find the highest and lowest scores. <b>GROUP BY</b> runs these calculations separately for each department, and <b>HAVING</b> filters out groups that do not meet your cutoff.
</div>

<div class="callout callout-green">
  <b>Reference Table for Examples: <code>Students</code></b><br/>
  Assume our database currently holds these 6 student records:
</div>

<table class="output-table" style="margin-bottom: 1.5rem;">
  <thead>
    <tr><th>RollNo (PK)</th><th>StudentName</th><th>Dept</th><th>CGPA</th><th>JoinDate</th></tr>
  </thead>
  <tbody>
    <tr><td>101</td><td>Aarav Sharma</td><td>CSE</td><td>8.95</td><td>2024-08-01</td></tr>
    <tr><td>102</td><td>Diya Nair</td><td>ECE</td><td>9.40</td><td>2024-08-01</td></tr>
    <tr><td>103</td><td>Kabir Verma</td><td>CSE</td><td>7.60</td><td>2024-08-02</td></tr>
    <tr><td>104</td><td>Meera Iyer</td><td>MECH</td><td>6.80</td><td>2024-08-03</td></tr>
    <tr><td>105</td><td>Rohan Das</td><td>ECE</td><td>8.15</td><td>2024-08-03</td></tr>
    <tr><td>106</td><td>Sneha Patel</td><td>IT</td><td>NULL</td><td>2024-08-04</td></tr>
  </tbody>
</table>
'''

    # Variety 1: COUNT(*)
    cards.append(make_card(
        badge="COUNT(*)",
        title="1. COUNT(*) — Total Table Rows Including NULLs",
        what_it_does="Scans the relation and counts all rows that satisfy the WHERE condition (or all rows if unfiltered). Crucially, <code>COUNT(*)</code> counts rows even if some or all column values in that row are NULL.",
        sql="SELECT COUNT(*) AS total_students FROM Students;",
        headers=["total_students"],
        rows=[[6]],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Variety 2: COUNT(column)
    cards.append(make_card(
        badge="COUNT(col)",
        title="2. COUNT(column) — Count Only Non-NULL Column Values",
        what_it_does="Counts only records where the specified column contains a valid, non-NULL value. Notice that Sneha Patel has a NULL CGPA, so <code>COUNT(CGPA)</code> yields 5, whereas <code>COUNT(*)</code> yielded 6. This is a very common exam viva question!",
        sql="SELECT COUNT(CGPA) AS students_with_cgpa FROM Students;",
        headers=["students_with_cgpa"],
        rows=[[5]],
        extra_notes="<b>Viva Trap:</b> <code>COUNT(*)</code> counts rows. <code>COUNT(column)</code> ignores NULLs."
    ))

    # Variety 3: COUNT(DISTINCT column)
    cards.append(make_card(
        badge="COUNT(DISTINCT)",
        title="3. COUNT(DISTINCT column) — Count Unique Non-Duplicate Values",
        what_it_does="Discards duplicate department entries and NULL values, counting only the distinct active department names across the student body.",
        sql="SELECT COUNT(DISTINCT Dept) AS unique_departments FROM Students;",
        headers=["unique_departments"],
        rows=[[4]]
    ))

    # Variety 4: SUM(column)
    cards.append(make_card(
        badge="SUM()",
        title="4. SUM(column) — Total Arithmetic Sum of Numeric Values",
        what_it_does="Adds all numeric values in the designated column across all matching rows. Automatically ignores NULL entries (it does not treat NULL as 0; it skips it entirely).",
        sql="SELECT SUM(CGPA) AS total_cgpa_points FROM Students;",
        headers=["total_cgpa_points"],
        rows=[["40.90"]]
    ))

    # Variety 5: AVG(column)
    cards.append(make_card(
        badge="AVG()",
        title="5. AVG(column) — Arithmetic Mean of Non-NULL Values",
        what_it_does="Calculates the arithmetic average: <code>SUM(CGPA) / COUNT(CGPA)</code>. Because it divides by 5 (non-NULL rows) instead of 6, the resulting average is mathematically accurate.",
        sql="SELECT AVG(CGPA) AS exact_average_cgpa FROM Students;",
        headers=["exact_average_cgpa"],
        rows=[["8.180000"]]
    ))

    # Variety 6: ROUND(AVG(), 2)
    cards.append(make_card(
        badge="ROUND(AVG(), 2)",
        title="6. ROUND(AVG(), 2) — Formatting Decimal Averages",
        what_it_does="Nests <code>AVG()</code> inside the mathematical function <code>ROUND()</code> to truncate and round the score to 2 decimal places, standard for academic transcripts and reports.",
        sql="SELECT ROUND(AVG(CGPA), 2) AS clean_avg_cgpa FROM Students;",
        headers=["clean_avg_cgpa"],
        rows=[["8.18"]]
    ))

    # Variety 7: MIN() and MAX()
    cards.append(make_card(
        badge="MIN() & MAX()",
        title="7. MIN() & MAX() — Smallest and Largest Values in One Query",
        what_it_does="Finds the extremes of a distribution in a single table pass. Works on numeric columns, dates (earliest vs latest), and character strings (alphabetical first vs last).",
        sql="SELECT MIN(CGPA) AS lowest_cgpa, MAX(CGPA) AS highest_cgpa FROM Students;",
        headers=["lowest_cgpa", "highest_cgpa"],
        rows=[["6.80", "9.40"]]
    ))

    # Variety 8: GROUP_CONCAT()
    cards.append(make_card(
        badge="GROUP_CONCAT()",
        title="8. GROUP_CONCAT() — String Aggregation per Group",
        what_it_does="Concatenates string values from multiple rows in a group into a single comma-separated text string. Extremely useful for summarizing roster memberships per department.",
        sql="SELECT Dept, GROUP_CONCAT(StudentName ORDER BY CGPA DESC SEPARATOR ', ') AS student_list\nFROM Students\nGROUP BY Dept;",
        headers=["Dept", "student_list"],
        rows=[
            ["CSE", "Aarav Sharma, Kabir Verma"],
            ["ECE", "Diya Nair, Rohan Das"],
            ["IT", "Sneha Patel"],
            ["MECH", "Meera Iyer"]
        ]
    ))

    # Variety 9: STDDEV() & VARIANCE()
    cards.append(make_card(
        badge="STATISTICAL",
        title="9. STDDEV() & VARIANCE() — Measuring Academic Score Dispersion",
        what_it_does="Calculates the population standard deviation and variance across students' CGPAs to assess consistency of student grades.",
        sql="SELECT ROUND(STDDEV(CGPA), 3) AS cgpa_std_dev, ROUND(VARIANCE(CGPA), 3) AS cgpa_variance\nFROM Students;",
        headers=["cgpa_std_dev", "cgpa_variance"],
        rows=[["0.898", "0.806"]]
    ))

    # Variety 10: GROUP BY single column
    cards.append(make_card(
        badge="GROUP BY",
        title="10. GROUP BY Department — Computing Metrics per Department",
        what_it_does="Divides the table rows into separate buckets based on identical <code>Dept</code> values, then computes <code>COUNT(*)</code>, <code>MAX</code>, and <code>AVG</code> independently for each departmental bucket.",
        sql="SELECT Dept, COUNT(*) AS student_count, MAX(CGPA) AS top_cgpa, ROUND(AVG(CGPA), 2) AS avg_cgpa\nFROM Students\nGROUP BY Dept;",
        headers=["Dept", "student_count", "top_cgpa", "avg_cgpa"],
        rows=[
            ["CSE", 2, "8.95", "8.28"],
            ["ECE", 2, "9.40", "8.78"],
            ["IT", 1, "NULL", "NULL"],
            ["MECH", 1, "6.80", "6.80"]
        ]
    ))

    # Variety 11: GROUP BY multiple columns
    cards.append(make_card(
        badge="MULTI GROUP BY",
        title="11. GROUP BY Multiple Columns — Department and Enrollment Year",
        what_it_does="Subdivides records by combinations of multiple attributes. Here, it groups students by Department AND their matriculation year extracted using <code>YEAR(JoinDate)</code>.",
        sql="SELECT Dept, YEAR(JoinDate) AS join_year, COUNT(*) AS total_admissions\nFROM Students\nGROUP BY Dept, YEAR(JoinDate);",
        headers=["Dept", "join_year", "total_admissions"],
        rows=[
            ["CSE", 2024, 2],
            ["ECE", 2024, 2],
            ["IT", 2024, 1],
            ["MECH", 2024, 1]
        ]
    ))

    # Variety 12: GROUP BY with ROLLUP
    cards.append(make_card(
        badge="WITH ROLLUP",
        title="12. GROUP BY ... WITH ROLLUP — Automatic Subtotals and Grand Total",
        what_it_does="Generates super-aggregate summary rows. The final row represents the grand total across all departments combined, with <code>NULL</code> (or formatted text via <code>IFNULL</code>) as the department label.",
        sql="SELECT IFNULL(Dept, 'ALL DEPARTMENTS (TOTAL)') AS Dept,\n       COUNT(*) AS total_students,\n       ROUND(AVG(CGPA), 2) AS overall_avg_cgpa\nFROM Students\nGROUP BY Dept WITH ROLLUP;",
        headers=["Dept", "total_students", "overall_avg_cgpa"],
        rows=[
            ["CSE", 2, "8.28"],
            ["ECE", 2, "8.78"],
            ["IT", 1, "NULL"],
            ["MECH", 1, "6.80"],
            ["ALL DEPARTMENTS (TOTAL)", 6, "8.18"]
        ]
    ))

    # Variety 13: HAVING on aggregate
    cards.append(make_card(
        badge="HAVING",
        title="13. HAVING Clause — Filtering Summarized Groups by Aggregate Value",
        what_it_does="While <code>WHERE</code> filters individual rows before grouping occurs, <code>HAVING</code> filters summarized group rows after the aggregation has taken place. Here, it keeps only departments whose average CGPA exceeds 8.00.",
        sql="SELECT Dept, ROUND(AVG(CGPA), 2) AS dept_avg\nFROM Students\nGROUP BY Dept\nHAVING AVG(CGPA) > 8.00;",
        headers=["Dept", "dept_avg"],
        rows=[
            ["CSE", "8.28"],
            ["ECE", "8.78"]
        ],
        card_class="card-amber",
        status_badge="badge-amber"
    ))

    # Variety 14: HAVING on COUNT(*)
    cards.append(make_card(
        badge="HAVING COUNT",
        title="14. HAVING with Count Threshold — Departments with at Least 2 Students",
        what_it_does="Filters out small or single-student departments, returning only departments that have enrolled 2 or more students.",
        sql="SELECT Dept, COUNT(*) AS total_enrolled\nFROM Students\nGROUP BY Dept\nHAVING COUNT(*) >= 2;",
        headers=["Dept", "total_enrolled"],
        rows=[
            ["CSE", 2],
            ["ECE", 2]
        ]
    ))

    # Variety 15: Full Pipeline Query
    cards.append(make_card(
        badge="MASTER PIPELINE",
        title="15. Full Execution Pipeline — WHERE + GROUP BY + HAVING + ORDER BY + LIMIT",
        what_it_does="Demonstrates the full lifecycle of a complex query. <b>Step 1:</b> <code>WHERE</code> filters out students with NULL CGPA. <b>Step 2:</b> <code>GROUP BY</code> aggregates by department. <b>Step 3:</b> <code>HAVING</code> discards departments with avg &le; 7.00. <b>Step 4:</b> <code>ORDER BY</code> sorts highest avg first. <b>Step 5:</b> <code>LIMIT</code> returns the top 2.",
        sql="SELECT Dept,\n       COUNT(*) AS student_count,\n       ROUND(AVG(CGPA), 2) AS avg_cgpa\nFROM Students\nWHERE CGPA IS NOT NULL\nGROUP BY Dept\nHAVING AVG(CGPA) > 7.00\nORDER BY avg_cgpa DESC\nLIMIT 2;",
        headers=["Dept", "student_count", "avg_cgpa"],
        rows=[
            ["ECE", 2, "8.78"],
            ["CSE", 2, "8.28"]
        ],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>Logical Execution Order in MySQL:</b><br/><code>FROM</code> &rarr; <code>WHERE</code> &rarr; <code>GROUP BY</code> &rarr; <code>HAVING</code> &rarr; <code>SELECT</code> &rarr; <code>DISTINCT</code> &rarr; <code>ORDER BY</code> &rarr; <code>LIMIT</code>."
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_agg builder compiled successfully.")
