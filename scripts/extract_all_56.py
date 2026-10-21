import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

# Let's inspect the 56 questions and extract clean details
from dedup_and_group import grouped_questions

print(f"Inspecting {len(grouped_questions)} questions...")

results = []
for idx, g in enumerate(grouped_questions):
    full_text = "\n".join(g['all_texts'])
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    # Session header (e.g., Day 8_COD)
    session = ""
    for l in lines:
        m = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', l, re.IGNORECASE)
        if m:
            session = f"Day {m.group(1).replace('I', '1').replace('O', '0')}_{m.group(2).upper()}"
            break
        m2 = re.search(r'Advance\s*Prgramming[^\n]*', l, re.IGNORECASE)
        if m2 and not session:
            session = m2.group(0)

    # Problem statement text
    desc = []
    in_desc = False
    in_input = False
    in_output = False
    in_sample = False
    
    input_fmt = []
    output_fmt = []
    sample_io = []
    
    for l in lines:
        ll = l.lower()
        if 'problem statement' in ll:
            in_desc = True
            in_input = in_output = in_sample = False
            continue
        if 'input format' in ll:
            in_desc = False
            in_input = True
            in_output = in_sample = False
            continue
        if 'output format' in ll:
            in_desc = in_input = False
            in_output = True
            in_sample = False
            continue
        if 'sample input' in ll or 'sample output' in ll:
            in_desc = in_input = in_output = False
            in_sample = True
            sample_io.append(l)
            continue
        if 'constraints' in ll or 'single file' in ll or 'public class' in ll:
            in_desc = in_input = in_output = in_sample = False
            
        if in_desc:
            if not any(k in ll for k in ['cbsc.', 'u4cys', 'pranav', 'amrita.edu', 'time limit', 'maximum score', 'single file programming', '8e118', '9ca6c']):
                desc.append(l)
        elif in_input:
            input_fmt.append(l)
        elif in_output:
            output_fmt.append(l)
        elif in_sample:
            sample_io.append(l)

    results.append({
        'index': idx + 1,
        'q_num': g['q_hdr'],
        'session': session,
        'files': f"{g['files'][0]} - {g['files'][-1]}" if len(g['files']) > 1 else g['files'][0],
        'shot_count': len(g['files']),
        'desc': " ".join(desc[:6]),
        'input_fmt': " ".join(input_fmt[:3]),
        'output_fmt': " ".join(output_fmt[:3]),
        'sample_io': " | ".join(sample_io[:4])
    })

with open('scripts/all_56_questions.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Saved all 56 questions analysis to scripts/all_56_questions.json")
