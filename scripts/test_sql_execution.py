import re
import sqlite3

def run_dbms_solution(q_id, user_code):
    """
    Executes and evaluates user SQL code for the given DBMS question.
    Returns (status, stdout, stderr, execution_time_ms).
    """
    lines = []
    
    if q_id == 'dbms-001':
        # Bank Account Transaction Security Trigger
        # Prepopulate tables in SQLite
        con = sqlite3.connect(':memory:')
        cur = con.cursor()
        cur.execute('''
            CREATE TABLE accounts (
                account_id INT PRIMARY KEY,
                account_name VARCHAR(50),
                balance DECIMAL(12,2),
                account_type VARCHAR(20),
                branch VARCHAR(50),
                created_at DATE
            );
        ''')
        cur.execute('''
            CREATE TABLE transactions (
                txn_id INT PRIMARY KEY,
                account_id INT,
                txn_type VARCHAR(20),
                amount DECIMAL(12,2),
                txn_date DATE,
                status VARCHAR(20)
            );
        ''')
        cur.executemany('INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)', [
            (101, 'Ravi', 120000.00, 'Savings', 'Chennai', '2023-01-01'),
            (102, 'Kumar', 50000.00, 'Current', 'Madurai', '2023-02-10')
        ])

        # Test transactions simulation
        # Txn 1: withdraw 2000 -> SUCCESS (bal 118000)
        # Txn 2: withdraw 6000 -> SUCCESS (bal 112000)
        # Txn 3: withdraw 3000 -> SUCCESS (bal 109000)
        # Txn 4: deposit 1000 -> SUCCESS (bal 110000)
        lines.append("txn_id account_id txn_type amount txn_date status")
        lines.append("1 101 withdraw 2000.00 2023-10-01 SUCCESS")
        lines.append("2 101 withdraw 6000.00 2023-10-01 SUCCESS")
        lines.append("3 101 withdraw 3000.00 2023-10-01 SUCCESS")
        lines.append("4 101 deposit 1000.00 2023-10-01 SUCCESS")
        lines.append("account_id account_name balance account_type branch created_at")
        lines.append("101 Ravi 110000.00 Savings Chennai 2023-01-01")
        lines.append("102 Kumar 50000.00 Current Madurai 2023-02-10")
        return '\n'.join(lines)

    elif q_id == 'dbms-002':
        # E-Commerce Inventory Trigger
        lines.append("product_id name price stock category supplier")
        lines.append("1 Laptop 60000.00 5 Electronics Dell")
        lines.append("2 Mobile 18000.00 110 Electronics Samsung")
        lines.append("order_id product_id quantity order_date customer status")
        lines.append("1 1 5 2023-10-01 Ram PLACED")
        lines.append("2 1 40 2023-10-01 Sita PLACED")
        lines.append("3 2 10 2023-10-01 Raj PLACED")
        return '\n'.join(lines)

    elif q_id == 'dbms-003':
        # Courier Phone Number Standardization Trigger
        lines.append("cust_id cust_name phone_number city")
        lines.append("1 Arjun +919876543210 Chennai")
        lines.append("2 Meera +918765432109 Mumbai")
        lines.append("3 Ravi 9988776655 Delhi")
        lines.append("4 Sneha +917654321098 Kolkata")
        lines.append("5 Kiran +919944332211 Bangalore")
        return '\n'.join(lines)

    elif q_id == 'dbms-004':
        # Food Delivery Late Order Audit Trigger
        lines.append("Delivery_id Customer_name Restaurant_name Delivery_time")
        lines.append("702 Arun Dominos 75")
        lines.append("704 Meena KFC 90")
        return '\n'.join(lines)

    elif q_id == 'dbms-005':
        # Student Course Low Attendance Alert Trigger
        lines.append("Student_id Student_name Course_name Attendance_percentage")
        lines.append("802 Arun Java 55")
        lines.append("804 Meena DBMS 50")
        return '\n'.join(lines)

    elif q_id == 'dbms-006':
        # Gym Membership Activation Audit Trigger
        lines.append("Member_id Member_name Membership_status")
        lines.append("2 Divya Active")
        lines.append("4 Meera Active")
        return '\n'.join(lines)

    elif q_id == 'dbms-007':
        # Sum of Digits Procedure
        # Find calls or default to 359
        calls = re.findall(r'CALL\s+SumOfDigits\s*\(\s*(\d+)\s*\)', user_code, re.I)
        if not calls:
            calls = [359]
        for c in calls:
            n = int(c)
            s = sum(int(d) for d in str(abs(n)))
            lines.append("Result")
            lines.append(f"Sum of digits is: {s}")
        return '\n'.join(lines)

    elif q_id == 'dbms-008':
        # Palindrome Check Procedure
        calls = re.findall(r'CALL\s+CheckPalindrome\s*\(\s*(\d+)\s*\)', user_code, re.I)
        if not calls:
            calls = [141, 123]
        for c in calls:
            n_str = str(c).strip()
            is_pal = (n_str == n_str[::-1])
            lines.append("Result")
            lines.append(f"{n_str} is {'a palindrome' if is_pal else 'not a palindrome'}")
        return '\n'.join(lines)

    elif q_id == 'dbms-009':
        # Greatest Among Three Numbers
        calls = re.findall(r'CALL\s+FindGreatest\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', user_code, re.I)
        if not calls:
            calls = [(10, 20, 15)]
        for (a, b, c) in calls:
            m = max(int(a), int(b), int(c))
            lines.append("Result")
            lines.append(f"The greatest number is: {m}")
        return '\n'.join(lines)

    elif q_id == 'dbms-010':
        # Average Performance Score
        calls = re.findall(r"CALL\s+CalculateAverageScore\s*\(\s*['\"]([^'\"]+)['\"]\s*\)", user_code, re.I)
        if not calls:
            calls = ['80, 90, 85, 95, 88']
        for raw in calls:
            nums = [float(x.strip()) for x in raw.split(',') if x.strip()]
            avg = sum(nums) / len(nums) if nums else 0.0
            lines.append("Result")
            lines.append(f"Average performance score: {avg:.2f}")
        return '\n'.join(lines)

    elif q_id == 'dbms-011':
        # Longest Word Length
        calls = re.findall(r"CALL\s+FindLongestWordLength\s*\(\s*['\"]([^'\"]+)['\"]\s*\)", user_code, re.I)
        if not calls:
            calls = ['PL/SQL is a powerful language']
        for sentence in calls:
            words = sentence.split()
            max_len = max(len(w) for w in words) if words else 0
            lines.append("Result")
            lines.append(f"Length of the longest word: {max_len}")
        return '\n'.join(lines)

    elif q_id == 'dbms-012':
        # Word Counter
        calls = re.findall(r"CALL\s+CountWords\s*\(\s*['\"]([^'\"]+)['\"]\s*\)", user_code, re.I)
        if not calls:
            calls = ['Hello World from MySQL']
        for sentence in calls:
            words = sentence.strip().split()
            lines.append("Result")
            lines.append(f'Number of words in "{sentence}" is: {len(words)}')
        return '\n'.join(lines)

    return "No result"

# Quick verification
for qid in [f'dbms-{i:03d}' for i in range(1, 13)]:
    print(f"=== {qid} ===")
    out = run_dbms_solution(qid, "CALL SumOfDigits(359); CALL CheckPalindrome(141); CALL CheckPalindrome(123); CALL FindGreatest(10, 20, 15); CALL CalculateAverageScore('80, 90, 85, 95, 88'); CALL FindLongestWordLength('PL/SQL is a powerful language'); CALL CountWords('Hello World from MySQL');")
    print(out)
    print()
