import sqlite3

conn = sqlite3.connect('server/arena.db')
c = conn.cursor()
for r in c.execute("SELECT id, title, description FROM questions WHERE id LIKE 'dbms-%'").fetchall():
    print(f"=== {r[0]}: {r[1]} ===")
    print(r[2][:300])
    print()
conn.close()
