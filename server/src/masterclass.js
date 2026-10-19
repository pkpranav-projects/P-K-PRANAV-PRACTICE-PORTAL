/**
 * Modern Java Masterclass Content & A-to-Z Methods Reference
 * Distilled from "Modern Java" (javabook.mccue.dev) & Core Java 21+ SE Standard Library
 */

const masterclassModules = [
  {
    id: "mod-01",
    title: "1. Modern Java Setup & Tooling",
    subtitle: "Compilation, Execution & Modern Language Features",
    overview: "Understanding how Java works from source code (.java) to bytecode (.class) running on the Java Virtual Machine (JVM). Overview of javac, java, and modern development workflows.",
    keyTakeaways: [
      "javac converts human-readable .java source into bytecode .class files.",
      "The java command launches the JVM and looks for the public static void main method.",
      "Modern Java supports single-file execution: `java App.java` runs directly without an explicit javac step for quick testing.",
      "Always ensure class names match filenames (e.g. `public class Solution` in `Solution.java`)."
    ],
    codeSnippet: `// Terminal Commands:
// javac Solution.java  -> Produces Solution.class
// java Solution        -> Runs bytecode on the JVM

public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, Modern Java!");
    }
}`
  },
  {
    id: "mod-02",
    title: "2. Variables, Types & Local Type Inference",
    subtitle: "Primitive Data Types, 'var', and 'final' Immutability",
    overview: "Java is statically and strongly typed. Learn primitive types, wrapper types, variable scopes, and when to use 'var' for cleaner code without sacrificing type safety.",
    keyTakeaways: [
      "Primitives: int (32-bit), long (64-bit), double (64-bit float), boolean (true/false), char (16-bit Unicode).",
      "Use `final` for variables whose value should never be reassigned after initialization.",
      "`var` enables local variable type inference (introduced in Java 10) — type is still fixed at compile-time.",
      "Delayed assignment: Variables can be declared without an immediate initial value, but must be assigned before read."
    ],
    codeSnippet: `// Explicit primitive typing
int score = 95;
final double PI = 3.1415926535;

// Local variable type inference (compile-time checked)
var greeting = "Welcome to Java Practice Arena"; // Inferred as String
var count = 42;                                  // Inferred as int`
  },
  {
    id: "mod-03",
    title: "3. Booleans & Logical Operations",
    subtitle: "Short-circuit evaluation, De Morgan's Laws & Truth Tables",
    overview: "How boolean logic powers program branching. Understanding short-circuit behavior (&& and ||) vs non-short-circuit operators (& and |).",
    keyTakeaways: [
      "Boolean literals are strictly `true` or `false` — Java does NOT allow truthy/falsy integers (unlike C/Python).",
      "`&&` (logical AND) stops evaluating if the left operand is false (short-circuit).",
      "`||` (logical OR) stops evaluating if the left operand is true (short-circuit).",
      "`!` is unary NOT, inverting boolean state."
    ],
    codeSnippet: `boolean hasKey = true;
boolean hasPermission = false;

// Short-circuit prevents NullPointerException:
String text = null;
if (text != null && text.length() > 0) {
    System.out.println(text);
}`
  },
  {
    id: "mod-04",
    title: "4. Numbers, Arithmetic & Overflow Safety",
    subtitle: "Integer types, modulus operator, and boundary handling",
    overview: "Deep dive into integer arithmetic, integer division pitfalls, remainder calculation, and Integer.MAX_VALUE boundaries.",
    keyTakeaways: [
      "Integer division truncates decimals: `7 / 2` evaluates to `3`, not `3.5`.",
      "Remainder `%` gives the modulo: `7 % 2` evaluates to `1`. In Java, remainder keeps the dividend's sign.",
      "Integer bounds: `Integer.MIN_VALUE` is -2^31 (-2,147,483,648), `Integer.MAX_VALUE` is 2^31 - 1 (2,147,483,647).",
      "Overflow wraps around quietly: `Integer.MAX_VALUE + 1` produces `Integer.MIN_VALUE` (use Math.addExact to detect)."
    ],
    codeSnippet: `int a = 15;
int b = 4;
System.out.println(a / b); // Output: 3 (truncated)
System.out.println(a % b); // Output: 3 (remainder)

// Cast one operand to double for decimal division:
double precise = (double) a / b; // Output: 3.75`
  },
  {
    id: "mod-05",
    title: "5. Floating-Point Numbers & Precision",
    subtitle: "IEEE 754, Double.NaN, Infinities, and Rounding",
    overview: "Floating-point representation can introduce tiny rounding quirks due to binary fractions. Master Double and Float edge cases.",
    keyTakeaways: [
      "Never compare doubles with `==` due to binary approximation (e.g. `0.1 + 0.2 != 0.3`). Use `Math.abs(a - b) < 1e-9`.",
      "Dividing a double by 0.0 results in `Double.POSITIVE_INFINITY` or `Double.NEGATIVE_INFINITY`, not an exception.",
      "`0.0 / 0.0` produces `Double.NaN` (Not a Number). Remember: `NaN != NaN` is true!",
      "Use `Double.isNaN(val)` to check for NaN safely."
    ],
    codeSnippet: `double val1 = 0.1 + 0.2;
double val2 = 0.3;
double epsilon = 1e-9;

if (Math.abs(val1 - val2) < epsilon) {
    System.out.println("Values are equal within epsilon tolerance");
}`
  },
  {
    id: "mod-06",
    title: "6. Characters & Unicode Manipulation",
    subtitle: "Primitive 'char', ASCII codes, and Character helper methods",
    overview: "Characters in Java are 16-bit UTF-16 code units. Learn how to convert chars to ASCII integers, detect digits, and transform cases.",
    keyTakeaways: [
      "Single quotes `'A'` are characters (`char`), double quotes `\"A\"` are strings (`String`).",
      "Arithmetic on chars uses ASCII values: `'B' - 'A'` is `1`, `'5' - '0'` is `5`.",
      "Always prefer `Character.isDigit(c)` and `Character.isLetter(c)` over manual ASCII range comparisons.",
      "`Character.toUpperCase(c)` and `Character.toLowerCase(c)` handle Unicode properly."
    ],
    codeSnippet: `char ch = '7';
if (Character.isDigit(ch)) {
    int digitValue = ch - '0'; // Converts '7' -> 7
    System.out.println("Numeric value: " + digitValue);
}`
  },
  {
    id: "mod-07",
    title: "7. Strings & Text Processing Mastery",
    subtitle: "Immutability, Text Blocks, formatting, and split/join",
    overview: "Strings are immutable sequences of characters. Master string slicing, searching, transforming, and multi-line text blocks.",
    keyTakeaways: [
      "Strings are immutable: Calling `.toUpperCase()` creates a new string; it never alters the original string in place.",
      "Never use `==` to compare string contents! Always use `.equals()` or `.equalsIgnoreCase()`.",
      "Modern text blocks (triple quotes `\"\"\"...\"\"\"`) preserve multi-line formatting without ugly `\\n` escapes.",
      "Use `.strip()` instead of `.trim()` in modern Java — `.strip()` correctly removes all Unicode whitespace."
    ],
    codeSnippet: `String name = "  Java Practice Arena  ";
String clean = name.strip(); // "Java Practice Arena"

// Modern text block:
String jsonTemplate = """
    {
      "platform": "%s",
      "year": %d
    }
    """.formatted("NeoPortal", 2026);`
  },
  {
    id: "mod-08",
    title: "8. Standard Input & Scanner Parsing",
    subtitle: "System.in, token parsing, and the newline buffer trap",
    overview: "Scanner is the standard tool for interactive terminal and competitive programming input. Avoid the classic newline skipping bug.",
    keyTakeaways: [
      "Create scanner: `Scanner sc = new Scanner(System.in);`.",
      "The Scanner Trap: `sc.nextInt()` reads only the number, leaving the newline `\\n` in the buffer. Follow with `sc.nextLine()` before reading a whole string line.",
      "`sc.hasNext()` and `sc.hasNextInt()` prevent NoSuchElementException when reading till EOF.",
      "Close or let Scanners be garbage collected when standard input ends."
    ],
    codeSnippet: `Scanner sc = new Scanner(System.in);
if (sc.hasNextInt()) {
    int count = sc.nextInt();
    sc.nextLine(); // Clear leftover newline!
    
    for (int i = 0; i < count; i++) {
        String line = sc.nextLine();
        System.out.println("Line " + (i + 1) + ": " + line);
    }
}`
  },
  {
    id: "mod-09",
    title: "9. Control Flow & Branching Logic",
    subtitle: "if-else hierarchies, delayed assignment & ternary expressions",
    overview: "Make decisions in code. Combine multiple boolean conditions, avoid deeply nested if-statements using guard clauses.",
    keyTakeaways: [
      "Guard clauses: Check edge cases and return early to keep the main logic unindented and readable.",
      "Ternary operator: `condition ? whenTrue : whenFalse` should only be used for concise, readable expressions.",
      "Scoping: Variables declared inside an `if` block are not accessible outside that block.",
      "Delayed assignment allows clean initialization across if-else branches."
    ],
    codeSnippet: `int score = 88;
String grade; // Delayed assignment

if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else {
    grade = "C";
}
System.out.println("Grade: " + grade);`
  },
  {
    id: "mod-10",
    title: "10. Loops, Iterations & Labeled Jumps",
    subtitle: "while, do-while, for loops, and nested loop control",
    overview: "Repeat computations effectively. Master loop counters, enhanced for loops, and breaking out of nested loops with labeled break.",
    keyTakeaways: [
      "Use `for` when iteration count is known; use `while` when looping depends on a runtime condition.",
      "`do-while` always executes at least once before evaluating its condition.",
      "`break` terminates the current loop; `continue` skips to the next iteration.",
      "Labeled break: Prefix an outer loop with `outer: for(...)` and call `break outer;` to break directly out of nested loops."
    ],
    codeSnippet: `// Labeled break example:
search:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j == 12) {
            System.out.println("Found match at: " + i + ", " + j);
            break search; // Exits BOTH loops!
        }
    }
}`
  },
  {
    id: "mod-11",
    title: "11. Methods, Signatures & Overloading",
    subtitle: "Static vs instance methods, parameters, and return types",
    overview: "Break complex logic into reusable functions. Learn pass-by-value semantics, method overloading, and recursion.",
    keyTakeaways: [
      "Java is strictly pass-by-value. For objects, it passes the value of the reference.",
      "Method overloading: Same method name with different parameter types or parameter counts.",
      "Return types must match exactly or be implicitly widenable (e.g. returning int for double return type).",
      "Void methods can use `return;` without a value to exit early."
    ],
    codeSnippet: `public class MathUtils {
    // Overloaded methods:
    public static int add(int a, int b) {
        return a + b;
    }
    public static double add(double a, double b) {
        return a + b;
    }
}`
  },
  {
    id: "mod-12",
    title: "12. 1D, 2D & Ragged Arrays",
    subtitle: "Arrays class utilities, matrix operations, and multi-dimensional grids",
    overview: "Arrays are fixed-size sequential containers. Master matrix traversal, ragged row lengths, and java.util.Arrays utilities.",
    keyTakeaways: [
      "Array length is a field, not a method: `arr.length` (unlike `str.length()`).",
      "Default values: numbers default to 0, booleans to false, object arrays to null.",
      "Always print arrays with `Arrays.toString(arr)` or `Arrays.deepToString(matrix)`.",
      "Sort and search: `Arrays.sort(arr)` and `Arrays.binarySearch(arr, key)`."
    ],
    codeSnippet: `int[][] grid = {
    { 1, 2, 3 },
    { 4, 5, 6 },
    { 7, 8, 9 }
};

// Row-by-row traversal:
for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
        System.out.print(grid[r][c] + " ");
    }
    System.out.println();
}`
  },
  {
    id: "mod-13",
    title: "13. Null Safety & Boxed Primitives",
    subtitle: "Autoboxing, unboxing traps, and avoiding NullPointerExceptions",
    overview: "Understanding the bridge between primitive types (int) and their wrapper object counterparts (Integer), and handling null safely.",
    keyTakeaways: [
      "Autoboxing automatically converts `int` to `Integer`, but unboxing a `null` Integer throws `NullPointerException`.",
      "Cache gotcha: `Integer` values between -128 and 127 are cached; values outside this range compared with `==` return false! Always use `.equals()`.",
      "Check null before dereferencing: `Objects.requireNonNull(obj, \"Cannot be null\")`.",
      "Use `Optional<T>` when a method result might legally be absent."
    ],
    codeSnippet: `Integer a = 128;
Integer b = 128;
System.out.println(a == b);      // false (outside byte cache!)
System.out.println(a.equals(b)); // true (correct comparison)`
  },
  {
    id: "mod-14",
    title: "14. Object-Oriented Java: Classes, Fields & 'this'",
    subtitle: "State encapsulation, constructors, and instance method mechanics",
    overview: "Object-oriented design groups state (fields) and behavior (methods) into cohesive blueprints called classes.",
    keyTakeaways: [
      "A class is a blueprint; an instance is an object allocated on the heap with `new`.",
      "`this` refers to the current instance, disambiguating field names from parameter names.",
      "Constructors initialize fields to satisfy business invariants.",
      "Constructor delegation: Use `this(...)` as the first statement in a constructor to reuse another constructor."
    ],
    codeSnippet: `public class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Negative balance");
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    public double getBalance() {
        return this.balance;
    }
}`
  },
  {
    id: "mod-15",
    title: "15. Enums & Type-Safe Constants",
    subtitle: "Enum variants, methods, values(), and ordinal properties",
    overview: "Enums define fixed, closed sets of constants with compile-time type safety, preventing invalid magic strings or numbers.",
    keyTakeaways: [
      "Enums are first-class types in Java; they can have fields, constructors, and methods.",
      "Enums can be compared safely with `==` because JVM guarantees singleton instances.",
      "`DayOfWeek.values()` returns an array of all variants.",
      "`DayOfWeek.valueOf(\"MONDAY\")` parses a string into the corresponding enum variant."
    ],
    codeSnippet: `public enum TrafficLight {
    RED(60), YELLOW(5), GREEN(45);

    private final int durationSeconds;

    TrafficLight(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public int getDuration() {
        return durationSeconds;
    }
}`
  },
  {
    id: "mod-16",
    title: "16. Modern Switch & Pattern Matching",
    subtitle: "Arrow syntax, switch expressions, yield, and exhaustiveness",
    overview: "Java 14+ revolutionized switch statements with arrow syntax (`->`), expression returns, multiple case labels, and no accidental fallthrough.",
    keyTakeaways: [
      "Arrow syntax (`case A -> ...`) eliminates accidental fallthrough — no `break` keyword needed!",
      "Switch can be used as an expression that produces a value: `String day = switch(num) { ... };`.",
      "Use `yield` to return a value from a multi-line code block inside a switch expression.",
      "Multiple labels: `case 1, 2, 3 -> \"Low\";`."
    ],
    codeSnippet: `int dayCode = 3;
String dayType = switch (dayCode) {
    case 1, 7 -> "Weekend";
    case 2, 3, 4, 5, 6 -> "Weekday";
    default -> "Invalid Day";
};
System.out.println(dayType); // Output: Weekday`
  },
  {
    id: "mod-17",
    title: "17. Exceptions & Robust Error Handling",
    subtitle: "throw, try-catch-finally, checked vs unchecked exceptions",
    overview: "Master Java's structured error handling. Know when to throw IllegalArgumentException, and how try-with-resources prevents resource leaks.",
    keyTakeaways: [
      "Unchecked exceptions (subclasses of `RuntimeException`): errors that could be avoided (e.g. `NullPointerException`, `IndexOutOfBoundsException`).",
      "Checked exceptions (subclasses of `Exception`): external failures you must handle or declare with `throws` (e.g. `IOException`).",
      "`finally` block always executes whether an exception occurred or not.",
      "Try-with-resources: `try (var scanner = new Scanner(...))` automatically closes resources implementing AutoCloseable."
    ],
    codeSnippet: `public static int parseAge(String input) {
    try {
        int age = Integer.parseInt(input);
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Age out of reasonable range: " + age);
        }
        return age;
    } catch (NumberFormatException e) {
        System.err.println("Input is not a valid number: " + input);
        return -1;
    }
}`
  },
  {
    id: "mod-18",
    title: "18. Core Collections & Data Structures",
    subtitle: "ArrayList, HashMap, HashSet, and StringBuilder algorithms",
    overview: "The Java Collections Framework provides high-performance data structures for lists, key-value mappings, and unique sets.",
    keyTakeaways: [
      "Use `ArrayList<T>` for dynamic arrays with O(1) random access by index.",
      "Use `HashMap<K, V>` for O(1) key-to-value lookups, counting frequencies, and dictionary caching.",
      "Use `HashSet<T>` for O(1) uniqueness checks and eliminating duplicate items.",
      "Use `StringBuilder` when concatenating strings inside loops to avoid O(N^2) memory reallocations."
    ],
    codeSnippet: `// Frequency count with HashMap
String text = "banana";
Map<Character, Integer> counts = new HashMap<>();

for (char c : text.toCharArray()) {
    counts.put(c, counts.getOrDefault(c, 0) + 1);
}
System.out.println(counts); // {a=3, b=1, n=2}`
  }
];

const methodsAtoZ = [
  // --- A ---
  {
    name: "Arrays.binarySearch",
    class: "java.util.Arrays",
    letter: "A",
    category: "Arrays",
    signature: "public static int binarySearch(int[] a, int key)",
    returnType: "int",
    description: "Searches the specified array of ints for the specified value using the binary search algorithm. Array MUST be sorted first.",
    parameters: [
      { name: "a", type: "int[]", desc: "The sorted array to be searched" },
      { name: "key", type: "int", desc: "The value to be searched for" }
    ],
    returns: "Index of the search key if found; otherwise, (-(insertion point) - 1).",
    exceptions: "None (returns negative if not present).",
    pitfalls: "Array must be sorted with Arrays.sort() beforehand; otherwise the result is undefined.",
    snippet: `int[] numbers = { 10, 20, 30, 40, 50 };
int index = Arrays.binarySearch(numbers, 30);
System.out.println("Found at index: " + index); // 2`
  },
  {
    name: "Arrays.copyOf",
    class: "java.util.Arrays",
    letter: "A",
    category: "Arrays",
    signature: "public static int[] copyOf(int[] original, int newLength)",
    returnType: "int[]",
    description: "Copies the specified array, truncating or padding with zeros (to obtain the specified length).",
    parameters: [
      { name: "original", type: "int[]", desc: "Array to be copied" },
      { name: "newLength", type: "int", desc: "Length of the copy to be returned" }
    ],
    returns: "A copy of the original array truncated or padded.",
    exceptions: "NegativeArraySizeException if newLength is negative.",
    pitfalls: "Creates a shallow copy for object arrays; inner objects are shared.",
    snippet: `int[] original = { 1, 2, 3 };
int[] extended = Arrays.copyOf(original, 5);
System.out.println(Arrays.toString(extended)); // [1, 2, 3, 0, 0]`
  },
  {
    name: "Arrays.fill",
    class: "java.util.Arrays",
    letter: "A",
    category: "Arrays",
    signature: "public static void fill(int[] a, int val)",
    returnType: "void",
    description: "Assigns the specified int value to each element of the specified array of ints.",
    parameters: [
      { name: "a", type: "int[]", desc: "The array to be filled" },
      { name: "val", type: "int", desc: "The value to be stored in all elements" }
    ],
    returns: "void",
    exceptions: "NullPointerException if array is null.",
    pitfalls: "For 2D arrays, fill() sets the rows, not the individual cells. Loop through each row to fill 2D matrices.",
    snippet: `int[] scores = new int[5];
Arrays.fill(scores, -1);
System.out.println(Arrays.toString(scores)); // [-1, -1, -1, -1, -1]`
  },
  {
    name: "Arrays.sort",
    class: "java.util.Arrays",
    letter: "A",
    category: "Arrays",
    signature: "public static void sort(int[] a)",
    returnType: "void",
    description: "Sorts the specified array into ascending numerical order using Dual-Pivot Quicksort (O(N log N) average).",
    parameters: [
      { name: "a", type: "int[]", desc: "The array to be sorted" }
    ],
    returns: "void (mutates array in place)",
    exceptions: "NullPointerException if array is null.",
    pitfalls: "Sorts in-place. If you need descending order for primitives, reverse manually or box to Integer[] and pass Collections.reverseOrder().",
    snippet: `int[] arr = { 42, 12, 88, 5, 23 };
Arrays.sort(arr);
System.out.println(Arrays.toString(arr)); // [5, 12, 23, 42, 88]`
  },
  {
    name: "Arrays.toString",
    class: "java.util.Arrays",
    letter: "A",
    category: "Arrays",
    signature: "public static String toString(int[] a)",
    returnType: "String",
    description: "Returns a human-readable string representation of the contents of the specified array (e.g. '[1, 2, 3]').",
    parameters: [
      { name: "a", type: "int[]", desc: "The array whose string representation to return" }
    ],
    returns: "A string representation of a enclosed in square brackets.",
    exceptions: "None (returns 'null' if array is null).",
    pitfalls: "For 2D or multi-dimensional arrays, use Arrays.deepToString() instead.",
    snippet: `int[] data = { 10, 20, 30 };
System.out.println(Arrays.toString(data)); // "[10, 20, 30]"`
  },
  {
    name: "Math.abs",
    class: "java.lang.Math",
    letter: "A",
    category: "Math",
    signature: "public static int abs(int a)",
    returnType: "int / double",
    description: "Returns the absolute (non-negative) value of an argument. Overloaded for int, long, float, and double.",
    parameters: [
      { name: "a", type: "int", desc: "The argument whose absolute value is to be determined" }
    ],
    returns: "The absolute value of the argument.",
    exceptions: "None.",
    pitfalls: "Calling Math.abs(Integer.MIN_VALUE) returns Integer.MIN_VALUE because positive 2^31 cannot be represented in a 32-bit signed int!",
    snippet: `int delta = Math.abs(-42); // 42
double diff = Math.abs(-3.14); // 3.14`
  },

  // --- B ---
  {
    name: "Boolean.parseBoolean",
    class: "java.lang.Boolean",
    letter: "B",
    category: "Primitives",
    signature: "public static boolean parseBoolean(String s)",
    returnType: "boolean",
    description: "Parses the string argument as a boolean. Returns true if string is equal, ignoring case, to 'true'.",
    parameters: [
      { name: "s", type: "String", desc: "String containing the boolean representation" }
    ],
    returns: "true if string is non-null and equalsIgnoreCase('true'); otherwise false.",
    exceptions: "None (returns false for invalid inputs or null).",
    pitfalls: "Returns false for any string that isn't exactly 'true' (e.g. '1', 'yes' return false).",
    snippet: `boolean b1 = Boolean.parseBoolean("true");  // true
boolean b2 = Boolean.parseBoolean("TRUE");  // true
boolean b3 = Boolean.parseBoolean("yes");   // false`
  },
  {
    name: "BufferedReader.readLine",
    class: "java.io.BufferedReader",
    letter: "B",
    category: "I/O & Scanner",
    signature: "public String readLine() throws IOException",
    returnType: "String",
    description: "Reads a line of text from standard input or stream, stripping line termination characters (\\n, \\r).",
    parameters: [],
    returns: "A String containing the contents of the line, or null if the end of the stream has been reached.",
    exceptions: "IOException if an I/O error occurs.",
    pitfalls: "BufferedReader is much faster than Scanner for competitive programming with large inputs (100k+ lines).",
    snippet: `BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
String line = reader.readLine();
if (line != null) {
    System.out.println("Read: " + line);
}`
  },

  // --- C ---
  {
    name: "Character.isDigit",
    class: "java.lang.Character",
    letter: "C",
    category: "Characters",
    signature: "public static boolean isDigit(char ch)",
    returnType: "boolean",
    description: "Determines if the specified character is a digit (0 through 9 in ASCII, or Unicode digits).",
    parameters: [
      { name: "ch", type: "char", desc: "The character to be tested" }
    ],
    returns: "true if the character is a digit; false otherwise.",
    exceptions: "None.",
    pitfalls: "Do not confuse with Character.isLetterOrDigit().",
    snippet: `char c = '9';
if (Character.isDigit(c)) {
    int digit = c - '0';
    System.out.println("Numeric digit: " + digit);
}`
  },
  {
    name: "Character.isLetter",
    class: "java.lang.Character",
    letter: "C",
    category: "Characters",
    signature: "public static boolean isLetter(char ch)",
    returnType: "boolean",
    description: "Determines if the specified character is a letter (A-Z, a-z, and Unicode alphabetic characters).",
    parameters: [
      { name: "ch", type: "char", desc: "The character to be tested" }
    ],
    returns: "true if the character is a letter; false otherwise.",
    exceptions: "None.",
    pitfalls: "Symbols, whitespace, and punctuation return false.",
    snippet: `char c = 'K';
boolean isAlpha = Character.isLetter(c); // true`
  },
  {
    name: "Character.toLowerCase",
    class: "java.lang.Character",
    letter: "C",
    category: "Characters",
    signature: "public static char toLowerCase(char ch)",
    returnType: "char",
    description: "Converts the character argument to lowercase using case mapping information from UnicodeData.",
    parameters: [
      { name: "ch", type: "char", desc: "The character to convert" }
    ],
    returns: "The lowercase equivalent of the character.",
    exceptions: "None.",
    pitfalls: "If character is already lowercase or not a letter, it is returned unchanged.",
    snippet: `char lower = Character.toLowerCase('G'); // 'g'`
  },
  {
    name: "Character.toUpperCase",
    class: "java.lang.Character",
    letter: "C",
    category: "Characters",
    signature: "public static char toUpperCase(char ch)",
    returnType: "char",
    description: "Converts the character argument to uppercase using Unicode character mappings.",
    parameters: [
      { name: "ch", type: "char", desc: "The character to convert" }
    ],
    returns: "The uppercase equivalent of the character.",
    exceptions: "None.",
    pitfalls: "Does not modify the original char; returns a new char value.",
    snippet: `char upper = Character.toUpperCase('a'); // 'A'`
  },
  {
    name: "Collections.sort",
    class: "java.util.Collections",
    letter: "C",
    category: "Collections",
    signature: "public static <T extends Comparable<? super T>> void sort(List<T> list)",
    returnType: "void",
    description: "Sorts the specified list into ascending order, according to the natural ordering of its elements (TimSort).",
    parameters: [
      { name: "list", type: "List<T>", desc: "The list to be sorted" }
    ],
    returns: "void (mutates list in place)",
    exceptions: "ClassCastException if list contains non-comparable elements.",
    pitfalls: "Cannot be passed an array directly (e.g. int[]). Use Arrays.sort() for arrays.",
    snippet: `List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));
Collections.sort(names);
System.out.println(names); // [Alice, Bob, Charlie]`
  },
  {
    name: "Math.ceil",
    class: "java.lang.Math",
    letter: "C",
    category: "Math",
    signature: "public static double ceil(double a)",
    returnType: "double",
    description: "Returns the smallest (closest to negative infinity) double value that is greater than or equal to the argument and is equal to a mathematical integer.",
    parameters: [
      { name: "a", type: "double", desc: "A floating-point value" }
    ],
    returns: "Smallest integer value as double that is >= a.",
    exceptions: "None.",
    pitfalls: "Returns double, not int. Cast to int if needed: `(int) Math.ceil(a)`.",
    snippet: `double res = Math.ceil(4.12); // 5.0
int pages = (int) Math.ceil(25.0 / 10); // 3`
  },
  {
    name: "String.charAt",
    class: "java.lang.String",
    letter: "C",
    category: "Strings",
    signature: "public char charAt(int index)",
    returnType: "char",
    description: "Returns the char value at the specified index. An index ranges from 0 to length() - 1.",
    parameters: [
      { name: "index", type: "int", desc: "0-based position of the char value" }
    ],
    returns: "The char value at the specified index of this string.",
    exceptions: "StringIndexOutOfBoundsException if index is negative or >= length().",
    pitfalls: "Trying to access `str.charAt(str.length())` throws StringIndexOutOfBoundsException.",
    snippet: `String s = "HELLO";
char first = s.charAt(0); // 'H'
char last = s.charAt(s.length() - 1); // 'O'`
  },
  {
    name: "String.compareTo",
    class: "java.lang.String",
    letter: "C",
    category: "Strings",
    signature: "public int compareTo(String anotherString)",
    returnType: "int",
    description: "Compares two strings lexicographically. Returns 0 if equal, < 0 if this string precedes anotherString, and > 0 if this string follows.",
    parameters: [
      { name: "anotherString", type: "String", desc: "The String to be compared" }
    ],
    returns: "0 if identical, negative if this < anotherString, positive if this > anotherString.",
    exceptions: "NullPointerException if anotherString is null.",
    pitfalls: "Case-sensitive ('A' comes before 'a'). Use compareToIgnoreCase() for case-insensitive checks.",
    snippet: `"apple".compareTo("banana"); // Negative value
"cat".compareTo("cat");       // 0`
  },
  {
    name: "String.contains",
    class: "java.lang.String",
    letter: "C",
    category: "Strings",
    signature: "public boolean contains(CharSequence s)",
    returnType: "boolean",
    description: "Returns true if and only if this string contains the specified sequence of char values.",
    parameters: [
      { name: "s", type: "CharSequence", desc: "The sequence to search for" }
    ],
    returns: "true if this string contains s, false otherwise.",
    exceptions: "NullPointerException if s is null.",
    pitfalls: "Case-sensitive! 'Hello'.contains('hello') returns false.",
    snippet: `String msg = "Java 21 Practice Arena";
boolean hasJava = msg.contains("Java"); // true`
  },

  // --- D ---
  {
    name: "Double.parseDouble",
    class: "java.lang.Double",
    letter: "D",
    category: "Primitives",
    signature: "public static double parseDouble(String s) throws NumberFormatException",
    returnType: "double",
    description: "Returns a new double initialized to the value represented by the specified String.",
    parameters: [
      { name: "s", type: "String", desc: "The string to be parsed" }
    ],
    returns: "The double value represented by the string argument.",
    exceptions: "NumberFormatException if string cannot be parsed as double, NullPointerException if s is null.",
    pitfalls: "Input like '$19.99' will throw NumberFormatException; strip currency symbols first.",
    snippet: `String str = "3.14159";
double pi = Double.parseDouble(str);`
  },
  {
    name: "Double.isNaN",
    class: "java.lang.Double",
    letter: "D",
    category: "Primitives",
    signature: "public static boolean isNaN(double v)",
    returnType: "boolean",
    description: "Returns true if the specified number is a Not-a-Number (NaN) value, false otherwise.",
    parameters: [
      { name: "v", type: "double", desc: "The value to be tested" }
    ],
    returns: "true if value is NaN; false otherwise.",
    exceptions: "None.",
    pitfalls: "`v == Double.NaN` ALWAYS returns false! You MUST use Double.isNaN(v).",
    snippet: `double result = 0.0 / 0.0;
System.out.println(Double.isNaN(result)); // true`
  },

  // --- E ---
  {
    name: "Enum.values",
    class: "java.lang.Enum",
    letter: "E",
    category: "OOP",
    signature: "public static E[] values()",
    returnType: "E[]",
    description: "Compiler-generated static method that returns an array containing the constants of this enum type, in the order they're declared.",
    parameters: [],
    returns: "Array of all enum constants.",
    exceptions: "None.",
    pitfalls: "Returns a new array on each call, so cache it if iterating frequently in tight loops.",
    snippet: `enum Level { LOW, MEDIUM, HIGH }

for (Level lvl : Level.values()) {
    System.out.println(lvl);
}`
  },
  {
    name: "String.endsWith",
    class: "java.lang.String",
    letter: "E",
    category: "Strings",
    signature: "public boolean endsWith(String suffix)",
    returnType: "boolean",
    description: "Tests if this string ends with the specified suffix.",
    parameters: [
      { name: "suffix", type: "String", desc: "The suffix to look for" }
    ],
    returns: "true if character sequence represented by suffix is a suffix of this string; false otherwise.",
    exceptions: "NullPointerException if suffix is null.",
    pitfalls: "Always returns true if suffix is empty string \"\".",
    snippet: `String filename = "Solution.java";
if (filename.endsWith(".java")) {
    System.out.println("Java source file");
}`
  },
  {
    name: "String.equals",
    class: "java.lang.String",
    letter: "E",
    category: "Strings",
    signature: "public boolean equals(Object anObject)",
    returnType: "boolean",
    description: "Compares this string to the specified object. The result is true if and only if the argument is not null and represents the same sequence of characters.",
    parameters: [
      { name: "anObject", type: "Object", desc: "The object to compare this String against" }
    ],
    returns: "true if strings are identical; false otherwise.",
    exceptions: "None (returns false if anObject is null or different type).",
    pitfalls: "NEVER use == for string content equality in Java! == only compares object reference addresses.",
    snippet: `String s1 = new String("admin");
String s2 = "admin";
System.out.println(s1 == s2);      // false (different heap objects)
System.out.println(s1.equals(s2)); // true (same character content)`
  },
  {
    name: "String.equalsIgnoreCase",
    class: "java.lang.String",
    letter: "E",
    category: "Strings",
    signature: "public boolean equalsIgnoreCase(String anotherString)",
    returnType: "boolean",
    description: "Compares this String to another String, ignoring case considerations.",
    parameters: [
      { name: "anotherString", type: "String", desc: "The String to compare this String against" }
    ],
    returns: "true if Strings are equal ignoring case; false otherwise.",
    exceptions: "None (returns false if anotherString is null).",
    pitfalls: "Safer than `s1.toLowerCase().equals(s2.toLowerCase())` because it avoids allocating intermediate string objects.",
    snippet: `boolean match = "YES".equalsIgnoreCase("yes"); // true`
  },

  // --- F ---
  {
    name: "Math.floor",
    class: "java.lang.Math",
    letter: "F",
    category: "Math",
    signature: "public static double floor(double a)",
    returnType: "double",
    description: "Returns the largest (closest to positive infinity) double value that is less than or equal to the argument and is equal to a mathematical integer.",
    parameters: [
      { name: "a", type: "double", desc: "A floating-point value" }
    ],
    returns: "Largest integer as double <= a.",
    exceptions: "None.",
    pitfalls: "For negative numbers: `Math.floor(-2.3)` is `-3.0`, not `-2.0`.",
    snippet: `double f1 = Math.floor(4.99); // 4.0
double f2 = Math.floor(-2.1); // -3.0`
  },
  {
    name: "String.formatted",
    class: "java.lang.String",
    letter: "F",
    category: "Strings",
    signature: "public String formatted(Object... args)",
    returnType: "String",
    description: "Modern instance method (Java 15+) equivalent to `String.format(this, args)`. Formats string using printf-style placeholders.",
    parameters: [
      { name: "args", type: "Object...", desc: "Arguments referenced by format specifiers" }
    ],
    returns: "A formatted string.",
    exceptions: "IllegalFormatException if a format specifier is invalid.",
    pitfalls: "Use `%d` for integers, `%f` for floating-point, `%s` for strings, `%n` for platform-independent newline.",
    snippet: `String report = "Item: %s | Price: $%.2f | Qty: %d"
    .formatted("Keyboard", 49.99, 2);
System.out.println(report); // Item: Keyboard | Price: $49.99 | Qty: 2`
  },

  // --- G ---
  {
    name: "List.get",
    class: "java.util.List",
    letter: "G",
    category: "Collections",
    signature: "E get(int index)",
    returnType: "E",
    description: "Returns the element at the specified position in this list.",
    parameters: [
      { name: "index", type: "int", desc: "Index of the element to return (0-based)" }
    ],
    returns: "The element at the specified position in this list.",
    exceptions: "IndexOutOfBoundsException if index is out of range (index < 0 || index >= size()).",
    pitfalls: "LinkedList.get(i) runs in O(N) time; ArrayList.get(i) runs in O(1) time.",
    snippet: `List<String> items = List.of("One", "Two", "Three");
String first = items.get(0); // "One"`
  },
  {
    name: "Map.getOrDefault",
    class: "java.util.Map",
    letter: "G",
    category: "Collections",
    signature: "V getOrDefault(Object key, V defaultValue)",
    returnType: "V",
    description: "Returns the value to which the specified key is mapped, or defaultValue if this map contains no mapping for the key.",
    parameters: [
      { name: "key", type: "Object", desc: "The key whose associated value is to be returned" },
      { name: "defaultValue", type: "V", desc: "Default mapping of the key" }
    ],
    returns: "The value mapped to key, or defaultValue if not present.",
    exceptions: "ClassCastException or NullPointerException if key is inappropriate.",
    pitfalls: "Essential for frequency maps; prevents verbose if-checks.",
    snippet: `Map<String, Integer> tally = new HashMap<>();
tally.put("apple", tally.getOrDefault("apple", 0) + 1);`
  },

  // --- H ---
  {
    name: "Map.containsKey",
    class: "java.util.Map",
    letter: "H",
    category: "Collections",
    signature: "boolean containsKey(Object key)",
    returnType: "boolean",
    description: "Returns true if this map contains a mapping for the specified key in O(1) average time.",
    parameters: [
      { name: "key", type: "Object", desc: "Key whose presence in this map is to be tested" }
    ],
    returns: "true if key exists in map; false otherwise.",
    exceptions: "NullPointerException if map does not permit null keys.",
    pitfalls: "Better than checking `map.get(key) != null` if the map can store explicit null values.",
    snippet: `Map<String, Integer> map = new HashMap<>();
map.put("Java", 21);
if (map.containsKey("Java")) {
    System.out.println("Java version is recorded");
}`
  },
  {
    name: "Scanner.hasNextInt",
    class: "java.util.Scanner",
    letter: "H",
    category: "I/O & Scanner",
    signature: "public boolean hasNextInt()",
    returnType: "boolean",
    description: "Returns true if the next token in this scanner's input can be interpreted as an int value in the default radix.",
    parameters: [],
    returns: "true if and only if this scanner's next token is a valid int.",
    exceptions: "IllegalStateException if scanner is closed.",
    pitfalls: "Crucial for reading numbers until EOF without crashing with InputMismatchException.",
    snippet: `Scanner sc = new Scanner(System.in);
int sum = 0;
while (sc.hasNextInt()) {
    sum += sc.nextInt();
}
System.out.println("Sum: " + sum);`
  },
  {
    name: "Scanner.hasNextLine",
    class: "java.util.Scanner",
    letter: "H",
    category: "I/O & Scanner",
    signature: "public boolean hasNextLine()",
    returnType: "boolean",
    description: "Returns true if there is another line in the input of this scanner.",
    parameters: [],
    returns: "true if and only if this scanner has another line of input.",
    exceptions: "IllegalStateException if scanner is closed.",
    pitfalls: "Use when processing multi-line competitive programming input whose line count isn't specified up front.",
    snippet: `Scanner sc = new Scanner(System.in);
while (sc.hasNextLine()) {
    String line = sc.nextLine();
    if (line.isEmpty()) break;
    System.out.println("Echo: " + line);
}`
  },

  // --- I ---
  {
    name: "Integer.parseInt",
    class: "java.lang.Integer",
    letter: "I",
    category: "Primitives",
    signature: "public static int parseInt(String s) throws NumberFormatException",
    returnType: "int",
    description: "Parses the string argument as a signed decimal integer.",
    parameters: [
      { name: "s", type: "String", desc: "A String containing the int representation to be parsed" }
    ],
    returns: "The integer value represented by the argument in decimal.",
    exceptions: "NumberFormatException if the string cannot be parsed as an integer.",
    pitfalls: "Throws NumberFormatException if the number overflows 32-bit int bounds (use Long.parseLong instead).",
    snippet: `String input = "1024";
int val = Integer.parseInt(input);
System.out.println(val * 2); // 2048`
  },
  {
    name: "Integer.toBinaryString",
    class: "java.lang.Integer",
    letter: "I",
    category: "Primitives",
    signature: "public static String toBinaryString(int i)",
    returnType: "String",
    description: "Returns a string representation of the integer argument as an unsigned integer in base 2 (binary).",
    parameters: [
      { name: "i", type: "int", desc: "An integer to be converted to a binary string" }
    ],
    returns: "String representation of the unsigned integer value in binary (base 2).",
    exceptions: "None.",
    pitfalls: "Does not include leading zeros.",
    snippet: `int n = 13;
String binary = Integer.toBinaryString(n);
System.out.println(binary); // "1101"`
  },
  {
    name: "String.indexOf",
    class: "java.lang.String",
    letter: "I",
    category: "Strings",
    signature: "public int indexOf(String str)",
    returnType: "int",
    description: "Returns the index within this string of the first occurrence of the specified substring.",
    parameters: [
      { name: "str", type: "String", desc: "The substring to search for" }
    ],
    returns: "Index of first occurrence, or -1 if substring does not occur.",
    exceptions: "NullPointerException if str is null.",
    pitfalls: "Returns -1 when not found, NOT an exception. Always check `!= -1`.",
    snippet: `String email = "student@university.edu";
int atPos = email.indexOf("@");
if (atPos != -1) {
    String username = email.substring(0, atPos);
    System.out.println("User: " + username); // "student"
}`
  },
  {
    name: "String.isBlank",
    class: "java.lang.String",
    letter: "I",
    category: "Strings",
    signature: "public boolean isBlank()",
    returnType: "boolean",
    description: "Returns true if the string is empty or contains only white space codepoints (introduced in Java 11).",
    parameters: [],
    returns: "true if string is empty or contains only whitespace; false otherwise.",
    exceptions: "None.",
    pitfalls: "Difference from `isEmpty()`: `\"  \".isEmpty()` is false, but `\"  \".isBlank()` is true!",
    snippet: `System.out.println("".isBlank());    // true
System.out.println("   ".isBlank()); // true
System.out.println(" a ".isBlank()); // false`
  },
  {
    name: "String.isEmpty",
    class: "java.lang.String",
    letter: "I",
    category: "Strings",
    signature: "public boolean isEmpty()",
    returnType: "boolean",
    description: "Returns true if, and only if, length() is 0.",
    parameters: [],
    returns: "true if length() is 0; false otherwise.",
    exceptions: "None.",
    pitfalls: "A string with spaces like \" \" has length 1, so isEmpty() returns false. Use isBlank() to ignore spaces.",
    snippet: `String s = "";
if (s.isEmpty()) {
    System.out.println("Empty string");
}`
  },

  // --- J ---
  {
    name: "String.join",
    class: "java.lang.String",
    letter: "J",
    category: "Strings",
    signature: "public static String join(CharSequence delimiter, CharSequence... elements)",
    returnType: "String",
    description: "Returns a new String composed of copies of the CharSequence elements joined together with a copy of the specified delimiter.",
    parameters: [
      { name: "delimiter", type: "CharSequence", desc: "The delimiter that separates each element" },
      { name: "elements", type: "CharSequence...", desc: "The elements to join together" }
    ],
    returns: "A new String that is composed of the elements separated by delimiter.",
    exceptions: "NullPointerException if delimiter or elements is null.",
    pitfalls: "Elements must be CharSequences (Strings); for an int[] array, convert numbers to Strings first.",
    snippet: `List<String> fruits = List.of("Apple", "Banana", "Cherry");
String joined = String.join(", ", fruits);
System.out.println(joined); // "Apple, Banana, Cherry"`
  },

  // --- K ---
  {
    name: "Map.keySet",
    class: "java.util.Map",
    letter: "K",
    category: "Collections",
    signature: "Set<K> keySet()",
    returnType: "Set<K>",
    description: "Returns a Set view of the keys contained in this map.",
    parameters: [],
    returns: "A set view of the keys contained in this map.",
    exceptions: "None.",
    pitfalls: "Modifying the returned Set mutates the underlying map. If iterating keys to get values, iterating entrySet() is much faster.",
    snippet: `Map<String, Integer> map = Map.of("A", 1, "B", 2);
for (String key : map.keySet()) {
    System.out.println("Key: " + key);
}`
  },

  // --- L ---
  {
    name: "String.length",
    class: "java.lang.String",
    letter: "L",
    category: "Strings",
    signature: "public int length()",
    returnType: "int",
    description: "Returns the length of this string (number of 16-bit Unicode characters).",
    parameters: [],
    returns: "The length of the sequence of characters represented by this object.",
    exceptions: "None.",
    pitfalls: "Strings use `.length()` with parentheses; arrays use `.length` property WITHOUT parentheses; Collections use `.size()`.",
    snippet: `String s = "Arena";
System.out.println(s.length()); // 5`
  },
  {
    name: "List.size",
    class: "java.util.List",
    letter: "L",
    category: "Collections",
    signature: "int size()",
    returnType: "int",
    description: "Returns the number of elements in this list.",
    parameters: [],
    returns: "Number of elements in this list.",
    exceptions: "None.",
    pitfalls: "If the list contains more than Integer.MAX_VALUE elements, returns Integer.MAX_VALUE.",
    snippet: `List<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
System.out.println(list.size()); // 2`
  },

  // --- M ---
  {
    name: "Math.max",
    class: "java.lang.Math",
    letter: "M",
    category: "Math",
    signature: "public static int max(int a, int b)",
    returnType: "int / double",
    description: "Returns the greater of two values. Overloaded for int, long, float, and double.",
    parameters: [
      { name: "a", type: "int", desc: "First argument" },
      { name: "b", type: "int", desc: "Second argument" }
    ],
    returns: "The larger of a and b.",
    exceptions: "None.",
    pitfalls: "Only compares 2 values at a time. To find max of 3, nest: `Math.max(a, Math.max(b, c))`.",
    snippet: `int highest = Math.max(45, 92); // 92`
  },
  {
    name: "Math.min",
    class: "java.lang.Math",
    letter: "M",
    category: "Math",
    signature: "public static int min(int a, int b)",
    returnType: "int / double",
    description: "Returns the smaller of two values. Overloaded for int, long, float, and double.",
    parameters: [
      { name: "a", type: "int", desc: "First argument" },
      { name: "b", type: "int", desc: "Second argument" }
    ],
    returns: "The smaller of a and b.",
    exceptions: "None.",
    pitfalls: "For floating points, if either operand is NaN, min() returns NaN.",
    snippet: `int lowest = Math.min(10, 3); // 3`
  },
  {
    name: "Map.put",
    class: "java.util.Map",
    letter: "M",
    category: "Collections",
    signature: "V put(K key, V value)",
    returnType: "V",
    description: "Associates the specified value with the specified key in this map. If map previously contained a mapping for the key, old value is replaced.",
    parameters: [
      { name: "key", type: "K", desc: "Key with which the specified value is to be associated" },
      { name: "value", type: "V", desc: "Value to be associated with the specified key" }
    ],
    returns: "Previous value associated with key, or null if there was no mapping.",
    exceptions: "NullPointerException if map does not permit null keys/values.",
    pitfalls: "Overwrites previous value silently. Use `putIfAbsent()` if you don't want overwriting.",
    snippet: `Map<String, String> capitals = new HashMap<>();
capitals.put("France", "Paris");
capitals.put("Japan", "Tokyo");`
  },

  // --- N ---
  {
    name: "Scanner.nextInt",
    class: "java.util.Scanner",
    letter: "N",
    category: "I/O & Scanner",
    signature: "public int nextInt()",
    returnType: "int",
    description: "Scans the next token of the input as an int.",
    parameters: [],
    returns: "The int scanned from the input.",
    exceptions: "InputMismatchException if next token does not match the Integer regular expression, NoSuchElementException if input exhausted.",
    pitfalls: "DOES NOT consume the newline '\\n' character after the integer! If reading a string next, call `sc.nextLine()` immediately to clear the buffer.",
    snippet: `Scanner sc = new Scanner(System.in);
int age = sc.nextInt();
sc.nextLine(); // Clear the newline buffer!
String name = sc.nextLine();`
  },
  {
    name: "Scanner.nextLine",
    class: "java.util.Scanner",
    letter: "N",
    category: "I/O & Scanner",
    signature: "public String nextLine()",
    returnType: "String",
    description: "Advances this scanner past the current line and returns the input that was skipped, consuming newline characters.",
    parameters: [],
    returns: "The line that was skipped.",
    exceptions: "NoSuchElementException if no line was found.",
    pitfalls: "Returns empty string if called right after nextInt() without clearing newline.",
    snippet: `Scanner sc = new Scanner(System.in);
String line = sc.nextLine();
System.out.println("User entered: " + line);`
  },

  // --- O ---
  {
    name: "Objects.requireNonNull",
    class: "java.util.Objects",
    letter: "O",
    category: "Utility",
    signature: "public static <T> T requireNonNull(T obj, String message)",
    returnType: "T",
    description: "Checks that the specified object reference is not null and throws a customized NullPointerException if it is.",
    parameters: [
      { name: "obj", type: "T", desc: "The object reference to check for nullity" },
      { name: "message", type: "String", desc: "Detail message to be used in event of NPE" }
    ],
    returns: "obj if not null.",
    exceptions: "NullPointerException if obj is null.",
    pitfalls: "Returns the object itself, allowing compact constructor field assignment: `this.name = Objects.requireNonNull(name);`.",
    snippet: `public User(String username) {
    this.username = Objects.requireNonNull(username, "Username must not be null");
}`
  },

  // --- P ---
  {
    name: "Math.pow",
    class: "java.lang.Math",
    letter: "P",
    category: "Math",
    signature: "public static double pow(double a, double b)",
    returnType: "double",
    description: "Returns the value of the first argument raised to the power of the second argument (a^b).",
    parameters: [
      { name: "a", type: "double", desc: "The base" },
      { name: "b", type: "double", desc: "The exponent" }
    ],
    returns: "a raised to power b as a double.",
    exceptions: "None.",
    pitfalls: "Returns double. If working with integer powers, cast to int or long: `(int) Math.pow(2, 5)`.",
    snippet: `double cube = Math.pow(3, 3); // 27.0
int twoPowerEight = (int) Math.pow(2, 8); // 256`
  },
  {
    name: "System.out.printf",
    class: "java.io.PrintStream",
    letter: "P",
    category: "I/O & Scanner",
    signature: "public PrintStream printf(String format, Object... args)",
    returnType: "PrintStream",
    description: "A convenience method to write a formatted string to this output stream using the specified format string and arguments.",
    parameters: [
      { name: "format", type: "String", desc: "A format string format specifiers" },
      { name: "args", type: "Object...", desc: "Arguments referenced by the format specifiers" }
    ],
    returns: "This output stream.",
    exceptions: "IllegalFormatException if format specifier is malformed.",
    pitfalls: "Does not append a newline automatically! Use `%n` at the end of format string for newline.",
    snippet: `double price = 12.3456;
System.out.printf("Total: $%.2f%n", price); // "Total: $12.35"`
  },
  {
    name: "System.out.println",
    class: "java.io.PrintStream",
    letter: "P",
    category: "I/O & Scanner",
    signature: "public void println(Object x)",
    returnType: "void",
    description: "Prints an Object and then terminates the line. Calls String.valueOf(x) under the hood.",
    parameters: [
      { name: "x", type: "Object", desc: "The Object to be printed" }
    ],
    returns: "void",
    exceptions: "None.",
    pitfalls: "Printing arrays directly prints their memory hash (e.g. `[I@15db9742`). Wrap in `Arrays.toString()`.",
    snippet: `System.out.println("Hello World!");`
  },

  // --- R ---
  {
    name: "Math.round",
    class: "java.lang.Math",
    letter: "R",
    category: "Math",
    signature: "public static long round(double a)",
    returnType: "long / int",
    description: "Returns the closest long to the argument, with ties rounding to positive infinity.",
    parameters: [
      { name: "a", type: "double", desc: "A floating-point value to be rounded" }
    ],
    returns: "The value of the argument rounded to the nearest long value.",
    exceptions: "None.",
    pitfalls: "For `round(double)` the return type is `long`, not `int`. For `round(float)` it returns `int`.",
    snippet: `long rounded = Math.round(4.6); // 5`
  },
  {
    name: "String.repeat",
    class: "java.lang.String",
    letter: "R",
    category: "Strings",
    signature: "public String repeat(int count)",
    returnType: "String",
    description: "Returns a string whose value is the concatenation of this string repeated count times (introduced in Java 11).",
    parameters: [
      { name: "count", type: "int", desc: "Number of times to repeat" }
    ],
    returns: "A string composed of this string repeated count times.",
    exceptions: "IllegalArgumentException if count is negative.",
    pitfalls: "Very fast and clean way to build dividers or indentation without manual loops.",
    snippet: `String line = "-".repeat(30);
System.out.println(line); // "------------------------------"`
  },
  {
    name: "String.replace",
    class: "java.lang.String",
    letter: "R",
    category: "Strings",
    signature: "public String replace(CharSequence target, CharSequence replacement)",
    returnType: "String",
    description: "Replaces each substring of this string that matches the literal target sequence with the specified replacement sequence.",
    parameters: [
      { name: "target", type: "CharSequence", desc: "The sequence of char values to be replaced" },
      { name: "replacement", type: "CharSequence", desc: "The replacement sequence of char values" }
    ],
    returns: "The resulting string.",
    exceptions: "NullPointerException if target or replacement is null.",
    pitfalls: "Replaces ALL occurrences literally. Does not treat target as regex. Use replaceAll() if regex is needed.",
    snippet: `String s = "cat bat rat";
String updated = s.replace("at", "ar"); // "car bar rar"`
  },
  {
    name: "StringBuilder.reverse",
    class: "java.lang.StringBuilder",
    letter: "R",
    category: "Strings",
    signature: "public StringBuilder reverse()",
    returnType: "StringBuilder",
    description: "Causes this character sequence to be replaced by the reverse of the sequence.",
    parameters: [],
    returns: "A reference to this StringBuilder object.",
    exceptions: "None.",
    pitfalls: "Mutates the StringBuilder in place.",
    snippet: `String original = "stressed";
String reversed = new StringBuilder(original).reverse().toString();
System.out.println(reversed); // "desserts"`
  },

  // --- S ---
  {
    name: "Math.sqrt",
    class: "java.lang.Math",
    letter: "S",
    category: "Math",
    signature: "public static double sqrt(double a)",
    returnType: "double",
    description: "Returns the correctly rounded positive square root of a double value.",
    parameters: [
      { name: "a", type: "double", desc: "A value" }
    ],
    returns: "The positive square root of a. If the argument is negative, returns NaN.",
    exceptions: "None.",
    pitfalls: "Passing a negative number returns Double.NaN instead of throwing an error.",
    snippet: `double root = Math.sqrt(49.0); // 7.0`
  },
  {
    name: "String.split",
    class: "java.lang.String",
    letter: "S",
    category: "Strings",
    signature: "public String[] split(String regex)",
    returnType: "String[]",
    description: "Splits this string around matches of the given regular expression.",
    parameters: [
      { name: "regex", type: "String", desc: "The delimiting regular expression" }
    ],
    returns: "The array of strings computed by splitting this string.",
    exceptions: "PatternSyntaxException if the regular expression's syntax is invalid.",
    pitfalls: "Regex special characters like `.` or `|` must be escaped with double backslashes: `str.split(\"\\\\.\")`.",
    snippet: `String data = "apple,banana,grape";
String[] fruits = data.split(",");
for (String f : fruits) System.out.println(f);`
  },
  {
    name: "String.startsWith",
    class: "java.lang.String",
    letter: "S",
    category: "Strings",
    signature: "public boolean startsWith(String prefix)",
    returnType: "boolean",
    description: "Tests if this string starts with the specified prefix.",
    parameters: [
      { name: "prefix", type: "String", desc: "The prefix to test" }
    ],
    returns: "true if string begins with prefix; false otherwise.",
    exceptions: "NullPointerException if prefix is null.",
    pitfalls: "Case-sensitive.",
    snippet: `String url = "https://example.com";
if (url.startsWith("https://")) {
    System.out.println("Secure connection");
}`
  },
  {
    name: "String.strip",
    class: "java.lang.String",
    letter: "S",
    category: "Strings",
    signature: "public String strip()",
    returnType: "String",
    description: "Returns a string whose value is this string, with all leading and trailing white space removed according to Character.isWhitespace(int) (introduced in Java 11).",
    parameters: [],
    returns: "A string whose value is this string, with all leading and trailing white space removed.",
    exceptions: "None.",
    pitfalls: "Prefer strip() over trim() in modern Java; trim() only recognizes ASCII spaces (<= U+0020).",
    snippet: `String dirty = "   Clean Data \\n\\t ";
String clean = dirty.strip(); // "Clean Data"`
  },
  {
    name: "String.substring",
    class: "java.lang.String",
    letter: "S",
    category: "Strings",
    signature: "public String substring(int beginIndex, int endIndex)",
    returnType: "String",
    description: "Returns a string that is a substring of this string. Starts at beginIndex (inclusive) and extends to endIndex - 1 (exclusive).",
    parameters: [
      { name: "beginIndex", type: "int", desc: "The beginning index, inclusive" },
      { name: "endIndex", type: "int", desc: "The ending index, exclusive" }
    ],
    returns: "The specified substring.",
    exceptions: "IndexOutOfBoundsException if beginIndex is negative, endIndex is larger than length, or beginIndex > endIndex.",
    pitfalls: "Remember endIndex is EXCLUSIVE. Length of substring is always (endIndex - beginIndex).",
    snippet: `String s = "CompetitiveProgramming";
String sub = s.substring(0, 11);
System.out.println(sub); // "Competitive"`
  },
  {
    name: "StringBuilder.append",
    class: "java.lang.StringBuilder",
    letter: "S",
    category: "Strings",
    signature: "public StringBuilder append(String str)",
    returnType: "StringBuilder",
    description: "Appends the specified string to this character sequence. Overloaded for all primitive types and objects.",
    parameters: [
      { name: "str", type: "String", desc: "A string to append" }
    ],
    returns: "A reference to this object (fluent method chaining).",
    exceptions: "None.",
    pitfalls: "Always use StringBuilder inside loops instead of String `+` concatenation to avoid quadratic memory copying.",
    snippet: `StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i).append(" ");
}
System.out.println(sb.toString().strip()); // "1 2 3 4 5"`
  },

  // --- T ---
  {
    name: "String.toCharArray",
    class: "java.lang.String",
    letter: "T",
    category: "Strings",
    signature: "public char[] toCharArray()",
    returnType: "char[]",
    description: "Converts this string to a newly allocated character array.",
    parameters: [],
    returns: "A newly allocated character array whose length is the length of this string.",
    exceptions: "None.",
    pitfalls: "Creates a copy of the characters; modifying the char array will not alter the original string.",
    snippet: `String word = "hello";
char[] chars = word.toCharArray();
chars[0] = 'H';
System.out.println(new String(chars)); // "Hello"`
  },
  {
    name: "String.toLowerCase",
    class: "java.lang.String",
    letter: "T",
    category: "Strings",
    signature: "public String toLowerCase()",
    returnType: "String",
    description: "Converts all of the characters in this String to lower case using the rules of the default locale.",
    parameters: [],
    returns: "The String, converted to lowercase.",
    exceptions: "None.",
    pitfalls: "Strings are immutable! Calling `s.toLowerCase()` does not change `s`. You must reassign: `s = s.toLowerCase();`.",
    snippet: `String raw = "NEO PORTAL";
String lower = raw.toLowerCase(); // "neo portal"`
  },
  {
    name: "String.toUpperCase",
    class: "java.lang.String",
    letter: "T",
    category: "Strings",
    signature: "public String toUpperCase()",
    returnType: "String",
    description: "Converts all of the characters in this String to upper case using the rules of the default locale.",
    parameters: [],
    returns: "The String, converted to uppercase.",
    exceptions: "None.",
    pitfalls: "Remember to reassign: `str = str.toUpperCase()`.",
    snippet: `String code = "java-001".toUpperCase(); // "JAVA-001"`
  },
  {
    name: "Thread.sleep",
    class: "java.lang.Thread",
    letter: "T",
    category: "Utility",
    signature: "public static void sleep(long millis) throws InterruptedException",
    returnType: "void",
    description: "Causes the currently executing thread to sleep (temporarily cease execution) for the specified number of milliseconds.",
    parameters: [
      { name: "millis", type: "long", desc: "The length of time to sleep in milliseconds" }
    ],
    returns: "void",
    exceptions: "InterruptedException if another thread interrupts the current thread.",
    pitfalls: "Throws checked InterruptedException; must be caught or declared with `throws`.",
    snippet: `try {
    Thread.sleep(1000); // Pause for 1 second
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}`
  },

  // --- V ---
  {
    name: "String.valueOf",
    class: "java.lang.String",
    letter: "V",
    category: "Strings",
    signature: "public static String valueOf(Object obj)",
    returnType: "String",
    description: "Returns the string representation of the Object argument (or primitive: int, double, boolean, char). Safe with null.",
    parameters: [
      { name: "obj", type: "Object", desc: "An Object or primitive" }
    ],
    returns: "If the argument is null, then a string equal to 'null'; otherwise, the value of obj.toString().",
    exceptions: "None.",
    pitfalls: "Safe alternative to `obj.toString()` because it will NOT throw NullPointerException if obj is null.",
    snippet: `Object nullObj = null;
String s = String.valueOf(nullObj); // "null" (No NPE!)
int num = 42;
String sNum = String.valueOf(num); // "42"`
  },
  {
    name: "Integer.valueOf",
    class: "java.lang.Integer",
    letter: "V",
    category: "Primitives",
    signature: "public static Integer valueOf(int i)",
    returnType: "Integer",
    description: "Returns an Integer instance representing the specified int value. Uses internal caching between -128 and 127.",
    parameters: [
      { name: "i", type: "int", desc: "An int value" }
    ],
    returns: "An Integer instance representing i.",
    exceptions: "None.",
    pitfalls: "Prefer `Integer.valueOf(i)` over `new Integer(i)` (which is deprecated since Java 9) to leverage cache memory pooling.",
    snippet: `Integer boxed = Integer.valueOf(100);`
  }
];

function getMasterclassData() {
  return {
    modules: masterclassModules,
    methods: methodsAtoZ,
    stats: {
      totalModules: masterclassModules.length,
      totalMethods: methodsAtoZ.length,
      categories: Array.from(new Set(methodsAtoZ.map(m => m.category))),
      alphabetIndex: Array.from(new Set(methodsAtoZ.map(m => m.letter))).sort()
    }
  };
}

module.exports = {
  masterclassModules,
  methodsAtoZ,
  getMasterclassData
};
