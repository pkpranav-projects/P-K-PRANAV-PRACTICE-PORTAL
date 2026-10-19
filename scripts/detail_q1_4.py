import sys, os, re

sys.stdout.reconfigure(encoding='utf-8')

def inspect_file(fname):
    path = os.path.join("c:/Users/P K PRANAV/Pictures/javapractice/scripts", fname)
    if not os.path.exists(path):
        print("Missing:", fname)
        return
    with open(path, "r", encoding="utf-8") as f:
        print(f"\n==================================\n{fname}\n==================================")
        lines = f.readlines()
        for l in lines:
            if not any(k in l for k in ["Cisco", "National Digital", "ndli-club", "Mail - P K", "WhatsApp", "LinkedIn", "All Bookmarks"]):
                print(l, end='')

# Let's inspect Q01, Q02, Q03, Q04
inspect_file("dump_Q01_Ashok_Substring.txt")
inspect_file("dump_Q02_Sarah_EvenNumbers.txt")
inspect_file("dump_Q03_Examly_String.txt")
inspect_file("dump_Q04_OpenAI_String.txt")
