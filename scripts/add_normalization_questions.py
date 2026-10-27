import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('server/arena.db')
c = conn.cursor()

normalization_questions = [
    {
        "id": "dbms-013",
        "title": "Database Normalization: Decomposing Unnormalized Orders into 3NF",
        "description": """### Problem Statement
In relational database design, **Normalization** is the systematic process of organizing data to reduce redundancy and eliminate update, insertion, and deletion anomalies.

You are given an unnormalized table `Unnormalized_Orders` containing sales data where transitive dependencies exist:
- `OrderID -> CustomerID -> (CustomerName, CustomerCity)` (Transitive Dependency violating 3NF)
- `OrderID, ProductID -> (Quantity, UnitPrice)` (Composite key dependency)

#### Task
Write SQL DDL and DML statements to:
1. Create normalized 3NF tables:
   - `Customers (CustomerID INT PRIMARY KEY, CustomerName VARCHAR(100), CustomerCity VARCHAR(100))`
   - `Products (ProductID INT PRIMARY KEY, ProductName VARCHAR(100), UnitPrice DECIMAL(10,2))`
   - `Orders (OrderID INT PRIMARY KEY, CustomerID INT, OrderDate DATE, FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID))`
   - `OrderItems (OrderID INT, ProductID INT, Quantity INT, PRIMARY KEY (OrderID, ProductID))`
2. Populate the 3NF tables from the existing `Unnormalized_Orders` table.
3. Query the normalized schema to display: `OrderID`, `CustomerName`, `CustomerCity`, `ProductName`, `Quantity`, and `(Quantity * UnitPrice) AS TotalCost`, sorted by `OrderID ASC`, `ProductName ASC`.
""",
        "inputFormat": "A pre-existing populated table `Unnormalized_Orders` with columns: `OrderID`, `OrderDate`, `CustomerID`, `CustomerName`, `CustomerCity`, `ProductID`, `ProductName`, `UnitPrice`, `Quantity`.",
        "outputFormat": "Result set of `OrderID`, `CustomerName`, `CustomerCity`, `ProductName`, `Quantity`, `TotalCost` from the normalized 3NF schema.",
        "constraints": json.dumps([
            "Must satisfy 1NF (atomic values, primary key defined).",
            "Must satisfy 2NF (no partial functional dependencies on composite primary key).",
            "Must satisfy 3NF (no transitive functional dependencies X -> Y -> Z).",
            "Column names in final SELECT: OrderID, CustomerName, CustomerCity, ProductName, Quantity, TotalCost"
        ]),
        "sampleInput": "Unnormalized rows with Order 1001 for Customer C1 (Alice, New York) purchasing P10 (Laptop) and P20 (Mouse).",
        "sampleOutput": """OrderID | CustomerName | CustomerCity | ProductName | Quantity | TotalCost
1001    | Alice        | New York     | Laptop      | 1        | 1200.00
1001    | Alice        | New York     | Mouse       | 2        | 50.00""",
        "testCases": json.dumps([
            {
                "testIndex": 1,
                "input": "Unnormalized Orders with 4 rows",
                "expectedOutput": "1001|Alice|New York|Laptop|1|1200.00\n1001|Alice|New York|Mouse|2|50.00\n1002|Bob|Chicago|Keyboard|1|80.00\n1003|Charlie|San Jose|Monitor|2|600.00"
            }
        ]),
        "topic": "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        "difficulty": "Medium",
        "sourceScreenshot": "DBMS Lab Syllabus - Normalization 1NF to BCNF",
        "explanation": """### Normalization Steps:
1. **1NF**: Every table cell contains single atomic values; each record has a unique identifier.
2. **2NF**: Table is in 1NF and all non-key attributes are fully functionally dependent on the entire primary key (eliminates partial dependencies in composite key relations like `OrderItems`).
3. **3NF**: Table is in 2NF and no non-key attribute is transitively dependent on the primary key (`OrderID -> CustomerID -> CustomerCity`). We decompose customer details into a separate `Customers` table, product details into `Products`, order level attributes into `Orders`, and line items into `OrderItems`.
""",
        "referenceSolution": """-- Step 1: Create 3NF decomposed tables
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    CustomerCity VARCHAR(100)
);

CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    UnitPrice DECIMAL(10,2)
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE
);

CREATE TABLE OrderItems (
    OrderID INT,
    ProductID INT,
    Quantity INT,
    PRIMARY KEY (OrderID, ProductID)
);

-- Step 2: Populate normalized relations
INSERT OR IGNORE INTO Customers (CustomerID, CustomerName, CustomerCity)
SELECT DISTINCT CustomerID, CustomerName, CustomerCity FROM Unnormalized_Orders;

INSERT OR IGNORE INTO Products (ProductID, ProductName, UnitPrice)
SELECT DISTINCT ProductID, ProductName, UnitPrice FROM Unnormalized_Orders;

INSERT OR IGNORE INTO Orders (OrderID, CustomerID, OrderDate)
SELECT DISTINCT OrderID, CustomerID, OrderDate FROM Unnormalized_Orders;

INSERT OR IGNORE INTO OrderItems (OrderID, ProductID, Quantity)
SELECT OrderID, ProductID, Quantity FROM Unnormalized_Orders;

-- Step 3: Query across 3NF tables
SELECT 
    o.OrderID,
    c.CustomerName,
    c.CustomerCity,
    p.ProductName,
    oi.Quantity,
    PRINTF('%.2f', oi.Quantity * p.UnitPrice) AS TotalCost
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN OrderItems oi ON o.OrderID = oi.OrderID
JOIN Products p ON oi.ProductID = p.ProductID
ORDER BY o.OrderID ASC, p.ProductName ASC;
""",
        "starterCode": """-- Database Normalization (1NF, 2NF, 3NF) Challenge
-- Unnormalized_Orders table is preloaded with sample data.

-- Task 1: Create normalized tables: Customers, Products, Orders, OrderItems
-- Task 2: Populate each table from Unnormalized_Orders using INSERT INTO ... SELECT DISTINCT
-- Task 3: Output joined query: OrderID, CustomerName, CustomerCity, ProductName, Quantity, TotalCost

""",
        "extractionStatus": "VERIFIED_OCR",
        "bank": "dbms",
        "recommendedLanguage": "SQL"
    },
    {
        "id": "dbms-014",
        "title": "Database Normalization: Boyce-Codd Normal Form (BCNF) Decomposition",
        "description": """### Problem Statement
A table is in **Boyce-Codd Normal Form (BCNF)** if and only if for every non-trivial functional dependency `X -> Y`, `X` is a **Super Key**. BCNF is a stricter version of 3NF that handles cases where candidate keys overlap.

Consider a university advisory schema:
`Student_Advisor_Subject(StudentID, Subject, AdvisorID, AdvisorRoom)`
Given functional dependencies:
1. `StudentID, Subject -> AdvisorID` (A student has one advisor for a given subject)
2. `AdvisorID -> Subject, AdvisorRoom` (Each advisor specializes in one subject and has a designated office room)

Candidate keys are `(StudentID, Subject)` and `(StudentID, AdvisorID)`.
In dependency `AdvisorID -> Subject`, `AdvisorID` is NOT a super key! This violates BCNF and introduces anomalies:
- **Deletion Anomaly**: If a student drops out, the record of the advisor and their room/subject is lost!
- **Insertion Anomaly**: We cannot hire a new advisor until a student enrolls under them!

#### Task
Write SQL statements to:
1. Decompose the relation into two BCNF relations:
   - `AdvisorDetails (AdvisorID INT PRIMARY KEY, Subject VARCHAR(100), AdvisorRoom VARCHAR(50))`
   - `StudentAdvisor (StudentID INT, AdvisorID INT, PRIMARY KEY (StudentID, AdvisorID))`
2. Populate the BCNF tables from `Student_Advisor_Subject`.
3. Display all student-advisor pairings with their subject and office room, ordered by `StudentID ASC`, `AdvisorID ASC`.
""",
        "inputFormat": "Pre-existing table `Student_Advisor_Subject` with columns `StudentID`, `Subject`, `AdvisorID`, `AdvisorRoom`.",
        "outputFormat": "Result table with `StudentID`, `AdvisorID`, `Subject`, `AdvisorRoom` ordered by `StudentID ASC`.",
        "constraints": json.dumps([
            "Must decompose to BCNF (every determinant must be a candidate/super key).",
            "Eliminate insertion and deletion anomalies.",
            "Preserve all relationships losslessly."
        ]),
        "sampleInput": "Student 101 assigned to Advisor 501 (Physics, Room 302) and 502 (Math, Room 104).",
        "sampleOutput": """StudentID | AdvisorID | Subject | AdvisorRoom
101       | 501       | Physics | Room 302
101       | 502       | Math    | Room 104""",
        "testCases": json.dumps([
            {
                "testIndex": 1,
                "input": "Student Advisor assignments",
                "expectedOutput": "101|501|Physics|Room 302\n101|502|Math|Room 104\n102|501|Physics|Room 302\n103|503|Chemistry|Room 210"
            }
        ]),
        "topic": "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        "difficulty": "Hard",
        "sourceScreenshot": "DBMS Lab Syllabus - BCNF Decomposition",
        "explanation": """### BCNF Decomposition Principle:
For every functional dependency `X -> Y`, if `X` is not a super key, decompose the table `R` into:
1. `R1 = (X U Y)` with primary key `X` (here `AdvisorDetails(AdvisorID, Subject, AdvisorRoom)`).
2. `R2 = (R - Y)` with foreign key referencing `R1` (here `StudentAdvisor(StudentID, AdvisorID)`).

Both resulting tables are now in BCNF because:
- In `AdvisorDetails`, `AdvisorID` is the primary/super key.
- In `StudentAdvisor`, the only functional dependency is the trivial dependency of the composite key on itself.
""",
        "referenceSolution": """-- Step 1: Create BCNF decomposed tables
CREATE TABLE AdvisorDetails (
    AdvisorID INT PRIMARY KEY,
    Subject VARCHAR(100),
    AdvisorRoom VARCHAR(50)
);

CREATE TABLE StudentAdvisor (
    StudentID INT,
    AdvisorID INT,
    PRIMARY KEY (StudentID, AdvisorID),
    FOREIGN KEY (AdvisorID) REFERENCES AdvisorDetails(AdvisorID)
);

-- Step 2: Populate BCNF relations losslessly
INSERT OR IGNORE INTO AdvisorDetails (AdvisorID, Subject, AdvisorRoom)
SELECT DISTINCT AdvisorID, Subject, AdvisorRoom FROM Student_Advisor_Subject;

INSERT OR IGNORE INTO StudentAdvisor (StudentID, AdvisorID)
SELECT DISTINCT StudentID, AdvisorID FROM Student_Advisor_Subject;

-- Step 3: Query lossless join
SELECT 
    sa.StudentID,
    sa.AdvisorID,
    ad.Subject,
    ad.AdvisorRoom
FROM StudentAdvisor sa
JOIN AdvisorDetails ad ON sa.AdvisorID = ad.AdvisorID
ORDER BY sa.StudentID ASC, sa.AdvisorID ASC;
""",
        "starterCode": """-- Boyce-Codd Normal Form (BCNF) Decomposition Challenge
-- Pre-existing table: Student_Advisor_Subject(StudentID, Subject, AdvisorID, AdvisorRoom)

-- Task 1: Create AdvisorDetails and StudentAdvisor tables
-- Task 2: Insert distinct records from Student_Advisor_Subject
-- Task 3: Query StudentID, AdvisorID, Subject, AdvisorRoom ordered by StudentID, AdvisorID

""",
        "extractionStatus": "VERIFIED_OCR",
        "bank": "dbms",
        "recommendedLanguage": "SQL"
    },
    {
        "id": "dbms-015",
        "title": "Database Normalization: Eliminating Multi-Valued Dependencies (4NF)",
        "description": """### Problem Statement
A table is in **Fourth Normal Form (4NF)** if and only if it is in BCNF and contains **no non-trivial Multi-Valued Dependencies (MVDs)**.
An MVD `A ->> B` occurs when attribute `A` determines a set of values for `B` independently of other attributes `C`.

Consider a software recruitment table:
`DeveloperProfiles(DevID, Skill, Certification)`
A developer's programming skills and professional certifications are completely independent of each other:
- `DevID ->> Skill`
- `DevID ->> Certification`

If Developer 1 has 2 skills (`Python`, `Go`) and 2 certifications (`AWS`, `GCP`), a single flat relation must store $2 \\times 2 = 4$ rows (Cartesian product of skills and certifications) to avoid partial representation. This leads to severe data redundancy and update anomalies!

#### Task
Write SQL statements to:
1. Decompose the relation into two 4NF relations:
   - `DeveloperSkills (DevID INT, Skill VARCHAR(50), PRIMARY KEY (DevID, Skill))`
   - `DeveloperCerts (DevID INT, Certification VARCHAR(100), PRIMARY KEY (DevID, Certification))`
2. Populate the 4NF tables from `DeveloperProfiles`.
3. For each developer, count their total distinct skills and total certifications:
   `DevID`, `TotalSkills`, `TotalCertifications` ordered by `DevID ASC`.
""",
        "inputFormat": "Pre-existing table `DeveloperProfiles` with columns `DevID`, `Skill`, `Certification`.",
        "outputFormat": "Result table with `DevID`, `TotalSkills`, `TotalCertifications` ordered by `DevID ASC`.",
        "constraints": json.dumps([
            "Must satisfy 4NF (eliminating multi-valued dependencies).",
            "No Cartesian product explosion.",
            "Use GROUP BY DevID to aggregate skill and cert counts."
        ]),
        "sampleInput": "Dev 1 has skills (Python, Go) and certs (AWS, GCP).",
        "sampleOutput": """DevID | TotalSkills | TotalCertifications
1     | 2           | 2""",
        "testCases": json.dumps([
            {
                "testIndex": 1,
                "input": "DeveloperProfiles with 3 developers",
                "expectedOutput": "1|2|2\n2|3|1\n3|1|2"
            }
        ]),
        "topic": "Database Normalization (1NF, 2NF, 3NF, BCNF)",
        "difficulty": "Hard",
        "sourceScreenshot": "DBMS Lab Syllabus - 4NF Multi-Valued Dependencies",
        "explanation": """### 4NF Principle:
When a relation has two or more independent multi-valued facts about an entity (e.g., `DevID ->> Skill` and `DevID ->> Certification`), it violates 4NF.
By decomposing `R(DevID, Skill, Certification)` into:
1. `R1(DevID, Skill)`
2. `R2(DevID, Certification)`

We eliminate the combinatorial product of rows, saving storage and guaranteeing clean ACID operations without redundancy.
""",
        "referenceSolution": """-- Step 1: Create 4NF decomposed relations
CREATE TABLE DeveloperSkills (
    DevID INT,
    Skill VARCHAR(50),
    PRIMARY KEY (DevID, Skill)
);

CREATE TABLE DeveloperCerts (
    DevID INT,
    Certification VARCHAR(100),
    PRIMARY KEY (DevID, Certification)
);

-- Step 2: Populate distinct facts
INSERT OR IGNORE INTO DeveloperSkills (DevID, Skill)
SELECT DISTINCT DevID, Skill FROM DeveloperProfiles;

INSERT OR IGNORE INTO DeveloperCerts (DevID, Certification)
SELECT DISTINCT DevID, Certification FROM DeveloperProfiles;

-- Step 3: Aggregate count query
SELECT 
    s.DevID,
    COUNT(DISTINCT s.Skill) AS TotalSkills,
    (SELECT COUNT(DISTINCT c.Certification) FROM DeveloperCerts c WHERE c.DevID = s.DevID) AS TotalCertifications
FROM DeveloperSkills s
GROUP BY s.DevID
ORDER BY s.DevID ASC;
""",
        "starterCode": """-- Fourth Normal Form (4NF) Multi-Valued Dependency Elimination
-- Pre-existing table: DeveloperProfiles(DevID, Skill, Certification)

-- Task 1: Create DeveloperSkills and DeveloperCerts tables
-- Task 2: Insert distinct records from DeveloperProfiles
-- Task 3: Query DevID, TotalSkills, TotalCertifications ordered by DevID ASC

""",
        "extractionStatus": "VERIFIED_OCR",
        "bank": "dbms",
        "recommendedLanguage": "SQL"
    }
]

for q in normalization_questions:
    c.execute("""
        INSERT OR REPLACE INTO questions (
            id, title, description, inputFormat, outputFormat, constraints,
            sampleInput, sampleOutput, testCases, topic, difficulty,
            sourceScreenshot, explanation, referenceSolution, starterCode,
            extractionStatus, bank, recommendedLanguage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        q["id"], q["title"], q["description"], q["inputFormat"], q["outputFormat"],
        q["constraints"], q["sampleInput"], q["sampleOutput"], q["testCases"],
        q["topic"], q["difficulty"], q["sourceScreenshot"], q["explanation"],
        q["referenceSolution"], q["starterCode"], q["extractionStatus"],
        q["bank"], q["recommendedLanguage"]
    ))
    print(f"Inserted / Updated question: {q['id']} - {q['title']}")

conn.commit()
conn.close()
print("All 3 Normalization questions saved to server/arena.db successfully.")
