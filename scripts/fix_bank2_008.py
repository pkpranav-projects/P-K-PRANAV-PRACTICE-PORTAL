import json

with open('questions_bank2.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    if q['id'] == 'bank2-008':
        q['testCases'][2]['expectedOutput'] = 'Index 62: Key 25'
        q['referenceSolution'] = """import java.util.Scanner;

public class Solution {
    public static int midSquare(int key) {
        long sq = (long) key * key;
        return (int) ((sq / 10) % 100);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] table = new int[100];
        boolean[] occupied = new boolean[100];
        for (int i = 0; i < n; i++) {
            int key = sc.nextInt();
            int idx = midSquare(key);
            while (occupied[idx]) {
                idx = (idx + 1) % 100;
            }
            occupied[idx] = true;
            table[idx] = key;
        }
        for (int i = 0; i < 100; i++) {
            if (occupied[i]) {
                System.out.println("Index " + i + ": Key " + table[i]);
            }
        }
    }
}"""

with open('questions_bank2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated bank2-008")
