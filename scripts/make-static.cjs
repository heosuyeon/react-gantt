/* eslint-disable */
const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

(function main() {
  const repoRoot = process.cwd();
  const distDir = path.join(repoRoot, "dist");
  ensureDir(distDir);

  // 1) Generate dist/index.html from views/pages/dashboard.ejs
  const dashboardPath = path.join(repoRoot, "views", "pages", "dashboard.ejs");
  if (!fs.existsSync(dashboardPath)) {
    console.error("dashboard.ejs not found:", dashboardPath);
    process.exit(1);
  }
  let html = fs.readFileSync(dashboardPath, "utf8");
  // Convert absolute asset paths to relative for static hosting
  html = html.replace(/href="\/css\//g, 'href="./css/');
  html = html.replace(/href="\/js\//g, 'href="./js/');
  html = html.replace(/src="\/js\//g, 'src="./js/');
  fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");

  // 2) Copy public assets into dist
  copyDir(path.join(repoRoot, "public", "css"), path.join(distDir, "css"));
  copyDir(path.join(repoRoot, "public", "js"), path.join(distDir, "js"));

  console.log("Static bundle prepared at dist/");
})();
