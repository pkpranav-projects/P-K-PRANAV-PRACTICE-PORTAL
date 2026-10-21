import json
import re

with open('scripts/questions4_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

def get_num(fname):
    m = re.search(r'\d+', fname)
    return int(m.group(0)) if m else 999999

items = sorted(items, key=lambda x: get_num(x['file']))

# Let's extract the main problem story/text from each screenshot
entries = []
for it in items:
    text = it['text']
    lines = [l.strip() for l in it['lines'] if l.strip()]
    
    # Find question number from header like "QUESTION 1/4 CODE"
    q_hdr = ""
    for l in lines[:6]:
        m = re.search(r'QUESTION\s*(\d)/(\d)', l, re.IGNORECASE)
        if m:
            q_hdr = f"Q{m.group(1)}"
            break
            
    # Find problem statement sentence (often starts with a person's name or task: "Aman is...", "Write a program...", "Given...", "Design...")
    desc_start = ""
    in_desc = False
    for l in lines:
        if 'problem statement' in l.lower():
            in_desc = True
            continue
        if in_desc:
            if not any(k in l.lower() for k in ['single file', 'time limit', 'score', 'pranav', 'cbsc.', 'u4cys', 'amrita.edu', '8e118', '9ca6c']):
                if len(l) > 15:
                    desc_start = l
                    break

    entries.append({
        'file': it['file'],
        'q_hdr': q_hdr,
        'desc_start': desc_start,
        'full_text': text
    })

# Now let's group consecutive screenshots that have the same desc_start or where desc_start is empty (continuation screenshots)
grouped_questions = []
current_group = None

for e in entries:
    desc = e['desc_start']
    clean_desc = re.sub(r'[^a-zA-Z0-9]', '', desc.lower())[:30]
    curr_clean = re.sub(r'[^a-zA-Z0-9]', '', current_group['desc_start'].lower())[:30] if current_group else ""
    
    is_new = False
    if current_group is None:
        is_new = True
    elif e['q_hdr'] and current_group['q_hdr'] and e['q_hdr'] != current_group['q_hdr']:
        is_new = True
    elif clean_desc and curr_clean and clean_desc != curr_clean:
        is_new = True
        
    if is_new:
        if current_group:
            grouped_questions.append(current_group)
        current_group = {
            'q_hdr': e['q_hdr'],
            'desc_start': desc,
            'files': [e['file']],
            'all_texts': [e['full_text']]
        }
    else:
        current_group['files'].append(e['file'])
        current_group['all_texts'].append(e['full_text'])
        if not current_group['desc_start'] and desc:
            current_group['desc_start'] = desc
        if not current_group['q_hdr'] and e['q_hdr']:
            current_group['q_hdr'] = e['q_hdr']

if current_group:
    grouped_questions.append(current_group)

print(f"Total grouped questions found: {len(grouped_questions)}")

for idx, g in enumerate(grouped_questions):
    f_range = f"{g['files'][0]} - {g['files'][-1]}" if len(g['files']) > 1 else g['files'][0]
    print(f"[{idx+1}] {g['q_hdr']} ({f_range}, {len(g['files'])} shots): {g['desc_start'][:80]}")
