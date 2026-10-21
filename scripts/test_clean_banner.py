import re

text = """COD (4) QUESTION 1/4 CODE Problem Statement P K Pranav CB.SC.U4CYS25037 cbsc.u4cys25037@cb.students.amrita.edu -o Amrita_24CYS204_Advance Prgramming_Day 8_COD 1 Sections 4 Questions 38766 2 3 S 0 01:39:36 • Answered • Bookmarked • Skipped 4 + 30 Meera manages a small shop and wants to display her products sorted by price in descending order so the most expensive items appear at the top of her catalogue. She uses Java's Comparator interface to define a custom ordering that is separate from the product's natural order. Each product has a name and a price. The program reads N products, sorts them by price in descending order using a Comparator, and prints the sorted list."""

# Remove the banner by stripping everything up to "Skipped ... + \d+"
cleaned = re.sub(r'^.*?(?:Skipped|Bookmarked)[^\w]*\d*\s*\+?\s*\d*\s*', '', text, flags=re.DOTALL)
print("CLEANED:")
print(cleaned)
