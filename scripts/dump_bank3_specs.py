import json

with open('questions_bank3.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

print(f"Total questions: {len(qs)}")
with open('scripts/bank3_specs.txt', 'w', encoding='utf-8') as out:
    for q in qs:
        qid = q['id']
        title = q['title']
        desc = q.get('description', '').replace('\n', ' ')
        sin = q.get('sampleInput', '')
        sout = q.get('sampleOutput', '')
        tcs = q.get('testCases', [])
        out.write(f"=== {qid}: {title} ===\n")
        out.write(f"DESC: {desc[:200]}\n")
        out.write(f"SAMPLE_IN:\n{sin}\n")
        out.write(f"SAMPLE_OUT:\n{sout}\n")
        out.write(f"TEST_CASES_COUNT: {len(tcs)}\n")
        for i, tc in enumerate(tcs):
            out.write(f"  TC{i+1}_IN: {repr(tc.get('input'))}\n")
            out.write(f"  TC{i+1}_OUT: {repr(tc.get('expectedOutput'))}\n")
        out.write("\n")

print("Dumped specs to scripts/bank3_specs.txt")
