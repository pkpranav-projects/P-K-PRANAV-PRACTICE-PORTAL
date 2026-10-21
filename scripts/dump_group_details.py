import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

from dedup_and_group import grouped_questions

print(f"Dumping detailed cards for {len(grouped_questions)} questions...")

with open('scripts/all_56_raw_dump.txt', 'w', encoding='utf-8') as out:
    for idx, g in enumerate(grouped_questions):
        out.write(f"\n=======================================================\n")
        out.write(f"QUESTION {idx+1}: {g['q_hdr']} | Shots: {g['files'][0]} - {g['files'][-1]} ({len(g['files'])} shots)\n")
        out.write(f"=======================================================\n")
        for f in g['files']:
            it = next((x for x in items if x['file'] == f), None)
            if it:
                out.write(f"--- {f} ---\n")
                out.write(it['text'] + "\n\n")

print("Saved raw dump to scripts/all_56_raw_dump.txt")
