import json
import re

qs = json.load(open('questions_bank3.json', encoding='utf-8'))
for idx, q in enumerate(qs, 1):
    raw_desc = q['description']
    first_part = raw_desc.split('\n\n### Input Format')[0]
    has_jammed = '### Input' in first_part
    pure_desc = re.split(r'###\s*Input', raw_desc, flags=re.I)[0].strip()
    print(f"[{idx:02d}] {q['id']}: len={len(pure_desc)} has_jammed={has_jammed}")
    print(f"     Preview: {pure_desc[:90]}...")
