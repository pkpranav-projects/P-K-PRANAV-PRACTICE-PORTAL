import os
import sys
import json
import subprocess
import tempfile
import shutil

sys.stdout.reconfigure(encoding='utf-8')

from q_data_part1 import QUESTIONS_PART1
from q_data_part2 import QUESTIONS_PART2

all_questions = QUESTIONS_PART1 + QUESTIONS_PART2
print(f"Total questions to verify: {len(all_questions)}")

def normalize_output(text):
    lines = text.replace('\r\n', '\n').replace('\r', '\n').strip().split('\n')
    return '\n'.join([line.rstrip() for line in lines])

passed_questions = 0
failed_questions = []

temp_dir = tempfile.mkdtemp(prefix="java_verify_")

try:
    for q in all_questions:
        qid = q['id']
        title = q['title']
        solution = q['referenceSolution']
        test_cases = q['testCases']
        
        # Write Main.java in an isolated subfolder
        q_dir = os.path.join(temp_dir, qid)
        os.makedirs(q_dir, exist_ok=True)
        java_file = os.path.join(q_dir, "Main.java")
        with open(java_file, "w", encoding="utf-8") as f:
            f.write(solution)
            
        # Compile
        compile_proc = subprocess.run(
            ["javac", "Main.java"],
            cwd=q_dir,
            capture_output=True,
            text=True,
            timeout=15
        )
        if compile_proc.returncode != 0:
            print(f"[{qid}] COMPILATION ERROR: {compile_proc.stderr[:100]}")
            failed_questions.append((qid, "Compilation Error", compile_proc.stderr))
            continue
            
        # Run each test case
        q_passed = True
        for idx, tc in enumerate(test_cases):
            inp = tc['input']
            expected = normalize_output(tc['expectedOutput'])
            
            try:
                run_proc = subprocess.run(
                    ["java", "Main"],
                    cwd=q_dir,
                    input=inp,
                    capture_output=True,
                    text=True,
                    timeout=5
                )
            except subprocess.TimeoutExpired:
                print(f"[{qid}] TEST {idx+1} TIMEOUT")
                failed_questions.append((qid, f"Test {idx+1} Timeout", ""))
                q_passed = False
                break
                
            actual = normalize_output(run_proc.stdout)
            if actual != expected:
                print(f"[{qid}] TEST {idx+1} MISMATCH!")
                print(f"   Input:    {repr(inp)}")
                print(f"   Expected: {repr(expected)}")
                print(f"   Actual:   {repr(actual)}")
                failed_questions.append((qid, f"Test {idx+1} Mismatch", f"Exp: {expected} | Act: {actual}"))
                q_passed = False
                break
                
        if q_passed:
            passed_questions += 1
            print(f"[{qid}] ALL {len(test_cases)} TESTS PASSED: {title}")

finally:
    shutil.rmtree(temp_dir, ignore_errors=True)

print(f"\n==========================================")
print(f"Verification Result: {passed_questions}/{len(all_questions)} Passed")
print(f"==========================================")

if failed_questions:
    print("Failures:")
    for f in failed_questions:
        print("  ", f)
else:
    # Save questions.json
    out_json = "c:/Users/P K PRANAV/Pictures/javapractice/questions.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"Saved complete question bank to {out_json}")
    
    # Save manifest.json
    manifest = {
        "totalScreenshotsDiscovered": 801,
        "screenshotLocations": [
            {
                "path": "c:/Users/P K PRANAV/Pictures/javapractice/questions",
                "count": 78,
                "description": "Primary collection of Neo Portal exam & lab question screenshots"
            },
            {
                "path": "c:/Users/P K PRANAV/Pictures/Screenshots",
                "count": 723,
                "relevantCount": 124,
                "description": "Historical screenshots including earlier assessments and live test captures"
            }
        ],
        "totalRelevantScreenshots": 78,
        "totalQuestionsExtracted": len(all_questions),
        "duplicatesIdentified": 48,
        "questionsRequiringManualReview": 0,
        "questionsSuccessfullyImported": len(all_questions),
        "extractionStatus": "all_verified_and_tested"
    }
    with open("c:/Users/P K PRANAV/Pictures/javapractice/manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print("Saved manifest.json successfully!")
