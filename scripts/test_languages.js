const { CodeExecutor } = require('../server/src/executor.js');

async function test() {
  console.log('--- Testing Java ---');
  const javaCode = `
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        System.out.println("Java OK: " + (5 + 10));
    }
}
`;
  const javaRes = await CodeExecutor.runSingle('java', javaCode, '');
  console.log('Java result:', javaRes);

  console.log('--- Testing Python ---');
  const pyCode = `
import sys
print("Python OK:", 5 + 10)
`;
  const pyRes = await CodeExecutor.runSingle('python', pyCode, '');
  console.log('Python result:', pyRes);

  console.log('--- Testing C++ ---');
  const cppCode = `
#include <iostream>
int main() {
    std::cout << "C++ OK: " << (5 + 10) << std::endl;
    return 0;
}
`;
  const cppRes = await CodeExecutor.runSingle('cpp', cppCode, '');
  console.log('C++ result:', cppRes);
}

test();
