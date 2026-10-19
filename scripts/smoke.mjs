// Fast production smoke test: boots the Nitro server, checks the built page
// and its stylesheet, then exits. Uses only Node built-ins.
import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

const PORT = Number(process.env.SMOKE_PORT ?? 4173);
const HOST = 'techignite.live';
const BASE_URL = `http://127.0.0.1:${PORT}`;

const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => {
  serverOutput += chunk;
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk;
});

function fail(message) {
  console.error(`\nSmoke test failed: ${message}`);
  if (serverOutput.trim()) {
    console.error(serverOutput.trim());
  }
  server.kill('SIGTERM');
  process.exit(1);
}

async function waitForServer(deadlineMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    try {
      await fetch(BASE_URL, { headers: { Host: HOST } });
      return;
    } catch {
      await delay(150);
    }
  }
  fail(`server did not start on port ${PORT} within ${deadlineMs}ms`);
}

try {
  await waitForServer();

  const home = await fetch(BASE_URL, { headers: { Host: HOST } });
  if (home.status !== 200) {
    fail(`GET / returned ${home.status}`);
  }

  const html = await home.text();
  if (!html.includes('Welcome to Tech Ignite26')) {
    fail('home page is missing the expected heading');
  }

  const stylesheet = html.match(/href="([^"]+\.css)"/)?.[1];
  if (!stylesheet) {
    fail('home page has no stylesheet link');
  }

  const css = await fetch(`${BASE_URL}${stylesheet}`);
  if (css.status !== 200) {
    fail(`stylesheet ${stylesheet} returned ${css.status}`);
  }

  console.log(`Smoke test passed: GET / 200, heading present, ${stylesheet} 200`);
} finally {
  server.kill('SIGTERM');
}
