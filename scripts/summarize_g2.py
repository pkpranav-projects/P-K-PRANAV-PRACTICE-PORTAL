import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/g2_details.txt", "r", encoding="utf-16", errors="ignore") as f:
    text = f.read()

# Split into screenshots
screens = text.split("--- Screenshot ")
print(f"Total screen sections: {len(screens) - 1}")

for s in screens[1:]:
    header = s.split("\n")[0]
    fname = "Screenshot " + header.split(" ---")[0]
    
    # search for question title / person name
    q_num = re.search(r'(0\d|\d+)\s+Single File Programming', s)
    qn = q_num.group(1) if q_num else ""
    
    # find problem statement
    ps = ""
    for kw in ["Problem Statement", "Problem Sta tement", "Problem statement"]:
        if kw in s:
            part = s.split(kw)[1][:150].strip().replace('\n', ' ')
            ps = part
            break
            
    # sample test cases
    tc = ""
    if "Sample Test Cases" in s or "Sample test cases" in s:
        tc = "[HAS TEST CASES]"
        
    code = ""
    if "class " in s or "public static void" in s:
        code = "[HAS CODE]"
        
    ps_safe = ps[:50].encode('ascii', 'replace').decode('ascii')
    print(f"{fname:<25} | Q:{qn:<3} | {tc:<16} | {code:<10} | PS: {ps_safe}")
