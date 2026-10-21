import re

with open('scripts/generate_bank4_questions.py', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'"id":\s*"(bank4-\d+)"', text)
print(f"Found {len(ids)} IDs:")
print(ids)
