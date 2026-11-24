import type { TeamMember } from '@/lib/i18n/types/translations'

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
