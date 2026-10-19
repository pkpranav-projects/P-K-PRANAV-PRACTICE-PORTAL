import json
import re
from collections import Counter

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/screenshots_ocr.json", "r", encoding="utf-8-sig") as f:
    s_data = json.load(f)

print(f"--- QUESTIONS FOLDER ({len(q_data)} files) ---")
q_courses = Counter()
for item in q_data:
    txt = item['text']
    courses = re.findall(r'Amrita[^\n\r\|]+|amrita[^\n\r\|]+', txt)
    if courses:
        q_courses[courses[0][:40]] += 1
    else:
        # Check testId or URL
        m = re.search(r'testId=([^& \n\r]+)', txt)
        if m:
            q_courses["testId:" + m.group(1)[:15]] += 1
        else:
            q_courses["Unknown"] += 1

for k, v in q_courses.most_common(10):
    print(f"  {k}: {v}")

print(f"\n--- SCREENSHOTS FOLDER ({len(s_data)} files) ---")
s_courses = Counter()
s_languages = Counter()
for item in s_data:
    txt = item['text']
    courses = re.findall(r'Amrita[^\n\r\|]+|Amirtha[^\n\r\|]+', txt)
    if courses:
        s_courses[courses[0][:40]] += 1
    else:
        s_courses["Unknown"] += 1
    
    # Check language
    if "MySQL" in txt or "sql" in txt.lower():
        s_languages["SQL/DBMS"] += 1
    elif "Java" in txt:
        s_languages["Java"] += 1
    elif "C++" in txt or "cpp" in txt.lower():
        s_languages["C++"] += 1
    elif "C " in txt or "#include" in txt:
        s_languages["C"] += 1
    else:
        s_languages["Other"] += 1

for k, v in s_courses.most_common(10):
    print(f"  {k}: {v}")

print("\nLanguages in Screenshots folder:")
for k, v in s_languages.items():
    print(f"  {k}: {v}")
