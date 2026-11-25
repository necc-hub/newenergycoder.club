import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderGit2,
  HandHeart,
  Link2,
  PackageOpen,
  Search,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { GiteeIcon } from '@/components/ui/gitee-icon'
import { useLanguage, useTranslation } from '@/contexts/LanguageContext'
import { PageLayout } from '@/components/layout/PageLayout'
import SEO from '@/components/SEO'
import { type AspectRatio } from '@/components/ui/floating-controls'
import { ProjectImage } from '@/components/ui/project-image'
import {
  projects,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from '@/data/projects'
import { projectDetails } from '@/lib/i18n/locales/projectDetails'

const categoryFilters: { key: ProjectCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'web', labelKey: 'filterWeb' },
  { key: 'robotics', labelKey: 'filterRobotics' },
  { key: 'embedded', labelKey: 'filterEmbedded' },
  { key: 'iot', labelKey: 'filterIoT' },
  { key: 'research', labelKey: 'filterResearch' },
  { key: 'ai', labelKey: 'filterAI' },
  { key: 'docs', labelKey: 'filterDocs' },
]

const statusStyles: Record<ProjectStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  development: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  seasonal: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
  archived: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
}

const statusDot: Record<ProjectStatus, string> = {
  active: 'bg-emerald-500',
  development: 'bg-amber-500',
  seasonal: 'bg-sky-500',
  archived: 'bg-slate-400',
}

/** 无实拍封面的项目：用仓库排版做一张"代码封面"，比无关图库图更真实 */
function RepoCover({ project }: { project: Project }) {
  const repoPath = project.githubUrl
    ?.replace(/^https?:\/\/(github\.com|gitee\.com)\//, '')
    .replace(/\/(tree|blob)\/[^/]+\//, ' › ')
  return (
    <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.16),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.14),transparent_55%)] p-5 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <FolderGit2 className="h-4 w-4 text-primary" />
        <span className="truncate">{repoPath}</span>
      </div>
      <div className="space-y-2">
        <div className="font-mono text-xs text-primary/70">README.md</div>
        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
          {projectDetails.zh[project.id]?.tagline}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map(tech => (
          <span
            key={tech}
            className="rounded border border-border/60 bg-background/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectStatusBadge({
  status,
  label,
}: {
  status: ProjectStatus
  label: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
      {label}
    </span>
  )
}

export function ProjectsPage() {
  const t = useTranslation()
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all')
  const [query, setQuery] = useState('')
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('aspect-video')
  const [searchParams, setSearchParams] = useSearchParams()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const detailId = searchParams.get('p')
  const detailProject = detailId ? projects.find(p => p.id === detailId) : undefined

  const statusLabels: Record<ProjectStatus, string> = {
    active: t.projects.statusActive,
    development: t.projects.statusDevelopment,
    seasonal: t.projects.statusSeasonal,
    archived: t.projects.statusArchived,
  }

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter(project => {
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        // system（MICA）与 aerospace（飞控）归入科研/机器人筛选组，避免空分类
        const alias: Record<string, ProjectCategory> = { system: 'research', aerospace: 'robotics' }
        if (alias[project.category] !== selectedCategory) return false
      }
      if (!q) return true
      const copy = projectDetails[language][project.id]
      const haystack = [
        project.title,
        copy?.tagline,
        copy?.summary,
        project.author,
        project.technologies.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query, selectedCategory, language])

  const openDetails = (project: Project) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('p', project.id)
      return next
    })
  }

  const closeDetails = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('p')
      return next
    })
  }

  // 支持 /projects#project-<id> 的既有锚点（成员页代表作跳转）
  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/^#project-(.+)$/)
    if (match) {
      const target = projects.find(p => p.id === match[1])
      if (target) openDetails(target)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyProjectLink = async (project: Project) => {
    const url = `${window.location.origin}/projects?p=${project.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(project.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // 剪贴板不可用时静默失败
    }
  }

  const renderActions = (project: Project) => (
    <>
      {project.projectUrl && (
        <Button size="sm" asChild className="gap-1.5">
          <a
            href={project.projectUrl}
            target={project.projectUrl.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t.projects.liveDemo}
          </a>
        </Button>
      )}
      {project.githubUrl && (
        <Button size="sm" variant="outline" asChild className="gap-1.5">
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Code2 className="h-3.5 w-3.5" />
            {t.projects.viewCode}
          </a>
        </Button>
      )}
      {project.giteeUrl && (
        <Button size="sm" variant="outline" asChild className="gap-1.5">
          <a href={project.giteeUrl} target="_blank" rel="noopener noreferrer">
            <GiteeIcon className="h-3.5 w-3.5" />
            Gitee
          </a>
        </Button>
      )}
    </>
  )

  return (
    <PageLayout
      showAspectRatio={true}
      aspectRatio={selectedRatio}
      onAspectRatioChange={setSelectedRatio}
    >
      <SEO
        title={t.projects.title}
        description={t.projects.description}
        path="/projects"
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 py-14 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.10),transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.10),transparent_50%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {t.projects.heroBadge}
              </span>
              <h1 className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text pb-1 text-3xl font-bold leading-[1.2] text-transparent lg:text-5xl">
                {t.projects.title}
              </h1>
              <p className="mb-3 text-base leading-relaxed text-muted-foreground lg:text-lg">
                {t.projects.description}
              </p>
              <p className="text-sm text-muted-foreground/80">{t.projects.heroHint}</p>

              {/* 真实统计：从项目数据实时计算，不写死数字 */}
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  { value: projects.length, label: t.projects.statProjects },
                  {
                    value: new Set(projects.map(p => p.category)).size,
                    label: t.projects.statDomains,
                  },
                  {
                    value: projects.filter(p => p.projectUrl?.startsWith('http')).length,
                    label: t.projects.statLive,
                  },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/50 bg-background/50 py-3 backdrop-blur"
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 搜索 + 分类筛选 */}
        <section className="border-b border-border/40 bg-background/60 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.projects.searchPlaceholder}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map(filter => (
                  <Button
                    key={filter.key}
                    variant={selectedCategory === filter.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(filter.key)}
                    className="transition-all duration-200"
                  >
                    {t.projects[filter.labelKey]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 项目网格 */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map(project => {
                const copy = projectDetails[language][project.id]
                return (
                  <Card
                    key={project.id}
                    id={`project-${project.id}`}
                    className="glass-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={() => openDetails(project)}
                      className={`${selectedRatio} relative block w-full overflow-hidden text-left`}
                      aria-label={`${project.title} · ${t.projects.viewDetails}`}
                    >
                      {project.image ? (
                        <ProjectImage src={project.image} alt={project.title} className="h-full w-full" />
                      ) : (
                        <RepoCover project={project} />
                      )}
                      <div className="absolute left-3 top-3">
                        <ProjectStatusBadge status={project.status} label={statusLabels[project.status]} />
                      </div>
                      {project.featured && (
                        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-primary backdrop-blur">
                          ★ NEC HUB
                        </span>
                      )}
                    </button>

                    <CardHeader className="pb-2">
                      <button
                        type="button"
                        onClick={() => openDetails(project)}
                        className="text-left"
                      >
                        <h3 className="mb-1 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>
                        <p className="text-xs font-medium text-primary/80">{copy?.tagline}</p>
                      </button>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {copy?.summary}
                      </p>
                    </CardHeader>

                    <CardContent className="mt-auto space-y-3 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-[11px] font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span className="max-w-[150px] truncate">{project.author}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(project)}
                          className="h-7 gap-1 px-2 text-xs text-primary"
                        >
                          {t.projects.viewDetails}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-20 text-center">
                <PackageOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
                <p className="mb-4 text-muted-foreground">{t.projects.noResults}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  {t.projects.resetFilters}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* 参与 CTA */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/10 p-8 lg:p-12">
              <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                    <HandHeart className="h-6 w-6 text-primary" />
                    {t.projects.ctaTitle}
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">{t.projects.ctaDescription}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link to="/join">
                      <Users className="mr-2 h-4 w-4" />
                      {t.projects.ctaButton}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href="https://docs.newenergycoder.club/contributing/guidelines"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.projects.ctaContribute}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 项目详情 */}
      <Dialog open={Boolean(detailProject)} onOpenChange={open => !open && closeDetails()}>
        <DialogContent className="block max-h-[88vh] w-full max-w-3xl gap-0 overflow-y-auto p-0">
          {detailProject &&
            (() => {
              const copy = projectDetails[language][detailProject.id]
              return (
                <>
                  <div className="relative aspect-[21/8] w-full overflow-hidden">
                    {detailProject.image ? (
                      <ProjectImage
                        src={detailProject.image}
                        alt={detailProject.title}
                        className="h-full w-full"
                      />
                    ) : (
                      <RepoCover project={detailProject} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>
                  <div className="px-6 pb-6">
                    <DialogHeader className="space-y-3 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <ProjectStatusBadge
                          status={detailProject.status}
                          label={statusLabels[detailProject.status]}
                        />
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {t.projects.startedLabel} {detailProject.date}
                        </span>
                      </div>
                      <DialogTitle className="text-2xl leading-tight">
                        {detailProject.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-primary/90">
                        {copy?.tagline}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-wrap gap-2">{renderActions(detailProject)}</div>

                    <div className="mt-6 space-y-6">
                      <section>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <FolderGit2 className="h-4 w-4 text-primary" />
                          {t.projects.overviewTitle}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {copy?.overview}
                        </p>
                      </section>

                      <section className="rounded-xl border border-border/60 bg-muted/30 p-4">
                        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
                          <PackageOpen className="h-4 w-4 text-primary" />
                          {t.projects.sharedTitle}
                        </h3>
                        <p className="mb-3 text-xs text-muted-foreground/80">
                          {t.projects.sharedHint}
                        </p>
                        <ul className="space-y-2.5">
                          {copy?.shared.map(item => (
                            <li key={item} className="flex gap-2 text-sm leading-relaxed">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <section>
                          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                            <Users className="h-4 w-4 text-primary" />
                            {t.projects.audienceTitle}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {copy?.audience}
                          </p>
                        </section>
                        <section>
                          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                            <HandHeart className="h-4 w-4 text-primary" />
                            {t.projects.contributeTitle}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {copy?.contribute}
                          </p>
                        </section>
                      </div>

                      <section>
                        <h3 className="mb-2 text-sm font-semibold">{t.projects.technologies}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {detailProject.technologies.map(tech => (
                            <Badge key={tech} variant="secondary" className="font-normal">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </section>

                      {detailProject.extraLinks && detailProject.extraLinks.length > 0 && (
                        <section>
                          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                            <Link2 className="h-4 w-4 text-primary" />
                            {t.projects.linksTitle}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {detailProject.extraLinks.map(link => (
                              <a
                                key={link.url}
                                href={link.url}
                                target={link.url.startsWith('http') ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                              >
                                {link.label[language]}
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </section>
                      )}

                      <div className="flex flex-col gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {detailProject.author}
                          </span>
                          <span>
                            {t.projects.statusLabel}：{copy?.statusNote}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="max-w-md leading-relaxed text-muted-foreground/70">
                            {t.projects.sourceNote}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-xs"
                            onClick={() => copyProjectLink(detailProject)}
                          >
                            {copiedId === detailProject.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-primary" />
                                {t.projects.copied}
                              </>
                            ) : (
                              <>
                                <Link2 className="h-3.5 w-3.5" />
                                {t.projects.copyLink}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
