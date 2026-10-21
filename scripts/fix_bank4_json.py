import json

with open('questions_bank4.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    # Fix sampleInput
    if isinstance(q.get('sampleInput'), str):
        q['sampleInput'] = q['sampleInput'].replace('\\n', '\n')
    # Fix sampleOutput
    if isinstance(q.get('sampleOutput'), str):
        q['sampleOutput'] = q['sampleOutput'].replace('\\n', '\n')
    # Fix testCases
    for tc in q.get('testCases', []):
        if isinstance(tc.get('input'), str):
            tc['input'] = tc['input'].replace('\\n', '\n')
        if isinstance(tc.get('expectedOutput'), str):
            tc['expectedOutput'] = tc['expectedOutput'].replace('\\n', '\n')

    # Fix bank4-009 password sample/testcase to be >= 8 chars for valid Alice
    if q['id'] == 'bank4-009':
        q['sampleInput'] = "3\nAlice password123 alice@domain.com\nBob short bob@test.com\nCharlie pass1234 charlie_at_test.com"
        q['sampleOutput'] = "User Alice registered successfully\nError: Weak password for Bob\nError: Invalid email for Charlie"
        q['testCases'][0]['input'] = q['sampleInput']
        q['testCases'][0]['expectedOutput'] = q['sampleOutput']

    # Fix bank4-029: Console Text Editor scanner reading
    if q['id'] == 'bank4-029':
        q['referenceSolution'] = """import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> doc = new ArrayList<>();

        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) continue;
            if (line.equalsIgnoreCase("SAVE")) break;

            if (line.startsWith("APPEND ")) {
                doc.add(line.substring(7).trim());
            } else if (line.startsWith("DELETE ")) {
                try {
                    int idx = Integer.parseInt(line.substring(7).trim());
                    if (idx >= 1 && idx <= doc.size()) {
                        doc.remove(idx - 1);
                        System.out.println("Deleted: Line " + idx);
                    } else {
                        System.out.println("Error: Line not found");
                    }
                } catch (Exception e) {
                    System.out.println("Error: Line not found");
                }
            } else if (line.startsWith("SEARCH ")) {
                String kw = line.substring(7).trim();
                List<Integer> matches = new ArrayList<>();
                for (int i = 0; i < doc.size(); i++) {
                    if (doc.get(i).contains(kw)) matches.add(i + 1);
                }
                if (matches.isEmpty()) {
                    System.out.println("Matches: None");
                } else {
                    StringBuilder sb = new StringBuilder("Matches: ");
                    for (int m : matches) sb.append("Line ").append(m).append(" ");
                    System.out.println(sb.toString().trim());
                }
            }
        }

        System.out.println("--- Document Content ---");
        for (String l : doc) System.out.println(l);
        System.out.println("--- End of File ---");
        sc.close();
    }
}"""

with open('questions_bank4.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Fixed escaped newlines and bank4-009/bank4-029 in questions_bank4.json")
