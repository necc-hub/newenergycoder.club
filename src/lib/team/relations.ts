import { projects } from '@/data/projects'
import type { TeamMember } from '@/lib/i18n/types/translations'
import type { MemberGroup, MemberRecord } from './members'

export type RelationMode = 'project' | 'direction'

export interface RelationNode {
  id: string
  label: string
  members: MemberRecord[]
}

export interface Collaborator {
  member: MemberRecord
  sharedProjects: NonNullable<TeamMember['projects']>
  sharedDirectionIds: string[]
}

export function searchMembers(
  members: MemberRecord[],
  query: string,
  group: MemberGroup | 'all',
  directionNames: Record<string, string> = {},
): MemberRecord[] {
  const q = query.trim().toLowerCase()
  const projectTitles = new Map<string, string>(projects.map(project => [project.id, project.title]))
  return members.filter(member => {
    if (group !== 'all' && member.group !== group) return false
    const projectsText = member.projects
      ?.map(project =>
        `${project.name} ${projectTitles.get(project.id) ?? ''} ${project.id}`,
      )
      .join(' ') ?? ''
    const directionsText = member.directions.map(id => directionNames[id] ?? id).join(' ')
    const haystack = `${member.name} ${member.role} ${member.bio} ${member.tags?.join(' ') ?? ''} ${projectsText} ${directionsText}`.toLowerCase()
    return !q || haystack.includes(q)
  })
}

export function getProjectCoverage(members: MemberRecord[]): RelationNode[] {
  const memberProjectNames = new Map<string, string>(
    members.flatMap(m => (m.projects ?? []).map(p => [p.id, p.name])),
  )
  const knownNodes = projects.map(project => ({
    id: project.id,
    label: project.title,
    members: members.filter(m => m.projects?.some(p => p.id === project.id)),
  }))
  const unknownNodes = [...memberProjectNames]
    .filter(([id]) => !projects.some(p => p.id === id))
    .map(([id, label]) => ({
      id,
      label,
      members: members.filter(m => m.projects?.some(p => p.id === id)),
    }))
  return [...knownNodes, ...unknownNodes].filter(node => node.members.length >= 1)
}

export function getProjectNodes(members: MemberRecord[]): RelationNode[] {
  return getProjectCoverage(members).filter(node => node.members.length >= 2)
}

export function getDirectionCoverage(
  members: MemberRecord[],
  names: Record<string, string>,
): RelationNode[] {
  const ids = [...new Set(members.flatMap(m => m.directions))]
  return ids.map(id => ({
    id,
    label: names[id] ?? id,
    members: members.filter(m => m.directions.includes(id)),
  }))
}

export function getDirectionNodes(
  members: MemberRecord[],
  names: Record<string, string>,
): RelationNode[] {
  return getDirectionCoverage(members, names).filter(node => node.members.length >= 2)
}

export function getCollaborators(current: MemberRecord, members: MemberRecord[]): Collaborator[] {
  const currentProjects = new Set<string>(current.projects?.map(p => p.id) ?? [])
  const currentDirections = new Set<string>(current.directions)
  return members
    .filter(m => m.id !== current.id)
    .map(member => ({
      member,
      sharedProjects: member.projects?.filter(p => currentProjects.has(p.id)) ?? [],
      sharedDirectionIds: member.directions.filter(id => currentDirections.has(id)),
    }))
    .filter(c => c.sharedProjects.length > 0 || c.sharedDirectionIds.length > 0)
    .sort((a, b) =>
      b.sharedProjects.length - a.sharedProjects.length
      || b.sharedDirectionIds.length - a.sharedDirectionIds.length
      || members.indexOf(a.member) - members.indexOf(b.member),
    )
}

export function getGraphMembers(allMembers: MemberRecord[], relatedMembers: MemberRecord[]) {
  const ordered = allMembers.filter(member => relatedMembers.some(related => related.id === member.id))
  return { visible: ordered.slice(0, 12), hiddenCount: Math.max(0, ordered.length - 12) }
}

export function getTeamInsights(members: MemberRecord[], directionNames: Record<string, string>) {
  return {
    totalMembers: members.length,
    directions: getDirectionCoverage(members, directionNames),
    projects: getProjectCoverage(members),
    completeness: {
      withSkills: members.filter(m => ((m.tags?.length ?? 0) + (m.skills?.length ?? 0)) > 0).length,
      withProjects: members.filter(m => (m.projects?.length ?? 0) > 0).length,
      withContact: members.filter(m =>
        m.github || m.gitee || m.email || m.bonjour || m.linkedin,
      ).length,
    },
  }
}

export interface MemberPageContext {
  member: MemberRecord
  collaborators: Collaborator[]
}

export function getMemberPageContext(id: string, members: MemberRecord[]): MemberPageContext | null {
  const member = members.find(item => item.id === id)
  return member ? { member, collaborators: getCollaborators(member, members) } : null
}
