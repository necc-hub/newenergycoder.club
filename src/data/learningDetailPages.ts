// 五大学习方向详情页数据定义
// 原本分散在 Embedded/Mechanical/Gui/Algorithm/Designer 五个 296-442 行的
// 同构页面组件中，现统一为 LearningDetailPage + 本数据文件驱动。
// layout: 'rich'（三列交互卡片 + 项目案例 + CTA）或 'simple'（简化列表 + 报名进度）

import {
  Cpu,
  Cog,
  Palette,
  Calculator,
  Brush,
  type LucideIcon
} from 'lucide-react';

export interface LearningStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  projects: string[];
  resources: {
    videos: number;
    documents: number;
    exercises: number;
  };
}

export interface ProjectCase {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  techStack: string[];
  highlights: string[];
}

export interface LearningDetailConfig {
  slug: string;
  layout: 'rich' | 'simple';
  seo: {
    title: string;
    description: string;
    keywords: string;
    path: string;
  };
  hero: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    bgGradient: string;      // 页面背景渐变
    iconGradient: string;    // 图标背景渐变
    textGradient: string;    // 标题文字渐变
    stats: {
      duration: string;
      students: string;
      rating: string;
    };
    ctaTitle: string;
    ctaSubtitle: string;
  };
  stages: LearningStage[];
  projects: ProjectCase[];
}

export const learningDetailPages: Record<string, LearningDetailConfig> = {
  embedded: {
    slug: 'embedded',
    layout: 'rich',
    seo: {
      title: '嵌入式开发学习路线',
      description: 'NEC 嵌入式开发学习路线：从 STM32 单片机入门到 RT-Thread 实时操作系统，覆盖机器人电控系统开发的完整路径与项目实战。',
      keywords: '嵌入式学习,STM32,RT-Thread,单片机,机器人电控,学习路线',
      path: '/learning/embedded'
    },
    hero: {
      icon: Cpu,
      title: '嵌入式开发',
      subtitle: '从零开始学习嵌入式系统开发，掌握硬件与软件结合的核心技术，成为物联网时代的技术专家',
      bgGradient: 'from-blue-50 via-white to-cyan-50',
      iconGradient: 'from-blue-500 to-cyan-500',
      textGradient: 'from-blue-600 to-cyan-600',
      stats: { duration: '18-24周完整学习', students: '1200+ 学员', rating: '4.8/5.0 评分' },
      ctaTitle: '准备开始你的嵌入式开发之旅？',
      ctaSubtitle: '加入我们的学习社区，获得专业指导和项目实战机会'
    },
    stages: [
      {
        id: 'foundation',
        title: '基础入门',
        description: '掌握嵌入式开发的基础知识和核心概念',
        duration: '4-6周',
        difficulty: 'beginner',
        skills: ['C语言编程', '数字电路基础', '微控制器原理', 'GPIO操作'],
        projects: ['LED闪烁控制', '按键检测', '数码管显示', '蜂鸣器控制'],
        resources: { videos: 25, documents: 15, exercises: 30 }
      },
      {
        id: 'intermediate',
        title: '进阶开发',
        description: '学习高级外设和通信协议的使用',
        duration: '6-8周',
        difficulty: 'intermediate',
        skills: ['定时器/计数器', 'ADC/DAC', 'UART/SPI/I2C', '中断处理'],
        projects: ['温度监控系统', '数据采集器', '无线通信模块', 'LCD显示系统'],
        resources: { videos: 35, documents: 25, exercises: 40 }
      },
      {
        id: 'advanced',
        title: '高级应用',
        description: '掌握实时操作系统和复杂项目开发',
        duration: '8-10周',
        difficulty: 'advanced',
        skills: ['FreeRTOS', '低功耗设计', '硬件调试', '产品化开发'],
        projects: ['智能家居控制器', '工业监控系统', '物联网网关', '嵌入式AI应用'],
        resources: { videos: 45, documents: 35, exercises: 50 }
      }
    ],
    projects: [
      {
        id: 'smart-home',
        title: '智能家居控制系统',
        description: '基于STM32的智能家居控制系统，支持远程控制和自动化场景',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20home%20control%20system%20with%20STM32%20microcontroller%20modern%20interface&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '3-4周',
        techStack: ['STM32', 'FreeRTOS', 'WiFi', 'MQTT'],
        highlights: ['支持多种传感器接入', '实现远程APP控制', '自动化场景编程', '低功耗设计']
      },
      {
        id: 'iot-gateway',
        title: '物联网数据网关',
        description: '工业级物联网数据采集和传输网关，支持多协议通信',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20IoT%20gateway%20device%20with%20multiple%20communication%20protocols&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '4-5周',
        techStack: ['ARM Cortex-M', 'Ethernet', 'Modbus', 'LoRa'],
        highlights: ['多协议数据采集', '边缘计算处理', '云端数据同步', '故障自诊断']
      },
      {
        id: 'wearable-device',
        title: '可穿戴健康监测设备',
        description: '基于低功耗MCU的健康监测设备，实时监测生理指标',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=wearable%20health%20monitoring%20device%20with%20sensors%20modern%20design&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '2-3周',
        techStack: ['nRF52', 'BLE', '传感器融合', '低功耗算法'],
        highlights: ['多生理参数监测', '超低功耗设计', '蓝牙数据传输', '移动APP配套']
      }
    ]
  },

  mechanical: {
    slug: 'mechanical',
    layout: 'rich',
    seo: {
      title: '机械设计学习路线',
      description: 'NEC 机械设计学习路线：SolidWorks/建模、结构设计与加工工艺，面向机器人本体结构设计的系统学习路径。',
      keywords: '机械设计,SolidWorks,机器人结构,CAD,学习路线',
      path: '/learning/mechanical'
    },
    hero: {
      icon: Cog,
      title: '机械算法',
      subtitle: '融合机械工程与算法设计，掌握现代制造业的核心技术，成为智能制造时代的复合型人才',
      bgGradient: 'from-orange-50 via-white to-red-50',
      iconGradient: 'from-orange-500 to-red-500',
      textGradient: 'from-orange-600 to-red-600',
      stats: { duration: '24-30周完整学习', students: '800+ 学员', rating: '4.9/5.0 评分' },
      ctaTitle: '准备成为机械算法专家？',
      ctaSubtitle: '掌握现代制造业的核心技术，开启智能制造职业生涯'
    },
    stages: [
      {
        id: 'foundation',
        title: '数学基础',
        description: '掌握机械工程和算法设计的数学基础',
        duration: '6-8周',
        difficulty: 'beginner',
        skills: ['线性代数', '微积分', '概率统计', '数值分析'],
        projects: ['矩阵运算器', '数值积分计算', '统计分析工具', '插值算法实现'],
        resources: { videos: 30, documents: 20, exercises: 40 }
      },
      {
        id: 'mechanics',
        title: '力学建模',
        description: '学习机械系统的数学建模和仿真分析',
        duration: '8-10周',
        difficulty: 'intermediate',
        skills: ['刚体力学', '有限元分析', 'MATLAB/Simulink', '动力学仿真'],
        projects: ['机械臂运动学', '振动分析系统', '结构优化算法', '动态仿真平台'],
        resources: { videos: 40, documents: 30, exercises: 50 }
      },
      {
        id: 'algorithms',
        title: '智能算法',
        description: '掌握机械设计中的优化算法和智能控制',
        duration: '10-12周',
        difficulty: 'advanced',
        skills: ['遗传算法', '神经网络', '模糊控制', '机器学习'],
        projects: ['智能控制系统', '参数优化平台', '故障诊断算法', 'AI辅助设计'],
        resources: { videos: 50, documents: 40, exercises: 60 }
      }
    ],
    projects: [
      {
        id: 'robot-arm',
        title: '六自由度机械臂控制系统',
        description: '基于运动学和动力学建模的机械臂精确控制算法',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=six%20axis%20robotic%20arm%20with%20control%20system%20industrial%20setting&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '4-5周',
        techStack: ['MATLAB', 'Simulink', 'ROS', 'C++'],
        highlights: ['正逆运动学求解', '轨迹规划算法', '动力学补偿控制', '实时仿真验证']
      },
      {
        id: 'vibration-analysis',
        title: '机械振动分析与控制',
        description: '大型机械设备的振动监测、分析和主动控制系统',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mechanical%20vibration%20analysis%20system%20with%20sensors%20and%20monitoring&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '3-4周',
        techStack: ['Python', 'SciPy', 'LabVIEW', '信号处理'],
        highlights: ['频域分析算法', '模态参数识别', '主动振动控制', '故障预警系统']
      },
      {
        id: 'optimization',
        title: '机械结构优化设计',
        description: '基于多目标优化算法的机械结构轻量化设计',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mechanical%20structure%20optimization%20design%20CAD%20software%20interface&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '3-4周',
        techStack: ['Python', 'ANSYS', '遗传算法', 'SolidWorks API'],
        highlights: ['多目标优化算法', '拓扑优化设计', 'CAD参数化建模', '性能评估系统']
      }
    ]
  },

  gui: {
    slug: 'gui',
    layout: 'simple',
    seo: {
      title: 'GUI 开发学习路线',
      description: 'NEC GUI 开发学习路线：Qt、上位机与人机交互界面开发，覆盖机器人调试工具与可视化系统的完整学习路径。',
      keywords: 'GUI开发,Qt,上位机,人机交互,机器人调试,学习路线',
      path: '/learning/gui'
    },
    hero: {
      icon: Palette,
      title: 'GUI界面开发',
      subtitle: '掌握跨平台图形界面开发与现代UI设计，打造高质量桌面应用',
      bgGradient: 'from-purple-50 via-white to-pink-50',
      iconGradient: 'from-purple-500 to-pink-500',
      textGradient: 'from-purple-600 to-pink-600',
      stats: { duration: '16-22周完整学习', students: '900+ 学员', rating: '4.7/5.0 评分' },
      ctaTitle: '报名与进度',
      ctaSubtitle: '报名开始后可查看个人学习进度与阶段目标完成情况'
    },
    stages: [
      {
        id: 'foundation',
        title: '基础入门',
        description: '掌握GUI开发基础与现代UI设计原则',
        duration: '4-6周',
        difficulty: 'beginner',
        skills: ['C++基础', 'Qt Widgets', 'QML基础', '布局与控件'],
        projects: ['工具栏应用', '多文档界面', '主题切换器', '设置面板'],
        resources: { videos: 20, documents: 15, exercises: 30 }
      },
      {
        id: 'intermediate',
        title: '进阶开发',
        description: '掌握跨平台特性与复杂交互实现',
        duration: '6-8周',
        difficulty: 'intermediate',
        skills: ['Qt Model/View', '信号与槽', '多线程', '多媒体'],
        projects: ['文件管理器', '音乐播放器', '图像编辑器', '串口终端'],
        resources: { videos: 30, documents: 20, exercises: 40 }
      },
      {
        id: 'advanced',
        title: '高级应用',
        description: '优化性能与打造专业桌面应用',
        duration: '8-10周',
        difficulty: 'advanced',
        skills: ['自定义控件', 'GPU加速', '国际化', '插件体系'],
        projects: ['跨平台绘图工具', '数据可视化平台', '插件化IDE', '主题系统'],
        resources: { videos: 40, documents: 30, exercises: 50 }
      }
    ],
    projects: [
      {
        id: 'visualizer',
        title: '数据可视化平台',
        description: '支持多种图表与交互，提供实时数据展示能力',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=desktop%20data%20visualization%20app%20with%20charts%20and%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '3-4周',
        techStack: ['Qt', 'C++', 'QML', 'OpenGL'],
        highlights: ['高性能绘制', '自适应布局', '交互式图表', '主题皮肤']
      },
      {
        id: 'media-player',
        title: '跨平台多媒体播放器',
        description: '支持音视频播放与播放列表管理，界面精美',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cross%20platform%20media%20player%20desktop%20app%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '2-3周',
        techStack: ['Qt', 'FFmpeg', 'QML', '多线程'],
        highlights: ['硬件加速', '播放列表', '快捷键支持', '皮肤系统']
      },
      {
        id: 'serial-terminal',
        title: '串口终端工具',
        description: '支持常见串口协议与数据日志记录，适配工程调试',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=serial%20terminal%20desktop%20app%20for%20engineering%20with%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'beginner',
        duration: '1-2周',
        techStack: ['Qt', 'C++', '串口通信'],
        highlights: ['数据过滤', '导出日志', '多端口支持', '自动重连']
      }
    ]
  },

  algorithm: {
    slug: 'algorithm',
    layout: 'simple',
    seo: {
      title: '算法学习路线',
      description: 'NEC 算法学习路线：从控制理论、SLAM、计算机视觉到路径规划，覆盖机器人感知与决策算法的完整学习路径。',
      keywords: '机器人算法,SLAM,计算机视觉,控制理论,路径规划,学习路线',
      path: '/learning/algorithm'
    },
    hero: {
      icon: Calculator,
      title: '算法与数据结构',
      subtitle: '深入算法设计与优化，提升工程问题的建模与求解能力',
      bgGradient: 'from-green-50 via-white to-emerald-50',
      iconGradient: 'from-green-500 to-emerald-500',
      textGradient: 'from-green-600 to-emerald-600',
      stats: { duration: '18-24周完整学习', students: '1000+ 学员', rating: '4.8/5.0 评分' },
      ctaTitle: '报名与进度',
      ctaSubtitle: '报名开始后可查看个人学习进度与阶段目标完成情况'
    },
    stages: [
      {
        id: 'foundation',
        title: '基础入门',
        description: '构建算法与数据结构的核心基础，掌握复杂度与基本结构',
        duration: '4-6周',
        difficulty: 'beginner',
        skills: ['时间/空间复杂度', '数组与链表', '栈与队列', '哈希表'],
        projects: ['LRU缓存', '表达式求值器', '哈希冲突解决', '链表操作库'],
        resources: { videos: 25, documents: 18, exercises: 40 }
      },
      {
        id: 'intermediate',
        title: '进阶设计',
        description: '掌握经典算法范式与树、图结构的应用',
        duration: '6-8周',
        difficulty: 'intermediate',
        skills: ['排序与搜索', '二叉树/AVL', '图遍历', '动态规划'],
        projects: ['图最短路工具', '区间DP求解器', '二叉搜索树库', '启发式搜索'],
        resources: { videos: 35, documents: 25, exercises: 50 }
      },
      {
        id: 'advanced',
        title: '高级应用',
        description: '优化与工程落地，掌握并行化与高性能数据结构',
        duration: '8-10周',
        difficulty: 'advanced',
        skills: ['并行算法', '缓存优化', '索引结构', '图算法优化'],
        projects: ['并行排序库', '图分析平台', '高性能索引', '调度优化器'],
        resources: { videos: 45, documents: 32, exercises: 60 }
      }
    ],
    projects: [
      {
        id: 'graph-analyzer',
        title: '图分析平台',
        description: '支持大规模图数据分析，提供常用图算法与可视化',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=graph%20analysis%20platform%20with%20data%20structures%20visualization%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '3-4周',
        techStack: ['TypeScript', 'WebAssembly', 'Graph Library'],
        highlights: ['高性能遍历', '社区检测', '路径分析', '交互式可视化']
      },
      {
        id: 'dp-solver',
        title: '动态规划求解器',
        description: '可配置的DP问题求解框架，支持多种优化策略',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dynamic%20programming%20solver%20software%20interface%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '2-3周',
        techStack: ['TypeScript', 'Node.js', '算法库'],
        highlights: ['记忆化/状态压缩', '可视化递推', '测试用例套件', '结果导出']
      },
      {
        id: 'cache-lib',
        title: '高性能缓存库',
        description: '提供LRU/LFU等策略的缓存组件，针对工程场景优化',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=high%20performance%20cache%20library%20software%20modern%20UI&image_size=landscape_4_3',
        difficulty: 'beginner',
        duration: '1-2周',
        techStack: ['TypeScript', 'Rust (可选)', 'Benchmark'],
        highlights: ['并发安全', '可插拔策略', '压测报告', '易集成']
      }
    ]
  },

  designer: {
    slug: 'designer',
    layout: 'rich',
    seo: {
      title: '设计学习路线',
      description: 'NEC 设计学习路线：视觉设计、品牌宣传与交互体验，为开源社区与机器人竞赛团队打造专业视觉输出。',
      keywords: '视觉设计,品牌设计,UI设计,机器人团队宣传,学习路线',
      path: '/learning/designer'
    },
    hero: {
      icon: Brush,
      title: '设计师',
      subtitle: '从平面设计到用户体验，掌握现代设计的全栈技能，成为数字时代的创意专家',
      bgGradient: 'from-purple-50 via-white to-pink-50',
      iconGradient: 'from-purple-500 to-pink-500',
      textGradient: 'from-purple-600 to-pink-600',
      stats: { duration: '18-24周完整学习', students: '1500+ 学员', rating: '4.9/5.0 评分' },
      ctaTitle: '准备开启你的设计师之路？',
      ctaSubtitle: '加入我们的创意社区，与优秀设计师一起成长'
    },
    stages: [
      {
        id: 'foundation',
        title: '设计基础',
        description: '掌握设计理论和基础工具的使用',
        duration: '4-6周',
        difficulty: 'beginner',
        skills: ['设计原理', 'Photoshop', 'Illustrator', '色彩理论'],
        projects: ['品牌标志设计', '海报设计', '名片设计', '图标设计'],
        resources: { videos: 35, documents: 25, exercises: 45 }
      },
      {
        id: 'intermediate',
        title: 'UI/UX设计',
        description: '学习用户界面和用户体验设计',
        duration: '8-10周',
        difficulty: 'intermediate',
        skills: ['用户研究', 'Figma', '原型设计', '交互设计'],
        projects: ['移动应用界面', '网站设计', '用户体验优化', '设计系统构建'],
        resources: { videos: 45, documents: 35, exercises: 55 }
      },
      {
        id: 'advanced',
        title: '高级设计',
        description: '掌握品牌设计和创意策略',
        duration: '6-8周',
        difficulty: 'advanced',
        skills: ['品牌策略', '创意思维', '项目管理', '商业设计'],
        projects: ['品牌全案设计', '创意广告', '包装设计', '展示设计'],
        resources: { videos: 40, documents: 30, exercises: 35 }
      }
    ],
    projects: [
      {
        id: 'brand-identity',
        title: '科技公司品牌全案设计',
        description: '从品牌策略到视觉识别系统的完整品牌设计项目',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tech%20company%20brand%20identity%20design%20logo%20business%20cards%20stationery&image_size=landscape_4_3',
        difficulty: 'advanced',
        duration: '4-6周',
        techStack: ['Illustrator', 'Photoshop', 'InDesign', 'Figma'],
        highlights: ['品牌策略定位', '视觉识别系统', '品牌规范手册', '多场景应用']
      },
      {
        id: 'mobile-app',
        title: '电商移动应用UI设计',
        description: '现代化电商应用的完整用户界面和体验设计',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20e-commerce%20mobile%20app%20UI%20design%20interface%20screens&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '3-4周',
        techStack: ['Figma', 'Sketch', 'Principle', 'Zeplin'],
        highlights: ['用户流程设计', '高保真原型', '交互细节打磨', '设计系统构建']
      },
      {
        id: 'web-design',
        title: '企业官网响应式设计',
        description: '多终端适配的企业官网设计和前端实现',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=responsive%20corporate%20website%20design%20multiple%20devices%20modern%20layout&image_size=landscape_4_3',
        difficulty: 'intermediate',
        duration: '3-4周',
        techStack: ['Figma', 'HTML/CSS', 'JavaScript', 'Webflow'],
        highlights: ['响应式布局设计', '视觉层次构建', '前端代码实现', '性能优化考虑']
      }
    ]
  }
};
