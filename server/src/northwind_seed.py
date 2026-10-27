# Northwind demo database seed for W3Schools SQL practice
def seed_northwind(cur):
    # Customers
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY,
        CustomerName TEXT,
        ContactName TEXT,
        Address TEXT,
        City TEXT,
        PostalCode TEXT,
        Country TEXT
    );
    """)
    customers = [
        (1, "Alfreds Futterkiste", "Maria Anders", "Obere Str. 57", "Berlin", "12209", "Germany"),
        (2, "Ana Trujillo Emparedados y helados", "Ana Trujillo", "Avda. de la Constitución 2222", "México D.F.", "05021", "Mexico"),
        (3, "Antonio Moreno Taquería", "Antonio Moreno", "Mataderos 2312", "México D.F.", "05023", "Mexico"),
        (4, "Around the Horn", "Thomas Hardy", "120 Hanover Sq.", "London", "WA1 1DP", "UK"),
        (5, "Berglunds snabbköp", "Christina Berglund", "Berguvsvägen 8", "Luleå", "S-958 22", "Sweden"),
        (6, "Blauer See Delikatessen", "Hanna Moos", "Forsterstr. 57", "Mannheim", "68306", "Germany"),
        (7, "Blondel père et fils", "Frédérique Citeaux", "24, place Kléber", "Strasbourg", "67000", "France"),
        (8, "Bólido Comidas preparadas", "Martín Sommer", "C/ Araquil, 67", "Madrid", "28023", "Spain"),
        (9, "Bon app'", "Laurence Lebihans", "12, rue des Bouchers", "Marseille", "13008", "France"),
        (10, "Bottom-Dollar Marketse", "Elizabeth Lincoln", "23 Tsawassen Blvd.", "Tsawassen", "T2F 8M4", "Canada")
    ]
    cur.executemany("INSERT OR IGNORE INTO Customers VALUES (?,?,?,?,?,?,?)", customers)

    # Categories
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INTEGER PRIMARY KEY,
        CategoryName TEXT,
        Description TEXT
    );
    """)
    categories = [
        (1, "Beverages", "Soft drinks, coffees, teas, beers, and ales"),
        (2, "Condiments", "Sweet and savory sauces, relishes, spreads, and seasonings"),
        (3, "Confections", "Desserts, candies, and sweet breads"),
        (4, "Dairy Products", "Cheeses"),
        (5, "Grains/Cereals", "Breads, crackers, pasta, and cereal"),
        (6, "Meat/Poultry", "Prepared meats"),
        (7, "Produce", "Dried fruit and bean curd"),
        (8, "Seafood", "Seaweed and fish")
    ]
    cur.executemany("INSERT OR IGNORE INTO Categories VALUES (?,?,?)", categories)

    # Products
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY,
        ProductName TEXT,
        SupplierID INTEGER,
        CategoryID INTEGER,
        Unit TEXT,
        Price REAL
    );
    """)
    products = [
        (1, "Chais", 1, 1, "10 boxes x 20 bags", 18.00),
        (2, "Chang", 1, 1, "24 - 12 oz bottles", 19.00),
        (3, "Aniseed Syrup", 1, 2, "12 - 550 ml bottles", 10.00),
        (4, "Chef Anton's Cajun Seasoning", 2, 2, "48 - 6 oz jars", 22.00),
        (5, "Chef Anton's Gumbo Mix", 2, 2, "36 boxes", 21.35),
        (6, "Grandma's Boysenberry Spread", 3, 2, "12 - 8 oz jars", 25.00),
        (7, "Uncle Bob's Organic Dried Pears", 3, 7, "12 - 1 lb pkgs.", 30.00),
        (8, "Northwoods Cranberry Sauce", 3, 2, "12 - 12 oz jars", 40.00),
        (9, "Mishi Kobe Niku", 4, 6, "18 - 500 g pkgs.", 97.00),
        (10, "Ikura", 4, 8, "12 - 200 ml jars", 31.00)
    ]
    cur.executemany("INSERT OR IGNORE INTO Products VALUES (?,?,?,?,?,?)", products)

    # Shippers
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Shippers (
        ShipperID INTEGER PRIMARY KEY,
        ShipperName TEXT,
        Phone TEXT
    );
    """)
    shippers = [
        (1, "Speedy Express", "(503) 555-9831"),
        (2, "United Package", "(503) 555-3199"),
        (3, "Federal Shipping", "(503) 555-9931")
    ]
    cur.executemany("INSERT OR IGNORE INTO Shippers VALUES (?,?,?)", shippers)

    # Employees
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Employees (
        EmployeeID INTEGER PRIMARY KEY,
        LastName TEXT,
        FirstName TEXT,
        BirthDate TEXT,
        Photo TEXT,
        Notes TEXT
    );
    """)
    employees = [
        (1, "Davolio", "Nancy", "1968-12-08", "EmpID1.pic", "Education includes a BA in psychology from Colorado State University."),
        (2, "Fuller", "Andrew", "1952-02-19", "EmpID2.pic", "Andrew received his Ph.D. in international marketing from the University of Dallas."),
        (3, "Leverling", "Janet", "1963-08-30", "EmpID3.pic", "Janet has a BS degree in chemistry from Boston College.")
    ]
    cur.executemany("INSERT OR IGNORE INTO Employees VALUES (?,?,?,?,?,?)", employees)

    # Orders
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Orders (
        OrderID INTEGER PRIMARY KEY,
        CustomerID INTEGER,
        EmployeeID INTEGER,
        OrderDate TEXT,
        ShipperID INTEGER
    );
    """)
    orders = [
        (10248, 1, 3, "1996-07-04", 3),
        (10249, 2, 1, "1996-07-05", 1),
        (10250, 3, 2, "1996-07-08", 2),
        (10251, 4, 3, "1996-07-08", 1),
        (10252, 5, 2, "1996-07-09", 2)
    ]
    cur.executemany("INSERT OR IGNORE INTO Orders VALUES (?,?,?,?,?)", orders)

    # OrderDetails
    cur.execute("""
    CREATE TABLE IF NOT EXISTS OrderDetails (
        OrderDetailID INTEGER PRIMARY KEY,
        OrderID INTEGER,
        ProductID INTEGER,
        Quantity INTEGER
    );
    """)
    order_details = [
        (1, 10248, 1, 12),
        (2, 10248, 2, 10),
        (3, 10249, 1, 5),
        (4, 10250, 3, 35),
        (5, 10251, 4, 15)
    ]
    cur.executemany("INSERT OR IGNORE INTO OrderDetails VALUES (?,?,?,?)", order_details)
