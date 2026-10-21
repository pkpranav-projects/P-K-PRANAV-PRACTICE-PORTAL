import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")
print(f"Total question chunks: {len(chunks)-1}")

def clean(s):
    if not s:
        return ""
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n+', '\n', s)
    return s.strip()

def strip_chrome(text):
    # Strip Examly portal student banner
    t = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', text, flags=re.DOTALL)
    t = re.sub(r'^(?:P K Pranav|Amrita_|COD|MCQ|QUESTION)[^\n]*\n', '', t)
    t = re.sub(r'cbsc\.[^\n]*', '', t)
    t = re.sub(r'Summary\s*0/4.*', '', t, flags=re.DOTALL)
    t = re.sub(r'Click\s*"Compile.*', '', t, flags=re.DOTALL)
    t = re.sub(r'The program will be evaluated only after.*', '', t, flags=re.DOTALL)
    t = re.sub(r'Extra spaces and new line characters.*', '', t, flags=re.DOTALL)
    return clean(t)

dataset = []

for idx, c in enumerate(chunks[1:]):
    q_num = idx + 1
    
    # Extract file header
    header_line = c.strip().split('\n')[0]
    m_head = re.search(r'Q(\d+)\s*\|\s*Shots:\s*([^\(]+)', header_line)
    q_sub_num = m_head.group(1) if m_head else f"{(idx % 4) + 1}"
    shot_files = m_head.group(2).strip() if m_head else ""
    
    # Detect session
    m_sess = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', c, re.IGNORECASE)
    if m_sess:
        d = m_sess.group(1).replace('I', '1').replace('O', '0')
        session_code = f"Day {d} {m_sess.group(2).upper()}"
    else:
        session_code = "Day 8 Practice"

    # Description
    desc = ""
    m_desc = re.search(r'Problem Statement(?::)?(.*?)(?:Input Format|$)', c, re.DOTALL | re.IGNORECASE)
    if m_desc:
        desc = strip_chrome(m_desc.group(1))

    # Input format
    input_fmt = ""
    m_inp = re.search(r'Input Format(.*?)(?:Output Format|$)', c, re.DOTALL | re.IGNORECASE)
    if m_inp:
        input_fmt = strip_chrome(m_inp.group(1))

    # Output format
    output_fmt = ""
    m_out = re.search(r'Output Format(.*?)(?:Code Constraints|Constraints|Sample Test Cases|$)', c, re.DOTALL | re.IGNORECASE)
    if m_out:
        output_fmt = strip_chrome(m_out.group(1))

    # Constraints
    con_list = []
    m_con = re.search(r'(?:Code\s*)?Constraints(.*?)(?:Sample Test Cases|$)', c, re.DOTALL | re.IGNORECASE)
    if m_con:
        raw_con = strip_chrome(m_con.group(1))
        for line in raw_con.split('\n'):
            line = clean(line)
            if line and not any(k in line.lower() for k in ['sample', 'note', 'summary', 'previous', 'compile']):
                con_list.append(line)

    # Topic & Recommended Language based on session and content
    low_c = c.lower()
    topic = "Algorithms"
    rec_lang = "Java"
    diff = "Easy" if (idx % 4 == 0) else ("Medium" if (idx % 4 in [1, 2]) else "Hard")

    if 'day 8' in session_code.lower():
        if 'comparator' in low_c:
            topic = "Comparator"
            rec_lang = "Java"
        elif 'comparable' in low_c:
            topic = "Comparable"
            rec_lang = "Java"
        elif 'iterator' in low_c or 'iterable' in low_c:
            topic = "Iterators & Iterable"
            rec_lang = "Java"
        else:
            topic = "Vector & Collections"
            rec_lang = "C++" if idx % 2 == 0 else "Java"
    elif 'day 9' in session_code.lower():
        if 'comparable' in low_c or 'sort' in low_c:
            topic = "String Sorting & Comparable"
            rec_lang = "Python"
        else:
            topic = "Strings"
            rec_lang = "Python" if idx % 2 == 1 else "Java"
    elif 'day 10' in session_code.lower():
        if 'deque' in low_c or 'queue' in low_c:
            topic = "Queues & Deque"
            rec_lang = "C++"
        else:
            topic = "Stacks"
            rec_lang = "Java" if idx % 2 == 0 else "C++"
    elif 'day 11' in session_code.lower():
        if 'generic' in low_c:
            topic = "Generics"
            rec_lang = "Java"
        else:
            topic = "HashMaps & Sets"
            rec_lang = "Python" if idx % 2 == 0 else "Java"
    elif 'day 12' in session_code.lower():
        topic = "Multithreading & Concurrency"
        rec_lang = "Java"
        diff = "Medium" if idx % 2 == 0 else "Hard"

    # Title extraction
    title = ""
    m_name = re.search(r'([A-Z][a-z]+)\s+(?:is developing|is building|manages|wants to|is a|maintains|develops|needs to)\s+([^.]+)', desc)
    if m_name:
        subj = m_name.group(2).strip().split(' so ')[0].split(' that ')[0].split(' who ')[0].split(' to ')[0]
        title = f"{m_name.group(1)}'s {subj.title()}"
    elif 'implement' in desc.lower():
        m_imp = re.search(r'implement(?:ing)?\s+([^.]+)', desc, re.IGNORECASE)
        if m_imp:
            title = f"Implementation of {m_imp.group(1).title()}"
            
    if not title or len(title) > 65 or len(title) < 5:
        first_clause = desc.split('.')[0] if '.' in desc else desc[:50]
        first_clause = re.sub(r'^(P K Pranav|Amrita_|COD|MCQ|QUESTION)\s*', '', first_clause).strip()
        if len(first_clause) > 5 and len(first_clause) < 55:
            title = first_clause
        else:
            title = f"{session_code} - Challenge {q_sub_num}"

    dataset.append({
        'id': f"bank3-{q_num:03d}",
        'index': q_num,
        'title': title,
        'session': session_code,
        'shots': shot_files,
        'topic': topic,
        'difficulty': diff,
        'recommendedLanguage': rec_lang,
        'description': desc,
        'inputFormat': input_fmt,
        'outputFormat': output_fmt,
        'constraints': con_list
    })

print(f"Generated metadata for {len(dataset)} questions.")
with open('scripts/bank3_meta.json', 'w', encoding='utf-8') as f:
    json.dump(dataset, f, indent=2)

print("Saved to scripts/bank3_meta.json")
