import urllib.request
import json

payload = {
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello from Java!\"); } }",
    "input": ""
}
req = urllib.request.Request(
    "http://localhost:5000/api/run",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
print("Run result:", json.loads(res.read()))

# Test submit for java-001 with correct reference solution
ref_q = json.loads(urllib.request.urlopen("http://localhost:5000/api/questions/java-001/solution").read())
sub_payload = {
    "questionId": "java-001",
    "code": ref_q["referenceSolution"]
}
sub_req = urllib.request.Request(
    "http://localhost:5000/api/submit",
    data=json.dumps(sub_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
sub_res = urllib.request.urlopen(sub_req)
print("Submit result:", json.loads(sub_res.read()))

# Test stats
stats_res = urllib.request.urlopen("http://localhost:5000/api/stats")
print("Stats after submit:", json.loads(stats_res.read()))
