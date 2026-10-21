import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

# Group into question segments
# A question starts when we see QUESTION X/4 CODE or Problem Statement after previous question
questions = []
current_q = None

for it in items:
    text = it['text']
    lines = [l.strip() for l in it['lines'] if l.strip()]
    first_block = " ".join(lines[:6]).lower()
    
    q_match = re.search(r'question\s*(\d)/(\d)\s*code', first_block)
    prob_stmt = 'problem statement' in first_block
    
    # If this is a question start
    if q_match or (prob_stmt and any(k in first_block for k in ['cod (4)', 'cod(4)', 'mcq (4)', 'mcq(4)', 'code'])):
        if current_q:
            questions.append(current_q)
        q_num = q_match.group(1) if q_match else "?"
        current_q = {
            'q_num': q_num,
            'start_file': it['file'],
            'files': [it['file']],
            'all_lines': list(lines),
            'full_text': text
        }
    else:
        if current_q:
            current_q['files'].append(it['file'])
            current_q['all_lines'].extend(lines)
            current_q['full_text'] += "\n" + text
        else:
            current_q = {
                'q_num': "?",
                'start_file': it['file'],
                'files': [it['file']],
                'all_lines': list(lines),
                'full_text': text
            }

if current_q:
    questions.append(current_q)

print(f"Total question blocks identified: {len(questions)}")

# Now for each question block, let's extract:
# - Title / Story
# - Topic
# - Input / Output format
# - Constraints
# - Sample Input / Output
# - Test cases
# - Starter code or solution if visible
parsed_list = []
for idx, q in enumerate(questions):
    lines = q['all_lines']
    full = q['full_text']
    
    # Extract problem description (lines following Problem Statement up to Input Format)
    desc_lines = []
    in_desc = False
    in_input = False
    in_output = False
    in_constraints = False
    
    input_lines = []
    output_lines = []
    constraints_lines = []
    
    for l in lines:
        l_low = l.lower()
        if 'problem statement' in l_low:
            in_desc = True
            in_input = in_output = in_constraints = False
            continue
        if 'input format' in l_low:
            in_desc = False
            in_input = True
            in_output = in_constraints = False
            continue
        if 'output format' in l_low:
            in_desc = in_input = False
            in_output = True
            in_constraints = False
            continue
        if 'constraints' in l_low:
            in_desc = in_input = in_output = False
            in_constraints = True
            continue
        if any(k in l_low for k in ['sample input', 'sample output', 'refer to', 'test case', 'public class', '#include']):
            in_desc = in_input = in_output = in_constraints = False
            
        if in_desc:
            # Filter out examly chrome headers like student name, email, etc.
            if not any(k in l_low for k in ['cbsc.', 'u4cys', 'pranav', 'amrita.edu', 'time limit', 'maximum score', 'single file programming']):
                desc_lines.append(l)
        elif in_input:
            input_lines.append(l)
        elif in_output:
            output_lines.append(l)
        elif in_constraints:
            constraints_lines.append(l)

    # First meaningful description line
    first_desc = desc_lines[0] if desc_lines else (lines[5] if len(lines) > 5 else "")
    
    parsed_list.append({
        'index': idx + 1,
        'q_num': q['q_num'],
        'files': f"{q['files'][0]} - {q['files'][-1]}" if len(q['files']) > 1 else q['files'][0],
        'file_count': len(q['files']),
        'snippet': first_desc[:120],
        'desc_preview': " ".join(desc_lines[:3])[:200],
        'input_preview': " ".join(input_lines[:2])[:120],
        'constraints_preview': " ".join(constraints_lines[:2])[:120]
    })

with open('scripts/parsed_q4_overview.json', 'w', encoding='utf-8') as out:
    json.dump(parsed_list, out, indent=2)

print("Saved overview to scripts/parsed_q4_overview.json")
