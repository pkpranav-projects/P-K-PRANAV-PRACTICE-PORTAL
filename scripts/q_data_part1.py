# Question Data Part 1: Questions 1 to 15

QUESTIONS_PART1 = [
    {
        "id": "java-001",
        "title": "Substring Insertion at Position",
        "description": "Ashok is developing a text-processing utility that inserts a substring into an original string at a specified position. The program reads the original string, the substring to insert, and the index at which the substring should be inserted, then prints the resulting string.\n\nThe substring is inserted before the character currently at the given index. For example, inserting at index 0 places the substring at the very beginning, and inserting at an index equal to the original string's length appends the substring at the end.",
        "inputFormat": "The first line contains the original string.\nThe second line contains the substring to insert.\nThe third line contains an integer — the index position at which to insert the substring (indexing starts from 0).\n\nNote: A string may contain spaces, so each string must be read as a full line of input.",
        "outputFormat": "Print the modified string after inserting the substring.\nRefer to the sample output for formatting specifications.",
        "constraints": [
            "1 <= length of original string <= 100",
            "1 <= length of substring to insert <= 50",
            "0 <= index position <= length of original string"
        ],
        "sampleInput": "HelloWorld\nNew\n6",
        "sampleOutput": "HelloWNeworld",
        "testCases": [
            {
                "input": "HelloWorld\nNew\n6",
                "expectedOutput": "HelloWNeworld",
                "isHidden": False
            },
            {
                "input": "Hello\nWorld\n0",
                "expectedOutput": "WorldHello",
                "isHidden": False
            },
            {
                "input": "This is an place\namazing \n11",
                "expectedOutput": "This is an amazing place",
                "isHidden": False
            },
            {
                "input": "Code\nJava\n4",
                "expectedOutput": "CodeJava",
                "isHidden": True
            },
            {
                "input": "Examly Portal\nNeo \n7",
                "expectedOutput": "Examly Neo Portal",
                "isHidden": True
            }
        ],
        "topic": "Strings",
        "difficulty": "Easy",
        "sourceScreenshot": "Screenshot (159).png - Screenshot (162).png",
        "explanation": "Use string slicing with substring(0, index) and substring(index) or a StringBuilder to insert the new string at the designated index.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String str = sc.nextLine();
        String sub = sc.nextLine();
        int index = Integer.parseInt(sc.nextLine().trim());
        String result = str.substring(0, index) + sub + str.substring(index);
        System.out.println(result);
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-002",
        "title": "Even and Odd Number Classifier",
        "description": "Design an Object-Oriented Java program using a class named NumberClassifier that classifies an array of integers into even and odd numbers.\\n\\nThe NumberClassifier class must contain:\\n- An array to store input integers\\n- Two arrays to store even and odd numbers\\n- Methods: initializeArrays(int size), setInputValues(int[] arr), classifyNumbers(), printEvenNumbers(), and printOddNumbers().\\n\\nThe main method reads the size of the array, then the array elements, classifies them, and prints the even numbers followed by the odd numbers.",
        "inputFormat": "The first line contains an integer size representing the number of elements.\\nThe second line contains size space-separated integers.",
        "outputFormat": "The first line prints 'Even numbers: ' followed by the space-separated even numbers.\\nThe second line prints 'Odd numbers: ' followed by the space-separated odd numbers.",
        "constraints": [
            "1 <= size <= 100",
            "-1000 <= array element <= 1000"
        ],
        "sampleInput": "8\n6 2 4 3 7 13 11 10",
        "sampleOutput": "Even numbers: 6 2 4 10\nOdd numbers: 3 7 13 11",
        "testCases": [
            {
                "input": "8\n6 2 4 3 7 13 11 10",
                "expectedOutput": "Even numbers: 6 2 4 10\nOdd numbers: 3 7 13 11",
                "isHidden": False
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "Even numbers: 2 4\nOdd numbers: 1 3 5",
                "isHidden": False
            },
            {
                "input": "4\n2 4 6 8",
                "expectedOutput": "Even numbers: 2 4 6 8\nOdd numbers:",
                "isHidden": True
            },
            {
                "input": "3\n1 3 5",
                "expectedOutput": "Even numbers:\nOdd numbers: 1 3 5",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (163).png - Screenshot (166).png",
        "explanation": "Create a NumberClassifier class to store input and split it into even and odd collections based on modulo 2 arithmetic.",
        "referenceSolution": """import java.util.Scanner;

class NumberClassifier {
    private int[] input;
    private int[] even;
    private int[] odd;
    private int evenCount = 0;
    private int oddCount = 0;

    public void initializeArrays(int size) {
        even = new int[size];
        odd = new int[size];
    }

    public void setInputValues(int[] arr) {
        this.input = arr;
    }

    public void classifyNumbers() {
        for (int x : input) {
            if (x % 2 == 0) {
                even[evenCount++] = x;
            } else {
                odd[oddCount++] = x;
            }
        }
    }

    public void printEvenNumbers() {
        System.out.print("Even numbers:");
        for (int i = 0; i < evenCount; i++) {
            System.out.print(" " + even[i]);
        }
        System.out.println();
    }

    public void printOddNumbers() {
        System.out.print("Odd numbers:");
        for (int i = 0; i < oddCount; i++) {
            System.out.print(" " + odd[i]);
        }
        System.out.println();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        int size = scanner.nextInt();
        NumberClassifier obj = new NumberClassifier();
        obj.initializeArrays(size);
        int[] inputArr = new int[size];
        for (int i = 0; i < size; i++) {
            inputArr[i] = scanner.nextInt();
        }
        obj.setInputValues(inputArr);
        obj.classifyNumbers();
        obj.printEvenNumbers();
        obj.printOddNumbers();
        scanner.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class NumberClassifier {
    // Implement methods here
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution here
        scanner.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-003",
        "title": "Alphabetically Sorted Substrings",
        "description": "Consider a scenario where you are tasked with organizing all possible substrings of a word into sorted order. You are given a string, and your goal is to find and display all the contiguous substrings of that string.\n\nFor instance, if the input string is 'fun', the output should list all possible substrings in alphabetically sorted order: f, fu, fun, n, u, un.\n\nThe total number of substrings for a string of length n is n * (n + 1) / 2. Write a program that generates all contiguous substrings of the given string and prints each one on a separate line in alphabetical order.",
        "inputFormat": "The first line of input contains a string representing the input string.",
        "outputFormat": "The program should print all substrings of the input string in alphabetical order. Each substring should be printed on a separate line.",
        "constraints": [
            "1 <= length of string <= 200",
            "The string contains only lowercase characters."
        ],
        "sampleInput": "examly",
        "sampleOutput": "a\nam\naml\namly\ne\nex\nexa\nexam\nexaml\nexamly\nl\nly\nm\nml\nmly\nx\nxa\nxam\nxaml\nxamly\ny",
        "testCases": [
            {
                "input": "examly",
                "expectedOutput": "a\nam\naml\namly\ne\nex\nexa\nexam\nexaml\nexamly\nl\nly\nm\nml\nmly\nx\nxa\nxam\nxaml\nxamly\ny",
                "isHidden": False
            },
            {
                "input": "fun",
                "expectedOutput": "f\nfu\nfun\nn\nu\nun",
                "isHidden": False
            },
            {
                "input": "aba",
                "expectedOutput": "a\na\nab\naba\nb\nba",
                "isHidden": True
            }
        ],
        "topic": "Strings",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (166).png - Screenshot (169).png",
        "explanation": "Iterate with nested loops (i from 0 to len, j from i+1 to len+1) to generate all substrings, store them in a List, sort with Collections.sort(), and print.",
        "referenceSolution": """import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        List<String> list = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            for (int j = i + 1; j <= s.length(); j++) {
                list.add(s.substring(i, j));
            }
        }
        Collections.sort(list);
        for (String sub : list) {
            System.out.println(sub);
        }
        sc.close();
    }
}""",
        "starterCode": """import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-004",
        "title": "Case-Insensitive Anagram Checker",
        "description": "Sarah wants to build a tool that checks whether two strings are anagrams of each other. Before comparing, the tool removes all spaces and treats letters case-insensitively. Two strings are anagrams if, after this processing, they contain exactly the same characters with the same frequency.\\n\\nProcessing rules:\\n- Ignore only the space character (' '). All other characters — letters, digits, and special characters — are kept and compared.\\n- Letters are compared case-insensitively (for example, 'B' and 'b' are the same).\\n- Digits and special characters must match in both count and value.\\n\\nPrint 'Anagrams' if the two strings are anagrams, and 'Not Anagrams' otherwise.",
        "inputFormat": "The first line contains the first string.\\nThe second line contains the second string.\\n\\nNote: A string may contain spaces, so the entire line must be read as input.",
        "outputFormat": "Print 'Anagrams' if the two strings are anagrams. Print 'Not Anagrams' if they are not.",
        "constraints": [
            "1 <= length of each input string <= 100 characters.",
            "Each string may contain uppercase letters, lowercase letters, digits, special characters, and spaces."
        ],
        "sampleInput": "OpenAI\niApNeo",
        "sampleOutput": "Anagrams",
        "testCases": [
            {
                "input": "OpenAI\niApNeo",
                "expectedOutput": "Anagrams",
                "isHidden": False
            },
            {
                "input": "BAT @123\ntab123 @",
                "expectedOutput": "Anagrams",
                "isHidden": False
            },
            {
                "input": "Hello\nWorld",
                "expectedOutput": "Not Anagrams",
                "isHidden": True
            },
            {
                "input": "Silent\nListen",
                "expectedOutput": "Anagrams",
                "isHidden": True
            }
        ],
        "topic": "Strings",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (170).png - Screenshot (171).png",
        "explanation": "Strip spaces from both strings, convert uppercase letters to lowercase, and check if character frequency arrays or sorted char arrays are identical.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s1 = sc.nextLine();
        String s2 = sc.nextLine();
        int[] count = new int[256];

        for (char c : s1.toCharArray()) {
            if (c == ' ') continue;
            if (Character.isLetter(c)) c = Character.toLowerCase(c);
            count[c]++;
        }

        for (char c : s2.toCharArray()) {
            if (c == ' ') continue;
            if (Character.isLetter(c)) c = Character.toLowerCase(c);
            count[c]--;
        }

        boolean isAnagram = true;
        for (int val : count) {
            if (val != 0) {
                isAnagram = false;
                break;
            }
        }

        if (isAnagram) {
            System.out.println("Anagrams");
        } else {
            System.out.println("Not Anagrams");
        }
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-005",
        "title": "Fibonacci Number and Properties",
        "description": "Paul, a mathematics teacher, wants to help his students analyze Fibonacci numbers. Design a program using a class named FibonacciCalculator that performs the following operations for a given position n:\\n\\n1. fibonacci(int n): Computes and returns the nth Fibonacci number (fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5, fib(6)=8, fib(7)=13, ...).\\n2. checkEvenOdd(long num): Returns 'Even' if the number is even, and 'Odd' if the number is odd.\\n3. digitSum(long num): Calculates and returns the sum of the digits of the Fibonacci number.\\n\\nThe main method reads n, creates an instance of FibonacciCalculator, computes the Fibonacci number, and prints:\\n'Fibonacci number at position n: [fib]'\\n'[Even/Odd], Digit Sum: [sum]'",
        "inputFormat": "The input consists of an integer n representing the position in the Fibonacci sequence (indexing starts from 0 or 1 per problem; position 7 is 13, position 3 is 2).",
        "outputFormat": "The first line displays 'Fibonacci number at position n: [fib]'\\nThe second line displays '[Even/Odd], Digit Sum: [sum]'",
        "constraints": [
            "0 <= n <= 50"
        ],
        "sampleInput": "7",
        "sampleOutput": "Fibonacci number at position 7: 13\nOdd, Digit Sum: 4",
        "testCases": [
            {
                "input": "7",
                "expectedOutput": "Fibonacci number at position 7: 13\nOdd, Digit Sum: 4",
                "isHidden": False
            },
            {
                "input": "3",
                "expectedOutput": "Fibonacci number at position 3: 2\nEven, Digit Sum: 2",
                "isHidden": False
            },
            {
                "input": "6",
                "expectedOutput": "Fibonacci number at position 6: 8\nEven, Digit Sum: 8",
                "isHidden": True
            },
            {
                "input": "10",
                "expectedOutput": "Fibonacci number at position 10: 55\nOdd, Digit Sum: 10",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (172).png - Screenshot (174).png",
        "explanation": "Compute fibonacci using iterative dynamic programming up to n. Check if fib % 2 == 0. Compute digit sum using modulo and division by 10.",
        "referenceSolution": """import java.util.Scanner;

class FibonacciCalculator {
    public long fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return b;
    }

    public String checkEvenOdd(long num) {
        return (num % 2 == 0) ? "Even" : "Odd";
    }

    public int digitSum(long num) {
        int sum = 0;
        while (num > 0) {
            sum += num % 10;
            num /= 10;
        }
        return sum;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        FibonacciCalculator obj = new FibonacciCalculator();
        long fib = obj.fibonacci(n);
        System.out.println("Fibonacci number at position " + n + ": " + fib);
        System.out.println(obj.checkEvenOdd(fib) + ", Digit Sum: " + obj.digitSum(fib));
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class FibonacciCalculator {
    // Implement fibonacci, checkEvenOdd, digitSum
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-006",
        "title": "Autoboxing and Unboxing Demonstration",
        "description": "Design a Java program to demonstrate the use of autoboxing (converting primitive types to their corresponding wrapper classes) and unboxing (converting wrapper classes back to primitive types).\\n\\nThe system should perform the following operations:\\n- Convert primitive types (int, double, char, boolean) to their wrapper class objects (Integer, Double, Character, Boolean).\\n- Extract the primitive values back from the wrapper objects.\\n\\nDisplay the wrapper objects under an 'Autoboxing:' heading, and display the unboxed primitives under an 'Unboxing:' heading.",
        "inputFormat": "The first line contains an integer value.\\nThe second line contains a double value.\\nThe third line contains a character value.\\nThe fourth line contains a boolean value.",
        "outputFormat": "The first output displays:\\nAutoboxing:\\nInteger wrapper: <boxed integer value>\\nDouble wrapper: <boxed double value>\\nCharacter wrapper: <boxed character value>\\nBoolean wrapper: <boxed boolean value>\\n\\nThe second output displays:\\nUnboxing:\\nPrimitive int: <unboxed integer value>\\nPrimitive double: <unboxed double value>\\nPrimitive char: <unboxed character value>\\nPrimitive boolean: <unboxed boolean value>",
        "constraints": [
            "-10^6 <= integer <= 10^6",
            "Valid double precision range"
        ],
        "sampleInput": "42\n3.14\nA\ntrue",
        "sampleOutput": "Autoboxing:\nInteger wrapper: 42\nDouble wrapper: 3.14\nCharacter wrapper: A\nBoolean wrapper: true\nUnboxing:\nPrimitive int: 42\nPrimitive double: 3.14\nPrimitive char: A\nPrimitive boolean: true",
        "testCases": [
            {
                "input": "42\n3.14\nA\ntrue",
                "expectedOutput": "Autoboxing:\nInteger wrapper: 42\nDouble wrapper: 3.14\nCharacter wrapper: A\nBoolean wrapper: true\nUnboxing:\nPrimitive int: 42\nPrimitive double: 3.14\nPrimitive char: A\nPrimitive boolean: true",
                "isHidden": False
            },
            {
                "input": "-100\n0.001\nz\nfalse",
                "expectedOutput": "Autoboxing:\nInteger wrapper: -100\nDouble wrapper: 0.001\nCharacter wrapper: z\nBoolean wrapper: false\nUnboxing:\nPrimitive int: -100\nPrimitive double: 0.001\nPrimitive char: z\nPrimitive boolean: false",
                "isHidden": False
            }
        ],
        "topic": "Wrapper Class",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (175).png - Screenshot (179).png",
        "explanation": "Read primitive values, assign to wrapper class references (autoboxing), print wrapper values, then assign wrapper references to primitive variables (unboxing) and print.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int i = sc.nextInt();
        double d = sc.nextDouble();
        char c = sc.next().charAt(0);
        boolean b = sc.nextBoolean();

        // Autoboxing
        Integer integerWrapper = i;
        Double doubleWrapper = d;
        Character characterWrapper = c;
        Boolean booleanWrapper = b;

        System.out.println("Autoboxing:");
        System.out.println("Integer wrapper: " + integerWrapper);
        System.out.println("Double wrapper: " + doubleWrapper);
        System.out.println("Character wrapper: " + characterWrapper);
        System.out.println("Boolean wrapper: " + booleanWrapper);

        // Unboxing
        int primitiveInt = integerWrapper;
        double primitiveDouble = doubleWrapper;
        char primitiveChar = characterWrapper;
        boolean primitiveBoolean = booleanWrapper;

        System.out.println("Unboxing:");
        System.out.println("Primitive int: " + primitiveInt);
        System.out.println("Primitive double: " + primitiveDouble);
        System.out.println("Primitive char: " + primitiveChar);
        System.out.println("Primitive boolean: " + primitiveBoolean);

        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-007",
        "title": "Decimal to Roman Numerals Converter",
        "description": "Robin is fascinated by ancient Roman numerals and wants to create a program to convert decimal numbers to Roman numerals. He needs your help to complete the program.\\n\\nRoman numerals are represented using the standard symbols: M (1000), CM (900), D (500), CD (400), C (100), XC (90), L (50), XL (40), X (10), IX (9), V (5), IV (4), I (1).\\n\\nGiven an integer n, convert it into its Roman numeral equivalent.",
        "inputFormat": "The input consists of an integer, n.",
        "outputFormat": "The output prints the Roman numeral of the given integer.",
        "constraints": [
            "1 <= n <= 3999"
        ],
        "sampleInput": "111",
        "sampleOutput": "CXI",
        "testCases": [
            {
                "input": "111",
                "expectedOutput": "CXI",
                "isHidden": False
            },
            {
                "input": "145",
                "expectedOutput": "CXLV",
                "isHidden": False
            },
            {
                "input": "1999",
                "expectedOutput": "MCMXCIX",
                "isHidden": True
            },
            {
                "input": "4",
                "expectedOutput": "IV",
                "isHidden": True
            }
        ],
        "topic": "Strings",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (180).png - Screenshot (182).png",
        "explanation": "Iterate through predefined integer values and Roman numeral symbols in descending order, subtracting values and appending symbols while n >= value.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner obj = new Scanner(System.in);
        if (!obj.hasNextInt()) return;
        int n = obj.nextInt();
        int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            while (n >= values[i]) {
                result.append(symbols[i]);
                n -= values[i];
            }
        }
        System.out.println(result.toString());
        obj.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-008",
        "title": "Number Operations with Wrapper Class",
        "description": "Aman wants to create a simple calculator that accepts a single numerical value as a String, converts it into an Integer using Java's Wrapper Class, and performs the following operations:\\n1. Square of the number\\n2. Cube of the number\\n3. Square root of the number (rounded to 2 decimal places)\\n\\nPrint the square, cube, and square root separated by single spaces.",
        "inputFormat": "The first line of input consists of a single String value representing an integer number.",
        "outputFormat": "The output displays three space-separated values:\\n<Square of number (integer)> <Cube of number (integer)> <Square root of number (double rounded to 2 decimal places)>",
        "constraints": [
            "1 <= number <= 1000",
            "The input is always a valid integer in String format."
        ],
        "sampleInput": "25",
        "sampleOutput": "625 15625 5.00",
        "testCases": [
            {
                "input": "25",
                "expectedOutput": "625 15625 5.00",
                "isHidden": False
            },
            {
                "input": "4",
                "expectedOutput": "16 64 2.00",
                "isHidden": False
            },
            {
                "input": "9",
                "expectedOutput": "81 729 3.00",
                "isHidden": True
            },
            {
                "input": "2",
                "expectedOutput": "4 8 1.41",
                "isHidden": True
            }
        ],
        "topic": "Wrapper Class",
        "difficulty": "Easy",
        "sourceScreenshot": "Screenshot (183).png - Screenshot (185).png",
        "explanation": "Use Integer.valueOf(input) to parse String to Integer wrapper. Calculate square (num*num), cube (num*num*num), and Math.sqrt(num) formatted with String.format('%.2f').",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextLine()) return;
        String input = scanner.nextLine().trim();
        Integer number = Integer.valueOf(input);
        int square = number * number;
        int cube = number * number * number;
        double squareRoot = Math.sqrt(number);
        System.out.printf("%d %d %.2f\\n", square, cube, squareRoot);
        scanner.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution here
        scanner.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-009",
        "title": "Text Replacement Engine using StringBuilder",
        "description": "Nick is tasked with developing a Text Replacement Engine that replaces all occurrences of a specified substring in a given text. The engine should take the original text, the substring to be replaced, and the replacement string as input and output the modified text after performing the replacement.\\n\\nHelp Nick complete the task using the StringBuilder class.\\n\\nPrint the original string on the first line, followed by the modified string on the second line.",
        "inputFormat": "The first line of input contains a string that represents the original string.\\nThe second line contains a string that represents the substring to replace.\\nThe third line contains a string that represents the replacement string.",
        "outputFormat": "The first line of output prints a string representing the original string.\\nThe second line prints a string representing the modified string after replacement.",
        "constraints": [
            "1 <= length of original string <= 500",
            "1 <= length of substring to replace <= 100",
            "1 <= length of replacement string <= 100",
            "The original string may contain lowercase letters, uppercase letters, digits, special characters, and spaces."
        ],
        "sampleInput": "Hello, world! Hello, Java!\nHello\nHi",
        "sampleOutput": "Hello, world! Hello, Java!\nHi, world! Hi, Java!",
        "testCases": [
            {
                "input": "Hello, world! Hello, Java!\nHello\nHi",
                "expectedOutput": "Hello, world! Hello, Java!\nHi, world! Hi, Java!",
                "isHidden": False
            },
            {
                "input": "Programming is fun!\nfun\nexciting",
                "expectedOutput": "Programming is fun!\nProgramming is exciting!",
                "isHidden": False
            },
            {
                "input": "apple banana apple\napple\norange",
                "expectedOutput": "apple banana apple\norange banana orange",
                "isHidden": True
            }
        ],
        "topic": "Strings",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (186).png - Screenshot (188).png",
        "explanation": "Create a StringBuilder with originalString, repeatedly find index of target substring using indexOf and replace with sb.replace(index, index + toReplace.length(), replacement). Print original string then modified string.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void replaceText(String originalString, String toReplace, String replacement) {
        StringBuilder sb = new StringBuilder(originalString);
        int index = sb.indexOf(toReplace);
        while (index != -1) {
            sb.replace(index, index + toReplace.length(), replacement);
            index = sb.indexOf(toReplace, index + replacement.length());
        }
        System.out.println(originalString);
        System.out.println(sb.toString());
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextLine()) return;
        String originalString = scanner.nextLine();
        String toReplace = scanner.nextLine();
        String replacement = scanner.nextLine();
        replaceText(originalString, toReplace, replacement);
        scanner.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    // Implement replaceText method
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution here
        scanner.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-010",
        "title": "Pythagorean Triple Validator",
        "description": "Laura is learning about Pythagorean triples in her math class. She wants to create a program to determine whether a set of three integers forms a Pythagorean triple. Implement a program using the PythagoreanCalculator class to input the sides of a triangle and determine if it is a Pythagorean triple or not.\\n\\nThe condition for the Pythagorean triple is:\\na^2 + b^2 = c^2 (or) a^2 + c^2 = b^2 (or) b^2 + c^2 = a^2",
        "inputFormat": "The input consists of three space-separated integers a, b, and c representing the sides of a triangle.",
        "outputFormat": "The output prints 'The numbers a, b, c form a Pythagorean triple' or 'The numbers a, b, c do not form a Pythagorean triple' based on the inputs.",
        "constraints": [
            "1 <= a, b, c <= 100"
        ],
        "sampleInput": "3 4 5",
        "sampleOutput": "The numbers 3, 4, 5 form a Pythagorean triple",
        "testCases": [
            {
                "input": "3 4 5",
                "expectedOutput": "The numbers 3, 4, 5 form a Pythagorean triple",
                "isHidden": False
            },
            {
                "input": "1 100 95",
                "expectedOutput": "The numbers 1, 100, 95 do not form a Pythagorean triple",
                "isHidden": False
            },
            {
                "input": "8 15 17",
                "expectedOutput": "The numbers 8, 15, 17 form a Pythagorean triple",
                "isHidden": False
            },
            {
                "input": "5 12 13",
                "expectedOutput": "The numbers 5, 12, 13 form a Pythagorean triple",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Easy",
        "sourceScreenshot": "Screenshot (189).png - Screenshot (194).png",
        "explanation": "Create PythagoreanCalculator class with boolean isPythagoreanTriple(int a, int b, int c) checking if any pair of squares sums to the third square.",
        "referenceSolution": """import java.util.Scanner;

class PythagoreanCalculator {
    public boolean isPythagoreanTriple(int a, int b, int c) {
        return (a * a + b * b == c * c) || (a * a + c * c == b * b) || (b * b + c * c == a * a);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        PythagoreanCalculator calculator = new PythagoreanCalculator();
        boolean result = calculator.isPythagoreanTriple(a, b, c);
        if (result) {
            System.out.println("The numbers " + a + ", " + b + ", " + c + " form a Pythagorean triple");
        } else {
            System.out.println("The numbers " + a + ", " + b + ", " + c + " do not form a Pythagorean triple");
        }
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class PythagoreanCalculator {
    // Implement isPythagoreanTriple
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-011",
        "title": "Power of Two Checker",
        "description": "Meera is a software intern at a networking firm. While studying binary addressing, she noticed that memory block sizes in computers are always powers of two (1, 2, 4, 8, 16, ...). Her team lead asked her to write a utility program that checks whether a given positive integer is a power of two.\\n\\nA number N is a power of two if there exists a non-negative integer k such that N = 2^k.\\n\\nThe program uses a user-defined function checkPowerOfTwo() that accepts a long/integer N and returns the appropriate string. The main function reads the input, calls checkPowerOfTwo(), and prints the result.\\n\\nNote: A number N is a power of two if and only if N > 0 and (N & (N - 1)) == 0.",
        "inputFormat": "The first line of input consists of an integer N representing the number to be checked.",
        "outputFormat": "The first line of output consists of a string 'Power of Two' if the number is a power of two, or 'Not a Power of Two' otherwise.",
        "constraints": [
            "1 <= N <= 1000000000",
            "Note: N = 1 is considered a power of two (2^0 = 1)."
        ],
        "sampleInput": "16",
        "sampleOutput": "Power of Two",
        "testCases": [
            {
                "input": "16",
                "expectedOutput": "Power of Two",
                "isHidden": False
            },
            {
                "input": "2",
                "expectedOutput": "Power of Two",
                "isHidden": False
            },
            {
                "input": "18",
                "expectedOutput": "Not a Power of Two",
                "isHidden": False
            },
            {
                "input": "1",
                "expectedOutput": "Power of Two",
                "isHidden": True
            },
            {
                "input": "1024",
                "expectedOutput": "Power of Two",
                "isHidden": True
            }
        ],
        "topic": "Methods",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (195).png",
        "explanation": "Check if (N > 0) && ((N & (N - 1)) == 0). If true, return 'Power of Two', else 'Not a Power of Two'.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static String checkPowerOfTwo(long n) {
        if (n > 0 && (n & (n - 1)) == 0) {
            return "Power of Two";
        } else {
            return "Not a Power of Two";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long n = sc.nextLong();
        System.out.println(checkPowerOfTwo(n));
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static String checkPowerOfTwo(long n) {
        // Write your logic here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-012",
        "title": "Digit Sum Calculation",
        "description": "Arjun is a mathematics teacher who gives his students a warm-up exercise every morning. One of his favourite exercises involves finding the digit sum of a number — that is, the sum of all individual digits of a non-negative integer. For example, the digit sum of 253 is 2 + 5 + 3 = 10.\\n\\nArjun wants to automate this exercise using a program. Help him build a program that reads a non-negative integer and prints its digit sum.\\n\\nThe program uses a user-defined function digitSum() that accepts an integer N and returns the sum of its digits by repeatedly extracting the last digit using the modulo operator and dividing the number by 10 until it becomes 0. The main function reads the input, calls digitSum(), and prints the result.\\n\\nNote: If the input is 0, the digit sum is 0.",
        "inputFormat": "The first line of input consists of an integer N representing the non-negative number whose digit sum is to be computed.",
        "outputFormat": "The first line of output consists of an integer representing the digit sum of the given number.",
        "constraints": [
            "0 <= N <= 1000000000"
        ],
        "sampleInput": "253",
        "sampleOutput": "10",
        "testCases": [
            {
                "input": "253",
                "expectedOutput": "10",
                "isHidden": False
            },
            {
                "input": "456",
                "expectedOutput": "15",
                "isHidden": False
            },
            {
                "input": "0",
                "expectedOutput": "0",
                "isHidden": True
            },
            {
                "input": "9999",
                "expectedOutput": "36",
                "isHidden": True
            }
        ],
        "topic": "Methods",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (196).png - Screenshot (197).png",
        "explanation": "Iterate while n > 0, sum += n % 10, n /= 10. Return sum.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static int digitSum(int n) {
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        System.out.println(digitSum(n));
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static int digitSum(int n) {
        // Implement logic
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-013",
        "title": "Student Test Scores Sum and Average",
        "description": "Divya is a class teacher who maintains her students' test scores in a list. At the end of each exam cycle, she needs to quickly find the total marks scored by all students and the class average. Divya wants a program that takes the number of students and their scores, then prints the sum and the average rounded to 2 decimal places.",
        "inputFormat": "The first line contains an integer N representing the number of students.\\nThe second line contains N space-separated numbers representing the scores of the students.",
        "outputFormat": "Print two lines:\\nSum: <total sum of scores>\\nAverage: <average score formatted to 2 decimal places>",
        "constraints": [
            "1 <= N <= 100",
            "0.0 <= score <= 100.0"
        ],
        "sampleInput": "5\n80 85 90 95 100",
        "sampleOutput": "Sum: 450.00\nAverage: 90.00",
        "testCases": [
            {
                "input": "5\n80 85 90 95 100",
                "expectedOutput": "Sum: 450.00\nAverage: 90.00",
                "isHidden": False
            },
            {
                "input": "3\n10 20 25",
                "expectedOutput": "Sum: 55.00\nAverage: 18.33",
                "isHidden": False
            },
            {
                "input": "1\n98.5",
                "expectedOutput": "Sum: 98.50\nAverage: 98.50",
                "isHidden": True
            }
        ],
        "topic": "Arrays",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (198).png - Screenshot (199).png",
        "explanation": "Read student count N, sum the double scores, compute average = sum / N, and format with %.2f.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        double sum = 0.0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextDouble();
        }
        double avg = (n > 0) ? sum / n : 0.0;
        System.out.printf("Sum: %.2f\\n", sum);
        System.out.printf("Average: %.2f\\n", avg);
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-014",
        "title": "Second Highest Contest Score",
        "description": "Rahul is organising a coding contest at his college. After the results are announced, the prize committee wants to award the second highest unique score with a silver medal. However, if all participants have the same score, no silver medal can be awarded.\\n\\nWrite a program that takes the scores of all participants and determines the second highest unique score. If there is no second unique score, print 'No second highest score'.",
        "inputFormat": "The first line contains an integer N representing the number of participants.\\nThe second line contains N space-separated integers representing the scores.",
        "outputFormat": "Print the second highest unique score, or 'No second highest score' if all participants achieved the same score.",
        "constraints": [
            "1 <= N <= 1000",
            "0 <= score <= 10000"
        ],
        "sampleInput": "5\n100 90 90 80 70",
        "sampleOutput": "90",
        "testCases": [
            {
                "input": "5\n100 90 90 80 70",
                "expectedOutput": "90",
                "isHidden": False
            },
            {
                "input": "4\n50 50 50 50",
                "expectedOutput": "No second highest score",
                "isHidden": False
            },
            {
                "input": "6\n45 67 89 89 23 67",
                "expectedOutput": "67",
                "isHidden": True
            },
            {
                "input": "1\n100",
                "expectedOutput": "No second highest score",
                "isHidden": True
            }
        ],
        "topic": "Arrays",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (200).png - Screenshot (202).png",
        "explanation": "Collect unique scores into a sorted collection or find max1 and max2 distinct values. If max2 does not exist, print 'No second highest score'.",
        "referenceSolution": """import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        TreeSet<Integer> set = new TreeSet<>(Collections.reverseOrder());
        for (int i = 0; i < n; i++) {
            set.add(sc.nextInt());
        }
        if (set.size() < 2) {
            System.out.println("No second highest score");
        } else {
            Iterator<Integer> it = set.iterator();
            it.next(); // highest
            System.out.println(it.next()); // second highest
        }
        sc.close();
    }
}""",
        "starterCode": """import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    },
    {
        "id": "java-015",
        "title": "Prime Numbers Generator and Counter",
        "description": "Deepa is a mathematics professor preparing a worksheet for her advanced class. She needs a program that, given a positive integer N, finds and prints all prime numbers from 2 up to N (inclusive) on the first line separated by spaces, and on the second line prints the total count of primes found in that range.",
        "inputFormat": "A single integer N.",
        "outputFormat": "The first line displays space-separated prime numbers from 2 up to N.\\nThe second line displays 'Total count of prime numbers: <count>'",
        "constraints": [
            "2 <= N <= 1000"
        ],
        "sampleInput": "10",
        "sampleOutput": "2 3 5 7\nTotal count of prime numbers: 4",
        "testCases": [
            {
                "input": "10",
                "expectedOutput": "2 3 5 7\nTotal count of prime numbers: 4",
                "isHidden": False
            },
            {
                "input": "20",
                "expectedOutput": "2 3 5 7 11 13 17 19\nTotal count of prime numbers: 8",
                "isHidden": False
            },
            {
                "input": "2",
                "expectedOutput": "2\nTotal count of prime numbers: 1",
                "isHidden": True
            }
        ],
        "topic": "Control Flow",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (203).png - Screenshot (204).png",
        "explanation": "Test primality for each integer from 2 up to N. Print primes space-separated, accumulate count, and print count.",
        "referenceSolution": """import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static boolean isPrime(int num) {
        if (num < 2) return false;
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime(i)) {
                primes.add(i);
            }
        }
        for (int i = 0; i < primes.size(); i++) {
            System.out.print(primes.get(i) + (i == primes.size() - 1 ? "" : " "));
        }
        System.out.println();
        System.out.println("Total count of prime numbers: " + primes.size());
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        sc.close();
    }
}""",
        "extractionStatus": "verified"
    }
]
