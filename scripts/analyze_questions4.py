import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

print(f"Total screenshots loaded: {len(data)}")

# Let's inspect titles and common examly patterns
title_candidates = []
for item in data:
    text = item['text']
    lines = item['lines']
    # Check if lines have problem title or "Problem Statement" or "Question"
    for i, line in enumerate(lines[:10]):
        if any(keyword in line.lower() for keyword in ['single file programming', 'problem statement', 'coding question', 'maximum score', 'time limit']):
            title_candidates.append({
                'file': item['file'],
                'first_lines': lines[:8]
            })
            break

print(f"Found {len(title_candidates)} potential problem start screenshots.")
with open('scripts/q4_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(title_candidates, f, indent=2)

print("Saved to scripts/q4_candidates.json")
