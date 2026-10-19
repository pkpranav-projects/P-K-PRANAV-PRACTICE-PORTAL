import json
import re

# Load raw OCR data
with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_dict = {get_num(x['file']): x for x in q_data}

# Function to get combined text for a range of screenshot numbers
def get_combined_text(start, end):
    parts = []
    for n in range(start, end + 1):
        if n in q_dict:
            parts.append(f"\n--- SCREENSHOT ({n}) ---\n" + q_dict[n]['text'])
    return "\n".join(parts)

# Let's inspect Group 1 questions one by one
print("Ready to extract questions.")
