import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

print(f"Total screenshots in questions: {len(q_data)}")

# Let's inspect each screenshot's key markers
for item in q_data:
    lines = item['lines']
    txt = item['text']
    
    # Try to find Question No or COD or Test ID or title
    q_header = None
    for line in lines[:10]:
        if "Question No" in line or "QUESTION" in line:
            q_header = line
            break
            
    # Try to find problem statement beginning
    ps = ""
    for i, line in enumerate(lines):
        if "problem Statement" in line.lower() or "problem statement" in line.lower():
            ps = " ".join(lines[i+1:i+4])
            break
            
    # check for test cases
    has_test = "Sample test cases" in txt or "Sample Test Cases" in txt or "Input 1" in txt or "Case 1" in txt
    # check for code editor
    has_code = "class " in txt or "public static void main" in txt or "import java" in txt
    
    print(f"{item['file']:<22} | Q: {str(q_header):<20} | HasTest: {str(has_test):<5} | HasCode: {str(has_code):<5} | PS: {ps[:50]}")
