import json
import re

with open('scripts/questions2cpp_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(item):
    m = re.search(r'\((\d+)\)', item['file'])
    return int(m.group(1)) if m else 0

items.sort(key=get_num)

ranges = [
    (1, "Deva Supermarket", 238, 240),
    (2, "Redundant Parentheses", 241, 242),
    (3, "Fruit Contest Hashing", 243, 253),
    (4, "Madhan Linked List", 246, 247),
    (5, "Arjun Calculator Division", 248, 250),
    (6, "Team Building Powers", 254, 257),
    (7, "Rohit Combinatorics Power Set", 258, 261),
    (8, "Akil Mid-Square Hash", 262, 265),
    (9, "Printer Queue", 266, 275),
    (10, "Fincrop Asset Management", 270, 274),
    (11, "Raj Character Stack", 276, 278),
    (12, "Ananya Student Exceptions", 279, 285),
    (13, "Raj Bracket Validation", 286, 288),
    (14, "John Sensor Queue", 289, 291),
    (15, "Professor House Robber", 292, 294),
]

for idx, name, start, end in ranges:
    matched = [it for it in items if start <= get_num(it) <= end]
    full_text = "\n".join(it['text'] for it in matched)
    print(f"=== Q{idx}: {name} (Screenshots {start}-{end}) ===")
    
    # Extract test cases
    tcs = re.findall(r'(Input\s*\d*\s*:[^\n]+(?:\n[^\n]+){1,3})', full_text, re.I)
    outs = re.findall(r'(Output\s*\d*\s*:[^\n]+(?:\n[^\n]+){1,3})', full_text, re.I)
    
    for t in tcs[:2]:
        print("  INP:", repr(t))
    for o in outs[:2]:
        print("  OUT:", repr(o))
    print("-" * 50)
