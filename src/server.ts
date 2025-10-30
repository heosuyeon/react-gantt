import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// 정적 파일 서빙
app.use(express.static("public"));

// 일반 EJS 페이지 라우트들
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/contact", (req, res) => {
  res.render("pages/contact");
});

// Dashboard 페이지 (EJS 템플릿 사용 - 다른 페이지들과 통일성 유지)
app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard");
});
app.get("/dashboard/*", (req, res) => {
  res.render("pages/dashboard");
});

// API 엔드포인트
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Node.js API!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`EJS pages: /, /about, /contact`);
  console.log(`React SPA: /dashboard`);
});
