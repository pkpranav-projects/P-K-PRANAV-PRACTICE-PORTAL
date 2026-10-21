import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

# Sort items numerically by screenshot index
def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

# Print each item file and first few lines to see the structure of questions
with open('scripts/q4_summary.txt', 'w', encoding='utf-8') as out:
    for it in items:
        out.write(f"=== {it['file']} ===\n")
        out.write(it['text'] + "\n\n")

print(f"Wrote full OCR text of {len(items)} items to scripts/q4_summary.txt")
