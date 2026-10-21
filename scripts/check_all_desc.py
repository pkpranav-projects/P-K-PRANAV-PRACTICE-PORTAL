import json
import re

with open('scripts/all_56_raw_dump.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

chunks = raw.split("=======================================================\nQUESTION ")

def get_desc(chunk):
    # Search from Problem Statement to Input Format
    m = re.search(r'Problem Statement(?::)?(.*?)(?:Input Format|$)', chunk, re.DOTALL | re.IGNORECASE)
    if not m:
        return ""
    text = m.group(1)
    # clean banner
    text = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', text, flags=re.DOTALL)
    text = re.sub(r'P K Pranav[^\n]*', '', text)
    text = re.sub(r'cbsc\.[^\n]*', '', text)
    text = re.sub(r'Amrita_[^\n]*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

for i in range(1, 57):
    c = chunks[i]
    header = c.strip().split('\n')[0]
    desc = get_desc(c)
    first_sentence = desc.split('.')[0] if '.' in desc else desc[:80]
    print(f"[{i:02d}] {header[:40]}")
    print(f"     {first_sentence[:100]}")
