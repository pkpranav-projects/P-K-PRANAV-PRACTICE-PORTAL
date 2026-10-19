import urllib.request
import json
import sys

BASE_URL = "http://localhost:5000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def post(path, data):
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_all():
    print("=== STARTING FULL SYSTEM VERIFICATION ===")
    
    # 1. Health check
    health = get("/api/health")
    print(f"[1/9] Health Check: status={health.get('status')}, javac={health.get('javac', {}).get('version')}")
    assert health["status"] == "ok"
    assert health["javac"]["available"] is True

    # 2. Masterclass endpoint
    masterclass = get("/api/masterclass")
    mod_count = len(masterclass.get("modules", []))
    method_count = len(masterclass.get("methods", []))
    print(f"[2/9] Masterclass API: {mod_count} Modules, {method_count} A-Z Methods")
    assert mod_count == 18, f"Expected 18 modules, got {mod_count}"
    assert method_count >= 60, f"Expected >= 60 methods, got {method_count}"

    # 3. Question Bank 1
    bank1 = get("/api/questions?bank=bank1")
    print(f"[3/9] Question Bank 1 (Photo Portal): {len(bank1)} questions loaded")
    assert len(bank1) == 30, f"Expected 30 Bank 1 questions, got {len(bank1)}"
    assert all(q["id"].startswith("java-") for q in bank1)

    # 4. Question Bank 2
    bank2 = get("/api/questions?bank=bank2")
    print(f"[4/9] Question Bank 2 (Modern Java Masterclass): {len(bank2)} questions loaded")
    assert len(bank2) == 15, f"Expected 15 Bank 2 questions, got {len(bank2)}"
    assert all(q["id"].startswith("bank2-") for q in bank2)

    # 5. Study Curriculum
    docs = get("/api/documents")
    print(f"[5/9] Study Curriculum: {len(docs)} documents available from documentss folder")
    assert len(docs) == 27, f"Expected 27 documents, got {len(docs)}"

    # 6. Test Single Question Detail & Solution
    q1 = get("/api/questions/java-001")
    assert q1["id"] == "java-001"
    sol1 = get("/api/questions/java-001/solution")
    assert sol1["referenceSolution"] != ""
    print("[6/9] Question Detail & Solution API verified")

    # 7. Evaluate Solution for Bank 1 (java-001)
    eval1 = post("/api/submit", {
        "questionId": "java-001",
        "code": sol1["referenceSolution"]
    })
    print(f"[7/9] Bank 1 Submission (java-001): Status={eval1['status']}, Passed={eval1['passedCount']}/{eval1['totalCount']}")
    assert eval1["status"] == "Accepted"
    assert eval1["passedCount"] == eval1["totalCount"]

    # 8. Evaluate Solution for Bank 2 (bank2-001)
    sol2 = get("/api/questions/bank2-001/solution")
    eval2 = post("/api/submit", {
        "questionId": "bank2-001",
        "code": sol2["referenceSolution"]
    })
    print(f"[8/9] Bank 2 Submission (bank2-001): Status={eval2['status']}, Passed={eval2['passedCount']}/{eval2['totalCount']}")
    assert eval2["status"] == "Accepted"
    assert eval2["passedCount"] == eval2["totalCount"]

    # 9. Verify Compiler Error Diagnostic Capture
    eval_err = post("/api/submit", {
        "questionId": "java-001",
        "code": "public class Broken { int x = ; }"
    })
    print(f"[9/9] Compiler Error Detection: Status={eval_err['status']}")
    assert eval_err["status"] == "Compilation Error"
    assert "error:" in eval_err["errorMessage"]

    # Final stats check
    stats = get("/api/stats")
    print(f"\nFinal Stats:")
    print(f"Total Questions: {stats['totalQuestions']}")
    print(f"Bank 1 Solved: {stats.get('bank1Solved')}/{stats.get('bank1Total')}")
    print(f"Bank 2 Solved: {stats.get('bank2Solved')}/{stats.get('bank2Total')}")
    print(f"Total Solved: {stats['solvedCount']}")

    print("\nALL 9 SYSTEM TESTS PASSED SUCCESSFULLY! FULL ARCHITECTURE IS VERIFIED.")

if __name__ == "__main__":
    try:
        test_all()
    except Exception as e:
        print(f"TEST FAILED: {e}", file=sys.stderr)
        sys.exit(1)
