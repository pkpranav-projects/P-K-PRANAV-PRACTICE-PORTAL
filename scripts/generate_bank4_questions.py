import json
import os

with open('scripts/generate_bank4_questions.py', 'r', encoding='utf-8') as f:
    header_content = f.read()

# Let's write the complete generator script with all 32 questions
part2 = '''
# ==========================================
# 3. Polymorphism & Interfaces
# ==========================================
questions.append({
    "id": "bank4-011",
    "bank": "bank4",
    "title": "Shape Area & Perimeter Calculator via Abstract Classes",
    "topic": "Inheritance & Polymorphism",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Polymorphism allows objects of different classes to be treated as objects of a common superclass.

Create an abstract class `Shape` with abstract methods:
- `abstract double area()`
- `abstract double perimeter()`

Implement subclasses:
- `Circle`: radius r. Area = pi * r^2, Perimeter = 2 * pi * r (use Math.PI).
- `Rectangle`: width w, height h. Area = w * h, Perimeter = 2 * (w + h).

Read N shape commands and print each shape's computed area and perimeter formatted to 2 decimal places.""",
    "inputFormat": """The first line contains an integer N representing the number of shapes.
The next N lines each contain:
- 'CIRCLE <radius>'
- 'RECTANGLE <width> <height>'""",
    "outputFormat": """Print each shape formatted as:
"<Type> -> Area: <area>, Perimeter: <perimeter>" (formatted to 2 decimal places).""",
    "constraints": ["1 <= N <= 20", "1.0 <= radius, width, height <= 1000.0"],
    "sampleInput": "2\\nCIRCLE 5.0\\nRECTANGLE 4.0 6.0",
    "sampleOutput": "Circle -> Area: 78.54, Perimeter: 31.42\\nRectangle -> Area: 24.00, Perimeter: 20.00",
    "testCases": [
        {"input": "2\\nCIRCLE 5.0\\nRECTANGLE 4.0 6.0", "expectedOutput": "Circle -> Area: 78.54, Perimeter: 31.42\\nRectangle -> Area: 24.00, Perimeter: 20.00", "isHidden": False},
        {"input": "1\\nCIRCLE 10.0", "expectedOutput": "Circle -> Area: 314.16, Perimeter: 62.83", "isHidden": False},
        {"input": "2\\nRECTANGLE 2.5 8.0\\nCIRCLE 1.0", "expectedOutput": "Rectangle -> Area: 20.00, Perimeter: 21.00\\nCircle -> Area: 3.14, Perimeter: 6.28", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:41:19 - Polymorphism)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.util.Locale;

abstract class Shape {
    abstract double area();
    abstract double perimeter();
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
    double perimeter() { return 2 * Math.PI * r; }
}

class Rectangle extends Shape {
    double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    double area() { return w * h; }
    double perimeter() { return 2 * (w + h); }
}

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next().toUpperCase();
            if (type.equals("CIRCLE")) {
                Circle c = new Circle(sc.nextDouble());
                System.out.printf(Locale.US, "Circle -> Area: %.2f, Perimeter: %.2f%n", c.area(), c.perimeter());
            } else {
                Rectangle r = new Rectangle(sc.nextDouble(), sc.nextDouble());
                System.out.printf(Locale.US, "Rectangle -> Area: %.2f, Perimeter: %.2f%n", r.area(), r.perimeter());
            }
        }
        sc.close();
    }
}""",
    "explanation": "Demonstrates abstract base class polymorphism where distinct shapes compute geometrical metrics uniformly.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-012",
    "bank": "bank4",
    "title": "Multi-Vehicle Dynamic Polymorphism Fleet Simulator",
    "topic": "Inheritance & Polymorphism",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Dynamic polymorphism (runtime polymorphism) occurs when the exact method implementation to execute is resolved during program execution based on user selection.

Create a base class `Vehicle` with method `go()` that prints "The vehicle moves".
Create subclasses:
- `Car`: `go()` prints "The car drives forward on the highway"
- `Boat`: `go()` prints "The boat sails across the water"
- `Airplane`: `go()` prints "The airplane flies through the clouds"

The user inputs a numeric choice (1 for Car, 2 for Boat, 3 for Airplane). Instantiate the appropriate subclass into a single `Vehicle` reference variable and call `go()`.""",
    "inputFormat": """The first line contains an integer N representing the number of vehicle choices.
The second line contains N space-separated integers (1, 2, or 3).""",
    "outputFormat": """Print the corresponding movement message for each vehicle choice.""",
    "constraints": ["1 <= N <= 20", "Choice is 1, 2, or 3"],
    "sampleInput": "3\\n1 2 3",
    "sampleOutput": "The car drives forward on the highway\\nThe boat sails across the water\\nThe airplane flies through the clouds",
    "testCases": [
        {"input": "3\\n1 2 3", "expectedOutput": "The car drives forward on the highway\\nThe boat sails across the water\\nThe airplane flies through the clouds", "isHidden": False},
        {"input": "2\\n3 1", "expectedOutput": "The airplane flies through the clouds\\nThe car drives forward on the highway", "isHidden": False},
        {"input": "4\\n2 2 1 3", "expectedOutput": "The boat sails across the water\\nThe boat sails across the water\\nThe car drives forward on the highway\\nThe airplane flies through the clouds", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:46:55 - Dynamic Polymorphism)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

class Vehicle {
    void go() {
        System.out.println("The vehicle moves");
    }
}

class Car extends Vehicle {
    @Override
    void go() {
        System.out.println("The car drives forward on the highway");
    }
}

class Boat extends Vehicle {
    @Override
    void go() {
        System.out.println("The boat sails across the water");
    }
}

class Airplane extends Vehicle {
    @Override
    void go() {
        System.out.println("The airplane flies through the clouds");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int choice = sc.nextInt();
            Vehicle v;
            if (choice == 1) v = new Car();
            else if (choice == 2) v = new Boat();
            else v = new Airplane();
            v.go();
        }
        sc.close();
    }
}""",
    "explanation": "Runtime dispatch assigns polymorphic subclasses to parent Vehicle reference variables dynamically.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-013",
    "bank": "bank4",
    "title": "Predator and Prey Multi-Interface Simulation",
    "topic": "Interfaces & Generics",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """An interface in Java is a template of methods. A class can implement multiple interfaces, allowing developers to model multifaceted behaviors.

Define two interfaces:
- `Prey`: method `void flee()`
- `Predator`: method `void hunt()`

Implement the following creatures:
- `Rabbit`: implements `Prey` -> `flee()` prints "The rabbit is running away!"
- `Hawk`: implements `Predator` -> `hunt()` prints "The hawk is hunting for food!"
- `Fish`: implements BOTH `Prey` AND `Predator` ->
  - `flee()` prints "The fish is fleeing from a larger fish!"
  - `hunt()` prints "The fish is hunting smaller fish!"

Read N creature action queries formatted as '<Creature> <Action>' where Action is 'FLEE' or 'HUNT'. Output the corresponding action or 'Action Not Supported' if the creature does not implement that interface.""",
    "inputFormat": """The first line contains an integer N representing the number of queries.
The next N lines each contain creatureName ('Rabbit', 'Hawk', or 'Fish') and action ('FLEE' or 'HUNT').""",
    "outputFormat": """Print the triggered action string for each query.""",
    "constraints": ["1 <= N <= 20", "Creature names are case-insensitive"],
    "sampleInput": "4\\nRabbit FLEE\\nHawk HUNT\\nFish FLEE\\nHawk FLEE",
    "sampleOutput": "The rabbit is running away!\\nThe hawk is hunting for food!\\nThe fish is fleeing from a larger fish!\\nAction Not Supported",
    "testCases": [
        {"input": "4\\nRabbit FLEE\\nHawk HUNT\\nFish FLEE\\nHawk FLEE", "expectedOutput": "The rabbit is running away!\\nThe hawk is hunting for food!\\nThe fish is fleeing from a larger fish!\\nAction Not Supported", "isHidden": False},
        {"input": "2\\nFish HUNT\\nRabbit HUNT", "expectedOutput": "The fish is hunting smaller fish!\\nAction Not Supported", "isHidden": False},
        {"input": "3\\nHawk HUNT\\nFish FLEE\\nFish HUNT", "expectedOutput": "The hawk is hunting for food!\\nThe fish is fleeing from a larger fish!\\nThe fish is hunting smaller fish!", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:30:15 - Interface)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

interface Prey {
    void flee();
}

interface Predator {
    void hunt();
}

class Rabbit implements Prey {
    public void flee() { System.out.println("The rabbit is running away!"); }
}

class Hawk implements Predator {
    public void hunt() { System.out.println("The hawk is hunting for food!"); }
}

class Fish implements Prey, Predator {
    public void flee() { System.out.println("The fish is fleeing from a larger fish!"); }
    public void hunt() { System.out.println("The fish is hunting smaller fish!"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Rabbit rabbit = new Rabbit();
        Hawk hawk = new Hawk();
        Fish fish = new Fish();

        for (int i = 0; i < n; i++) {
            String creature = sc.next().toLowerCase();
            String action = sc.next().toUpperCase();

            if (creature.equals("rabbit")) {
                if (action.equals("FLEE")) rabbit.flee();
                else System.out.println("Action Not Supported");
            } else if (creature.equals("hawk")) {
                if (action.equals("HUNT")) hawk.hunt();
                else System.out.println("Action Not Supported");
            } else if (creature.equals("fish")) {
                if (action.equals("FLEE")) fish.flee();
                else if (action.equals("HUNT")) fish.hunt();
                else System.out.println("Action Not Supported");
            }
        }
        sc.close();
    }
}""",
    "explanation": "Illustrates multiple interface implementation where a single entity exhibits multiple contracts.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-014",
    "bank": "bank4",
    "title": "Media Player Unified Interface",
    "topic": "Interfaces & Generics",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Interfaces declare standard operations that disparate hardware or software modules must support.

Create a `Playable` interface:
- `void play(String title)`
- `void pause()`
- `void stop()`

Implement:
- `AudioPlayer`: `play` prints "Audio Playing: <title>.mp3", `pause` prints "Audio Paused", `stop` prints "Audio Stopped".
- `VideoPlayer`: `play` prints "Video Streaming: <title>.mp4", `pause` prints "Video Paused", `stop` prints "Video Stopped".

Given a series of player types and commands, execute them via a Playable reference.""",
    "inputFormat": """The first line contains an integer N representing commands.
The next N lines each contain:
- 'AUDIO PLAY <title>'
- 'AUDIO PAUSE'
- 'AUDIO STOP'
- 'VIDEO PLAY <title>'
- 'VIDEO PAUSE'
- 'VIDEO STOP'""",
    "outputFormat": """Print the player action output for each command.""",
    "constraints": ["1 <= N <= 20", "Titles contain no spaces"],
    "sampleInput": "4\\nAUDIO PLAY BohemianRhapsody\\nAUDIO PAUSE\\nVIDEO PLAY Avatar\\nVIDEO STOP",
    "sampleOutput": "Audio Playing: BohemianRhapsody.mp3\\nAudio Paused\\nVideo Streaming: Avatar.mp4\\nVideo Stopped",
    "testCases": [
        {"input": "4\\nAUDIO PLAY BohemianRhapsody\\nAUDIO PAUSE\\nVIDEO PLAY Avatar\\nVIDEO STOP", "expectedOutput": "Audio Playing: BohemianRhapsody.mp3\\nAudio Paused\\nVideo Streaming: Avatar.mp4\\nVideo Stopped", "isHidden": False},
        {"input": "2\\nAUDIO STOP\\nVIDEO PAUSE", "expectedOutput": "Audio Stopped\\nVideo Paused", "isHidden": False},
        {"input": "3\\nVIDEO PLAY Inception\\nAUDIO PLAY HotelCalifornia\\nAUDIO STOP", "expectedOutput": "Video Streaming: Inception.mp4\\nAudio Playing: HotelCalifornia.mp3\\nAudio Stopped", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:30:15 - Interfaces)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

interface Playable {
    void play(String title);
    void pause();
    void stop();
}

class AudioPlayer implements Playable {
    public void play(String title) { System.out.println("Audio Playing: " + title + ".mp3"); }
    public void pause() { System.out.println("Audio Paused"); }
    public void stop() { System.out.println("Audio Stopped"); }
}

class VideoPlayer implements Playable {
    public void play(String title) { System.out.println("Video Streaming: " + title + ".mp4"); }
    public void pause() { System.out.println("Video Paused"); }
    public void stop() { System.out.println("Video Stopped"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        AudioPlayer audio = new AudioPlayer();
        VideoPlayer video = new VideoPlayer();

        for (int i = 0; i < n; i++) {
            String device = sc.next().toUpperCase();
            String cmd = sc.next().toUpperCase();
            Playable p = device.equals("AUDIO") ? audio : video;

            if (cmd.equals("PLAY")) {
                p.play(sc.next());
            } else if (cmd.equals("PAUSE")) {
                p.pause();
            } else {
                p.stop();
            }
        }
        sc.close();
    }
}""",
    "explanation": "Standardized interface contracts allow diverse media playback implementations.",
    "extractionStatus": "verified"
})

# ==========================================
# 4. Exception Handling & Defensive Coding
# ==========================================
questions.append({
    "id": "bank4-015",
    "bank": "bank4",
    "title": "Safe Math Division with ArithmeticException & InputMismatchException",
    "topic": "Exception Handling",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """An exception is an event that occurs during the execution of a program that disrupts the normal flow of instructions. Handling exceptions prevents programs from crashing.

Write a program that takes two tokens representing a numerator and denominator.
- If the denominator is 0, catch `ArithmeticException` and print: "Error: Cannot divide by zero"
- If either input is not a valid integer, catch `NumberFormatException` and print: "Error: Invalid integer input"
- If inputs are valid and denominator != 0, print the integer division result: "Result: <quotient>".""",
    "inputFormat": """The first line contains an integer N representing the number of division attempts.
The next N lines each contain two string tokens (numerator and denominator).""",
    "outputFormat": """Print the result or corresponding error message for each attempt.""",
    "constraints": ["1 <= N <= 20", "Inputs can be valid integers or non-numeric strings"],
    "sampleInput": "3\\n10 2\\n10 0\\n10 abc",
    "sampleOutput": "Result: 5\\nError: Cannot divide by zero\\nError: Invalid integer input",
    "testCases": [
        {"input": "3\\n10 2\\n10 0\\n10 abc", "expectedOutput": "Result: 5\\nError: Cannot divide by zero\\nError: Invalid integer input", "isHidden": False},
        {"input": "2\\n100 5\\n25 4", "expectedOutput": "Result: 20\\nResult: 6", "isHidden": False},
        {"input": "3\\nhello world\\n50 0\\n-30 3", "expectedOutput": "Error: Invalid integer input\\nError: Cannot divide by zero\\nResult: -10", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:55:13 - Exception Handling)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String sNum = sc.next();
            String sDen = sc.next();
            try {
                int num = Integer.parseInt(sNum);
                int den = Integer.parseInt(sDen);
                int res = num / den;
                System.out.println("Result: " + res);
            } catch (ArithmeticException e) {
                System.out.println("Error: Cannot divide by zero");
            } catch (NumberFormatException e) {
                System.out.println("Error: Invalid integer input");
            }
        }
        sc.close();
    }
}""",
    "explanation": "Illustrates try-catch blocks guarding against runtime arithmetic anomalies and parse failures.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-016",
    "bank": "bank4",
    "title": "Age Verification Registry with Custom InvalidAgeException",
    "topic": "Exception Handling",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Java allows developers to define custom exceptions by extending the `Exception` class. This provides domain-specific error handling.

Create a custom exception `class InvalidAgeException extends Exception`:
- Constructor: `InvalidAgeException(String message) { super(message); }`

Create a method `void checkAge(int age) throws InvalidAgeException`:
- If `age < 18`: throw new InvalidAgeException("Must be at least 18 years old")
- If `age > 120`: throw new InvalidAgeException("Age cannot exceed 120")
- Otherwise: valid.

Given N voter records with name and age, output whether the applicant is registered or print the caught exception message.""",
    "inputFormat": """The first line contains an integer N representing voter applicants.
The next N lines each contain name (string) and age (int).""",
    "outputFormat": """For valid applicants: "Approved: <name> is registered"
For invalid applicants: "Rejected: <name> -> <exceptionMessage>" """,
    "constraints": ["1 <= N <= 20", "-50 <= age <= 200"],
    "sampleInput": "3\\nAlice 22\\nBob 16\\nMethuselah 130",
    "sampleOutput": "Approved: Alice is registered\\nRejected: Bob -> Must be at least 18 years old\\nRejected: Methuselah -> Age cannot exceed 120",
    "testCases": [
        {"input": "3\\nAlice 22\\nBob 16\\nMethuselah 130", "expectedOutput": "Approved: Alice is registered\\nRejected: Bob -> Must be at least 18 years old\\nRejected: Methuselah -> Age cannot exceed 120", "isHidden": False},
        {"input": "2\\nJohn 18\\nSara 65", "expectedOutput": "Approved: John is registered\\nApproved: Sara is registered", "isHidden": False},
        {"input": "2\\nTim 12\\nGran 125", "expectedOutput": "Rejected: Tim -> Must be at least 18 years old\\nRejected: Gran -> Age cannot exceed 120", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:55:13 - Custom Exceptions)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

class InvalidAgeException extends Exception {
    InvalidAgeException(String msg) { super(msg); }
}

public class Main {
    static void checkAge(int age) throws InvalidAgeException {
        if (age < 18) throw new InvalidAgeException("Must be at least 18 years old");
        if (age > 120) throw new InvalidAgeException("Age cannot exceed 120");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int age = sc.nextInt();
            try {
                checkAge(age);
                System.out.println("Approved: " + name + " is registered");
            } catch (InvalidAgeException e) {
                System.out.println("Rejected: " + name + " -> " + e.getMessage());
            }
        }
        sc.close();
    }
}""",
    "explanation": "Custom exceptions encapsulate application-specific validation business rules cleanly.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-017",
    "bank": "bank4",
    "title": "Inventory Stock Dispenser with InsufficientStockException",
    "topic": "Exception Handling",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Write an inventory dispenser class that tracks available item stock.
Define a custom checked exception `InsufficientStockException`.

A method `void dispense(int requestedQuantity) throws InsufficientStockException`:
- If `requestedQuantity > currentStock`, throw `InsufficientStockException("Requested <requested>, but only <available> remaining")`.
- If valid, subtract `requestedQuantity` from stock and print: "Dispensed: <requested> | Remaining: <remaining>".

Given initial stock S and N order requests, process each order using try-catch to ensure the inventory stays operational.""",
    "inputFormat": """The first line contains an integer S representing initial stock.
The second line contains an integer N representing order count.
The third line contains N space-separated integers representing requested quantities.""",
    "outputFormat": """Print the transaction status or exception message for each request.
On the final line, print: "Final Stock: <remaining>".""",
    "constraints": ["1 <= S <= 500", "1 <= N <= 20", "1 <= requested <= 100"],
    "sampleInput": "20\\n4\\n5 10 8 3",
    "sampleOutput": "Dispensed: 5 | Remaining: 15\\nDispensed: 10 | Remaining: 5\\nError: Requested 8, but only 5 remaining\\nDispensed: 3 | Remaining: 2\\nFinal Stock: 2",
    "testCases": [
        {"input": "20\\n4\\n5 10 8 3", "expectedOutput": "Dispensed: 5 | Remaining: 15\\nDispensed: 10 | Remaining: 5\\nError: Requested 8, but only 5 remaining\\nDispensed: 3 | Remaining: 2\\nFinal Stock: 2", "isHidden": False},
        {"input": "10\\n2\\n4 6", "expectedOutput": "Dispensed: 4 | Remaining: 6\\nDispensed: 6 | Remaining: 0\\nFinal Stock: 0", "isHidden": False},
        {"input": "5\\n3\\n2 10 1", "expectedOutput": "Dispensed: 2 | Remaining: 3\\nError: Requested 10, but only 3 remaining\\nDispensed: 1 | Remaining: 2\\nFinal Stock: 2", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:55:13 - Exception Handling)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

class InsufficientStockException extends Exception {
    InsufficientStockException(String msg) { super(msg); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int stock = sc.nextInt();
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int req = sc.nextInt();
            try {
                if (req > stock) {
                    throw new InsufficientStockException("Requested " + req + ", but only " + stock + " remaining");
                }
                stock -= req;
                System.out.println("Dispensed: " + req + " | Remaining: " + stock);
            } catch (InsufficientStockException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
        System.out.println("Final Stock: " + stock);
        sc.close();
    }
}""",
    "explanation": "Guarantees transactional integrity by throwing exceptions when requested operations cannot be safely completed.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-018",
    "bank": "bank4",
    "title": "Robust Grade Processor with Multi-Catch & Finally Cleanup",
    "topic": "Exception Handling",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """The `finally` block in Java always executes regardless of whether an exception was thrown or caught. It is typically used for resource deallocation, logging, and state confirmation.

Given an array of string grade tokens:
Process an access query `GET <index>`:
- Parse the token at `index` to an integer.
- Catch `ArrayIndexOutOfBoundsException` -> print "Error: Index out of range"
- Catch `NumberFormatException` -> print "Error: Non-numeric grade entry"
- If successful -> print "Grade: <val>"
- The `finally` block must ALWAYS print: "Lookup Processed".""",
    "inputFormat": """The first line contains an integer N representing the array size.
The second line contains N space-separated tokens.
The third line contains an integer Q representing the number of queries.
The fourth line contains Q space-separated index integers.""",
    "outputFormat": """For each query, print the result/error followed immediately by the finally message.""",
    "constraints": ["1 <= N <= 20", "1 <= Q <= 20", "Indices can be negative or >= N"],
    "sampleInput": "4\\n95 A+ 82 70\\n3\\n0 1 5",
    "sampleOutput": "Grade: 95\\nLookup Processed\\nError: Non-numeric grade entry\\nLookup Processed\\nError: Index out of range\\nLookup Processed",
    "testCases": [
        {"input": "4\\n95 A+ 82 70\\n3\\n0 1 5", "expectedOutput": "Grade: 95\\nLookup Processed\\nError: Non-numeric grade entry\\nLookup Processed\\nError: Index out of range\\nLookup Processed", "isHidden": False},
        {"input": "2\\n100 88\\n1\\n1", "expectedOutput": "Grade: 88\\nLookup Processed", "isHidden": False},
        {"input": "3\\nFAIL 50 60\\n2\\n-1 0", "expectedOutput": "Error: Index out of range\\nLookup Processed\\nError: Non-numeric grade entry\\nLookup Processed", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (04:55:13 - Finally Block)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        String[] arr = new String[n];
        for (int i = 0; i < n; i++) arr[i] = sc.next();

        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            int idx = sc.nextInt();
            try {
                if (idx < 0 || idx >= n) throw new ArrayIndexOutOfBoundsException();
                int grade = Integer.parseInt(arr[idx]);
                System.out.println("Grade: " + grade);
            } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("Error: Index out of range");
            } catch (NumberFormatException e) {
                System.out.println("Error: Non-numeric grade entry");
            } finally {
                System.out.println("Lookup Processed");
            }
        }
        sc.close();
    }
}""",
    "explanation": "Guarantees resource and logging cleanup across both successful and failed execution paths.",
    "extractionStatus": "verified"
})

# ==========================================
# 5. File Handling & Streams (java.io)
# ==========================================
questions.append({
    "id": "bank4-019",
    "bank": "bank4",
    "title": "Secret Note Logger using FileWriter and FileReader",
    "topic": "File Handling & Streams",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Bro Code demonstrates writing text with `FileWriter` and streaming characters back using `FileReader.read()`.

In this problem, simulate the file write-read cycle:
1. Read a secret message string from standard input.
2. Write the message into a local file named `secret_note.txt` using `FileWriter`.
3. Open `secret_note.txt` with `FileReader`, read all characters until `.read()` returns -1, and print the retrieved content with its character count.""",
    "inputFormat": """A single line containing the secret message text.""",
    "outputFormat": """Print:
"File Written Successfully"
"Read from File: <content>"
"Characters Read: <length>" """,
    "constraints": ["1 <= message length <= 200"],
    "sampleInput": "Bro Code Java Masterclass 2026",
    "sampleOutput": "File Written Successfully\\nRead from File: Bro Code Java Masterclass 2026\\nCharacters Read: 30",
    "testCases": [
        {"input": "Bro Code Java Masterclass 2026", "expectedOutput": "File Written Successfully\\nRead from File: Bro Code Java Masterclass 2026\\nCharacters Read: 30", "isHidden": False},
        {"input": "Hello World", "expectedOutput": "File Written Successfully\\nRead from File: Hello World\\nCharacters Read: 11", "isHidden": False},
        {"input": "Keep coding every day!", "expectedOutput": "File Written Successfully\\nRead from File: Keep coding every day!\\nCharacters Read: 22", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (05:09:15 - FileWriter & 05:12:30 - FileReader)",
    "starterCode": """import java.util.Scanner;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String message = sc.nextLine();

        File file = new File("secret_note.txt");
        try {
            FileWriter writer = new FileWriter(file);
            writer.write(message);
            writer.close();
            System.out.println("File Written Successfully");

            FileReader reader = new FileReader(file);
            StringBuilder sb = new StringBuilder();
            int data = reader.read();
            int count = 0;
            while (data != -1) {
                sb.append((char) data);
                count++;
                data = reader.read();
            }
            reader.close();
            System.out.println("Read from File: " + sb.toString());
            System.out.println("Characters Read: " + count);
        } catch (IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        } finally {
            if (file.exists()) file.delete();
        }
        sc.close();
    }
}""",
    "explanation": "Validates file writing and streaming character-by-character reading with proper resource closure.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-020",
    "bank": "bank4",
    "title": "Word and Character Count File Stream Analyzer",
    "topic": "File Handling & Streams",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Write a text analyzer that computes text file metrics:
Given N lines of text:
1. Count the total number of lines.
2. Count the total number of words (tokens separated by spaces).
3. Count the total number of non-whitespace characters.

Display the summary in a standardized file report format.""",
    "inputFormat": """The first line contains an integer N representing the line count.
The next N lines each contain a sentence of text.""",
    "outputFormat": """Print:
"Lines: <L> | Words: <W> | Non-Space Chars: <C>" """,
    "constraints": ["1 <= N <= 20", "Lines contain alphanumeric characters, spaces, and punctuation"],
    "sampleInput": "2\\nJava is powerful and versatile\\nPractice makes perfect",
    "sampleOutput": "Lines: 2 | Words: 8 | Non-Space Chars: 46",
    "testCases": [
        {"input": "2\\nJava is powerful and versatile\\nPractice makes perfect", "expectedOutput": "Lines: 2 | Words: 8 | Non-Space Chars: 46", "isHidden": False},
        {"input": "1\\nCode everyday", "expectedOutput": "Lines: 1 | Words: 2 | Non-Space Chars: 12", "isHidden": False},
        {"input": "3\\nOne\\nTwo Three\\nFour Five Six", "expectedOutput": "Lines: 3 | Words: 6 | Non-Space Chars: 24", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (05:12:30 - File Streams)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        sc.nextLine(); // consume newline
        int wordCount = 0;
        int charCount = 0;

        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String[] tokens = line.trim().split("\\\\s+");
            if (line.trim().length() > 0) {
                wordCount += tokens.length;
            }
            for (char c : line.toCharArray()) {
                if (!Character.isWhitespace(c)) charCount++;
            }
        }

        System.out.println("Lines: " + n + " | Words: " + wordCount + " | Non-Space Chars: " + charCount);
        sc.close();
    }
}""",
    "explanation": "Simulates stream tokenization and character frequency metrics typical of file inspection tools.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-021",
    "bank": "bank4",
    "title": "System Configuration Parser with Key-Value Reader",
    "topic": "File Handling & Streams",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Configuration files (.properties, .ini) frequently store application settings as `key=value` pairs.

Write a config file parser:
1. Read N configuration lines formatted as `key=value`.
2. Store the pairs in a key-value structure.
3. Read Q query keys and output the resolved setting value or "UNDEFINED" if the key is not present.""",
    "inputFormat": """The first line contains an integer N representing configuration pairs.
The next N lines each contain 'key=value'.
The next line contains an integer Q representing query count.
The next Q lines each contain a query key.""",
    "outputFormat": """For each query key, print: "<key> = <value>" or "<key> = UNDEFINED".""",
    "constraints": ["1 <= N <= 30", "1 <= Q <= 20", "Keys and values contain no spaces"],
    "sampleInput": "3\\nhost=localhost\\nport=8080\\ndebug=true\\n2\\nport\\ntimeout",
    "sampleOutput": "port = 8080\\ntimeout = UNDEFINED",
    "testCases": [
        {"input": "3\\nhost=localhost\\nport=8080\\ndebug=true\\n2\\nport\\ntimeout", "expectedOutput": "port = 8080\\ntimeout = UNDEFINED", "isHidden": False},
        {"input": "1\\nenv=production\\n1\\nenv", "expectedOutput": "env = production", "isHidden": False},
        {"input": "2\\nmax_conn=100\\nssl=enabled\\n2\\nssl\\nversion", "expectedOutput": "ssl = enabled\\nversion = UNDEFINED", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (05:02:31 - File Handling)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<String, String> config = new HashMap<>();

        for (int i = 0; i < n; i++) {
            String line = sc.next();
            String[] parts = line.split("=", 2);
            if (parts.length == 2) {
                config.put(parts[0].trim(), parts[1].trim());
            }
        }

        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            String key = sc.next();
            if (config.containsKey(key)) {
                System.out.println(key + " = " + config.get(key));
            } else {
                System.out.println(key + " = UNDEFINED");
            }
        }
        sc.close();
    }
}""",
    "explanation": "Simulates reading configuration settings from files into runtime memory mappings.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-022",
    "bank": "bank4",
    "title": "Student Report Card Serializer with Object Streams",
    "topic": "File Handling & Streams",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Serialization is the process of converting an object's state into a byte stream, allowing it to be persisted to disk or sent over a network. Deserialization reconstructs the object from bytes.

Create a class `StudentRecord implements java.io.Serializable`:
- Fields: `int id`, `String name`, `double gpa`.
- Method: `String getSummary()` -> "ID: <id> | Name: <name> | GPA: <gpa>".

Write a program that:
1. Instantiates a `StudentRecord` from user input.
2. Serializes it into `student.ser` using `ObjectOutputStream`.
3. Deserializes the record back using `ObjectInputStream`.
4. Prints the validated summary.""",
    "inputFormat": """A single line containing id (int), name (string), and gpa (double).""",
    "outputFormat": """Print:
"Serialized Student Successfully"
"Deserialized: ID: <id> | Name: <name> | GPA: <gpa>" """,
    "constraints": ["1 <= id <= 10000", "0.0 <= gpa <= 4.0"],
    "sampleInput": "101 Pranav 3.95",
    "sampleOutput": "Serialized Student Successfully\\nDeserialized: ID: 101 | Name: Pranav | GPA: 3.95",
    "testCases": [
        {"input": "101 Pranav 3.95", "expectedOutput": "Serialized Student Successfully\\nDeserialized: ID: 101 | Name: Pranav | GPA: 3.95", "isHidden": False},
        {"input": "205 Alice 4.0", "expectedOutput": "Serialized Student Successfully\\nDeserialized: ID: 205 | Name: Alice | GPA: 4.00", "isHidden": False},
        {"input": "309 Bob 3.50", "expectedOutput": "Serialized Student Successfully\\nDeserialized: ID: 309 | Name: Bob | GPA: 3.50", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (Serialization)",
    "starterCode": """import java.util.Scanner;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.io.*;
import java.util.Locale;

class StudentRecord implements Serializable {
    private static final long serialVersionUID = 1L;
    int id;
    String name;
    double gpa;

    StudentRecord(int id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }
}

public class Main {
    public static void main(String[] args) {
        Locale.setDefault(Locale.US);
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int id = sc.nextInt();
        String name = sc.next();
        double gpa = sc.nextDouble();

        StudentRecord original = new StudentRecord(id, name, gpa);
        File file = new File("student.ser");

        try {
            ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
            oos.writeObject(original);
            oos.close();
            System.out.println("Serialized Student Successfully");

            ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
            StudentRecord recovered = (StudentRecord) ois.readObject();
            ois.close();

            System.out.printf(Locale.US, "Deserialized: ID: %d | Name: %s | GPA: %.2f%n", recovered.id, recovered.name, recovered.gpa);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            if (file.exists()) file.delete();
        }
        sc.close();
    }
}""",
    "explanation": "Verifies byte-stream serialization and object resurrection using Java Serializable architecture.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-023",
    "bank": "bank4",
    "title": "CSV Data Table Importer with Formatted Terminal Report",
    "topic": "File Handling & Streams",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Comma-Separated Values (CSV) is the most ubiquitous tabular data export format.

Write a CSV parser and aggregator:
Given N lines of employee data formatted as: `Name,Department,Salary`
1. Parse each record.
2. Track total payroll expense and find the highest earner.
3. Print each formatted row and a summary footer.""",
    "inputFormat": """The first line contains an integer N representing the number of CSV rows.
The next N lines each contain 'Name,Department,Salary'.""",
    "outputFormat": """Print each row as: "[<Department>] <Name> - $<Salary>"
On the next line, print: "Total Payroll: $<sum>"
On the final line, print: "Top Earner: <Name> ($<highestSalary>)" """,
    "constraints": ["1 <= N <= 20", "Salary is an integer >= 1000"],
    "sampleInput": "3\\nAlice,Engineering,90000\\nBob,Marketing,65000\\nCharlie,Engineering,110000",
    "sampleOutput": "[Engineering] Alice - $90000\\n[Marketing] Bob - $65000\\n[Engineering] Charlie - $110000\\nTotal Payroll: $265000\\nTop Earner: Charlie ($110000)",
    "testCases": [
        {"input": "3\\nAlice,Engineering,90000\\nBob,Marketing,65000\\nCharlie,Engineering,110000", "expectedOutput": "[Engineering] Alice - $90000\\n[Marketing] Bob - $65000\\n[Engineering] Charlie - $110000\\nTotal Payroll: $265000\\nTop Earner: Charlie ($110000)", "isHidden": False},
        {"input": "1\\nDiana,Executive,150000", "expectedOutput": "[Executive] Diana - $150000\\nTotal Payroll: $150000\\nTop Earner: Diana ($150000)", "isHidden": False},
        {"input": "2\\nEve,Sales,45000\\nFrank,Sales,50000", "expectedOutput": "[Sales] Eve - $45000\\n[Sales] Frank - $50000\\nTotal Payroll: $95000\\nTop Earner: Frank ($50000)", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Full Course (05:09:15 - File I/O)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        sc.nextLine(); // newline
        long totalPayroll = 0;
        int maxSalary = -1;
        String topEarner = "";

        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            String[] parts = line.split(",");
            String name = parts[0].trim();
            String dept = parts[1].trim();
            int salary = Integer.parseInt(parts[2].trim());

            totalPayroll += salary;
            if (salary > maxSalary) {
                maxSalary = salary;
                topEarner = name;
            }
            System.out.println("[" + dept + "] " + name + " - $" + salary);
        }

        System.out.println("Total Payroll: $" + totalPayroll);
        System.out.println("Top Earner: " + topEarner + " ($" + maxSalary + ")");
        sc.close();
    }
}""",
    "explanation": "Processes delimited record streams to produce formatted aggregations.",
    "extractionStatus": "verified"
})

# ==========================================
# 6. Fun Interactive Video Projects (Bro Code Mini-Projects)
# ==========================================
questions.append({
    "id": "bank4-024",
    "bank": "bank4",
    "title": "Java Interactive CLI Calculator Engine",
    "topic": "Projects & Applications",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """In Bro Code's project portfolio, a console calculator is a cornerstone project demonstrating control flow, switch statements, and arithmetic operators.

Implement an expression calculation engine supporting:
- Addition (`+`)
- Subtraction (`-`)
- Multiplication (`*`)
- Division (`/` with integer division)
- Modulo (`%`)
- Exponentiation (`^` where a^b computes power)

Input commands until 'EXIT' is received. Print each calculation in the format: "<num1> <op> <num2> = <result>".""",
    "inputFormat": """Multiple lines each containing 'num1 op num2' (e.g. '12 + 5').
The input ends with 'EXIT'.""",
    "outputFormat": """For each calculation, print: "<num1> <op> <num2> = <result>".
If division/modulo by zero occurs, print: "Error: Division by zero".
On termination, print: "Calculator Closed".""",
    "constraints": ["Operands are integers", "Supported operators: +, -, *, /, %, ^"],
    "sampleInput": "10 + 5\\n20 / 4\\n2 ^ 8\\n7 % 0\\nEXIT",
    "sampleOutput": "10 + 5 = 15\\n20 / 4 = 5\\n2 ^ 8 = 256\\nError: Division by zero\\nCalculator Closed",
    "testCases": [
        {"input": "10 + 5\\n20 / 4\\n2 ^ 8\\n7 % 0\\nEXIT", "expectedOutput": "10 + 5 = 15\\n20 / 4 = 5\\n2 ^ 8 = 256\\nError: Division by zero\\nCalculator Closed", "isHidden": False},
        {"input": "15 * 3\\n100 - 45\\nEXIT", "expectedOutput": "15 * 3 = 45\\n100 - 45 = 55\\nCalculator Closed", "isHidden": False},
        {"input": "5 ^ 3\\n14 % 4\\nEXIT", "expectedOutput": "5 ^ 3 = 125\\n14 % 4 = 2\\nCalculator Closed", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Calculator)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNext()) {
            String token = sc.next();
            if (token.equalsIgnoreCase("EXIT")) break;
            int num1 = Integer.parseInt(token);
            String op = sc.next();
            int num2 = sc.nextInt();

            if ((op.equals("/") || op.equals("%")) && num2 == 0) {
                System.out.println("Error: Division by zero");
                continue;
            }

            long res = 0;
            switch (op) {
                case "+": res = num1 + num2; break;
                case "-": res = num1 - num2; break;
                case "*": res = (long)num1 * num2; break;
                case "/": res = num1 / num2; break;
                case "%": res = num1 % num2; break;
                case "^": res = (long)Math.pow(num1, num2); break;
            }
            System.out.println(num1 + " " + op + " " + num2 + " = " + res);
        }
        System.out.println("Calculator Closed");
        sc.close();
    }
}""",
    "explanation": "Implements an interactive command-driven arithmetic engine with operator dispatch.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-025",
    "bank": "bank4",
    "title": "Multiple-Choice Trivia Quiz Game Engine",
    "topic": "Projects & Applications",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Bro Code's Java Quiz Game features questions arrays, options 2D arrays, player answer validation, and score evaluation.

Build an automated quiz evaluator:
Given 4 questions where the correct answer keys are:
Q1: C (Which keyword creates an object? -> new)
Q2: B (What is the size of int in Java? -> 4 bytes)
Q3: A (Which package contains Scanner? -> java.util)
Q4: D (Which collection allows unique elements only? -> Set)

Read 4 player choices (characters A, B, C, or D). Evaluate each answer, tally the total score out of 4, and display the final performance rating.""",
    "inputFormat": """A single line containing 4 space-separated characters representing the player's answers (e.g. 'C B A D').""",
    "outputFormat": """Print evaluation for each question:
"Q1: Correct!" or "Q1: Incorrect (Correct: C)"
On the next line, print: "Total Score: <score>/4"
On the final line, print performance:
- 4/4: "Grade: Perfect Score!"
- 3/4: "Grade: Great Job!"
- 2/4: "Grade: Good Effort!"
- <= 1/4: "Grade: Keep Practicing!" """,
    "constraints": ["Answers are characters A, B, C, or D"],
    "sampleInput": "C B A D",
    "sampleOutput": "Q1: Correct!\\nQ2: Correct!\\nQ3: Correct!\\nQ4: Correct!\\nTotal Score: 4/4\\nGrade: Perfect Score!",
    "testCases": [
        {"input": "C B A D", "expectedOutput": "Q1: Correct!\\nQ2: Correct!\\nQ3: Correct!\\nQ4: Correct!\\nTotal Score: 4/4\\nGrade: Perfect Score!", "isHidden": False},
        {"input": "C A A D", "expectedOutput": "Q1: Correct!\\nQ2: Incorrect (Correct: B)\\nQ3: Correct!\\nQ4: Correct!\\nTotal Score: 3/4\\nGrade: Great Job!", "isHidden": False},
        {"input": "A B C D", "expectedOutput": "Q1: Incorrect (Correct: C)\\nQ2: Correct!\\nQ3: Incorrect (Correct: A)\\nQ4: Correct!\\nTotal Score: 2/4\\nGrade: Good Effort!", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Quiz Game)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] correct = {'C', 'B', 'A', 'D'};
        int score = 0;

        for (int i = 0; i < 4; i++) {
            if (!sc.hasNext()) return;
            char ans = sc.next().toUpperCase().charAt(0);
            if (ans == correct[i]) {
                score++;
                System.out.println("Q" + (i + 1) + ": Correct!");
            } else {
                System.out.println("Q" + (i + 1) + ": Incorrect (Correct: " + correct[i] + ")");
            }
        }

        System.out.println("Total Score: " + score + "/4");
        if (score == 4) System.out.println("Grade: Perfect Score!");
        else if (score == 3) System.out.println("Grade: Great Job!");
        else if (score == 2) System.out.println("Grade: Good Effort!");
        else System.out.println("Grade: Keep Practicing!");
        sc.close();
    }
}""",
    "explanation": "Implements an interactive quiz grading loop comparing player response vectors against key matrices.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-026",
    "bank": "bank4",
    "title": "Tic-Tac-Toe Grid Match Engine",
    "topic": "Projects & Applications",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Tic-Tac-Toe is a classic game project taught by Bro Code to master 2D arrays, game state checking, and coordinate translation.

A 3x3 board starts empty (filled with '-'). Players alternate placing 'X' and 'O'.
A player wins if they place 3 of their marks across any row, column, or diagonal.
If all 9 cells are filled and no player has won, it is a Draw.

Read the move sequence (0 to 8 representing cell indices 0..8, where row = idx / 3 and col = idx % 3). Stop immediately when a player wins or all moves are exhausted, and print the outcome.""",
    "inputFormat": """The first line contains an integer M representing the number of moves.
The second line contains M space-separated cell indices (0 to 8). Player 1 is 'X', Player 2 is 'O'.""",
    "outputFormat": """Print:
"Winner: Player X" or "Winner: Player O" or "Result: Draw" or "Game Incomplete" """,
    "constraints": ["1 <= M <= 9", "0 <= cell index <= 8", "All moves in input are unique"],
    "sampleInput": "5\\n0 3 1 4 2",
    "sampleOutput": "Winner: Player X",
    "testCases": [
        {"input": "5\\n0 3 1 4 2", "expectedOutput": "Winner: Player X", "isHidden": False},
        {"input": "9\\n0 1 2 4 3 5 7 6 8", "expectedOutput": "Result: Draw", "isHidden": False},
        {"input": "6\\n0 4 1 3 8 5", "expectedOutput": "Winner: Player O", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Tic Tac Toe)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    static char checkWin(char[][] b) {
        for (int i = 0; i < 3; i++) {
            if (b[i][0] != '-' && b[i][0] == b[i][1] && b[i][1] == b[i][2]) return b[i][0];
            if (b[0][i] != '-' && b[0][i] == b[1][i] && b[1][i] == b[2][i]) return b[0][i];
        }
        if (b[0][0] != '-' && b[0][0] == b[1][1] && b[1][1] == b[2][2]) return b[0][0];
        if (b[0][2] != '-' && b[0][2] == b[1][1] && b[1][1] == b[2][0]) return b[0][2];
        return '-';
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int m = sc.nextInt();
        char[][] b = new char[3][3];
        for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) b[i][j] = '-';

        char winner = '-';
        int movesMade = 0;
        for (int k = 0; k < m; k++) {
            int cell = sc.nextInt();
            char player = (k % 2 == 0) ? 'X' : 'O';
            b[cell / 3][cell % 3] = player;
            movesMade++;
            winner = checkWin(b);
            if (winner != '-') break;
        }

        if (winner == 'X') System.out.println("Winner: Player X");
        else if (winner == 'O') System.out.println("Winner: Player O");
        else if (movesMade == 9) System.out.println("Result: Draw");
        else System.out.println("Game Incomplete");
        sc.close();
    }
}""",
    "explanation": "Encapsulates 2D board state manipulation, alternate turn dispatch, and victory condition evaluation.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-027",
    "bank": "bank4",
    "title": "Rock-Paper-Scissors-Lizard-Spock Tournament Simulator",
    "topic": "Projects & Applications",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """An extended version of the Rock-Paper-Scissors game project taught by Bro Code.
Rules:
- Scissors cuts Paper
- Paper covers Rock
- Rock crushes Lizard
- Lizard poisons Spock
- Spock smashes Scissors
- Scissors decapitates Lizard
- Lizard eats Paper
- Paper disproves Spock
- Spock vaporizes Rock
- Rock crushes Scissors

Given N rounds of Player 1 and Player 2 moves, determine the round winners and declare the final tournament champion.""",
    "inputFormat": """The first line contains an integer N representing rounds.
The next N lines each contain Player 1 move and Player 2 move (Rock, Paper, Scissors, Lizard, Spock).""",
    "outputFormat": """Print each round: "Round <i>: <Winner>" (where Winner is 'Player 1', 'Player 2', or 'Tie').
On the final line, print the champion: "Champion: Player 1" or "Champion: Player 2" or "Tournament Tie".""",
    "constraints": ["1 <= N <= 20", "Moves are valid capitalized strings"],
    "sampleInput": "3\\nRock Scissors\\nPaper Rock\\nSpock Spock",
    "sampleOutput": "Round 1: Player 1\\nRound 2: Player 1\\nRound 3: Tie\\nChampion: Player 1",
    "testCases": [
        {"input": "3\\nRock Scissors\\nPaper Rock\\nSpock Spock", "expectedOutput": "Round 1: Player 1\\nRound 2: Player 1\\nRound 3: Tie\\nChampion: Player 1", "isHidden": False},
        {"input": "2\\nLizard Rock\\nPaper Scissors", "expectedOutput": "Round 1: Player 2\\nRound 2: Player 2\\nChampion: Player 2", "isHidden": False},
        {"input": "1\\nScissors Paper", "expectedOutput": "Round 1: Player 1\\nChampion: Player 1", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Rock Paper Scissors)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.util.Arrays;
import java.util.List;

public class Main {
    static boolean beats(String m1, String m2) {
        if (m1.equals("Scissors") && (m2.equals("Paper") || m2.equals("Lizard"))) return true;
        if (m1.equals("Paper") && (m2.equals("Rock") || m2.equals("Spock"))) return true;
        if (m1.equals("Rock") && (m2.equals("Lizard") || m2.equals("Scissors"))) return true;
        if (m1.equals("Lizard") && (m2.equals("Spock") || m2.equals("Paper"))) return true;
        if (m1.equals("Spock") && (m2.equals("Scissors") || m2.equals("Rock"))) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int p1Score = 0, p2Score = 0;

        for (int i = 1; i <= n; i++) {
            String m1 = sc.next();
            String m2 = sc.next();
            if (m1.equals(m2)) {
                System.out.println("Round " + i + ": Tie");
            } else if (beats(m1, m2)) {
                p1Score++;
                System.out.println("Round " + i + ": Player 1");
            } else {
                p2Score++;
                System.out.println("Round " + i + ": Player 2");
            }
        }

        if (p1Score > p2Score) System.out.println("Champion: Player 1");
        else if (p2Score > p1Score) System.out.println("Champion: Player 2");
        else System.out.println("Tournament Tie");
        sc.close();
    }
}""",
    "explanation": "Models complex conditional game decision trees and multi-round state tracking.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-028",
    "bank": "bank4",
    "title": "Audio Playlist & Track Duration Manager",
    "topic": "Projects & Applications",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Bro Code's course features an Audio Player project utilizing Clip and AudioInputStream.

Model a music playlist management system:
Each track has a `title` (String), `artist` (String), and `durationSeconds` (int).
Given N tracks:
1. List each track formatted as: "[Track <i>] <title> by <artist> (<mm:ss>)"
2. Compute the total playlist run time and format it as `HH:MM:SS` (or `MM:SS` if under 1 hour).""",
    "inputFormat": """The first line contains an integer N representing the track count.
The next N lines each contain title, artist, and durationSeconds.""",
    "outputFormat": """Print each track on a separate line.
On the final line, print: "Total Duration: <formattedTime>".""",
    "constraints": ["1 <= N <= 20", "1 <= durationSeconds <= 7200", "Titles and artists have no spaces"],
    "sampleInput": "2\\nBeliever ImagineDragons 204\\nShapeOfYou EdSheeran 233",
    "sampleOutput": "[Track 1] Believer by ImagineDragons (03:24)\\n[Track 2] ShapeOfYou by EdSheeran (03:53)\\nTotal Duration: 07:17",
    "testCases": [
        {"input": "2\\nBeliever ImagineDragons 204\\nShapeOfYou EdSheeran 233", "expectedOutput": "[Track 1] Believer by ImagineDragons (03:24)\\n[Track 2] ShapeOfYou by EdSheeran (03:53)\\nTotal Duration: 07:17", "isHidden": False},
        {"input": "1\\nEcho PinkFloyd 1400", "expectedOutput": "[Track 1] Echo by PinkFloyd (23:20)\\nTotal Duration: 23:20", "isHidden": False},
        {"input": "3\\nSongA ArtistA 1800\\nSongB ArtistB 1900\\nSongC ArtistC 200", "expectedOutput": "[Track 1] SongA by ArtistA (30:00)\\n[Track 2] SongB by ArtistB (31:40)\\n[Track 3] SongC by ArtistC (03:20)\\nTotal Duration: 01:05:00", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Audio Player)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    static String formatTime(int sec) {
        int h = sec / 3600;
        int m = (sec % 3600) / 60;
        int s = sec % 60;
        if (h > 0) {
            return String.format("%02d:%02d:%02d", h, m, s);
        }
        return String.format("%02d:%02d", m, s);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int totalSec = 0;

        for (int i = 1; i <= n; i++) {
            String title = sc.next();
            String artist = sc.next();
            int dur = sc.nextInt();
            totalSec += dur;
            System.out.println("[Track " + i + "] " + title + " by " + artist + " (" + String.format("%02d:%02d", dur / 60, dur % 60) + ")");
        }

        System.out.println("Total Duration: " + formatTime(totalSec));
        sc.close();
    }
}""",
    "explanation": "Formats composite media durations into standardized human-readable representations.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-029",
    "bank": "bank4",
    "title": "Console Text Editor & Note-Keeper",
    "topic": "Projects & Applications",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """Bro Code's Text Editor project introduces file saving, text manipulation, and line indexing.

Implement a console-based notepad:
Supports commands:
- `APPEND <text>`: adds a line to the end of the document.
- `DELETE <lineIndex>`: deletes the 1-based line index (or prints "Error: Line not found").
- `SEARCH <keyword>`: prints 1-based line numbers containing keyword, or "Not found".
- `SAVE`: prints the complete document lines and exits.""",
    "inputFormat": """A series of command lines ending with 'SAVE'.""",
    "outputFormat": """Print action confirmations and the final saved document.""",
    "constraints": ["1 <= operations <= 30"],
    "sampleInput": "APPEND First line of code\\nAPPEND Second line of notes\\nSEARCH notes\\nDELETE 1\\nSAVE",
    "sampleOutput": "Matches: Line 2\\nDeleted: Line 1\\n--- Document Content ---\\nSecond line of notes\\n--- End of File ---",
    "testCases": [
        {"input": "APPEND First line of code\\nAPPEND Second line of notes\\nSEARCH notes\\nDELETE 1\\nSAVE", "expectedOutput": "Matches: Line 2\\nDeleted: Line 1\\n--- Document Content ---\\nSecond line of notes\\n--- End of File ---", "isHidden": False},
        {"input": "APPEND Hello World\\nSEARCH Java\\nSAVE", "expectedOutput": "Matches: None\\n--- Document Content ---\\nHello World\\n--- End of File ---", "isHidden": False},
        {"input": "APPEND Item A\\nAPPEND Item B\\nDELETE 5\\nSAVE", "expectedOutput": "Error: Line not found\\n--- Document Content ---\\nItem A\\nItem B\\n--- End of File ---", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Text Editor)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> doc = new ArrayList<>();

        while (sc.hasNext()) {
            String cmd = sc.next();
            if (cmd.equalsIgnoreCase("SAVE")) break;

            if (cmd.equalsIgnoreCase("APPEND")) {
                doc.add(sc.nextLine().trim());
            } else if (cmd.equalsIgnoreCase("DELETE")) {
                int idx = sc.nextInt();
                if (idx >= 1 && idx <= doc.size()) {
                    doc.remove(idx - 1);
                    System.out.println("Deleted: Line " + idx);
                } else {
                    System.out.println("Error: Line not found");
                }
            } else if (cmd.equalsIgnoreCase("SEARCH")) {
                String kw = sc.next();
                List<Integer> matches = new ArrayList<>();
                for (int i = 0; i < doc.size(); i++) {
                    if (doc.get(i).contains(kw)) matches.add(i + 1);
                }
                if (matches.isEmpty()) {
                    System.out.println("Matches: None");
                } else {
                    StringBuilder sb = new StringBuilder("Matches: ");
                    for (int m : matches) sb.append("Line ").append(m).append(" ");
                    System.out.println(sb.toString().trim());
                }
            }
        }

        System.out.println("--- Document Content ---");
        for (String l : doc) System.out.println(l);
        System.out.println("--- End of File ---");
        sc.close();
    }
}""",
    "explanation": "Manages in-memory document line state with index-safe insertion and deletion operations.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-030",
    "bank": "bank4",
    "title": "Bank ATM Transaction Terminal Simulator",
    "topic": "Projects & Applications",
    "difficulty": "Medium",
    "recommendedLanguage": "Java",
    "description": """An interactive banking ATM machine simulator:
- Account has a PIN (e.g. 1234) and initial balance B.
- If PIN does not match, reject access: "Access Denied: Incorrect PIN" and exit.
- If PIN matches:
  - `DEPOSIT <amount>`: balance += amount. Print: "Deposited $<amt> | Balance: $<bal>"
  - `WITHDRAW <amount>`: if balance >= amount, balance -= amount. Print: "Withdrew $<amt> | Balance: $<bal>". Otherwise: "Insufficient Funds"
  - `STATEMENT`: print current balance.""",
    "inputFormat": """The first line contains correctPIN (string) and enteredPIN (string).
The second line contains initialBalance (int).
The next lines contain commands ending with 'EXIT'.""",
    "outputFormat": """Print transaction logs and current balance.""",
    "constraints": ["PINs are 4-digit strings", "Balances and amounts are positive integers"],
    "sampleInput": "1234 1234\\n500\\nDEPOSIT 200\\nWITHDRAW 100\\nWITHDRAW 800\\nEXIT",
    "sampleOutput": "Deposited $200 | Balance: $700\\nWithdrew $100 | Balance: $600\\nInsufficient Funds\\nATM Session Closed",
    "testCases": [
        {"input": "1234 1234\\n500\\nDEPOSIT 200\\nWITHDRAW 100\\nWITHDRAW 800\\nEXIT", "expectedOutput": "Deposited $200 | Balance: $700\\nWithdrew $100 | Balance: $600\\nInsufficient Funds\\nATM Session Closed", "isHidden": False},
        {"input": "1234 0000\\n1000", "expectedOutput": "Access Denied: Incorrect PIN", "isHidden": False},
        {"input": "9999 9999\\n100\\nDEPOSIT 50\\nEXIT", "expectedOutput": "Deposited $50 | Balance: $150\\nATM Session Closed", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (ATM Machine)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String correct = sc.next();
        String entered = sc.next();

        if (!correct.equals(entered)) {
            System.out.println("Access Denied: Incorrect PIN");
            sc.close();
            return;
        }

        int bal = sc.nextInt();
        while (sc.hasNext()) {
            String cmd = sc.next();
            if (cmd.equalsIgnoreCase("EXIT")) break;

            if (cmd.equalsIgnoreCase("DEPOSIT")) {
                int amt = sc.nextInt();
                bal += amt;
                System.out.println("Deposited $" + amt + " | Balance: $" + bal);
            } else if (cmd.equalsIgnoreCase("WITHDRAW")) {
                int amt = sc.nextInt();
                if (bal >= amt) {
                    bal -= amt;
                    System.out.println("Withdrew $" + amt + " | Balance: $" + bal);
                } else {
                    System.out.println("Insufficient Funds");
                }
            } else if (cmd.equalsIgnoreCase("STATEMENT")) {
                System.out.println("Current Balance: $" + bal);
            }
        }
        System.out.println("ATM Session Closed");
        sc.close();
    }
}""",
    "explanation": "Implements an authenticated finite-state interactive banking transaction engine.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-031",
    "bank": "bank4",
    "title": "Dice Roller & Statistical Probability Engine",
    "topic": "Projects & Applications",
    "difficulty": "Easy",
    "recommendedLanguage": "Java",
    "description": """Bro Code's Random Numbers and Game Logic modules demonstrate dice simulation and statistical distribution.

When rolling two standard 6-sided dice, the possible sums range from 2 to 12.
Given the outcomes of N rolls of two dice (each roll provided as two integers between 1 and 6):
1. Compute the sum for each roll.
2. Tally the frequency of each sum (2 through 12).
3. Identify the most frequent sum (if tied, print the lower sum).""",
    "inputFormat": """The first line contains an integer N representing the number of rolls.
The next N lines each contain two integers d1 and d2 (1 <= d1, d2 <= 6).""",
    "outputFormat": """Print each occurring sum and its count: "Sum <val>: <count> times" (in ascending order of sum).
On the final line, print: "Most Frequent Sum: <val>".""",
    "constraints": ["1 <= N <= 100", "1 <= d1, d2 <= 6"],
    "sampleInput": "5\\n3 4\\n1 6\\n2 5\\n1 1\\n4 4",
    "sampleOutput": "Sum 2: 1 times\\nSum 7: 3 times\\nSum 8: 1 times\\nMost Frequent Sum: 7",
    "testCases": [
        {"input": "5\\n3 4\\n1 6\\n2 5\\n1 1\\n4 4", "expectedOutput": "Sum 2: 1 times\\nSum 7: 3 times\\nSum 8: 1 times\\nMost Frequent Sum: 7", "isHidden": False},
        {"input": "2\\n6 6\\n6 6", "expectedOutput": "Sum 12: 2 times\\nMost Frequent Sum: 12", "isHidden": False},
        {"input": "3\\n2 3\\n3 2\\n1 4", "expectedOutput": "Sum 5: 3 times\\nMost Frequent Sum: 5", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Dice Roller)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] freq = new int[13];

        for (int i = 0; i < n; i++) {
            int d1 = sc.nextInt();
            int d2 = sc.nextInt();
            freq[d1 + d2]++;
        }

        int maxCount = -1;
        int mostFreqSum = 2;

        for (int s = 2; s <= 12; s++) {
            if (freq[s] > 0) {
                System.out.println("Sum " + s + ": " + freq[s] + " times");
            }
            if (freq[s] > maxCount) {
                maxCount = freq[s];
                mostFreqSum = s;
            }
        }

        System.out.println("Most Frequent Sum: " + mostFreqSum);
        sc.close();
    }
}""",
    "explanation": "Tabulates composite sum occurrences across simulated random experiment events.",
    "extractionStatus": "verified"
})

questions.append({
    "id": "bank4-032",
    "bank": "bank4",
    "title": "Snake Board Grid Navigation Simulator",
    "topic": "Projects & Applications",
    "difficulty": "Hard",
    "recommendedLanguage": "Java",
    "description": """Bro Code's Java Snake Game tutorial is an iconic project featuring 2D coordinate movement, collision detection, and tail growth.

Simulate a snake navigation engine on an N x N grid (0-indexed from (0,0) at top-left to (N-1, N-1)):
- Snake starts at (0, 0) with initial length 1.
- Move commands: 'U' (row - 1), 'D' (row + 1), 'L' (col - 1), 'R' (col + 1).
- Food is located at given coordinates (foodR, foodC). When the head reaches the food, the snake eats it: length increments by 1, and food is consumed.
- If the snake attempts to move outside the grid boundaries [0, N-1], the move causes a collision: print "Collision at (<r>, <c>)! Game Over" and stop immediately.
- If all moves are executed without collision, print: "Success: Final Position (<r>, <c>) | Length: <len>".""",
    "inputFormat": """The first line contains grid size N.
The second line contains food coordinates foodR and foodC.
The third line contains move string (e.g. 'RRDLL').""",
    "outputFormat": """Print the game outcome and final statistics.""",
    "constraints": ["2 <= N <= 20", "0 <= foodR, foodC < N", "Moves are letters U, D, L, R"],
    "sampleInput": "5\\n0 2\\nRRDDL",
    "sampleOutput": "Success: Final Position (2, 1) | Length: 2",
    "testCases": [
        {"input": "5\\n0 2\\nRRDDL", "expectedOutput": "Success: Final Position (2, 1) | Length: 2", "isHidden": False},
        {"input": "3\\n1 1\\nRRR", "expectedOutput": "Collision at (0, 3)! Game Over", "isHidden": False},
        {"input": "4\\n1 0\\nDRRU", "expectedOutput": "Success: Final Position (0, 2) | Length: 2", "isHidden": True}
    ],
    "sourceScreenshot": "Bro Code Java Project (Snake Game)",
    "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
    "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int foodR = sc.nextInt();
        int foodC = sc.nextInt();
        String moves = sc.next();

        int r = 0, c = 0;
        int length = 1;
        boolean foodEaten = false;

        for (char m : moves.toCharArray()) {
            int nextR = r, nextC = c;
            if (m == 'U') nextR--;
            else if (m == 'D') nextR++;
            else if (m == 'L') nextC--;
            else if (m == 'R') nextC++;

            if (nextR < 0 || nextR >= n || nextC < 0 || nextC >= n) {
                System.out.println("Collision at (" + nextR + ", " + nextC + ")! Game Over");
                sc.close();
                return;
            }

            r = nextR;
            c = nextC;
            if (!foodEaten && r == foodR && c == foodC) {
                length++;
                foodEaten = true;
            }
        }

        System.out.println("Success: Final Position (" + r + ", " + c + ") | Length: " + length);
        sc.close();
    }
}""",
    "explanation": "Simulates 2D state machine transitions, boundary clipping, and goal ingestion logic.",
    "extractionStatus": "verified"
})

print(f"Total questions created: {len(questions)}")
with open('questions_bank4.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)
print("Saved questions_bank4.json successfully!")
