import json
import os
import re
import subprocess
import sys
import tempfile

def normalize_output(text):
    if not isinstance(text, str):
        return ''
    lines = text.replace('\r\n', '\n').replace('\r', '\n').strip().split('\n')
    return '\n'.join([line.strip() for line in lines])

def extract_class_name(code):
    match = re.search(r'public\s+class\s+([A-Za-z0-9_]+)', code)
    if match:
        return match.group(1)
    match = re.search(r'class\s+([A-Za-z0-9_]+)', code)
    return match.group(1) if match else 'Main'

def main():
    with open('questions_bank3.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    print(f"Testing {len(questions)} questions from questions_bank3.json...")
    passed = 0
    failed = []

    for idx, q in enumerate(questions, 1):
        qid = q['id']
        title = q['title']
        code = q.get('referenceSolution', '')
        test_cases = q.get('testCases', [])

        if not code or '// Implementation' in code:
            print(f"[{idx}/{len(questions)}] FAIL {qid}: Empty or stub solution")
            failed.append((qid, title, "Stub solution"))
            continue

        class_name = extract_class_name(code)
        
        with tempfile.TemporaryDirectory() as temp_dir:
            java_path = os.path.join(temp_dir, f"{class_name}.java")
            with open(java_path, 'w', encoding='utf-8') as jf:
                jf.write(code)

            # Compile
            comp_res = subprocess.run(
                ['javac', f"{class_name}.java"],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=15
            )

            if comp_res.returncode != 0:
                print(f"[{idx}/{len(questions)}] COMPILE FAIL {qid} ({title}):")
                print(comp_res.stderr[:300])
                failed.append((qid, title, f"Compile error: {comp_res.stderr[:200]}"))
                continue

            # Run test cases
            q_ok = True
            for tc_idx, tc in enumerate(test_cases):
                inp = tc.get('input', '')
                expected = tc.get('expectedOutput', '')

                try:
                    run_res = subprocess.run(
                        ['java', class_name],
                        cwd=temp_dir,
                        input=inp,
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                except subprocess.TimeoutExpired:
                    print(f"[{idx}/{len(questions)}] TIMEOUT {qid} on testcase {tc_idx+1}")
                    failed.append((qid, title, f"Timeout on testcase {tc_idx+1}"))
                    q_ok = False
                    break

                actual_norm = normalize_output(run_res.stdout)
                expected_norm = normalize_output(expected)

                if actual_norm != expected_norm:
                    print(f"[{idx}/{len(questions)}] TESTCASE MISMATCH {qid} ({title}) on TC {tc_idx+1}:")
                    print(f"  Input: {repr(inp)}")
                    print(f"  Expected: {repr(expected_norm)}")
                    print(f"  Actual:   {repr(actual_norm)}")
                    failed.append((qid, title, f"Mismatch on TC {tc_idx+1}\nExpected: {expected_norm}\nActual: {actual_norm}"))
                    q_ok = False
                    break

            if q_ok:
                passed += 1
                print(f"[{idx}/{len(questions)}] PASS {qid}: {title}")

    print(f"\n==============================")
    print(f"SUMMARY: {passed}/{len(questions)} PASSED, {len(failed)} FAILED")
    print(f"==============================")
    if failed:
        print("\nFailures:")
        for fid, ftitle, reason in failed:
            print(f"- {fid} ({ftitle}): {reason}")

if __name__ == '__main__':
    main()
