import json

with open('scripts/dbms_questions_ocr.json', 'r', encoding='utf-8-sig') as f:
    items = json.load(f)

with open('scripts/dbms_g1_g2.txt', 'w', encoding='utf-8') as out:
    out.write("=== GROUP 1 (4FDF1): Screenshots 604 - 618 ===\n")
    for i in range(0, 15):
        out.write(f"\n--- {items[i]['file']} ---\n")
        out.write('\n'.join(items[i]['lines']))
        out.write('\n')

    out.write("\n=== GROUP 2 (2AEFB): Screenshots 619 - 632 ===\n")
    for i in range(15, 29):
        out.write(f"\n--- {items[i]['file']} ---\n")
        out.write('\n'.join(items[i]['lines']))
        out.write('\n')

    out.write("\n=== GROUP 3 (35167): Screenshots 633 - 638 ===\n")
    for i in range(29, 35):
        out.write(f"\n--- {items[i]['file']} ---\n")
        out.write('\n'.join(items[i]['lines']))
        out.write('\n')

    out.write("\n=== GROUP 4 (F5867): Screenshots 639 - 644 ===\n")
    for i in range(35, 41):
        out.write(f"\n--- {items[i]['file']} ---\n")
        out.write('\n'.join(items[i]['lines']))
        out.write('\n')
