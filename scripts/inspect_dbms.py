import json

with open('scripts/dbms_questions_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def clean_lines(lines):
    res = []
    for l in lines:
        l = l.strip()
        if not l:
            continue
        low = l.lower()
        if any(x in low for x in ['cbsc.u4cys', 'p k pranav', '1 sections', '3 questions', 'amrita.edu', 'answered', 'bookmarked', 'skipped']):
            continue
        res.append(l)
    return res

print("==================================================")
print("=== GROUP 1: 4FDF1 (Screenshots 604 - 618) ===")
print("==================================================")
for i in range(0, 15):
    print(f"--- File: {items[i]['file']} ---")
    print('\n'.join(clean_lines(items[i]['lines'])))

print("\n==================================================")
print("=== GROUP 2: 2AEFB (Screenshots 619 - 632) ===")
print("==================================================")
for i in range(15, 29):
    print(f"--- File: {items[i]['file']} ---")
    print('\n'.join(clean_lines(items[i]['lines'])))

print("\n==================================================")
print("=== GROUP 3: 35167 (Screenshots 633 - 638) ===")
print("==================================================")
for i in range(29, 35):
    print(f"--- File: {items[i]['file']} ---")
    print('\n'.join(clean_lines(items[i]['lines'])))

print("\n==================================================")
print("=== GROUP 4: F5867 (Screenshots 639 - 644) ===")
print("==================================================")
for i in range(35, 41):
    print(f"--- File: {items[i]['file']} ---")
    print('\n'.join(clean_lines(items[i]['lines'])))

print("\n==================================================")
print(f"--- File: {items[41]['file']} ---")
print('\n'.join(clean_lines(items[41]['lines'])))
