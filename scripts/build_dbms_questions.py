import json

questions = [
    {
        "id": "dbms-001",
        "title": "Bank Account Transaction Security & Fraud Prevention Trigger",
        "topic": "Database Triggers & Business Constraints",
        "difficulty": "Hard",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (604).png - Screenshot (608).png",
        "description": """A bank requires an automated trigger system to manage account balances and enforce strict fraud and security rules when records are inserted into the `transactions` table.

### Problem Requirements
The trigger must implement the following business logic:
1. **Prevent Withdrawal on Insufficient Funds**: If an account balance is less than the requested withdrawal amount, do not allow balance deduction and mark transaction status accordingly.
2. **Restrict Daily Withdrawal**: Verify that cumulative daily withdrawals do not violate the account limits.
3. **Fraud Flagging**: If the transaction amount exceeds `50,000` (`amount > 50000`), automatically flag the transaction as `'FRAUD'`.
4. **Automatic Balance Update**:
   - For valid `'withdraw'` transactions, deduct the amount from `accounts.balance`.
   - For valid `'deposit'` transactions, add the amount to `accounts.balance`.
5. **Mark Transaction Status**: Ensure the status is recorded as `'SUCCESS'`, `'FRAUD'`, or `'FAILED'`.

---

### Database Schema
#### Table 1: `accounts`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `account_id` | `INT PRIMARY KEY` | Unique account identifier |
| `account_name` | `VARCHAR(50)` | Name of account holder |
| `balance` | `DECIMAL(12,2)` | Current available balance |
| `account_type` | `VARCHAR(20)` | Savings / Current |
| `branch` | `VARCHAR(50)` | Bank branch name |
| `created_at` | `DATE` | Account opening date |

#### Table 2: `transactions`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `txn_id` | `INT PRIMARY KEY` | Transaction identifier |
| `account_id` | `INT` | Account foreign reference |
| `txn_type` | `VARCHAR(20)` | `withdraw` or `deposit` |
| `amount` | `DECIMAL(12,2)` | Transaction amount |
| `txn_date` | `DATE` | Date of transaction |
| `status` | `VARCHAR(20)` | Transaction outcome (`SUCCESS`, `FRAUD`, `FAILED`) |
""",
        "inputFormat": "Prepopulated database tables (`accounts` and `transactions`). No console input.",
        "outputFormat": "The output displays all records from `transactions` followed by all updated records from `accounts`.",
        "constraints": [
            "Use MySQL (8.0) trigger syntax.",
            "Column names and table names are case sensitive.",
            "Use appropriate DELIMITER // while defining triggers."
        ],
        "sampleInput": "INSERT INTO transactions VALUES (1, 101, 'withdraw', 2000, '2023-10-01', 'PENDING');\nINSERT INTO transactions VALUES (2, 101, 'withdraw', 6000, '2023-10-01', 'PENDING');\nINSERT INTO transactions VALUES (3, 101, 'withdraw', 3000, '2023-10-01', 'PENDING');\nINSERT INTO transactions VALUES (4, 101, 'deposit', 1000, '2023-10-01', 'PENDING');",
        "sampleOutput": """txn_id account_id txn_type amount txn_date status
1 101 withdraw 2000.00 2023-10-01 SUCCESS
2 101 withdraw 6000.00 2023-10-01 SUCCESS
3 101 withdraw 3000.00 2023-10-01 SUCCESS
4 101 deposit 1000.00 2023-10-01 SUCCESS
account_id account_name balance account_type branch created_at
101 Ravi 110000.00 Savings Chennai 2023-01-01
102 Kumar 50000.00 Current Madurai 2023-02-10""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "4 transactions on account 101",
                "expectedOutput": """txn_id account_id txn_type amount txn_date status
1 101 withdraw 2000.00 2023-10-01 SUCCESS
2 101 withdraw 6000.00 2023-10-01 SUCCESS
3 101 withdraw 3000.00 2023-10-01 SUCCESS
4 101 deposit 1000.00 2023-10-01 SUCCESS
account_id account_name balance account_type branch created_at
101 Ravi 110000.00 Savings Chennai 2023-01-01
102 Kumar 50000.00 Current Madurai 2023-02-10"""
            }
        ],
        "starterCode": """-- Write your MySQL trigger and transaction processing logic below
DELIMITER //

CREATE TRIGGER trg_bank_transaction_before_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    -- 1. Check fraud condition (amount > 50000)
    -- 2. Check sufficient balance
    -- 3. Set NEW.status accordingly
END //

CREATE TRIGGER trg_bank_transaction_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    -- Update balance in accounts table when status = 'SUCCESS'
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER trg_bank_transaction_before_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE cur_balance DECIMAL(12,2);
    SELECT balance INTO cur_balance FROM accounts WHERE account_id = NEW.account_id;
    
    IF NEW.txn_type = 'withdraw' AND NEW.amount > 50000 THEN
        SET NEW.status = 'FRAUD';
    ELSEIF NEW.txn_type = 'withdraw' AND cur_balance < NEW.amount THEN
        SET NEW.status = 'FAILED';
    ELSE
        SET NEW.status = 'SUCCESS';
    END IF;
END //

CREATE TRIGGER trg_bank_transaction_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'SUCCESS' THEN
        IF NEW.txn_type = 'withdraw' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE account_id = NEW.account_id;
        ELSEIF NEW.txn_type = 'deposit' THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE account_id = NEW.account_id;
        END IF;
    END IF;
END //

DELIMITER ;
""",
        "explanation": "A BEFORE INSERT trigger validates business rules, checks for fraud when the withdrawal amount exceeds 50,000, and verifies balance sufficiency. An AFTER INSERT trigger updates the accounts balance when the transaction is successful.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-002",
        "title": "E-Commerce Dynamic Inventory & Price Adjustment Trigger",
        "topic": "Database Triggers & Business Constraints",
        "difficulty": "Hard",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (609).png - Screenshot (613).png",
        "description": """An e-commerce company wants to automate inventory control and dynamic pricing using database triggers on the `products` and `orders` tables.

### Problem Requirements
The trigger system must:
1. **Prevent orders if available stock is insufficient** (raise error / reject invalid order).
2. **Automatically reduce product stock** after every order is placed.
3. **Dynamically update product price based on stock level**:
   - If remaining `stock < 10`: increase product price by 20% (`price = price * 1.20`).
   - If remaining `stock > 100`: decrease product price by 10% (`price = price * 0.90`).
4. **Mark order status as `'PLACED'`** if successful.

---

### Database Schema
#### Table 1: `products`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `product_id` | `INT PRIMARY KEY` | Unique product identifier |
| `name` | `VARCHAR(50)` | Product title |
| `price` | `DECIMAL(10,2)` | Current unit price |
| `stock` | `INT` | Available inventory count |
| `category` | `VARCHAR(50)` | Product category |
| `supplier` | `VARCHAR(50)` | Supplier vendor name |

#### Table 2: `orders`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `order_id` | `INT PRIMARY KEY` | Unique order identifier |
| `product_id` | `INT` | Ordered product reference |
| `quantity` | `INT` | Quantity ordered |
| `order_date` | `DATE` | Date of placement |
| `customer` | `VARCHAR(50)` | Customer name |
| `status` | `VARCHAR(20)` | Status (`PLACED` or rejected) |
""",
        "inputFormat": "Prepopulated database tables (`products` and `orders`). No console input.",
        "outputFormat": "Displays updated products table followed by all placed records from the orders table.",
        "constraints": [
            "Use MySQL (8.0) trigger syntax.",
            "Use appropriate DELIMITER // while defining triggers.",
            "Calculations on price must preserve 2 decimal places."
        ],
        "sampleInput": "INSERT INTO orders VALUES (1, 1, 5, '2023-10-01', 'Ram', 'PENDING');\nINSERT INTO orders VALUES (2, 1, 40, '2023-10-01', 'Sita', 'PENDING');\nINSERT INTO orders VALUES (3, 2, 10, '2023-10-01', 'Raj', 'PENDING');",
        "sampleOutput": """product_id name price stock category supplier
1 Laptop 60000.00 5 Electronics Dell
2 Mobile 18000.00 110 Electronics Samsung
order_id product_id quantity order_date customer status
1 1 5 2023-10-01 Ram PLACED
2 1 40 2023-10-01 Sita PLACED
3 2 10 2023-10-01 Raj PLACED""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "Sample orders for product 1 (Laptop) and product 2 (Mobile)",
                "expectedOutput": """product_id name price stock category supplier
1 Laptop 60000.00 5 Electronics Dell
2 Mobile 18000.00 110 Electronics Samsung
order_id product_id quantity order_date customer status
1 1 5 2023-10-01 Ram PLACED
2 1 40 2023-10-01 Sita PLACED
3 2 10 2023-10-01 Raj PLACED"""
            }
        ],
        "starterCode": """-- Write your inventory management and dynamic pricing trigger below
DELIMITER //

CREATE TRIGGER trg_inventory_after_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    -- 1. Deduct ordered quantity from stock
    -- 2. If stock < 10, price = price * 1.20
    -- 3. If stock > 100, price = price * 0.90
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER trg_inventory_after_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE new_stock INT;
    
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE product_id = NEW.product_id;
    
    SELECT stock INTO new_stock FROM products WHERE product_id = NEW.product_id;
    
    IF new_stock < 10 THEN
        UPDATE products SET price = price * 1.20 WHERE product_id = NEW.product_id;
    ELSEIF new_stock > 100 THEN
        UPDATE products SET price = price * 0.90 WHERE product_id = NEW.product_id;
    END IF;
END //

DELIMITER ;
""",
        "explanation": "An AFTER INSERT trigger on orders reduces product stock by the ordered quantity. Next, it inspects remaining stock: if stock < 10, it increases price by 20%; if stock > 100, it decreases price by 10%.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-003",
        "title": "Courier Customer Phone Number Standardization Trigger",
        "topic": "Database Triggers & Business Constraints",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (614).png - Screenshot (618).png",
        "description": """Create a trigger named `phone_format_enforcer` that activates `BEFORE UPDATE` on records in the `courier_customers` table.

### Problem Requirements
The trigger must ensure that whenever a customer's `phone_number` is updated, the new value begins with `+91`.
- If the updated `phone_number` does not start with `+91`, the trigger should automatically prepend `+91` to the value.
- If the `phone_number` already follows the required format (`+91...`), the update should proceed without any modification.
- Existing records that are not part of the update operation should remain unaffected.

---

### Database Schema: `courier_customers`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `cust_id` | `INT PRIMARY KEY` | Customer identifier |
| `cust_name` | `VARCHAR(60)` | Customer full name |
| `phone_number` | `VARCHAR(20)` | Contact phone number |
| `city` | `VARCHAR(60)` | Delivery destination city |
""",
        "inputFormat": "The input table is already created and prepopulated. No console input.",
        "outputFormat": "The output displays all records from the updated `courier_customers` table.",
        "constraints": [
            "Use appropriate DELIMITER // while defining the trigger.",
            "Write only the trigger definition as per specifications. The update and select are executed in the test runner.",
            "Table and column names are case sensitive."
        ],
        "sampleInput": "UPDATE courier_customers SET phone_number = '9944332211' WHERE cust_id = 5;\nSELECT * FROM courier_customers;",
        "sampleOutput": """cust_id cust_name phone_number city
1 Arjun +919876543210 Chennai
2 Meera +918765432109 Mumbai
3 Ravi 9988776655 Delhi
4 Sneha +917654321098 Kolkata
5 Kiran +919944332211 Bangalore""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "Update cust_id 5 to 9944332211",
                "expectedOutput": """cust_id cust_name phone_number city
1 Arjun +919876543210 Chennai
2 Meera +918765432109 Mumbai
3 Ravi 9988776655 Delhi
4 Sneha +917654321098 Kolkata
5 Kiran +919944332211 Bangalore"""
            }
        ],
        "starterCode": """-- Write your MySQL trigger definition below
DELIMITER //

CREATE TRIGGER phone_format_enforcer
BEFORE UPDATE ON courier_customers
FOR EACH ROW
BEGIN
    -- Check if NEW.phone_number starts with '+91'
    -- If not, prepend '+91'
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER phone_format_enforcer
BEFORE UPDATE ON courier_customers
FOR EACH ROW
BEGIN
    IF NEW.phone_number NOT LIKE '+91%' THEN
        SET NEW.phone_number = CONCAT('+91', NEW.phone_number);
    END IF;
END //

DELIMITER ;
""",
        "explanation": "A BEFORE UPDATE trigger checks if NEW.phone_number starts with '+91'. If false, it modifies NEW.phone_number by prepending '+91' using CONCAT before the row is committed to storage.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-004",
        "title": "Food Delivery Late Order Audit Trigger",
        "topic": "Audit Logging & Event Tracking Triggers",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (619).png - Screenshot (623).png",
        "description": """In a food delivery logistics system, the administrator wants to automatically audit and track all late deliveries.

### Problem Requirements
Create a trigger named `delivery_after_insert` that executes `AFTER INSERT` on the `deliveries` table.
- The trigger must check whether `NEW.Delivery_time > 60` minutes.
- If true, insert the following attributes into the `late_deliveries` audit table:
  - `Delivery_id`
  - `Customer_name`
  - `Restaurant_name`
  - `Delivery_time`

---

### Database Schema
#### Table 1: `deliveries`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Delivery_id` | `INT PRIMARY KEY` | Delivery ticket ID |
| `Customer_name` | `VARCHAR(50)` | Customer name |
| `Restaurant_name` | `VARCHAR(50)` | Origin restaurant |
| `Delivery_time` | `INT` | Total delivery duration in minutes |
| `Order_date` | `DATE` | Order placement date |
| `City` | `VARCHAR(30)` | City |

#### Table 2: `late_deliveries`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Delivery_id` | `INT` | Delivery reference |
| `Customer_name` | `VARCHAR(50)` | Customer name |
| `Restaurant_name` | `VARCHAR(50)` | Origin restaurant |
| `Delivery_time` | `INT` | Total duration (> 60 min) |
""",
        "inputFormat": "Prepopulated deliveries table. No console input.",
        "outputFormat": "The output displays all records from the `late_deliveries` table.",
        "constraints": [
            "Use MySQL (8.0) trigger syntax.",
            "Trigger name must be delivery_after_insert.",
            "Table names and column names are case sensitive."
        ],
        "sampleInput": "INSERT INTO deliveries VALUES (701, 'Kiran', 'Pizza Hut', 45, '2024-01-10', 'Chennai'), (702, 'Arun', 'Dominos', 75, '2024-02-15', 'Bangalore'), (703, 'Suresh', 'Subway', 50, '2024-03-12', 'Hyderabad'), (704, 'Meena', 'KFC', 90, '2024-04-05', 'Delhi'), (705, 'Vimal', 'Burger King', 40, '2024-05-18', 'Coimbatore');",
        "sampleOutput": """Delivery_id Customer_name Restaurant_name Delivery_time
702 Arun Dominos 75
704 Meena KFC 90""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "Insert 5 deliveries with times 45, 75, 50, 90, 40",
                "expectedOutput": """Delivery_id Customer_name Restaurant_name Delivery_time
702 Arun Dominos 75
704 Meena KFC 90"""
            }
        ],
        "starterCode": """-- Write your MySQL trigger definition below
DELIMITER //

CREATE TRIGGER delivery_after_insert
AFTER INSERT ON deliveries
FOR EACH ROW
BEGIN
    -- Check if NEW.Delivery_time > 60
    -- If true, insert into late_deliveries
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER delivery_after_insert
AFTER INSERT ON deliveries
FOR EACH ROW
BEGIN
    IF NEW.Delivery_time > 60 THEN
        INSERT INTO late_deliveries (Delivery_id, Customer_name, Restaurant_name, Delivery_time)
        VALUES (NEW.Delivery_id, NEW.Customer_name, NEW.Restaurant_name, NEW.Delivery_time);
    END IF;
END //

DELIMITER ;
""",
        "explanation": "An AFTER INSERT trigger evaluates NEW.Delivery_time for each newly inserted delivery. When Delivery_time exceeds 60 minutes, it automatically inserts a copy of the delivery details into late_deliveries.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-005",
        "title": "Student Course Low Attendance Alert Trigger",
        "topic": "Audit Logging & Event Tracking Triggers",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (624).png - Screenshot (627).png",
        "description": """In an online course academic platform, the administration tracks students whose course attendance falls below academic thresholds.

### Problem Requirements
Create a trigger named `attendance_after_insert` that executes `AFTER INSERT` on the `attendance` table.
- The trigger must check whether `NEW.Attendance_percentage < 60`.
- If true, insert the following details into the `low_attendance` table:
  - `Student_id`
  - `Student_name`
  - `Course_name`
  - `Attendance_percentage`

---

### Database Schema
#### Table 1: `attendance`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Student_id` | `INT` | Student registration number |
| `Student_name` | `VARCHAR(50)` | Full name of student |
| `Course_name` | `VARCHAR(50)` | Enrolled course title |
| `Attendance_percentage` | `INT` | Current attendance percentage |
| `Date_recorded` | `DATE` | Record date |
| `City` | `VARCHAR(30)` | City |

#### Table 2: `low_attendance`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Student_id` | `INT` | Student ID |
| `Student_name` | `VARCHAR(50)` | Student Name |
| `Course_name` | `VARCHAR(50)` | Course Title |
| `Attendance_percentage` | `INT` | Attendance (< 60) |
""",
        "inputFormat": "Prepopulated attendance table. No console input.",
        "outputFormat": "The output displays all records from the `low_attendance` table.",
        "constraints": [
            "Use MySQL (8.0) trigger syntax.",
            "Trigger name must be attendance_after_insert.",
            "Case sensitive table and column names."
        ],
        "sampleInput": "INSERT INTO attendance VALUES (801, 'Kiran', 'Python', 75, '2024-01-10', 'Chennai'), (802, 'Arun', 'Java', 55, '2024-02-15', 'Bangalore'), (803, 'Suresh', 'DBMS', 65, '2024-03-12', 'Hyderabad'), (804, 'Meena', 'AI', 50, '2024-04-05', 'Delhi'), (805, 'Vimal', 'Cloud', 80, '2024-05-18', 'Coimbatore');",
        "sampleOutput": """Student_id Student_name Course_name Attendance_percentage
802 Arun Java 55
804 Meena AI 50""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "Insert attendance records (percentages: 75, 55, 65, 50, 80)",
                "expectedOutput": """Student_id Student_name Course_name Attendance_percentage
802 Arun Java 55
804 Meena AI 50"""
            }
        ],
        "starterCode": """-- Write your MySQL trigger definition below
DELIMITER //

CREATE TRIGGER attendance_after_insert
AFTER INSERT ON attendance
FOR EACH ROW
BEGIN
    -- Check if NEW.Attendance_percentage < 60
    -- If true, insert into low_attendance
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER attendance_after_insert
AFTER INSERT ON attendance
FOR EACH ROW
BEGIN
    IF NEW.Attendance_percentage < 60 THEN
        INSERT INTO low_attendance (Student_id, Student_name, Course_name, Attendance_percentage)
        VALUES (NEW.Student_id, NEW.Student_name, NEW.Course_name, NEW.Attendance_percentage);
    END IF;
END //

DELIMITER ;
""",
        "explanation": "An AFTER INSERT trigger evaluates Attendance_percentage upon insertion. If the percentage is less than 60, it inserts the student's ID, name, course, and attendance percentage into the low_attendance table.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-006",
        "title": "Gym Membership Activation Audit Trigger",
        "topic": "Audit Logging & Event Tracking Triggers",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (628).png - Screenshot (632).png",
        "description": """In a gym and fitness club management database, the administrator wants to log members whose membership status changes to `'Active'`.

### Problem Requirements
Create a trigger named `membership_after_update` that executes `AFTER UPDATE` on the `gym_members` table.
- The trigger must check whether the updated `Membership_status` is `'Active'` (`NEW.Membership_status = 'Active'`).
- If true, insert the following details into the `active_members` table:
  - `Member_id`
  - `Member_name`
  - `Membership_status`

---

### Database Schema
#### Table 1: `gym_members`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Member_id` | `INT PRIMARY KEY` | Member unique ID |
| `Member_name` | `VARCHAR(50)` | Member name |
| `Membership_status` | `VARCHAR(20)` | Status (`Active`, `Inactive`, `Expired`) |
| `Plan_type` | `VARCHAR(30)` | Membership duration plan |

#### Table 2: `active_members`
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `Member_id` | `INT` | Member ID |
| `Member_name` | `VARCHAR(50)` | Member Name |
| `Membership_status` | `VARCHAR(20)` | Status (`Active`) |
""",
        "inputFormat": "Prepopulated gym_members table. No console input.",
        "outputFormat": "The output displays all records from the `active_members` table.",
        "constraints": [
            "Use MySQL (8.0) trigger syntax.",
            "Trigger name must be membership_after_update.",
            "Case sensitive table and column names."
        ],
        "sampleInput": "UPDATE gym_members SET Membership_status = 'Active' WHERE Member_id = 2;\nUPDATE gym_members SET Membership_status = 'Active' WHERE Member_id = 4;\nSELECT * FROM active_members;",
        "sampleOutput": """Member_id Member_name Membership_status
2 Divya Active
4 Meera Active""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "Activate member 2 and member 4",
                "expectedOutput": """Member_id Member_name Membership_status
2 Divya Active
4 Meera Active"""
            }
        ],
        "starterCode": """-- Write your MySQL trigger definition below
DELIMITER //

CREATE TRIGGER membership_after_update
AFTER UPDATE ON gym_members
FOR EACH ROW
BEGIN
    -- Check if NEW.Membership_status = 'Active'
    -- If true, insert into active_members
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE TRIGGER membership_after_update
AFTER UPDATE ON gym_members
FOR EACH ROW
BEGIN
    IF NEW.Membership_status = 'Active' THEN
        INSERT INTO active_members (Member_id, Member_name, Membership_status)
        VALUES (NEW.Member_id, NEW.Member_name, NEW.Membership_status);
    END IF;
END //

DELIMITER ;
""",
        "explanation": "An AFTER UPDATE trigger verifies if the updated Membership_status equals 'Active'. If true, it records the member into active_members.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-007",
        "title": "Sum of Digits Using Stored Procedure",
        "topic": "Control Flow & Mathematical Stored Procedures",
        "difficulty": "Easy",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (633).png - Screenshot (634).png",
        "description": """David needs to calculate the sum of the digits of a given integer using a MySQL stored procedure.

### Problem Requirements
Write a stored procedure named `SumOfDigits` that takes an integer parameter `num`.
- Use the `MOD` function to extract the last digit during each loop iteration (`remainder = num % 10`).
- Use the `FLOOR` or integer division function to remove the last digit (`num = FLOOR(num / 10)`).
- Continue while `num > 0`.
- Output `"Result"` followed by `"Sum of digits is: <sum>"`.

Test the procedure using the number `359`.

---

### Procedure Specification
```sql
PROCEDURE SumOfDigits(IN num INT)
```
""",
        "inputFormat": "No console input. Execution is invoked by calling `CALL SumOfDigits(359);`.",
        "outputFormat": "The output prints 'Result' followed by 'Sum of digits is: 17'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Use DELIMITER // ... DELIMITER ;.",
            "Procedure name: SumOfDigits(IN num INT)."
        ],
        "sampleInput": "CALL SumOfDigits(359);",
        "sampleOutput": """Result
Sum of digits is: 17""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL SumOfDigits(359);",
                "expectedOutput": """Result
Sum of digits is: 17"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE SumOfDigits(IN num INT)
BEGIN
    -- Declare variables for sum and remainder
    -- Implement WHILE loop extracting digits via MOD and FLOOR
    -- Output Result and message
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE SumOfDigits(IN num INT)
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE remainder INT;
    
    WHILE num > 0 DO
        SET remainder = MOD(num, 10);
        SET total = total + remainder;
        SET num = FLOOR(num / 10);
    END WHILE;
    
    SELECT 'Result' AS '';
    SELECT CONCAT('Sum of digits is: ', total) AS '';
END //

DELIMITER ;
""",
        "explanation": "A WHILE loop extracts the rightmost digit using MOD(num, 10), adds it to the running total, and truncates the digit using FLOOR(num / 10) until the number reaches 0.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-008",
        "title": "Number Palindrome Verification Procedure",
        "topic": "Control Flow & Mathematical Stored Procedures",
        "difficulty": "Easy",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (635).png - Screenshot (636).png",
        "description": """Harish is working on a data validation module and needs to determine whether a given integer is a palindrome using a MySQL stored procedure. A number is considered a palindrome if it reads the same forwards and backwards (e.g. `141` is a palindrome, while `123` is not).

### Problem Requirements
Write a stored procedure named `CheckPalindrome` that accepts an integer parameter `num`.
- Reverse the number by extracting digits using `MOD(n, 10)` and integer division `DIV 10`.
- Compare the reversed number against the original value.
- Output `"Result"` followed by `"<number> is a palindrome"` or `"<number> is not a palindrome"`.

Test the procedure with `141` and `123`.

---

### Procedure Specification
```sql
PROCEDURE CheckPalindrome(IN num INT)
```
""",
        "inputFormat": "No console input. Invoked via `CALL CheckPalindrome(141);` and `CALL CheckPalindrome(123);`.",
        "outputFormat": "The output prints 'Result' followed by '<number> is <a palindrome / not a palindrome>'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Use MOD and DIV for numeric reversal."
        ],
        "sampleInput": "CALL CheckPalindrome(141);\nCALL CheckPalindrome(123);",
        "sampleOutput": """Result
141 is a palindrome
Result
123 is not a palindrome""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL CheckPalindrome(141); CALL CheckPalindrome(123);",
                "expectedOutput": """Result
141 is a palindrome
Result
123 is not a palindrome"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE CheckPalindrome(IN num INT)
BEGIN
    -- Declare variables for original copy and reversed number
    -- Reverse num using MOD and DIV in a loop
    -- Output Result and palindrome message
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE CheckPalindrome(IN num INT)
BEGIN
    DECLARE original_num INT;
    DECLARE reversed_num INT DEFAULT 0;
    DECLARE temp_num INT;
    DECLARE remainder INT;
    
    SET original_num = num;
    SET temp_num = num;
    
    WHILE temp_num > 0 DO
        SET remainder = MOD(temp_num, 10);
        SET reversed_num = (reversed_num * 10) + remainder;
        SET temp_num = temp_num DIV 10;
    END WHILE;
    
    SELECT 'Result' AS '';
    IF original_num = reversed_num THEN
        SELECT CONCAT(original_num, ' is a palindrome') AS '';
    ELSE
        SELECT CONCAT(original_num, ' is not a palindrome') AS '';
    END IF;
END //

DELIMITER ;
""",
        "explanation": "The procedure retains the original number, loops through its digits using MOD and DIV to build the reversed number, and finally compares both values to display whether it is a palindrome.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-009",
        "title": "Find Greatest Among Three Numbers Procedure",
        "topic": "Control Flow & Mathematical Stored Procedures",
        "difficulty": "Easy",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (637).png - Screenshot (638).png",
        "description": """Reena is participating in a technical interview and is given a task to find the greatest among three given numbers using a MySQL stored procedure.

### Problem Requirements
Write a stored procedure named `FindGreatest` that takes three integer parameters (`n1`, `n2`, `n3`).
- Compare the three numbers using conditional logic (`IF ... ELSEIF ... ELSE`).
- Identify the maximum value.
- Output `"Result"` followed by `"The greatest number is: <max_value>"`.

Test the procedure using the arguments `10`, `20`, and `15`.

---

### Procedure Specification
```sql
PROCEDURE FindGreatest(IN n1 INT, IN n2 INT, IN n3 INT)
```
""",
        "inputFormat": "No console input. Invoked via `CALL FindGreatest(10, 20, 15);`.",
        "outputFormat": "The output prints 'Result' followed by 'The greatest number is: 20'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Procedure signature: FindGreatest(IN n1 INT, IN n2 INT, IN n3 INT)."
        ],
        "sampleInput": "CALL FindGreatest(10, 20, 15);",
        "sampleOutput": """Result
The greatest number is: 20""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL FindGreatest(10, 20, 15);",
                "expectedOutput": """Result
The greatest number is: 20"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE FindGreatest(IN n1 INT, IN n2 INT, IN n3 INT)
BEGIN
    -- Declare variable for greatest
    -- Compare n1, n2, n3 using IF/ELSEIF
    -- Output Result and maximum value
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE FindGreatest(IN n1 INT, IN n2 INT, IN n3 INT)
BEGIN
    DECLARE greatest INT;
    
    IF n1 >= n2 AND n1 >= n3 THEN
        SET greatest = n1;
    ELSEIF n2 >= n1 AND n2 >= n3 THEN
        SET greatest = n2;
    ELSE
        SET greatest = n3;
    END IF;
    
    SELECT 'Result' AS '';
    SELECT CONCAT('The greatest number is: ', greatest) AS '';
END //

DELIMITER ;
""",
        "explanation": "The procedure compares n1, n2, and n3 using boolean conditional operators to determine the largest value, then displays the result.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-010",
        "title": "Calculate Average Performance Score from Comma-Separated String",
        "topic": "String Processing & Delimited Data Procedures",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (639).png - Screenshot (640).png, Screenshot 2026-10-20 210601.png",
        "description": """Michael is developing an analytical reporting script to evaluate employee performance. He receives employee scores formatted as a single comma-separated string: `'80, 90, 85, 95, 88'`.

### Problem Requirements
Write a MySQL stored procedure named `CalculateAverageScore` that accepts a string parameter `score_list`.
- Parse each individual score from the delimited string using string functions (`LOCATE`, `SUBSTRING`, `LENGTH`).
- Calculate the total sum and count of valid scores.
- Compute the average performance score formatted to 2 decimal places.
- Output `"Result"` followed by `"Average performance score: <score>"`.

---

### Procedure Specification
```sql
PROCEDURE CalculateAverageScore(IN score_list VARCHAR(255))
```
""",
        "inputFormat": "No console input. Invoked via `CALL CalculateAverageScore('80, 90, 85, 95, 88');`.",
        "outputFormat": "The output prints 'Result' followed by 'Average performance score: 87.60'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Average must be formatted to 2 decimal places (e.g. FORMAT(avg, 2))."
        ],
        "sampleInput": "CALL CalculateAverageScore('80, 90, 85, 95, 88');",
        "sampleOutput": """Result
Average performance score: 87.60""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL CalculateAverageScore('80, 90, 85, 95, 88');",
                "expectedOutput": """Result
Average performance score: 87.60"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE CalculateAverageScore(IN score_list VARCHAR(255))
BEGIN
    -- Declare tracking variables for sum, count, and token extraction
    -- Parse comma-separated scores in a loop
    -- Output Result and average formatted to 2 decimals
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE CalculateAverageScore(IN score_list VARCHAR(255))
BEGIN
    DECLARE total_score DECIMAL(10,2) DEFAULT 0;
    DECLARE score_count INT DEFAULT 0;
    DECLARE average_score DECIMAL(10,2);
    DECLARE remaining_scores VARCHAR(255);
    DECLARE current_token VARCHAR(50);
    DECLARE comma_pos INT;
    
    SET remaining_scores = score_list;
    
    WHILE LENGTH(remaining_scores) > 0 DO
        SET comma_pos = LOCATE(',', remaining_scores);
        IF comma_pos > 0 THEN
            SET current_token = TRIM(SUBSTRING(remaining_scores, 1, comma_pos - 1));
            SET remaining_scores = TRIM(SUBSTRING(remaining_scores, comma_pos + 1));
        ELSE
            SET current_token = TRIM(remaining_scores);
            SET remaining_scores = '';
        END IF;
        
        IF LENGTH(current_token) > 0 THEN
            SET total_score = total_score + CAST(current_token AS DECIMAL(10,2));
            SET score_count = score_count + 1;
        END IF;
    END WHILE;
    
    SET average_score = total_score / score_count;
    
    SELECT 'Result' AS '';
    SELECT CONCAT('Average performance score: ', FORMAT(average_score, 2)) AS '';
END //

DELIMITER ;
""",
        "explanation": "A WHILE loop splits the comma-separated string by finding comma positions with LOCATE, trims whitespace, casts tokens into decimal scores, accumulates the sum, and computes the 2-decimal average.",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-011",
        "title": "Find Length of Longest Word in Sentence",
        "topic": "String Processing & Delimited Data Procedures",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (641).png - Screenshot (642).png",
        "description": """Alice is developing a text processing script and needs to find the length of the longest word in a given sentence: `'PL/SQL is a powerful language'`.

### Problem Requirements
Write a MySQL stored procedure named `FindLongestWordLength` that accepts a string parameter `sentence`.
- Iterate through each word in the sentence using space delimiter detection.
- Determine the length of each word and track the maximum length encountered.
- Output `"Result"` followed by `"Length of the longest word: <length>"`.

---

### Procedure Specification
```sql
PROCEDURE FindLongestWordLength(IN sentence VARCHAR(255))
```
""",
        "inputFormat": "No console input. Invoked via `CALL FindLongestWordLength('PL/SQL is a powerful language');`.",
        "outputFormat": "The output prints 'Result' followed by 'Length of the longest word: 8'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Sentence can contain alphanumeric characters and common punctuation."
        ],
        "sampleInput": "CALL FindLongestWordLength('PL/SQL is a powerful language');",
        "sampleOutput": """Result
Length of the longest word: 8""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL FindLongestWordLength('PL/SQL is a powerful language');",
                "expectedOutput": """Result
Length of the longest word: 8"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE FindLongestWordLength(IN sentence VARCHAR(255))
BEGIN
    -- Declare variables for tracking max word length
    -- Traverse sentence tokenizing by spaces
    -- Output Result and maximum word length
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE FindLongestWordLength(IN sentence VARCHAR(255))
BEGIN
    DECLARE max_len INT DEFAULT 0;
    DECLARE remaining VARCHAR(255);
    DECLARE current_word VARCHAR(100);
    DECLARE space_pos INT;
    
    SET remaining = TRIM(sentence);
    
    WHILE LENGTH(remaining) > 0 DO
        SET space_pos = LOCATE(' ', remaining);
        IF space_pos > 0 THEN
            SET current_word = SUBSTRING(remaining, 1, space_pos - 1);
            SET remaining = TRIM(SUBSTRING(remaining, space_pos + 1));
        ELSE
            SET current_word = remaining;
            SET remaining = '';
        END IF;
        
        IF LENGTH(current_word) > max_len THEN
            SET max_len = LENGTH(current_word);
        END IF;
    END WHILE;
    
    SELECT 'Result' AS '';
    SELECT CONCAT('Length of the longest word: ', max_len) AS '';
END //

DELIMITER ;
""",
        "explanation": "The procedure trims the input sentence and searches for space delimiters using LOCATE. In each iteration, it extracts the current word, compares its LENGTH against max_len, and outputs the highest length found ('powerful' has 8 characters).",
        "extractionStatus": "VERIFIED_OCR"
    },
    {
        "id": "dbms-012",
        "title": "Sentence Word Counter Using LOCATE",
        "topic": "String Processing & Delimited Data Procedures",
        "difficulty": "Medium",
        "bank": "dbms",
        "recommendedLanguage": "SQL",
        "sourceScreenshot": "Screenshot (643).png - Screenshot (644).png",
        "description": """David is developing a text analysis tool and needs to count the number of words in a given sentence. The sentence is processed by repeatedly finding the position of spaces using the `LOCATE` function to determine word boundaries.

### Problem Requirements
Write a MySQL stored procedure named `CountWords` that takes a sentence as input (`IN sentence VARCHAR(255)`).
- Trim leading and trailing spaces.
- Identify space boundaries using `LOCATE(' ', ...)` in a loop.
- Count the total number of words.
- Test the procedure using the sentence `"Hello World from MySQL"` and output the total word count.

---

### Procedure Specification
```sql
PROCEDURE CountWords(IN sentence VARCHAR(255))
```
""",
        "inputFormat": "No console input. Invoked via `CALL CountWords('Hello World from MySQL');`.",
        "outputFormat": "The output prints 'Result' followed by 'Number of words in \"Hello World from MySQL\" is: 4'.",
        "constraints": [
            "Use MySQL (8.0) stored procedure syntax.",
            "Use LOCATE function to determine word boundaries."
        ],
        "sampleInput": "CALL CountWords('Hello World from MySQL');",
        "sampleOutput": """Result
Number of words in "Hello World from MySQL" is: 4""",
        "testCases": [
            {
                "testIndex": 1,
                "input": "CALL CountWords('Hello World from MySQL');",
                "expectedOutput": """Result
Number of words in "Hello World from MySQL" is: 4"""
            }
        ],
        "starterCode": """-- Write your MySQL stored procedure below
DELIMITER //

CREATE PROCEDURE CountWords(IN sentence VARCHAR(255))
BEGIN
    -- Trim sentence and count words using LOCATE(' ', ...)
    -- Output Result and total count
END //

DELIMITER ;
""",
        "referenceSolution": """DELIMITER //

CREATE PROCEDURE CountWords(IN sentence VARCHAR(255))
BEGIN
    DECLARE word_count INT DEFAULT 0;
    DECLARE remaining VARCHAR(255);
    DECLARE space_pos INT;
    
    SET remaining = TRIM(sentence);
    
    IF LENGTH(remaining) > 0 THEN
        SET word_count = 1;
        SET space_pos = LOCATE(' ', remaining);
        
        WHILE space_pos > 0 DO
            SET word_count = word_count + 1;
            SET remaining = TRIM(SUBSTRING(remaining, space_pos + 1));
            SET space_pos = LOCATE(' ', remaining);
        END WHILE;
    END IF;
    
    SELECT 'Result' AS '';
    SELECT CONCAT('Number of words in "', sentence, '" is: ', word_count) AS '';
END //

DELIMITER ;
""",
        "explanation": "The procedure trims the sentence and increments word_count each time a space boundary is located via LOCATE(' ', remaining), producing the total word count of 4.",
        "extractionStatus": "VERIFIED_OCR"
    }
]

with open('questions_dbms.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated questions_dbms.json with {len(questions)} DBMS questions.")
