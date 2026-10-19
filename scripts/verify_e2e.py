import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = 'http://localhost:5000'

def request(path, method='GET', data=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    if data is not None:
        req.add_header('Content-Type', 'application/json')
        body = json.dumps(data).encode('utf-8')
    else:
        body = None
    with urllib.request.urlopen(req, data=body) as res:
        return json.loads(res.read().decode('utf-8'))

def main():
    print("==================================================")
    print("   JAVA PRACTICE ARENA — END-TO-END VERIFICATION  ")
    print("==================================================")

    # Initial reset to start from clean state
    request('/api/reset', method='POST')

    # 1. Health
    health = request('/api/health')
    assert health['status'] == 'ok', "Health check failed"
    assert health['java']['available'] and health['javac']['available'], "Java compiler unavailable"
    print(f" [PASS] Health check: {health['javac']['version']}")

    # 2. Questions List
    questions = request('/api/questions')
    assert len(questions) == 30, f"Expected 30 questions, got {len(questions)}"
    print(f" [PASS] Question Bank: {len(questions)} verified questions retrieved")

    # 3. Single Question Details
    q1 = request('/api/questions/java-001')
    assert q1['id'] == 'java-001', "Question id mismatch"
    assert len(q1['testCases']) == 5, f"Expected 5 test cases, got {len(q1['testCases'])}"
    assert q1['testCases'][3]['isHidden'] == True, "Hidden test case not shielded"
    assert q1['testCases'][3]['input'] == 'Hidden Test Case', "Hidden test case input leaked"
    print(f" [PASS] Question Details & Exam Integrity Shield: {q1['title']}")

    # 4. Save Draft
    sample_code = """
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String sub = sc.nextLine();
        int idx = sc.nextInt();
        System.out.println(s.substring(0, idx) + sub + s.substring(idx));
    }
}
"""
    draft = request('/api/drafts/java-001', method='POST', data={'code': sample_code})
    assert draft['success'], "Draft save failed"
    print(" [PASS] User Draft Persistence")

    # 5. Toggle Bookmark
    bm1 = request('/api/bookmarks/java-001', method='POST')
    assert isinstance(bm1['isBookmarked'], bool), "Bookmark toggle failed"
    print(f" [PASS] Bookmark Toggle (current={bm1['isBookmarked']})")

    # 6. Toggle Revision
    rev1 = request('/api/revision/java-001', method='POST', data={'reason': 'Practice string slicing'})
    assert isinstance(rev1['isRevision'], bool), "Revision toggle failed"
    print(f" [PASS] Revision Flagging (current={rev1['isRevision']})")

    # 7. Run Code with Custom Input
    custom_in = "Hello World\nJava \n6\n"
    run_res = request('/api/run', method='POST', data={'code': sample_code, 'input': custom_in})
    assert run_res['status'] == 'Success', f"Run failed: {run_res}"
    assert 'Hello Java World' in run_res['stdout'], f"Unexpected stdout: {run_res['stdout']}"
    print(f" [PASS] Sandboxed Run: stdout='{run_res['stdout'].strip()}' in {run_res['executionTimeMs']}ms")

    # 8. Submit Code for Full Evaluation
    submit_res = request('/api/submit', method='POST', data={'questionId': 'java-001', 'code': sample_code})
    assert submit_res['status'] == 'Accepted', f"Submission failed: {submit_res}"
    assert submit_res['passedCount'] == 5, f"Expected 5 passes, got {submit_res['passedCount']}"
    print(f" [PASS] Live Evaluation: {submit_res['passedCount']}/{submit_res['totalCount']} test cases passed")

    # 9. Verify Dashboard Stats
    stats = request('/api/stats')
    assert stats['solvedCount'] == 1, f"Expected 1 solved, got {stats['solvedCount']}"
    assert stats['totalSubmissions'] >= 1, "Submission count not recorded"
    assert stats['accuracy'] == 100, f"Expected 100% accuracy, got {stats['accuracy']}%"
    assert stats['bookmarkCount'] >= 1, "Bookmark count missing in stats"
    assert stats['revisionCount'] >= 1, "Revision count missing in stats"
    print(f" [PASS] Real Dashboard Stats: Solved={stats['solvedCount']}/{stats['totalQuestions']}, Accuracy={stats['accuracy']}%")

    # 10. Reveal Solution
    sol = request('/api/questions/java-001/solution')
    assert 'referenceSolution' in sol and len(sol['referenceSolution']) > 20, "Solution retrieval failed"
    assert 'explanation' in sol, "Explanation missing"
    print(f" [PASS] Verified Solution & Explanation Access")

    # 11. Settings & Daily Goal
    settings_res = request('/api/settings', method='POST', data={'key': 'daily_goal', 'value': '5'})
    assert settings_res['success'], "Settings update failed"
    settings = request('/api/settings')
    assert settings.get('daily_goal') in ('5', 5), f"Setting daily_goal not updated: {settings}"
    print(" [PASS] User Settings Update (daily_goal=5)")

    # 12. Backup Export & Reset
    backup = request('/api/export')
    assert 'data' in backup and 'questions' in backup['data'] and 'submissions' in backup['data'], "Backup export structure invalid"
    print(f" [PASS] Full Backup Export: {len(backup['data']['submissions'])} submissions recorded")

    reset_res = request('/api/reset', method='POST')
    assert reset_res['success'], "Reset failed"
    clean_stats = request('/api/stats')
    assert clean_stats['solvedCount'] == 0, "Stats not reset to 0"
    print(" [PASS] Clean State Reset (Ready for User)")

    print("\n==================================================")
    print("   ALL 12 END-TO-END VERIFICATION CHECKS PASSED!  ")
    print("==================================================")

if __name__ == '__main__':
    main()
