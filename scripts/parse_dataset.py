import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_data.sort(key=lambda x: get_num(x['file']))

# Let's see: how many distinct tests and questions are there?
# Let's print for each screenshot:
# File name, URL or test title, question number, first sentence of problem statement
print(f"{'File':<24} | {'Q#':<6} | {'Test ID / Course':<35} | First line of problem / content")
print("-" * 110)

for item in q_data:
    fname = item['file']
    txt = item['text']
    
    # test id
    m_test = re.search(r'testId=([a-zA-Z0-9_\-%]+)', txt)
    tid = m_test.group(1)[:25] if m_test else "examly"
    if "04be07ae" in txt:
        tid = "04be07ae (Day 6?)"
    elif "deeeed8e" in txt:
        tid = "deeeed8e (Day 7)"
    elif "f367a610" in txt:
        tid = "f367a610 (Day 8?)"
    elif "4441fda0" in txt:
        tid = "course:4441fda0"

    # question number
    q_num = ""
    m_q = re.search(r'(?:Question No:\s*|QUESTION\s+|Q\.NO\s*|QNO\s*)(\d+)', txt, re.IGNORECASE)
    if m_q:
        q_num = m_q.group(1)
    else:
        m_q2 = re.search(r'\b(0[1-9]|[1-9])\s+Single File Programming', txt)
        if m_q2:
            q_num = m_q2.group(1)
            
    # snippet
    snippet = ""
    for kw in ["Problem Statement", "problem Statement", "Problem Sta tement", "Problem statement"]:
        if kw in txt:
            p_idx = txt.find(kw) + len(kw)
            snippet = txt[p_idx:p_idx+65].strip().replace('\n', ' ')
            break
            
    if not snippet:
        # Check if code
        if "public static void main" in txt:
            snippet = "[CODE] " + txt[txt.find("public static void main"):txt.find("public static void main")+50].replace('\n', ' ')
        elif "class " in txt:
            snippet = "[CODE] " + txt[txt.find("class "):txt.find("class ")+50].replace('\n', ' ')
        elif "Sample test cases" in txt or "Sample Test Cases" in txt:
            snippet = "[TEST CASES]"
            
    print(f"{fname:<24} | {q_num:<6} | {tid:<35} | {snippet[:50]}")
