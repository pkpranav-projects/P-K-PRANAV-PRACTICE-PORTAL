import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")
print(f"Total raw chunks to process: {len(chunks)-1}")

def clean_ocr(text):
    text = text.replace('«', '<').replace('»', '>').replace('‘', "'").replace('’', "'")
    text = text.replace('“', '"').replace('”', '"').replace('•', '-')
    return text

questions = []

for c in chunks[1:]:
    lines = [clean_ocr(l.strip()) for l in c.split('\n') if l.strip()]
    first_line = lines[0] # e.g. "1: Q1 | Shots: Screenshot (295).png - Screenshot (297).png (3 shots)"
    
    # Extract index and shots
    idx_m = re.match(r'(\d+):\s*([Q0-9]+)\s*\|\s*Shots:\s*([^\(]+)', first_line)
    q_index = int(idx_m.group(1)) if idx_m else len(questions) + 1
    q_label = idx_m.group(2).strip() if idx_m else "Q?"
    shots_range = idx_m.group(3).strip() if idx_m else ""

    # Detect Session (Day X_COD, Day X_CY, Day X_PAH)
    session = ""
    for l in lines:
        m = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', l, re.IGNORECASE)
        if m:
            d_num = m.group(1).replace('I', '1').replace('O', '0')
            session = f"Day {d_num} {m.group(2).upper()}"
            break
        if 'Advance Prgramming' in l and not session:
            session = "Amrita 24CYS204"

    # Extract Problem Statement
    desc_lines = []
    in_desc = False
    in_input = False
    in_output = False
    in_constraints = False
    in_samples = False
    
    input_lines = []
    output_lines = []
    constraints = []
    samples = []
    
    # Also collect any code snippets
    code_lines = []
    
    for l in lines:
        ll = l.lower()
        if 'problem statement' in ll:
            in_desc = True
            in_input = in_output = in_constraints = in_samples = False
            continue
        if 'input format' in ll:
            in_desc = False
            in_input = True
            in_output = in_constraints = in_samples = False
            continue
        if 'output format' in ll:
            in_desc = in_input = False
            in_output = True
            in_constraints = in_samples = False
            continue
        if 'code constraints' in ll or 'constraints' in ll:
            in_desc = in_input = in_output = False
            in_constraints = True
            in_samples = False
            continue
        if 'sample test cases' in ll or 'sample input' in ll or 'sample output' in ll:
            in_desc = in_input = in_output = in_constraints = False
            in_samples = True
            continue
            
        # Ignore Examly student banner artifacts
        if any(bad in ll for bad in ['cb.students.amrita.edu', 'cb.sc.', 'u4cys', 'answered', 'bookmarked', 'skipped', 'summary 0/4', 'click "compile', 'not viewed', 'previous bookmark', 'the program will be evaluated', 'extra spaces and new line']):
            continue

        if in_desc:
            desc_lines.append(l)
        elif in_input:
            input_lines.append(l)
        elif in_output:
            output_lines.append(l)
        elif in_constraints:
            constraints.append(l)
        elif in_samples:
            samples.append(l)

    # Clean description
    desc_text = " ".join(desc_lines).strip()
    
    # Extract title from description or first sentence
    # Often starts with e.g. "Meera manages a small shop...", "Karan is building a shopping cart..."
    title = ""
    # Try finding character/story name
    first_sent = desc_text.split('.')[0] if '.' in desc_text else desc_text[:60]
    first_sent = re.sub(r'^[0-9\s\+\-\•]+', '', first_sent).strip()
    
    title_m = re.search(r'([A-Z][a-z]+)\s+(is developing|is building|manages|wants to|is a|maintains|is working on|needs to)', desc_text)
    if title_m:
        title = f"{title_m.group(1)}'s {title_m.group(2).replace('is ', '').title()} System"
    elif 'Implement' in desc_text:
        title = desc_text.split('.')[0].replace('Implement', 'Implementation of').strip()
    elif len(first_sent) > 5 and len(first_sent) < 70:
        title = first_sent
    else:
        title = f"{session} Question {q_label}"

    # Fallback title cleanup
    title = re.sub(r'^(P K Pranav|Amrita|COD|MCQ|QUESTION)\s*', '', title).strip()
    if not title or len(title) < 4:
        title = f"{session} Challenge {q_index}"

    questions.append({
        'index': q_index,
        'q_label': q_label,
        'session': session,
        'shots': shots_range,
        'title': title,
        'description': desc_text,
        'inputFormat': " ".join(input_lines).strip(),
        'outputFormat': " ".join(output_lines).strip(),
        'constraints': constraints,
        'samples': samples
    })

print(f"Extracted {len(questions)} structured questions.")
with open('scripts/extracted_q4_initial.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print("Saved to scripts/extracted_q4_initial.json")
