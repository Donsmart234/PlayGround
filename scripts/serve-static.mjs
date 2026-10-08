#!/usr/bin/env node
// Minimal static file server for the exported site (./out).
// Serves in the foreground; used by start.sh inside the app-server session.
// Usage: node scripts/serve-static.mjs <directory> <port>
import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { resolve, join, extname } from "node:path";

const root = resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer((req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      res.end();
      return;
    }
    const url = new URL(req.url, "http://localhost");
    const path = resolve(root, "." + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + "/")) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    let file = path;
    try {
      if (statSync(path).isDirectory()) file = join(path, "index.html");
    } catch {
      file = path;
    }
    let content;
    try {
      content = readFileSync(file);
    } catch {
      // Next.js static export fallback page.
      try {
        content = readFileSync(join(root, "404.html"));
      } catch {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(content);
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch {
    res.writeHead(500);
    res.end("Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[serve-static] serving ${root} on :${port}`);
});
