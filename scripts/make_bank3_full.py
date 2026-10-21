import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")

# Detailed metadata and solutions for each of the 56 questions
bank3_data = []

# Load parsed chunks to extract clean description, input, output, constraints, and test cases
from extract_all_56 import results as raw_results

# Define topic groups
# Day 8: Collections & Custom Ordering
# Day 9: Strings & Text Processing
# Day 10: Stacks & Queues
# Day 11: HashMaps, TreeMaps & Generics
# Day 12: Multithreading & Concurrency

print("Building 56 complete question items...")
