import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

for item in q_data:
    fname = item['file']
    lines = item['lines']
    
    # print header lines (first 10 non-empty)
    non_empty = [l.strip() for l in lines if l.strip() and not l.startswith("http") and not "Ask Gemini" in l and not "amrita931" in l and not "app.iamneo" in l]
    header = " | ".join(non_empty[:4])
    print(f"[{fname}] {header[:120]}")
