const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Testing full API suite...\n');

  // 1. Health
  const health = await request('GET', '/api/health');
  console.log('1. Health check:', health.status === 200 ? 'PASS' : 'FAIL', health.data.status);

  // 2. Stats
  const stats = await request('GET', '/api/stats');
  console.log('2. Stats check:', stats.status === 200 ? 'PASS' : 'FAIL', `Total: ${stats.data.totalQuestions}`);

  // 3. Questions
  const allQ = await request('GET', '/api/questions');
  console.log('3. All Questions check:', allQ.status === 200 && allQ.data.length === 113 ? 'PASS' : 'FAIL', `Count: ${allQ.data.length}`);

  // 4. Banks
  const b1 = await request('GET', '/api/questions?bank=bank1');
  const b2 = await request('GET', '/api/questions?bank=bank2');
  const b3 = await request('GET', '/api/questions?bank=bank3');
  const b4 = await request('GET', '/api/questions?bank=dbms');
  console.log('4. Bank 1 check:', b1.data.length === 30 ? 'PASS' : 'FAIL', `Count: ${b1.data.length}`);
  console.log('   Bank 2 check:', b2.data.length === 15 ? 'PASS' : 'FAIL', `Count: ${b2.data.length}`);
  console.log('   Bank 3 check:', b3.data.length === 56 ? 'PASS' : 'FAIL', `Count: ${b3.data.length}`);
  console.log('   Bank 4 (DBMS) check:', b4.data.length === 12 ? 'PASS' : 'FAIL', `Count: ${b4.data.length}`);

  // 5. Question Details
  const q1 = await request('GET', '/api/questions/java-001');
  const q2 = await request('GET', '/api/questions/bank2-001');
  const q3 = await request('GET', '/api/questions/bank3-001');
  console.log('5. Detail java-001:', q1.status === 200 ? 'PASS' : 'FAIL', q1.data.title);
  console.log('   Detail bank2-001:', q2.status === 200 ? 'PASS' : 'FAIL', q2.data.title);
  console.log('   Detail bank3-001:', q3.status === 200 ? 'PASS' : 'FAIL', q3.data.title);

  // 6. Masterclass
  const mc = await request('GET', '/api/masterclass');
  console.log('6. Masterclass check:', mc.status === 200 ? 'PASS' : 'FAIL', `Chapters: ${mc.data.chapters ? mc.data.chapters.length : 'ok'}`);

  // 7. Curriculum & Documents
  const docs = await request('GET', '/api/documents');
  const curr = await request('GET', '/api/curriculum');
  console.log('7. Curriculum check (/api/documents):', docs.status === 200 && Array.isArray(docs.data) ? 'PASS' : 'FAIL', `Docs: ${docs.data.length}`);
  console.log('   Curriculum check (/api/curriculum):', curr.status === 200 && Array.isArray(curr.data) ? 'PASS' : 'FAIL', `Docs: ${curr.data.length}`);

  // 8. Bookmarks Toggle
  const bm1 = await request('POST', '/api/bookmarks/bank3-001');
  const bm2 = await request('POST', '/api/bookmarks/bank3-001'); // untoggle back
  console.log('8. Bookmark toggle check:', bm1.status === 200 && bm2.status === 200 ? 'PASS' : 'FAIL');

  // 9. Revision Toggle
  const rv1 = await request('POST', '/api/revision/bank3-001');
  const rv2 = await request('POST', '/api/revision/bank3-001'); // untoggle back
  console.log('9. Revision toggle check:', rv1.status === 200 && rv2.status === 200 ? 'PASS' : 'FAIL');

  // 10. Drafts Save & Retrieve
  const saveDraft = await request('POST', '/api/drafts/bank3-001', { code: '// test draft code', language: 'java' });
  const getDraft = await request('GET', '/api/drafts/bank3-001?language=java');
  console.log('10. Drafts check:', saveDraft.status === 200 && getDraft.data.draftCode === '// test draft code' ? 'PASS' : 'FAIL');

  console.log('\n--- ALL API SUITE CHECKS COMPLETED ---');
}

run().catch(console.error);
