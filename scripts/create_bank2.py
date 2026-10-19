import json
import subprocess
import tempfile
import os

questions_bank2 = [
    {
        "id": "bank2-001",
        "bank": "bank2",
        "title": "Calorie Tracker Daily Summary",
        "topic": "Loops & Arrays",
        "difficulty": "Easy",
        "description": "Bob is building a fitness logging system. Given the number of meals N eaten in a day, followed by N integers representing the calories consumed in each meal, calculate and print: (1) Total daily calories, (2) The maximum calorie meal, and (3) Whether the daily intake exceeded a recommended threshold of 2000 calories ('EXCEEDED' or 'WITHIN_LIMIT').",
        "inputFormat": "First line contains an integer N (number of meals).\\nSecond line contains N space-separated integers representing the calorie count of each meal.",
        "outputFormat": "Print three lines:\\nLine 1: Total: <total>\\nLine 2: Max: <max>\\nLine 3: Status: <EXCEEDED or WITHIN_LIMIT>",
        "constraints": [
            "1 <= N <= 100",
            "1 <= calories[i] <= 5000"
        ],
        "sampleInput": "4\n450 600 850 300",
        "sampleOutput": "Total: 2200\nMax: 850\nStatus: EXCEEDED",
        "testCases": [
            {"input": "4\n450 600 850 300", "expectedOutput": "Total: 2200\nMax: 850\nStatus: EXCEEDED", "isHidden": False},
            {"input": "3\n500 600 400", "expectedOutput": "Total: 1500\nMax: 600\nStatus: WITHIN_LIMIT", "isHidden": False},
            {"input": "1\n2000", "expectedOutput": "Total: 2000\nMax: 2000\nStatus: WITHIN_LIMIT", "isHidden": True},
            {"input": "5\n100 200 300 400 1100", "expectedOutput": "Total: 2100\nMax: 1100\nStatus: EXCEEDED", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long total = 0;
        int maxCal = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int cal = sc.nextInt();
            total += cal;
            if (cal > maxCal) maxCal = cal;
        }
        System.out.println("Total: " + total);
        System.out.println("Max: " + maxCal);
        System.out.println("Status: " + (total > 2000 ? "EXCEEDED" : "WITHIN_LIMIT"));
    }
}"""
    },
    {
        "id": "bank2-002",
        "bank": "bank2",
        "title": "ASCII Box Generator",
        "topic": "Nested Loops",
        "difficulty": "Easy",
        "description": "Given two positive integers W (width) and H (height), render an ASCII hollow rectangle box using the character '#' for the border and a single space ' ' for the interior. If W < 2 or H < 2, print a solid grid of '#' characters of size H x W.",
        "inputFormat": "A single line containing two space-separated integers: W and H.",
        "outputFormat": "H lines representing the ASCII box.",
        "constraints": [
            "1 <= W, H <= 25"
        ],
        "sampleInput": "5 4",
        "sampleOutput": "#####\n#   #\n#   #\n#####",
        "testCases": [
            {"input": "5 4", "expectedOutput": "#####\n#   #\n#   #\n#####", "isHidden": False},
            {"input": "3 3", "expectedOutput": "###\n# #\n###", "isHidden": False},
            {"input": "1 1", "expectedOutput": "#", "isHidden": True},
            {"input": "6 2", "expectedOutput": "######\n######", "isHidden": True},
            {"input": "4 5", "expectedOutput": "####\n#  #\n#  #\n#  #\n####", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int w = sc.nextInt();
        int h = sc.nextInt();

        for (int r = 0; r < h; r++) {
            StringBuilder sb = new StringBuilder();
            for (int c = 0; c < w; c++) {
                if (r == 0 || r == h - 1 || c == 0 || c == w - 1) {
                    sb.append('#');
                } else {
                    sb.append(' ');
                }
            }
            System.out.println(sb.toString());
        }
    }
}"""
    },
    {
        "id": "bank2-003",
        "bank": "bank2",
        "title": "Clean Anagram Checker",
        "topic": "Strings & Characters",
        "difficulty": "Medium",
        "description": "Two strings are anagrams if they contain the same characters with the exact same frequencies, regardless of spaces, punctuation, or case. Given two lines of text, determine whether they form a valid anagram. Ignore all characters except English letters (A-Z, a-z) and treat uppercase and lowercase letters as identical. Print 'ANAGRAM' if valid, or 'NOT ANAGRAM'.",
        "inputFormat": "Two lines of input, each containing a string.",
        "outputFormat": "Print 'ANAGRAM' if they are anagrams, or 'NOT ANAGRAM' otherwise.",
        "constraints": [
            "1 <= length of each string <= 1000"
        ],
        "sampleInput": "Dormitory\nDirty room",
        "sampleOutput": "ANAGRAM",
        "testCases": [
            {"input": "Dormitory\nDirty room", "expectedOutput": "ANAGRAM", "isHidden": False},
            {"input": "Hello World\nWorld Hello", "expectedOutput": "ANAGRAM", "isHidden": False},
            {"input": "The eyes\nThey see", "expectedOutput": "ANAGRAM", "isHidden": True},
            {"input": "Java 21\nKotlin 21", "expectedOutput": "NOT ANAGRAM", "isHidden": True},
            {"input": "A gentleman\nElegant man", "expectedOutput": "ANAGRAM", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement anagram checker\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s1 = sc.nextLine();
        String s2 = sc.hasNextLine() ? sc.nextLine() : "";

        int[] count = new int[26];
        for (char c : s1.toCharArray()) {
            if (Character.isLetter(c)) {
                count[Character.toLowerCase(c) - 'a']++;
            }
        }
        for (char c : s2.toCharArray()) {
            if (Character.isLetter(c)) {
                count[Character.toLowerCase(c) - 'a']--;
            }
        }

        boolean isAnagram = true;
        for (int val : count) {
            if (val != 0) {
                isAnagram = false;
                break;
            }
        }

        System.out.println(isAnagram ? "ANAGRAM" : "NOT ANAGRAM");
    }
}"""
    },
    {
        "id": "bank2-004",
        "bank": "bank2",
        "title": "Matrix 90-Degree Clockwise Rotation",
        "topic": "2D Arrays",
        "difficulty": "Medium",
        "description": "Given an N x N 2D square matrix of integers, rotate the matrix 90 degrees clockwise in-place and output the resulting matrix. Each row should be printed on a separate line with elements separated by a single space.",
        "inputFormat": "First line contains an integer N.\\nThe next N lines each contain N space-separated integers representing the matrix rows.",
        "outputFormat": "Print the rotated N x N matrix, one row per line with space-separated values.",
        "constraints": [
            "1 <= N <= 50",
            "-1000 <= matrix[i][j] <= 1000"
        ],
        "sampleInput": "3\n1 2 3\n4 5 6\n7 8 9",
        "sampleOutput": "7 4 1\n8 5 2\n9 6 3",
        "testCases": [
            {"input": "3\n1 2 3\n4 5 6\n7 8 9", "expectedOutput": "7 4 1\n8 5 2\n9 6 3", "isHidden": False},
            {"input": "2\n1 2\n3 4", "expectedOutput": "3 1\n4 2", "isHidden": False},
            {"input": "1\n99", "expectedOutput": "99", "isHidden": True},
            {"input": "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", "expectedOutput": "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Rotate matrix clockwise\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                mat[i][j] = sc.nextInt();
            }
        }

        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = mat[i][j];
                mat[i][j] = mat[j][i];
                mat[j][i] = temp;
            }
        }

        // Reverse each row
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = mat[i][left];
                mat[i][left] = mat[i][right];
                mat[i][right] = temp;
                left++;
                right--;
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                System.out.print(mat[i][j] + (j == n - 1 ? "" : " "));
            }
            System.out.println();
        }
    }
}"""
    },
    {
        "id": "bank2-005",
        "bank": "bank2",
        "title": "String Run-Length Encoding",
        "topic": "Strings & Loops",
        "difficulty": "Easy",
        "description": "Run-length encoding (RLE) is a basic data compression algorithm. Consecutive repeated characters are replaced by the character followed by its count. For example, 'AAABBBCC' becomes 'A3B3C2'. If a character appears only once, output the character followed by '1' (e.g., 'A1'). Given a string S consisting of uppercase alphabetic letters, output its compressed RLE representation.",
        "inputFormat": "A single line containing the uppercase string S.",
        "outputFormat": "Print the RLE compressed string.",
        "constraints": [
            "1 <= S.length() <= 1000",
            "S contains only uppercase letters 'A'-'Z'"
        ],
        "sampleInput": "AAABBBCC",
        "sampleOutput": "A3B3C2",
        "testCases": [
            {"input": "AAABBBCC", "expectedOutput": "A3B3C2", "isHidden": False},
            {"input": "ABCD", "expectedOutput": "A1B1C1D1", "isHidden": False},
            {"input": "AAAAA", "expectedOutput": "A5", "isHidden": True},
            {"input": "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWW", "expectedOutput": "W12B1W12B3W12", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement run-length encoding\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        if (s.isEmpty()) return;

        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                count++;
            } else {
                sb.append(s.charAt(i - 1)).append(count);
                count = 1;
            }
        }
        sb.append(s.charAt(s.length() - 1)).append(count);
        System.out.println(sb.toString());
    }
}"""
    },
    {
        "id": "bank2-006",
        "bank": "bank2",
        "title": "Robust Age & Range Validator",
        "topic": "Exception Handling",
        "difficulty": "Easy",
        "description": "Write a program that reads an input string representing a user's age. Validate the input using proper exception handling:\\n- If the input cannot be parsed as a whole integer, catch NumberFormatException and print 'ERROR: Invalid number format'.\\n- If the integer is less than 0 or greater than 120, print 'ERROR: Age out of range [0, 120]'.\\n- Otherwise, print 'VALID: <age>'.",
        "inputFormat": "A single line containing input text.",
        "outputFormat": "Print the validation status message as specified.",
        "constraints": [
            "Input string length <= 50"
        ],
        "sampleInput": "25",
        "sampleOutput": "VALID: 25",
        "testCases": [
            {"input": "25", "expectedOutput": "VALID: 25", "isHidden": False},
            {"input": "abc", "expectedOutput": "ERROR: Invalid number format", "isHidden": False},
            {"input": "-5", "expectedOutput": "ERROR: Age out of range [0, 120]", "isHidden": True},
            {"input": "150", "expectedOutput": "ERROR: Age out of range [0, 120]", "isHidden": True},
            {"input": "0", "expectedOutput": "VALID: 0", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement age validation\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();

        try {
            int age = Integer.parseInt(line);
            if (age < 0 || age > 120) {
                System.out.println("ERROR: Age out of range [0, 120]");
            } else {
                System.out.println("VALID: " + age);
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: Invalid number format");
        }
    }
}"""
    },
    {
        "id": "bank2-007",
        "bank": "bank2",
        "title": "Collatz Conjecture Step Counter",
        "topic": "Control Flow & while Loop",
        "difficulty": "Easy",
        "description": "The Collatz conjecture states that starting from any positive integer N:\\n- If N is even, divide it by 2 (N = N / 2).\\n- If N is odd, multiply it by 3 and add 1 (N = 3 * N + 1).\\nRepeat until N becomes 1. Given N, print the sequence of numbers generated separated by a space, followed by the total number of steps taken to reach 1 on the next line.",
        "inputFormat": "A single positive integer N.",
        "outputFormat": "Line 1: Space-separated sequence starting with N and ending with 1.\\nLine 2: Steps: <total_steps>",
        "constraints": [
            "1 <= N <= 10000"
        ],
        "sampleInput": "6",
        "sampleOutput": "6 3 10 5 16 8 4 2 1\nSteps: 8",
        "testCases": [
            {"input": "6", "expectedOutput": "6 3 10 5 16 8 4 2 1\nSteps: 8", "isHidden": False},
            {"input": "1", "expectedOutput": "1\nSteps: 0", "isHidden": False},
            {"input": "11", "expectedOutput": "11 34 17 52 26 13 40 20 10 5 16 8 4 2 1\nSteps: 14", "isHidden": True},
            {"input": "2", "expectedOutput": "2 1\nSteps: 1", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement Collatz sequence\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long n = sc.nextLong();
        StringBuilder sb = new StringBuilder();
        sb.append(n);
        int steps = 0;

        while (n != 1) {
            if (n % 2 == 0) {
                n = n / 2;
            } else {
                n = 3 * n + 1;
            }
            sb.append(" ").append(n);
            steps++;
        }
        System.out.println(sb.toString());
        System.out.println("Steps: " + steps);
    }
}"""
    },
    {
        "id": "bank2-008",
        "bank": "bank2",
        "title": "Roman Numeral to Decimal Converter",
        "topic": "Strings & Switch",
        "difficulty": "Medium",
        "description": "Convert a given Roman numeral string into its integer decimal equivalent using standard Roman rules:\\nI=1, V=5, X=10, L=50, C=100, D=500, M=1000.\\nIf a smaller numeral appears before a larger numeral, it is subtracted (e.g. IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).",
        "inputFormat": "A single line containing an uppercase string representing a valid Roman numeral.",
        "outputFormat": "Print the integer value.",
        "constraints": [
            "1 <= roman.length() <= 15",
            "Values range from 1 to 3999"
        ],
        "sampleInput": "MCMXCIV",
        "sampleOutput": "1994",
        "testCases": [
            {"input": "MCMXCIV", "expectedOutput": "1994", "isHidden": False},
            {"input": "LVIII", "expectedOutput": "58", "isHidden": False},
            {"input": "III", "expectedOutput": "3", "isHidden": True},
            {"input": "IV", "expectedOutput": "4", "isHidden": True},
            {"input": "MMXXVI", "expectedOutput": "2026", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Convert Roman to integer\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    private static int valueOf(char r) {
        return switch (r) {
            case 'I' -> 1;
            case 'V' -> 5;
            case 'X' -> 10;
            case 'L' -> 50;
            case 'C' -> 100;
            case 'D' -> 500;
            case 'M' -> 1000;
            default -> 0;
        };
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int current = valueOf(s.charAt(i));
            if (i + 1 < s.length() && current < valueOf(s.charAt(i + 1))) {
                total -= current;
            } else {
                total += current;
            }
        }
        System.out.println(total);
    }
}"""
    },
    {
        "id": "bank2-009",
        "bank": "bank2",
        "title": "Pascal's Triangle Row Generator",
        "topic": "Arrays & Combinatorics",
        "difficulty": "Easy",
        "description": "Given a 0-indexed row index K, generate the K-th row of Pascal's Triangle. In Pascal's Triangle, each number is the sum of the two numbers directly above it. Row 0 is [1], Row 1 is [1, 1], Row 2 is [1, 2, 1], Row 3 is [1, 3, 3, 1], etc. Output the numbers in row K separated by spaces.",
        "inputFormat": "A single integer K (0-based row index).",
        "outputFormat": "The numbers in row K separated by a space.",
        "constraints": [
            "0 <= K <= 30"
        ],
        "sampleInput": "4",
        "sampleOutput": "1 4 6 4 1",
        "testCases": [
            {"input": "4", "expectedOutput": "1 4 6 4 1", "isHidden": False},
            {"input": "0", "expectedOutput": "1", "isHidden": False},
            {"input": "1", "expectedOutput": "1 1", "isHidden": True},
            {"input": "5", "expectedOutput": "1 5 10 10 5 1", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Generate Pascal's Triangle row\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int k = sc.nextInt();
        long[] row = new long[k + 1];
        row[0] = 1;
        for (int i = 1; i <= k; i++) {
            for (int j = i; j > 0; j--) {
                row[j] += row[j - 1];
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= k; i++) {
            sb.append(row[i]).append(i == k ? "" : " ");
        }
        System.out.println(sb.toString());
    }
}"""
    },
    {
        "id": "bank2-010",
        "bank": "bank2",
        "title": "Bank Account Transaction Ledger",
        "topic": "OOP & Invariants",
        "difficulty": "Medium",
        "description": "Simulate a bank account processing a batch of financial commands. Start with an account having balance = 0.00.\\nSupport commands:\\n- `DEPOSIT <amount>`: Add amount to balance (must be > 0, otherwise print 'INVALID DEPOSIT').\\n- `WITHDRAW <amount>`: Subtract amount if balance >= amount (must be > 0, otherwise if amount > balance print 'INSUFFICIENT FUNDS', else if amount <= 0 print 'INVALID WITHDRAW').\\n- `BALANCE`: Print current balance formatted to 2 decimal places (e.g. 'Balance: 150.00').\\n- `EXIT`: Terminate transaction processing.",
        "inputFormat": "Sequence of commands, each on a new line, terminating with EXIT.",
        "outputFormat": "Print the response for each command on a new line.",
        "constraints": [
            "Amount is a positive double with up to 2 decimal places.",
            "Up to 100 transaction commands."
        ],
        "sampleInput": "DEPOSIT 500.00\nWITHDRAW 150.50\nBALANCE\nWITHDRAW 400.00\nEXIT",
        "sampleOutput": "Deposited: 500.00\nWithdrew: 150.50\nBalance: 349.50\nINSUFFICIENT FUNDS",
        "testCases": [
            {
                "input": "DEPOSIT 500.00\nWITHDRAW 150.50\nBALANCE\nWITHDRAW 400.00\nEXIT",
                "expectedOutput": "Deposited: 500.00\nWithdrew: 150.50\nBalance: 349.50\nINSUFFICIENT FUNDS",
                "isHidden": False
            },
            {
                "input": "BALANCE\nDEPOSIT 100.00\nBALANCE\nEXIT",
                "expectedOutput": "Balance: 0.00\nDeposited: 100.00\nBalance: 100.00",
                "isHidden": False
            },
            {
                "input": "WITHDRAW 50.00\nDEPOSIT -10.00\nEXIT",
                "expectedOutput": "INSUFFICIENT FUNDS\nINVALID DEPOSIT",
                "isHidden": True
            }
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement Bank Account Ledger\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double balance = 0.0;

        while (sc.hasNext()) {
            String cmd = sc.next();
            if (cmd.equalsIgnoreCase("EXIT")) break;

            if (cmd.equalsIgnoreCase("DEPOSIT")) {
                double amt = sc.nextDouble();
                if (amt <= 0) {
                    System.out.println("INVALID DEPOSIT");
                } else {
                    balance += amt;
                    System.out.printf("Deposited: %.2f%n", amt);
                }
            } else if (cmd.equalsIgnoreCase("WITHDRAW")) {
                double amt = sc.nextDouble();
                if (amt <= 0) {
                    System.out.println("INVALID WITHDRAW");
                } else if (amt > balance) {
                    System.out.println("INSUFFICIENT FUNDS");
                } else {
                    balance -= amt;
                    System.out.printf("Withdrew: %.2f%n", amt);
                }
            } else if (cmd.equalsIgnoreCase("BALANCE")) {
                System.out.printf("Balance: %.2f%n", balance);
            }
        }
    }
}"""
    },
    {
        "id": "bank2-011",
        "bank": "bank2",
        "title": "Prime Factorization Decomposer",
        "topic": "Mathematics & Methods",
        "difficulty": "Medium",
        "description": "Given a positive integer N >= 2, compute and output its prime factorization formatted in ascending order of prime factors with their exponents. Format: `p1^e1 * p2^e2 * ...` where any factor with exponent 1 is written simply as `p` without `^1`. For example, 360 is `2^3 * 3^2 * 5`.",
        "inputFormat": "A single line containing the integer N.",
        "outputFormat": "The prime factorization string.",
        "constraints": [
            "2 <= N <= 10^9"
        ],
        "sampleInput": "360",
        "sampleOutput": "2^3 * 3^2 * 5",
        "testCases": [
            {"input": "360", "expectedOutput": "2^3 * 3^2 * 5", "isHidden": False},
            {"input": "13", "expectedOutput": "13", "isHidden": False},
            {"input": "100", "expectedOutput": "2^2 * 5^2", "isHidden": True},
            {"input": "84", "expectedOutput": "2^2 * 3 * 7", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement Prime Factorization\n    }\n}",
        "referenceSolution": """import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLong()) return;
        long n = sc.nextLong();
        List<String> factors = new ArrayList<>();

        for (long d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                int count = 0;
                while (n % d == 0) {
                    count++;
                    n /= d;
                }
                if (count == 1) {
                    factors.add(String.valueOf(d));
                } else {
                    factors.add(d + "^" + count);
                }
            }
        }
        if (n > 1) {
            factors.add(String.valueOf(n));
        }

        System.out.println(String.join(" * ", factors));
    }
}"""
    },
    {
        "id": "bank2-012",
        "bank": "bank2",
        "title": "Tic-Tac-Toe Board State Evaluator",
        "topic": "2D Arrays & Game Logic",
        "difficulty": "Medium",
        "description": "Given a 3x3 Tic-Tac-Toe board containing characters 'X', 'O', or '.' (empty spot), determine the current state of the game:\\n- 'X WINS' if X has 3 in a row, column, or diagonal.\\n- 'O WINS' if O has 3 in a row, column, or diagonal.\\n- 'DRAW' if all 9 cells are filled and neither player has won.\\n- 'IN PROGRESS' if the game has not been won and empty spots '.' remain.",
        "inputFormat": "Three lines, each containing 3 space-separated characters ('X', 'O', or '.').",
        "outputFormat": "Print the game outcome string: 'X WINS', 'O WINS', 'DRAW', or 'IN PROGRESS'.",
        "constraints": [
            "Exactly 3 rows and 3 columns."
        ],
        "sampleInput": "X O X\nO X .\nO . X",
        "sampleOutput": "X WINS",
        "testCases": [
            {"input": "X O X\nO X .\nO . X", "expectedOutput": "X WINS", "isHidden": False},
            {"input": "X O X\nX O O\nO X X", "expectedOutput": "DRAW", "isHidden": False},
            {"input": "O O O\nX X .\n. . .", "expectedOutput": "O WINS", "isHidden": True},
            {"input": "X O .\n. . .\n. . .", "expectedOutput": "IN PROGRESS", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Evaluate Tic-Tac-Toe board\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    private static boolean checkWin(char[][] b, char p) {
        for (int i = 0; i < 3; i++) {
            if (b[i][0] == p && b[i][1] == p && b[i][2] == p) return true;
            if (b[0][i] == p && b[1][i] == p && b[2][i] == p) return true;
        }
        if (b[0][0] == p && b[1][1] == p && b[2][2] == p) return true;
        if (b[0][2] == p && b[1][1] == p && b[2][0] == p) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[][] board = new char[3][3];
        boolean hasEmpty = false;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = sc.next().charAt(0);
                if (board[i][j] == '.') hasEmpty = true;
            }
        }

        if (checkWin(board, 'X')) {
            System.out.println("X WINS");
        } else if (checkWin(board, 'O')) {
            System.out.println("O WINS");
        } else if (hasEmpty) {
            System.out.println("IN PROGRESS");
        } else {
            System.out.println("DRAW");
        }
    }
}"""
    },
    {
        "id": "bank2-013",
        "bank": "bank2",
        "title": "First Unique Character in Stream",
        "topic": "Hash Maps & Collections",
        "difficulty": "Easy",
        "description": "Given a string S consisting of lowercase English letters, find the first non-repeating character and output its 0-based index. If every character in the string repeats, output -1.",
        "inputFormat": "A single line containing the string S.",
        "outputFormat": "Print the 0-based index of the first non-repeating character, or -1.",
        "constraints": [
            "1 <= S.length() <= 10^5",
            "S contains only lowercase English letters."
        ],
        "sampleInput": "leetcode",
        "sampleOutput": "0",
        "testCases": [
            {"input": "leetcode", "expectedOutput": "0", "isHidden": False},
            {"input": "loveleetcode", "expectedOutput": "2", "isHidden": False},
            {"input": "aabbcc", "expectedOutput": "-1", "isHidden": True},
            {"input": "z", "expectedOutput": "0", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Find first non-repeating character index\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        int ans = -1;
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) {
                ans = i;
                break;
            }
        }
        System.out.println(ans);
    }
}"""
    },
    {
        "id": "bank2-014",
        "bank": "bank2",
        "title": "Modern Traffic Light State Machine",
        "topic": "Enums & Switch",
        "difficulty": "Easy",
        "description": "Simulate a traffic light controller that cycles between three states: RED -> GREEN -> YELLOW -> RED. Each state has a defined duration:\\n- RED: 60 seconds\\n- GREEN: 45 seconds\\n- YELLOW: 5 seconds\\n\\nGiven the starting light color and an elapsed time in seconds T, determine the active light color and the remaining seconds in that phase.",
        "inputFormat": "First line: Initial color ('RED', 'GREEN', or 'YELLOW').\\nSecond line: Integer T (elapsed seconds).",
        "outputFormat": "Print: '<COLOR> (<REMAINING>s remaining)'",
        "constraints": [
            "0 <= T <= 100000"
        ],
        "sampleInput": "RED\n70",
        "sampleOutput": "GREEN (35s remaining)",
        "testCases": [
            {"input": "RED\n70", "expectedOutput": "GREEN (35s remaining)", "isHidden": False},
            {"input": "RED\n0", "expectedOutput": "RED (60s remaining)", "isHidden": False},
            {"input": "GREEN\n48", "expectedOutput": "YELLOW (2s remaining)", "isHidden": True},
            {"input": "YELLOW\n3", "expectedOutput": "YELLOW (2s remaining)", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement traffic light simulation\n    }\n}",
        "referenceSolution": """import java.util.Scanner;

public class Solution {
    enum Light {
        RED(60), GREEN(45), YELLOW(5);
        final int duration;
        Light(int d) { this.duration = d; }
        Light next() {
            return switch(this) {
                case RED -> GREEN;
                case GREEN -> YELLOW;
                case YELLOW -> RED;
            };
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String startStr = sc.next().toUpperCase();
        long t = sc.nextLong();

        Light current = Light.valueOf(startStr);
        while (t >= current.duration) {
            t -= current.duration;
            current = current.next();
        }

        long remaining = current.duration - t;
        System.out.println(current + " (" + remaining + "s remaining)");
    }
}"""
    },
    {
        "id": "bank2-015",
        "bank": "bank2",
        "title": "Spiral Matrix Order Traversal",
        "topic": "2D Arrays",
        "difficulty": "Hard",
        "description": "Given an M x N matrix, return all elements of the matrix in clockwise spiral order starting from the top-left corner (0,0). Output all elements on a single line separated by a space.",
        "inputFormat": "First line contains two space-separated integers: M (rows) and N (columns).\\nThe next M lines each contain N space-separated integers.",
        "outputFormat": "Print all elements in clockwise spiral order separated by a single space.",
        "constraints": [
            "1 <= M, N <= 20",
            "-1000 <= element <= 1000"
        ],
        "sampleInput": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "sampleOutput": "1 2 3 6 9 8 7 4 5",
        "testCases": [
            {"input": "3 3\n1 2 3\n4 5 6\n7 8 9", "expectedOutput": "1 2 3 6 9 8 7 4 5", "isHidden": False},
            {"input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", "expectedOutput": "1 2 3 4 8 12 11 10 9 5 6 7", "isHidden": False},
            {"input": "1 4\n1 2 3 4", "expectedOutput": "1 2 3 4", "isHidden": True},
            {"input": "4 1\n1\n2\n3\n4", "expectedOutput": "1 2 3 4", "isHidden": True}
        ],
        "starterCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Implement Spiral Matrix Traversal\n    }\n}",
        "referenceSolution": """import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int m = sc.nextInt();
        int n = sc.nextInt();
        int[][] mat = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                mat[i][j] = sc.nextInt();
            }
        }

        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = m - 1;
        int left = 0, right = n - 1;

        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) result.add(mat[top][j]);
            top++;

            for (int i = top; i <= bottom; i++) result.add(mat[i][right]);
            right--;

            if (top <= bottom) {
                for (int j = right; j >= left; j--) result.add(mat[bottom][j]);
                bottom--;
            }

            if (left <= right) {
                for (int i = bottom; i >= top; i--) result.add(mat[i][left]);
                left++;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.size(); i++) {
            sb.append(result.get(i)).append(i == result.size() - 1 ? "" : " ");
        }
        System.out.println(sb.toString());
    }
}"""
    }
]

# Write to questions_bank2.json
with open("questions_bank2.json", "w", encoding="utf-8") as f:
    json.dump(questions_bank2, f, indent=2)

print(f"Wrote {len(questions_bank2)} questions to questions_bank2.json")

# Now verify every reference solution compiles and passes 100% of its test cases!
print("\n--- Verifying All Reference Solutions with javac 27 ---")
passed_all = True

for q in questions_bank2:
    q_id = q["id"]
    code = q["referenceSolution"]
    test_cases = q["testCases"]
    
    with tempfile.TemporaryDirectory() as tmpdir:
        src_path = os.path.join(tmpdir, "Solution.java")
        with open(src_path, "w", encoding="utf-8") as sf:
            sf.write(code)
            
        compile_res = subprocess.run(["javac", src_path], capture_output=True, text=True)
        if compile_res.returncode != 0:
            print(f"❌ {q_id} {q['title']}: Compilation Failed!\n{compile_res.stderr}")
            passed_all = False
            continue
            
        q_ok = True
        for idx, tc in enumerate(test_cases):
            run_res = subprocess.run(
                ["java", "-cp", tmpdir, "Solution"],
                input=tc["input"],
                capture_output=True,
                text=True,
                timeout=5
            )
            actual = run_res.stdout.strip().replace("\r\n", "\n")
            expected = tc["expectedOutput"].strip().replace("\r\n", "\n")
            if actual != expected:
                print(f"[MISMATCH] {q_id} TC #{idx+1} mismatch!\nExpected:\n{expected}\nActual:\n{actual}")
                q_ok = False
                passed_all = False
                break
                
        if q_ok:
            print(f"[OK] {q_id}: {q['title']} (All {len(test_cases)} test cases PASSED)")

if passed_all:
    print("\nALL Bank 2 questions verified 100% correct with javac 27!")
else:
    print("\nSome test cases failed!")
