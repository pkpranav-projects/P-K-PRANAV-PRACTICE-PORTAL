import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\P K PRANAV\Pictures\javapractice\client\src\assets\w3schools_sql_full_course.json', 'r', encoding='utf-8') as f:
    course = json.load(f)

for item in course:
    if item['category'].startswith('0.'):
        print(f"[{item['id']}] {item['title']}")
