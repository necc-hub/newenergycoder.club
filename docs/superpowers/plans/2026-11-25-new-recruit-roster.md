# NEC 新人电竞选手展示页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/team/roster` 提供 8 位新人的电竞选手式展示页，支持四套主题、真人立绘、键盘和移动端操作。

**Architecture:** 页面只负责选择状态与布局；展示数据集中在一个预览模块，人物舞台和名册拆成两个组件。所有主题通过页面根节点的 `data-theme` 驱动 CSS 变量，不修改全站主题或现有团队页。

**Tech Stack:** React 18、TypeScript、Vite 6、React Router 6、现有 CSS/GSAP；不增加运行时依赖。

---

## 文件结构

- Create: `src/data/recruit-roster-preview.ts` — 8 人显示顺序、姓名、状态、立绘、缩略图、焦点。
- Create: `src/components/team/roster/RecruitStage.tsx` — 当前成员的舞台、姓名资料和装饰图形。
- Create: `src/components/team/roster/RecruitRoster.tsx` — 可访问的 8 人选择器。
- Create: `src/pages/RecruitRosterPage.tsx` — 主题、成员状态、键盘事件与页面编排。
- Create: `src/styles/recruit-roster.css` — 四套主题、舞台、名册和响应式。
- Create: `public/images/recruits/preview/*.webp` — 本地预览立绘和名单缩略图。
- Modify: `src/App.tsx` — 懒加载 `/team/roster` 路由。
- Modify: `.gitignore` — 忽略 `.superpowers/`。
- Create: `docs/superpowers/specs/2026-11-25-new-recruit-roster-design.md` — 已确认设计。
- Create: `docs/superpowers/plans/2026-11-25-new-recruit-roster.md` — 本计划。

不修改 `src/pages/TeamPage.tsx`、成员现有数据或任何全局主题。

### Task 1: 生成 8 位成员预览立绘

**Files:**
- Read: 用户提供的 2000×1692 成员照片预览图
- Create: `public/images/recruits/preview/01-han-yitong.webp`
- Create: `public/images/recruits/preview/02-xiao-changting.webp`
- Create: `public/images/recruits/preview/03-lu-jiahao.webp`
- Create: `public/images/recruits/preview/04-tan-huifang.webp`
- Create: `public/images/recruits/preview/05-xiang-jixin.webp`
- Create: `public/images/recruits/preview/06-zhang-chengjun.webp`
- Create: `public/images/recruits/preview/07-lu-yongjie.webp`
- Create: `public/images/recruits/preview/08-lu-wangchun.webp`
- Create: `public/images/recruits/preview/thumbs/{same ids}.webp`
- Create: `.superpowers/source/roster-sheet.webp` — 本地原始预览裁图，仅供素材生成

- [ ] **Step 1: 复制预览拼图并记录裁切框**

使用图片原始尺寸 2000×1692。每个 3:4 人像区域：第一行 `y=153, h=615`，第二行 `y=785, h=613`；四列分别 `x=31, 524, 1017, 1509`，`w=461`。卢永杰、卢王淳裁切时避开右下角旧头像小卡；如残留，在 alpha 处理后再裁去边缘杂物。

- [ ] **Step 2: 用隔离环境生成透明底立绘**

```bash
mkdir -p .superpowers/source public/images/recruits/preview/thumbs
cp /private/tmp/claude-501/-Users-darrenpig-repos-newenergycoder-club--claude-worktrees-game-style-community-showcase-081ed0/0d23c9ed-4e49-4870-b007-486c885cafaa/images/1.webp .superpowers/source/roster-sheet.webp
# 用已授权的 .superpowers/image-tools 运行裁切+rembg，PNG 输出后转 WebP
```

每张立绘保留自然肤色，transparent PNG 转 WebP 质量 88；缩略图从原始裁切生成 180×240 WebP，质量 80，使用原照片自然色。

- [ ] **Step 3: 检查每人 alpha**

打开 8 张输出，确认脸部完整、发丝无明显矩形边、眼镜没有整片透明；张成俊生活照只保留人物主体；卢永杰、卢王淳旧头像卡片未进入成品。失败的照片单独调整裁切后重跑。

### Task 2: 建立展示数据

**Files:**
- Create: `src/data/recruit-roster-preview.ts`

- [ ] **Step 1: 定义类型和数据**

```ts
export type RecruitThemeId = 'robocon-2025' | 'robocon-2024' | 'robocon-2026' | 'nuwa'

export interface RecruitMember {
  id: string
  index: string
  name: string
  romanized: string
  status: '新成员' | '阵容更新'
  image: string
  thumbnail: string
  imagePosition: string
}

export const recruitMembers: RecruitMember[] = [
  { id: 'han-yitong', index: '01', name: '韩依彤', romanized: 'HAN YITONG', status: '新成员', image: '/images/recruits/preview/01-han-yitong.webp', thumbnail: '/images/recruits/preview/thumbs/01-han-yitong.webp', imagePosition: 'center 18%' },
  { id: 'xiao-changting', index: '02', name: '肖长婷', romanized: 'XIAO CHANGTING', status: '新成员', image: '/images/recruits/preview/02-xiao-changting.webp', thumbnail: '/images/recruits/preview/thumbs/02-xiao-changting.webp', imagePosition: 'center 16%' },
  { id: 'lu-jiahao', index: '03', name: '陆家豪', romanized: 'LU JIAHAO', status: '新成员', image: '/images/recruits/preview/03-lu-jiahao.webp', thumbnail: '/images/recruits/preview/thumbs/03-lu-jiahao.webp', imagePosition: 'center 17%' },
  { id: 'tan-huifang', index: '04', name: '谭惠方', romanized: 'TAN HUIFANG', status: '新成员', image: '/images/recruits/preview/04-tan-huifang.webp', thumbnail: '/images/recruits/preview/thumbs/04-tan-huifang.webp', imagePosition: 'center 21%' },
  { id: 'xiang-jixin', index: '05', name: '相积欣', romanized: 'XIANG JIXIN', status: '新成员', image: '/images/recruits/preview/05-xiang-jixin.webp', thumbnail: '/images/recruits/preview/thumbs/05-xiang-jixin.webp', imagePosition: 'center 20%' },
  { id: 'zhang-chengjun', index: '06', name: '张成俊', romanized: 'ZHANG CHENGJUN', status: '新成员', image: '/images/recruits/preview/06-zhang-chengjun.webp', thumbnail: '/images/recruits/preview/thumbs/06-zhang-chengjun.webp', imagePosition: 'center 16%' },
  { id: 'lu-yongjie', index: '07', name: '卢永杰', romanized: 'LU YONGJIE', status: '阵容更新', image: '/images/recruits/preview/07-lu-yongjie.webp', thumbnail: '/images/recruits/preview/thumbs/07-lu-yongjie.webp', imagePosition: 'center 18%' },
  { id: 'lu-wangchun', index: '08', name: '卢王淳', romanized: 'LU WANGCHUN', status: '阵容更新', image: '/images/recruits/preview/08-lu-wangchun.webp', thumbnail: '/images/recruits/preview/thumbs/08-lu-wangchun.webp', imagePosition: 'center 16%' },
]

export const recruitThemes = [
  { id: 'robocon-2025', label: '2025 飞身上篮', shortLabel: '品红青绿', accent: '#ff216b', counter: '#2df5bd' },
  { id: 'robocon-2024', label: '2024 颗粒归仓', shortLabel: '稻谷电蓝', accent: '#ffd400', counter: '#1668ff' },
  { id: 'robocon-2026', label: '2026 武林探秘', shortLabel: '赤霞青梅', accent: '#fa3d48', counter: '#b9ff48' },
  { id: 'nuwa', label: '女娲补天', shortLabel: '五色能量', accent: '#f3f5df', counter: '#71e6cc' },
] as const
```

- [ ] **Step 2: 检查数据唯一性**

Run: `rg -n "id: '" src/data/recruit-roster-preview.ts`

Expected: 12 unique ids（8 人 + 4 主题）。姓名严格对应预览图，不编造组别。

### Task 3: 实现人物舞台与名册

**Files:**
- Create: `src/components/team/roster/RecruitStage.tsx`
- Create: `src/components/team/roster/RecruitRoster.tsx`

- [ ] **Step 1: 编写舞台组件**

Props: `member: RecruitMember`, `themeName: string`。渲染赛季标记、`01 / 08`、姓名、罗马字、状态与「组别资料待确认」。立绘使用 `<img>`，`onError` 切换 `imageFailed`，失败时显示姓名占位与原照片 style 兜底。装饰元素 `aria-hidden`，舞台信息包在 `aria-live="polite"`。

- [ ] **Step 2: 编写名册组件**

Props: `members`, `activeId`, `onSelect`。使用横向 `role="group"`，每个按钮 `aria-pressed`、`aria-label="查看{name}"`。图片懒加载；无图失败时显示姓名首字。键盘左右键由页面统一处理。

- [ ] **Step 3: 检查组件不包含业务数据**

Run: `rg -n "韩依彤|卢王淳|#ff216b" src/components/team/roster`

Expected: 无输出。

### Task 4: 实现页面、主题和样式

**Files:**
- Create: `src/pages/RecruitRosterPage.tsx`
- Create: `src/styles/recruit-roster.css`
- Modify: `src/App.tsx` 第 19–25 行附近与第 74 行附近

- [ ] **Step 1: 页面状态与键盘交互**

```tsx
const [activeIndex, setActiveIndex] = useState(0)
const [theme, setTheme] = useState<RecruitThemeId>('robocon-2025')
const member = recruitMembers[activeIndex]

useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    setActiveIndex(index => (
      event.key === 'ArrowRight'
        ? (index + 1) % recruitMembers.length
        : (index - 1 + recruitMembers.length) % recruitMembers.length
    ))
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}, [])
```

页面根节点：`<PageLayout><div className="recruit-page" data-theme={theme}>...</div></PageLayout>`。顶部有标题、返回 `/team`、四主题按钮；舞台与名册作为主内容。

- [ ] **Step 2: 样式**

按设计文档实现 `.recruit-page`、`.recruit-stage`、`.recruit-portrait`、`.recruit-roster`、`.recruit-theme-button` 及四个 `[data-theme]` 色板。桌面为人物右侧、信息左侧；900px 以下改上下布局，名册横向滚动。加入 `prefers-reduced-motion`。所有装饰 `pointer-events:none`，姓名层级不低于 6。

- [ ] **Step 3: 路由**

在 `App.tsx` 添加：

```tsx
const RecruitRosterPage = React.lazy(() => import("@/pages/RecruitRosterPage"))
...
<Route path="/team/roster" element={<PageLayout><RecruitRosterPage /></PageLayout>} />
```

注意页面自身不要再包一层 PageLayout，避免双 Header/Footer。若页面内部使用 PageLayout，则路由元素直接 `<RecruitRosterPage />`。

### Task 5: 构建与浏览器验收

**Files:**
- Modify as needed: 上述实现文件

- [ ] **Step 1: 安装依赖（如缺失）并构建**

```bash
pnpm install --frozen-lockfile
pnpm build
```

Expected: TypeScript 与 Vite 构建通过；若失败，修复本次相关错误。

- [ ] **Step 2: 启动开发服务**

```bash
pnpm dev --host 127.0.0.1
```

在浏览器打开 `http://localhost:5173/team/roster`。

- [ ] **Step 3: 桌面检查**

确认 1440×1000：四主题切换不换人、8 人点击切换、姓名不压脸、底部名册可读、返回团队页可用。

- [ ] **Step 4: 移动端检查**

用 390×844 视口确认上下布局、立绘完整、名册横向滚动、按钮无溢出。

- [ ] **Step 5: 可访问性与回退检查**

Tab 能依次到主题与成员按钮；左右键切换成员；触发一张图片失败时显示姓名兜底；`prefers-reduced-motion` 下无位移动画。

- [ ] **Step 6: lint**

```bash
pnpm lint
```

只处理本次文件的错误；若存在仓库既有错误，单独记录，不顺手修改无关文件。

- [ ] **Step 7: 交付**

报告改动文件、实际截图、构建/lint 结果、尚未完成事项（高清原图、真实组别、上线接入）。未经用户明确要求不提交、不推送、不创建 PR。