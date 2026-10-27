const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '..', 'client', 'src', 'assets', 'w3schools_sql_full_course.json');
const rawLessons = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

function cleanLessonHtml(html, id, defaultTitle) {
  let content = html;

  // Find the real <h1> inside the main content
  let realTitle = defaultTitle;
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const rawH1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
    if (rawH1 && !rawH1.toLowerCase().includes('tutorials') && !rawH1.toLowerCase().includes('references')) {
      realTitle = rawH1;
    }
  }

  // Remove scripts
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove styles
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove share buttons and widgets
  content = content.replace(/<div class=["']ws-share[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div class=["']cert-section[\s\S]*?<\/div>\s*<\/div>/gi, '');
  // Remove ads, video player embeds
  content = content.replace(/<div[^>]*id=["']mainLeaderboard[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']midcontentadcontainer[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*class=["']sidesection[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*class=["']nextprev[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*class=["']w3-clear nextprev[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']getdiploma[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']mypagediv[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']google_dfp[\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div[^>]*id=["']user-profile-bottom-wrapper[\s\S]*?<\/div>/gi, '');
  // Remove videos
  content = content.replace(/<h2[^>]*>Video:[\s\S]*?<\/iframe>/gi, '');
  content = content.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  // Remove trailing w3schools badges & nextprev at end
  content = content.replace(/<hr\s*\/?>\s*<div\s*class=['"]w3-clear\s*nextprev['"][\s\S]*$/gi, '');

  // Fix relative URLs to absolute or anchors
  content = content.replace(/href=["'](sql_[^"']+\.asp)["']/gi, (m, p1) => {
    return `href="#sql-${p1.replace('.asp', '')}" data-sql-jump="${p1.replace('.asp', '')}"`;
  });
  content = content.replace(/href=["']trysql\.asp\?filename=([^"']+)["']/gi, (m, p1) => {
    return `href="javascript:void(0)" data-try-sql="${p1}"`;
  });

  return {
    realTitle,
    cleanedHtml: content.trim()
  };
}

const refinedLessons = rawLessons.map((lesson, idx) => {
  const { realTitle, cleanedHtml } = cleanLessonHtml(lesson.rawMainHtml, lesson.id, lesson.navText);

  // Extract clean code examples
  const examples = (lesson.examples || []).map(ex => {
    return {
      heading: ex.heading,
      code: ex.code
    };
  });

  // Extract a brief overview summary sentence from the first paragraph
  const pMatch = cleanedHtml.match(/<p>([\s\S]*?)<\/p>/i);
  let summary = '';
  if (pMatch) {
    summary = pMatch[1].replace(/<[^>]+>/g, '').trim();
    if (summary.length > 200) {
      summary = summary.substring(0, 197) + '...';
    }
  }

  return {
    order: idx + 1,
    id: lesson.id,
    jumpId: `sql-${lesson.id}`,
    title: realTitle,
    navText: lesson.navText,
    category: lesson.category,
    summary,
    examples,
    rawHtml: cleanedHtml
  };
});

fs.writeFileSync(rawPath, JSON.stringify(refinedLessons, null, 2), 'utf8');
console.log(`Successfully refined ${refinedLessons.length} lessons into ${rawPath}!`);
