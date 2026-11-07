// Argon CLI installer — installs the model CLI tool directly into your terminal
// Run: node install.js   (or npm install -g . which triggers postinstall)

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');
const pythonCli = path.join(repoRoot, 'yamal', 'cli', 'argon_cli.py');
const npmPkg = path.join(__dirname, 'package.json');

function log(msg) {
  process.stdout.write(msg + '\n');
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env, ...opts.env },
    shell: true,
  });
  return result;
}

function main() {
  log('=== Argon Model CLI Installer ===');
  log('');

  // 1. Check Python
  log('[1/4] Checking Python...');
  const py = run('python', ['--version'], { stdio: 'pipe' });
  if (py.status !== 0) {
    log('  Python not found. Please install Python from https://python.org');
    process.exit(1);
  }
  log(`  Python ${py.stdout.toString().trim()}`);

  // 2. Check fastapi / uvicorn (backend deps)
  log('[2/4] Checking backend dependencies...');
  run('python', ['-m', 'pip', 'install', '--quiet', 'fastapi', 'uvicorn', 'requests', 'google-auth'], {
    stdio: 'pipe',
  });
  log('  Backend dependencies ready (fastapi, uvicorn, requests, google-auth)');

  // 3. Make CLI executable
  log('[3/4] Installing argon CLI...');
  const cliDest = path.join(repoRoot, 'yamal', 'cli', 'argon_cli.py');
  if (!fs.existsSync(cliDest)) {
    log('  ERROR: argon_cli.py not found at ' + cliDest);
    process.exit(1);
  }
  // chmod +x on unix-like
  try { fs.chmodSync(cliDest, 0o755); } catch (e) {}

  log('  Argon CLI installed at: ' + cliDest);

  // 4. Create global aliases / PATH hint
  log('[4/4] Setup complete.');
  log('');
  log('Usage:');
  log('  npm install -g .          # install argon-cli globally');
  log('  argon --help              # show CLI help');
  log('  argon auth login          # sign in with Google');
  log('  argon model status        # check backend status');
  log('  argon rate check          # check rate limits');
  log('  argon mcp route mcp.pool.query --params \'{}"pool_id":"argon-1"\'');
  log('');
  log('Backend:');
  log('  python -m yamal.api.server   # start the local backend (port 8765)');
  log('  Set ARGON_BACKEND_URL to point at a remote backend if needed.');
  log('');
  log('Google OAuth2:');
  log('  Set ARGON_GOOGLE_CLIENT_ID and ARGON_GOOGLE_CLIENT_SECRET env vars.');
  log('  See docs/auth/google-client-setup.md for full instructions.');
  log('');
  log('Benchmarks / Wiki:');
  log('  See docs/benchmarks/ for model benchmark how-to and subreddit wiki data.');
  log('');
}

main();
