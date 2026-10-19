import sys, os, glob, re

sys.stdout.reconfigure(encoding='utf-8')

for q_num in range(11, 21):
    files = glob.glob(f"c:/Users/P K PRANAV/Pictures/javapractice/scripts/dump_Q{q_num:02d}_*.txt")
    if not files:
        continue
    fpath = files[0]
    name = os.path.basename(fpath)
    with open(fpath, "r", encoding="utf-8") as f:
        txt = f.read()
    print(f"\n=======================================================")
    print(f"  {name}")
    print(f"=======================================================")
    ps_m = re.search(r'(?:Problem\s*Statement|problem\s*Statement|Problem\s*statement|Problem\s*Sta\s*tement)[\s:]*([\s\S]+?)(?:Constraints|Input\s*format|Code\s*constraints|Sample\s*test\s*cases|The\s*first\s*line)', txt, re.IGNORECASE)
    if ps_m:
        print("STATEMENT:", ps_m.group(1).strip()[:200].replace('\n', ' '))
    tc_m = re.findall(r'(?:Input\s*(\d*)\s*:|case\s*(\d*)\s*Input)([\s\S]+?)(?:Output\s*\1\s*:|case\s*\2\s*Output)([\s\S]+?)(?:Input|Output|Header|Footer|Fill|Constraints|Single|$)', txt, re.IGNORECASE)
    print(f"Test cases found: {len(tc_m)}")
    for t in tc_m[:3]:
        inp = t[2].strip()[:60].replace('\n', ' ')
        outp = t[3].strip()[:60].replace('\n', ' ')
        print(f"  In: {inp} | Out: {outp}")
