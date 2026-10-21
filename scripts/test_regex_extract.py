import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")

for idx, c in enumerate(chunks[1:6]):
    print(f"\n--- Question {idx+1} ---")
    
    # Clean up common artifacts
    text = c
    
    # 1. Extract Description: from "Problem Statement" to "Input Format"
    m_desc = re.search(r'Problem Statement(?::)?(.*?)(?:Input Format|$)', text, re.DOTALL | re.IGNORECASE)
    if m_desc:
        desc = m_desc.group(1).strip()
        # Remove student banner
        desc = re.sub(r'P K Pranav[^\n]*', '', desc)
        desc = re.sub(r'cbsc\.[^\n]*', '', desc)
        desc = re.sub(r'Amrita_[^\n]*', '', desc)
        desc = re.sub(r'\d+\s+Sections\s+\d+\s+Questions[^\n]*', '', desc)
        desc = re.sub(r'[•\d\s\+\:\/]+(?:Answered|Bookmarked|Skipped)[^\n]*', '', desc)
        desc = re.sub(r'\s+', ' ', desc).strip()
        print("DESC:", desc[:250])
    else:
        print("DESC NOT FOUND")

    # 2. Extract Input Format
    m_inp = re.search(r'Input Format(.*?)(?:Output Format|$)', text, re.DOTALL | re.IGNORECASE)
    if m_inp:
        inp = re.sub(r'\s+', ' ', m_inp.group(1)).strip()
        print("INPUT:", inp[:150])

    # 3. Extract Output Format
    m_out = re.search(r'Output Format(.*?)(?:Code Constraints|Constraints|Sample Test Cases|$)', text, re.DOTALL | re.IGNORECASE)
    if m_out:
        outp = re.sub(r'\s+', ' ', m_out.group(1)).strip()
        print("OUTPUT:", outp[:150])
        
    # 4. Extract Constraints
    m_con = re.search(r'(?:Code\s*)?Constraints(.*?)(?:Sample Test Cases|$)', text, re.DOTALL | re.IGNORECASE)
    if m_con:
        con = re.sub(r'\s+', ' ', m_con.group(1)).strip()
        print("CONSTRAINTS:", con[:150])

    # 5. Extract Sample Test Cases
    m_samples = re.findall(r'(?:case\s*([0-9IVX]+)|Sample Test Cases?)[^\n]*\s*Input\s*(.*?)\s*Output\s*(.*?)(?=(?:case\s*[0-9IVX]|Note|The program will be evaluated|$))', text, re.DOTALL | re.IGNORECASE)
    print("SAMPLES FOUND:", len(m_samples))
    for s in m_samples:
        print("  SAMPLE INPUT:", s[1].strip()[:50].replace('\n', ' '))
        print("  SAMPLE OUTPUT:", s[2].strip()[:50].replace('\n', ' '))
