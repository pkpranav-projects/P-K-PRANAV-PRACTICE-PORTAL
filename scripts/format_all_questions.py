import json
import re

def clean_common_text(text):
    if not text:
        return ""
    # Remove exam portal UI watermarks/banners
    text = re.sub(r'P K Pranav[^\n]*', '', text, flags=re.I)
    text = re.sub(r'CB\.SC\.[A-Z0-9]+', '', text, flags=re.I)
    text = re.sub(r'cbsc\.[a-z0-9]+@cb\.students\.amrita\.edu[^\n]*', '', text, flags=re.I)
    text = re.sub(r'Amrita_\w+[^\n]*', '', text, flags=re.I)
    text = re.sub(r'\b(?:Sections \d|Questions \d|Answered|Bookmarked|Skipped|Saved in Server|Not Viewed|FC\d+|COD\s*\(\d+\)|Single File Programming Question|Problem Statement)\b', '', text, flags=re.I)
    text = re.sub(r'Summary\s*\d+/\d+.*', '', text, flags=re.I | re.DOTALL)
    text = re.sub(r'Click\s*["\']?Compile["\']?.*', '', text, flags=re.I | re.DOTALL)
    text = re.sub(r'The program will be evaluated.*', '', text, flags=re.I | re.DOTALL)
    text = re.sub(r'Extra spaces and new line characters.*', '', text, flags=re.I | re.DOTALL)
    text = re.sub(r'Marks\s*:\s*\d+.*', '', text, flags=re.I | re.DOTALL)
    text = re.sub(r'Negative Marks\s*:\s*\d+.*', '', text, flags=re.I | re.DOTALL)
    # Clean OCR odd symbols
    text = text.replace('', '')
    text = text.replace('rnaintain', 'maintain')
    text = text.replace('Narnes', 'Names')
    text = text.replace('Inteqer', 'Integer')
    text = text.replace('elernent', 'element')
    # Collapse multiple spaces on a single line
    lines = [re.sub(r'[ \t]+', ' ', l).strip() for l in text.split('\n')]
    # Remove empty lines
    text = '\n'.join([l for l in lines if l])
    return text.strip()

def format_paragraphs(text):
    if not text:
        return ""
    # If text has no newlines but multiple sentences, break into natural paragraphs
    if '\n\n' not in text:
        sentences = re.split(r'(?<=[.!?])\s+', text)
        if len(sentences) >= 4:
            # Group into 2 paragraphs
            mid = len(sentences) // 2
            p1 = ' '.join(sentences[:mid]).strip()
            p2 = ' '.join(sentences[mid:]).strip()
            return f"{p1}\n\n{p2}"
    return text

def clean_bank1():
    with open('questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        raw = q.get('description', '')
        # Keep only the pure narrative description
        pure = re.split(r'\n*###\s*Input', raw, flags=re.I)[0].strip()
        q['description'] = format_paragraphs(clean_common_text(pure))
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Cleaned Bank 1 (questions.json)")

def clean_bank2():
    with open('questions_bank2.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        raw = q.get('description', '')
        pure = re.split(r'\n*###\s*Input', raw, flags=re.I)[0].strip()
        q['description'] = format_paragraphs(clean_common_text(pure))
    with open('questions_bank2.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Cleaned Bank 2 (questions_bank2.json)")

def clean_dbms():
    with open('questions_dbms.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        raw = q.get('description', '')
        pure = re.split(r'\n*###\s*Input', raw, flags=re.I)[0].strip()
        q['description'] = format_paragraphs(clean_common_text(pure))
    with open('questions_dbms.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Cleaned DBMS (questions_dbms.json)")

# Specific constraints & input clean-ups for Bank 3
BANK3_CLEAN_MAP = {
    "bank3-001": {
        "inputFormat": "The first line contains an integer N representing the number of products.\nThe second line contains N space-separated strings representing product names.\nThe third line contains N space-separated integers representing prices in the same order.",
        "outputFormat": "Print N lines. Each line consists of a product name followed by a space and its price, sorted in descending order of price.",
        "constraints": ["1 <= N <= 20", "1 <= price <= 10000", "Product names are single words with no spaces"]
    },
    "bank3-002": {
        "inputFormat": "The first line contains an integer N representing the number of items in the cart.\nThe second line contains N space-separated integers representing the price of each item.",
        "outputFormat": "Print 'Items: <count>' on the first line.\nPrint each item price on a separate line.\nPrint 'Total: <sum>' on the final line.",
        "constraints": ["1 <= N <= 50", "1 <= item price <= 10000"]
    },
    "bank3-003": {
        "inputFormat": "The first line contains an integer N representing the number of students.\nThe second line contains N space-separated strings representing the names of the students.\nThe third line contains N space-separated integers representing student marks in the same order.",
        "outputFormat": "Print N lines. Each line contains a student's name and marks, sorted in ascending order of marks.",
        "constraints": ["1 <= N <= 20", "0 <= marks <= 100", "Names are single words with no spaces"]
    },
    "bank3-004": {
        "inputFormat": "The first line contains an integer N representing the number of students present.\nThe second line contains N space-separated integers representing roll numbers.",
        "outputFormat": "Print each roll number on a separate line using an Iterator.\nOn the final line, print 'Count: <total>'.",
        "constraints": ["1 <= N <= 50", "1 <= roll number <= 1000"]
    },
    "bank3-005": {
        "inputFormat": "The first line contains an integer N representing the number of employees.\nThe second line contains N space-separated strings representing employee names.\nThe third line contains N space-separated integers representing employee salaries in the same order.",
        "outputFormat": "Print N lines. Each line consists of an employee name and salary, sorted primarily by salary (ascending) and secondarily by name (alphabetically).",
        "constraints": ["1 <= N <= 20", "10000 <= salary <= 200000", "Names are single words with no spaces"]
    },
    "bank3-006": {
        "inputFormat": "The first line contains an integer N representing the number of scores.\nThe second line contains N space-separated integers representing scores.\nThe third line contains an integer representing the threshold value.",
        "outputFormat": "Print each filtered score greater than or equal to the threshold on a separate line.\nOn the final line, print 'Remaining: <count>'.",
        "constraints": ["1 <= N <= 20", "1 <= score <= 1000", "1 <= threshold <= 1000"]
    },
    "bank3-007": {
        "inputFormat": "The first line of input consists of three space-separated integers representing start, end, and step values of the range.",
        "outputFormat": "Print each value in the step range on a separate line.\nOn the final line, print 'Total elements: <count>'.",
        "constraints": ["0 <= start <= end <= 200", "1 <= step <= 50"]
    },
    "bank3-008": {
        "inputFormat": "The first line contains an integer N representing the number of words.\nThe second line contains N space-separated strings representing the words.",
        "outputFormat": "Print N lines. Each line consists of a word and its length, sorted primarily by word length (ascending) and secondarily alphabetically.",
        "constraints": ["1 <= N <= 30", "1 <= word length <= 20", "All words are lowercase with no spaces"]
    },
    "bank3-009": {
        "inputFormat": "The first line contains an integer N representing the number of books.\nThe second line contains N space-separated strings representing book titles.\nThe third line contains N space-separated integers representing page counts.",
        "outputFormat": "Print N lines. Each line consists of a book title and page count, sorted in ascending order of page count.",
        "constraints": ["1 <= N <= 20", "1 <= pages <= 2000", "Book titles are single words with no spaces"]
    },
    "bank3-010": {
        "inputFormat": "The first line contains an integer N representing the number of deliveries.\nThe second line contains N space-separated integers representing delivery times in minutes.\nThe third line contains two space-separated integers representing low and high time thresholds.",
        "outputFormat": "Print each delivery time falling strictly within [low, high] on a separate line.\nOn the final line, print 'In range: <count>'.",
        "constraints": ["1 <= N <= 100", "1 <= delivery time <= 1000", "1 <= low <= high <= 1000"]
    },
    "bank3-011": {
        "inputFormat": "The first line contains an integer N representing the number of sensor readings.\nThe second line contains N space-separated integers representing sensor readings.",
        "outputFormat": "Print the maximum reading in the format 'Max: <val>'.\nPrint the minimum reading in the format 'Min: <val>'.\nPrint the average reading in the format 'Average: <val>'.",
        "constraints": ["1 <= N <= 100", "1 <= sensor reading <= 100000"]
    },
    "bank3-012": {
        "inputFormat": "The first line contains an integer N representing the number of players.\nThe second line contains N space-separated strings representing player names.\nThe third line contains N space-separated integers representing scores.\nThe fourth line contains an integer representing the qualifying threshold score.",
        "outputFormat": "Print the qualifying players' names and scores (score >= threshold) in original order.\nOn the final line, print 'Qualified: <count>'.",
        "constraints": ["1 <= N <= 20", "1 <= score <= 10000", "Player names are single words with no spaces"]
    },
    "bank3-013": {
        "inputFormat": "The first line contains an integer N representing the number of items.\nThe next N lines each contain: itemName (string), deposit (double), and costPerDay (double).",
        "outputFormat": "Print each item's details formatted as '<name> <deposit> <costPerDay>'.\nOn the final line, print total deposits and total cost per day.",
        "constraints": ["1 <= N <= 10", "0.1 <= deposit <= 10000.0", "0.1 <= cost per day <= 1000.0"]
    },
    "bank3-014": {
        "description": "A city traffic management system needs to track vehicles entering a toll booth. Each vehicle is uniquely identified by its registration number.\n\nThe system should allow adding vehicles to a record, ensuring that no duplicate registration numbers exist. The vehicles should be stored in a HashSet, which does not guarantee any specific order. Your task is to implement a program using a HashSet that allows adding vehicle details and displaying the records.",
        "inputFormat": "The first line of input contains an integer N representing the number of vehicles.\nThe next N lines contain details of each vehicle in the format:\n\"RegNumber OwnerName VehicleType\"\n- RegNumber (String): Unique alphanumeric registration number\n- OwnerName (String): Name of the vehicle owner\n- VehicleType (String): Car, Bike, or Truck\nIf a vehicle with the same registration number is already present, ignore the duplicate entry.",
        "outputFormat": "Print the unique vehicle records in the order they are inserted, one per line.",
        "constraints": [
            "1 <= N <= 10",
            "1 <= RegNumber length <= 10",
            "1 <= OwnerName length <= 100",
            "VehicleType is always either Car, Bike, or Truck",
            "Duplicate registration numbers must be ignored"
        ]
    },
    "bank3-015": {
        "inputFormat": "The first line contains an integer N representing the number of prime numbers.\nThe second line contains N space-separated prime numbers.\nThe third line contains an integer P representing the target product.",
        "outputFormat": "Print all pairs or combinations of prime numbers whose product equals P.",
        "constraints": ["1 <= N <= 10", "1 <= prime <= 1000", "1 <= P <= 100000"]
    },
    "bank3-016": {
        "inputFormat": "The first line contains an integer N representing the number of books.\nThe second line contains N space-separated strings representing book titles.\nThe third line contains N space-separated double values representing book prices.",
        "outputFormat": "Print N lines. Each line consists of a book title and its price, sorted primarily by price (ascending) and secondarily by title alphabetically.",
        "constraints": ["1 <= N <= 20", "1.0 <= price <= 5000.0", "Book titles are single words with no spaces"]
    },
    "bank3-017": {
        "inputFormat": "The first line contains an integer N representing the number of patients.\nThe next N lines contain patient details: patientId (int), name (string), and severityLevel (int, 1-5 where 1 is highest priority).",
        "outputFormat": "Print patient records in order of triage priority (highest priority first, followed by smaller patientId).",
        "constraints": ["1 <= N <= 20", "1 <= patientId <= 10000", "1 <= severityLevel <= 5"]
    },
    "bank3-018": {
        "inputFormat": "The first line contains an integer N representing the number of products entered.\nThe next N lines contain product names (one per line).",
        "outputFormat": "Print each unique product name in the order it was first observed.",
        "constraints": ["1 <= N <= 50", "1 <= product name length <= 50"]
    },
    "bank3-019": {
        "inputFormat": "A single line containing a sentence of space-separated words.",
        "outputFormat": "Print the sentence with each individual word reversed while preserving the original word positions and spacing.",
        "constraints": ["1 <= sentence length <= 200", "Sentence contains only alphabetic characters and spaces"]
    },
    "bank3-020": {
        "inputFormat": "The first line contains an integer N representing the number of participants.\nThe second line contains N space-separated strings representing participant usernames.\nThe third line contains N space-separated integers representing problems solved.",
        "outputFormat": "Print the leaderboard sorted in descending order of problems solved. Break ties by alphabetical username order.",
        "constraints": ["1 <= N <= 25", "0 <= problems solved <= 100", "Usernames contain no spaces"]
    },
    "bank3-021": {
        "inputFormat": "The first line contains an integer N representing the number of course registrations.\nThe next N lines each contain studentId (int) and courseCode (string).",
        "outputFormat": "Print the list of unique course registrations with duplicate student-course pairs filtered out.",
        "constraints": ["1 <= N <= 30", "1 <= studentId <= 1000", "CourseCode is alphanumeric"]
    },
    "bank3-022": {
        "inputFormat": "The first line contains an integer N representing the number of attendance entries.\nThe next N lines each contain a student roll number.",
        "outputFormat": "Print unique student roll numbers in sorted ascending order, one per line.",
        "constraints": ["1 <= N <= 50", "1 <= roll number <= 1000"]
    },
    "bank3-023": {
        "inputFormat": "The first line contains an integer n representing the size of Set A.\nThe second line contains n space-separated integers for Set A.\nThe third line contains an integer m representing the size of Set B.\nThe fourth line contains m space-separated integers for Set B.",
        "outputFormat": "Print the intersection of Set A and Set B, or output an indicator if no common elements exist.",
        "constraints": ["1 <= n, m <= 10", "-10000 <= element <= 40000", "Elements in each set are distinct"]
    },
    "bank3-024": {
        "inputFormat": "The first line contains an integer N representing the number of words.\nThe second line contains N space-separated words.\nThe third line contains an integer representing the minimum length threshold.",
        "outputFormat": "Print all words whose length is greater than or equal to the threshold, separated by a single space.",
        "constraints": ["1 <= N <= 50", "1 <= word length <= 50", "1 <= threshold <= 50"]
    },
    "bank3-025": {
        "inputFormat": "The first line contains an integer N representing the number of stack operations.\nThe next N lines specify operations: 'push <val>', 'pop', or 'peek'.",
        "outputFormat": "For each 'pop' or 'peek' operation, print the resulting value or 'Stack is empty' if no elements exist.",
        "constraints": ["1 <= N <= 50", "-1000 <= val <= 1000"]
    },
    "bank3-026": {
        "inputFormat": "The first line contains an integer N representing the number of queue operations.\nThe next N lines specify operations: 'enqueue <val>' or 'dequeue'.",
        "outputFormat": "For each 'dequeue' operation, print the dequeued element or 'Queue is empty'.",
        "constraints": ["Queue max capacity = 5", "1 <= N <= 20", "-1000 <= val <= 1000"]
    },
    "bank3-027": {
        "inputFormat": "The first line contains an integer N representing the number of deque operations.\nThe next N lines specify operations: 'addFirst <val>', 'addLast <val>', 'removeFirst', or 'removeLast'.",
        "outputFormat": "For each removal operation, print the removed element or 'Deque is empty'.",
        "constraints": ["1 <= N <= 50", "1 <= val <= 10000"]
    },
    "bank3-028": {
        "inputFormat": "A single line containing a string S consisting exclusively of curly braces '{' and '}'.",
        "outputFormat": "Print the minimum number of bracket reversals required to balance the expression, or -1 if impossible.",
        "constraints": ["1 <= length of S <= 100", "S contains only '{' and '}'"]
    },
    "bank3-029": {
        "inputFormat": "The first line contains an integer N representing the number of waitlist events.\nThe next N lines specify events: 'add <customerName> <partySize>' or 'seatNext'.",
        "outputFormat": "Print the customer seated for each 'seatNext' event or 'No parties waiting'.",
        "constraints": ["1 <= N <= 50", "1 <= partySize <= 20"]
    },
    "bank3-030": {
        "inputFormat": "The first line contains an integer N representing the circular buffer capacity.\nThe second line contains an integer M representing the number of operations.\nThe next M lines contain read/write commands.",
        "outputFormat": "Print the values read from the circular queue on separate lines.",
        "constraints": ["1 <= capacity <= 20", "1 <= M <= 50"]
    },
    "bank3-031": {
        "inputFormat": "A single line containing an expression string with parentheses, brackets, and braces.",
        "outputFormat": "Print 'Balanced' if all brackets match properly and in valid nesting order; otherwise print 'Not Balanced'.",
        "constraints": ["1 <= string length <= 200", "Contains '()', '[]', and '{}'"]
    },
    "bank3-032": {
        "inputFormat": "The first line contains an integer N representing the shared array size.\nThe next lines specify stack operations: 'push1 <val>', 'push2 <val>', 'pop1', or 'pop2'.",
        "outputFormat": "Print the popped value for pop operations, or 'Stack Overflow' / 'Stack Underflow' when applicable.",
        "constraints": ["1 <= N <= 100", "-1000 <= val <= 1000"]
    },
    "bank3-033": {
        "inputFormat": "The first line contains an integer N representing the number of dispatch jobs.\nThe next N lines specify dispatcher operations on the double-ended queue.",
        "outputFormat": "Print the dispatched job IDs from front or back as specified.",
        "constraints": ["1 <= N <= 50", "Job IDs are alphanumeric"]
    },
    "bank3-034": {
        "inputFormat": "The first line contains an integer N representing available movie tickets.\nThe next lines specify booking requests: 'book <customer> <count>' or 'cancel <customer> <count>'.",
        "outputFormat": "Print confirmation for successful bookings or 'Housefull' when requested tickets exceed availability.",
        "constraints": ["1 <= total tickets <= 500", "1 <= booking size <= 10"]
    },
    "bank3-035": {
        "inputFormat": "A single line containing a valid algebraic expression string without spaces.",
        "outputFormat": "Print 'Yes' if the expression contains redundant parentheses; otherwise print 'No'.",
        "constraints": ["1 <= expression length <= 100", "Operators include +, -, *, /"]
    },
    "bank3-036": {
        "inputFormat": "A single line containing a sentence of space-separated words.",
        "outputFormat": "Print the words in reverse order using a Stack.",
        "constraints": ["1 <= string length <= 100", "Words contain only alphabetic characters"]
    },
    "bank3-037": {
        "inputFormat": "The first line contains an integer N representing the number of students.\nThe next N lines each contain studentName (string) and grade (character).",
        "outputFormat": "Print student grades stored in the HashMap in alphabetical order of student names.",
        "constraints": ["1 <= N <= 30", "Grades are A, B, C, D, or F"]
    },
    "bank3-038": {
        "inputFormat": "The first line contains an integer N representing the number of numeric inputs.\nThe second line contains N space-separated numbers.",
        "outputFormat": "For each number, print 'Fizz' if divisible by 3, 'Buzz' if divisible by 5, 'FizzBuzz' if divisible by both, or the number itself.",
        "constraints": ["1 <= N <= 50", "1 <= number <= 1000"]
    },
    "bank3-039": {
        "inputFormat": "The first line contains an integer N representing array length.\nThe second line contains N space-separated elements.\nThe third line contains the target element to count.",
        "outputFormat": "Print the number of occurrences of the target element in the format 'Occurrences: <count>'.",
        "constraints": ["1 <= N <= 100", "Elements are primitive or wrapper types"]
    },
    "bank3-040": {
        "inputFormat": "The first line contains an integer N representing the number of calendar events.\nThe next N lines contain eventTime (HH:MM) and eventDescription (string).",
        "outputFormat": "Print events sorted in chronological order of their time using a TreeMap.",
        "constraints": ["1 <= N <= 50", "HH:MM is valid 24-hour time", "Descriptions do not contain spaces"]
    },
    "bank3-041": {
        "inputFormat": "The first line contains an integer N representing the number of event halls.\nThe next N lines each contain hallName (string) and seatingCapacity (int).",
        "outputFormat": "Print hall names and capacities sorted in descending order of capacity using a custom Comparator.",
        "constraints": ["1 <= N <= 20", "50 <= capacity <= 5000"]
    },
    "bank3-042": {
        "inputFormat": "The first line contains an integer N representing array size.\nThe second line contains N space-separated elements.",
        "outputFormat": "Print the reversed array elements separated by spaces using a generic reversal method.",
        "constraints": ["1 <= N <= 1000", "-10^6 <= element <= 10^6"]
    },
    "bank3-043": {
        "inputFormat": "The first line contains an integer N representing the number of words.\nThe second line contains N space-separated words.",
        "outputFormat": "Print words grouped by their character length in ascending order of length.",
        "constraints": ["1 <= N <= 50", "1 <= word length <= 30"]
    },
    "bank3-044": {
        "inputFormat": "A single line containing an encrypted string message.",
        "outputFormat": "Print each unique character and its frequency of occurrence sorted alphabetically.",
        "constraints": ["1 <= message length <= 500", "Characters are printable ASCII"]
    },
    "bank3-045": {
        "inputFormat": "The first line contains an integer capacity representing the cache size.\nThe next lines specify 'put <key> <val>' or 'get <key>' operations.",
        "outputFormat": "Print the retrieved value for each 'get' operation or -1 if the key does not exist.",
        "constraints": ["1 <= capacity <= 50", "Keys and values are alphanumeric"]
    },
    "bank3-046": {
        "inputFormat": "The first line contains an integer N representing the number of sales call records.\nThe next N lines contain clientName (string) and callDurationMinutes (int).",
        "outputFormat": "Print call logs organized alphabetically by client name using a TreeMap.",
        "constraints": ["1 <= N <= 50", "1 <= duration <= 300"]
    },
    "bank3-047": {
        "inputFormat": "The first line contains an integer N representing total votes cast.\nThe second line contains N space-separated candidate names.",
        "outputFormat": "Print the candidate who received the majority of votes along with total vote count.",
        "constraints": ["1 <= N <= 1000", "Candidate names are single words"]
    },
    "bank3-048": {
        "inputFormat": "The first line contains an integer N representing the number of employee records.\nThe next N lines each contain employeeName (string) and departmentName (string).",
        "outputFormat": "Print department rosters listing all employee names grouped by department.",
        "constraints": ["1 <= N <= 50", "Names contain no spaces"]
    },
    "bank3-049": {
        "inputFormat": "A single line containing an integer N representing the upper count limit.",
        "outputFormat": "Print numbers from 1 to N alternating between odd and even worker threads.",
        "constraints": ["1 <= N <= 100"]
    },
    "bank3-050": {
        "inputFormat": "The first line contains an integer N representing the pattern row count.",
        "outputFormat": "Print the synchronized alternating star and dash pattern across worker threads.",
        "constraints": ["1 <= N <= 20"]
    },
    "bank3-051": {
        "inputFormat": "A single line containing an input text string.",
        "outputFormat": "Print vowels and consonants from the text alternately using synchronized threads.",
        "constraints": ["1 <= string length <= 100"]
    },
    "bank3-052": {
        "inputFormat": "The first line contains an integer N representing temperature sensor readings.\nThe second line contains N space-separated float temperature values.",
        "outputFormat": "Print temperature alerts if any reading exceeds the threshold in real time.",
        "constraints": ["1 <= N <= 50", "-20.0 <= temperature <= 60.0"]
    },
    "bank3-053": {
        "inputFormat": "A single line containing an integer N representing the upper limit.",
        "outputFormat": "Output alternating square and cube results generated by concurrent threads for values 1 to N.",
        "constraints": ["1 <= N <= 50"]
    },
    "bank3-054": {
        "inputFormat": "A single line containing a string sentence.",
        "outputFormat": "Print words from the sentence concurrently using worker threads.",
        "constraints": ["1 <= sentence length <= 200"]
    },
    "bank3-055": {
        "inputFormat": "The first line contains an initial account balance.\nThe next lines specify concurrent 'deposit <amt>' or 'withdraw <amt>' operations.",
        "outputFormat": "Print the final account balance ensuring thread-safe synchronized execution.",
        "constraints": ["10 <= amount <= 10000", "Initial balance >= 0"]
    },
    "bank3-056": {
        "inputFormat": "The first line contains an integer N representing total fulfillment orders.\nThe second line contains N space-separated order IDs.",
        "outputFormat": "Print which worker thread fulfilled each order ID in alternating dispatch sequence.",
        "constraints": ["1 <= N <= 100", "Order IDs are integers"]
    }
}

def clean_bank3():
    with open('questions_bank3.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        qid = q['id']
        raw_desc = q.get('description', '')
        # Extract pure description
        pure = re.split(r'###\s*Input', raw_desc, flags=re.I)[0].strip()
        pure = clean_common_text(pure)
        q['description'] = format_paragraphs(pure)

        # Apply specific overrides if available
        if qid in BANK3_CLEAN_MAP:
            m = BANK3_CLEAN_MAP[qid]
            if "description" in m:
                q['description'] = m["description"]
            if "inputFormat" in m:
                q['inputFormat'] = m["inputFormat"]
            if "outputFormat" in m:
                q['outputFormat'] = m["outputFormat"]
            if "constraints" in m:
                q['constraints'] = m["constraints"]
        else:
            # General clean up of formats
            q['inputFormat'] = clean_common_text(q.get('inputFormat', ''))
            q['outputFormat'] = clean_common_text(q.get('outputFormat', ''))

    with open('questions_bank3.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Cleaned Bank 3 (questions_bank3.json)")

def main():
    clean_bank1()
    clean_bank2()
    clean_dbms()
    clean_bank3()
    print("All 4 question banks have been cleanly formatted!")

if __name__ == '__main__':
    main()
