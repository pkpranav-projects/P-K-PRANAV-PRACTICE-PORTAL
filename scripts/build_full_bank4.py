import json
import re

# Questions 1 to 10
questions_1_to_10 = [
    {
        "id": "bank4-001",
        "bank": "bank4",
        "title": "Pizza Order Builder with Overloaded Constructors",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "Bro Code's Java Course teaches that overloaded constructors allow a class to have multiple ways of being instantiated depending on how many arguments are provided.\n\nIn this challenge, design a Pizza class that features overloaded constructors to handle various custom orders:\n- Pizza(String bread)\n- Pizza(String bread, String sauce)\n- Pizza(String bread, String sauce, String cheese)\n- Pizza(String bread, String sauce, String cheese, String topping)\n\nThe program reads an integer N (1 to 4) representing the number of ingredients specified by the customer, followed by the ingredient names. Instantiate the Pizza using the appropriate constructor and print the complete ingredient list.",
        "inputFormat": "The first line contains an integer N (1 <= N <= 4) representing the number of ingredients provided.\nThe second line contains N space-separated strings representing the ingredients in order: bread, sauce, cheese, topping.",
        "outputFormat": "Print the pizza specification in the format:\n\"Bread: <bread> | Sauce: <sauce> | Cheese: <cheese> | Topping: <topping>\"\nIf an ingredient was not provided in the constructor, display \"None\" for that field.",
        "constraints": ["1 <= N <= 4", "Ingredient names contain only letters with no spaces"],
        "sampleInput": "4\nThickCrust Tomato Mozzarella Pepperoni",
        "sampleOutput": "Bread: ThickCrust | Sauce: Tomato | Cheese: Mozzarella | Topping: Pepperoni",
        "testCases": [
            {"input": "4\nThickCrust Tomato Mozzarella Pepperoni", "expectedOutput": "Bread: ThickCrust | Sauce: Tomato | Cheese: Mozzarella | Topping: Pepperoni", "isHidden": False},
            {"input": "2\nThinCrust Barbecue", "expectedOutput": "Bread: ThinCrust | Sauce: Barbecue | Cheese: None | Topping: None", "isHidden": False},
            {"input": "1\nFlatBread", "expectedOutput": "Bread: FlatBread | Sauce: None | Cheese: None | Topping: None", "isHidden": True},
            {"input": "3\nStuffedCrust Pesto Cheddar", "expectedOutput": "Bread: StuffedCrust | Sauce: Pesto | Cheese: Cheddar | Topping: None", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:16:39 - Overloaded Constructors)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Pizza {
    String bread, sauce, cheese, topping;

    Pizza(String bread) { this(bread, "None", "None", "None"); }
    Pizza(String bread, String sauce) { this(bread, sauce, "None", "None"); }
    Pizza(String bread, String sauce, String cheese) { this(bread, sauce, cheese, "None"); }
    Pizza(String bread, String sauce, String cheese, String topping) {
        this.bread = bread;
        this.sauce = sauce;
        this.cheese = cheese;
        this.topping = topping;
    }

    @Override
    public String toString() {
        return "Bread: " + bread + " | Sauce: " + sauce + " | Cheese: " + cheese + " | Topping: " + topping;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Pizza p;
        if (n == 1) p = new Pizza(sc.next());
        else if (n == 2) p = new Pizza(sc.next(), sc.next());
        else if (n == 3) p = new Pizza(sc.next(), sc.next(), sc.next());
        else p = new Pizza(sc.next(), sc.next(), sc.next(), sc.next());
        System.out.println(p);
        sc.close();
    }
}""",
        "explanation": "Overloaded constructors demonstrate constructor delegation and handling variable initialization configurations cleanly.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-002",
        "bank": "bank4",
        "title": "Car Dealership Inventory with Object Arrays",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "In Java, an array can store objects just like primitive data types. Storing objects in an array allows developers to manage collections of complex entities efficiently.\n\nCreate a Car class with attributes: make (String), model (String), and year (int). Read N cars into an array of Car objects (`Car[] garage`), then iterate through the array to display each car's information and identify the newest car in the dealership.",
        "inputFormat": "The first line contains an integer N representing the number of cars.\nThe next N lines each contain make, model, and year separated by spaces.",
        "outputFormat": "Print each car on a separate line in the format: \"<year> <make> <model>\".\nOn the final line, print: \"Newest Car: <year> <make> <model>\".",
        "constraints": ["1 <= N <= 20", "1900 <= year <= 2026", "Make and model are single words"],
        "sampleInput": "3\nTesla Model3 2023\nFord Mustang 2021\nToyota Camry 2024",
        "sampleOutput": "2023 Tesla Model3\n2021 Ford Mustang\n2024 Toyota Camry\nNewest Car: 2024 Toyota Camry",
        "testCases": [
            {"input": "3\nTesla Model3 2023\nFord Mustang 2021\nToyota Camry 2024", "expectedOutput": "2023 Tesla Model3\n2021 Ford Mustang\n2024 Toyota Camry\nNewest Car: 2024 Toyota Camry", "isHidden": False},
            {"input": "2\nBMW M3 2022\nAudi RS6 2022", "expectedOutput": "2022 BMW M3\n2022 Audi RS6\nNewest Car: 2022 BMW M3", "isHidden": False},
            {"input": "1\nHonda Civic 2019", "expectedOutput": "2019 Honda Civic\nNewest Car: 2019 Honda Civic", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:30:08 - Array of Objects)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Car {
    String make, model;
    int year;
    Car(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    String getDetails() { return year + " " + make + " " + model; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Car[] inventory = new Car[n];
        Car newest = null;

        for (int i = 0; i < n; i++) {
            inventory[i] = new Car(sc.next(), sc.next(), sc.nextInt());
            if (newest == null || inventory[i].year > newest.year) {
                newest = inventory[i];
            }
        }

        for (Car c : inventory) System.out.println(c.getDetails());
        if (newest != null) System.out.println("Newest Car: " + newest.getDetails());
        sc.close();
    }
}""",
        "explanation": "Demonstrates instantiating an array of custom class instances and iterating over them.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-003",
        "bank": "bank4",
        "title": "Garage Parking Manager with Object Passing",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "Object passing is the practice of passing an object of one class as an argument to a method of another class.\n\nCreate a Vehicle class with a name (String) attribute, and a Garage class with a fixed capacity C.\nThe Garage has a method `boolean park(Vehicle vehicle)`:\n- If current parked vehicles < capacity C, the vehicle is accepted and the method prints: \"Parked: <name> in Bay <bayIndex>\" (1-based indexing).\n- If the garage is full, it prints: \"Garage Full: Cannot park <name>\".",
        "inputFormat": "The first line contains an integer C representing garage capacity.\nThe second line contains an integer N representing the number of arriving vehicles.\nThe third line contains N space-separated vehicle names.",
        "outputFormat": "Print the parking status for each arriving vehicle in order.\nOn the final line, print: \"Total Parked: <count>/<capacity>\".",
        "constraints": ["1 <= C <= 20", "1 <= N <= 30", "Vehicle names are alphanumeric"],
        "sampleInput": "2\n3\nBMW Ferrari Tesla",
        "sampleOutput": "Parked: BMW in Bay 1\nParked: Ferrari in Bay 2\nGarage Full: Cannot park Tesla\nTotal Parked: 2/2",
        "testCases": [
            {"input": "2\n3\nBMW Ferrari Tesla", "expectedOutput": "Parked: BMW in Bay 1\nParked: Ferrari in Bay 2\nGarage Full: Cannot park Tesla\nTotal Parked: 2/2", "isHidden": False},
            {"input": "3\n2\nToyota Honda", "expectedOutput": "Parked: Toyota in Bay 1\nParked: Honda in Bay 2\nTotal Parked: 2/3", "isHidden": False},
            {"input": "1\n2\nPorsche Corvette", "expectedOutput": "Parked: Porsche in Bay 1\nGarage Full: Cannot park Corvette\nTotal Parked: 1/1", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:35:48 - Object Passing)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Vehicle {
    String name;
    Vehicle(String name) { this.name = name; }
}

class Garage {
    int capacity, count = 0;
    Garage(int capacity) { this.capacity = capacity; }
    void park(Vehicle v) {
        if (count < capacity) {
            count++;
            System.out.println("Parked: " + v.name + " in Bay " + count);
        } else {
            System.out.println("Garage Full: Cannot park " + v.name);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int capacity = sc.nextInt();
        int n = sc.nextInt();
        Garage garage = new Garage(capacity);
        for (int i = 0; i < n; i++) garage.park(new Vehicle(sc.next()));
        System.out.println("Total Parked: " + garage.count + "/" + garage.capacity);
        sc.close();
    }
}""",
        "explanation": "Illustrates inter-object communication where one class manages and interacts with instances of another.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-004",
        "bank": "bank4",
        "title": "Bank Account with Variable Scope & Static Interest Rate",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "Bro Code emphasizes the distinction between local variables, instance variables, and static variables. A static variable belongs to the class itself, and all instances share that single copy.\n\nCreate a BankAccount class where:\n- `annualInterestRate` is a `static double` shared across all accounts.\n- `accountHolder` (String) and `balance` (double) are instance variables.\n- A static method `setInterestRate(double rate)` modifies the shared rate.\n- An instance method `applyAnnualInterest()` adds `(balance * annualInterestRate / 100.0)` to the account balance.\n\nGiven an initial interest rate, N accounts, and an updated interest rate, apply the updated rate to all accounts and print the updated balances.",
        "inputFormat": "The first line contains double rate representing the new static interest rate percentage.\nThe second line contains an integer N representing the number of accounts.\nThe next N lines contain accountHolder (string) and balance (double).",
        "outputFormat": "Print each account's updated balance in the format: \"<holder>: <roundedBalance>\".\nRound balance to 2 decimal places.",
        "constraints": ["0.0 <= rate <= 25.0", "1 <= N <= 20", "0.0 <= balance <= 1000000.0"],
        "sampleInput": "5.0\n2\nAlice 1000.0\nBob 2500.0",
        "sampleOutput": "Alice: 1050.00\nBob: 2625.00",
        "testCases": [
            {"input": "5.0\n2\nAlice 1000.0\nBob 2500.0", "expectedOutput": "Alice: 1050.00\nBob: 2625.00", "isHidden": False},
            {"input": "10.0\n1\nCharlie 500.0", "expectedOutput": "Charlie: 550.00", "isHidden": False},
            {"input": "3.5\n3\nJohn 10000.0\nDave 2000.0\nEmma 450.0", "expectedOutput": "John: 10350.00\nDave: 2070.00\nEmma: 465.75", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:40:27 - Static Keyword)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;
import java.util.Locale;

class BankAccount {
    static double annualInterestRate;
    String holder;
    double balance;

    BankAccount(String holder, double balance) {
        this.holder = holder;
        this.balance = balance;
    }

    static void setInterestRate(double rate) { annualInterestRate = rate; }
    void applyInterest() { balance += (balance * annualInterestRate / 100.0); }
}

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextDouble()) return;
        BankAccount.setInterestRate(sc.nextDouble());

        int n = sc.nextInt();
        BankAccount[] accounts = new BankAccount[n];
        for (int i = 0; i < n; i++) {
            accounts[i] = new BankAccount(sc.next(), sc.nextDouble());
            accounts[i].applyInterest();
        }

        for (BankAccount a : accounts) {
            System.out.printf(Locale.US, "%s: %.2f%n", a.holder, a.balance);
        }
        sc.close();
    }
}""",
        "explanation": "Illustrates how static class members apply globally across all created instances.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-005",
        "bank": "bank4",
        "title": "Hero RPG Character Custom toString Representation",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "In Java, every class inherits from the Object class. Overriding the `toString()` method allows objects to return a descriptive textual representation rather than their memory hashcode.\n\nImplement a Hero class with attributes: name (String), heroClass (String), level (int), and hp (int).\nOverride `toString()` to return:\n\"[Hero: <name> | Class: <heroClass> | Level: <level> | HP: <hp>]\"\n\nRead N heroes and print them directly using `System.out.println(hero)`.",
        "inputFormat": "The first line contains an integer N representing the number of heroes.\nThe next N lines each contain name, heroClass, level, and hp separated by spaces.",
        "outputFormat": "Print the custom string representation for each hero on a separate line.",
        "constraints": ["1 <= N <= 20", "1 <= level <= 100", "1 <= hp <= 10000"],
        "sampleInput": "2\nArthur Warrior 15 350\nMerlin Mage 20 210",
        "sampleOutput": "[Hero: Arthur | Class: Warrior | Level: 15 | HP: 350]\n[Hero: Merlin | Class: Mage | Level: 20 | HP: 210]",
        "testCases": [
            {"input": "2\nArthur Warrior 15 350\nMerlin Mage 20 210", "expectedOutput": "[Hero: Arthur | Class: Warrior | Level: 15 | HP: 350]\n[Hero: Merlin | Class: Mage | Level: 20 | HP: 210]", "isHidden": False},
            {"input": "1\nLegolas Archer 25 280", "expectedOutput": "[Hero: Legolas | Class: Archer | Level: 25 | HP: 280]", "isHidden": False},
            {"input": "3\nGimli Berserker 18 420\nGandalf Wizard 50 600\nFrodo Rogue 5 80", "expectedOutput": "[Hero: Gimli | Class: Berserker | Level: 18 | HP: 420]\n[Hero: Gandalf | Class: Wizard | Level: 50 | HP: 600]\n[Hero: Frodo | Class: Rogue | Level: 5 | HP: 80]", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:24:04 - toString Method)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Hero {
    String name, heroClass;
    int level, hp;

    Hero(String name, String heroClass, int level, int hp) {
        this.name = name;
        this.heroClass = heroClass;
        this.level = level;
        this.hp = hp;
    }

    @Override
    public String toString() {
        return "[Hero: " + name + " | Class: " + heroClass + " | Level: " + level + " | HP: " + hp + "]";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(new Hero(sc.next(), sc.next(), sc.nextInt(), sc.nextInt()));
        }
        sc.close();
    }
}""",
        "explanation": "Overriding toString allows object instances to serialize into readable text formatting.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-006",
        "bank": "bank4",
        "title": "Vehicle Fleet Hierarchy with super Constructor Chaining",
        "topic": "Inheritance & Polymorphism",
        "difficulty": "Medium",
        "recommendedLanguage": "Java",
        "description": "Inheritance allows one class to acquire the attributes and methods of another. The `super` keyword refers to the superclass (parent) object, commonly used in constructor chaining to pass arguments to the parent constructor.\n\nDesign a class hierarchy:\n- Base class `Vehicle` with attributes: brand (String) and topSpeed (int). Constructor: `Vehicle(String brand, int topSpeed)`.\n- Derived class `Car` adds doors (int). Constructor uses `super(brand, topSpeed)`.\n- Derived class `Bicycle` adds hasBell (boolean). Constructor uses `super(brand, topSpeed)`.\n\nRead N vehicle entries and output their complete specifications.",
        "inputFormat": "The first line contains an integer N representing the number of vehicles.\nThe next N lines each start with vehicle type ('CAR' or 'BIKE') followed by:\n- For CAR: brand topSpeed doors\n- For BIKE: brand topSpeed hasBell",
        "outputFormat": "Print each vehicle:\n- For CAR: \"Car -> Brand: <brand>, Speed: <topSpeed> km/h, Doors: <doors>\"\n- For BIKE: \"Bike -> Brand: <brand>, Speed: <topSpeed> km/h, Bell: <hasBell>\"",
        "constraints": ["1 <= N <= 20", "1 <= topSpeed <= 400", "Doors between 2 and 6"],
        "sampleInput": "2\nCAR Ferrari 340 2\nBIKE Trek 45 true",
        "sampleOutput": "Car -> Brand: Ferrari, Speed: 340 km/h, Doors: 2\nBike -> Brand: Trek, Speed: 45 km/h, Bell: true",
        "testCases": [
            {"input": "2\nCAR Ferrari 340 2\nBIKE Trek 45 true", "expectedOutput": "Car -> Brand: Ferrari, Speed: 340 km/h, Doors: 2\nBike -> Brand: Trek, Speed: 45 km/h, Bell: true", "isHidden": False},
            {"input": "1\nCAR Honda 200 4", "expectedOutput": "Car -> Brand: Honda, Speed: 200 km/h, Doors: 4", "isHidden": False},
            {"input": "3\nBIKE Giant 35 false\nCAR Porsche 310 2\nBIKE Scott 40 true", "expectedOutput": "Bike -> Brand: Giant, Speed: 35 km/h, Bell: false\nCar -> Brand: Porsche, Speed: 310 km/h, Doors: 2\nBike -> Brand: Scott, Speed: 40 km/h, Bell: true", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:57:33 - Super Keyword)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Vehicle {
    String brand;
    int topSpeed;
    Vehicle(String brand, int topSpeed) { this.brand = brand; this.topSpeed = topSpeed; }
}

class Car extends Vehicle {
    int doors;
    Car(String brand, int topSpeed, int doors) { super(brand, topSpeed); this.doors = doors; }
    void display() { System.out.println("Car -> Brand: " + brand + ", Speed: " + topSpeed + " km/h, Doors: " + doors); }
}

class Bicycle extends Vehicle {
    boolean hasBell;
    Bicycle(String brand, int topSpeed, boolean hasBell) { super(brand, topSpeed); this.hasBell = hasBell; }
    void display() { System.out.println("Bike -> Brand: " + brand + ", Speed: " + topSpeed + " km/h, Bell: " + hasBell); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            if (type.equalsIgnoreCase("CAR")) new Car(sc.next(), sc.nextInt(), sc.nextInt()).display();
            else new Bicycle(sc.next(), sc.nextInt(), sc.nextBoolean()).display();
        }
        sc.close();
    }
}""",
        "explanation": "Constructor chaining with super ensures base attributes are initialized before child extensions.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-007",
        "bank": "bank4",
        "title": "Animal Kingdom Sound Dispatcher with Method Overriding",
        "topic": "Inheritance & Polymorphism",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "Method overriding allows a subclass to provide a specific implementation of a method that is already defined in its superclass.\n\nCreate a base class `Animal` with method `speak()` that prints \"The animal makes a sound\".\nCreate subclasses:\n- `Dog`: overrides `speak()` to print \"Dog goes *woof*\"\n- `Cat`: overrides `speak()` to print \"Cat goes *meow*\"\n- `Cow`: overrides `speak()` to print \"Cow goes *moo*\"\n\nRead N animal type strings and invoke `speak()` dynamically on each.",
        "inputFormat": "The first line contains an integer N representing the number of animals.\nThe second line contains N space-separated animal names ('dog', 'cat', or 'cow').",
        "outputFormat": "Print the sound produced by each animal on a new line.",
        "constraints": ["1 <= N <= 20", "Input animal names are case-insensitive"],
        "sampleInput": "3\ndog cat cow",
        "sampleOutput": "Dog goes *woof*\nCat goes *meow*\nCow goes *moo*",
        "testCases": [
            {"input": "3\ndog cat cow", "expectedOutput": "Dog goes *woof*\nCat goes *meow*\nCow goes *moo*", "isHidden": False},
            {"input": "2\ncat dog", "expectedOutput": "Cat goes *meow*\nDog goes *woof*", "isHidden": False},
            {"input": "4\ncow cow dog cat", "expectedOutput": "Cow goes *moo*\nCow goes *moo*\nDog goes *woof*\nCat goes *meow*", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (03:53:45 - Method Overriding)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class Animal { void speak() { System.out.println("The animal makes a sound"); } }
class Dog extends Animal { void speak() { System.out.println("Dog goes *woof*"); } }
class Cat extends Animal { void speak() { System.out.println("Cat goes *meow*"); } }
class Cow extends Animal { void speak() { System.out.println("Cow goes *moo*"); } }

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String name = sc.next().toLowerCase();
            Animal a = name.equals("dog") ? new Dog() : name.equals("cat") ? new Cat() : name.equals("cow") ? new Cow() : new Animal();
            a.speak();
        }
        sc.close();
    }
}""",
        "explanation": "Subclasses provide specialized behaviors while adhering to the common base class contract.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-008",
        "bank": "bank4",
        "title": "Abstract Payment Gateway System",
        "topic": "Inheritance & Polymorphism",
        "difficulty": "Medium",
        "recommendedLanguage": "Java",
        "description": "Abstract classes cannot be instantiated and are used to define a blueprint for subclasses. An abstract method has a signature but no body; subclasses must implement all abstract methods.\n\nCreate an `abstract class Payment`:\n- Protected attribute: `double amount`\n- Constructor `Payment(double amount)`\n- Abstract method: `abstract void processPayment()`\n\nImplement concrete subclasses:\n- `CreditCardPayment`: deducts 2% transaction fee and prints:\n  \"Paid $<amount> via Credit Card (Fee: $<fee> | Net: $<net>)\"\n- `PayPalPayment`: deducts 1.5% fee and prints:\n  \"Paid $<amount> via PayPal (Fee: $<fee> | Net: $<net>)\"\n- `CryptoPayment`: 0% fee (0.00 fee) and prints:\n  \"Paid $<amount> via Crypto (Fee: $0.00 | Net: $<amount>)\"\n\nFormat currency to 2 decimal places.",
        "inputFormat": "The first line contains an integer N representing the number of transactions.\nThe next N lines each contain the payment method ('CREDIT', 'PAYPAL', or 'CRYPTO') and amount (double).",
        "outputFormat": "Print the payment receipt for each transaction on a new line.",
        "constraints": ["1 <= N <= 20", "1.0 <= amount <= 10000.0"],
        "sampleInput": "3\nCREDIT 100.0\nPAYPAL 200.0\nCRYPTO 50.0",
        "sampleOutput": "Paid $100.00 via Credit Card (Fee: $2.00 | Net: $98.00)\nPaid $200.00 via PayPal (Fee: $3.00 | Net: $197.00)\nPaid $50.00 via Crypto (Fee: $0.00 | Net: $50.00)",
        "testCases": [
            {"input": "3\nCREDIT 100.0\nPAYPAL 200.0\nCRYPTO 50.0", "expectedOutput": "Paid $100.00 via Credit Card (Fee: $2.00 | Net: $98.00)\nPaid $200.00 via PayPal (Fee: $3.00 | Net: $197.00)\nPaid $50.00 via Crypto (Fee: $0.00 | Net: $50.00)", "isHidden": False},
            {"input": "1\nPAYPAL 500.0", "expectedOutput": "Paid $500.00 via PayPal (Fee: $7.50 | Net: $492.50)", "isHidden": False},
            {"input": "2\nCRYPTO 1000.0\nCREDIT 250.0", "expectedOutput": "Paid $1000.00 via Crypto (Fee: $0.00 | Net: $1000.00)\nPaid $250.00 via Credit Card (Fee: $5.00 | Net: $245.00)", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (04:05:06 - Abstraction)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;
import java.util.Locale;

abstract class Payment {
    double amount;
    Payment(double amount) { this.amount = amount; }
    abstract void processPayment();
}

class CreditCardPayment extends Payment {
    CreditCardPayment(double a) { super(a); }
    void processPayment() {
        double fee = amount * 0.02;
        System.out.printf(Locale.US, "Paid $%.2f via Credit Card (Fee: $%.2f | Net: $%.2f)%n", amount, fee, amount - fee);
    }
}

class PayPalPayment extends Payment {
    PayPalPayment(double a) { super(a); }
    void processPayment() {
        double fee = amount * 0.015;
        System.out.printf(Locale.US, "Paid $%.2f via PayPal (Fee: $%.2f | Net: $%.2f)%n", amount, fee, amount - fee);
    }
}

class CryptoPayment extends Payment {
    CryptoPayment(double a) { super(a); }
    void processPayment() {
        System.out.printf(Locale.US, "Paid $%.2f via Crypto (Fee: $0.00 | Net: $%.2f)%n", amount, amount);
    }
}

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next().toUpperCase();
            double amt = sc.nextDouble();
            Payment p = type.equals("CREDIT") ? new CreditCardPayment(amt) : type.equals("PAYPAL") ? new PayPalPayment(amt) : new CryptoPayment(amt);
            p.processPayment();
        }
        sc.close();
    }
}""",
        "explanation": "Abstract classes enforce that all subclasses implement domain-specific calculation methods.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-009",
        "bank": "bank4",
        "title": "Secure User Profile with Strict Encapsulation",
        "topic": "Object-Oriented Programming",
        "difficulty": "Easy",
        "recommendedLanguage": "Java",
        "description": "Encapsulation hides an object's internal state and requires all interaction to occur through public getter and setter methods. This allows developers to validate data before updating attributes.\n\nCreate a UserAccount class with private fields: username, password, email.\nProvide getters and setters with validation rules:\n- `setPassword(String p)`: must be >= 8 chars and contain >= 1 digit.\n- `setEmail(String e)`: must contain '@' and '.' after '@'.\n\nRead registration attempts and output whether each profile was successfully created or rejected.",
        "inputFormat": "The first line contains an integer N representing registration attempts.\nThe next N lines each contain username, password, and email.",
        "outputFormat": "For each user:\n- If password fails: \"Error: Weak password for <username>\"\n- If email fails: \"Error: Invalid email for <username>\"\n- If both pass: \"User <username> registered successfully\"",
        "constraints": ["1 <= N <= 20", "Inputs are single words with no spaces"],
        "sampleInput": "3\nAlice pass123 alice@domain.com\nBob short bob@test.com\nCharlie pass1234 charlie_at_test.com",
        "sampleOutput": "User Alice registered successfully\nError: Weak password for Bob\nError: Invalid email for Charlie",
        "testCases": [
            {"input": "3\nAlice pass123 alice@domain.com\nBob short bob@test.com\nCharlie pass1234 charlie_at_test.com", "expectedOutput": "User Alice registered successfully\nError: Weak password for Bob\nError: Invalid email for Charlie", "isHidden": False},
            {"input": "1\nDave d1234567 dave@work.org", "expectedOutput": "User Dave registered successfully", "isHidden": False},
            {"input": "2\nEve password12 eve@com\nFrank 12345678 frank@mail.edu", "expectedOutput": "Error: Invalid email for Eve\nUser Frank registered successfully", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (04:19:39 - Encapsulation)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class UserAccount {
    private String u, p, e;
    UserAccount(String u) { this.u = u; }
    boolean setPassword(String pass) {
        if (pass.length() < 8) return false;
        boolean hasDigit = false;
        for (char c : pass.toCharArray()) if (Character.isDigit(c)) { hasDigit = true; break; }
        if (hasDigit) { this.p = pass; return true; }
        return false;
    }
    boolean setEmail(String mail) {
        int at = mail.indexOf('@'), dot = mail.lastIndexOf('.');
        if (at > 0 && dot > at + 1 && dot < mail.length() - 1) { this.e = mail; return true; }
        return false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String u = sc.next(), p = sc.next(), e = sc.next();
            UserAccount acc = new UserAccount(u);
            if (!acc.setPassword(p)) System.out.println("Error: Weak password for " + u);
            else if (!acc.setEmail(e)) System.out.println("Error: Invalid email for " + u);
            else System.out.println("User " + u + " registered successfully");
        }
        sc.close();
    }
}""",
        "explanation": "Validating input parameters within encapsulation setters protects internal object consistency.",
        "extractionStatus": "verified"
    },
    {
        "id": "bank4-010",
        "bank": "bank4",
        "title": "Smart Home Device Duplicator using Copy Constructors",
        "topic": "Object-Oriented Programming",
        "difficulty": "Medium",
        "recommendedLanguage": "Java",
        "description": "In Java, assigning one object variable to another (`b = a`) only copies the reference. To create a true independent clone, developers implement copy constructors.\n\nCreate a SmartDevice class with name, room, and brightness (0-100).\nProvide a copy constructor `SmartDevice(SmartDevice other)`.\nRead an original device configuration, clone it using the copy constructor, apply an updated brightness value ONLY to the copy, and print both objects to prove they maintain separate states.",
        "inputFormat": "The first line contains name, room, and initial brightness of the original device.\nThe second line contains the updated brightness value for the copied device.",
        "outputFormat": "Print:\n\"Original: <name> in <room> (Brightness: <originalBrightness>%)\"\n\"Copy: <name> in <room> (Brightness: <updatedBrightness>%)\"",
        "constraints": ["0 <= brightness <= 100", "Device and room names have no spaces"],
        "sampleInput": "LivingRoomLight LivingRoom 75\n30",
        "sampleOutput": "Original: LivingRoomLight in LivingRoom (Brightness: 75%)\nCopy: LivingRoomLight in LivingRoom (Brightness: 30%)",
        "testCases": [
            {"input": "LivingRoomLight LivingRoom 75\n30", "expectedOutput": "Original: LivingRoomLight in LivingRoom (Brightness: 75%)\nCopy: LivingRoomLight in LivingRoom (Brightness: 30%)", "isHidden": False},
            {"input": "KitchenLamp Kitchen 100\n50", "expectedOutput": "Original: KitchenLamp in Kitchen (Brightness: 100%)\nCopy: KitchenLamp in Kitchen (Brightness: 50%)", "isHidden": False},
            {"input": "DeskFan Office 40\n90", "expectedOutput": "Original: DeskFan in Office (Brightness: 40%)\nCopy: DeskFan in Office (Brightness: 90%)", "isHidden": True}
        ],
        "sourceScreenshot": "Bro Code Java Full Course (04:27:30 - Copy Objects)",
        "starterCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n        sc.close();\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

class SmartDevice {
    String name, room;
    int brightness;
    SmartDevice(String name, String room, int brightness) { this.name = name; this.room = room; this.brightness = brightness; }
    SmartDevice(SmartDevice o) { this(o.name, o.room, o.brightness); }
    String getStatus() { return name + " in " + room + " (Brightness: " + brightness + "%)"; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        SmartDevice orig = new SmartDevice(sc.next(), sc.next(), sc.nextInt());
        SmartDevice clone = new SmartDevice(orig);
        clone.brightness = sc.nextInt();
        System.out.println("Original: " + orig.getStatus());
        System.out.println("Copy: " + clone.getStatus());
        sc.close();
    }
}""",
        "explanation": "Copy constructors produce deep independent duplicates, preventing accidental shared state side-effects.",
        "extractionStatus": "verified"
    }
]

# Now read questions 11 to 32 from generate_bank4_questions.py
with open('scripts/generate_bank4_questions.py', 'r', encoding='utf-8') as f:
    code = f.read()

# We can execute the questions.append logic or parse them
# Let's execute the file safely in a local dict
loc = {'questions': []}
# Find where questions 11 starts: from 'questions.append({\n    "id": "bank4-011"'
idx = code.find('"id": "bank4-011"')
if idx != -1:
    # find preceding questions.append({
    start_pos = code.rfind('questions.append({', 0, idx)
    end_pos = code.find('print(f"Total questions created:', start_pos)
    chunk = code[start_pos:end_pos]
    exec(chunk, loc)
    print(f"Loaded {len(loc['questions'])} questions from part 2 (bank4-011 to bank4-032)")

all_questions = questions_1_to_10 + loc['questions']
print(f"Total Bank 4 questions: {len(all_questions)}")

with open('questions_bank4.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print("Saved questions_bank4.json with all 32 questions successfully!")
