import { useEffect, useState, type CSSProperties } from 'react'
import type { RecruitMember, RecruitTheme } from '@/data/recruit-roster-preview'

interface RecruitStageProps {
  member: RecruitMember
  theme: RecruitTheme
  total: number
}

export function RecruitStage({ member, theme, total }: RecruitStageProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [member.id])

  return (
    <section className="recruit-stage" aria-label={`${member.name} 的选手展示`}>
      <p className="sr-only" aria-live="polite">
        正在展示 {member.name}，{member.romanized}，第 {member.index} 位，共 {total} 位。
      </p>
      <div className="recruit-stage__grid" aria-hidden="true" />
      <div className="recruit-stage__block" aria-hidden="true" />
      <div className="recruit-stage__beam" aria-hidden="true" />
      <div className="recruit-stage__ring" aria-hidden="true" />
      <div className="recruit-stage__shards" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="recruit-stage__ghost" aria-hidden="true">{member.index}</div>

      <div className="recruit-stage__topline">
        <span className="recruit-stage__wordmark">
          NE<span>C</span>
        </span>
        <span className="recruit-stage__season">{theme.label}</span>
      </div>

      <div className="recruit-stage__count" aria-hidden="true">
        <small>ROSTER NO.</small>
        <b>{member.index}<span> / {String(total).padStart(2, '0')}</span></b>
      </div>

      <div key={member.id} className="recruit-stage__identity">
        <span className="recruit-stage__status">
          {member.status} / 2026
        </span>
        <h2>{member.name}</h2>
        <p className="recruit-stage__romanized">{member.romanized}</p>
        <div className="recruit-stage__meta">
          <span>
            <small>组别</small>
            待确认
          </span>
          <span>
            <small>阵容</small>
            NEW BLOOD
          </span>
        </div>
        <p className="recruit-stage__line">
          新血入阵。下一场，把想法真正做出来。
        </p>
        <span className="recruit-stage__theme-tag">{theme.shortLabel}</span>
      </div>

      <div
        className="recruit-stage__portrait"
        style={{
          '--portrait-position': member.imagePosition,
          '--portrait-scale': member.portraitScale,
        } as CSSProperties}
      >
        {imageFailed ? (
          <div className="recruit-stage__portrait-fallback" role="img" aria-label={member.name}>
            <span>{member.name.slice(0, 1)}</span>
            <small>{member.romanized}</small>
          </div>
        ) : (
          <div className="recruit-stage__portrait-art">
            <div
              className="recruit-stage__portrait-rim"
              style={{ backgroundImage: `url(${member.image})` }}
              aria-hidden="true"
            />
            <img
              key={member.id}
              src={member.image}
              alt={`${member.name} 的成员照片`}
              className="recruit-stage__portrait-image"
              onError={() => setImageFailed(true)}
              fetchPriority="high"
            />
          </div>
        )}
      </div>

      <div className="recruit-stage__corner" aria-hidden="true">
        <span>BUILD</span>
        <span>SOMETHING</span>
        <span>REAL.</span>
      </div>

      <footer className="recruit-stage__footer">
        <span>NEC / NEW RECRUITS</span>
        <span aria-hidden="true">USE ← → TO BROWSE</span>
      </footer>
    </section>
  )
}