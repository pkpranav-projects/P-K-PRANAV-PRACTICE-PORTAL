import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/screenshots_ocr.json", "r", encoding="utf-8-sig") as f:
    s_data = json.load(f)

print("Screenshots with 24CYS204 / Advance Programming:")
for item in s_data:
    txt = item['text']
    if "24CYS204" in txt or "Advance" in txt or "Java" in txt:
        # Check if it is Java programming question
        has_java = "Java" in txt or "class " in txt or "public static void main" in txt
        print(f"  {item['file']:<25} | Java: {has_java} | Snippet: {txt[:80].replace(chr(10), ' ')}")
