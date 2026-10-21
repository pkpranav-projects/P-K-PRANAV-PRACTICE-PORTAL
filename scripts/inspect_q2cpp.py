import json
import re

with open('scripts/questions2cpp_ocr.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

print('Total OCR items:', len(data))
for item in data:
    txt = item['text']
    q_match = re.search(r'(\d+)\s+Single File Programming', txt, re.I)
    q_num = q_match.group(1) if q_match else '-'
    
    # Extract first sentence of problem statement if present
    ps = ''
    for kw in ['Problem Statement', 'Problem statement', 'Problem Sta tement']:
        if kw in txt:
            ps = txt.split(kw)[1][:100].strip().replace('\n', ' ')
            break
    if not ps:
        ps = txt[:80].replace('\n', ' ')
    print(f"{item['file']:<25} | Q:{q_num:<3} | {ps[:70]}")
