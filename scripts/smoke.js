import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Running smoke tests on dist/ ...");

const distPath = path.resolve(__dirname, "../dist");

if (!fs.existsSync(distPath)) {
  console.error("❌ Smoke Test Failed: dist directory does not exist.");
  process.exit(1);
}

const indexHtmlPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Smoke Test Failed: index.html not found in dist.");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

// 1. Check if base path '/doh/' is correctly applied to assets
if (!indexHtml.includes('"/doh/assets/')) {
  console.error(
    "❌ Smoke Test Failed: Base path '/doh/' not found in asset paths. Did vite.config.js lose the base property?",
  );
  process.exit(1);
}

// 2. Check favicon exists
if (!fs.existsSync(path.join(distPath, "favicon.svg"))) {
  console.error("❌ Smoke Test Failed: favicon.svg is missing from dist.");
  process.exit(1);
}

// 3. Check for any unresolved vite assets (e.g., /vite.svg)
if (indexHtml.includes("vite.svg")) {
  console.error(
    "❌ Smoke Test Failed: Unresolved placeholder 'vite.svg' found in index.html.",
  );
  process.exit(1);
}

console.log("✅ Smoke tests passed!");
