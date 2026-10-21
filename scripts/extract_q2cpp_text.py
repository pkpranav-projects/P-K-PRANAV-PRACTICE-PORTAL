import json

with open('scripts/questions2cpp_ocr.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

for item in data:
    txt = item['text']
    fname = item['file']
    found = False
    for kw in ['Problem Statement', 'Problem statement', 'Write a program', 'Given ', 'You are given', 'Consider ', 'Input 1']:
        if kw in txt:
            idx = txt.find(kw)
            snippet = txt[idx:idx+250].replace('\n', ' ')
            print(f'=== {fname} ===')
            print(snippet)
            print()
            found = True
            break
