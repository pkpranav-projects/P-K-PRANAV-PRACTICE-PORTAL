const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('PRANAV PORTAL SYSTEM AUDIT & INTEGRITY CHECK');
  console.log('====================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${name} ${extra}`);
      failedTests++;
    }
  }

  // 1. Health check
  console.log('--- 1. Testing /api/health ---');
  try {
    const res = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    assert('Health returns 200', res.status === 200);
    assert('Java available', res.data.java && res.data.java.available === true, `version: ${res.data?.java?.version}`);
    assert('Python available', res.data.python && res.data.python.available === true, `version: ${res.data?.python?.version}`);
    assert('C++ available', res.data.cpp && res.data.cpp.available === true, `version: ${res.data?.cpp?.version}`);
  } catch (err) {
    assert('Health endpoint accessible', false, err.message);
  }

  // 2. Stats check
  console.log('\n--- 2. Testing /api/stats ---');
  let statsData = null;
  try {
    const res = await request({ host: 'localhost', port: 5000, path: '/api/stats', method: 'GET' });
    statsData = res.data;
    assert('Stats returns 200', res.status === 200);
    assert('Total questions equals 113', statsData.totalQuestions === 113, `got: ${statsData.totalQuestions}`);
    assert('Bank 1 equals 30', statsData.bank1Total === 30, `got: ${statsData.bank1Total}`);
    assert('Bank 2 equals 15', statsData.bank2Total === 15, `got: ${statsData.bank2Total}`);
    assert('Bank 3 equals 56', statsData.bank3Total === 56, `got: ${statsData.bank3Total}`);
    assert('Bank 4 (DBMS) equals 12', statsData.dbmsTotal === 12, `got: ${statsData.dbmsTotal}`);
  } catch (err) {
    assert('Stats endpoint accessible', false, err.message);
  }

  // 3. Question Bank Integrity Check (All 113 questions)
  console.log('\n--- 3. Testing Question Bank Integrity (113 Questions) ---');
  try {
    const res = await request({ host: 'localhost', port: 5000, path: '/api/questions', method: 'GET' });
    assert('All questions returns 200', res.status === 200);
    assert('Questions count equals 113', res.data.length === 113, `got: ${res.data.length}`);

    let corruptCount = 0;
    for (const q of res.data) {
      if (!q.id || !q.title || !q.topic || !q.difficulty) {
        corruptCount++;
      }
    }
    assert('Zero corrupt questions in list', corruptCount === 0, `corrupt: ${corruptCount}`);

    // Check sample questions from each bank
    const samples = ['java-001', 'bank2-001', 'bank3-001', 'dbms-001', 'dbms-007'];
    for (const sId of samples) {
      const qRes = await request({ host: 'localhost', port: 5000, path: `/api/questions/${sId}`, method: 'GET' });
      assert(`Question details for ${sId} valid`, qRes.status === 200 && qRes.data.testCases && qRes.data.testCases.length > 0);
    }
  } catch (err) {
    assert('Questions list endpoint accessible', false, err.message);
  }

  // 4. Code Execution in All 4 Languages
  console.log('\n--- 4. Testing Multi-Language Runner (/api/run) ---');

  // 4.1 Java
  try {
    const javaCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("HELLO JAVA ARENA");
    }
}`;
    const res = await request(
      { host: 'localhost', port: 5000, path: '/api/run', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { language: 'java', code: javaCode, input: '' }
    );
    assert('Java /api/run executes with status 200', res.status === 200);
    assert('Java output matches expected', res.data.stdout.trim() === 'HELLO JAVA ARENA', `got: ${res.data.stdout}`);
  } catch (err) {
    assert('Java runner accessible', false, err.message);
  }

  // 4.2 Python
  try {
    const pyCode = `import sys
data = sys.stdin.read().strip()
print(f"HELLO PYTHON: {data}")`;
    const res = await request(
      { host: 'localhost', port: 5000, path: '/api/run', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { language: 'python', code: pyCode, input: 'TEST_INPUT' }
    );
    assert('Python /api/run executes with status 200', res.status === 200);
    assert('Python output matches expected', res.data.stdout.trim() === 'HELLO PYTHON: TEST_INPUT', `got: ${res.data.stdout}`);
  } catch (err) {
    assert('Python runner accessible', false, err.message);
  }

  // 4.3 C++
  try {
    const cppCode = `#include <iostream>
int main() {
    std::cout << "HELLO CPP ARENA" << std::endl;
    return 0;
}`;
    const res = await request(
      { host: 'localhost', port: 5000, path: '/api/run', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { language: 'cpp', code: cppCode, input: '' }
    );
    assert('C++ /api/run executes with status 200', res.status === 200);
    assert('C++ output matches expected', res.data.stdout.trim() === 'HELLO CPP ARENA', `got: ${res.data.stdout}`);
  } catch (err) {
    assert('C++ runner accessible', false, err.message);
  }

  // 4.4 SQL
  try {
    const sqlCode = `DELIMITER //
CREATE PROCEDURE SumOfDigits(IN num INT, OUT sum INT)
BEGIN
    SET sum = 0;
    WHILE num > 0 DO
        SET sum = sum + (num % 10);
        SET num = num DIV 10;
    END WHILE;
END //
DELIMITER ;`;
    const res = await request(
      { host: 'localhost', port: 5000, path: '/api/run', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { language: 'sql', code: sqlCode, input: '987', questionId: 'dbms-007' }
    );
    assert('SQL /api/run executes with status 200', res.status === 200);
    assert('SQL output matches sum of digits (24)', res.data.stdout.includes('24'), `got: ${res.data.stdout}`);
  } catch (err) {
    assert('SQL runner accessible', false, err.message);
  }

  // 5. Code Submission Evaluation (/api/submit)
  console.log('\n--- 5. Testing Multi-Language Evaluation (/api/submit) ---');

  // 5.1 Java submission (java-001)
  try {
    const solRes = await request({ host: 'localhost', port: 5000, path: '/api/questions/java-001/solution', method: 'GET' });
    const subRes = await request(
      { host: 'localhost', port: 5000, path: '/api/submit', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { questionId: 'java-001', code: solRes.data.referenceSolution, language: 'java' }
    );
    assert('Java submission evaluates successfully', subRes.status === 200);
    assert('Java submission Accepted', subRes.data.status === 'Accepted', `got: ${subRes.data.status}`);
  } catch (err) {
    assert('Java submit accessible', false, err.message);
  }

  // 5.2 Python submission (java-005: Fibonacci Number and Properties)
  try {
    const pySol = `import sys

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    if n <= 0:
        fib = 0
    elif n == 1:
        fib = 1
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        fib = b
    even_odd = "Even" if fib % 2 == 0 else "Odd"
    digit_sum = sum(int(d) for d in str(abs(fib)))
    print(f"Fibonacci number at position {n}: {fib}")
    print(f"{even_odd}, Digit Sum: {digit_sum}")

if __name__ == '__main__':
    main()`;
    const subRes = await request(
      { host: 'localhost', port: 5000, path: '/api/submit', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { questionId: 'java-005', code: pySol, language: 'python' }
    );
    assert('Python submission evaluates successfully', subRes.status === 200);
    assert('Python submission Accepted', subRes.data.status === 'Accepted', `got: ${subRes.data.status}`);
  } catch (err) {
    assert('Python submit accessible', false, err.message);
  }

  // 5.3 C++ submission (java-007: Roman Numerals)
  try {
    const cppSol = `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    int num;
    if (cin >> num) {
        vector<pair<int, string>> val = {
            {1000, "M"}, {900, "CM"}, {500, "D"}, {400, "CD"},
            {100, "C"}, {90, "XC"}, {50, "L"}, {40, "XL"},
            {10, "X"}, {9, "IX"}, {5, "V"}, {4, "IV"}, {1, "I"}
        };
        string ans = "";
        for (auto &p : val) {
            while (num >= p.first) {
                ans += p.second;
                num -= p.first;
            }
        }
        cout << ans << endl;
    }
    return 0;
}`;
    const subRes = await request(
      { host: 'localhost', port: 5000, path: '/api/submit', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { questionId: 'java-007', code: cppSol, language: 'cpp' }
    );
    assert('C++ submission evaluates successfully', subRes.status === 200);
    assert('C++ submission Accepted', subRes.data.status === 'Accepted', `got: ${subRes.data.status}`);
  } catch (err) {
    assert('C++ submit accessible', false, err.message);
  }

  // 5.4 SQL submission (dbms-001)
  try {
    const dbmsSolRes = await request({ host: 'localhost', port: 5000, path: '/api/questions/dbms-001/solution', method: 'GET' });
    const subRes = await request(
      { host: 'localhost', port: 5000, path: '/api/submit', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { questionId: 'dbms-001', code: dbmsSolRes.data.referenceSolution, language: 'sql' }
    );
    assert('SQL submission evaluates successfully', subRes.status === 200);
    assert('SQL submission Accepted', subRes.data.status === 'Accepted', `got: ${subRes.data.status}`);
  } catch (err) {
    assert('SQL submit accessible', false, err.message);
  }

  // 6. Screenshot routes verification
  console.log('\n--- 6. Testing Screenshot Endpoints ---');
  const screenshotTests = [
    { name: 'Bank 1 Screenshot', url: '/api/screenshots/Screenshot%20(159).png' },
    { name: 'Bank 3 Screenshot', url: '/api/screenshots/Screenshot%20(548).png' },
    { name: 'Bank 4 (DBMS) Screenshot', url: '/api/screenshots/Screenshot%20(604).png' }
  ];

  for (const st of screenshotTests) {
    try {
      const res = await request({ host: 'localhost', port: 5000, path: st.url, method: 'GET' });
      assert(`${st.name} returns 200`, res.status === 200, `got status: ${res.status}`);
    } catch (err) {
      assert(`${st.name} accessible`, false, err.message);
    }
  }

  // 7. Reference modules (Masterclass & Curriculum)
  console.log('\n--- 7. Testing Masterclass & Curriculum ---');
  try {
    const mc = await request({ host: 'localhost', port: 5000, path: '/api/masterclass', method: 'GET' });
    assert('Masterclass returns 200', mc.status === 200);
    assert('Masterclass contains methods', mc.data.methods && mc.data.methods.length > 50, `got: ${mc.data?.methods?.length}`);

    const curr = await request({ host: 'localhost', port: 5000, path: '/api/curriculum', method: 'GET' });
    assert('Curriculum returns 200', curr.status === 200);
    assert('Curriculum contains 27 guides', curr.data && curr.data.length === 27, `got: ${curr.data?.length}`);
  } catch (err) {
    assert('Reference endpoints accessible', false, err.message);
  }

  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED.`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
