import json
import sys

# Force utf-8 stdout
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('client/src/assets/w3schools_sql_full_course.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total lessons: {len(data)}")
print("\nTop 12 lessons:")
for l in data[:12]:
    print(f"  [{l['order']:02d}] {l['title']} ({l['category']}) -> id: {l['id']}")

checklist = [
    ("DDL & DML", any("ddl" in l['title'].lower() for l in data)),
    ("Aggregate Functions", any("aggregate" in l['title'].lower() for l in data)),
    ("Joins (All Types)", any("join" in l['title'].lower() for l in data)),
    ("Database Constraints", any("constraint" in l['title'].lower() for l in data)),
    ("Nested Queries", any("nested" in l['title'].lower() for l in data)),
    ("Normalization (1NF-5NF)", any("normalization" in l['title'].lower() for l in data)),
    ("Views, Synonyms, Sequences, Index", any("synonym" in l['title'].lower() for l in data)),
    ("Transactions & ACID", any("transaction" in l['title'].lower() for l in data)),
    ("PL/SQL Triggers & Procedures", any("trigger" in l['title'].lower() for l in data)),
    ("Viva Cheatsheet", any("viva" in l['title'].lower() for l in data)),
]

print("\nTopic Checklist Verification:")
for topic, found in checklist:
    status = "PRESENT" if found else "MISSING"
    print(f"  {topic}: {status}")
