const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const urlFilePath = path.join(__dirname, '..', 'PUBLIC_URL.txt');

function startTunnel() {
  console.log('Connecting to public tunnel via IPv4 SSH port 443...');

  const sshArgs = [
    '-4',
    '-p', '443',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=3',
    '-o', 'TCPKeepAlive=yes',
    '-o', 'ExitOnForwardFailure=yes',
    '-R', '0:localhost:5000',
    'a.pinggy.io'
  ];

  const child = spawn('ssh', sshArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

  let announced = false;

  child.stdout.on('data', (data) => {
    const text = data.toString();
    const matches = text.match(/https:\/\/[a-zA-Z0-9\-]+\.(free\.pinggy\.net|run\.pinggy-free\.link)/g);
    if (matches && matches.length > 0 && !announced) {
      announced = true;
      const urls = [...new Set(matches)];
      
      const fileContent = `PRANAV Practice Portal - Public Access URLs:\n` +
        urls.map(u => `- ${u}`).join('\n') + `\n\nGenerated: ${new Date().toISOString()}\n`;
      
      fs.writeFileSync(urlFilePath, fileContent, 'utf-8');

      console.log('\n=========================================================================');
      console.log('  SUCCESS! PRANAV PRACTICE PORTAL IS LIVE ON THE INTERNET');
      console.log('=========================================================================');
      urls.forEach(u => console.log(`  🌐 URL: ${u}`));
      console.log('=========================================================================\n');
    }
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    if (!text.includes('Pseudo-terminal') && !text.includes('Allocated port')) {
      process.stderr.write(text);
    }
  });

  child.on('close', (code) => {
    console.log(`Tunnel disconnected (exit code: ${code}). Reconnecting in 3 seconds...`);
    announced = false;
    setTimeout(startTunnel, 3000);
  });

  child.on('error', (err) => {
    console.error('Tunnel error:', err.message);
    announced = false;
    setTimeout(startTunnel, 3000);
  });
}

// Clean previous URL file
if (fs.existsSync(urlFilePath)) {
  fs.unlinkSync(urlFilePath);
}

startTunnel();
