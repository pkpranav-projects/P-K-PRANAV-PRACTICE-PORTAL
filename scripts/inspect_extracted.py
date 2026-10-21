import json

with open('scripts/extracted_q4_initial.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

for q in qs:
    print(f"[{q['index']:02d}] {q['session']} ({q['q_label']}) - {q['title']}")
    print(f"     Shots: {q['shots']}")
    print(f"     Desc (first 100): {q['description'][:100]}...")
    print(f"     Samples count: {len(q['samples'])}")
    print()
