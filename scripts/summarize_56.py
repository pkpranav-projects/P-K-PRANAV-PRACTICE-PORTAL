import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into questions
chunks = content.split("=======================================================\nQUESTION ")
print(f"Total question sections: {len(chunks)-1}")

questions_summary = []

for c in chunks[1:]:
    lines = [l.strip() for l in c.split('\n') if l.strip()]
    header = lines[0] # e.g. "1: Q1 | Shots: Screenshot (295).png - Screenshot (297).png (3 shots)"
    
    # Extract session
    session = ""
    for l in lines:
        m = re.search(r'Day\s*([0-9IO]+)_([A-Za-z]+)', l, re.IGNORECASE)
        if m:
            session = f"Day {m.group(1).replace('I', '1').replace('O', '0')}_{m.group(2).upper()}"
            break
            
    # Extract problem text
    problem_text = ""
    for idx, l in enumerate(lines):
        if 'problem statement' in l.lower():
            # grab the following text
            collected = []
            for sub in lines[idx+1:idx+15]:
                if any(k in sub.lower() for k in ['input format', 'output format', 'constraints', 'sample test']):
                    break
                if not any(k in sub.lower() for k in ['cbsc.', 'u4cys', 'pranav', 'amrita.edu', 'time limit', 'maximum score', 'single file programming', 'sections', 'questions', 'answered', 'bookmarked', 'skipped', '8e118', '9ca6c', 'e8220']):
                    collected.append(sub)
            problem_text = " ".join(collected)
            if problem_text:
                break
                
    # If problem_text still empty, search for main story
    if not problem_text:
        for l in lines:
            if any(name in l for name in ['is developing', 'manages', 'is building', 'is a', 'wants to', 'needs to', 'Implement', 'Given', 'Write a']):
                if not any(k in l.lower() for k in ['sections', 'questions', 'cbsc']):
                    problem_text = l
                    break

    # Determine topic from problem text
    pt_low = problem_text.lower()
    c_low = c.lower()
    topic = "Algorithms"
    if 'thread' in c_low or 'runnable' in c_low or 'synchroniz' in c_low:
        topic = "Multithreading"
    elif 'stack' in c_low:
        topic = "Stacks"
    elif 'queue' in c_low or 'deque' in c_low:
        topic = "Queues & Deque"
    elif 'vector' in c_low:
        topic = "Vector & Collections"
    elif 'comparator' in c_low:
        topic = "Comparator"
    elif 'comparable' in c_low:
        topic = "Comparable"
    elif 'iterator' in c_low or 'iterable' in c_low:
        topic = "Iterators & Iterable"
    elif 'map' in c_low or 'hashmap' in c_low or 'treemap' in c_low:
        topic = "HashMaps & Sets"
    elif 'file' in c_low or 'filereader' in c_low or 'filewriter' in c_low:
        topic = "File Handling"
    elif 'generic' in c_low:
        topic = "Generics"
    elif 'string' in c_low:
        topic = "Strings"
    elif 'array' in c_low:
        topic = "Arrays"

    questions_summary.append({
        'header': header,
        'session': session,
        'topic': topic,
        'snippet': problem_text[:120]
    })

print(f"{'Idx':<4} | {'Session':<12} | {'Topic':<22} | {'Story Snippet'}")
print("-" * 80)
for idx, q in enumerate(questions_summary):
    print(f"{idx+1:<4} | {q['session']:<12} | {q['topic']:<22} | {q['snippet']}")
