import sqlite3
import re

def clean_description(desc: str) -> str:
    if not desc:
        return desc
    
    # Standalone horizontal rules: (e.g. "Mark Status: 'FAILED' . --- \n###")
    desc = re.sub(r'(?<![:|])\s+---\s*(?!\s*[:|])', '\n\n---\n\n', desc)
    
    # Ensure ### has newlines before it if preceded by text
    desc = re.sub(r'([^\n])\s*(###+\s+)', r'\1\n\n\2', desc)
    
    # Ensure #### Table has newlines before it
    desc = re.sub(r'([^\n])\s*(####+\s+)', r'\1\n\n\2', desc)
    
    # Numbered points: "1. **" or "2. **" or "1. Prevent"
    desc = re.sub(r'([.:;])\s*(\d+\.\s+\*\*)', r'\1\n\n\2', desc)
    desc = re.sub(r'([.:;])\s*(\d+\.\s+[A-Z])', r'\1\n\n\2', desc)
    
    # Fix "3.\n\n**Fraud Flagging**:" or "3.\n**Fraud"
    desc = re.sub(r'(\d+\.)\s*\n+\s*(\*\*)', r'\1 \2', desc)
    
    # Ensure bullets like "- For valid" or "- If the" start on a new line
    desc = re.sub(r'([.:;])\s+([–-]\s+)', r'\1\n\n- ', desc)
    
    # Fix sub-bullet inside list
    desc = re.sub(r'(\n-[^\n]+)\s+([–-]\s+)', r'\1\n- ', desc)
    
    # Ensure table start has clean newline before header row
    desc = re.sub(r'([^\n])\s*(\|[^\n]+\|)\n\s*(\|[ \t]*:?[-]+:?[ \t]*\|)', r'\1\n\n\2\n\3', desc)
    
    # Ensure #### Table after a table ends starts on a new line
    desc = re.sub(r'(\|\s*)\n\s*(####)', r'\1\n\n\2', desc)
    
    # Clean code fence blocks without breaking ```sql
    desc = re.sub(r'([^\n])\s*(```[a-zA-Z0-9_-]*)', r'\1\n\n\2\n', desc)
    desc = re.sub(r'\n(```)\s*$', r'\n\n\1', desc)
    
    # Clean up excessive newlines
    desc = re.sub(r'\n{3,}', '\n\n', desc)
    
    return desc.strip()

conn = sqlite3.connect('server/arena.db')
c = conn.cursor()

updated_count = 0
for i in range(1, 13):
    qid = f"dbms-{i:03d}"
    row = c.execute("SELECT id, description FROM questions WHERE id = ?", (qid,)).fetchone()
    if row:
        cleaned = clean_description(row[1])
        c.execute("UPDATE questions SET description = ? WHERE id = ?", (cleaned, qid))
        updated_count += 1

conn.commit()
print(f"Updated {updated_count} DBMS questions in server/arena.db")

# Verify dbms-001 and dbms-007
for check_id in ['dbms-001', 'dbms-007']:
    row = c.execute("SELECT id, description FROM questions WHERE id = ?", (check_id,)).fetchone()
    print(f"\n===== VERIFIED {row[0]} =====")
    print(row[1])

conn.close()
