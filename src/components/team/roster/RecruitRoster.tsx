import { useEffect, useRef, useState } from 'react'
import type { RecruitMember } from '@/data/recruit-roster-preview'

interface RecruitRosterProps {
  members: RecruitMember[]
  activeId: string
  onSelect: (member: RecruitMember) => void
}

function RosterThumbnail({ member }: { member: RecruitMember }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="recruit-roster__fallback">{member.name.slice(0, 1)}</span>
  }

  return (
    <img
      src={member.thumbnail}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ objectPosition: member.imagePosition }}
      onError={() => setFailed(true)}
    />
  )
}

export function RecruitRoster({ members, activeId, onSelect }: RecruitRosterProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const button = activeButtonRef.current
    if (!track || !button || track.scrollWidth <= track.clientWidth) return

    const left = button.offsetLeft - (track.clientWidth - button.clientWidth) / 2
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [activeId])

  return (
    <section className="recruit-roster" aria-labelledby="recruit-roster-title">
      <div className="recruit-roster__heading">
        <div>
          <span className="recruit-roster__eyebrow">MEET THE NEW ROSTER</span>
          <h2 id="recruit-roster-title">选择你的队友</h2>
        </div>
        <span className="recruit-roster__hint">08 NEW FACES</span>
      </div>

      <div ref={trackRef} className="recruit-roster__track" role="group" aria-label="新人名单">
        {members.map(member => {
          const active = member.id === activeId
          return (
            <button
              key={member.id}
              ref={active ? activeButtonRef : undefined}
              type="button"
              className="recruit-roster__item"
              data-active={active ? 'true' : undefined}
              aria-pressed={active}
              aria-label={`查看${member.name}`}
              onClick={() => onSelect(member)}
            >
              <span className="recruit-roster__number">{member.index}</span>
              <span className="recruit-roster__image">
                <RosterThumbnail member={member} />
              </span>
              <span className="recruit-roster__name">{member.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}