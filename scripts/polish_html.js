const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'assets', 'w3schools_sql_full_course.json');
const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function polishHtml(html) {
  let content = html;

  // Trim anything before the first <h1>
  const h1Idx = content.indexOf('<h1');
  if (h1Idx !== -1) {
    content = content.substring(h1Idx);
  }

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Remove unwanted buttons and links
  content = content.replace(/<div class=["']w3-clear nextprev["'][\s\S]*?<\/div>/gi, '');
  content = content.replace(/<a[^>]*class=["'][^"']*w3-btn[^"']*nextprev[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');
  content = content.replace(/<div[^>]*class=["']ws-share[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*class=["']cert-card[\s\S]*?<\/div>\s*<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']user-profile-bottom-wrapper[\s\S]*$/gi, '');
  content = content.replace(/<div[^>]*id=["']midcontentadcontainer[\s\S]*?<\/div>/gi, '');

  // Clean empty divs and extra whitespace
  content = content.replace(/<div[^>]*>\s*<\/div>/gi, '');

  return content.trim();
}

const cleanedLessons = lessons.map(lesson => {
  const polished = polishHtml(lesson.rawHtml);
  return {
    ...lesson,
    rawHtml: polished
  };
});

fs.writeFileSync(filePath, JSON.stringify(cleanedLessons, null, 2), 'utf8');
console.log(`Polished all ${cleanedLessons.length} lessons.`);
