import sys
sys.stdout.reconfigure(encoding='utf-8')

css_to_add = """
/* MySQL Masterclass Dedicated Card & Quiz Styles */
.w3-sql-prose .topic-card {
  background: #050505 !important;
  border: 1px solid #1e2430 !important;
  border-radius: 0.85rem !important;
  padding: 1.75rem 2rem !important;
  margin-bottom: 2rem !important;
}

.w3-sql-prose .callout {
  background: rgba(56, 189, 248, 0.08) !important;
  border-left: 4px solid #38bdf8 !important;
  border-radius: 0.5rem !important;
  padding: 1rem 1.25rem !important;
  margin: 1.2rem 0 !important;
  color: #e2e8f0 !important;
  font-size: 0.95rem !important;
}
.w3-sql-prose .callout-amber {
  background: rgba(251, 191, 36, 0.08) !important;
  border-left-color: #fbbf24 !important;
}
.w3-sql-prose .callout-green {
  background: rgba(16, 185, 129, 0.08) !important;
  border-left-color: #10b981 !important;
}

.w3-sql-prose .code-box {
  position: relative;
  margin: 1.2rem 0;
}

.w3-sql-prose .quiz-card {
  background: #060910 !important;
  border: 1px solid #1e2430 !important;
  border-radius: 0.85rem !important;
  padding: 1.8rem !important;
  margin-top: 2.5rem !important;
}
.w3-sql-prose .question-block {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #141922;
}
.w3-sql-prose .question-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.8rem;
}
.w3-sql-prose .options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.w3-sql-prose .quiz-option {
  background: #000000;
  border: 1px solid #1e2430;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  color: #cbd5e1;
  font-size: 0.88rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}
.w3-sql-prose .quiz-option:hover {
  background: #141414;
  border-color: #38bdf8;
  color: #ffffff;
}
.w3-sql-prose .quiz-option.correct {
  background: rgba(16, 185, 129, 0.2) !important;
  border-color: #10b981 !important;
  color: #34d399 !important;
  font-weight: 700;
}
.w3-sql-prose .quiz-option.wrong {
  background: rgba(239, 68, 68, 0.2) !important;
  border-color: #ef4444 !important;
  color: #fca5a5 !important;
}
.w3-sql-prose .explanation-box {
  margin-top: 0.6rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.82rem;
  display: none;
}
"""

index_css_path = r'c:\Users\P K PRANAV\Pictures\javapractice\client\src\index.css'
with open(index_css_path, 'r', encoding='utf-8') as f:
    current_css = f.read()

if '.w3-sql-prose .quiz-card' not in current_css:
    with open(index_css_path, 'a', encoding='utf-8') as f:
        f.write('\n' + css_to_add)
    print("Appended masterclass and quiz CSS to index.css.")
else:
    print("CSS already present.")
