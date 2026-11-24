import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import SEO from '@/components/SEO'
import { RecruitRoster } from '@/components/team/roster/RecruitRoster'
import { RecruitStage } from '@/components/team/roster/RecruitStage'
import {
  recruitMembers,
  recruitThemes,
  type RecruitMember,
  type RecruitThemeId,
} from '@/data/recruit-roster-preview'
import '@/styles/recruit-roster.css'

export default function RecruitRosterPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [themeId, setThemeId] = useState<RecruitThemeId>('robocon-2025')

  const member = recruitMembers[activeIndex]
  const theme = recruitThemes.find(item => item.id === themeId) ?? recruitThemes[0]

  useEffect(() => {
    const nextMember = recruitMembers[(activeIndex + 1) % recruitMembers.length]
    const image = new Image()
    image.src = nextMember.image
  }, [activeIndex])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

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

  const handleSelect = (nextMember: RecruitMember) => {
    const nextIndex = recruitMembers.findIndex(item => item.id === nextMember.id)
    if (nextIndex >= 0) setActiveIndex(nextIndex)
  }

  return (
    <div className="recruit-page" data-theme={themeId}>
      <SEO
        title="2026 新阵容"
        description="NEC 新能源编程俱乐部 2026 新成员阵容展示，认识正在加入机器人、嵌入式与开源社区的新伙伴。"
        keywords="NEC新成员,新能源编程俱乐部,机器人团队,ROBOCON,开源社区"
        path="/team/roster"
      />

      <div className="recruit-page__container">
        <header className="recruit-page__header">
          <div>
            <p className="recruit-page__eyebrow">NEC / NEW RECRUITS · 2026</p>
            <h1>
              新血
              <span>入阵</span>
            </h1>
            <p className="recruit-page__intro">
              从 2026 新成员与阵容更新中挑选的 8 张面孔。
              先认识人，再一起把想法做成真的。
            </p>
          </div>
          <Link to="/team" className="recruit-page__back">
            <ChevronLeft size={14} aria-hidden="true" />
            返回完整成员名册
          </Link>
        </header>

        <div className="recruit-theme-picker" role="group" aria-label="切换视觉主题">
          <span className="recruit-theme-picker__label">SELECT THEME</span>
          {recruitThemes.map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === themeId}
              onClick={() => setThemeId(item.id)}
              style={{
                '--theme-accent': item.accent,
                '--theme-counter': item.counter,
              } as CSSProperties}
            >
              <span className="recruit-theme-picker__swatches" aria-hidden="true">
                <i />
                <i />
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <RecruitStage member={member} theme={theme} total={recruitMembers.length} />

        <RecruitRoster
          members={recruitMembers}
          activeId={member.id}
          onSelect={handleSelect}
        />

        <div className="recruit-page__footnotes">
          <p>
            <strong>预览素材：</strong>
            当前立绘使用成员照片预览图裁切并在本地去背，正式发布前需替换高清原片、
            逐张修整发丝边缘，并确认成员组别与简介。键盘 ← → 可切换成员。
          </p>
          <p className="recruit-page__source">
            配色取自仓库归档的 ROBOCON 素材，为网页适配近似色；女娲补天为神话灵感主题。
            <Link to="/team" aria-label="前往完整成员名册">
              {' '}
              查看完整名册 <ArrowUpRight size={11} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}