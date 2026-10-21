import json
import re

with open('questions_bank3.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

# Specific overrides for the 10 missing/problematic format questions
format_overrides = {
    "bank3-002": {
        "outputFormat": "Print 'Items: <N>', followed by each item's price on its own line in the order added, and finally 'Total: <sum>'."
    },
    "bank3-008": {
        "outputFormat": "Print the words sorted primarily by length in ascending order, and alphabetically (case-insensitive) for words of equal length, each on a new line."
    },
    "bank3-011": {
        "outputFormat": "Print two lines:\nLine 1: Max: <maxValue>\nLine 2: Min: <minValue>"
    },
    "bank3-020": {
        "inputFormat": "The first line contains an integer N representing the number of participants.\nThe next N lines each contain three space-separated values: participant name (string), score (integer), and submission time in minutes (integer)."
    },
    "bank3-021": {
        "outputFormat": "Print each unique student and course registration in the order of first registration, each on a new line in the format '<studentName> <courseCode>'."
    },
    "bank3-030": {
        "outputFormat": "For each read operation, print the integer value read from the circular queue on a new line."
    },
    "bank3-038": {
        "outputFormat": "Print space-separated tokens from 1 to N, where multiples of 3 are replaced by 'Fizz', multiples of 5 by 'Buzz', and multiples of both 3 and 5 by 'FizzBuzz'."
    },
    "bank3-050": {
        "inputFormat": "A single integer N representing the number of rows in the star pattern."
    },
    "bank3-052": {
        "outputFormat": "For each room temperature reading, print the alert classification and temperature on a new line:\n- 'Normal: <temp>' (if between 20.0 and 26.0)\n- 'High Alert: <temp>' (if > 26.0)\n- 'Low Alert: <temp>' (if < 20.0)"
    },
    "bank3-056": {
        "outputFormat": "Print N lines showing each order being processed alternately by WorkerA and WorkerB:\n'WorkerA processed <OrderID>'\n'WorkerB processed <OrderID>'"
    }
}

# Specific overrides for full problems (019, 047, 048)
full_overrides = {
    "bank3-019": {
        "title": "String Word Reversal & Character Preservation",
        "description": "Given a sentence composed of space-separated words, reverse the order of the words in the sentence while keeping the internal characters of each word unchanged.",
        "inputFormat": "A single line of text containing space-separated words.",
        "outputFormat": "Print the words in reverse order, separated by a single space.",
        "constraints": [
            "1 <= length of input string <= 1000",
            "Words contain only alphanumeric characters and are separated by single spaces."
        ],
        "sampleInput": "Hello World Java",
        "sampleOutput": "Java World Hello"
    },
    "bank3-047": {
        "title": "Aryan's College Election Majority Voting Counter",
        "description": "Aryan is organizing a college election vote tally. Given the total number of ballots cast N, followed by N candidate IDs, determine the majority candidate who received more than half of the total votes (> N / 2). If a candidate secures the majority, announce the winner and total votes received.",
        "inputFormat": "The first line contains an integer N representing the total number of votes cast.\nThe second line contains N space-separated integers representing candidate IDs.",
        "outputFormat": "Print 'Majority Winner: Candidate <ID> with <count> votes'. If no candidate secures more than N/2 votes, print 'No Majority Winner'.",
        "constraints": [
            "1 <= N <= 1000",
            "1 <= candidate ID <= 100"
        ],
        "sampleInput": "7\n1 2 1 1 3 1 2",
        "sampleOutput": "Majority Winner: Candidate 1 with 4 votes"
    },
    "bank3-017": {
        "title": "Hospital Patient ID Priority Queue Triage",
        "description": "A hospital emergency room uses a priority queue triage system to prioritize incoming patients based on the urgency of their condition. Each patient record contains a Patient ID, condition severity description, and a numerical priority rank (1 being highest priority).\n\nGiven N patient admissions, sort and print the patients in ascending order of their priority level (highest priority first). If two patients have equal priority, preserve the arrival order.",
        "inputFormat": "The first line contains an integer N representing the number of patients.\nThe next N lines each contain three space-separated values: Patient ID (string), condition description (string), and priority integer (where 1 is highest priority).",
        "outputFormat": "Print the patient records in order of priority, each on a new line in the format: '<PatientID> <Condition> <Priority>'.",
        "constraints": [
            "1 <= N <= 100",
            "1 <= priority <= 10",
            "Patient ID and condition are alphanumeric strings without spaces."
        ],
        "sampleInput": "3\nP101 Emergency 1\nP102 General 3\nP103 Urgent 2",
        "sampleOutput": "P101 Emergency 1\nP103 Urgent 2\nP102 General 3"
    },
    "bank3-048": {
        "title": "Employee Department Directory using HashMap",
        "description": "A company maintains an employee registry where each employee belongs to a specific department. Given a list of N employee name and department pairs, store them in an appropriate map structure. Finally, given a target department query, list all employees who belong to that department in the order they were registered. If no employee belongs to the queried department, print 'None'.",
        "inputFormat": "The first line contains an integer N representing the number of employees.\nThe next N lines each contain two space-separated strings: employee name and department name.\nThe final line contains a string representing the department to search for.",
        "outputFormat": "Print the names of all employees belonging to the queried department, each on a new line.",
        "constraints": [
            "1 <= N <= 100",
            "Employee and department names contain alphanumeric characters with no spaces."
        ],
        "sampleInput": "3\nJohn IT\nSarah HR\nMike IT\nIT",
        "sampleOutput": "John\nMike"
    }
}

def clean_ocr(text):
    if not text:
        return ''
    t = text
    t = re.sub(r'^Skipped\s*(?:\d+\s*\+?\s*\d*|\+\s*\d+)?\s*(?:-o\s*)?', '', t, flags=re.I)
    t = re.sub(r'Header\s*Snippet.*?(?=(?:[A-Z][a-z]+ (?:is|needs|stores|manages|develops|wants|maintains|works|takes|builds|has|decides|gathers|learns|requires|evaluates|creates|simulates|monitors|receives|collects|organizes|runs|counts)|A |An |In |Imagine |Given |Implement |Write |The |Develop ))', '', t, flags=re.I)
    t = re.sub(r'Header\s*Snippet\s*\d*\s*import\s+[a-zA-Z0-9_\.\s\*]+\s*;?\s*(?:Java\s*\(\d+\)\s*)?', '', t, flags=re.I)
    t = re.sub(r'Header\s*Snippet\s*', '', t, flags=re.I)
    t = re.sub(r'Footer\s*Snippet\s*[^\n]+', '', t, flags=re.I)
    t = re.sub(r'P\s*K\s*Pranav\s+CB\.SC\.[^\n]+', '', t, flags=re.I)
    t = re.sub(r'cbsc\.[^\n]+', '', t, flags=re.I)
    t = re.sub(r'Single File Programming Question\s*', '', t, flags=re.I)
    t = re.sub(r'Problem\s*Statern?ent:?\s*', '', t, flags=re.I)
    t = re.sub(r'White\s*List\s*\([^)]*\)\s*', '', t, flags=re.I)
    t = re.sub(r'The program will be evaluated[^\n]+', '', t, flags=re.I)
    t = re.sub(r'Marks\s*:\s*\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Negative\s*Marks\s*:\s*\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Summary\s*\d+/\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Sections\s*\d+\s*Questions[^\n]*', '', t, flags=re.I)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

cleaned_bank3 = []

for q in qs:
    qid = q['id']
    item = dict(q)
    
    # Apply full overrides if present
    if qid in full_overrides:
        item.update(full_overrides[qid])
    else:
        # Clean description
        item['description'] = clean_ocr(item['description'])
        
        # Apply format overrides if present
        if qid in format_overrides:
            item.update(format_overrides[qid])
        else:
            item['inputFormat'] = clean_ocr(item.get('inputFormat', ''))
            item['outputFormat'] = clean_ocr(item.get('outputFormat', ''))
            
    # Clean constraints
    clean_constraints = []
    for c in item.get('constraints', []):
        cc = clean_ocr(c)
        if cc:
            clean_constraints.append(cc)
    if not clean_constraints:
        clean_constraints = ["All inputs adhere to standard boundary constraints."]
    item['constraints'] = clean_constraints
    
    # Enrich description with structured markdown sections so input/output are always visible in problem statement!
    raw_desc = item['description']
    inp_f = item.get('inputFormat', '')
    out_f = item.get('outputFormat', '')
    s_inp = item.get('sampleInput', '')
    s_out = item.get('sampleOutput', '')
    
    # Build complete enriched markdown description
    desc_parts = [raw_desc]
    
    if inp_f:
        desc_parts.append(f"\n\n### Input Format\n{inp_f}")
    if out_f:
        desc_parts.append(f"\n\n### Output Format\n{out_f}")
    if clean_constraints:
        c_lines = "\n".join(f"- {c}" for c in clean_constraints)
        desc_parts.append(f"\n\n### Constraints\n{c_lines}")
    if s_inp or s_out:
        desc_parts.append(f"\n\n### Sample Input\n```\n{s_inp}\n```\n\n### Sample Output\n```\n{s_out}\n```")
        
    item['description'] = "".join(desc_parts)
    cleaned_bank3.append(item)

with open('questions_bank3.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_bank3, f, indent=2)

print(f"Successfully cleaned and enriched all {len(cleaned_bank3)} Bank 3 questions in questions_bank3.json!")
