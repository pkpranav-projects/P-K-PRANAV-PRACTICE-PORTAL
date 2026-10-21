import json

def enrich_bank(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        qs = json.load(f)
        
    updated = 0
    for q in qs:
        desc = q.get('description', '').strip()
        if '### Input Format' in desc:
            continue
            
        inp_f = q.get('inputFormat', '').strip()
        out_f = q.get('outputFormat', '').strip()
        constraints = q.get('constraints', [])
        s_inp = q.get('sampleInput', '')
        s_out = q.get('sampleOutput', '')
        
        parts = [desc]
        if inp_f:
            parts.append(f"\n\n### Input Format\n{inp_f}")
        if out_f:
            parts.append(f"\n\n### Output Format\n{out_f}")
        if constraints:
            c_lines = "\n".join(f"- {c}" for c in constraints)
            parts.append(f"\n\n### Constraints\n{c_lines}")
        if s_inp or s_out:
            parts.append(f"\n\n### Sample Input\n```\n{s_inp}\n```\n\n### Sample Output\n```\n{s_out}\n```")
            
        q['description'] = "".join(parts)
        updated += 1
        
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(qs, f, indent=2)
        
    print(f"Enriched {updated} questions in {file_path}")

enrich_bank('questions.json')
enrich_bank('questions_dbms.json')
