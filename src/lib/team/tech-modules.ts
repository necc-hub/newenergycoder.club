import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  CircuitBoard,
  Cog,
  Cpu,
  Eye,
  GitBranch,
  Globe,
  Layers,
  Radio,
  Server,
  Target,
  Wrench,
  Zap,
  Bot,
} from 'lucide-react'

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
  return TECH_MODULES.filter(module =>
    labels.some(label =>
      module.keywords.some(keyword => keywordMatchesTag(keyword, label)),
    ),
  ).map(module => module.id)
}
