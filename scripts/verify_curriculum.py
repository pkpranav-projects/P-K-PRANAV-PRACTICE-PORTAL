import sys
import json
import urllib.request

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
    print("   CURRICULUM & DOCUMENT LAUNCH VERIFICATION      ")
    print("==================================================")

    # 1. Fetch Curriculum list
    docs = request('/api/documents')
    assert len(docs) == 27, f"Expected 27 documents, got {len(docs)}"
    print(f" [PASS] Curriculum endpoint: {len(docs)} documents returned in sequential order")

    # Verify first and last sequence
    assert docs[0]['sequence'] == 1, "First item should be sequence 1"
    assert docs[-1]['sequence'] == 27, "Last item should be sequence 27"
    print(f" [PASS] Sequence verified: Step 01 ({docs[0]['title']}) -> Step 27 ({docs[-1]['title']})")

    # Verify 4-line descriptions
    for d in docs:
        assert isinstance(d['description'], list), f"Description for {d['title']} must be a list"
        assert len(d['description']) == 4, f"Document {d['title']} must have exactly 4 description lines, got {len(d['description'])}"
    print(" [PASS] 4-Line Description Standard: All 27 guides have exactly 4 structured lines")

    # 2. Test Open Document endpoint
    open_res = request('/api/documents/open', method='POST', data={'filename': 'Array of Object.pdf'})
    assert open_res['success'] == True, "Failed to open document"
    print(f" [PASS] Native System Open: {open_res['message']}")

    print("\n==================================================")
    print("   CURRICULUM INTEGRATION FULLY VERIFIED!         ")
    print("==================================================")

if __name__ == '__main__':
    main()
