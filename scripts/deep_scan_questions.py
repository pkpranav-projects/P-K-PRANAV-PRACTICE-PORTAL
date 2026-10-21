import sqlite3
import json
import os
import re

db = sqlite3.connect('server/arena.db')
cur = db.cursor()
rows = cur.execute('SELECT id, title, topic, difficulty, bank, sourceScreenshot, description, inputFormat, outputFormat, sampleInput, sampleOutput, testCases FROM questions ORDER BY bank, id').fetchall()

screenshot_dirs = ['DBMS questions', 'questions', 'questions2cpp', 'questions4']
all_pngs = {}
for d in screenshot_dirs:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.lower().endswith('.png'):
                all_pngs[f.lower()] = os.path.join(d, f)

print(f"Total available PNGs across folders: {len(all_pngs)}")

report = {
    'missing_photo': [],
    'half_or_short_desc': [],
    'missing_input_format': [],
    'missing_output_format': [],
    'missing_sample_io': [],
    'bad_testcases': []
}

for r in rows:
    qid, title, topic, diff, bank, ss, desc, inp_fmt, out_fmt, s_inp, s_out, tc_json = r
    
    # 1. Photo verification
    has_valid_photo = False
    if ss and ss.strip() and ss != 'Masterclass & Reference Source' and ss != 'Screenshot':
        # check range or single
        matches = re.findall(r'Screenshot\s*\((\d+)\)\.png', ss, re.I)
        if matches:
            found_count = sum(1 for m in matches if f'screenshot ({m}).png' in all_pngs)
            if found_count > 0:
                has_valid_photo = True
        elif ss.lower() in all_pngs or f"{ss.lower()}.png" in all_pngs:
            has_valid_photo = True
    
    if not has_valid_photo:
        report['missing_photo'].append((bank, qid, title, ss or '(empty)'))
        
    # 2. Half or short description check
    d_clean = desc.strip() if desc else ''
    is_half = False
    if len(d_clean) < 180:
        is_half = True
    elif d_clean.endswith('...') or d_clean.endswith('---') or d_clean.endswith('etc.'):
        is_half = True
    elif any(d_clean.endswith(w) for w in ['the', 'and', 'with', 'to', 'for', 'of', 'in', 'is', 'a', 'an']):
        is_half = True
    # check if description has abrupt cutoffs or missing sentences
    if is_half:
        report['half_or_short_desc'].append((bank, qid, title, len(d_clean), d_clean[-60:] if len(d_clean) > 60 else d_clean))

    # 3. Input format check
    if not inp_fmt or not inp_fmt.strip() or len(inp_fmt.strip()) < 10 or inp_fmt.strip().lower() in ['n/a', 'none', 'input', 'standard']:
        report['missing_input_format'].append((bank, qid, title, inp_fmt or '(empty)'))

    # 4. Output format check
    if not out_fmt or not out_fmt.strip() or len(out_fmt.strip()) < 10 or out_fmt.strip().lower() in ['n/a', 'none', 'output', 'standard']:
        report['missing_output_format'].append((bank, qid, title, out_fmt or '(empty)'))

    # 5. Sample Input / Output check
    if s_inp is None or s_inp == '' or s_out is None or s_out == '':
        report['missing_sample_io'].append((bank, qid, title, f"in={repr(s_inp)}, out={repr(s_out)}"))

    # 6. Testcases check
    try:
        tcs = json.loads(tc_json) if tc_json else []
        if not tcs:
            report['bad_testcases'].append((bank, qid, title, 'No testcases'))
        else:
            for idx, tc in enumerate(tcs):
                if 'input' not in tc or 'expectedOutput' not in tc or tc['expectedOutput'] is None:
                    report['bad_testcases'].append((bank, qid, title, f'TC {idx+1} missing input/output'))
    except Exception as e:
        report['bad_testcases'].append((bank, qid, title, f'JSON error: {e}'))

print(f"\n=======================================================")
print(f"DEEP SCAN FINDINGS ACROSS ALL {len(rows)} QUESTIONS")
print(f"=======================================================")

print(f"\n1. Questions with Missing/Broken Photos: {len(report['missing_photo'])}")
for bank, qid, title, ss in report['missing_photo']:
    print(f"   [{bank}] {qid}: {title} | Screenshot: {ss}")

print(f"\n2. Half or Short Descriptions (<180 chars or abrupt ending): {len(report['half_or_short_desc'])}")
for bank, qid, title, length, end_snip in report['half_or_short_desc']:
    print(f"   [{bank}] {qid}: {title} | Len={length} | Ending: {repr(end_snip)}")

print(f"\n3. Missing/Incomplete Input Format: {len(report['missing_input_format'])}")
for bank, qid, title, fmt in report['missing_input_format']:
    print(f"   [{bank}] {qid}: {title} | InputFormat: {repr(fmt)}")

print(f"\n4. Missing/Incomplete Output Format: {len(report['missing_output_format'])}")
for bank, qid, title, fmt in report['missing_output_format']:
    print(f"   [{bank}] {qid}: {title} | OutputFormat: {repr(fmt)}")

print(f"\n5. Missing Sample Input/Output: {len(report['missing_sample_io'])}")
for bank, qid, title, info in report['missing_sample_io']:
    print(f"   [{bank}] {qid}: {title} | {info}")

print(f"\n6. Bad/Incomplete Test Cases: {len(report['bad_testcases'])}")
for bank, qid, title, err in report['bad_testcases']:
    print(f"   [{bank}] {qid}: {title} | {err}")
