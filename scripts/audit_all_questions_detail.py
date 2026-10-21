import sqlite3
import re
import json
import os

db = sqlite3.connect('server/arena.db')
c = db.cursor()
rows = c.execute('SELECT id, bank, title, sourceScreenshot, description, inputFormat, outputFormat, sampleInput, sampleOutput, testCases FROM questions ORDER BY bank, id').fetchall()

ocr_garbage_words = [
    'skipped', 'header snippet', 'footer snippet', 'cbsc.u4cys', 'p k pranav',
    'answered', 'bookmarked', 'marks : 30', 'negative marks', 'single file programming question',
    'white list (allowed', 'the program will be evaluated', '0 01:39:', 'sections 4 questions',
    'question 1/4 code', 'question 2/4 code', 'question 3/4 code', 'question 4/4 code'
]

findings = []

for qid, bank, title, ss, desc, inp_fmt, out_fmt, sinp, sout, tcs_str in rows:
    issues = []
    
    # 1. OCR garbage in desc
    desc_lower = (desc or '').lower()
    for g in ocr_garbage_words:
        if g in desc_lower:
            issues.append(f'Desc contains OCR garbage: "{g}"')
            break
            
    # 2. Desc ending abruptly or short
    d_clean = (desc or '').strip()
    if len(d_clean) < 150:
        issues.append(f'Desc too short ({len(d_clean)} chars)')
    if any(d_clean.endswith(end) for end in [', a', '..', '...', '---', 'etc.', 'the', 'and', 'with', 'to', 'for', 'of', 'in', 'is', 'are']):
        issues.append(f'Desc cut off at end: "{d_clean[-40:]}"')
        
    # 3. Input format check
    inp_clean = (inp_fmt or '').strip()
    if not inp_clean or len(inp_clean) < 10 or inp_clean.lower() in ['n/a', 'none', 'input']:
        issues.append('Input format missing or empty')
    else:
        for g in ocr_garbage_words:
            if g in inp_clean.lower():
                issues.append(f'Input format contains OCR garbage: "{g}"')
                break
                
    # 4. Output format check
    out_clean = (out_fmt or '').strip()
    if not out_clean or len(out_clean) < 10 or out_clean.lower() in ['n/a', 'none', 'output']:
        issues.append('Output format missing or empty')
    else:
        for g in ocr_garbage_words:
            if g in out_clean.lower():
                issues.append(f'Output format contains OCR garbage: "{g}"')
                break
                
    # 5. Screenshot check
    if not ss or ss == 'Masterclass & Reference Source' or ss == 'Screenshot':
        issues.append(f'Missing screenshot ({ss})')
        
    # 6. Sample I/O check
    if sinp is None or sinp == '' or sout is None or sout == '':
        issues.append('Missing sample I/O')
        
    if issues:
        findings.append((bank, qid, title, issues))

print(f"Total questions with issues: {len(findings)} / {len(rows)}")
print("=" * 80)
for bank, qid, title, issues in findings:
    print(f"[{bank}] {qid}: {title}")
    for iss in issues:
        print(f"    - {iss}")
print("=" * 80)
