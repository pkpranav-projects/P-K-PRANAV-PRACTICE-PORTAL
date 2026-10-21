import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")
print(f"Total chunks to build: {len(chunks)-1}")

def clean_txt(t):
    if not t:
        return ""
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r'\r\n|\r', '\n', t)
    return t.strip()

# Specific metadata, title, topics and solutions for each question
# We have 14 distinct Day sessions:
# 1-4: Day 8 COD (Custom Comparator, Vector items, Student Comparable, Vector Roll Iterator)
# 5-8: Day 8 CY (Employee Salary/Name Comparable, Score Vector Filter it.remove, StepRange Iterable, Word Length Comparator)
# 9-12: Day 8 PAH (Library Book Page Comparator, Logistics Delivery Range, Sensor Max/Min Vector, Value Filter Iterator)
# 13-16: Day 9 COD (Inventory Deposit/Cost, Vehicle HashSet, String Palindrome, Character Frequency)
# 17-20: Day 9 CY (Anagram Matcher, Substring Slicer, Word Reversal, String Sorter)
# 21-24: Day 9 PAH (Vowel/Consonant Subsequence, Delimiter Tokenizer, Non-repeating Chars, Prefix Validator)
# 25-28: Day 10 COD (Balanced Delimiters Stack, Job Queue Spooler, Jansi Deque Operations, Two Stacks in One Array)
# 29-32: Day 10 CY (MinStack Constant Time, Circular Queue Buffer, Next Greater Element Stack, Sliding Window Deque)
# 33-36: Day 10 PAH (Ticket Call Center Queue, Undo-Redo Dual Stacks, Stock Span Stack, Postfix Expression Stack)
# 37-40: Day 11 COD (HashMap Word Frequency, Generic Box Container, Generic Swap Array, EventManager TreeMap)
# 41-44: Day 11 CY (Student Multi-Attribute Map, Generic Array Max, Student Gradebook HashMap, HashSet Unique Checker)
# 45-48: Day 11 PAH (Generic Cache Store, Product Inventory TreeMap, Aryan Election Vote Counter HashMap, Anagram Grouping Directory)
# 49-52: Day 12 COD (Alternating Even/Odd Threads, Producer-Consumer Sync Buffer, Thread Priority Counter, Concurrent Matrix Rows)
# 53-56: Day 12 PAH (Vowel/Consonant Alternating Threads, Lisa Smart Thermostat Temperature Thread, Concurrent Bank Account, Thread Worker Pool)

print("Building 56 complete question items...")
