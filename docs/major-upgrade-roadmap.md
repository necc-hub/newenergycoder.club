# 跨大版本依赖升级评估

> 生成于 2026-11-24，更新于 2026-11-25，分支 `claude/nifty-jackson-3d62c7`。
>
> **进度（2026-11-25）：第一批 + 第二批已全部完成并逐个验证通过**
> （tsc 0 错误 / build 通过 / 9 个 node 测试 / 多路由浏览器冒烟无 console 错误）。
>
> 已完成：`sharp 0.35`、`react-syntax-highlighter 16`、`@vercel/analytics 2`、
> `@vercel/speed-insights 2`、`react-router-dom 7`、`framer-motion 14`、
> `@sentry/react 11`、`react-i18next 18 + i18next 27`、`sonner 2`、`@vercel/node 32`。
>
> **原则：一次只升一个大版本，单独分支 + 单独 PR，验证 build/test/运行时后再合。**
> 不要一次性全升，否则出问题时无法定位是哪个引起的。

## 升级优先级矩阵

| 依赖 | 当前 → 最新 | 状态 | 备注 |
|------|------------|------|------|
| `sharp` | 0.35 | ✅ 已完成 | 构建期缩略图脚本 |
| `react-syntax-highlighter` | 16.1 | ✅ 已完成 | MarkdownRenderer |
| `@vercel/analytics` / `speed-insights` | 2.x | ✅ 已完成 | 初始化 API 不变 |
| `react-router-dom` | 7.18 | ✅ 已完成 | v6 API 超集，路由已浏览器验证 |
| `framer-motion` | 14.14 | ✅ 已完成 | 仅用 motion + AnimatePresence |
| `@sentry/react` | 11.17 | ✅ 已完成 | 封装在 lib/sentry.ts |
| `react-i18next` + `i18next` | 18 / 27 | ✅ 已完成 | i18next ≥27 满足 peer |
| `sonner` | 2.0 | ✅ 已完成 | 经 shadcn toast 使用 |
| `@vercel/node` | 32 | ✅ 已完成 | 仅类型，api/join.ts 已验证 |
| `react-helmet-async` | 2 → 3 | 🟡 待做 | 配合 React 19 |
| `lucide-react` | 0.503 → 1.79 | 🔴 待做 | 需 codemod（61 文件，图标改名） |
| `react` / `react-dom` | 18 → 19 | 🔴 待做 | 核心升级，牵动全栈 |
| `vite` | 6 → 8 | 🔴 待做 | Rolldown，等 React 19 之后 |
| `tailwindcss` | 3 → 4 | 🔴 待做 | CSS-first 配置重写 |
| `typescript` | 5.7 → 7.0 | 🟡 观望 | TS7 Go 重写，等生态成熟 |
| `eslint` + `@eslint/js` | 9 → 10 | 🟡 观望 | 等插件生态跟上 |
| `@types/react` / `react-dom` | 18 → 19 | 🔴 随 React 19 | 类型随核心一起升 |
| `@vitejs/plugin-react` | 4 → 6 | 🔴 随 Vite 8 | 与 Vite 主版本对齐 |
| `cssnano` | 7 → 9 | 🟡 待做 | PostCSS 压缩器 |
| `globals` | 16 → 17 | 🟡 待做 | eslint 全局变量表 |
| `eslint-plugin-react-hooks` | 5 → 7 | 🟡 待做 | 配合 React 19 / 编译器 |

## 分项说明

### ✅ 已完成批次（见上方矩阵）

第一批（低风险）与第二批（中风险）共 10 项已全部升级并验证。
每个大版本单独提交，提交信息含验证结果。

### 🟡 计划内，需回归测试

## 分项说明

### ✅ 低风险，可立即升

**sharp 0.35** — 只在 `scripts/generate-gallery-thumbnails.mjs` 构建期使用，
API 稳定（resize/jpeg/png）。升后跑一遍缩略图生成验证即可。

**react-syntax-highlighter 16** — 只在 `MarkdownRenderer.tsx` 一处使用
（`Prism` + 两个主题）。16 主要更新内部 refractor/prismjs 依赖，
导入路径不变。升后验证代码块高亮渲染。

**@vercel/analytics 2 / speed-insights 2** — 初始化调用 `<Analytics />` /
`<SpeedInsights />` 不变，主要是内部依赖和包体积优化。

### 🟡 计划内，需回归测试

**react-router-dom 7** — v7 合并了 Remix，但作为库使用时 v6 的
`<BrowserRouter>` / `useNavigate` / `useParams` / `useSearchParams` 等
本项目用到的 API 全部保留。主要是 peer 依赖要求 React 18+。可直接升，
重点测试路由跳转和文档页（DocumentPage 用大量路由参数）。

**framer-motion 14** — `motion` / `AnimatePresence` 核心 API 保留，
但部分 easing / layout 动画行为有变化。本项目大量使用，需目视检查动画。

**@sentry/react 11** — 已在 `src/lib/sentry.ts` 封装初始化，改动集中。
主要核对 `browserTracingIntegration` 等 v11 命名。

**react-i18next 18** — `useTranslation` API 稳定，但 v16+ 要求 i18next 23+。
需同步升级 `i18next` 本体（注意：当前 package.json 未直接列 i18next，
由 react-i18next 传递引入，升级时确认 peer 对齐）。

**react-helmet-async 3** — 配合 React 19，移除了对旧 React 的支持。
单独升需确认与 React 18 的兼容性；建议和 React 19 一起。

**typescript 7** — 原生（Go）重写，编译快 10 倍，但属早期。
建议等 7.x 稳定 + `@typescript-eslint` 明确支持后再升，暂留 5.7。

**eslint 10** — flat config 已是现状，升级主要等
`typescript-eslint` / `eslint-plugin-react-hooks` / `react-refresh` 插件
发布兼容版本。目前 `typescript-eslint` 8.74 支持 eslint 9，暂缓。

**@vercel/node 32** — 仅 `api/join.ts` 一个 serverless function 用。
跨 27 个大版本，但 function 签名（req/res）稳定。升后在 Vercel preview 验证加入表单。

### 🔴 高风险，专项迁移

**lucide-react 1.x** — 61 个文件、上百个图标。1.0 起移除了大量旧名
（如 `Edit3`→`PenLine`、部分方向图标改名）。必须用官方 codemod
（`npx @lucide/codemod`）+ 人工核对。建议：
1. 先 `pnpm dlx @lucide/codemod` 跑自动重命名
2. 全局搜索残留的旧图标名
3. 逐页目视确认图标显示正常

**react 19** — 核心升级。本项目需注意：
- `react-helmet-async` 需升到 3（或迁到 React 19 内置的 `<title>`/`<meta>` 支持）
- Radix UI 各组件需确认支持 React 19（最新版大多已支持）
- `react-syntax-highlighter` / `framer-motion` peer 对齐
- 重点关注：ref as prop、useTransition、并发特性
- 建议顺序：先升 react-helmet-async → 再升 react/react-dom + @types → 全量回归

**vite 8** — 基于 Rolldown（Rust），构建更快但 rollup 插件兼容性需验证。
本项目 `vite.config.ts` 用了自定义 `manualChunks`（build/manualChunks.js），
Rolldown 的 chunk 拆分逻辑与 Rollup 不同，需重点验证产物拆分是否仍正确
（有 `build/manualChunks.test.mjs` 守护）。建议等 React 19 稳定后单独升。

**tailwindcss 4** — 配置从 JS（tailwind.config.js）迁到 CSS-first
（`@import "tailwindcss"` + `@theme`）。本项目有自定义 config +
`tailwindcss-animate` + `@tailwindcss/typography` 插件，需逐个确认 v4 兼容。
破坏性大，建议最后做，且需要逐页视觉回归。

## 推荐执行顺序（剩余批次）

第 1–4 步已于 2026-11-25 完成。剩余：

```
5. lucide-react 1.x (codemod)                       (图标专项)
6. react-helmet-async 3 + react 19 + @types/react 19 (React 核心专项)
7. vite 8 + @vitejs/plugin-react 6                   (构建专项)
8. tailwindcss 4                                    (样式专项，最后)
9. typescript 7 + eslint 10 + 相关插件               (等生态成熟)
```

每一步：单独分支 → 升级 → `pnpm build && node --test build/*.test.mjs && npx tsc -b`
→ 起 preview server 目视检查关键页面（/ /team /projects /learning /docs）→ 单独 PR。
