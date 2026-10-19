# Generate custom symbol for PRANAV Practice JAVA
# Distinctive emblem combining:
# - A sleek hexagon / diamond shield
# - Bold stylized monogram "P"
# - Code terminal bracket ">" and Java flame/steam in amber #FFA116

symbol_svg = """<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pGrad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#FFA116" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFA116" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>

  <!-- Dark rounded squircle background container -->
  <rect width="100" height="100" rx="22" fill="#222222" />
  <rect x="1.5" y="1.5" width="97" height="97" rx="20.5" stroke="#3A3A3A" stroke-width="2" />

  <!-- Stylized Geometric 'P' -->
  <!-- Vertical Stem -->
  <rect x="22" y="20" width="13" height="60" rx="6.5" fill="#FFFFFF" />

  <!-- Upper Loop of P -->
  <path d="M28 20H54C67.2548 20 78 30.7452 78 44C78 57.2548 67.2548 68 54 68H28V55H54C60.0751 55 65 50.0751 65 44C65 37.9249 60.0751 33 54 33H28V20Z" fill="url(#pGrad)" />

  <!-- Code Chevron '>' accent at bottom right -->
  <path d="M52 64L66 74L52 84" stroke="url(#accentGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Java Steam / Spark Dot -->
  <circle cx="80" cy="24" r="5" fill="#FFA116" />
</svg>"""

with open("client/public/symbol.svg", "w", encoding="utf-8") as f:
    f.write(symbol_svg)

print("Symbol SVG written successfully!")
