import sys, os, glob, re

sys.stdout.reconfigure(encoding='utf-8')

for q_num in range(21, 31):
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
    ps_m = re.search(r'(?:Problem\s*Statement|problem\s*Statement|Problem\s*statement|Problem\s*Sta\s*tement)[\s:]*([\s\S]+?)(?:Constraints|Input\s*format|Code\s*constraints|Sample\s*test\s*cases|The\s*first\s*line|Your\s*task)', txt, re.IGNORECASE)
    if ps_m:
        print("STATEMENT:", ps_m.group(1).strip()[:200].replace('\n', ' '))
