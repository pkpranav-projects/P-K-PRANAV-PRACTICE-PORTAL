import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

# Sort by screenshot number
def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_data.sort(key=lambda x: get_num(x['file']))

print(f"Total screenshots: {len(q_data)}")

for item in q_data:
    fname = item['file']
    txt = item['text']
    lines = [l.strip() for l in item['lines'] if l.strip()]
    
    # Check if contains problem statement or question header
    q_marker = ""
    for l in lines:
        if re.search(r'^\s*(?:0\d|\d+)\s+Single File Programming', l, re.IGNORECASE):
            q_marker = l
            break
        elif re.search(r'Question No[\s:]*\d+', l, re.IGNORECASE):
            q_marker = l
            break
        elif re.search(r'QUESTION\s+\d+/\d+', l, re.IGNORECASE):
            q_marker = l
            break
            
    # Find any line with "Ashok" or "Arjun" or "Divya" or names / key problems
    ps_line = ""
    for i, l in enumerate(lines):
        if "problem statement" in l.lower():
            if i + 1 < len(lines):
                ps_line = lines[i+1]
            break
    
    # Check if submission tab or code
    is_sub = "Submission" in txt and ("class " in txt or "import " in txt)
    has_code = "class " in txt or "public static void" in txt or "Scanner" in txt
    
    print(f"{fname:<23} | Marker: {q_marker:<30} | PS: {ps_line[:40]:<40} | Code: {has_code}")
