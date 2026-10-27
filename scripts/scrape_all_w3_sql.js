const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = 'https://www.w3schools.com/sql/' + redirectUrl;
        }
        return resolve(fetchPage(redirectUrl));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function cleanContentHtml(html) {
  // Find start of main content
  const startIdx = html.indexOf('<div class="w3-col l10 m12 w3-white" id="main">') !== -1 
    ? html.indexOf('<div class="w3-col l10 m12 w3-white" id="main">')
    : (html.indexOf("id='main'") !== -1 ? html.indexOf("id='main'") : html.indexOf('id="main"'));

  if (startIdx === -1) return '';

  let content = html.substring(startIdx);

  // Strip after the end of tutorial content (before user profile or bottom nextprev)
  const cutOffs = [
    'id="user-profile-bottom-wrapper"',
    "id='user-profile-bottom-wrapper'",
    '<div id="midcontentadcontainer"',
    '<div class="w3-clear nextprev">'
  ];

  // We want to keep content until the bottom navigation/footer
  const profileIdx = content.indexOf('user-profile-bottom-wrapper');
  if (profileIdx !== -1) {
    content = content.substring(0, profileIdx);
  }

  // Remove top leaderboard ad
  content = content.replace(/<div id=['"]mainLeaderboard['"][\s\S]*?<\/div>\s*<\/div>/gi, '');
  // Remove top and bottom nextprev buttons
  content = content.replace(/<div class=['"]w3-clear nextprev['"][\s\S]*?<\/div>/gi, '');
  // Remove midcontent ads
  content = content.replace(/<div id=['"]midcontentadcontainer['"][\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div class=['"]sidesection['"][\s\S]*?<\/div>/gi, '');
  // Remove feedback form
  content = content.replace(/<div id=['"]getdiploma['"][\s\S]*?<\/div>/gi, '');
  content = content.replace(/<div id=['"]mypagediv['"][\s\S]*?<\/div>/gi, '');

  return content.trim();
}

// Function to extract text, code snippets, syntax, and tables
function extractSectionsFromHtml(html, lesson) {
  // Extract h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : lesson.text;

  // Extract all code examples
  // Examples are inside <div class="w3-example"> ... <div class="w3-code notranslate sqlHigh"> ... </div>
  const examples = [];
  const exampleRegex = /<div class=['"]w3-example['"][^>]*>([\s\S]*?)<\/div>\s*(?:<p>|<div|<\/div>)/gi;
  let exMatch;
  while ((exMatch = exampleRegex.exec(html)) !== null) {
    const exHtml = exMatch[1];
    // extract heading if any (e.g. <h3>Example</h3>)
    const exHeadingMatch = exHtml.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
    const exHeading = exHeadingMatch ? exHeadingMatch[1].replace(/<[^>]+>/g, '').trim() : 'Example';
    
    // extract code
    const codeMatch = exHtml.match(/<div class=['"]w3-code[^'"]*['"][^>]*>([\s\S]*?)<\/div>/i);
    if (codeMatch) {
      let code = codeMatch[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]+>/g, '')
        .trim();
      examples.push({ heading: exHeading, code });
    }
  }

  // Also extract tables (like Customers, Orders sample DB tables)
  const tables = [];
  const tableRegex = /<table class=['"]ws-table-all[^'"]*['"][^>]*>([\s\S]*?)<\/table>/gi;
  let tblMatch;
  while ((tblMatch = tableRegex.exec(html)) !== null) {
    const tblHtml = tblMatch[0];
    tables.push(tblHtml);
  }

  return {
    id: lesson.file.replace('.asp', ''),
    file: lesson.file,
    title,
    navText: lesson.text,
    examples,
    rawMainHtml: cleanContentHtml(html)
  };
}

async function scrapeAll() {
  const coreLinks = JSON.parse(fs.readFileSync('scripts/core_sql_lessons.json', 'utf8'));
  console.log(`Starting to scrape ${coreLinks.length} SQL lessons...`);

  const results = [];
  const batchSize = 5;

  for (let i = 0; i < coreLinks.length; i += batchSize) {
    const batch = coreLinks.slice(i, i + batchSize);
    console.log(`Fetching batch ${i + 1} to ${Math.min(i + batchSize, coreLinks.length)} of ${coreLinks.length}...`);

    const promises = batch.map(async (lesson) => {
      try {
        const url = `https://www.w3schools.com/sql/${lesson.file}`;
        const html = await fetchPage(url);
        const data = extractSectionsFromHtml(html, lesson);
        return data;
      } catch (err) {
        console.error(`Error fetching ${lesson.file}:`, err.message);
        return null;
      }
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(r => {
      if (r) results.push(r);
    });

    // small throttle to be polite
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Successfully scraped ${results.length} lessons!`);
  
  // Categorize lessons into sections for clear jump points:
  // 1. SQL Getting Started
  // 2. Querying & Filtering Data
  // 3. Sorting & Pagination
  // 4. Modifying Data (DML)
  // 5. Aggregate & Math Functions
  // 6. Pattern Matching & Ranges
  // 7. Joining Tables (Joins)
  // 8. Advanced Grouping & Subqueries
  // 9. Conditional & Null Handling
  // 10. Database & Table Management (DDL)
  // 11. Constraints & Integrity
  // 12. Advanced DB Concepts (Indexes, Views, Security)
  // 13. Data Types & Quick Reference

  const categorizedLessons = results.map(lesson => {
    let category = 'SQL Core Tutorial';
    const id = lesson.id;

    if (['sql_intro', 'sql_syntax', 'sql_editor'].includes(id)) {
      category = '1. Getting Started';
    } else if (['sql_select', 'sql_distinct', 'sql_where', 'sql_and', 'sql_or', 'sql_not'].includes(id)) {
      category = '2. Querying & Filtering';
    } else if (['sql_orderby', 'sql_top'].includes(id)) {
      category = '3. Sorting & Pagination';
    } else if (['sql_insert', 'sql_update', 'sql_delete', 'sql_null_values'].includes(id)) {
      category = '4. Modifying Data (DML)';
    } else if (['sql_aggregate_functions', 'sql_min_max', 'sql_max', 'sql_count', 'sql_sum', 'sql_avg'].includes(id)) {
      category = '5. Aggregates & Math';
    } else if (['sql_like', 'sql_wildcards', 'sql_in', 'sql_between', 'sql_alias'].includes(id)) {
      category = '6. Patterns, Ranges & Aliases';
    } else if (['sql_join', 'sql_join_inner', 'sql_join_left', 'sql_join_right', 'sql_join_full', 'sql_join_self'].includes(id)) {
      category = '7. Table Joins (INNER, LEFT, RIGHT, FULL)';
    } else if (['sql_union', 'sql_union_all', 'sql_groupby', 'sql_having', 'sql_exists', 'sql_any_all', 'sql_all', 'sql_select_into', 'sql_insert_into_select'].includes(id)) {
      category = '8. Grouping, Sets & Subqueries';
    } else if (['sql_case', 'sql_isnull', 'sql_stored_procedures', 'sql_comments', 'sql_operators'].includes(id)) {
      category = '9. Logic, Stored Procedures & Logic';
    } else if (['sql_create_db', 'sql_drop_db', 'sql_backup_db', 'sql_create_table', 'sql_drop_table', 'sql_alter'].includes(id)) {
      category = '10. Database & Table Schema (DDL)';
    } else if (['sql_constraints', 'sql_notnull', 'sql_unique', 'sql_primarykey', 'sql_foreignkey', 'sql_check', 'sql_default'].includes(id)) {
      category = '11. Constraints & Integrity';
    } else if (['sql_create_index', 'sql_autoincrement', 'sql_dates', 'sql_view', 'sql_injection', 'sql_parameterized_queries', 'sql_prepared_statements', 'sql_hosting'].includes(id)) {
      category = '12. Indexes, Views & Security';
    } else if (['sql_datatypes', 'sql_ref_keywords', 'sql_ref_mysql', 'sql_ref_sqlserver', 'sql_ref_msaccess', 'sql_quickref', 'sql_examples', 'sql_quiz', 'sql_exercises', 'sql_server'].includes(id)) {
      category = '13. Data Types & Quick Reference';
    }

    return {
      ...lesson,
      category
    };
  });

  const targetPath = path.join(__dirname, '..', 'client', 'src', 'assets', 'w3schools_sql_full_course.json');
  fs.writeFileSync(targetPath, JSON.stringify(categorizedLessons, null, 2), 'utf8');
  console.log(`Saved full course JSON to ${targetPath} (${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB)`);
}

scrapeAll().catch(console.error);
