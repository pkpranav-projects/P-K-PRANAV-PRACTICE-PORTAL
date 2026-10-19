import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

print(f"Total entries: {len(data)}")

# Let's inspect testId, question number, problem statements, etc.
for item in data[:15]:
    text = item['text']
    # find testId
    test_id = re.search(r'testId=([^& \n\r]+)', text)
    tid = test_id.group(1)[:15] if test_id else "N/A"
    
    # find question number
    q_no = re.search(r'Question No:\s*(\d+)', text)
    qn = q_no.group(1) if q_no else "N/A"
    
    # find COD
    cod = re.search(r'COD\s*\((\d+)\)', text)
    cd = cod.group(1) if cod else "N/A"
    
    # find problem statement snippet
    ps = ""
    if "Problem Statement" in text:
        ps_part = text.split("Problem Statement", 1)[1]
        ps = ps_part[:100].strip().replace('\n', ' ')
    elif "problem Statement" in text:
        ps_part = text.split("problem Statement", 1)[1]
        ps = ps_part[:100].strip().replace('\n', ' ')
        
    print(f"File: {item['file']:<22} | Q: {qn} | COD: {cd} | TestId: {tid} | PS: {ps[:60]}")
