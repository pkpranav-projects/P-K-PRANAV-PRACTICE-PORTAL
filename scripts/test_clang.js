const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const compiler = 'C:\\Users\\P K PRANAV\\AppData\\Local\\Microsoft\\WinGet\\Packages\\MartinStorsjo.LLVM-MinGW.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\\llvm-mingw-20260908-ucrt-x86_64\\bin\\clang++.exe';

const tmpDir = os.tmpdir();
const srcFile = path.join(tmpDir, 'test_cpp_clang.cpp');
const exeFile = path.join(tmpDir, 'test_cpp_clang.exe');

fs.writeFileSync(srcFile, '#include <iostream>\nint main() { std::cout << "Clang++ is WORKING!" << std::endl; return 0; }\n', 'utf8');

console.log('Compiling with clang++...');
const comp = spawnSync(compiler, ['-O2', '-std=c++20', srcFile, '-o', exeFile], { encoding: 'utf8' });
console.log('Compile status:', comp.status);
console.log('Compile stdout:', comp.stdout);
console.log('Compile stderr:', comp.stderr);

if (comp.status === 0 && fs.existsSync(exeFile)) {
  console.log('Running compiled binary with bin in PATH...');
  const binDir = path.dirname(compiler);
  const run = spawnSync(exeFile, [], { 
    encoding: 'utf8',
    env: { ...process.env, PATH: `${binDir};${process.env.PATH}` }
  });
  console.log('Run exit code:', run.status);
  console.log('Run stdout:', run.stdout);
  console.log('Run stderr:', run.stderr);
}
