import html

def make_card(badge, title, what_it_does, sql, headers=None, rows=None, card_class="", status_badge=None, extra_notes=None):
    """
    Renders an OLED-styled granular command card:
    1. Badge + Title
    2. What it does (Plain English ELI5 explanation)
    3. Dedicated standalone SQL code block with Copy button
    4. Expected output table or status table
    """
    badge_html = f'<span class="cmd-badge {status_badge or ""}">{html.escape(badge)}</span>'
    title_html = f'<h4 class="cmd-title">{html.escape(title)}</h4>'
    
    desc_html = f'<p class="cmd-desc"><b>What it does:</b> {what_it_does}</p>'
    if extra_notes:
        desc_html += f'<div class="callout" style="margin: 0.5rem 0 0.85rem 0; padding: 0.6rem 0.85rem; font-size: 0.85rem;">{extra_notes}</div>'

    clean_sql = sql.strip()
    code_html = f'''<div class="code-box">
  <button class="copy-btn" onclick="copyCode(this)">Copy SQL</button>
  <pre><code>{html.escape(clean_sql)}</code></pre>
</div>'''

    output_html = ""
    if headers and rows is not None:
        th_cells = "".join(f"<th>{html.escape(str(h))}</th>" for h in headers)
        tr_rows = []
        for r in rows:
            td_cells = "".join(f"<td>{html.escape(str(c))}</td>" for c in r)
            tr_rows.append(f"<tr>{td_cells}</tr>")
        rows_str = "".join(tr_rows)
        
        output_html = f'''<div class="output-wrap">
  <div class="output-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    Expected Output:
  </div>
  <table class="output-table">
    <thead><tr>{th_cells}</tr></thead>
    <tbody>{rows_str}</tbody>
  </table>
</div>'''

    return f'''<div class="command-card {card_class}">
  <div class="cmd-header">
    {badge_html}
    {title_html}
  </div>
  {desc_html}
  {code_html}
  {output_html}
</div>'''
