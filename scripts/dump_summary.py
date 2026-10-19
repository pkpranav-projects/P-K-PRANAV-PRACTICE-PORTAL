import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

for item in q_data:
    fname = item['file']
    txt = item['text']
    lines = [l.strip() for l in item['lines'] if l.strip()]
    
    # print summary of lines
    print(f"=== {fname} ===")
    for l in lines[:15]:
        print("  ", l)
    if len(lines) > 15:
        print("   ... [", len(lines) - 15, "more lines ]")
        for l in lines[-5:]:
            print("  ", l)
