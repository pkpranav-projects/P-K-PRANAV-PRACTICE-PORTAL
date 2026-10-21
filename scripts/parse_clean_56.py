import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")
print(f"Total raw chunks to process: {len(chunks)-1}")

def extract_section_text(shot_texts, start_pattern, stop_patterns):
    """Find text between start_pattern and any stop_patterns across shots"""
    combined = "\n".join(shot_texts)
    lines = [l.strip() for l in combined.split('\n') if l.strip()]
    
    capturing = False
    captured = []
    
    for l in lines:
        if re.search(start_pattern, l, re.IGNORECASE):
            capturing = True
            continue
        if capturing:
            if any(re.search(p, l, re.IGNORECASE) for p in stop_patterns):
                break
            # Skip Examly portal chrome text
            if any(k in l.lower() for k in ['cb.students.amrita.edu', 'cb.sc.', 'u4cys', 'answered', 'bookmarked', 'skipped', 'sections', 'questions', 'time limit', 'maximum score', 'single file programming']):
                continue
            captured.append(l)
            
    return " ".join(captured).strip()

def parse_test_cases(combined_text):
    """Extract sample test cases from combined text of screenshots"""
    test_cases = []
    # Look for Case 1 / Case 2 / Sample Test Cases
    # Pattern: Case 1 / Case I / case 1 Input ... Output ...
    pattern = re.compile(r'(?:Case\s*([0-9IVX]+)|Sample Test Cases?)[^\n]*\n+Input\s*([^\n]+(?:\n[^\n]+)*?)\n+Output\s*([^\n]+(?:\n[^\n]+)*?)(?=(?:Case\s*[0-9IVX]|Note|The program will be evaluated|$))', re.IGNORECASE)
    
    # Simpler regex approach: find Input and Output blocks
    lines = combined_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if re.search(r'case\s*[0-9IVX]+\s*input|sample\s*input', line, re.IGNORECASE) or (line.lower() == 'input' and i > 0 and 'case' in lines[i-1].lower()):
            # Collect input
            input_val = []
            if 'input' in line.lower() and len(line.split('nput')) > 1 and line.split('nput')[1].strip():
                input_val.append(line.split('nput')[1].strip())
            i += 1
            while i < len(lines) and not re.search(r'output|case\s*[0-9IVX]|note', lines[i], re.IGNORECASE):
                if lines[i].strip():
                    input_val.append(lines[i].strip())
                i += 1
                
            # Now look for output
            output_val = []
            if i < len(lines) and re.search(r'output', lines[i], re.IGNORECASE):
                if len(lines[i].split('utput')) > 1 and lines[i].split('utput')[1].strip():
                    output_val.append(lines[i].split('utput')[1].strip())
                i += 1
                while i < len(lines) and not re.search(r'case\s*[0-9IVX]|input|note|the program will be evaluated', lines[i], re.IGNORECASE):
                    if lines[i].strip():
                        output_val.append(lines[i].strip())
                    i += 1
            
            inp_str = "\n".join(input_val).strip()
            out_str = "\n".join(output_val).strip()
            if inp_str and out_str:
                test_cases.append({
                    'input': inp_str,
                    'expectedOutput': out_str,
                    'isHidden': False
                })
        else:
            i += 1
            
    return test_cases

cleaned_questions = []

for idx, c in enumerate(chunks[1:]):
    # Split chunk by screenshot header
    shot_blocks = re.split(r'---\s*Screenshot\s*\([^\)]+\)\.png\s*---', c)
    header_part = shot_blocks[0]
    shots_data = [s.strip() for s in shot_blocks[1:] if s.strip()]
    
    first_line = header_part.strip().split('\n')[0]
    m_head = re.search(r'(\d+):\s*([Q0-9]+)\s*\|\s*Shots:\s*([^\(]+)', first_line)
    q_num = int(m_head.group(1)) if m_head else idx + 1
    q_label = m_head.group(2).strip() if m_head else f"Q{(idx % 4) + 1}"
    shot_files = m_head.group(3).strip() if m_head else ""
    
    full_chunk_text = "\n".join(shots_data)
    
    # Detect session
    session_m = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', full_chunk_text, re.IGNORECASE)
    if session_m:
        d = session_m.group(1).replace('I', '1').replace('O', '0')
        session_name = f"Day {d} {session_m.group(2).upper()}"
    else:
        session_name = "Day 8 Practice"
        
    desc = extract_section_text(shots_data, r'Problem Statement', [r'Input Format', r'Output Format', r'Sample', r'Constraints'])
    input_fmt = extract_section_text(shots_data, r'Input Format', [r'Output Format', r'Sample', r'Constraints'])
    output_fmt = extract_section_text(shots_data, r'Output Format', [r'Code Constraints', r'Constraints', r'Sample'])
    constraints_txt = extract_section_text(shots_data, r'(?:Code\s*)?Constraints', [r'Sample', r'Output Format', r'Note'])
    
    tcs = parse_test_cases(full_chunk_text)
    
    # Extract Title
    title = ""
    # Look for name + is / wants
    m_name = re.search(r'([A-Z][a-z]+)\s+(?:is|manages|wants|needs|maintains|develops|builds)\s+([^.]+)', desc)
    if m_name:
        subj = m_name.group(2).strip().split(' to ')[0].split(' that ')[0].split(' who ')[0]
        title = f"{m_name.group(1)}'s {subj.title()}"
    elif 'implement' in desc.lower():
        m_imp = re.search(r'implement\s+([^.]+)', desc, re.IGNORECASE)
        if m_imp:
            title = f"Implementation of {m_imp.group(1).title()}"
            
    if not title or len(title) > 60 or len(title) < 5:
        # Fallback to first line or session + Q
        first_clause = desc.split('.')[0] if '.' in desc else desc[:50]
        if len(first_clause) > 5 and len(first_clause) < 50:
            title = first_clause
        else:
            title = f"{session_name} - Problem {q_label}"

    cleaned_questions.append({
        'index': q_num,
        'label': q_label,
        'session': session_name,
        'shots': shot_files,
        'title': title,
        'description': desc,
        'inputFormat': input_fmt,
        'outputFormat': output_fmt,
        'constraints': [c.strip() for c in constraints_txt.split('\n') if c.strip()] if constraints_txt else [],
        'testCases': tcs
    })

print(f"Parsed {len(cleaned_questions)} questions successfully.")
with open('scripts/cleaned_56_overview.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_questions, f, indent=2)

print("Saved to scripts/cleaned_56_overview.json")
