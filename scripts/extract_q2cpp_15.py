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

all_15 = []

for sname, sitms in sections:
    q_groups = {}
    for it in sitms:
        m = re.search(r'Question\s*No\s*:\s*(\d+)\s*/\s*5', it['text'], re.I)
        qno = int(m.group(1)) if m else 'unk'
        q_groups.setdefault(qno, []).append(it)
        
    for qno in sorted([k for k in q_groups if isinstance(k, int)]):
        itms = q_groups[qno]
        fnames = [it['file'] for it in itms]
        combined = "\n".join(it['text'] for it in itms)
        all_15.append({
            'section': sname,
            'qno': qno,
            'shots': f"{fnames[0]} - {fnames[-1]}" if len(fnames) > 1 else fnames[0],
            'files': fnames,
            'text': combined
        })

print(f"Total extracted: {len(all_15)}")
with open('scripts/q2cpp_all_15_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_15, f, indent=2)
print("Saved to scripts/q2cpp_all_15_raw.json")
