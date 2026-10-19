import glob
import os

files = [
    "dump_Q01_Ashok_Substring.txt",
    "dump_Q02_Sarah_EvenNumbers.txt",
    "dump_Q03_Examly_String.txt",
    "dump_Q04_OpenAI_String.txt",
    "dump_Q05_Fibonacci_Calculator.txt",
    "dump_Q06_Autoboxing_Unboxing.txt"
]

for fname in files:
    path = os.path.join("c:/Users/P K PRANAV/Pictures/javapractice/scripts", fname)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"\n=======================================================")
    print(f"  FILE: {fname}")
    print(f"=======================================================")
    print(content[:1500])
