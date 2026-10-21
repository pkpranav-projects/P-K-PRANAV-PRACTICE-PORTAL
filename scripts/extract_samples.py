import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")

samples_dict = {}

for idx, c in enumerate(chunks[1:]):
    q_num = idx + 1
    # Find all sample inputs and outputs
    # Looking for lines starting with "case 1 Input" or "Sample Test Cases"
    lines = [l.strip() for l in c.split('\n') if l.strip()]
    
    tcs = []
    
    for i, line in enumerate(lines):
        if re.search(r'case\s*([0-9IVX]+)\s*(?:Input)?', line, re.IGNORECASE):
            # Try to grab input and output in subsequent lines
            block = " ".join(lines[i:min(i+15, len(lines))])
            m = re.search(r'Input\s+(.*?)\s+Output\s+(.*?)(?:case|Note|The program|Summary|$)', block, re.IGNORECASE)
            if m:
                inp = m.group(1).strip()
                out = m.group(2).strip()
                # Clean up artifacts
                inp = re.sub(r'Summary\s*0/4.*', '', inp)
                out = re.sub(r'The program will be evaluated.*', '', out)
                out = re.sub(r'Summary\s*0/4.*', '', out)
                if len(inp) > 0 and len(out) > 0:
                    tcs.append({'input': inp, 'output': out})

    samples_dict[q_num] = tcs

print(f"Extracted sample test cases for {len(samples_dict)} questions.")
for qn in range(1, 15):
    print(f"Q{qn}: {len(samples_dict[qn])} test cases found -> {samples_dict[qn]}")
