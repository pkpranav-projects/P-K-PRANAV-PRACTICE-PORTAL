import json, re, glob, os

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/screenshots_ocr.json", "r", encoding="utf-8-sig") as f:
    s_data = json.load(f)

# Find all problem statements in s_data
s_problems = []
for item in s_data:
    txt = item['text']
    for kw in ["Problem Statement", "problem Statement", "Problem Sta tement", "Problem statement"]:
        if kw in txt:
            p_idx = txt.find(kw) + len(kw)
            snippet = txt[p_idx:p_idx+80].strip().replace('\n', ' ')
            if len(snippet) > 15:
                s_problems.append((item['file'], snippet))
            break

print(f"Total problems found in Screenshots: {len(s_problems)}")
seen = set()
for f, s in s_problems:
    # normalize first 30 chars
    norm = re.sub(r'[^a-zA-Z]', '', s[:35]).lower()
    if norm not in seen:
        seen.add(norm)
        print(f"[{f}] {s[:70]}")
