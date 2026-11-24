import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useTranslation } from '@/contexts/LanguageContext'
import { Header } from '@/components/layout/Header'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { MemberProfileContent } from '@/components/team/MemberProfileContent'
import { buildMemberDirectory } from '@/lib/team/members'
import { getMemberPageContext } from '@/lib/team/relations'

export function MemberProfilePage() {
  const t = useTranslation()
  const { memberId = '' } = useParams()
  const members = useMemo(
    () => buildMemberDirectory(t.team),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t.team.maintainers, t.team.developers, t.team.designers, t.team.contributors],
  )
  const context = getMemberPageContext(memberId, members)
  const [fallbackText, setFallbackText] = useState<string | null>(null)

  const profileUrl = context ? `${typeof window !== 'undefined' ? window.location.origin : ''}${context.member.profilePath}` : ''
  const shared = context?.collaborators[0]
  const sharedText = shared
    ? [
      ...shared.sharedProjects.map(project => project.name),
      ...shared.sharedDirectionIds.map(id => t.team.directionNames[id] || id),
    ].join(' / ')
    : ''
  const invitation = context
    ? [
      `${t.team.memberProfile.invitationTitle} ${context.member.name}`,
      context.member.tags?.slice(0, 3).join(' · '),
      sharedText,
      profileUrl,
    ].filter(Boolean).join('\n')
    : ''

  async function copyText(text: string, successMessage: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setFallbackText(null)
      toast.success(successMessage)
    } catch {
      setFallbackText(text)
      toast.error(t.team.memberProfile.copyFailed)
    }
  }

  if (!context) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold">{t.team.memberProfile.notFoundTitle}</h1>
          <p className="mt-3 text-muted-foreground">{t.team.memberProfile.notFoundDescription}</p>
          <Button asChild className="mt-6">
            <Link to="/team">{t.team.memberProfile.backToTeam}</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Toaster />
      <div className="container py-10">
        <SEO
          title={`${context.member.name} | ${t.team.memberProfile.profileTitle}`}
          description={context.member.bio}
          path={context.member.profilePath}
        />
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {t.team.memberProfile.backToTeam}
        </Link>

        <MemberProfileContent
          member={context.member}
          collaborators={context.collaborators}
          directionNames={t.team.directionNames}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => copyText(profileUrl, t.team.memberProfile.linkCopied)}>
            {t.team.memberProfile.copyLink}
          </Button>
          <Button
            variant="outline"
            onClick={() => copyText(invitation, t.team.memberProfile.invitationCopied)}
          >
            {t.team.memberProfile.copyInvitation}
          </Button>
        </div>

        {fallbackText !== null && (
          <textarea
            className="mt-3 min-h-24 w-full rounded-md border border-border bg-muted/30 p-3 text-sm"
            readOnly
            autoFocus
            aria-label={t.team.memberProfile.copyFailed}
            value={fallbackText}
            onFocus={event => event.currentTarget.select()}
          />
        )}
      </div>
    </main>
  )
}
