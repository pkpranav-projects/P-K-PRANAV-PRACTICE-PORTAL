import json
import re
import os

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_data.sort(key=lambda x: get_num(x['file']))

# Let's inspect each screenshot and print its text block
out_file = "c:/Users/P K PRANAV/Pictures/javapractice/scripts/all_extracted_raw.txt"
with open(out_file, "w", encoding="utf-8") as out:
    for item in q_data:
        out.write(f"\n========================================\n")
        out.write(f"FILE: {item['file']}\n")
        out.write(f"========================================\n")
        out.write(item['text'] + "\n")

print(f"Wrote full OCR text of all 78 screenshots to {out_file}")
