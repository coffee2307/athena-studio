import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

async function reserveFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  await new Promise((resolve) => server.close(resolve));
  assert.ok(port > 0);
  return port;
}

const port = await reserveFreePort();
const root = "http://127.0.0.1:" + port;
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: root, RESEND_API_KEY: "", CONTACT_EMAIL: "", CONTACT_FROM_EMAIL: "" },
});
let stderr = "";
app.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
let exited = false;
app.on("exit", () => { exited = true; });
const routes = [
  "/", "/services", "/services/web-development", "/services/website-care",
  "/services/ai-integration", "/services/micro-saas", "/products", "/studio",
  "/contact", "/robots.txt", "/sitemap.xml",
];
try {
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (exited) throw new Error("App exited before ready: " + stderr);
    try {
      const r = await fetch(root + "/", { signal: AbortSignal.timeout(1500) });
      if (r.ok) { ready = true; break; }
    } catch { /* server warming up */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  assert.ok(ready, "Production server failed to start: " + stderr);
  for (const path of routes) {
    const response = await fetch(root + path, { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, path + " must respond with 200");
    assert.equal(response.headers.get("x-powered-by"), null, "do not expose X-Powered-By");
    const text = await response.text();
    assert.ok(text.length > 30, path + " returned empty response");
    console.log("PASS", path, response.status);
  }
  const unknown = await fetch(root + "/this-route-should-not-exist");
  assert.equal(unknown.status, 404);
  console.log("PASS custom 404");

  const contact = await fetch(root + "/contact");
  assert.match(await contact.text(), /Biểu mẫu đang được cấu hình/);
  const reply = await fetch(root + "/api/inquiry", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({name:"A",email:"a@example.com",service:"website-care",message:"Testing only. Please ignore."}),
  });
  assert.equal(reply.status, 503, "must not silently accept when contact delivery is unconfigured");
  console.log("PASS contact disabled (no credentials)", reply.status);
  console.log("SMOKE TEST COMPLETE");
} finally {
  app.kill();
}
