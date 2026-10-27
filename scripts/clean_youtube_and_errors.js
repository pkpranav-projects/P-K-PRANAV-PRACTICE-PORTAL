const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'assets', 'w3schools_sql_full_course.json');
const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function cleanContent(html) {
  let content = html;

  // 1. Remove all YouTube video sections, headers, and container blocks
  content = content.replace(/<h2[^>]*>[^<]*Video:[^<]*<\/h2>\s*<a[^>]*href=["'][^"']*(?:youtu|youtube)[\s\S]*?<\/a>/gi, '');
  content = content.replace(/<a[^>]*href=["'][^"']*(?:youtu\.be|youtube\.com)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');
  content = content.replace(/<div\s+id=["']yt_container["'][\s\S]*?<\/div>\s*(?:<\/div>)?/gi, '');
  content = content.replace(/<h2[^>]*>[^<]*Video:[^<]*<\/h2>/gi, '');
  content = content.replace(/<picture id=["']yt_div["'][\s\S]*?<\/picture>/gi, '');
  content = content.replace(/<img[^>]*alt=["'][^"']*YouTube[^"']*["'][^>]*>/gi, '');

  // 2. Fix image URLs so they load from W3Schools or remove broken local ones
  content = content.replace(/src=["'](images\/[^"']+)["']/gi, 'src="https://www.w3schools.com/sql/$1"');
  content = content.replace(/src=["'](img_[^"']+)["']/gi, 'src="https://www.w3schools.com/sql/$1"');
  content = content.replace(/srcset=["'](images\/[^"']+)["']/gi, 'srcset="https://www.w3schools.com/sql/$1"');
  content = content.replace(/srcset=["'](img_[^"']+)["']/gi, 'srcset="https://www.w3schools.com/sql/$1"');

  // 3. Remove "Track your progress", "Log in to track", and certification banners
  content = content.replace(/<div class=["']cert-card[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div class=["']cert-info[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']mypagediv[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']user-profile-bottom-wrapper[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<p[^>]*>Track your progress[\s\S]*?<\/p>/gi, '');
  content = content.replace(/<a[^>]*class=["'][^"']*w3-btn[^"']*["'][^>]*>Track your progress[\s\S]*?<\/a>/gi, '');

  // 4. Remove empty paragraph or hr duplicates
  content = content.replace(/<p>\s*<\/p>/gi, '');
  content = content.replace(/(?:<hr\s*\/?>\s*){2,}/gi, '<hr />');

  return content.trim();
}

let cleanedCount = 0;
const cleanedLessons = lessons.map(lesson => {
  const original = lesson.rawHtml;
  const cleaned = cleanContent(original);
  if (cleaned !== original) cleanedCount++;
  return {
    ...lesson,
    rawHtml: cleaned
  };
});

fs.writeFileSync(filePath, JSON.stringify(cleanedLessons, null, 2), 'utf8');
console.log(`Cleaned YouTube video blocks and errors across ${cleanedCount} of ${cleanedLessons.length} lessons.`);
