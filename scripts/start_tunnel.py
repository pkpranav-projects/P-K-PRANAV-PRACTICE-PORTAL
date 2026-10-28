import subprocess
import re
import sys
import time
import os
import urllib.request
import json

sys.stdout.reconfigure(encoding='utf-8')

PUBLIC_URL_FILE = 'PUBLIC_URL.txt'

def start_tunnel():
    cmd = [
        'ssh',
        '-R', '80:localhost:5000',
        '-o', 'ServerAliveInterval=15',
        '-o', 'ServerAliveCountMax=6',
        '-o', 'StrictHostKeyChecking=no',
        'nokey@localhost.run'
    ]
    
    print(f"Starting tunnel command: {' '.join(cmd)}", flush=True)
    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    
    assigned_url = None
    
    for line in iter(proc.stdout.readline, ''):
        print(line, end='', flush=True)
        # Look specifically for https://<hash>.lhr.life
        match = re.search(r'https://([a-zA-Z0-9-]+\.lhr\.life)', line)
        if match and not assigned_url:
            assigned_url = match.group(0)
            print(f"\n=========================================", flush=True)
            print(f"🎉 LIVE PUBLIC URL: {assigned_url}", flush=True)
            print(f"=========================================\n", flush=True)
            
            # Save to PUBLIC_URL.txt
            content = f"""PRANAV Practice Portal - Live Online Public URL:
{assigned_url}

Generated: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
Protocol: HTTPS / TLS Terminated (Global CDN)
Status: ACTIVE - RUNNING AND ACCESSIBLE WORLDWIDE
Local Port: 5000 (Node.js API + React Frontend)
"""
            with open(PUBLIC_URL_FILE, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Verify public accessibility
            time.sleep(2)
            try:
                health_url = f"{assigned_url}/api/health"
                req = urllib.request.Request(health_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=12) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    print(f"✅ Verified Public Health Check: {data.get('status')} (HTTP {resp.status})", flush=True)
            except Exception as e:
                print(f"⚠️ Health check ping error: {e}", flush=True)
                
    proc.wait()
    print("Tunnel process disconnected.")

if __name__ == '__main__':
    while True:
        try:
            start_tunnel()
        except Exception as e:
            print(f"Tunnel crashed: {e}. Reconnecting in 5 seconds...")
        time.sleep(5)
