const { CodeExecutor } = require('../server/src/executor.js');

async function testEval() {
  const testCases = [
    { input: '10 20\n', expectedOutput: '30', isHidden: false },
    { input: '100 -50\n', expectedOutput: '50', isHidden: true }
  ];

  console.log('Testing Java evaluation...');
  const javaCode = `
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
`;
  const jRes = await CodeExecutor.evaluateSubmission('java', javaCode, testCases);
  console.log('Java eval:', jRes.status, `Passed: ${jRes.passedCount}/${jRes.totalCount}`);

  console.log('Testing Python evaluation...');
  const pyCode = `
import sys
parts = sys.stdin.read().split()
if parts:
    a, b = int(parts[0]), int(parts[1])
    print(a + b)
`;
  const pRes = await CodeExecutor.evaluateSubmission('python', pyCode, testCases);
  console.log('Python eval:', pRes.status, `Passed: ${pRes.passedCount}/${pRes.totalCount}`);

  console.log('Testing C++ evaluation...');
  const cppCode = `
#include <iostream>
int main() {
    int a, b;
    if (std::cin >> a >> b) {
        std::cout << (a + b) << std::endl;
    }
    return 0;
}
`;
  const cRes = await CodeExecutor.evaluateSubmission('cpp', cppCode, testCases);
  console.log('C++ eval:', cRes.status, `Passed: ${cRes.passedCount}/${cRes.totalCount}`);
}

testEval();
