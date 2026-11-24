# 成员分析与成员交互实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在官网提供可搜索的成员目录、稳定可分享的成员档案，以及目录旁基于真实项目和技能标签的协作关系探索。

**Architecture:** 成员常量作为不可译身份与关系的数据源，语言文件按 `id` 覆盖展示文案。纯 TypeScript 模块负责技术方向归类、搜索、关系与分析，React 组件只负责 UI 状态；档案内容和关系列表在团队页与档案页之间复用，不新增后端。

**Tech Stack:** React 18、TypeScript、React Router、Tailwind CSS、Radix/shadcn、Lucide、Vitest（仅纯函数测试）、pnpm、Node.js 22。

**设计依据：** `docs/superpowers/specs/2026-11-25-member-analysis-interaction-design.md`

---

## 执行边界与文件结构

| 文件 | 变更与职责 |
| --- | --- |
| `src/lib/i18n/types/translations.ts` | `TeamMember.id`、新 UI 文案类型、项目引用类型 |
| `src/lib/i18n/constants/team.ts` | 70 位成员稳定 `id`；维持现有成员元数据 |
| `src/lib/i18n/locales/zh.ts` | 以 `id` 为键的中文覆盖；补齐新界面中文文案 |
| `src/lib/i18n/locales/en.ts` | 新增界面英文文案；英文成员仍回退常量 |
| `src/lib/team/tech-modules.ts` | 无 React 的技术方向定义与标签匹配 |
| `src/lib/team/members.ts` | 身份校验、按 `id` 合并展示文案、档案路径与查找 |
| `src/lib/team/relations.ts` | 搜索、关系交集、关系图选项、图节点与统计聚合 |
| `src/lib/team/*.test.ts` | 上述纯函数的聚焦测试 |
| `src/components/team/MemberCard.tsx` | 按 `id` 导航的卡片，保留独立外链 |
| `src/components/team/MemberProfileContent.tsx` | 档案公共内容、技能、项目与协作者 |
| `src/components/team/MemberTechDetail.tsx` | 移除已迁入档案页的详情内容 |
| `src/components/team/MemberContactLinks.tsx` | 复用已有公开联系链接样式 |
| `src/components/team/CollaborationGraph.tsx` | 焦点选择、确定性 SVG 和完整可访问列表 |
| `src/components/team/MemberExplorer.tsx` | 搜索、角色与关系筛选状态 |
| `src/components/team/TeamInsights.tsx` | 技术覆盖、项目分布、资料完整度 |
| `src/pages/MemberProfilePage.tsx` | 档案路由、分享/邀约、空状态与 SEO |
| `src/pages/TeamPage.tsx` | 接入探索器与分析，保留页面其它区块 |
| `src/App.tsx` | 新档案懒加载路由 |
| `vite.config.ts` | 仅添加 Vitest 的 `test` 配置 |
| `package.json`、`pnpm-lock.yaml` | Vitest 与 `pnpm test` |

每个任务独立提交；不把 `.superpowers/` 或本地构建产物加入提交。commit message 末尾添加：

```text
Co-Authored-By: Claude Code <noreply@anthropic.com>
```

---

### Task 1: 建立稳定成员身份与最小测试环境

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `vite.config.ts`
- Modify: `src/lib/i18n/types/translations.ts:1-18`
- Modify: `src/lib/i18n/constants/team.ts:28-477`
- Modify: `src/pages/TeamPage.tsx:759-773`（仅补 Sponsor 的 `id`）
- Create: `src/lib/team/members.ts`, `src/lib/team/members.test.ts`

- [ ] **Step 1: 安装 Vitest 并登记测试命令**

运行：

```bash
pnpm add -D vitest
```

在 `package.json` 的 `scripts` 中加入：

```json
"test": "vitest run"
```

在 `vite.config.ts` 保留现有 Vite 配置，新增：

```ts
/// <reference types="vitest/config" />

// defineConfig 返回对象内：
test: {
  include: ['src/**/*.test.ts'],
}
```

预期：`pnpm install --frozen-lockfile` 能成功解析锁文件。

- [ ] **Step 2: 先写唯一身份失败测试**

```ts
import { describe, expect, it } from 'vitest'
import { assertUniqueMemberIds, memberProfilePath } from './members'
import type { TeamMember } from '@/lib/i18n/types/translations'

const person = (id: string, name = id): TeamMember => ({ id, name, role: 'Developer', bio: '', image: '' })

describe('member identity', () => {
  it('creates an encoded profile path', () => {
    expect(memberProfilePath(person('peng-keying'))).toBe('/team/member/peng-keying')
  })

  it('rejects duplicate ids with readable names', () => {
    expect(() => assertUniqueMemberIds([person('zhang-wangwang'), person('zhang-wangwang', '张旺旺')]))
      .toThrow('Duplicate member id "zhang-wangwang": zhang-wangwang, 张旺旺')
  })
})
```

- [ ] **Step 3: 运行测试并确认预期失败**

```bash
pnpm test -- src/lib/team/members.test.ts
```

预期：FAIL，原因是 `members.ts` 不存在，且旧 `TeamMember` 尚无 `id`。

- [ ] **Step 4: 为全部成员和类型添加稳定 id**

`TeamMember` 增加首字段：

```ts
export interface TeamMember {
  /** Stable, URL-safe ASCII identity shared across locales; never use display name as identity. */
  id: string;
  name: string;
  // 其余字段保持不变
}
```

70 条成员常量逐条添加下表 `id`（4 位 Maintainer、16 位 Developer、10 位 Designer、40 位 Contributor）。同一个 `name` 的两条“张旺旺”记录保留独立 `id`，不推断身份合并：

| 分组 | 成员 → id（按常量中现有顺序） |
| --- | --- |
| maintainers | DarrenPig → `darrenpig`；殷统创 → `yin-tongchuang`；许珑译 → `xu-longyi`；张旺旺 → `zhang-wangwang-maintainer` |
| developers | 卞乐凌 → `bian-leling`；卢永杰 → `lu-yongjie`；卢王淳 → `lu-wangchun`；孙诗睿 → `sun-shirui`；孟洁 → `meng-jie`；张娈馨 → `zhang-luanxin`；彭柯尹 → `peng-keying`；文钰婷 → `wen-yuting`；李畅畅 → `li-changchang`；李硕 → `li-shuo`；汪奕希 → `wang-yixi`；王欣怡 → `wang-xinyi`；郭童童 → `guo-tongtong`；闻志伟 → `wen-zhiwei`；陈春林 → `chen-chunlin`；魏卫 → `wei-wei` |
| designers | Xiux → `xiux`；ikkOoOo → `ikkoooo`；印书瑶 → `yin-shuyao`；孙雯艳 → `sun-wenyan`；张岩皓 → `zhang-yanhao`；张若璐 → `zhang-ruolu`；李一楠 → `li-yinan`；李想 → `li-xiang`；王彦君 → `wang-yanjun`；韦彩日 → `wei-cairi` |
| contributors | 夏汪禧 → `xia-wangxi`；洪嘉悦 → `hong-jiayue`；刘小榆 → `liu-xiaoyu`；蔡睿杰 → `cai-ruijie`；严文颖 → `yan-wenying`；余浩铭 → `yu-haoming`；凌敏菲 → `ling-minfei`；刘英琪 → `liu-yingqi`；单广志 → `shan-guangzhi`；吴梦婷 → `wu-mengting`；吴洛斌 → `wu-luobin`；周志 → `zhou-zhi`；孙如婕 → `sun-rujie`；岳添俊 → `yue-tianjun`；崇瑶 → `chong-yao`；崔正阳 → `cui-zhengyang`；庄皓钧 → `zhuang-haojun`；张旺旺 → `zhang-wangwang-contributor`；徐康 → `xu-kang`；徐海婷 → `xu-haiting`；朱靓颖 → `zhu-liangying`；李嘉涵 → `li-jiahan`；杨力涛 → `yang-litao`；杨彩妮 → `yang-caini`；杨鑫海 → `yang-xinhai`；梁新雷 → `liang-xinlei`；殷子豪 → `yin-zihao`；牛良旭 → `niu-liangxu`；王于豪 → `wang-yuhao`；王浩 → `wang-hao`；白逸鸣 → `bai-yiming`；许子涵 → `xu-zihan`；郑绍恺 → `zheng-shaokai`；郑钦文 → `zheng-qinwen`；陆宇豪 → `lu-yuhao`；韩祺冉 → `han-qiran`；顾佳欣 → `gu-jiaxin`；魏鹏程 → `wei-pengcheng`；黄奕 → `huang-yi`；黄宇雯 → `huang-yuwen` |

`SponsorMeta.id` 保持不变；赞助商不是公开成员档案，不参与 `TeamMember.id` 校验。由于 `Sponsor extends TeamMember`，以下两处为满足类型检查补 `id: meta.id`：

```ts
// src/lib/i18n/constants/team.ts 的 sponsors 映射
export const sponsors: Sponsor[] = sponsorMetas.map(meta => ({
  id: meta.id,
  name: meta.name,
  // ...
}))

// src/pages/TeamPage.tsx 的 sponsors useMemo
return {
  id: meta.id,
  name: meta.name,
  // ...
}
```

不要给 `sponsorMetas` 本身增加成员字段，也不要为赞助商创建 `/team/member` 档案。

新增 `src/lib/team/members.ts`：

```ts
import type { TeamMember } from '@/lib/i18n/types/translations'

export function assertUniqueMemberIds(members: TeamMember[]): void {
  const ids = new Map<string, TeamMember>()
  for (const member of members) {
    const existing = ids.get(member.id)
    if (existing) {
      throw new Error(`Duplicate member id "${member.id}": ${existing.name}, ${member.name}`)
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(member.id)) {
      throw new Error(`Invalid member id "${member.id}" for ${member.name}`)
    }
    ids.set(member.id, member)
  }
}

export function memberProfilePath(member: Pick<TeamMember, 'id'>): string {
  return `/team/member/${encodeURIComponent(member.id)}`
}
```

- [ ] **Step 5: 同步中文覆盖身份并验证**

`zh.ts` 的 18 条成员覆盖使用相同 `id`。当前覆盖与常量有少量姓名/图片漂移，本任务只保留现有文案，不擅自纠正真实身份：

| 中文覆盖所在组 | 原姓名 → id |
| --- | --- |
| maintainers | DarrenPig → `darrenpig`；殷统创 → `yin-tongchuang`；许珑译 → `xu-longyi`；张旺旺 → `zhang-wangwang-maintainer` |
| developers | 刘英琪 → `liu-yingqi`；单广志 → `shan-guangzhi`；周志 → `zhou-zhi`；李硕 → `li-shuo`；牛良旭 → `niu-liangxu`；郑钦文 → `zheng-qinwen`；杨力涛 → `yang-litao`；彭柯颖 → `peng-keying` |
| designers | Xiux → `xiux`；ikkOoOo → `ikkoooo`；张若璐 → `zhang-ruolu`；韦彩日 → `wei-cairi`；李一楠 → `li-yinan`；李想 → `li-xiang` |

检查：

```bash
pnpm test -- src/lib/team/members.test.ts
pnpm exec tsc -b
```

预期：测试 PASS；类型检查无缺失 `id`。若出现旧 `TeamMember` 测试夹具缺失，为夹具补唯一 id，不用 `as TeamMember` 绕过校验。

- [ ] **Step 6: 提交身份与测试基础**

```bash
git add package.json pnpm-lock.yaml vite.config.ts src/lib/i18n/types/translations.ts src/lib/i18n/constants/team.ts src/lib/i18n/locales/zh.ts src/pages/TeamPage.tsx src/lib/team/members.ts src/lib/team/members.test.ts
git commit -m "feat(team): establish stable member identities" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: 统一成员数据组装与技术方向归类

**Files:**
- Create: `src/lib/team/tech-modules.ts`, `src/lib/team/tech-modules.test.ts`
- Modify: `src/lib/team/members.ts`, `src/lib/team/members.test.ts`
- Modify: `src/lib/i18n/types/translations.ts:131-161`

- [ ] **Step 1: 写技术方向与语言对齐失败测试**

```ts
import { describe, expect, it } from 'vitest'
import { deriveDirectionIds, keywordMatchesTag } from './tech-modules'

describe('technical direction matching', () => {
  it('matches Chinese substrings and Latin boundaries', () => {
    expect(keywordMatchesTag('STM32', 'STM32 开发板 H7')).toBe(true)
    expect(keywordMatchesTag('AI', 'brain')).toBe(false)
    expect(keywordMatchesTag('嵌入式', '嵌入式开发')).toBe(true)
  })

  it('deduplicates equivalent tags and uses skill names', () => {
    expect(deriveDirectionIds(['AI', '华为云AI'], [{ name: 'ROS', level: 80 }]))
      .toEqual(expect.arrayContaining(['ai', 'robotics']))
  })
})
```

在 `members.test.ts` 添加：

```ts
import { buildMemberDirectory } from './members'
import { translations } from '@/lib/i18n'

describe('localized member directory', () => {
  it('keeps identity and projects stable when Chinese text changes', () => {
    const english = buildMemberDirectory(translations.en.team)
    const chinese = buildMemberDirectory(translations.zh.team)
    expect(chinese).toHaveLength(english.length)
    expect(chinese.find(m => m.id === 'darrenpig')?.role).toContain('实验室')
    expect(chinese.find(m => m.id === 'darrenpig')?.projects).toEqual(
      english.find(m => m.id === 'darrenpig')?.projects,
    )
    expect(new Set(chinese.map(m => m.id)).size).toBe(chinese.length)
  })

  it('does not conflate same-name members', () => {
    const chinese = buildMemberDirectory(translations.zh.team)
    expect(chinese.filter(m => m.name === '张旺旺').map(m => m.id)).toEqual([
      'zhang-wangwang-maintainer', 'zhang-wangwang-contributor',
    ])
  })
})
```

- [ ] **Step 2: 验证新接口尚未实现**

```bash
pnpm test -- src/lib/team/tech-modules.test.ts src/lib/team/members.test.ts
```

预期：FAIL，缺少 `tech-modules.ts` 和 `buildMemberDirectory`。

- [ ] **Step 3: 提取技术模块并实现语言无关分类**

从 `MemberTechDetail.tsx:48-173` 迁移 `TECH_MODULES`、`keywordMatchesTag` 与匹配逻辑，保留原关键词，不改变现有分类结果：

```ts
import type { LucideIcon } from 'lucide-react'
import { Brain, CircuitBoard, Cog, Cpu, Eye, GitBranch, Globe, Layers, Radio, Server, Target, Wrench, Zap } from 'lucide-react'

export interface TechModule {
  id: string
  name: string
  icon: LucideIcon
  keywords: string[]
}

export const TECH_MODULES: TechModule[] = [
  { id: 'control', name: '电控系统', icon: Zap, keywords: ['电控', '电机', '驱动', '电源', 'FOC', '逆变器', '电池管理', 'BMS'] },
  { id: 'embedded', name: '嵌入式开发', icon: Cpu, keywords: ['嵌入式', 'STM32', 'RTOS', '单片机', 'ESP32', 'ARM', 'C语言', '固件'] },
  { id: 'vision', name: '机器视觉', icon: Eye, keywords: ['视觉', '计算机视觉', 'OpenCV', 'YOLO', 'LiDAR', '图像处理', '目标检测'] },
  { id: 'mechanical', name: '机械结构', icon: Cog, keywords: ['机械', '3D建模', 'SolidWorks', '3D打印', 'CAD', '结构', '传动'] },
  { id: 'algorithm', name: '算法与控制', icon: GitBranch, keywords: ['算法', '控制', '运动控制', '路径规划', 'MPC', 'PID', '逆运动学', 'Slam'] },
  { id: 'ai', name: '人工智能', icon: Brain, keywords: ['AI', '深度学习', '神经网络', '华为云AI', '机器学习', '大模型', 'LLM'] },
  { id: 'robotics', name: '机器人中间件', icon: Bot, keywords: ['ROS', 'ROS2', '机器人', 'Gazebo', '仿真', 'MoveIt'] },
  { id: 'fullstack', name: '全栈开发', icon: Globe, keywords: ['全栈', '前端', '后端', 'React', 'Node.js', 'TypeScript', 'Web'] },
  { id: 'hardware', name: '硬件设计', icon: CircuitBoard, keywords: ['硬件', 'PCB', '电路', '原理图', 'Altium', 'KiCad', '信号完整性'] },
  { id: 'industrial', name: '工业设计', icon: Layers, keywords: ['工业设计', '产品设计', '外观', 'CMF', '用户体验', 'UX'] },
  { id: 'devops', name: 'DevOps / 工具链', icon: Wrench, keywords: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'GitHub Actions', '自动化'] },
  { id: 'communication', name: '通信协议', icon: Radio, keywords: ['通信', '星闪', 'NearLink', 'CAN', 'UART', 'SPI', 'I2C', '无线'] },
  { id: 'system', name: '系统架构', icon: Server, keywords: ['系统架构', 'BSP', 'Linux', 'openEuler', '混合关键系统', '实时系统'] },
  { id: 'localization', name: '定位导航', icon: Target, keywords: ['定位', '导航', 'SLAM', '里程计', 'IMU', 'GPS', 'UWB'] },
]

export function keywordMatchesTag(keyword: string, tag: string): boolean {
  const k = keyword.toLowerCase().trim()
  if (!k) return false
  if (/[一-鿿]/.test(k)) return tag.toLowerCase().includes(k)
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i').test(tag)
}

export function deriveDirectionIds(tags: string[] = [], skills: { name: string; level: number }[] = []): string[] {
  const labels = [...tags, ...skills.map(skill => skill.name)]
  return TECH_MODULES.filter(module => labels.some(label => module.keywords.some(keyword => keywordMatchesTag(keyword, label)))).map(module => module.id)
}
```

把 `Bot` 加入 Lucide import。原文件只在本次计划后续任务删除重复定义，避免一次改动破坏页面。

- [ ] **Step 4: 添加类型、i18n 与按 id 的组装层**

在 `Translations.team` 添加：

```ts
memberExplorer: {
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  resultCount: string;
  clearFilters: string;
  noResults: string;
  viewProfile: string;
  relationFilter: string;
  groupLabel: string;
  graph: {
    title: string;
    description: string;
    projectMode: string;
    directionMode: string;
    selectLabel: string;
    noRelations: string;
    graphNotShown: string;
    relatedMembers: string;
    memberListLabel: string;
    projectEvidence: string;
    directionEvidence: string;
    openProfile: string;
  };
};
memberProfile: {
  backToTeam: string;
  notFoundTitle: string;
  notFoundDescription: string;
  untitledSkills: string;
  untitledProjects: string;
  noPublicContact: string;
  copyLink: string;
  linkCopied: string;
  copyInvitation: string;
  invitationCopied: string;
  copyFailed: string;
  invitationTitle: string;
  collaboratorsTitle: string;
  noCollaborators: string;
  sharedProjects: string;
  sharedDirections: string;
  profileTitle: string;
  techDirections: string;
  derivedDirections: string;
  skillsTitle: string;
  tagsTitle: string;
  projectsTitle: string;
  projectDetails: string;
  viewAllProjects: string;
  techMapTitle: string;
};
insights: {
  title: string;
  directionCoverage: string;
  directionCoverageDescription: string;
  projectParticipation: string;
  projectParticipationDescription: string;
  profileCompleteness: string;
  profileCompletenessDescription: string;
  hasSkills: string;
  hasProjects: string;
  hasContact: string;
  multiDirectionNote: string;
  contributionSnapshot: string;
  noDirectionData: string;
  noProjectData: string;
};
directionNames: Record<string, string>;
```

在 `zh.ts` / `en.ts` 为 `team` 添加对应文案；`directionNames` 至少完整覆盖 `TECH_MODULES` 的 14 个 id。示例中文：

```ts
directionNames: {
  control: '电控系统', embedded: '嵌入式开发', vision: '机器视觉', mechanical: '机械结构',
  algorithm: '算法与控制', ai: '人工智能', robotics: '机器人中间件', fullstack: '全栈开发',
  hardware: '硬件设计', industrial: '工业设计', devops: 'DevOps / 工具链',
  communication: '通信协议', system: '系统架构', localization: '定位导航',
},
```

英文为对应方向的英文名称。探索器用“Find a collaborator / Discover members by skills and projects”，档案用“Member profile / Back to team”，无关系文案为“Not enough public information to show connections”，不得宣称成员没有协作者。

`src/lib/team/members.ts` 扩展：

```ts
import { maintainers, developers, designers, contributors } from '@/lib/i18n/constants/team'
import type { Translations } from '@/lib/i18n/types/translations'
import { deriveDirectionIds } from './tech-modules'

export type MemberGroup = 'maintainers' | 'developers' | 'designers' | 'contributors'
export interface MemberRecord extends TeamMember {
  group: MemberGroup
  profilePath: string
  directions: string[]
}
type TeamCopy = Pick<Translations['team'], MemberGroup>

const GROUPS: { group: MemberGroup; members: TeamMember[] }[] = [
  { group: 'maintainers', members: maintainers },
  { group: 'developers', members: developers },
  { group: 'designers', members: designers },
  { group: 'contributors', members: contributors },
]

export function buildMemberDirectory(team: TeamCopy): MemberRecord[] {
  const localized = new Map(GROUPS.flatMap(({ group }) => team[group].map(member => [member.id, member])))
  const members = GROUPS.flatMap(({ group, members }) => members.map(base => {
    const copy = localized.get(base.id)
    const localizedProject = new Map((copy?.projects || []).map(project => [project.id, project]))
    const member = {
      ...base,
      name: copy?.name || base.name,
      role: copy?.role || base.role,
      bio: copy?.bio || base.bio,
      tags: copy?.tags?.length ? copy.tags : base.tags,
      skills: copy?.skills?.length ? copy.skills : base.skills,
      projects: base.projects?.map(project => {
        const localizedProjectText = localizedProject.get(project.id)
        return localizedProjectText
          ? { ...project, name: localizedProjectText.name, role: localizedProjectText.role }
          : project
      }),
    }
    return {
      ...member,
      group,
      profilePath: memberProfilePath(member),
      directions: deriveDirectionIds(base.tags, base.skills),
    }
  }))
  assertUniqueMemberIds(members)
  return members
}

export function findMember(members: MemberRecord[], id: string): MemberRecord | undefined {
  return members.find(member => member.id === id)
}
```

- [ ] **Step 5: 运行纯函数与类型检查**

```bash
pnpm test -- src/lib/team/tech-modules.test.ts src/lib/team/members.test.ts
pnpm exec tsc -b
```

预期：全部 PASS；新增 i18n 中英文键类型完整。

- [ ] **Step 6: 提交共享数据层**

```bash
git add src/lib/i18n/types/translations.ts src/lib/i18n/locales/zh.ts src/lib/i18n/locales/en.ts src/lib/team/members.ts src/lib/team/members.test.ts src/lib/team/tech-modules.ts src/lib/team/tech-modules.test.ts
git commit -m "feat(team): share localized member and direction models" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: 实现搜索、关系与分析纯函数

**Files:**
- Create: `src/lib/team/relations.ts`, `src/lib/team/relations.test.ts`

- [ ] **Step 1: 写失败测试**

使用轻量 `MemberRecord` 工厂，不加载头像：

```ts
import { describe, expect, it } from 'vitest'
import { getCollaborators, getDirectionNodes, getGraphMembers, getProjectNodes, getTeamInsights, searchMembers } from './relations'
// getDirectionCoverage / getProjectCoverage 只由 getTeamInsights 内部使用。
import type { MemberRecord } from './members'

const member = (id: string, tags: string[] = [], projects: { id: string; name: string; role: string }[] = []): MemberRecord => ({
  id, name: id, role: 'Developer', bio: '', image: '', tags, projects,
  group: 'developers', profilePath: `/team/member/${id}`,
  directions: tags.includes('AI') ? ['ai'] : tags.includes('ROS') ? ['robotics'] : [],
})

const people = [
  member('alice', ['AI'], [{ id: '3', name: 'Robot', role: 'Lead' }]),
  member('bob', ['AI', 'ROS'], [{ id: '3', name: 'Robot', role: 'Control' }]),
  member('carol', ['ROS']),
]

describe('member relationships', () => {
  it('intersects real project ids and directions without self', () => {
    const result = getCollaborators(people[0], people)
    expect(result[0].member.id).toBe('bob')
    expect(result[0].sharedProjects.map(p => p.id)).toEqual(['3'])
    expect(result[0].sharedDirectionIds).toEqual(['ai'])
    expect(result.some(r => r.member.id === 'alice')).toBe(false)
  })

  it('combines search and category filters case-insensitively', () => {
    expect(searchMembers(people, 'robot', 'developers').map(m => m.id)).toEqual(['alice', 'bob'])
    expect(searchMembers(people, 'robot', 'maintainers')).toEqual([])
    expect(searchMembers(people, '  AI  ', 'developers').map(m => m.id)).toEqual(['alice', 'bob'])
    expect(searchMembers(people, '人工智能', 'developers', { ai: '人工智能' }).map(m => m.id)).toEqual(['alice', 'bob'])
  })

  it('only exposes nodes shared by at least two people', () => {
    expect(getProjectNodes(people).map(n => n.id)).toEqual(['3'])
    expect(getDirectionNodes(people, { ai: '人工智能', robotics: '机器人中间件' }).map(n => n.id)).toEqual(['robotics'])
  })

  it('caps graph members but never the equivalent list', () => {
    const many = Array.from({ length: 14 }, (_, i) => member(`m-${i}`, ['AI']))
    const graph = getGraphMembers(many, many)
    expect(graph.visible).toHaveLength(12)
    expect(graph.hiddenCount).toBe(2)
    expect(getCollaborators(many[0], many)).toHaveLength(13)
  })

  it('counts direction membership once and reports completeness', () => {
    const extra = [...people, member('dave', ['AI'], [{ id: 'solo', name: 'Solo', role: 'Owner' }])]
    const insights = getTeamInsights(extra, { ai: 'AI', robotics: 'ROS' })
    expect(insights.totalMembers).toBe(4)
    expect(insights.directions.find(d => d.id === 'ai')?.members.length).toBe(3)
    expect(insights.projects.find(p => p.id === '3')?.members.length).toBe(2)
    expect(insights.projects.find(p => p.id === 'solo')?.members.length).toBe(1)
    expect(insights.completeness).toEqual({ withSkills: 4, withProjects: 3, withContact: 0 })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
pnpm test -- src/lib/team/relations.test.ts
```

预期：FAIL，`relations.ts` 不存在。

- [ ] **Step 3: 实现确定性的关系计算**

```ts
import { projects } from '@/data/projects'
import type { TeamMember } from '@/lib/i18n/types/translations'
import type { MemberGroup, MemberRecord } from './members'

export type RelationMode = 'project' | 'direction'
export interface RelationNode { id: string; label: string; members: MemberRecord[] }
export interface Collaborator {
  member: MemberRecord
  sharedProjects: NonNullable<TeamMember['projects']>
  sharedDirectionIds: string[]
}

export function searchMembers(
  members: MemberRecord[],
  query: string,
  group: MemberGroup | 'all',
  directionNames: Record<string, string> = {},
): MemberRecord[] {
  const q = query.trim().toLowerCase()
  const projectTitles = new Map(projects.map(project => [project.id, project.title]))
  return members.filter(member => {
    if (group !== 'all' && member.group !== group) return false
    const projectsText = member.projects?.map(project => `${project.name} ${projectTitles.get(project.id) || ''} ${project.id}`).join(' ') || ''
    const directionsText = member.directions.map(id => directionNames[id] || id).join(' ')
    return !q || `${member.name} ${member.role} ${member.bio} ${member.tags?.join(' ') || ''} ${projectsText} ${directionsText}`.toLowerCase().includes(q)
  })
}

export function getProjectCoverage(members: MemberRecord[]): RelationNode[] {
  const memberProjectNames = new Map(members.flatMap(m => (m.projects || []).map(p => [p.id, p.name])))
  return projects.map(project => ({ id: project.id, label: project.title, members: members.filter(m => m.projects?.some(p => p.id === project.id)) }))
    .concat([...memberProjectNames].filter(([id]) => !projects.some(p => p.id === id)).map(([id, label]) => ({ id, label, members: members.filter(m => m.projects?.some(p => p.id === id)) })))
    .filter(node => node.members.length >= 1)
}

export function getProjectNodes(members: MemberRecord[]): RelationNode[] {
  return getProjectCoverage(members).filter(node => node.members.length >= 2)
}

export function getDirectionCoverage(members: MemberRecord[], names: Record<string, string>): RelationNode[] {
  const ids = [...new Set(members.flatMap(m => m.directions))]
  return ids.map(id => ({ id, label: names[id] || id, members: members.filter(m => m.directions.includes(id)) }))
}

export function getDirectionNodes(members: MemberRecord[], names: Record<string, string>): RelationNode[] {
  return getDirectionCoverage(members, names).filter(node => node.members.length >= 2)
}

export function getCollaborators(current: MemberRecord, members: MemberRecord[]): Collaborator[] {
  const currentProjects = new Set(current.projects?.map(p => p.id))
  const currentDirections = new Set(current.directions)
  return members.filter(m => m.id !== current.id).map(member => ({
    member,
    sharedProjects: member.projects?.filter(p => currentProjects.has(p.id)) || [],
    sharedDirectionIds: member.directions.filter(id => currentDirections.has(id)),
  })).filter(c => c.sharedProjects.length > 0 || c.sharedDirectionIds.length > 0)
    .sort((a, b) => b.sharedProjects.length - a.sharedProjects.length || b.sharedDirectionIds.length - a.sharedDirectionIds.length || members.indexOf(a.member) - members.indexOf(b.member))
}

export function getGraphMembers(allMembers: MemberRecord[], relatedMembers: MemberRecord[]) {
  const ordered = allMembers.filter(member => relatedMembers.some(related => related.id === member.id))
  return { visible: ordered.slice(0, 12), hiddenCount: Math.max(0, ordered.length - 12) }
}

export function getTeamInsights(members: MemberRecord[], directionNames: Record<string, string>) {
  return {
    totalMembers: members.length,
    directions: getDirectionCoverage(members, directionNames),
    projects: getProjectCoverage(members),
    completeness: {
      withSkills: members.filter(m => (m.tags?.length || 0) + (m.skills?.length || 0) > 0).length,
      withProjects: members.filter(m => (m.projects?.length || 0) > 0).length,
      withContact: members.filter(m => m.github || m.gitee || m.email || m.bonjour || m.linkedin).length,
    },
  }
}
```

- [ ] **Step 4: 验证计算**

```bash
pnpm test -- src/lib/team/relations.test.ts
```

预期：5 个成员关系测试全部 PASS。再运行：

```bash
pnpm test
```

预期：此前所有纯函数测试继续 PASS。

- [ ] **Step 5: 提交关系内核**

```bash
git add src/lib/team/relations.ts src/lib/team/relations.test.ts
git commit -m "feat(team): add verifiable member relationship analysis" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: 抽离公共档案内容和真实联系方式

**Files:**
- Create: `src/components/team/MemberContactLinks.tsx`, `src/components/team/MemberProfileContent.tsx`
- Modify: `src/components/team/MemberCard.tsx`, `src/components/team/MemberTechDetail.tsx`
- Modify: `src/lib/team/relations.ts`, `src/lib/team/relations.test.ts`

- [ ] **Step 1: 添加页面级成员解析契约测试**

在 `relations.test.ts` 先添加测试：

```ts
import { getMemberPageContext } from './relations'

it('returns a member with collaborators or null', () => {
  expect(getMemberPageContext('missing', people)).toBeNull()
  expect(getMemberPageContext('alice', people)?.collaborators[0].member.id).toBe('bob')
})
```

运行 `pnpm test -- src/lib/team/relations.test.ts`，确认 FAIL：`getMemberPageContext` 未导出。随后在 `relations.ts` 实现：

```ts
export interface MemberPageContext {
  member: MemberRecord
  collaborators: Collaborator[]
}

export function getMemberPageContext(id: string, members: MemberRecord[]): MemberPageContext | null {
  const member = members.find(item => item.id === id)
  return member ? { member, collaborators: getCollaborators(member, members) } : null
}
```

再次运行，确认 PASS。

- [ ] **Step 2: 把公共联系链接提取为组件**

从 `MemberCard.tsx:30-73` 原样迁移 `SocialLinks` 为具名导出 `MemberContactLinks`，props 为 `{ member: TeamMember; compact?: boolean }`，保留所有现有链接、新窗口的 `noopener noreferrer`、邮件 `mailto:`、可访问标签和图标。删除 `MemberCard.tsx` 中重复实现，并在两处渲染 `MemberContactLinks`。

本任务暂不改变卡片打开方式，也不创建新的卡片导航链接。卡片根节点保留现有 `onClick` 回调，避免在档案路由尚未接入时提前破坏旧交互。所有项目、GitHub、Gitee、邮箱链接继续使用 `onClick={e => e.stopPropagation()}`。

- [ ] **Step 3: 把原详情 UI 重组为档案内容组件**

从 `MemberTechDetail.tsx` 迁移 `SkillBars`、`ModuleTopology`、`ProjectResponsibilityCard`、头像头部、技能、标签和项目 UI 到 `MemberProfileContent.tsx`。新增 props：

```ts
interface MemberProfileContentProps {
  member: MemberRecord
  collaborators: Collaborator[]
  directionNames: Record<string, string>
}
```

将原 `modules` 改为：

```ts
const modules = member.directions.map(id => TECH_MODULES.find(module => module.id === id)).filter((module): module is TechModule => Boolean(module))
```

共享技术分类器用于两处显示，保留原始 `tags` 和已有 `skills.level`。方向标题旁显示 `t.memberProfile.derivedDirections` 以区分推导方向与原始标签。档案头部增加 `t.team.filterLabels[member.group]`。

在技能、项目和协作者为空时分别展示 `untitledSkills`、`untitledProjects`、`noCollaborators`。有资料时才渲染图形，不为空数组画空圆。保留 `ImageProxy`、头像回退和原项目 URL 回退：

```ts
project.url || detail?.projectUrl || detail?.githubUrl || `/projects#project-${project.id}`
```

- [ ] **Step 4: 让档案内协作者可导航并说明依据**

`MemberProfileContent` 使用 `Link` 渲染每位协作者头像、姓名和所属类别，下方列：

```tsx
<Link to={collaborator.member.profilePath}>{collaborator.member.name}</Link>
<span>{collaborator.sharedProjects.map(project => project.name).join(' · ')}</span>
<span>{collaborator.sharedDirectionIds.map(id => directionNames[id] || id).join(' · ')}</span>
```

`MemberTechDetail.tsx` 在本次整合后删除其不再使用的 `Dialog` 和旧实现；若无其它 import，删除文件，并把 `src/pages/TeamPage.tsx` 对该文件的 import 暂时移除。页面其余功能保持不改动，直到 Task 6 正式接入探索器。

- [ ] **Step 5: 检查组件类型、lint 与所有测试**

```bash
pnpm test
pnpm exec tsc -b
pnpm exec eslint src/components/team src/lib/team
```

预期：PASS；无遗留旧 `Dialog` 入口、重复 `SocialLinks`、未使用导入或卡片嵌套链接。

- [ ] **Step 6: 提交档案组件拆分**

```bash
git add src/components/team/MemberCard.tsx src/components/team/MemberContactLinks.tsx src/components/team/MemberProfileContent.tsx src/components/team/MemberTechDetail.tsx src/lib/team/relations.ts src/lib/team/relations.test.ts src/pages/TeamPage.tsx
git commit -m "refactor(team): prepare reusable member profiles" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: 新增可直接访问与分享的成员档案页

**Files:**
- Create: `src/pages/MemberProfilePage.tsx`
- Modify: `src/App.tsx:1-115`

- [ ] **Step 1: 实现档案页与未知成员状态**

```tsx
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/contexts/LanguageContext'
import { Header } from '@/components/layout/Header'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { MemberProfileContent } from '@/components/team/MemberProfileContent'
import { buildMemberDirectory } from '@/lib/team/members'
import { getMemberPageContext } from '@/lib/team/relations'

export function MemberProfilePage() {
  const t = useTranslation()
  const { memberId = '' } = useParams()
  const members = useMemo(
    () => buildMemberDirectory(t.team),
    [t.team.maintainers, t.team.developers, t.team.designers, t.team.contributors],
  )
  const context = getMemberPageContext(memberId, members)
  const [fallbackText, setFallbackText] = useState<string | null>(null)
  const profileUrl = context ? `${window.location.origin}${context.member.profilePath}` : ''
  const shared = context?.collaborators[0]
  const sharedText = shared
    ? [...shared.sharedProjects.map(project => project.name), ...shared.sharedDirectionIds.map(id => t.team.directionNames[id] || id)].join(' / ')
    : ''
  const invitation = context
    ? [t.team.memberProfile.invitationTitle, context.member.name, context.member.tags?.slice(0, 3).join(' · '), sharedText, profileUrl].filter(Boolean).join('\n')
    : ''

  async function copyText(text: string, successMessage: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setFallbackText(null)
      toast.success(successMessage)
    } catch {
      setFallbackText(text)
      toast.error(t.team.memberProfile.copyFailed)
    }
  }

  if (!context) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold">{t.team.memberProfile.notFoundTitle}</h1>
          <p className="mt-3 text-muted-foreground">{t.team.memberProfile.notFoundDescription}</p>
          <Button asChild className="mt-6"><Link to="/team">{t.team.memberProfile.backToTeam}</Link></Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <SEO title={`${context.member.name} | ${t.team.memberProfile.profileTitle}`} description={context.member.bio} path={context.member.profilePath} />
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />{t.team.memberProfile.backToTeam}
        </Link>
        <MemberProfileContent
          member={context.member}
          collaborators={context.collaborators}
          directionNames={t.team.directionNames}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => copyText(profileUrl, t.team.memberProfile.linkCopied)}>{t.team.memberProfile.copyLink}</Button>
          <Button variant="outline" onClick={() => copyText(invitation, t.team.memberProfile.invitationCopied)}>{t.team.memberProfile.copyInvitation}</Button>
        </div>
        {fallbackText !== null && (
          <textarea
            className="mt-3 min-h-24 w-full rounded-md border border-border bg-muted/30 p-3 text-sm"
            readOnly
            autoFocus
            aria-label={t.team.memberProfile.copyFailed}
            value={fallbackText}
            onFocus={event => event.currentTarget.select()}
          />
        )}
      </div>
    </main>
  )
}
```

所有 hooks 都在 `if (!context)` 之前调用，避免条件分支改变 hooks 数量。分享与邀约只操作本地剪贴板。

- [ ] **Step 2: 添加复制链接与纯本地邀约**

在 `MemberProfilePage` 中实现：

```ts
const [fallbackText, setFallbackText] = useState<string | null>(null)
const profileUrl = `${window.location.origin}${context.member.profilePath}`
const shared = context.collaborators[0]
const sharedText = shared
  ? [...shared.sharedProjects.map(p => p.name), ...shared.sharedDirectionIds.map(id => t.team.directionNames[id] || id)].join(' / ')
  : ''
const invitation = [
  `${t.team.memberProfile.invitationTitle} ${context.member.name}`,
  context.member.tags?.slice(0, 3).join(' · '),
  sharedText,
  profileUrl,
].filter(Boolean).join('\n')

async function copyText(text: string, successMessage: string) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
    setFallbackText(null)
    toast.success(successMessage)
  } catch {
    setFallbackText(text)
    toast.error(t.team.memberProfile.copyFailed)
  }
}
```

按钮分别调用 `copyText(profileUrl, t.team.memberProfile.linkCopied)` 和 `copyText(invitation, t.team.memberProfile.invitationCopied)`。当 `fallbackText !== null` 时显示只读、自动选中文本的 `<textarea aria-label={t.team.memberProfile.copyFailed}>`。使用现有 `sonner` 的 `toast`，不发网络请求、不打开第三方 URL、不自动发送邀约。联系区由 `MemberProfileContent` 的 `MemberContactLinks` 展示。

- [ ] **Step 3: 注册懒加载路由**

`App.tsx` 添加：

```tsx
const MemberProfilePage = React.lazy(() => import('@/pages/MemberProfilePage').then(module => ({ default: module.MemberProfilePage })))

// 必须位于 /team 之前：
<Route path="/team/member/:memberId" element={<MemberProfilePage />} />
<Route path="/team" element={<TeamPage />} />
```

- [ ] **Step 4: 运行测试、类型检查及构建**

```bash
pnpm test
pnpm exec tsc -b
pnpm build
```

预期：构建 PASS，`dist/team/index.html` 与 `dist/index.html` 正常生成；首版不生成成员独立静态快照。记录 build 输出中已有而非本功能引起的警告。

- [ ] **Step 5: 提交档案路由**

```bash
git add src/App.tsx src/pages/MemberProfilePage.tsx
git commit -m "feat(team): add shareable member profile pages" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: 团队页成员搜索与目录旁协作关系图

**Files:**
- Create: `src/components/team/CollaborationGraph.tsx`, `src/components/team/MemberExplorer.tsx`
- Modify: `src/components/team/MemberCard.tsx`
- Modify: `src/pages/TeamPage.tsx:161-177,315-425,499-566,729-756,816-882`

- [ ] **Step 1: 实现可访问的关系图组件**

Props 固定为：

```ts
interface CollaborationGraphProps {
  members: MemberRecord[]
  directionNames: Record<string, string>
  labels: Translations['team']['memberExplorer']['graph']
  selectedRelation: { mode: RelationMode; id: string } | null
  onRelationChange: (relation: { mode: RelationMode; id: string } | null) => void
}
```

状态与选中逻辑：

```ts
const [mode, setMode] = useState<RelationMode>('project')
const nodes = mode === 'project' ? getProjectNodes(members) : getDirectionNodes(members, directionNames)
const selectedId = selectedRelation?.mode === mode ? selectedRelation.id : null
const selected = nodes.find(node => node.id === selectedId) || nodes[0]
```

默认焦点只用于展示，不写入 `selectedRelation`，因此首次进入不会意外过滤成员目录。若 `nodes` 为空显示 `labels.noRelations`；若 `selected` 仍为空，在调用 `getGraphMembers` 前直接返回空状态。切换模式的交互固定为：

```tsx
<Button
  type="button"
  variant={mode === 'project' ? 'default' : 'outline'}
  aria-pressed={mode === 'project'}
  onClick={() => { setMode('project'); onRelationChange(null) }}
>{labels.projectMode}</Button>
<Button
  type="button"
  variant={mode === 'direction' ? 'default' : 'outline'}
  aria-pressed={mode === 'direction'}
  onClick={() => { setMode('direction'); onRelationChange(null) }}
>{labels.directionMode}</Button>
```

焦点选择器使用可见标签和原生 `<select>`，不使用现有样式组件，以降低键盘和移动端风险：

```tsx
<label htmlFor="member-relation-focus" className="text-sm font-medium">{labels.selectLabel}</label>
<select
  id="member-relation-focus"
  value={selected.id}
  onChange={event => onRelationChange({ mode, id: event.target.value })}
  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
>
  {nodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}
</select>
```

调用方从 `selectedRelation` 计算目录筛选，不从图的默认焦点计算。

SVG 采用 `viewBox="0 0 320 280"`，中心 `(160, 130)`，半径 `96`。节点位置：

```ts
const count = graph.visible.length
const angle = (index / count) * Math.PI * 2 - Math.PI / 2
const x = 160 + 96 * Math.cos(angle)
const y = 130 + 96 * Math.sin(angle)
```

`const graph = getGraphMembers(members, selected.members)`；先画从中心到可见节点的 `<line>`，中心节点 `<text>` 为 `selected.label`。每个周围节点使用可聚焦 `<g>`，不是 HTML `<a>`：

```tsx
const navigate = useNavigate()

<g
  key={member.id}
  role="link"
  tabIndex={0}
  aria-label={`${labels.openProfile}: ${member.name}`}
  className="cursor-pointer focus:outline-none focus-visible:stroke-primary"
  onClick={() => navigate(member.profilePath)}
  onKeyDown={event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(member.profilePath)
    }
  }}
>
  <circle cx={x} cy={y} r="20" className="fill-card stroke-primary/40" />
  <text x={x} y={y + 4} textAnchor="middle" className="fill-foreground text-[9px]">{member.name.slice(0, 2)}</text>
  <text x={x} y={y + 34} textAnchor="middle" className="fill-foreground text-[9px]">{member.name}</text>
</g>
```

SVG 设置 `<title>{labels.title}</title>` 和 `<desc>{labels.description}</desc>`；可视化容器加 `role="group"` 与 `aria-label={labels.title}`。移动端不构造 SVG，因此用媒体查询状态条件渲染，而不是只加 `hidden`：

```tsx
const [canRenderGraph, setCanRenderGraph] = useState(false)
useEffect(() => {
  const query = window.matchMedia('(min-width: 1024px)')
  const update = () => setCanRenderGraph(query.matches)
  update()
  query.addEventListener('change', update)
  return () => query.removeEventListener('change', update)
}, [])
```

只在 `canRenderGraph` 为真时渲染 `<svg>`；完整列表始终渲染：

```tsx
<ul aria-label={labels.memberListLabel}>
  {selected.members.map(member => <li key={member.id}><Link to={member.profilePath}>{member.name}</Link></li>)}
</ul>
{graph.hiddenCount > 0 && <p>{labels.graphNotShown}: {graph.hiddenCount}</p>}
```

列表在移动端折叠面板中展示，不渲染 SVG。所有文案来自 `labels`；SVG 节点通过 `navigate` 进入档案，列表通过 `Link` 进入同一档案。中心焦点下方显示当前范围和 `selected.members.length`。

- [ ] **Step 2: 用 `MemberExplorer` 统一筛选状态**

Props：

```ts
interface MemberExplorerProps {
  members: MemberRecord[]
  groupLabels: Translations['team']['filterLabels']
  labels: Translations['team']['memberExplorer']
  directionNames: Record<string, string>
  selectedRatio: AspectRatio
}
```

状态：

```ts
const [query, setQuery] = useState('')
const [group, setGroup] = useState<MemberGroup | 'all'>('all')
const [relation, setRelation] = useState<{ mode: 'project' | 'direction'; id: string } | null>(null)
```

`MemberExplorer` 把 `relation` 同时传给图的受控属性和目录筛选。只有用户真正选择关系节点或方向时才设置 `relation`；图默认焦点不设置。清除按钮把 `query`、`group`、`relation` 一并重置。实现：

```ts
const searched = searchMembers(members, query, group, directionNames)
const relationNode = relation
  ? (relation.mode === 'project' ? getProjectNodes(members) : getDirectionNodes(members, directionNames)).find(node => node.id === relation.id)
  : null
const visible = relationNode
  ? searched.filter(member => relationNode.members.some(related => related.id === member.id))
  : searched
const grouped = (['maintainers', 'developers', 'designers', 'contributors'] as const)
  .map(group => ({ group, members: visible.filter(member => member.group === group) }))
  .filter(section => section.members.length > 0)
```

关系范围以可移除标签显示，仅清除关系时保留搜索和角色筛选：

```tsx
{relationNode && (
  <div className="flex items-center gap-2 text-sm">
    <span>{labels.relationFilter}: {relationNode.label}</span>
    <Button type="button" variant="ghost" size="sm" onClick={() => setRelation(null)}>
      {labels.clearFilters}
    </Button>
  </div>
)}
```

全部清除时一次性重置：

```ts
const clearFilters = () => {
  setQuery('')
  setGroup('all')
  setRelation(null)
}
```

右列关系面板在桌面默认展示，在移动端默认折叠，但仍暴露完整列表：

```tsx
const [showRelations, setShowRelations] = useState(false)

<Button
  type="button"
  variant="outline"
  className="mb-4 w-full lg:hidden"
  aria-expanded={showRelations}
  aria-controls="member-relations-panel"
  onClick={() => setShowRelations(value => !value)}
>
  {labels.graph.relatedMembers}
</Button>
<aside
  id="member-relations-panel"
  aria-label={labels.title}
  className={cn('self-start xl:sticky xl:top-24', showRelations ? 'block' : 'hidden', 'lg:block')}
>
  <CollaborationGraph
    members={members}
    directionNames={directionNames}
    labels={labels.graph}
    selectedRelation={relation}
    onRelationChange={setRelation}
  />
</aside>
```

桌面布局 `grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]`；左列遍历 `grouped`，使用已有分组标题和 `MemberCard`；右列 `xl:sticky xl:top-24 self-start`。375px 视口不出现横向溢出。

将 `MemberCard` props 改为 `{ member: MemberRecord; profileLabel: string; ... }`，卡片根节点可用键盘打开档案，但内部真实链接仍可独立操作：

```tsx
const navigate = useNavigate()
const openProfile = () => navigate(member.profilePath)

<Card
  className={cn(CARD_BASE_STYLES, 'cursor-pointer')}
  role="link"
  tabIndex={0}
  aria-label={`${profileLabel}: ${member.name}`}
  onClick={(event) => {
    if ((event.target as HTMLElement).closest('a, button')) return
    openProfile()
  }}
  onKeyDown={(event) => {
    if ((event.target as HTMLElement).closest('a, button')) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProfile()
    }
  }}
>
  {/* 现有头像、姓名、角色、技能、项目内容 */}
  <div className="px-4 pb-4">
    <Link
      to={member.profilePath}
      onClick={event => event.stopPropagation()}
      className="text-sm font-medium text-primary hover:underline"
    >
      {profileLabel}
    </Link>
  </div>
</Card>
```

不能把整张含项目、GitHub、邮箱链接的卡片包进另一个 `<Link>`。内部链接继续 `stopPropagation()`，不会触发卡片导航。

- [ ] **Step 3: 接入 `TeamPage`，删除弹窗状态**

在 `TeamPage` 中：

```ts
const members = useMemo(() => buildMemberDirectory(t.team), [t.team.maintainers, t.team.developers, t.team.designers, t.team.contributors])
```

替换 `selectedMember`、旧 `filteredMembers`、只按角色过滤的 `handleFilterChange` 和 `MemberTechDetail`，改为：

```tsx
<MemberExplorer
  members={members}
  groupLabels={t.team.filterLabels}
  labels={t.team.memberExplorer}
  directionNames={t.team.directionNames}
  selectedRatio={selectedRatio}
/>
```

成员滚动条 `allMembers` 使用 `members`；其 `key` 用 `member.id`，而不是 `github || gitee || email || name`。保留 Hero 动画、合照、赞助商和贡献统计。若有空结果，显示 `labels.noResults` 和 `labels.clearFilters`，清除动作同时重置 `query`、`group` 和 `relation`。

- [ ] **Step 4: 检查页面与控制台**

先准备 `.claude/launch.json` 的 `dev` 配置（本地、不入库），运行 `pnpm dev -- --port 5173`，再用 Browser Preview 打开 `/team`。验证：

- 搜索 `嵌入式`，再切换角色；清除筛选恢复 70 条公开记录。
- 选择项目、技术方向，图、列表和目录保持一致。
- 点击成员进入 `/team/member/<id>`，返回团队页。
- 控制台无 React 嵌套链接、缺失 key 或 SVG 错误。
- 375px 宽度无 `document.documentElement.scrollWidth > window.innerWidth`。

若开发端口已被占用，使用另一个空闲端口，不停止其它工作区的服务器。

- [ ] **Step 5: 自动检查并提交**

```bash
pnpm test
pnpm exec eslint src/pages/TeamPage.tsx src/components/team
pnpm exec tsc -b
```

预期：PASS。

```bash
git add src/pages/TeamPage.tsx src/components/team/MemberExplorer.tsx src/components/team/CollaborationGraph.tsx src/components/team/MemberCard.tsx
git commit -m "feat(team): add member discovery and collaboration graph" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: 补齐成员分析指标与统计口径

**Files:**
- Create: `src/components/team/TeamInsights.tsx`
- Modify: `src/pages/TeamPage.tsx:729-748,884-970`
- Modify: `src/components/home/TeamAnalysisSection.tsx:34-235`

- [ ] **Step 1: 用共享分析数据替换分散统计**

`TeamInsights` props：

```ts
interface TeamInsightsProps {
  members: MemberRecord[]
  directionNames: Record<string, string>
  labels: Translations['team']['insights']
}
```

计算：

```ts
const insights = getTeamInsights(members, directionNames)
```

完整组件：

```tsx
import { BarChart3, FolderOpen, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Translations } from '@/lib/i18n/types/translations'
import type { MemberRecord } from '@/lib/team/members'
import { getTeamInsights } from '@/lib/team/relations'

interface TeamInsightsProps {
  members: MemberRecord[]
  directionNames: Record<string, string>
  labels: Translations['team']['insights']
}

export function TeamInsights({ members, directionNames, labels }: TeamInsightsProps) {
  const insights = getTeamInsights(members, directionNames)
  const percent = (count: number) => insights.totalMembers ? Math.round((count / insights.totalMembers) * 100) : 0
  const completeness = [
    { label: labels.hasSkills, count: insights.completeness.withSkills },
    { label: labels.hasProjects, count: insights.completeness.withProjects },
    { label: labels.hasContact, count: insights.completeness.withContact },
  ]

  return (
    <section aria-labelledby="team-insights-title" className="mb-8">
      <h3 id="team-insights-title" className="mb-4 text-xl font-semibold">{labels.title}</h3>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-5 w-5 text-primary" />{labels.directionCoverage}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">{labels.directionCoverageDescription}</p>
            {insights.directions.map(direction => (
              <div key={direction.id}>
                <div className="flex justify-between gap-3 text-sm"><span>{direction.label}</span><span className="text-muted-foreground">{direction.members.length} · {percent(direction.members.length)}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percent(direction.members.length)}%` }} /></div>
              </div>
            ))}
            {insights.directions.length === 0 && <p className="text-sm text-muted-foreground">{labels.noDirectionData}</p>}
            <p className="text-xs text-muted-foreground">{labels.multiDirectionNote}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FolderOpen className="h-5 w-5 text-primary" />{labels.projectParticipation}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">{labels.projectParticipationDescription}</p>
            {insights.projects.map(project => (
              <div key={project.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate">{project.label}</span><span className="shrink-0 text-muted-foreground">{project.members.length}</span></div>
            ))}
            {insights.projects.length === 0 && <p className="text-sm text-muted-foreground">{labels.noProjectData}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="h-5 w-5 text-primary" />{labels.profileCompleteness}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">{labels.profileCompletenessDescription}</p>
            {completeness.map(item => (
              <div key={item.label}>
                <div className="flex justify-between gap-3 text-sm"><span>{item.label}</span><span className="text-muted-foreground">{item.count} / {insights.totalMembers} · {percent(item.count)}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${percent(item.count)}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
```

不显示综合分，不把方向百分比求和，不将技能覆盖解释为能力水平。两个空状态分别使用 `noDirectionData` 与 `noProjectData`，不冒充数据为空的原因是“成员没有能力”或“没有协作者”。

- [ ] **Step 2: 团队页替换旧角色统计与表格**

在 `TeamPage` 使用 `members` 与 `getTeamInsights(members, t.team.directionNames)` 获取角色计数。角色统计直接按：

```ts
const counts = Object.fromEntries(['maintainers', 'developers', 'designers', 'contributors'].map(group => [group, members.filter(member => member.group === group).length]))
```

贡献区标题说明包含 `t.team.insights.contributionSnapshot` 与 `teamGiteeStats.generatedAt`，不使用“当前活跃”。在现有贡献统计前插入：

```tsx
<TeamInsights members={members} directionNames={t.team.directionNames} labels={t.team.insights} />
```

旧“Detailed Analytics Table”若与新增分析重复，替换为 `TeamInsights`；保留现有真实贡献数据和角色职责说明。`teamStats` 的旧 `t.team.*.length` 不再使用。

- [ ] **Step 3: 首页概览复用同一数据源**

`TeamAnalysisSection` 替换分散的 `maintainers.length + ...`：

```ts
const members = useMemo(() => buildMemberDirectory(t.team), [t.team.maintainers, t.team.developers, t.team.designers, t.team.contributors])
const totalMembers = members.length
const composition = [
  { label: t.team.maintainerTitle, count: members.filter(m => m.group === 'maintainers').length, icon: Trophy },
  { label: t.team.developerTitle, count: members.filter(m => m.group === 'developers').length, icon: Code2 },
  { label: t.team.designerTitle, count: members.filter(m => m.group === 'designers').length, icon: Users },
  { label: t.team.contributorTitle, count: members.filter(m => m.group === 'contributors').length, icon: BarChart3 },
]
```

新增 `useMemo` import，移除四组数组 import。首页本次不添加关系图或新后台。确保同一快照日期与贡献数字仍来自 `team-gitee-stats.json`。

- [ ] **Step 4: 验证指标一致性**

```bash
pnpm test
pnpm exec tsc -b
pnpm exec eslint src/pages/TeamPage.tsx src/components/home/TeamAnalysisSection.tsx src/components/team/TeamInsights.tsx
```

预期：PASS。浏览器比较首页与团队页：总人数均为 70；四类人数分别为 4、16、10、40。若上游数据在实现期间被修改，以共享 `members` 的新数字为准，不硬编码测试中的固定总数。

- [ ] **Step 5: 提交分析指标**

```bash
git add src/pages/TeamPage.tsx src/components/home/TeamAnalysisSection.tsx src/components/team/TeamInsights.tsx
git commit -m "feat(team): add skill coverage and profile insights" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: 浏览器回归、可访问性与最终构建

**Files:**
- Modify: only files needed for verified defects in Tasks 1-7
- Modify: `docs/superpowers/specs/2026-11-25-member-analysis-interaction-design.md` status only if accepted

- [ ] **Step 1: 运行完整自动验证**

```bash
pnpm test
pnpm lint
pnpm build
```

预期：三项 exit code 0。若全仓 lint 存在本功能之外的旧错误，记录原始错误和所属文件，修复本功能新增错误，不宣称全仓 lint 通过。

- [ ] **Step 2: 验证成员探索和路由**

在 Browser Preview 依次操作：

1. `/team`：搜索、分类、关系节点、清除、无结果状态。
2. `/team/member/zhang-wangwang-maintainer`：显示维护者角色和原技能/项目。
3. `/team/member/zhang-wangwang-contributor`：显示贡献者角色，不与前者串档。
4. `/team/member/not-a-member`：显示未找到和返回团队按钮。
5. 有项目的成员如 `/team/member/darrenpig`：项目与协作者依据正确。
6. 无技能成员如 `/team/member/meng-jie`：显示未填写与关系不足，不显示“零贡献”或虚假能力。
7. 中英文切换：文案和方向名更新，`id` 和项目关系不变化。

- [ ] **Step 3: 验证复制和联系边界**

允许剪贴板时点击“复制链接”与“复制邀约”，确认 toast 成功、剪贴板包含正确 URL、没有网络发送。

通过 Browser Preview 的 eval 为测试暂时注入拒绝实现：

```js
Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied') } } })
```

点击复制后应出现失败反馈与可手动选择的文本框，不显示成功。页面刷新后恢复真实剪贴板，不把测试补丁留在代码里。

- [ ] **Step 4: 验证移动端、键盘与减少动画**

Browser Preview 使用 `mobile` preset 并刷新。检查：

- `document.documentElement.scrollWidth <= window.innerWidth`。
- 搜索、分类和折叠的相关成员列表可用，无 SVG 复杂图形。
- Tab 可依次进入搜索、筛选、卡片、关系列表和公开联系链接，Enter 可打开成员档案。
- `colorScheme` 切换后文字与关系图有可读对比度。
- 使用 `prefers-reduced-motion` 环境时无强制非必要动效；若 CSS 只覆盖旧动画，为新组件加 `@media (prefers-reduced-motion: reduce)` 降低过渡，不隐藏信息。

- [ ] **Step 5: 检查最终变更并准备交付**

```bash
git status --short
git diff --check main...HEAD
git log --oneline main..HEAD
```

确认没有 `.superpowers/`、`node_modules/`、真实剪贴板测试补丁或无关文件。规格状态在用户确认功能后更新为“已实现并通过列出的验证”；未验证项在交付说明明确列出。

最终向用户报告：实现文件、测试结果、实际浏览器路径、已知资料质量限制，以及“未实现站内私信/自动发送邀约”的边界。不未经要求推送或创建 PR。
