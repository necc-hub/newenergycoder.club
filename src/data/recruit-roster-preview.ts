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
  portraitScale: number
}

export interface RecruitTheme {
  id: RecruitThemeId
  label: string
  shortLabel: string
  accent: string
  counter: string
}

export const recruitMembers: RecruitMember[] = [
  {
    id: 'han-yitong',
    index: '01',
    name: '韩依彤',
    romanized: 'HAN YITONG',
    status: '新成员',
    image: '/images/recruits/preview/01-han-yitong.webp',
    thumbnail: '/images/recruits/preview/thumbs/01-han-yitong.webp',
    imagePosition: 'center 18%',
    portraitScale: 1,
  },
  {
    id: 'xiao-changting',
    index: '02',
    name: '肖长婷',
    romanized: 'XIAO CHANGTING',
    status: '新成员',
    image: '/images/recruits/preview/02-xiao-changting.webp',
    thumbnail: '/images/recruits/preview/thumbs/02-xiao-changting.webp',
    imagePosition: 'center 16%',
    portraitScale: 1.08,
  },
  {
    id: 'lu-jiahao',
    index: '03',
    name: '陆家豪',
    romanized: 'LU JIAHAO',
    status: '新成员',
    image: '/images/recruits/preview/03-lu-jiahao.webp',
    thumbnail: '/images/recruits/preview/thumbs/03-lu-jiahao.webp',
    imagePosition: 'center 17%',
    portraitScale: 0.98,
  },
  {
    id: 'tan-huifang',
    index: '04',
    name: '谭惠方',
    romanized: 'TAN HUIFANG',
    status: '新成员',
    image: '/images/recruits/preview/04-tan-huifang.webp',
    thumbnail: '/images/recruits/preview/thumbs/04-tan-huifang.webp',
    imagePosition: 'center 21%',
    portraitScale: 1.06,
  },
  {
    id: 'xiang-jixin',
    index: '05',
    name: '相积欣',
    romanized: 'XIANG JIXIN',
    status: '新成员',
    image: '/images/recruits/preview/05-xiang-jixin.webp',
    thumbnail: '/images/recruits/preview/thumbs/05-xiang-jixin.webp',
    imagePosition: 'center 20%',
    portraitScale: 1.1,
  },
  {
    id: 'zhang-chengjun',
    index: '06',
    name: '张成俊',
    romanized: 'ZHANG CHENGJUN',
    status: '新成员',
    image: '/images/recruits/preview/06-zhang-chengjun.webp',
    thumbnail: '/images/recruits/preview/thumbs/06-zhang-chengjun.webp',
    imagePosition: 'center 16%',
    portraitScale: 0.78,
  },
  {
    id: 'lu-yongjie',
    index: '07',
    name: '卢永杰',
    romanized: 'LU YONGJIE',
    status: '阵容更新',
    image: '/images/recruits/preview/07-lu-yongjie.webp',
    thumbnail: '/images/recruits/preview/thumbs/07-lu-yongjie.webp',
    imagePosition: 'center 18%',
    portraitScale: 1,
  },
  {
    id: 'lu-wangchun',
    index: '08',
    name: '卢王淳',
    romanized: 'LU WANGCHUN',
    status: '阵容更新',
    image: '/images/recruits/preview/08-lu-wangchun.webp',
    thumbnail: '/images/recruits/preview/thumbs/08-lu-wangchun.webp',
    imagePosition: 'center 16%',
    portraitScale: 1.05,
  },
]

export const recruitThemes: RecruitTheme[] = [
  {
    id: 'robocon-2025',
    label: '2025 飞身上篮',
    shortLabel: '品红青绿',
    accent: '#ff216b',
    counter: '#2df5bd',
  },
  {
    id: 'robocon-2024',
    label: '2024 颗粒归仓',
    shortLabel: '稻谷电蓝',
    accent: '#ffd400',
    counter: '#1668ff',
  },
  {
    id: 'robocon-2026',
    label: '2026 武林探秘',
    shortLabel: '赤霞青梅',
    accent: '#fa3d48',
    counter: '#b9ff48',
  },
  {
    id: 'nuwa',
    label: '女娲补天',
    shortLabel: '五色能量',
    accent: '#f3f5df',
    counter: '#71e6cc',
  },
]