import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_data.sort(key=lambda x: get_num(x['file']))

# Let's inspect all occurrences of "Problem Statement" or "Question"
findings = []
for item in q_data:
    txt = item['text']
    fname = item['file']
    
    # Clean text
    clean_txt = re.sub(r'\s+', ' ', txt)
    
    # Find test ID
    m_test = re.search(r'testId=([^& \n\r]+)', clean_txt)
    tid = m_test.group(1)[:12] if m_test else ""
    
    # Look for Problem Statement
    for m in re.finditer(r'Problem Statement\s*([^.]*\.)', clean_txt, re.IGNORECASE):
        findings.append({
            'file': fname,
            'tid': tid,
            'statement': m.group(1).strip()[:100]
        })
    
    # Also look for "01 Single File", "02 Single File", etc.
    for m in re.finditer(r'(0\d|\d+)\s+Single File Programming[^\n\r]*', clean_txt):
        findings.append({
            'file': fname,
            'tid': tid,
            'statement': "HEADER: " + m.group(0)[:80]
        })

print(f"Total findings: {len(findings)}")
for f in findings:
    print(f"[{f['file']}] {f['tid']} -> {f['statement']}")
