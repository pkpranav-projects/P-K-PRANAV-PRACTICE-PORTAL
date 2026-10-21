const http = require('http');

function post(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Java execution on /api/run ---');
  const javaRes = await post('http://localhost:5000/api/run', {
    code: 'public class Main { public static void main(String[] args) { System.out.println("Java 27 Ready!"); } }',
    input: '',
    language: 'java'
  });
  console.log('Java run result:', javaRes.stdout ? javaRes.stdout.trim() : javaRes, 'Exit:', javaRes.exitCode, 'Time:', javaRes.executionTimeMs + 'ms');

  console.log('\n--- 2. Testing Python execution on /api/run ---');
  const pyRes = await post('http://localhost:5000/api/run', {
    code: 'print("Python 3.12 Ready!")',
    input: '',
    language: 'python'
  });
  console.log('Python run result:', pyRes.stdout ? pyRes.stdout.trim() : pyRes, 'Exit:', pyRes.exitCode, 'Time:', pyRes.executionTimeMs + 'ms');

  console.log('\n--- 3. Testing C++ execution on /api/run ---');
  const cppRes = await post('http://localhost:5000/api/run', {
    code: '#include <iostream>\nint main() { std::cout << "C++20 Ready!" << std::endl; return 0; }',
    input: '',
    language: 'cpp'
  });
  console.log('C++ run result:', cppRes.stdout ? cppRes.stdout.trim() : cppRes, 'Exit:', cppRes.exitCode, 'Time:', cppRes.executionTimeMs + 'ms');

  console.log('\n--- 4. Testing full evaluation on bank3-001 with Java ---');
  const javaSolution = `
import java.util.*;

class Product {
    String name;
    int price;
    Product(String name, int price) {
        this.name = name;
        this.price = price;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        String[] names = new String[n];
        for (int i = 0; i < n; i++) names[i] = sc.next();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();

        List<Product> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(new Product(names[i], prices[i]));
        }

        list.sort((a, b) -> Integer.compare(b.price, a.price));

        for (Product p : list) {
            System.out.println(p.name + " " + p.price);
        }
    }
}
`;

  const evalRes = await post('http://localhost:5000/api/submit', {
    questionId: 'bank3-001',
    code: javaSolution,
    language: 'java'
  });
  console.log('Evaluation result on bank3-001 (Java):', {
    status: evalRes.status,
    passedCount: evalRes.passedCount,
    totalCount: evalRes.totalCount,
    executionTimeMs: evalRes.executionTimeMs
  });

  console.log('\n--- 5. Testing evaluation on bank3-001 with Python ---');
  const pythonSolution = `
import sys
tokens = sys.stdin.read().split()
if tokens:
    n = int(tokens[0])
    names = tokens[1:1+n]
    prices = [int(x) for x in tokens[1+n:1+2*n]]
    prods = list(zip(names, prices))
    prods.sort(key=lambda x: -x[1])
    for name, price in prods:
        print(f"{name} {price}")
`;
  const pyEvalRes = await post('http://localhost:5000/api/submit', {
    questionId: 'bank3-001',
    code: pythonSolution,
    language: 'python'
  });
  console.log('Evaluation result on bank3-001 (Python):', {
    status: pyEvalRes.status,
    passedCount: pyEvalRes.passedCount,
    totalCount: pyEvalRes.totalCount,
    executionTimeMs: pyEvalRes.executionTimeMs
  });

  console.log('\n--- 6. Testing evaluation on bank3-001 with C++ ---');
  const cppSolution = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

struct Product {
    std::string name;
    int price;
};

int main() {
    int n;
    if (!(std::cin >> n)) return 0;
    std::vector<std::string> names(n);
    for (int i = 0; i < n; i++) std::cin >> names[i];
    std::vector<int> prices(n);
    for (int i = 0; i < n; i++) std::cin >> prices[i];

    std::vector<Product> prods(n);
    for (int i = 0; i < n; i++) {
        prods[i] = {names[i], prices[i]};
    }

    std::stable_sort(prods.begin(), prods.end(), [](const Product& a, const Product& b) {
        return a.price > b.price;
    });

    for (const auto& p : prods) {
        std::cout << p.name << " " << p.price << "\\n";
    }
    return 0;
}
`;
  const cppEvalRes = await post('http://localhost:5000/api/submit', {
    questionId: 'bank3-001',
    code: cppSolution,
    language: 'cpp'
  });
  console.log('Evaluation result on bank3-001 (C++):', {
    status: cppEvalRes.status,
    passedCount: cppEvalRes.passedCount,
    totalCount: cppEvalRes.totalCount,
    executionTimeMs: cppEvalRes.executionTimeMs
  });
}

runTests().catch(e => console.error(e));
