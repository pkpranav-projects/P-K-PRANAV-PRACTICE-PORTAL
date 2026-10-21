import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

# Find where new questions start
starts = []
for idx, it in enumerate(items):
    text = it['text']
    lines = [l.strip() for l in it['lines'] if l.strip()]
    first_3 = " ".join(lines[:4]).lower()
    
    # Check if this screenshot introduces a problem
    if 'single file programming' in first_3 or 'problem statement' in first_3:
        starts.append((idx, it['file'], lines[:5]))

print(f"Total start points detected: {len(starts)}")
for s in starts:
    print(f"File {s[1]}: {' | '.join(s[2])}")
