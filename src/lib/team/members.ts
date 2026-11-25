import { maintainers, developers, designers, contributors } from '@/lib/i18n/constants/team'
import type { Translations, TeamMember } from '@/lib/i18n/types/translations'
import { deriveDirectionIds } from './tech-modules'

export function assertUniqueMemberIds(members: TeamMember[]): void {
  const ids = new Map<string, TeamMember>()
  for (const member of members) {
    const existing = ids.get(member.id)
    if (existing) {
      throw new Error(`Duplicate member id "${member.id}": ${existing.name}, ${member.name}`)
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(member.id)) {
      throw new Error(`Invalid member id "${member.id}" for ${member.name}`)
    }
    ids.set(member.id, member)
  }
}

export function memberProfilePath(member: Pick<TeamMember, 'id'>): string {
  return `/team/member/${encodeURIComponent(member.id)}`
}

export type MemberGroup = 'maintainers' | 'developers' | 'designers' | 'contributors'

export interface MemberRecord extends TeamMember {
  group: MemberGroup
  profilePath: string
  directions: string[]
}

type TeamCopy = Pick<Translations['team'], MemberGroup>

const GROUPS: { group: MemberGroup; members: TeamMember[] }[] = [
  { group: 'maintainers', members: maintainers },
  { group: 'contributors', members: contributors },
  { group: 'developers', members: developers },
  { group: 'designers', members: designers },
]

export function buildMemberDirectory(team: TeamCopy): MemberRecord[] {
  const localized = new Map<string, TeamMember>(
    GROUPS.flatMap(({ group }) => team[group].map(member => [member.id, member])),
  )
  const members = GROUPS.flatMap(({ group, members }) =>
    members.map(base => {
      const copy = localized.get(base.id)
      const localizedProjectMap = new Map<string, NonNullable<TeamMember['projects']>[number]>(
        (copy?.projects || []).map(project => [project.id, project]),
      )
      const member: TeamMember = {
        ...base,
        name: copy?.name ?? base.name,
        role: copy?.role ?? base.role,
        bio: copy?.bio ?? base.bio,
        tags: copy?.tags?.length ? copy.tags : base.tags,
        skills: copy?.skills?.length ? copy.skills : base.skills,
        projects: base.projects?.map(project => {
          const localizedProjectText = localizedProjectMap.get(project.id)
          return localizedProjectText
            ? { ...project, name: localizedProjectText.name, role: localizedProjectText.role }
            : project
        }),
      }
      return {
        ...member,
        group,
        profilePath: memberProfilePath(member),
        directions: deriveDirectionIds(base.tags, base.skills),
      }
    }),
  )
  assertUniqueMemberIds(members)
  return members
}

export function findMember(members: MemberRecord[], id: string): MemberRecord | undefined {
  return members.find(member => member.id === id)
}
