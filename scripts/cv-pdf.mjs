// Prints /cv to the PDFs its Download button serves, one per language, with
// the page's own print styles. Run it against a running site after the CV
// changes: `bun run cv:pdf` (dev server on :3000), or pass another origin.
// Needs Chrome; set CHROME to its path when it isn't in the default place.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const origin = process.argv[2] ?? "http://localhost:3000";
const chrome =
  process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
// keep in step with `cvPdf` in src/lib/site.ts
const files = {
  en: "public/cv/luan-fabri-cv.pdf",
  pt: "public/cv/luan-fabri-curriculo.pdf",
};

const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(path.join(tmpdir(), "cv-pdf-"));
const browser = spawn(
  chrome,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

try {
  let page;
  for (let i = 0; i < 50 && !page; i++) {
    try {
      const targets = await (
        await fetch(`http://127.0.0.1:${port}/json`)
      ).json();
      page = targets.find((target) => target.type === "page");
    } catch {
      await sleep(200);
    }
  }
  if (!page) throw new Error(`Chrome did not start (${chrome})`);

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((open) => socket.addEventListener("open", open));
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  });
  const send = (method, params = {}) =>
    new Promise((done) => {
      pending.set(++id, done);
      socket.send(JSON.stringify({ id, method, params }));
    });

  for (const [locale, file] of Object.entries(files)) {
    await send("Network.setCookie", {
      name: "locale",
      value: locale,
      url: origin,
    });
    await send("Page.navigate", { url: `${origin}/cv` });
    await sleep(4000); // fonts, and the page settled
    const { result, error } = await send("Page.printToPDF", {
      preferCSSPageSize: true,
      printBackground: true,
    });
    if (error) throw new Error(error.message);
    writeFileSync(file, Buffer.from(result.data, "base64"));
    console.log(`${locale}: ${file}`);
  }
  socket.close();
} finally {
  browser.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
