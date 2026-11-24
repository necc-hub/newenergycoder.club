/**
 * NEC HUB 项目库
 *
 * 数据原则：所有描述、仓库路径与状态均来自对应仓库的真实 README / 文档，
 * 不编造 star 数、参与人数、完成度。仓库结构变动时请同步更新 repoUrl。
 *
 * 双语：文案统一走 i18n（src/lib/i18n/locales/projectDetails/{zh,en}.ts），
 * 本文件只保存与语言无关的结构化信息。
 */
import { projectDetails } from '@/lib/i18n/locales/projectDetails'

export type ProjectCategory =
  | 'all'
  | 'web'
  | 'mobile'
  | 'ai'
  | 'iot'
  | 'embedded'
  | 'robotics'
  | 'research'
  | 'aerospace'
  | 'system'
  | 'docs'
  | 'other'

/** active=活跃维护中 / development=开发中 / seasonal=按赛季推进 / archived=阶段性归档（可继续接手） */
export type ProjectStatus = 'active' | 'development' | 'seasonal' | 'archived'

export interface ProjectLink {
  label: { zh: string; en: string }
  url: string
}

export interface Project {
  /** 稳定 ID：成员页代表作链接依赖此 ID，改名请保持兼容 */
  id: string
  title: string
  /** 卡片摘要（i18n key） */
  description: string
  /** 封面图：优先使用仓库里的真实实拍/截图，软件项目用代码排版封面 */
  image?: string
  category: ProjectCategory
  technologies: string[]
  /** 项目归属：主仓库 / 团队 / 个人主线仓库 */
  author: string
  /** 立项或首个提交时间 */
  date: string
  status: ProjectStatus
  /** 独立部署的在线访问地址 */
  projectUrl?: string
  /** 主代码仓（GitHub / Gitee） */
  githubUrl?: string
  /** Gitee 镜像 */
  giteeUrl?: string
  /** 在卡片上标记为重点项目 */
  featured?: boolean
  /** 详情里的补充链接（文档 / 白皮书 / 关联项目等） */
  extraLinks?: ProjectLink[]
}

export const projects: Project[] = [
  {
    id: '9',
    title: 'SolarGlyph 光伏储能设计平台',
    description: 'solarglyph',
    image: '/images/projects/solarglyph.jpg',
    category: 'web',
    technologies: ['React 18', 'TypeScript', 'Three.js', '8760 仿真', 'IRR 测算', 'DXF/PDF 导出'],
    author: 'Darrenpig',
    date: '2026-07-06',
    status: 'active',
    featured: true,
    projectUrl: 'https://solarglyph.newenergycoder.club/',
    githubUrl: 'https://github.com/Darrenpig/SolarGlyph',
    extraLinks: [
      { label: { zh: 'EMC 信息收集门户', en: 'EMC Intake Portal' }, url: 'https://solarglyph.newenergycoder.club/emc-portal/' },
    ],
  },
  {
    id: '10',
    title: '416MES 实验室仓储管理系统',
    description: '416mes',
    category: 'web',
    technologies: ['单文件 Web 应用', 'IndexedDB', '离线队列', '飞书多维表', '标签打印', '审计日志'],
    author: 'NEC 电控组',
    date: '2026-09-12',
    status: 'active',
    featured: true,
    projectUrl: 'https://mes.newenergycoder.club/',
    githubUrl: 'https://github.com/necc-hub/416mes',
  },
  {
    id: '11',
    title: 'nec-hub 团队 AI 中台',
    description: 'necHub',
    category: 'web',
    technologies: ['Cloudflare Workers', 'Vue 3', 'MCP', 'D1 / KV / R2', '飞书 OAuth'],
    author: 'NEC 团队',
    date: '2026-06-01',
    status: 'active',
    projectUrl: 'https://hub.newenergycoder.club/',
    githubUrl: 'https://github.com/necc-hub/nec-hub',
    extraLinks: [{ label: { zh: 'MCP 接入指南', en: 'MCP Setup Guide' }, url: 'https://hub.newenergycoder.club/mcp' }],
  },
  {
    id: '1',
    title: '5 轴流体工作站',
    description: 'fluidWorkstation',
    image: '/images/projects/fluid-workstation.jpg',
    category: 'iot',
    technologies: ['树莓派 5', 'Modbus RTU', 'RS485', 'Python', 'Qt/QML', 'PyModbus'],
    author: 'Darrenpig · 殷统创 · 单广志 等',
    date: '2025-03-19',
    status: 'active',
    githubUrl: 'https://github.com/Darrenpig/5-axis-fluid-workstation',
    extraLinks: [
      {
        label: { zh: '社区仓项目文档', en: 'Project docs (community repo)' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/5axis-fluid-workstation',
      },
    ],
  },
  {
    id: '12',
    title: 'CURC ROBOCON 赛季工程',
    description: 'robocon',
    image: '/images/projects/robocon-chassis.jpg',
    category: 'robotics',
    technologies: ['STM32H7', 'M3508 电机', '麦克纳姆底盘', '机器视觉', '气动控制', '机械设计'],
    author: 'NEC 战队 · 机构/视觉/运营 SIG',
    date: '2024-01-01',
    status: 'seasonal',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/competitions/CURC2026ROBOCON',
    extraLinks: [
      {
        label: { zh: '2026 赛季仓', en: '2026 Season repo' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/tree/master/competitions/CURC2026ROBOCON',
      },
      {
        label: { zh: '2025 赛季回顾', en: '2025 Season' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/tree/master/competitions/2025-robocon',
      },
      {
        label: { zh: '2024 赛季回顾', en: '2024 Season' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/tree/master/competitions/2024-robocon',
      },
    ],
  },
  {
    id: '2',
    title: '星闪手柄（WS63）',
    description: 'nearlink',
    image: '/images/projects/nearlink-controller.jpg',
    category: 'embedded',
    technologies: ['WS63', 'NearLink 星闪', 'OpenHarmony', 'LiteOS', 'fbb_ws63 SDK'],
    author: '单广志 · NEC 嵌入式组',
    date: '2025-04-26',
    status: 'development',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/星闪手柄',
  },
  {
    id: '3',
    title: '人形机器人主线（Duma）',
    description: 'humanoid',
    category: 'robotics',
    technologies: ['ROS 2', 'openEuler Embedded', '星闪通信', '运动控制', '步态规划'],
    author: 'NEC 机器人组',
    date: '2024-12-01',
    status: 'development',
    projectUrl: '/whitepapers/NEC新能源开发者社区-机器人.pdf',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/robotics/人形机器人',
    extraLinks: [
      {
        label: { zh: '2025 节能减排赛 · Duma', en: 'Duma @ 2025 Energy Saving Contest' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/tree/master/competitions/2025-energy-saving-duma',
      },
    ],
  },
  {
    id: '13',
    title: 'MechDog 轮腿机器狗（K230 + KFS）',
    description: 'mechdog',
    category: 'robotics',
    technologies: ['K230', 'KFS', 'ESP32-S3', 'Arduino', '人脸/颜色识别', 'IoT 控制'],
    author: 'NEC 机器人组',
    date: '2025-05-01',
    status: 'development',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/robotics/机器狗-k230',
  },
  {
    id: '6',
    title: 'UMI 低成本灵巧手',
    description: 'dexterousHand',
    category: 'robotics',
    technologies: ['空心杯电机', '腱绳传动', '多传感器融合', '模块化机械', 'UR5 路径规划'],
    author: 'NEC 科研横向 · 许珑译 / 李硕',
    date: '2025-03-01',
    status: 'development',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/dexterous-hand.md',
  },
  {
    id: '7',
    title: 'MICA 混合关键部署验证',
    description: 'mica',
    category: 'system',
    technologies: ['openEuler Embedded', 'RT-Thread', 'MICA', 'OpenAMP', 'Yocto', 'QEMU'],
    author: 'NEC 科研横向 · 殷统创',
    date: '2024-10-20',
    status: 'active',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/research-horizontal/mica-validation',
    extraLinks: [
      {
        label: { zh: '篮球发球机器人整机方案', en: 'Basketball launcher design' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/hicar-pi5-progress.md',
      },
    ],
  },
  {
    id: '4',
    title: '飞控通讯（PX4 双下位机）',
    description: 'flightControl',
    category: 'aerospace',
    technologies: ['PX4-Autopilot', 'MAVLink', 'C/C++', '双下位机通讯', '单手柄控制'],
    author: 'Darrenpig · yansonkun · 仇俊彤',
    date: '2025-05-10',
    status: 'archived',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/robotics/飞控通讯',
  },
  {
    id: '8',
    title: '3D 打印成型 SIG',
    description: 'printing3d',
    image: '/images/projects/3d-printing-parts.jpg',
    category: 'research',
    technologies: ['FDM 3D 打印', 'CAD 建模', '工艺优化', '后处理', '机器人结构件'],
    author: '王于豪 · 王露洁',
    date: '2024-07-10',
    status: 'active',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/3d-printing-sig.md',
  },
  {
    id: '14',
    title: 'NEC 文档站',
    description: 'docs',
    category: 'docs',
    technologies: ['Mintlify', 'MDX', 'CI 链接检查', '飞书 Wiki 导入', 'R2 CDN'],
    author: 'NEC 文档组',
    date: '2025-06-01',
    status: 'active',
    projectUrl: 'https://docs.newenergycoder.club/',
    githubUrl: 'https://github.com/necc-hub/docs',
  },
  {
    id: '15',
    title: 'SKill 技能库',
    description: 'skills',
    category: 'ai',
    technologies: ['AI Coding Skills', 'Claude Code', 'Kimi CLI', 'Trae', 'ESP32-S3 固件'],
    author: 'NEC 团队',
    date: '2026-06-14',
    status: 'active',
    githubUrl: 'https://github.com/necc-hub/SKill',
  },
  {
    id: '5',
    title: '科研横向项目集（企业真实命题）',
    description: 'researchHorizontal',
    category: 'research',
    technologies: ['openEuler', 'AGL 适配', 'YOLOv8 部署', '激光雷达导航', '气动控制', '海鸥派'],
    author: 'NEC 科研横向 · 校企联合',
    date: '2024-10-01',
    status: 'active',
    githubUrl:
      'https://github.com/necc-hub/new_energy_coder_club/tree/master/projects/research-horizontal',
    extraLinks: [
      {
        label: { zh: '气动控制系统（已完成）', en: 'Pneumatic system (completed)' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/pneumatic-system.md',
      },
      {
        label: { zh: 'AGL on openEuler', en: 'AGL on openEuler' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/AGL-openEuler.md',
      },
      {
        label: { zh: '课题清单', en: 'Topic list' },
        url: 'https://github.com/necc-hub/new_energy_coder_club/blob/master/projects/research-horizontal/project-list.md',
      },
    ],
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}

/** 取某个项目的中英双语文案 */
export function getProjectCopy(project: Project) {
  return projectDetails[project.id]
}
