import { useRef } from 'react'
import { useLanguage, useTranslation } from '@/contexts/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, Users } from 'lucide-react'
import { GiteeIcon } from '@/components/ui/gitee-icon'
import { type AspectRatio } from '@/components/ui/floating-controls'
import { Link } from 'react-router-dom'
import { projects as hubProjects, type ProjectCategory, type ProjectStatus } from '@/data/projects'
import { projectDetails } from '@/lib/i18n/locales/projectDetails'

/** 首页展示的重点项目（与项目库同源） */
const featuredIds = ['12', '9', '10', '2', '7', '1']

const categoryLabels: Partial<Record<ProjectCategory, string>> = {
  robotics: '🏆 机器人与竞赛',
  web: '💻 Web 与平台',
  embedded: '⚡ 嵌入式',
  iot: '🏭 物联网与工业',
  system: '🔬 系统与科研',
  research: '🔬 科研横向',
  ai: '🤖 AI 与技能库',
  docs: '📚 文档',
}

interface Project {
  title: string
  description: string
  category: string
  status: ProjectStatus
  tags: string[]
  githubUrl?: string
  giteeUrl?: string
  demoUrl?: string
  participants?: number
}

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'seasonal': return 'bg-sky-100 text-sky-800 border-sky-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return `🟢 ${t.projects.statusActive}`
      case 'development': return `🟡 ${t.projects.statusDevelopment}`
      case 'seasonal': return `🔵 ${t.projects.statusSeasonal}`
      case 'archived': return `⚪ ${t.projects.statusArchived}`
      default: return '⚪ —'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {project.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(project.status)}`}
              >
                {getStatusText(project.status)}
              </Badge>
            </div>
          </div>
          {project.participants && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{project.participants}</span>
            </div>
          )}
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 技术标签 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* 项目链接 */}
        <div className="flex gap-2 flex-wrap">
          {project.giteeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.giteeUrl} target="_blank" rel="noopener noreferrer">
                <GiteeIcon className="h-4 w-4 mr-1" />
                Gitee
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                GitHub
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                {t.projects.liveDemo}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ProjectsSectionProps {
  selectedRatio?: AspectRatio;
}

export function ProjectsSection({ selectedRatio: _selectedRatio = 'aspect-[3/4]' }: ProjectsSectionProps) {
  const t = useTranslation()
  const { language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Project cards stagger entrance
      gsap.fromTo(
        gridRef.current?.children || [],
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Buttons entrance
      gsap.fromTo(
        buttonsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  // 与 /projects 页面共用同一份经核实的数据（真实仓库地址与状态）
  const hotProjects: Project[] = hubProjects
    .filter(p => featuredIds.includes(p.id))
    .map(p => {
      const copy = projectDetails[language][p.id]
      return {
        title: p.title,
        description: copy?.tagline ?? '',
        category: categoryLabels[p.category],
        status: p.status,
        tags: p.technologies.slice(0, 5),
        githubUrl: p.githubUrl,
        giteeUrl: p.giteeUrl,
        demoUrl: p.projectUrl?.startsWith('http') ? p.projectUrl : undefined,
        participants: undefined,
      }
    })

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        {/* 标题部分 */}
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {t.projects.featuredTitle}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {t.projects.featuredDescription}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        {/* 项目网格 */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {hotProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div ref={buttonsRef} className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <a
                href="https://github.com/necc-hub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {t.projects.browseRepos}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="min-w-[200px]">
              <Link to="/projects">
                <Star className="h-5 w-5 mr-2" />
                {t.projects.viewAllProjects}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}