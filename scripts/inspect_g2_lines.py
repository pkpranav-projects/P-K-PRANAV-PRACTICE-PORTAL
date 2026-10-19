import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

for item in q_data:
    num = int(re.search(r'\((\d+)\)', item['file']).group(1))
    if num in [195, 196, 198, 200, 203, 204, 207, 211, 215, 216, 219, 221, 223, 227, 229, 233, 234]:
        print(f"=== {item['file']} ===")
        for l in item['lines']:
            if len(l.strip()) > 10:
                print("  ", l.strip())
