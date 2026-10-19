# Question Data Part 2: Questions 16 to 30

QUESTIONS_PART2 = [
    {
        "id": "java-016",
        "title": "Array Sorting and Median Calculation",
        "description": "Kavitha is a data science student analysing sensor readings for her project. She needs a program that arranges a given array of integers in ascending order and then computes the median value.\\n\\nThe median is the middle value when the array is sorted. If the number of elements is odd, the median is the middle element. If the number of elements is even, the median is the average of the two middle elements formatted to 1 decimal place.\\n\\nPrint the sorted array on the first line and the median on the second line.",
        "inputFormat": "The first line contains an integer N representing the size of the array.\\nThe second line contains N space-separated integers.",
        "outputFormat": "The first line displays 'Sorted array: ' followed by the space-separated sorted numbers.\\nThe second line displays 'Median: <median value formatted to 1 decimal place>'",
        "constraints": [
            "1 <= N <= 1000",
            "-10000 <= array element <= 10000"
        ],
        "sampleInput": "5\n7 2 1 6 4",
        "sampleOutput": "Sorted array: 1 2 4 6 7\nMedian: 4.0",
        "testCases": [
            {
                "input": "5\n7 2 1 6 4",
                "expectedOutput": "Sorted array: 1 2 4 6 7\nMedian: 4.0",
                "isHidden": False
            },
            {
                "input": "6\n12 3 5 7 19 1",
                "expectedOutput": "Sorted array: 1 3 5 7 12 19\nMedian: 6.0",
                "isHidden": False
            },
            {
                "input": "1\n42",
                "expectedOutput": "Sorted array: 42\nMedian: 42.0",
                "isHidden": True
            }
        ],
        "topic": "Arrays",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (205).png - Screenshot (206).png",
        "explanation": "Sort the array using Arrays.sort(). If N is odd, median = arr[N/2]. If even, median = (arr[N/2 - 1] + arr[N/2]) / 2.0.",
        "referenceSolution": """import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        Arrays.sort(arr);
        System.out.print("Sorted array:");
        for (int x : arr) {
            System.out.print(" " + x);
        }
        System.out.println();
        double median = (n % 2 != 0) ? arr[n / 2] : (arr[n / 2 - 1] + arr[n / 2]) / 2.0;
        System.out.printf("Median: %.1f\\n", median);
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;
import java.util.Arrays;

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
        "id": "java-017",
        "title": "Leaders in an Array",
        "description": "Suresh is a team lead at a logistics company who reviews delivery time records. He defines a 'leader' as a delivery time that is strictly greater than all delivery times that appear after it in the list.\\n\\nNote that the rightmost element in the array is always a leader since there are no elements to its right.\\n\\nWrite a program that takes an array of integers and displays all leaders in the order they appear from left to right.",
        "inputFormat": "The first line contains an integer N representing the size of the array.\\nThe second line contains N space-separated integers.",
        "outputFormat": "Print all leaders separated by spaces in their original left-to-right order.",
        "constraints": [
            "1 <= N <= 1000",
            "1 <= array element <= 10000"
        ],
        "sampleInput": "6\n16 17 4 3 5 2",
        "sampleOutput": "17 5 2",
        "testCases": [
            {
                "input": "6\n16 17 4 3 5 2",
                "expectedOutput": "17 5 2",
                "isHidden": False
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "5",
                "isHidden": False
            },
            {
                "input": "5\n5 4 3 2 1",
                "expectedOutput": "5 4 3 2 1",
                "isHidden": True
            }
        ],
        "topic": "Arrays",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (207).png",
        "explanation": "Scan from right to left tracking max seen so far. An element is a leader if it is greater than the max to its right. Reverse collected leaders to restore original order.",
        "referenceSolution": """import java.util.Scanner;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        List<Integer> leaders = new ArrayList<>();
        int maxRight = Integer.MIN_VALUE;
        for (int i = n - 1; i >= 0; i--) {
            if (arr[i] > maxRight) {
                leaders.add(arr[i]);
                maxRight = arr[i];
            }
        }
        Collections.reverse(leaders);
        for (int i = 0; i < leaders.size(); i++) {
            System.out.print(leaders.get(i) + (i == leaders.size() - 1 ? "" : " "));
        }
        System.out.println();
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
        "id": "java-018",
        "title": "Maximum Contiguous Subarray Sum",
        "description": "Rohan is a stock market analyst who records daily price changes (gains and losses) for a stock. He wants to find the maximum total gain achievable from any contiguous sequence of days — that is, the contiguous subarray with the largest possible sum.\\n\\nEven if all values are negative, the answer is the single least-negative element (the best single day).\\n\\nThe program uses a user-defined function maxSubarraySum() that accepts the array and size N. It implements Kadane's algorithm to compute and return the maximum contiguous sum.",
        "inputFormat": "The first line contains an integer N representing the number of days.\\nThe second line contains N space-separated integers representing the price changes.",
        "outputFormat": "Print the maximum contiguous subarray sum.",
        "constraints": [
            "1 <= N <= 1000",
            "-10000 <= array element <= 10000"
        ],
        "sampleInput": "8\n-2 -3 4 -1 -2 1 5 -3",
        "sampleOutput": "7",
        "testCases": [
            {
                "input": "8\n-2 -3 4 -1 -2 1 5 -3",
                "expectedOutput": "7",
                "isHidden": False
            },
            {
                "input": "4\n-1 -2 -3 -4",
                "expectedOutput": "-1",
                "isHidden": False
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "15",
                "isHidden": True
            }
        ],
        "topic": "Algorithms",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (208).png - Screenshot (210).png",
        "explanation": "Kadane's algorithm: maintain currentSum = Math.max(arr[i], currentSum + arr[i]) and maxSum = Math.max(maxSum, currentSum).",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static long maxSubarraySum(int[] arr, int n) {
        long maxSoFar = arr[0];
        long currMax = arr[0];
        for (int i = 1; i < n; i++) {
            currMax = Math.max((long)arr[i], currMax + arr[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.println(maxSubarraySum(arr, n));
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

public class Main {
    public static long maxSubarraySum(int[] arr, int n) {
        // Implement Kadane's algorithm here
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
        "id": "java-019",
        "title": "Password Key Extraction via File Streams",
        "description": "Arjun is a security engineer at a research lab that uses temporary access keys for entry into restricted zones. Each key is a combination of letters, digits, and special symbols. For audit purposes, the security system analyzes these keys to identify structural patterns — uppercase letters indicate authorization levels and digits represent zone identifiers.\\n\\nYour task is to:\\n1. Accept a password (access key) string from the user.\\n2. Write the input into a file named password.txt using FileOutputStream.\\n3. Read the file back using FileInputStream.\\n4. Extract all uppercase letters and all digits in the order they appear in the key.\\n5. Write the result into a file named extracted.txt.\\n6. Display the contents of extracted.txt.",
        "inputFormat": "A single string representing the access key containing letters, digits, and special characters.",
        "outputFormat": "The extracted string containing only uppercase letters and digits in original order.",
        "constraints": [
            "1 <= length of access key <= 100",
            "At least one uppercase letter or digit is guaranteed in the input."
        ],
        "sampleInput": "aB3!c0$D",
        "sampleOutput": "B30D",
        "testCases": [
            {
                "input": "aB3!c0$D",
                "expectedOutput": "B30D",
                "isHidden": False
            },
            {
                "input": "Hello@world2024",
                "expectedOutput": "H2024",
                "isHidden": False
            },
            {
                "input": "secret#123*KEY",
                "expectedOutput": "123KEY",
                "isHidden": True
            }
        ],
        "topic": "File Handling",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (211).png",
        "explanation": "Use FileOutputStream to write string bytes to password.txt, FileInputStream to read bytes back, filter Character.isUpperCase(c) or Character.isDigit(c), write to extracted.txt, and print result.",
        "referenceSolution": """import java.io.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String key = sc.nextLine();
        
        try {
            // Write to password.txt
            FileOutputStream fos = new FileOutputStream("password.txt");
            fos.write(key.getBytes());
            fos.close();

            // Read from password.txt
            FileInputStream fis = new FileInputStream("password.txt");
            StringBuilder sb = new StringBuilder();
            int ch;
            while ((ch = fis.read()) != -1) {
                char c = (char) ch;
                if (Character.isUpperCase(c) || Character.isDigit(c)) {
                    sb.append(c);
                }
            }
            fis.close();

            // Write to extracted.txt
            FileOutputStream outFos = new FileOutputStream("extracted.txt");
            outFos.write(sb.toString().getBytes());
            outFos.close();

            // Display extracted.txt
            System.out.println(sb.toString());
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
        sc.close();
    }
}""",
        "starterCode": """import java.io.*;
import java.util.Scanner;

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
        "id": "java-020",
        "title": "Robust Calculator Addition with Exception Handling",
        "description": "Imagine you are building a calculator application that allows users to enter two numbers and get their sum. You must handle the case where the user enters a non-numeric input by displaying an error message.\\n\\nWrite a program to calculate the sum of two numbers using the addition operator and handle invalid input using exception handling.\\n\\nNotes:\\n- Use a try-catch block to handle invalid input (such as NumberFormatException or InputMismatchException).\\n- Ensure that the sum does not exceed the limits of long.\\n- If the input is valid, print: 'The sum is: <sum>'\\n- If any input is invalid, print: 'Invalid input. Please enter valid numbers.'",
        "inputFormat": "A single line containing two tokens separated by space, or two values on separate lines.",
        "outputFormat": "Print 'The sum is: <sum>' or 'Invalid input. Please enter valid numbers.'",
        "constraints": [
            "0 <= num1, num2 <= 10000000000",
            "Datatype to be used: long"
        ],
        "sampleInput": "25 35",
        "sampleOutput": "The sum is: 60",
        "testCases": [
            {
                "input": "25 35",
                "expectedOutput": "The sum is: 60",
                "isHidden": False
            },
            {
                "input": "25 five",
                "expectedOutput": "Invalid input. Please enter valid numbers.",
                "isHidden": False
            },
            {
                "input": "1000000000 2000000000",
                "expectedOutput": "The sum is: 3000000000",
                "isHidden": True
            }
        ],
        "topic": "Exception Handling",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (212).png - Screenshot (213).png",
        "explanation": "Wrap Long.parseLong() in a try-catch catching NumberFormatException. Print sum on success or error message on exception.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println("Invalid input. Please enter valid numbers.");
            return;
        }
        String token1 = sc.next();
        if (!sc.hasNext()) {
            System.out.println("Invalid input. Please enter valid numbers.");
            return;
        }
        String token2 = sc.next();
        try {
            long a = Long.parseLong(token1);
            long b = Long.parseLong(token2);
            long sum = a + b;
            System.out.println("The sum is: " + sum);
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter valid numbers.");
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
        "id": "java-021",
        "title": "Person Age Serialization and Deserialization",
        "description": "Mary wants to create a program that takes her age as input, serializes the information into a file named person.ser, and modifies the age by adding 5 years during the serialization process. After serialization, read and deserialize the object and display the modified age.",
        "inputFormat": "A single integer representing the age.",
        "outputFormat": "Print 'Deserialized Age: <modified age>'",
        "constraints": [
            "1 <= age <= 120"
        ],
        "sampleInput": "20",
        "sampleOutput": "Deserialized Age: 25",
        "testCases": [
            {
                "input": "20",
                "expectedOutput": "Deserialized Age: 25",
                "isHidden": False
            },
            {
                "input": "35",
                "expectedOutput": "Deserialized Age: 40",
                "isHidden": False
            },
            {
                "input": "15",
                "expectedOutput": "Deserialized Age: 20",
                "isHidden": True
            }
        ],
        "topic": "File Handling",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (214).png - Screenshot (215).png",
        "explanation": "Create a serializable Person class with age attribute. Instantiate with age + 5, serialize to person.ser, deserialize with ObjectInputStream and display modified age.",
        "referenceSolution": """import java.io.*;
import java.util.Scanner;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    int age;

    public Person(int age) {
        this.age = age;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int age = sc.nextInt();
        try {
            Person p = new Person(age + 5);
            ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.ser"));
            oos.writeObject(p);
            oos.close();

            ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.ser"));
            Person deserialized = (Person) ois.readObject();
            ois.close();

            System.out.println("Deserialized Age: " + deserialized.age);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        sc.close();
    }
}""",
        "starterCode": """import java.io.*;
import java.util.Scanner;

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
        "id": "java-022",
        "title": "Days Between Two Dates with Leap Years",
        "description": "Priya, a software developer, is working on a project that involves calculating the number of days between two dates while accounting for leap years. She needs to create a program that takes two dates formatted as YYYY-MM-DD and computes the absolute difference in days between them.",
        "inputFormat": "The first line contains the start date (YYYY-MM-DD).\\nThe second line contains the end date (YYYY-MM-DD).",
        "outputFormat": "Print 'Number of days: <days>'",
        "constraints": [
            "Valid dates between 1900-01-01 and 2100-12-31."
        ],
        "sampleInput": "2024-01-01\n2024-01-10",
        "sampleOutput": "Number of days: 9",
        "testCases": [
            {
                "input": "2024-01-01\n2024-01-10",
                "expectedOutput": "Number of days: 9",
                "isHidden": False
            },
            {
                "input": "2024-02-28\n2024-03-01",
                "expectedOutput": "Number of days: 2",
                "isHidden": False
            },
            {
                "input": "2023-01-01\n2023-01-02",
                "expectedOutput": "Number of days: 1",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (216).png - Screenshot (218).png",
        "explanation": "Use java.time.LocalDate and java.time.temporal.ChronoUnit.DAYS.between(d1, d2) or Math.abs to compute day difference.",
        "referenceSolution": """import java.util.Scanner;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String d1 = sc.nextLine().trim();
        String d2 = sc.nextLine().trim();
        LocalDate date1 = LocalDate.parse(d1);
        LocalDate date2 = LocalDate.parse(d2);
        long days = Math.abs(ChronoUnit.DAYS.between(date1, date2));
        System.out.println("Number of days: " + days);
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
        "id": "java-023",
        "title": "Temperature Converter using Inner Classes",
        "description": "Eva, a curious programmer, wants to create a program that performs various temperature conversions. To deepen her understanding of inner classes, she decides to organize her code such that the conversion logic is encapsulated within an inner class named Converter inside TemperatureConverter.\\n\\nImplement the methods:\\n- toFahrenheit(double celsius): returns celsius * 9/5 + 32\\n- toKelvin(double celsius): returns celsius + 273.15\\n\\nPrint the converted temperatures formatted to 2 decimal places.",
        "inputFormat": "A single double value representing the temperature in Celsius.",
        "outputFormat": "Print two lines:\\nFahrenheit: <value formatted to 2 decimal places>\\nKelvin: <value formatted to 2 decimal places>",
        "constraints": [
            "-273.15 <= Celsius <= 1000.0"
        ],
        "sampleInput": "25.0",
        "sampleOutput": "Fahrenheit: 77.00\nKelvin: 298.15",
        "testCases": [
            {
                "input": "25.0",
                "expectedOutput": "Fahrenheit: 77.00\nKelvin: 298.15",
                "isHidden": False
            },
            {
                "input": "0.0",
                "expectedOutput": "Fahrenheit: 32.00\nKelvin: 273.15",
                "isHidden": False
            },
            {
                "input": "100.0",
                "expectedOutput": "Fahrenheit: 212.00\nKelvin: 373.15",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (219).png - Screenshot (220).png",
        "explanation": "Create TemperatureConverter with an inner class Converter providing conversion methods. Call from main and print formatted with %.2f.",
        "referenceSolution": """import java.util.Scanner;

class TemperatureConverter {
    class Converter {
        public double toFahrenheit(double celsius) {
            return (celsius * 9.0 / 5.0) + 32.0;
        }

        public double toKelvin(double celsius) {
            return celsius + 273.15;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextDouble()) return;
        double c = sc.nextDouble();
        TemperatureConverter tc = new TemperatureConverter();
        TemperatureConverter.Converter conv = tc.new Converter();
        System.out.printf("Fahrenheit: %.2f\\n", conv.toFahrenheit(c));
        System.out.printf("Kelvin: %.2f\\n", conv.toKelvin(c));
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class TemperatureConverter {
    // Define inner class Converter
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
        "id": "java-024",
        "title": "Health Record Tracker and BMI Calculator",
        "description": "Melvin is focused on maintaining a healthy lifestyle and wants to create a program to track his health records, specifically his weight (in kg), height (in meters), and a target BMI he aims to achieve.\\n\\nDesign a class named HealthRecord with attributes weight, height, and targetBMI. Implement methods to:\\n1. computeCurrentBMI(): weight / (height * height)\\n2. computeBMIDifference(): Math.abs(currentBMI - targetBMI)\\n\\nPrint current BMI and BMI difference rounded to 2 decimal places.",
        "inputFormat": "Three space-separated double values: weight (kg), height (m), and target BMI.",
        "outputFormat": "Print two lines:\\nCurrent BMI: <BMI rounded to 2 decimal places>\\nBMI Difference: <difference rounded to 2 decimal places>",
        "constraints": [
            "10.0 <= weight <= 300.0",
            "0.5 <= height <= 2.5",
            "10.0 <= target BMI <= 50.0"
        ],
        "sampleInput": "70.0 1.75 22.0",
        "sampleOutput": "Current BMI: 22.86\nBMI Difference: 0.86",
        "testCases": [
            {
                "input": "70.0 1.75 22.0",
                "expectedOutput": "Current BMI: 22.86\nBMI Difference: 0.86",
                "isHidden": False
            },
            {
                "input": "65.0 1.70 21.5",
                "expectedOutput": "Current BMI: 22.49\nBMI Difference: 0.99",
                "isHidden": False
            },
            {
                "input": "80.0 1.80 24.69",
                "expectedOutput": "Current BMI: 24.69\nBMI Difference: 0.00",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (221).png - Screenshot (222).png",
        "explanation": "Create HealthRecord class to encapsulate weight, height, targetBMI, calculate BMI = weight / (height*height), and difference = Math.abs(current - target).",
        "referenceSolution": """import java.util.Scanner;

class HealthRecord {
    double weight;
    double height;
    double targetBMI;

    public HealthRecord(double weight, double height, double targetBMI) {
        this.weight = weight;
        this.height = height;
        this.targetBMI = targetBMI;
    }

    public double computeCurrentBMI() {
        return weight / (height * height);
    }

    public double computeBMIDifference() {
        return Math.abs(computeCurrentBMI() - targetBMI);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextDouble()) return;
        double w = sc.nextDouble();
        double h = sc.nextDouble();
        double t = sc.nextDouble();
        HealthRecord record = new HealthRecord(w, h, t);
        System.out.printf("Current BMI: %.2f\\n", record.computeCurrentBMI());
        System.out.printf("BMI Difference: %.2f\\n", record.computeBMIDifference());
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class HealthRecord {
    // Define fields, constructor, and methods
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
        "id": "java-025",
        "title": "Satellite Thermal Grid Diagonal and Max Analyzer",
        "description": "A space research organization is monitoring the thermal distribution across a satellite's external panel. The panel is divided into an n * n grid, where each cell represents the temperature recorded by a sensor. Due to transmission constraints, the sensor readings must be stored in a file named thermal.txt.\\n\\nYour task is to:\\n1. Write the grid data into thermal.txt.\\n2. Read the file and compute:\\n   - The sum of temperatures along the primary diagonal (top-left to bottom-right).\\n   - The sum of temperatures along the secondary diagonal (top-right to bottom-left).\\n   - The maximum temperature recorded across the entire grid.\\n3. Store the computed results in a file named analysis.txt.\\n4. Display the contents of analysis.txt.",
        "inputFormat": "The first line contains an integer n representing the grid size.\\nThe following n lines contain n space-separated double/float values representing the temperature grid.",
        "outputFormat": "Display three lines:\\nPrimary Diagonal Sum: <sum formatted to 1 decimal place>\\nSecondary Diagonal Sum: <sum formatted to 1 decimal place>\\nMaximum Temperature: <max temp formatted to 1 decimal place>",
        "constraints": [
            "2 <= n <= 10",
            "-100.0 <= temperature <= 150.0",
            "The grid is always square (n * n)."
        ],
        "sampleInput": "3\n10 20 30\n40 50 60\n70 80 90",
        "sampleOutput": "Primary Diagonal Sum: 150.0\nSecondary Diagonal Sum: 150.0\nMaximum Temperature: 90.0",
        "testCases": [
            {
                "input": "3\n10 20 30\n40 50 60\n70 80 90",
                "expectedOutput": "Primary Diagonal Sum: 150.0\nSecondary Diagonal Sum: 150.0\nMaximum Temperature: 90.0",
                "isHidden": False
            },
            {
                "input": "2\n1.5 2.5\n3.5 5.5",
                "expectedOutput": "Primary Diagonal Sum: 7.0\nSecondary Diagonal Sum: 6.0\nMaximum Temperature: 5.5",
                "isHidden": False
            },
            {
                "input": "3\n-10.0 5.0 20.0\n30.0 40.0 15.0\n25.0 35.0 -5.0",
                "expectedOutput": "Primary Diagonal Sum: 25.0\nSecondary Diagonal Sum: 85.0\nMaximum Temperature: 40.0",
                "isHidden": True
            }
        ],
        "topic": "File Handling",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (223).png - Screenshot (226).png, (228).png",
        "explanation": "Write input matrix to thermal.txt using FileWriter/PrintWriter. Read file using Scanner/BufferedReader. Compute primary diagonal sum (grid[i][i]), secondary diagonal sum (grid[i][n-1-i]), and max element. Write to analysis.txt and print.",
        "referenceSolution": """import java.io.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        double[][] grid = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                grid[i][j] = sc.nextDouble();
            }
        }
        try {
            // Write to thermal.txt
            PrintWriter pw = new PrintWriter(new FileWriter("thermal.txt"));
            pw.println(n);
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    pw.print(grid[i][j] + (j == n - 1 ? "" : " "));
                }
                pw.println();
            }
            pw.close();

            // Read from thermal.txt
            Scanner fileSc = new Scanner(new File("thermal.txt"));
            int size = fileSc.nextInt();
            double pSum = 0.0;
            double sSum = 0.0;
            double maxTemp = Double.NEGATIVE_INFINITY;
            for (int i = 0; i < size; i++) {
                for (int j = 0; j < size; j++) {
                    double val = fileSc.nextDouble();
                    if (i == j) pSum += val;
                    if (i + j == size - 1) sSum += val;
                    if (val > maxTemp) maxTemp = val;
                }
            }
            fileSc.close();

            // Write to analysis.txt and print
            PrintWriter outPw = new PrintWriter(new FileWriter("analysis.txt"));
            String l1 = String.format("Primary Diagonal Sum: %.1f", pSum);
            String l2 = String.format("Secondary Diagonal Sum: %.1f", sSum);
            String l3 = String.format("Maximum Temperature: %.1f", maxTemp);
            outPw.println(l1);
            outPw.println(l2);
            outPw.println(l3);
            outPw.close();

            System.out.println(l1);
            System.out.println(l2);
            System.out.println(l3);
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
        sc.close();
    }
}""",
        "starterCode": """import java.io.*;
import java.util.Scanner;

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
        "id": "java-026",
        "title": "Retail Store Product Validation",
        "description": "Mithun is working on a program to manage a list of products in a retail store. He has created a Product class with attributes such as product name, price, and quantity in stock.\\n\\nThe program should take input for products and perform basic validations on the input data:\\n- Price must be greater than 0.0\\n- Quantity must be greater than or equal to 0\\n\\nIf inputs are valid, print: 'Product: <name>, Price: <price formatted to 2 dec>, Quantity: <qty>'\\nIf invalid, print: 'Invalid price or quantity'",
        "inputFormat": "A single line containing product name (String), price (double), and quantity (int).",
        "outputFormat": "Print 'Product: <name>, Price: <price>, Quantity: <qty>' or 'Invalid price or quantity'",
        "constraints": [
            "1 <= name length <= 50",
            "Price > 0.0 and Quantity >= 0 for validity"
        ],
        "sampleInput": "Mouse 25.50 10",
        "sampleOutput": "Product: Mouse, Price: 25.50, Quantity: 10",
        "testCases": [
            {
                "input": "Mouse 25.50 10",
                "expectedOutput": "Product: Mouse, Price: 25.50, Quantity: 10",
                "isHidden": False
            },
            {
                "input": "Keyboard -10.0 5",
                "expectedOutput": "Invalid price or quantity",
                "isHidden": False
            },
            {
                "input": "Monitor 150.0 0",
                "expectedOutput": "Product: Monitor, Price: 150.00, Quantity: 0",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (227).png",
        "explanation": "Create Product class with validation logic. If price <= 0 or quantity < 0, output error message; otherwise print formatted details.",
        "referenceSolution": """import java.util.Scanner;

class Product {
    String name;
    double price;
    int quantity;

    public Product(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public boolean isValid() {
        return price > 0 && quantity >= 0;
    }

    public void display() {
        if (isValid()) {
            System.out.printf("Product: %s, Price: %.2f, Quantity: %d\\n", name, price, quantity);
        } else {
            System.out.println("Invalid price or quantity");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String name = sc.next();
        double price = sc.nextDouble();
        int quantity = sc.nextInt();
        Product p = new Product(name, price, quantity);
        p.display();
        sc.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class Product {
    // Define Product class
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
        "id": "java-027",
        "title": "Soil Sensor Log Consecutive Duplicate Remover",
        "description": "A smart agriculture system deploys soil sensors across multiple fields to monitor moisture levels. These sensors transmit readings periodically to a central logging system. However, due to intermittent signal issues, the system often records duplicate consecutive readings, which represent noise rather than actual changes in soil conditions.\\n\\nTo ensure accurate analysis, the system must clean the log by removing only consecutive duplicate entries, while preserving legitimate repeated values that occur non-consecutively.\\n\\nYour task is to:\\n1. Accept multiple sensor readings from the user, one per line, until a line with 'END' is reached.\\n2. Write these readings into a file named sensor_log.txt.\\n3. Read the file and remove only consecutive duplicate lines — if the same reading appears multiple times in a row, keep only the first occurrence. If the same reading appears again later non-consecutively, retain it.\\n4. Write the cleaned data into a file named cleaned_log.txt.\\n5. Display the contents of cleaned_log.txt.",
        "inputFormat": "Multiple lines of sensor readings, ending with a line containing 'END'.",
        "outputFormat": "Print the cleaned readings line by line.",
        "constraints": [
            "1 <= number of readings <= 30",
            "Each line length <= 100 characters",
            "At least one valid reading is guaranteed before END."
        ],
        "sampleInput": "45.2\n45.2\n50.1\n45.2\nEND",
        "sampleOutput": "45.2\n50.1\n45.2",
        "testCases": [
            {
                "input": "45.2\n45.2\n50.1\n45.2\nEND",
                "expectedOutput": "45.2\n50.1\n45.2",
                "isHidden": False
            },
            {
                "input": "wet\nwet\nwet\ndry\nwet\nEND",
                "expectedOutput": "wet\ndry\nwet",
                "isHidden": False
            },
            {
                "input": "23.5\n23.5\nEND",
                "expectedOutput": "23.5",
                "isHidden": True
            }
        ],
        "topic": "File Handling",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (229).png - Screenshot (230).png",
        "explanation": "Write incoming lines to sensor_log.txt. Read back line by line, comparing each line to the previous line. Keep and write only lines that differ from the immediately preceding line to cleaned_log.txt, then display.",
        "referenceSolution": """import java.io.*;
import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> raw = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            if (line.equals("END")) break;
            raw.add(line);
        }
        try {
            // Write to sensor_log.txt
            PrintWriter pw = new PrintWriter(new FileWriter("sensor_log.txt"));
            for (String r : raw) {
                pw.println(r);
            }
            pw.close();

            // Read from sensor_log.txt and filter consecutive duplicates
            BufferedReader br = new BufferedReader(new FileReader("sensor_log.txt"));
            List<String> cleaned = new ArrayList<>();
            String prev = null;
            String cur;
            while ((cur = br.readLine()) != null) {
                if (!cur.equals(prev)) {
                    cleaned.add(cur);
                    prev = cur;
                }
            }
            br.close();

            // Write to cleaned_log.txt
            PrintWriter cpw = new PrintWriter(new FileWriter("cleaned_log.txt"));
            for (String c : cleaned) {
                cpw.println(c);
            }
            cpw.close();

            // Display contents of cleaned_log.txt
            for (String c : cleaned) {
                System.out.println(c);
            }
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
        sc.close();
    }
}""",
        "starterCode": """import java.io.*;
import java.util.Scanner;

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
        "id": "java-028",
        "title": "Safe Arithmetic Modulus with Exception Handling",
        "description": "Samantha is a software developer tasked with creating a Java program to perform arithmetic operations on two operands, specifically the modulus operator (a % b). She is concerned about two possible runtime issues: division/modulus by zero, and non-integer inputs.\\n\\nHelp Samantha build a robust program that:\\n- Reads two operands.\\n- If the second operand is zero, catch ArithmeticException and print 'Cannot divide by zero'.\\n- If an operand cannot be parsed as an integer, catch NumberFormatException and print 'Invalid input! Please enter integer operands.'\\n- Otherwise, compute and print the result of a % b.",
        "inputFormat": "A single line consisting of two tokens representing the two operands.",
        "outputFormat": "Print the integer result of the modulus operation, or the appropriate error message.",
        "constraints": [
            "-10^6 <= operand <= 10^6"
        ],
        "sampleInput": "10 3",
        "sampleOutput": "1",
        "testCases": [
            {
                "input": "10 3",
                "expectedOutput": "1",
                "isHidden": False
            },
            {
                "input": "10 0",
                "expectedOutput": "Cannot divide by zero",
                "isHidden": False
            },
            {
                "input": "10 abc",
                "expectedOutput": "Invalid input! Please enter integer operands.",
                "isHidden": False
            },
            {
                "input": "25 5",
                "expectedOutput": "0",
                "isHidden": True
            }
        ],
        "topic": "Exception Handling",
        "difficulty": "Medium",
        "sourceScreenshot": "Screenshot (231).png",
        "explanation": "Use Integer.parseInt() inside try block. Catch NumberFormatException first, then ArithmeticException for b == 0.",
        "referenceSolution": """import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println("Invalid input! Please enter integer operands.");
            return;
        }
        String op1 = sc.next();
        if (!sc.hasNext()) {
            System.out.println("Invalid input! Please enter integer operands.");
            return;
        }
        String op2 = sc.next();
        try {
            int a = Integer.parseInt(op1);
            int b = Integer.parseInt(op2);
            int res = a % b;
            System.out.println(res);
        } catch (NumberFormatException e) {
            System.out.println("Invalid input! Please enter integer operands.");
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
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
        "id": "java-029",
        "title": "Product Object Collection Serialization",
        "description": "Alex runs a small online store and needs to keep track of various products and their costs. To simplify the process, he decides to serialize the product details (ID, name, and cost) into a file named products.dat.\\n\\nWrite a program that:\\n1. Reads the number of products N.\\n2. For each product, reads product_id (int), product_name (String), and cost (double).\\n3. Serializes the collection of Product objects into products.dat.\\n4. Deserializes the objects back from products.dat.\\n5. Prints:\\n   Serialized <N> products to products.dat\\n   Followed by each deserialized product in format: [Product ID: <id>, Name: <name>, Cost: <cost formatted to 1 dec>]",
        "inputFormat": "The first line contains an integer N.\\nThe following N lines each contain product_id, product_name, and cost.",
        "outputFormat": "Serialized <N> products to products.dat\\nFollowed by each product on a new line: [Product ID: <id>, Name: <name>, Cost: <cost>]",
        "constraints": [
            "1 <= N <= 10",
            "1 <= product_id <= 1000",
            "1 <= length of name <= 100",
            "1.0 <= cost <= 1000000.0"
        ],
        "sampleInput": "1\n101 Laptop 45000.0",
        "sampleOutput": "Serialized 1 products to products.dat\n[Product ID: 101, Name: Laptop, Cost: 45000.0]",
        "testCases": [
            {
                "input": "1\n101 Laptop 45000.0",
                "expectedOutput": "Serialized 1 products to products.dat\n[Product ID: 101, Name: Laptop, Cost: 45000.0]",
                "isHidden": False
            },
            {
                "input": "2\n201 Bottle 100.0\n202 Water 300.0",
                "expectedOutput": "Serialized 2 products to products.dat\n[Product ID: 201, Name: Bottle, Cost: 100.0]\n[Product ID: 202, Name: Water, Cost: 300.0]",
                "isHidden": False
            }
        ],
        "topic": "File Handling",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (232).png - Screenshot (233).png",
        "explanation": "Create serializable Product class. Store in an ArrayList<Product>, serialize with ObjectOutputStream, deserialize with ObjectInputStream, and print.",
        "referenceSolution": """import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Product implements Serializable {
    private static final long serialVersionUID = 1L;
    int id;
    String name;
    double cost;

    public Product(int id, String name, double cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
    }

    public String toString() {
        return String.format("[Product ID: %d, Name: %s, Cost: %.1f]", id, name, cost);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<Product> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int id = sc.nextInt();
            String name = sc.next();
            double cost = sc.nextDouble();
            list.add(new Product(id, name, cost));
        }
        try {
            ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("products.dat"));
            oos.writeObject(list);
            oos.close();

            ObjectInputStream ois = new ObjectInputStream(new FileInputStream("products.dat"));
            @SuppressWarnings("unchecked")
            ArrayList<Product> deserialized = (ArrayList<Product>) ois.readObject();
            ois.close();

            System.out.println("Serialized " + n + " products to products.dat");
            for (Product p : deserialized) {
                System.out.println(p);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        sc.close();
    }
}""",
        "starterCode": """import java.io.*;
import java.util.Scanner;

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
        "id": "java-030",
        "title": "Annual Percentage Yield (APY) Calculator with Inner Class",
        "description": "Sophie, an investment enthusiast, is eager to develop a program for calculating the Annual Percentage Yield (APY) based on different interest rates and compounding frequencies.\\n\\nYour task is to design and write a class named APYCalculator that utilizes an inner class calculateAPY for the APY calculation. The program should prompt Sophie to input the interest rate and compounding frequency, then dynamically calculate and display the APY rounded to two decimal places.\\n\\nFormula:\\nAPY = ((1 + interestRate / compoundingFrequency)^compoundingFrequency - 1) * 100",
        "inputFormat": "The first line of input consists of a double value representing the interest rate (e.g. 0.05 for 5%).\\nThe second line consists of an integer representing the compounding frequency (e.g. 12 for monthly).",
        "outputFormat": "Print 'Annual Percentage Yield (APY): <calculated APY rounded to 2 decimal places>%'",
        "constraints": [
            "0.01 <= interest rate <= 1.00",
            "1 <= compounding frequency <= 365"
        ],
        "sampleInput": "0.05\n12",
        "sampleOutput": "Annual Percentage Yield (APY): 5.12%",
        "testCases": [
            {
                "input": "0.05\n12",
                "expectedOutput": "Annual Percentage Yield (APY): 5.12%",
                "isHidden": False
            },
            {
                "input": "0.08\n4",
                "expectedOutput": "Annual Percentage Yield (APY): 8.24%",
                "isHidden": False
            },
            {
                "input": "0.10\n1",
                "expectedOutput": "Annual Percentage Yield (APY): 10.00%",
                "isHidden": True
            }
        ],
        "topic": "Classes and Objects",
        "difficulty": "Hard",
        "sourceScreenshot": "Screenshot (234).png - Screenshot (236).png",
        "explanation": "Define class APYCalculator with inner class calculateAPY containing method compute(double rate, int freq). Formula: (Math.pow(1 + rate/freq, freq) - 1) * 100. Format to 2 decimal places with %.",
        "referenceSolution": """import java.util.Scanner;

class APYCalculator {
    class calculateAPY {
        public double compute(double rate, int frequency) {
            double apy = (Math.pow(1 + rate / frequency, frequency) - 1) * 100;
            return apy;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextDouble()) return;
        double rate = scanner.nextDouble();
        int frequency = scanner.nextInt();
        APYCalculator calculator = new APYCalculator();
        APYCalculator.calculateAPY apyCalc = calculator.new calculateAPY();
        double apy = apyCalc.compute(rate, frequency);
        System.out.printf("Annual Percentage Yield (APY): %.2f%%\\n", apy);
        scanner.close();
    }
}""",
        "starterCode": """import java.util.Scanner;

class APYCalculator {
    // Define inner class calculateAPY
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution here
        scanner.close();
    }
}""",
        "extractionStatus": "verified"
    }
]
