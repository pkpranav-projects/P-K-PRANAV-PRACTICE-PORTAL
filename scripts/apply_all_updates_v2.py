import json
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

from build_sec_ddl import build_sec_ddl
from build_sec_dml import build_sec_dml
from build_sec_queries import build_sec_queries
from build_sec_agg import build_sec_agg
from build_sec_joins import build_sec_joins
from build_sec_constraints import build_sec_constraints
from build_sec_nested import build_sec_nested
from build_sec_norm import build_sec_norm
from build_sec_objects import build_sec_objects
from build_sec_tcl import build_sec_tcl
from build_sec_plsql import build_sec_plsql
from build_full_masterclass import build_masterclass_content

course_file = 'client/src/assets/w3schools_sql_full_course.json'
with open(course_file, 'r', encoding='utf-8') as f:
    course_data = json.load(f)

print(f"Loaded {len(course_data)} course topics.")

section_map = {
    'sec_ddl': build_sec_ddl(),
    'sec_dml': build_sec_dml(),
    'sec_queries': build_sec_queries(),
    'sec_agg': build_sec_agg(),
    'sec_joins': build_sec_joins(),
    'sec_constraints': build_sec_constraints(),
    'sec_nested': build_sec_nested(),
    'sec_norm': build_sec_norm(),
    'sec_objects': build_sec_objects(),
    'sec_tcl': build_sec_tcl(),
    'sec_plsql': build_sec_plsql(),
}

mc_content = build_masterclass_content()

updated_sections = 0
for item in course_data:
    item_id = item.get('id')
    if item_id in section_map:
        item['rawHtml'] = section_map[item_id]
        updated_sections += 1
    elif item_id == 'mysql_full_masterclass':
        item['rawHtml'] = mc_content
        updated_sections += 1

print(f"Updated {updated_sections} sections in course JSON.")

with open(course_file, 'w', encoding='utf-8') as f:
    json.dump(course_data, f, ensure_ascii=False, indent=2)

print("Saved client/src/assets/w3schools_sql_full_course.json successfully.")

# Common OLED CSS for command cards to inject into both HTML files
extra_css = """
/* Granular Command Card & Output Styles */
*, *::before, *::after { user-select: text !important; -webkit-user-select: text !important; }
.command-card {
  background: #04060a !important;
  border: 1px solid #1a2233 !important;
  border-left: 3px solid #38bdf8 !important;
  border-radius: 0.65rem !important;
  padding: 1.25rem 1.4rem !important;
  margin: 1.35rem 0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
  transition: border-color 0.15s ease;
}
.command-card:hover {
  border-color: #2b3952 !important;
  border-left-color: #60a5fa !important;
}
.command-card.card-success { border-left-color: #10b981 !important; }
.command-card.card-amber { border-left-color: #f59e0b !important; }
.cmd-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}
.cmd-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.cmd-badge.badge-success {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.25);
}
.cmd-badge.badge-amber {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.25);
}
.cmd-title {
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: #f8fafc !important;
  margin: 0 !important;
  line-height: 1.35 !important;
}
.cmd-desc {
  font-size: 0.92rem !important;
  color: #94a3b8 !important;
  line-height: 1.6 !important;
  margin: 0.4rem 0 0.85rem 0 !important;
}
.cmd-desc b { color: #e2e8f0 !important; }
.output-wrap {
  margin-top: 0.9rem;
  background: #020305;
  border: 1px solid #141b27;
  border-radius: 0.5rem;
  padding: 0.75rem 0.9rem;
  overflow-x: auto;
}
.output-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #10b981;
  margin-bottom: 0.55rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
table.output-table {
  width: 100% !important;
  border-collapse: collapse !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 0.82rem !important;
  background: #000000 !important;
  border: 1px solid #1a2333 !important;
  margin: 0 !important;
}
table.output-table th {
  background: #090e18 !important;
  color: #38bdf8 !important;
  font-weight: 700 !important;
  padding: 0.45rem 0.75rem !important;
  border: 1px solid #1a2333 !important;
  text-align: left !important;
  white-space: nowrap !important;
}
table.output-table td {
  padding: 0.42rem 0.75rem !important;
  border: 1px solid #141b27 !important;
  color: #cbd5e1 !important;
  white-space: nowrap !important;
  background: transparent !important;
}
table.output-table tr:nth-child(even) td { background: rgba(255, 255, 255, 0.015) !important; }
table.output-table tr:hover td { background: rgba(56, 189, 248, 0.06) !important; color: #ffffff !important; }
"""

# Update SQL_Lab_Exam_Handbook.html
handbook_path = r'c:\Users\P K PRANAV\Downloads\SQL_Lab_Exam_Handbook.html'
if os.path.exists(handbook_path):
    with open(handbook_path, 'r', encoding='utf-8') as f:
        hb_text = f.read()
    
    if '</style>' in hb_text and extra_css not in hb_text:
        hb_text = hb_text.replace('</style>', extra_css + '\n</style>')
        
    for sec_id, content in section_map.items():
        hb_id = sec_id.replace('_', '-')
        pattern = re.compile(rf'(<section[^>]*id="{hb_id}"[^>]*>).*?(</section>)', re.DOTALL)
        if pattern.search(hb_text):
            hb_text = pattern.sub(rf'\1\n{content}\n\2', hb_text)
            print(f"Updated {hb_id} in SQL_Lab_Exam_Handbook.html")
        else:
            print(f"ERROR: {hb_id} still not found in handbook!")
            
    with open(handbook_path, 'w', encoding='utf-8') as f:
        f.write(hb_text)
    print("Updated SQL_Lab_Exam_Handbook.html successfully.")

# Update MySQL_Full_Masterclass.html
master_path = r'c:\Users\P K PRANAV\Downloads\MySQL_Full_Masterclass.html'
if os.path.exists(master_path):
    with open(master_path, 'r', encoding='utf-8') as f:
        m_text = f.read()
    
    if '</style>' in m_text and extra_css not in m_text:
        m_text = m_text.replace('</style>', extra_css + '\n</style>')
        
    pattern = re.compile(r'(<main[^>]*>).*?(</main>)', re.DOTALL)
    if pattern.search(m_text):
        m_text = pattern.sub(rf'\1\n{mc_content}\n\2', m_text)
        print("Updated <main> in MySQL_Full_Masterclass.html")
    else:
        print("ERROR: <main> not found in masterclass html!")
        
    with open(master_path, 'w', encoding='utf-8') as f:
        f.write(m_text)
    print("Updated MySQL_Full_Masterclass.html successfully.")
