import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Code, ExternalLink, FolderOpen, Target, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ImageProxy } from '@/components/ui/image-proxy'
import { getProjectById } from '@/data/projects'
import { useTranslation } from '@/contexts/LanguageContext'
import { TECH_MODULES } from '@/lib/team/tech-modules'
import type { MemberRecord } from '@/lib/team/members'
import type { Collaborator } from '@/lib/team/relations'
import { MemberContactLinks } from './MemberContactLinks'

interface MemberProfileContentProps {
  member: MemberRecord
  collaborators: Collaborator[]
  directionNames: Record<string, string>
}

function SkillBars({ skills }: { skills?: { name: string; level: number }[] }) {
  if (!skills || skills.length === 0) return null
  return (
    <div className="space-y-3">
      {skills.map(skill => (
        <div key={skill.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-foreground">{skill.name}</span>
            <span className="text-muted-foreground">{skill.level}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DirectionMap({
  modules,
  memberName,
  directionNames,
}: {
  modules: typeof TECH_MODULES
  memberName: string
  directionNames: Record<string, string>
}) {
  if (modules.length === 0) return null

  const radius = 78
  const centerX = 100
  const centerY = 100
  const angleStep = (2 * Math.PI) / modules.length

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {modules.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="hsl(var(--primary) / 0.25)"
              strokeWidth="1"
            />
          )
        })}

        <circle
          cx={centerX}
          cy={centerY}
          r="26"
          fill="hsl(var(--primary) / 0.12)"
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary text-[10px] font-semibold"
        >
          {memberName.slice(0, 4)}
        </text>

        {modules.map((mod, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          return (
            <g key={mod.id}>
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="hsl(var(--card))"
                stroke="hsl(var(--primary) / 0.35)"
                strokeWidth="1.5"
              />
              <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                <div className="flex items-center justify-center w-full h-full">
                  <mod.icon className="w-4 h-4 text-primary" />
                </div>
              </foreignObject>
              <text
                x={x}
                y={y + 30}
                textAnchor="middle"
                className="fill-foreground text-[9px] font-medium"
              >
                {directionNames[mod.id] ?? mod.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ProjectResponsibilityCard({
  project,
}: {
  project: NonNullable<MemberRecord['projects']>[number]
}) {
  const t = useTranslation()
  const detail = getProjectById(project.id)
  const href = project.url || detail?.projectUrl || detail?.githubUrl || `/projects#project-${project.id}`
  const isExternal = href.startsWith('http')

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground text-sm truncate">{project.name}</h4>
            <p className="text-xs text-primary/80 mt-0.5">{project.role}</p>
          </div>
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            aria-label={t.team.memberProfile.projectDetails}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        {detail?.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{detail.description}</p>
        )}
        {detail?.technologies && detail.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {detail.technologies.slice(0, 4).map(tech => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CollaboratorCard({
  collaborator,
  directionNames,
}: {
  collaborator: Collaborator
  directionNames: Record<string, string>
}) {
  const t = useTranslation()
  const { member, sharedProjects, sharedDirectionIds } = collaborator
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
            <ImageProxy
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              to={member.profilePath}
              className="text-sm font-medium text-primary hover:underline truncate"
            >
              {member.name}
            </Link>
            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
          </div>
        </div>
        <div className="mt-3 space-y-1 text-xs">
          {sharedProjects.length > 0 && (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{t.team.memberProfile.sharedProjects}: </span>
              {sharedProjects.map(p => p.name).join(' · ')}
            </p>
          )}
          {sharedDirectionIds.length > 0 && (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{t.team.memberProfile.sharedDirections}: </span>
              {sharedDirectionIds.map(id => directionNames[id] || id).join(' · ')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function MemberProfileContent({ member, collaborators, directionNames }: MemberProfileContentProps) {
  const t = useTranslation()
  const [avatarError, setAvatarError] = useState(false)

  const modules = useMemo(
    () => member.directions.map(id => TECH_MODULES.find(module => module.id === id)).filter((module): module is NonNullable<typeof module> => Boolean(module)),
    [member.directions],
  )

  const hasSkills = Boolean((member.tags?.length ?? 0) > 0 || (member.skills?.length ?? 0) > 0)
  const hasProjects = Boolean(member.projects?.length ?? 0)
  const hasContact = Boolean(member.gitee || member.github || member.bonjour || member.linkedin || member.email)
  const hasDirections = modules.length > 0

  return (
    <div className="mt-6 space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/30 rounded-xl" />
        <div className="px-4 sm:px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <Avatar className="w-28 h-28 rounded-full border-4 border-background shadow-xl bg-muted">
              {!avatarError ? (
                <ImageProxy
                  src={member.image}
                  alt={member.name}
                  className={`w-full h-full object-cover ${member.avatarStyle === 'bilevel' ? 'avatar-bilevel' : ''}`}
                  fallbackSrc={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`}
                  onError={() => setAvatarError(true)}
                />
              ) : null}
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                {member.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {member.role}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t.team.filterLabels[member.group]}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasContact ? (
                <MemberContactLinks member={member} />
              ) : (
                <span className="text-sm text-muted-foreground">{t.team.memberProfile.noPublicContact}</span>
              )}
            </div>
          </div>

          <p className="mt-4 text-muted-foreground leading-relaxed">{member.bio}</p>
        </div>
      </div>

      {/* Derived directions */}
      {hasDirections ? (
        <section className="px-0 sm:px-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            {t.team.memberProfile.techDirections}
            <span className="text-xs font-normal text-muted-foreground">（{t.team.memberProfile.derivedDirections}）</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <DirectionMap modules={modules} memberName={member.name} directionNames={directionNames} />
            <div className="space-y-2">
              {modules.map(mod => (
                <div
                  key={mod.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <mod.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{directionNames[mod.id] ?? mod.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Skills */}
      <section className="px-0 sm:px-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          {t.team.memberProfile.skillsTitle}
        </h3>
        {hasSkills ? (
          <div className="space-y-5">
            <SkillBars skills={member.skills} />
            {member.tags && member.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">{t.team.memberProfile.tagsTitle}</h4>
                <div className="flex flex-wrap gap-2">
                  {member.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-3 py-1 bg-primary/5 hover:bg-primary/10 border-primary/20 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.team.memberProfile.untitledSkills}</p>
        )}
      </section>

      {/* Projects */}
      <section className="px-0 sm:px-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          {t.team.memberProfile.projectsTitle}
        </h3>
        {hasProjects ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {member.projects?.map(project => (
              <ProjectResponsibilityCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.team.memberProfile.untitledProjects}</p>
        )}
      </section>

      {/* Collaborators */}
      <section className="px-0 sm:px-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          {t.team.memberProfile.collaboratorsTitle}
        </h3>
        {collaborators.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {collaborators.map(collaborator => (
              <CollaboratorCard
                key={collaborator.member.id}
                collaborator={collaborator}
                directionNames={directionNames}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.team.memberProfile.noCollaborators}</p>
        )}
      </section>
    </div>
  )
}
