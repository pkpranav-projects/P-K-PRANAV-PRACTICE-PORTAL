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
    q_groups = {}
    for it in sitms:
        # find Question No from lines
        txt = " ".join(it.get('lines', []))
        m = re.search(r'Question\s*No\s*:\s*(\d+)\s*/\s*5', txt, re.I)
        qno = int(m.group(1)) if m else 'unk'
        q_groups.setdefault(qno, []).append(it)
        
    for qno in sorted([k for k in q_groups if isinstance(k, int)]):
        itms = q_groups[qno]
        fnames = [it['file'] for it in itms]
        all_lines = []
        for it in itms:
            all_lines.extend(it.get('lines', []))
            
        filtered = []
        for l in all_lines:
            l_str = l.strip()
            if not l_str:
                continue
            if any(ign in l_str.lower() for ign in [
                'internet status: online', 'name : p k pranav', 'amrita', 'section 1/1',
                'question no :', 'single file programming question', 'marks : 30',
                'negative marks', 'roll number :', 'compile & run', 'submit code',
                'submit test', 'debug result', 'fill your code here', 'you are using gcc',
                'answered 0', 'bookmarked 0', 'skipped', 'not viewed', 'saved in server'
            ]):
                continue
            filtered.append(l_str)
            
        print("="*60)
        print(f"{sname} Q{qno}: {fnames[0]} to {fnames[-1]}")
        print("="*60)
        print("\n".join(filtered[:30]))
        print("\n")
