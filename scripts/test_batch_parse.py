import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")

def clean_str(s):
    if not s:
        return ""
    # remove extra whitespace
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n+', '\n', s)
    return s.strip()

items = []

for idx, c in enumerate(chunks[1:]):
    # Split chunk into shots
    parts = re.split(r'---\s*Screenshot\s*\([^\)]+\)\.png\s*---', c)
    header = parts[0].strip()
    shot_texts = [p.strip() for p in parts[1:] if p.strip()]
    
    # Extract question number and file range
    # e.g. "1: Q1 | Shots: Screenshot (295).png - Screenshot (297).png (3 shots)"
    h_lines = header.split('\n')
    m_range = re.search(r'Shots:\s*([^\(]+)', h_lines[0])
    shot_range = m_range.group(1).strip() if m_range else ""
    
    # Identify session
    session = ""
    for st in shot_texts:
        m_s = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', st, re.IGNORECASE)
        if m_s:
            d = m_s.group(1).replace('I', '1').replace('O', '0')
            session = f"Day {d} {m_s.group(2).upper()}"
            break
    if not session:
        session = "Day 8 Practice"

    full_text = "\n".join(shot_texts)

    # Clean description: from "Problem Statement" to "Input Format"
    desc = ""
    m_desc = re.search(r'Problem Statement(?::)?(.*?)(?:Input Format|$)', full_text, re.DOTALL | re.IGNORECASE)
    if m_desc:
        raw_desc = m_desc.group(1)
        # Strip student chrome
        # Regex to remove through "Skipped" or "Bookmarked" + numbers
        clean_d = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', raw_desc, flags=re.DOTALL)
        clean_d = re.sub(r'^(?:P K Pranav|Amrita_|COD|MCQ|QUESTION)[^\n]*\n', '', clean_d)
        clean_d = clean_str(clean_d)
        desc = clean_d

    # Input format: from "Input Format" to "Output Format"
    input_fmt = ""
    m_inp = re.search(r'Input Format(.*?)(?:Output Format|$)', full_text, re.DOTALL | re.IGNORECASE)
    if m_inp:
        raw_inp = m_inp.group(1)
        clean_inp = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', raw_inp, flags=re.DOTALL)
        clean_inp = re.sub(r'Summary\s*0/4.*', '', clean_inp, flags=re.DOTALL)
        input_fmt = clean_str(clean_inp)

    # Output format: from "Output Format" to "Constraints" or "Sample Test Cases"
    output_fmt = ""
    m_out = re.search(r'Output Format(.*?)(?:Code Constraints|Constraints|Sample Test Cases|$)', full_text, re.DOTALL | re.IGNORECASE)
    if m_out:
        raw_out = m_out.group(1)
        clean_out = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', raw_out, flags=re.DOTALL)
        clean_out = re.sub(r'Summary\s*0/4.*', '', clean_out, flags=re.DOTALL)
        output_fmt = clean_str(clean_out)

    # Constraints: from "Constraints" to "Sample Test Cases"
    constraints = []
    m_con = re.search(r'(?:Code\s*)?Constraints(.*?)(?:Sample Test Cases|$)', full_text, re.DOTALL | re.IGNORECASE)
    if m_con:
        raw_con = m_con.group(1)
        clean_con = re.sub(r'Summary\s*0/4.*', '', raw_con, flags=re.DOTALL)
        for l in clean_con.split('\n'):
            l_s = clean_str(l)
            if l_s and not any(k in l_s.lower() for k in ['click', 'compile', 'sample test', 'previous', 'bookmark']):
                constraints.append(l_s)

    items.append({
        'index': idx + 1,
        'session': session,
        'shot_range': shot_range,
        'desc': desc,
        'input_fmt': input_fmt,
        'output_fmt': output_fmt,
        'constraints': constraints
    })

print(f"Processed {len(items)} items.")
for i in items[:10]:
    print(f"[{i['index']:02d}] {i['session']}: {i['desc'][:90]}...")
    print(f"     INP: {i['input_fmt'][:60]}...")
    print(f"     OUT: {i['output_fmt'][:60]}...")
    print(f"     CON: {i['constraints']}")
    print()
