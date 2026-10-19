import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

# Let's inspect problem statements found
problems = []
current_prob = None

for item in q_data:
    txt = item['text']
    fname = item['file']
    
    # check if "problem statement" appears
    match = re.search(r'(?:Problem\s*Statement|problem\s*Statement|Problem\s*statement)[\s:]*([^\n\r]+)', txt, re.IGNORECASE)
    if match:
        snippet = match.group(1).strip()
        print(f"[{fname}] START: {snippet[:80]}")
    else:
        # check if it has "Ashok" or similar or class name
        c_match = re.search(r'(class\s+[A-Za-z0-9_]+)', txt)
        t_match = re.search(r'(Sample\s*test\s*cases|Input\s*1\s*:)', txt, re.IGNORECASE)
        print(f"[{fname}] cont.. Class: {c_match.group(1) if c_match else 'None'} | Test: {bool(t_match)}")
