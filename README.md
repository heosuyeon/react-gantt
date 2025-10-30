# React Gantt Hybrid Application

Node.js + TypeScript + EJS 서버 렌더링과 React SPA를 결합한 하이브리드 애플리케이션입니다.

## 프로젝트 구조

```
react-gantt/
├── src/
│   ├── gantt-task-react/          # React Gantt 소스 (Vite로 번들)
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── index.css
│   │   └── index.tsx              # 번들 진입점
│   └── server.ts                  # Express 서버 (EJS 렌더링)
├── views/
│   └── pages/
│       ├── index.ejs
│       ├── about.ejs
│       ├── contact.ejs
│       └── dashboard.ejs
├── public/                         # 정적 파일(소스)
│   ├── css/                        # 수동 관리 CSS (커밋 대상)
│   └── js/                         # Vite 빌드 산출물 경로(outDir)
├── dist/                           # 서버 빌드 산출물(tsc)
├── vite.config.ts                  # Vite 설정 (outDir: public/js)
├── tsconfig.json                   # 브라우저/공용 TS 설정
├── tsconfig.node.json              # Node 전용 TS 설정
└── package.json

```

## 주요 기능

### 🖥️ 서버 사이드 렌더링 (EJS)

- `/` - 홈페이지
- `/about` - 소개 페이지
- `/contact` - 연락처 페이지

### ⚛️ 클라이언트 사이드 렌더링 (React SPA)

- `/dashboard` - React로 구성된 대시보드 (SPA)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 모드 실행

**두 개의 터미널에서 실행해야 합니다:**

터미널 1 - Node.js Express 서버:

```bash
npm run dev:server
```

터미널 2 - Vite 번들 워치(클라이언트 번들을 public/js로 실시간 출력):

```bash
npm run dev   # concurrently로 서버 + vite build --watch 동시 실행
```

### 3. 브라우저에서 접속

- EJS 페이지: http://localhost:3000
- React SPA: http://localhost:3000/dashboard

### 4. 프로덕션 빌드

```bash
npm run build
NODE_ENV=production npm start
```

## 라우팅 동작 방식

### EJS 페이지 (서버 사이드 렌더링)

일반적인 페이지는 Express 라우터에서 EJS 템플릿을 렌더링합니다:

```typescript
app.get("/", (req, res) => {
  res.render("pages/index");
});
```

### React SPA (클라이언트 사이드 렌더링)

#### 개발/프로덕션 동작

- 클라이언트 번들: Vite가 `public/js/react-app.js`로 출력(outDir)
- 서버: `src/server.ts`를 tsc로 빌드하여 `dist/server.js` 실행
- Express는 `public/`을 정적으로 서빙하며, 대시보드는 `views/pages/dashboard.ejs`에서 `/js/react-app.js`를 로드

## 기술 스택

- **서버**: Node.js, Express, TypeScript
- **템플릿 엔진**: EJS
- **프론트엔드**: React, TypeScript
- **빌드 도구**: Vite, tsx
- **개발 도구**: concurrently

## 개발 가이드

### 새 EJS 페이지 추가

1. `views/pages/`에 새 템플릿 파일 생성
2. `src/server.ts`에 라우트 추가

### 새 React 컴포넌트 추가

1. `src/gantt-task-react/components`에 컴포넌트 파일 생성
2. `src/gantt-task-react/App.tsx`에서 import 및 사용

### API 엔드포인트 추가

`src/server.ts`에 Express 라우트를 추가합니다:

```typescript
app.get("/api/your-endpoint", (req, res) => {
  res.json({ data: "your data" });
});
```

## 라이센스

MIT
