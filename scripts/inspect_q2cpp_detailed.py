import json
import re

with open('scripts/questions2cpp_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(item):
    m = re.search(r'\((\d+)\)', item['file'])
    return int(m.group(1)) if m else 0

items.sort(key=get_num)

sections = [
    ("Section 1", [it for it in items if 238 <= get_num(it) <= 253]),
    ("Section 2", [it for it in items if 254 <= get_num(it) <= 275]),
    ("Section 3", [it for it in items if 276 <= get_num(it) <= 294])
]

for sname, sitms in sections:
    print("=" * 80)
    print(f"=== {sname} ===")
    print("=" * 80)
    q_groups = {}
    for it in sitms:
        m = re.search(r'Question\s*No\s*:\s*(\d+)\s*/\s*5', it['text'], re.I)
        qno = int(m.group(1)) if m else 'unk'
        q_groups.setdefault(qno, []).append(it)
        
    for qno in sorted([k for k in q_groups if isinstance(k, int)]):
        itms = q_groups[qno]
        fnames = [it['file'] for it in itms]
        combined = "\n".join(it['text'] for it in itms)
        print(f"\n--- {sname} Q{qno}: {fnames[0]} to {fnames[-1]} ---")
        
        # print first 500 chars of combined
        print("SAMPLE TEXT:\n", combined[:600])
        print("...\n")
        # search for sample test cases
        samples = re.findall(r'(Input\s*\d+\s*:[^\n]+(?:\n[^\n]+){1,4})', combined, re.I)
        for s in samples[:3]:
            print("SAMPLE:", repr(s))
