import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 9: PL/SQL & STORED PROGRAMS (PROCEDURES, TRIGGERS, CURSORS)
# ==============================================================================
def build_sec_plsql():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">9. PL/SQL &amp; Stored Programs — Procedures, Functions, Triggers, Cursors</h2>
  <div class="link-badges">
    <a href="https://www.w3schools.com/mysql/mysql_stored_procedures.asp" target="_blank" rel="noopener" class="badge-link">W3Schools Stored Procedures ↗</a>
    <a href="https://www.geeksforgeeks.org/mysql/different-types-of-mysql-triggers-with-examples/" target="_blank" rel="noopener" class="badge-link">GFG MySQL Triggers ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: Automatic Robots Inside the Database</strong>
  • <b>Stored Procedure:</b> A saved recipe of commands you can run whenever you want by saying <code>CALL RecipeName()</code>.<br/>
  • <b>Function:</b> A calculator that takes inputs and returns exactly one calculated value.<br/>
  • <b>Trigger:</b> A tripwire or burglar alarm that automatically rings whenever someone inserts, updates, or deletes a row.<br/>
  • <b>Cursor:</b> A pointer that reads through query rows one by one, like turning pages in a book.
</div>
'''

    # Variety 1: Stored Procedure with IN Parameter
    cards.append(make_card(
        badge="PROCEDURE IN",
        title="1. Stored Procedure with IN Parameter — Reusable Query Routine",
        what_it_does="Compiles and stores a parameterized query on the database server. Reduces network traffic by sending only the procedure call name rather than large SQL strings.",
        sql="DELIMITER //\nCREATE PROCEDURE GetStudentsByDept(IN p_dept VARCHAR(10))\nBEGIN\n    SELECT RollNo, StudentName, CGPA\n    FROM Students\n    WHERE Dept = p_dept\n    ORDER BY CGPA DESC;\nEND //\nDELIMITER ;\n\n-- Execution:\nCALL GetStudentsByDept('CSE');",
        headers=["RollNo", "StudentName", "CGPA"],
        rows=[
            [101, "Aarav Sharma", "8.95"],
            [103, "Kabir Verma", "7.60"]
        ],
        card_class="card-success",
        status_badge="badge-success"
    ))

    # Variety 2: Stored Procedure with IN and OUT Parameters
    cards.append(make_card(
        badge="PROCEDURE IN/OUT",
        title="2. Stored Procedure with OUT Parameters — Returning Computed Statistics",
        what_it_does="Accepts an input department and populates two output parameters (<code>p_count</code> and <code>p_avg_cgpa</code>) which can then be inspected in user session variables.",
        sql="DELIMITER //\nCREATE PROCEDURE GetDeptSummary(\n    IN p_dept VARCHAR(10),\n    OUT p_count INT,\n    OUT p_avg_cgpa DECIMAL(4, 2)\n)\nBEGIN\n    SELECT COUNT(*), ROUND(AVG(CGPA), 2)\n    INTO p_count, p_avg_cgpa\n    FROM Students\n    WHERE Dept = p_dept;\nEND //\nDELIMITER ;\n\n-- Calling and reading output variables:\nCALL GetDeptSummary('ECE', @total, @average);\nSELECT @total AS TotalStudents, @average AS DeptAverage;",
        headers=["TotalStudents", "DeptAverage"],
        rows=[[2, "8.78"]]
    ))

    # Variety 3: Stored Function with RETURN
    cards.append(make_card(
        badge="FUNCTION",
        title="3. Stored Function with RETURN — Scalar Value Calculation",
        what_it_does="Functions take input arguments and <b>must return exactly one scalar value</b>. Unlike procedures, stored functions can be called directly inside <code>SELECT</code>, <code>WHERE</code>, and <code>ORDER BY</code> clauses.",
        sql="DELIMITER //\nCREATE FUNCTION GetHonorRoll(p_cgpa DECIMAL(3, 2))\nRETURNS VARCHAR(20)\nDETERMINISTIC\nBEGIN\n    IF p_cgpa >= 9.00 THEN\n        RETURN 'First Class with Distinction';\n    ELSEIF p_cgpa >= 8.00 THEN\n        RETURN 'First Class';\n    ELSE\n        RETURN 'Second Class';\n    END IF;\nEND //\nDELIMITER ;\n\n-- Direct usage in a SELECT query:\nSELECT StudentName, CGPA, GetHonorRoll(CGPA) AS Classification\nFROM Students\nWHERE CGPA IS NOT NULL\nLIMIT 3;",
        headers=["StudentName", "CGPA", "Classification"],
        rows=[
            ["Aarav Sharma", "8.95", "First Class"],
            ["Diya Nair", "9.40", "First Class with Distinction"],
            ["Kabir Verma", "7.60", "Second Class"]
        ]
    ))

    # Variety 4: BEFORE INSERT Trigger
    cards.append(make_card(
        badge="TRIGGER BEFORE",
        title="4. BEFORE INSERT Trigger — Data Sanitization & Domain Validation",
        what_it_does="Fires automatically right before a new row is written to disk. Uses the <code>NEW</code> pseudo-record to force student names to uppercase and check boundaries.",
        sql="DELIMITER //\nCREATE TRIGGER trg_before_student_insert\nBEFORE INSERT ON Students\nFOR EACH ROW\nBEGIN\n    -- Automatically capitalize names for uniformity\n    SET NEW.StudentName = UPPER(NEW.StudentName);\n    \n    -- Enforce valid CGPA ceiling\n    IF NEW.CGPA > 10.00 THEN\n        SIGNAL SQLSTATE '45000' \n        SET MESSAGE_TEXT = 'CGPA cannot exceed 10.00!';\n    END IF;\nEND //\nDELIMITER ;\n\n-- Test insertion:\nINSERT INTO Students (RollNo, StudentName, Dept, CGPA, JoinDate)\nVALUES (107, 'priya nair', 'CSE', 9.50, '2024-08-05');",
        headers=["RollNo", "StudentName", "Dept", "CGPA"],
        rows=[[107, "PRIYA NAIR", "CSE", "9.50"]],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Sanitization Effect:</b> 'priya nair' was converted to 'PRIYA NAIR' automatically."
    ))

    # Variety 5: AFTER UPDATE Trigger
    cards.append(make_card(
        badge="TRIGGER AFTER",
        title="5. AFTER UPDATE Trigger — Automated Audit Logging with OLD & NEW",
        what_it_does="Fires after an update succeeds. Records the student's previous CGPA (<code>OLD.CGPA</code>), new CGPA (<code>NEW.CGPA</code>), user session, and timestamp into an audit log table.",
        sql="-- Create Audit Table\nCREATE TABLE Student_CGPA_Audit (\n    AuditID INT AUTO_INCREMENT PRIMARY KEY,\n    RollNo INT,\n    OldCGPA DECIMAL(3, 2),\n    NewCGPA DECIMAL(3, 2),\n    ChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nDELIMITER //\nCREATE TRIGGER trg_after_student_update\nAFTER UPDATE ON Students\nFOR EACH ROW\nBEGIN\n    IF OLD.CGPA <> NEW.CGPA THEN\n        INSERT INTO Student_CGPA_Audit (RollNo, OldCGPA, NewCGPA)\n        VALUES (OLD.RollNo, OLD.CGPA, NEW.CGPA);\n    END IF;\nEND //\nDELIMITER ;\n\n-- Trigger fired by update:\nUPDATE Students SET CGPA = 9.80 WHERE RollNo = 101;\nSELECT RollNo, OldCGPA, NewCGPA FROM Student_CGPA_Audit;",
        headers=["RollNo", "OldCGPA", "NewCGPA"],
        rows=[[101, "8.95", "9.80"]]
    ))

    # Variety 6: Cursor in Stored Procedure
    cards.append(make_card(
        badge="CURSOR",
        title="6. Cursors — Sequential Row-by-Row Processing",
        what_it_does="A Cursor enables procedural row-by-row iteration over a query result set. Essential for complex business logic that cannot be expressed in a single set-based SQL statement.",
        sql="DELIMITER //\nCREATE PROCEDURE ProcessStudentRoster()\nBEGIN\n    DECLARE done INT DEFAULT FALSE;\n    DECLARE v_name VARCHAR(50);\n    DECLARE v_cgpa DECIMAL(3, 2);\n    \n    -- 1. Declare Cursor\n    DECLARE cur_students CURSOR FOR \n        SELECT StudentName, CGPA FROM Students WHERE CGPA IS NOT NULL;\n    \n    -- 2. Declare Not Found Handler\n    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;\n    \n    -- 3. Open Cursor\n    OPEN cur_students;\n    \n    read_loop: LOOP\n        -- 4. Fetch Next Row\n        FETCH cur_students INTO v_name, v_cgpa;\n        IF done THEN\n            LEAVE read_loop;\n        END IF;\n        -- (Custom procedural calculations executed per row here)\n    END LOOP;\n    \n    -- 5. Close Cursor\n    CLOSE cur_students;\nEND //\nDELIMITER ;",
        headers=["Step", "Lifecycle State"],
        rows=[
            ["1. DECLARE", "Defines the query cursor and NOT FOUND termination handler"],
            ["2. OPEN", "Allocates memory buffer and executes the query"],
            ["3. FETCH", "Retrieves one row at a time into local variables"],
            ["4. CLOSE", "Releases the cursor memory buffer back to the server"]
        ]
    ))

    return intro + "\n" + "\n".join(cards)

print("sec_plsql builder compiled successfully.")
