import sys
import json
from card_builder import make_card

sys.stdout.reconfigure(encoding='utf-8')

# ==============================================================================
# SECTION 8: TRANSACTIONS & TCL
# ==============================================================================
def build_sec_tcl():
    cards = []
    
    intro = '''<div class="topic-header">
  <h2 class="topic-title">8. Transactions (TCL) — ACID Properties &amp; Concurrency Control</h2>
  <div class="link-badges">
    <a href="https://www.tutorialspoint.com/sql/sql-transactions.htm" target="_blank" rel="noopener" class="badge-link">TutorialsPoint Transactions ↗</a>
  </div>
</div>
<div class="eli5-box">
  <strong class="title">ELI5: An ATM Cash Withdrawal</strong>
  A <b>Transaction</b> is a single logical unit of work that must either succeed completely or fail completely. When you withdraw cash at an ATM, two things happen: your bank balance is deducted, and cash is dispensed. If power cuts after deducting balance, the system <b>ROLLBACKS</b> your money back. If everything succeeds, it <b>COMMITS</b> the change permanently.
</div>

<div class="callout callout-green">
  <b>The Four ACID Properties (Essential Exam Definitions):</b><br/>
  • <b>Atomicity ('All or Nothing'):</b> The entire transaction completes, or all changes are undone.<br/>
  • <b>Consistency:</b> The database transitions from one valid state to another valid state, preserving all integrity constraints.<br/>
  • <b>Isolation:</b> Concurrent transactions execute without interfering with one another.<br/>
  • <b>Durability:</b> Once committed, data changes survive system crashes and power failures.
</div>
'''

    # Variety 1: COMMIT
    cards.append(make_card(
        badge="COMMIT",
        title="1. Successful Transaction with COMMIT — The Bank Transfer Example",
        what_it_does="Deducts $500 from Alice (Account 1001) and adds $500 to Bob (Account 1002). Both steps succeed, so <code>COMMIT</code> seals the changes into storage permanently.",
        sql="START TRANSACTION;\n\n-- Step 1: Deduct from Alice\nUPDATE Accounts SET Balance = Balance - 500 WHERE AccountNo = 1001;\n\n-- Step 2: Credit to Bob\nUPDATE Accounts SET Balance = Balance + 500 WHERE AccountNo = 1002;\n\n-- Step 3: Make changes permanent\nCOMMIT;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]],
        card_class="card-success",
        status_badge="badge-success",
        extra_notes="<b>State:</b> Alice has $4,500; Bob has $2,500. Changes are durable on disk."
    ))

    # Variety 2: ROLLBACK
    cards.append(make_card(
        badge="ROLLBACK",
        title="2. Failed Transaction with ROLLBACK — Undoing Changes on Error",
        what_it_does="Suppose after deducting funds from Alice, the database detects Bob's account is frozen or power fails. Calling <code>ROLLBACK</code> restores Alice's original balance immediately from the InnoDB undo log.",
        sql="START TRANSACTION;\n\n-- Step 1: Deduct from Alice\nUPDATE Accounts SET Balance = Balance - 500 WHERE AccountNo = 1001;\n\n-- Error encountered (Bob's account is invalid/frozen)\n-- Step 2: Abort and restore original state\nROLLBACK;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.00 sec"]],
        card_class="card-amber",
        status_badge="badge-amber",
        extra_notes="<b>Rollback Effect:</b> Alice's balance is safely restored to $5,000. No money is lost."
    ))

    # Variety 3: SAVEPOINT
    cards.append(make_card(
        badge="SAVEPOINT",
        title="3. Partial Rollback with SAVEPOINT — Checkpointing Within a Transaction",
        what_it_does="Sets a temporary marker inside a long transaction. If an optional step fails, you can roll back to that specific savepoint without discarding the earlier successful operations.",
        sql="START TRANSACTION;\n\n-- Step 1: Deduct Tuition Fee\nUPDATE Accounts SET Balance = Balance - 1000 WHERE AccountNo = 1001;\nSAVEPOINT sp_tuition_paid;\n\n-- Step 2: Attempt Optional Hostel Fee (Fails or user cancels)\nUPDATE Accounts SET Balance = Balance - 300 WHERE AccountNo = 1001;\n\n-- Step 3: Undo only the hostel fee step, keeping tuition paid\nROLLBACK TO SAVEPOINT sp_tuition_paid;\n\n-- Finalize the transaction\nCOMMIT;",
        headers=["Query Status", "Rows Affected", "Execution Time"],
        rows=[["Query OK", "0 rows affected", "0.01 sec"]]
    ))

    # Isolation Levels Matrix
    matrix = '''<div class="callout callout-amber" style="margin-top: 2rem;">
  <b>Transaction Isolation Levels &amp; Concurrency Phenomena:</b>
</div>
<table class="output-table">
  <thead>
    <tr>
      <th>Isolation Level</th>
      <th>Dirty Read</th>
      <th>Non-Repeatable Read</th>
      <th>Phantom Read</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>READ UNCOMMITTED</b></td>
      <td style="color: #ef4444;">Allowed</td>
      <td style="color: #ef4444;">Allowed</td>
      <td style="color: #ef4444;">Allowed</td>
    </tr>
    <tr>
      <td><b>READ COMMITTED</b></td>
      <td style="color: #10b981;">Prevented</td>
      <td style="color: #ef4444;">Allowed</td>
      <td style="color: #ef4444;">Allowed</td>
    </tr>
    <tr>
      <td><b>REPEATABLE READ (MySQL Default)</b></td>
      <td style="color: #10b981;">Prevented</td>
      <td style="color: #10b981;">Prevented</td>
      <td style="color: #10b981;">Prevented (via Next-Key Lock)</td>
    </tr>
    <tr>
      <td><b>SERIALIZABLE</b></td>
      <td style="color: #10b981;">Prevented</td>
      <td style="color: #10b981;">Prevented</td>
      <td style="color: #10b981;">Prevented</td>
    </tr>
  </tbody>
</table>'''

    return intro + "\n" + "\n".join(cards) + "\n" + matrix

print("sec_tcl builder compiled successfully.")
