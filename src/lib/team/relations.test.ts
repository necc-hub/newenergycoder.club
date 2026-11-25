import { describe, expect, it } from 'vitest'
import {
  getCollaborators,
  getDirectionCoverage,
  getDirectionNodes,
  getGraphMembers,
  getMemberPageContext,
  getProjectCoverage,
  getProjectNodes,
  getTeamInsights,
  searchMembers,
} from './relations'
import { buildMemberDirectory } from './members'
import { translations } from '@/lib/i18n'
import type { MemberRecord } from './members'

const member = (
  id: string,
  tags: string[] = [],
  projects: { id: string; name: string; role: string }[] = [],
): MemberRecord => ({
  id,
  name: id,
  role: 'Developer',
  bio: '',
  image: '',
  tags,
  projects,
  group: 'developers',
  profilePath: `/team/member/${id}`,
  directions: [
    ...(tags.includes('AI') ? ['ai'] : []),
    ...(tags.includes('ROS') ? ['robotics'] : []),
  ],
})

const people = [
  member('alice', ['AI'], [{ id: '3', name: 'Robot', role: 'Lead' }]),
  member('bob', ['AI', 'ROS'], [{ id: '3', name: 'Robot', role: 'Control' }]),
  member('carol', ['ROS']),
]

const directionNames = { ai: '人工智能', robotics: '机器人中间件' }

describe('member relationships', () => {
  it('intersects real project ids and directions without self', () => {
    const result = getCollaborators(people[0], people)
    expect(result[0].member.id).toBe('bob')
    expect(result[0].sharedProjects.map(p => p.id)).toEqual(['3'])
    expect(result[0].sharedDirectionIds).toEqual(['ai'])
    expect(result.some(r => r.member.id === 'alice')).toBe(false)
  })

  it('combines search and category filters case-insensitively', () => {
    expect(searchMembers(people, 'robot', 'developers', directionNames).map(m => m.id)).toEqual(['alice', 'bob'])
    expect(searchMembers(people, 'robot', 'maintainers', directionNames)).toEqual([])
    expect(searchMembers(people, '  AI  ', 'developers').map(m => m.id)).toEqual(['alice', 'bob'])
    expect(searchMembers(people, '人工智能', 'developers', directionNames).map(m => m.id)).toEqual(['alice', 'bob'])
  })

  it('only exposes nodes shared by at least two people', () => {
    expect(getProjectNodes(people).map(n => n.id)).toEqual(['3'])
    expect(getDirectionNodes(people, directionNames).map(n => n.id).sort()).toEqual(['ai', 'robotics'])
  })

  it('caps graph members but never the equivalent list', () => {
    const many = Array.from({ length: 14 }, (_, i) => member(`m-${i}`, ['AI']))
    const graph = getGraphMembers(many, many)
    expect(graph.visible).toHaveLength(12)
    expect(graph.hiddenCount).toBe(2)
    expect(getCollaborators(many[0], many)).toHaveLength(13)
  })

  it('counts direction membership once and reports completeness', () => {
    const extra = [...people, member('dave', ['AI'], [{ id: 'solo', name: 'Solo', role: 'Owner' }])]
    const insights = getTeamInsights(extra, { ai: 'AI', robotics: 'ROS' })
    expect(insights.totalMembers).toBe(4)
    expect(insights.directions.find(d => d.id === 'ai')?.members.length).toBe(3)
    expect(insights.projects.find(p => p.id === '3')?.members.length).toBe(2)
    expect(insights.projects.find(p => p.id === 'solo')?.members.length).toBe(1)
    expect(insights.completeness).toEqual({ withSkills: 4, withProjects: 3, withContact: 0 })
  })

  it('includes single-member projects/directions in coverage but not relation nodes', () => {
    const soloProject = member('solo-dev', ['ROS'], [{ id: 'solo-proj', name: 'Solo', role: 'Owner' }])
    const data = [...people, soloProject]
    const coverage = getProjectCoverage(data)
    const nodes = getProjectNodes(data)
    expect(coverage.some(n => n.id === 'solo-proj')).toBe(true)
    expect(nodes.some(n => n.id === 'solo-proj')).toBe(false)

    const dirCoverage = getDirectionCoverage(data, directionNames)
    const dirNodes = getDirectionNodes(data, directionNames)
    expect(dirCoverage.length).toBeGreaterThanOrEqual(dirNodes.length)
  })

  it('sorts collaborators by shared projects, then directions, then stable order', () => {
    const a = member('a', ['AI', 'ROS'], [{ id: '3', name: 'Robot', role: 'Lead' }])
    const b = member('b', ['AI'], [{ id: '3', name: 'Robot', role: 'Dev' }])
    const c = member('c', ['AI'])
    const current = member('current', ['AI', 'ROS'], [{ id: '3', name: 'Robot', role: 'PM' }])
    const list = [a, b, c]
    const collaborators = getCollaborators(current, list)
    expect(collaborators.map(c => c.member.id)).toEqual(['a', 'b', 'c'])
    expect(collaborators[0].sharedProjects.length).toBe(1)
    expect(collaborators[0].sharedDirectionIds).toContain('ai')
  })

  it('returns a member with collaborators or null for page context', () => {
    expect(getMemberPageContext('missing', people)).toBeNull()
    const context = getMemberPageContext('alice', people)
    expect(context?.member.id).toBe('alice')
    expect(context?.collaborators[0].member.id).toBe('bob')
  })
})

describe('localized relation search', () => {
  it('finds members by localized direction names and project titles', () => {
    const chinese = buildMemberDirectory(translations.zh.team)
    const embedded = searchMembers(chinese, '嵌入式开发', 'all', translations.zh.team.directionNames)
    expect(embedded.length).toBeGreaterThan(0)
    const robotProject = searchMembers(chinese, '人形机器人', 'all', translations.zh.team.directionNames)
    expect(robotProject.some(m => m.id === 'darrenpig')).toBe(true)
  })

  it('reports localized direction labels in insights', () => {
    const chinese = buildMemberDirectory(translations.zh.team)
    const insights = getTeamInsights(chinese, translations.zh.team.directionNames)
    expect(insights.directions.every(d => d.label && d.label !== d.id)).toBe(true)
    expect(insights.directions.some(d => d.label === '人工智能')).toBe(true)
  })
})
