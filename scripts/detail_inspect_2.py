import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_dict = {get_num(x['file']): x for x in q_data}

def show_range(start, end, label):
    print(f"\n=======================================================")
    print(f"  {label} (Screenshots {start} to {end})")
    print(f"=======================================================")
    for n in range(start, end + 1):
        if n in q_dict:
            item = q_dict[n]
            print(f"\n--- {item['file']} ---")
            for line in item['lines']:
                if any(k in line for k in ["Cisco Networking", "National Digital", "ndli-club", "Mail - P K", "WhatsApp", "LinkedIn", "All Bookmarks", "Ask Gemini", "YouTube"]):
                    continue
                print(line)

show_range(180, 185, "Screenshots 180-185")
show_range(186, 194, "Screenshots 186-194")
