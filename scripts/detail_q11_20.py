import sys, os, re

sys.stdout.reconfigure(encoding='utf-8')

for q_num in range(11, 21):
    files = [f for f in os.listdir("c:/Users/P K PRANAV/Pictures/javapractice/scripts") if f.startswith(f"dump_Q{q_num:02d}_")]
    if not files:
        continue
    fpath = os.path.join("c:/Users/P K PRANAV/Pictures/javapractice/scripts", files[0])
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"\n=======================================================")
    print(f"  FILE: {files[0]}")
    print(f"=======================================================")
    lines = content.splitlines()
    for l in lines:
        if any(k in l for k in ["Problem Sta", "Constraints", "Input format", "Output format", "The first line", "The output", "Sample Test", "INPUT", "OUTPUT", "class ", "public static void"]):
            print("  ", l.strip())
        elif len(l.strip()) > 0 and len(l.strip()) < 80 and not any(k in l for k in ["Cisco", "National", "ndli-club", "Mail -", "WhatsApp", "LinkedIn", "All Bookmarks"]):
            # print sample input/output lines
            if any(k in l for k in ["Power of Two", "digitSum", "Divya", "Rahul", "Deepa", "Kavitha", "Suresh", "Rohan", "Arjun", "Imagine"]):
                print("  >>", l.strip())
