import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

print("==== GROUP 1: Screenshots 159 to 194 ====")
for item in q_data:
    num = int(re.search(r'\((\d+)\)', item['file']).group(1))
    if num > 194:
        continue
    txt = item['text']
    # Check if Question No
    qno = re.search(r'Question No[\s:]*(\d+)', txt, re.IGNORECASE)
    qn = qno.group(1) if qno else ""
    # Check problem statement
    ps = ""
    m = re.search(r'Problem Statement[\s:]*([^\n\r]+)', txt, re.IGNORECASE)
    if m:
        ps = m.group(1)[:70]
    # Check sample input
    samp = ""
    s_m = re.search(r'(Input\s*1\s*:[\s\S]{1,40})', txt)
    if s_m:
        samp = s_m.group(1).replace('\n', ' ')
    print(f"[{item['file']}] Q:{qn} | PS: {ps} | {samp[:40]}")
