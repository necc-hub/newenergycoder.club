import { Linkedin, Mail } from 'lucide-react'
import BonjourIcon from '@/bonjour.ico?url'
import GithubIcon from '@/github.ico?url'
import { Button } from '@/components/ui/button'
import { GiteeIcon } from '@/components/ui/gitee-icon'
import type { TeamMember } from '@/lib/i18n/types/translations'

interface MemberContactLinksProps {
  member: TeamMember
  compact?: boolean
}

export function MemberContactLinks({ member, compact = false }: MemberContactLinksProps) {
  const iconSize = compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const buttonSize = compact ? 'h-7 w-7' : 'h-8 w-8'

  return (
    <div className="flex justify-center gap-2">
      {member.gitee && (
        <Button variant="ghost" size="icon" className={buttonSize} asChild>
          <a href={member.gitee} target="_blank" rel="noopener noreferrer" aria-label="Gitee profile">
            <GiteeIcon className={iconSize} />
          </a>
        </Button>
      )}
      {member.github && (
        <Button variant="ghost" size="icon" className={buttonSize} asChild>
          <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <img src={GithubIcon} alt="GitHub" className={`${iconSize} object-contain dark:invert`} />
          </a>
        </Button>
      )}
      {member.bonjour && (
        <Button variant="ghost" size="icon" className={buttonSize} asChild>
          <a href={member.bonjour} target="_blank" rel="noopener noreferrer" aria-label="Bonjour profile">
            <img src={BonjourIcon} alt="Bonjour" className={iconSize} />
          </a>
        </Button>
      )}
      {member.linkedin && (
        <Button variant="ghost" size="icon" className={buttonSize} asChild>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <Linkedin className={iconSize} />
          </a>
        </Button>
      )}
      {member.email && (
        <Button variant="ghost" size="icon" className={buttonSize} asChild>
          <a href={`mailto:${member.email}`} aria-label={`Send email to ${member.name}`}>
            <Mail className={iconSize} />
          </a>
        </Button>
      )}
    </div>
  )
}
