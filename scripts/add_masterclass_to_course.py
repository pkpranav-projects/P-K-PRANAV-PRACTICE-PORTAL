import json
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

# Read generated masterclass HTML body content
with open(r'c:\Users\P K PRANAV\Downloads\MySQL_Full_Masterclass.html', 'r', encoding='utf-8') as f:
    masterclass_soup = BeautifulSoup(f.read(), 'html.parser')

main_content = masterclass_soup.find('main')
main_html = ''.join(str(c) for c in main_content.children)

course_path = r'c:\Users\P K PRANAV\Pictures\javapractice\client\src\assets\w3schools_sql_full_course.json'
with open(course_path, 'r', encoding='utf-8') as f:
    course = json.load(f)

# Check if already present
course = [item for item in course if item['id'] != 'mysql_full_masterclass']

masterclass_item = {
    'id': 'mysql_full_masterclass',
    'jumpId': 'sec-mysql-masterclass',
    'title': '🐬 MySQL Full Masterclass (Complete 6 Phases & Mastery Test)',
    'navText': '🚀 MySQL Masterclass',
    'category': '0. 🎓 Lab Exam & Viva Topics',
    'summary': 'The complete 6-phase MySQL roadmap from fundamentals (DDL, DML, DQL) to advanced database design (ACID, Normalization, Joins, Triggers, Procedures, and 8-question Mastery Test).',
    'examples': [
        {
            'heading': 'Test College Database Schema',
            'code': "CREATE TABLE Student (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(50) NOT NULL,\n    age INT,\n    department VARCHAR(30),\n    marks DECIMAL(5,2)\n);\n\nINSERT INTO Student (name, age, department, marks) VALUES\n('Arun', 19, 'CYS', 85.50),\n('Priya', 20, 'CSE', 92.00),\n('Rahul', 19, 'CYS', 76.00);\n\nSELECT department, AVG(marks) FROM Student GROUP BY department;"
        }
    ],
    'rawHtml': main_html,
    'order': 0
}

# Prepend masterclass item to course
updated_course = [masterclass_item] + course

# Re-index order
for i, item in enumerate(updated_course):
    item['order'] = i

print(f"Total topics in course: {len(updated_course)}")

with open(course_path, 'w', encoding='utf-8') as f:
    json.dump(updated_course, f, indent=2, ensure_ascii=False)

print("Added MySQL Masterclass to course JSON successfully!")
