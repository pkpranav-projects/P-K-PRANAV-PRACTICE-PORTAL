import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_dict = {get_num(x['file']): x for x in q_data}

for n in range(180, 186):
    item = q_dict[n]
    print(f"\n=================== {item['file']} ===================")
    for l in item['lines']:
        if not any(k in l for k in ["Cisco Networking", "National Digital", "ndli-club", "Mail - P K", "WhatsApp", "LinkedIn", "All Bookmarks"]):
            print(l)
