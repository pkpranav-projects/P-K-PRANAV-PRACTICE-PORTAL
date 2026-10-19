import json
import re

with open("c:/Users/P K PRANAV/Pictures/javapractice/scripts/questions_ocr.json", "r", encoding="utf-8-sig") as f:
    q_data = json.load(f)

def get_num(fname):
    m = re.search(r'\((\d+)\)', fname)
    return int(m.group(1)) if m else 0

q_dict = {get_num(x['file']): x for x in q_data}

ranges = [
    (159, 162, "Q01_Ashok_Substring"),
    (163, 165, "Q02_Sarah_EvenNumbers"),
    (166, 168, "Q03_Examly_String"),
    (169, 171, "Q04_OpenAI_String"),
    (172, 174, "Q05_Fibonacci_Calculator"),
    (175, 179, "Q06_Autoboxing_Unboxing"),
    (180, 182, "Q07_Robin_Roman_Numerals"),
    (183, 185, "Q08_Aman_Wrapper_Operations"),
    (186, 188, "Q09_Nick_StringBuilder_Replacement"),
    (189, 194, "Q10_Laura_Pythagorean_Triples"),
    (195, 195, "Q11_Meera_Power_Of_Two"),
    (196, 197, "Q12_Arjun_Digit_Sum"),
    (198, 199, "Q13_Divya_Score_Sum_Average"),
    (200, 202, "Q14_Rahul_Contest"),
    (203, 204, "Q15_Deepa_Math_Worksheet"),
    (205, 206, "Q16_Kavitha_Sensor_Data"),
    (207, 207, "Q17_Suresh_Logistics"),
    (208, 210, "Q18_Rohan_Stock_Market"),
    (211, 211, "Q19_Arjun_Security_Lab"),
    (212, 213, "Q20_Calculator_App"),
    (214, 215, "Q21_Mary_Age_Program"),
    (216, 218, "Q22_Priya_Software_Dev"),
    (219, 220, "Q23_Eva_Curious_Programmer"),
    (221, 222, "Q24_Melvin_Healthy_Lifestyle"),
    (223, 228, "Q25_Space_Satellite_Thermal"),
    (227, 227, "Q26_Mithun_Retail_Products"),
    (229, 230, "Q27_Smart_Agriculture_Soil"),
    (231, 231, "Q28_Samantha_Software_Dev"),
    (232, 233, "Q29_Alex_Serialized_Products"),
    (234, 236, "Q30_Sophie_APYCalculator")
]

for start, end, name in ranges:
    out_path = f"c:/Users/P K PRANAV/Pictures/javapractice/scripts/dump_{name}.txt"
    with open(out_path, "w", encoding="utf-8") as out:
        for n in range(start, end + 1):
            if n in q_dict:
                out.write(f"\n=================== Screenshot ({n}) ===================\n")
                out.write(q_dict[n]['text'] + "\n")
    print(f"Dumped {name}")
