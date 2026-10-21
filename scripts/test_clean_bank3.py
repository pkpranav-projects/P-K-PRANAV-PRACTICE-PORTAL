import json
import re

with open('questions_bank3.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

def clean_desc(text):
    if not text:
        return ''
    t = text
    # remove leading Skipped badge e.g. 'Skipped 4 + 30 ', 'Skipped + 30 '
    t = re.sub(r'^Skipped\s*(?:\d+\s*\+?\s*\d*|\+\s*\d+)?\s*(?:-o\s*)?', '', t, flags=re.I)
    t = re.sub(r'Header\s*Snippet\s*\d*\s*import\s+[a-zA-Z0-9_\.\s\*]+\s*;?\s*(?:Java\s*\(\d+\)\s*)?', '', t, flags=re.I)
    t = re.sub(r'Footer\s*Snippet\s*[^\n]+', '', t, flags=re.I)
    t = re.sub(r'P\s*K\s*Pranav\s+CB\.SC\.[^\n]+', '', t, flags=re.I)
    t = re.sub(r'cbsc\.[^\n]+', '', t, flags=re.I)
    t = re.sub(r'Single File Programming Question\s*', '', t, flags=re.I)
    t = re.sub(r'Problem\s*Statern?ent:?\s*', '', t, flags=re.I)
    t = re.sub(r'White\s*List\s*\([^)]*\)\s*', '', t, flags=re.I)
    t = re.sub(r'The program will be evaluated[^\n]+', '', t, flags=re.I)
    t = re.sub(r'Marks\s*:\s*\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Negative\s*Marks\s*:\s*\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Summary\s*\d+/\d+\s*', '', t, flags=re.I)
    t = re.sub(r'Sections\s*\d+\s*Questions[^\n]*', '', t, flags=re.I)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

short_or_odd = []
for q in qs:
    cln = clean_desc(q['description'])
    if len(cln) < 120 or any(w in cln.lower() for w in ['skipped', 'cbsc', 'pranav', 'marks :']):
        short_or_odd.append((q['id'], q['title'], len(cln), cln))

print(f"Total flagged after cleaning: {len(short_or_odd)}")
for qid, title, length, text in short_or_odd:
    print(f"{qid}: {title} (len={length}) -> {text[:100]}")
