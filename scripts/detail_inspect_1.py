import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_dict = {get_num(x['file']): x for x in q_data}

# Print details of groups
def show_range(start, end, label):
    print(f"\n=======================================================")
    print(f"  {label} (Screenshots {start} to {end})")
    print(f"=======================================================")
    for n in range(start, end + 1):
        if n in q_dict:
            item = q_dict[n]
            print(f"\n--- {item['file']} ---")
            for line in item['lines']:
                # filter out navigation bar clutter
                if any(k in line for k in ["Cisco Networking", "National Digital", "ndli-club", "Mail - P K", "WhatsApp", "LinkedIn", "All Bookmarks", "Ask Gemini", "YouTube"]):
                    continue
                print(line)

show_range(159, 163, "Q1: Ashok - Substring Insertion")
show_range(163, 165, "Q2: Sarah - Even numbers")
show_range(166, 168, "Q3: examly string / anagram or reverse?")
show_range(169, 171, "Q?: openA1 / iamneo")
show_range(172, 173, "Q: FibonacciCalculator")
show_range(174, 179, "Q: Autoboxing / Unboxing")
