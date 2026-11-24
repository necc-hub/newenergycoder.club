import { projectDetailsZh } from './zh'
import { projectDetailsEn } from './en'
import type { ProjectDetailCopy } from './zh'

export type { ProjectDetailCopy }

/** 项目双语文案：与语言包同步切换 */
export const projectDetails: Record<'zh' | 'en', Record<string, ProjectDetailCopy>> = {
  zh: projectDetailsZh,
  en: projectDetailsEn,
}
