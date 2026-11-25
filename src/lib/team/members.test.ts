import { describe, expect, it } from 'vitest'
import { assertUniqueMemberIds, buildMemberDirectory, findMember, memberProfilePath } from './members'
import { maintainers, developers, designers, contributors } from '@/lib/i18n/constants/team'
import { translations } from '@/lib/i18n'
import type { TeamMember } from '@/lib/i18n/types/translations'

const person = (id: string, name = id): TeamMember => ({ id, name, role: 'Developer', bio: '', image: '' })

describe('member identity', () => {
  it('creates an encoded profile path', () => {
    expect(memberProfilePath(person('peng-keying'))).toBe('/team/member/peng-keying')
  })

  it('rejects duplicate ids with readable names', () => {
    expect(() => assertUniqueMemberIds([person('zhang-wangwang'), person('zhang-wangwang', '张旺旺')]))
      .toThrow('Duplicate member id "zhang-wangwang": zhang-wangwang, 张旺旺')
  })

  it('rejects invalid id format', () => {
    expect(() => assertUniqueMemberIds([person('Peng Keying')]))
      .toThrow('Invalid member id "Peng Keying"')
  })
})

describe('member constants', () => {
  it('has unique, valid ids across all groups', () => {
    const all = [...maintainers, ...developers, ...designers, ...contributors]
    expect(all.length).toBeGreaterThanOrEqual(70)
    assertUniqueMemberIds(all)
    expect(new Set(all.map(m => m.id)).size).toBe(all.length)
  })

  it('keeps the two 张旺旺 records as separate identities', () => {
    const all = [...maintainers, ...developers, ...designers, ...contributors]
    const zhangs = all.filter(m => m.name === '张旺旺')
    expect(zhangs.map(m => m.id)).toEqual([
      'zhang-wangwang-maintainer',
      'zhang-wangwang-contributor',
    ])
  })
})

describe('localized member directory', () => {
  it('contains every unique member record built from constants', () => {
    const english = buildMemberDirectory(translations.en.team)
    const expectedCount = [...maintainers, ...developers, ...designers, ...contributors].length
    expect(english).toHaveLength(expectedCount)
    expect(new Set(english.map(m => m.id)).size).toBe(expectedCount)
  })

  it('keeps identity and projects stable when Chinese text changes', () => {
    const english = buildMemberDirectory(translations.en.team)
    const chinese = buildMemberDirectory(translations.zh.team)
    expect(chinese).toHaveLength(english.length)
    const enDarren = english.find(m => m.id === 'darrenpig')
    const zhDarren = chinese.find(m => m.id === 'darrenpig')
    expect(zhDarren?.role).toContain('实验室')
    expect(zhDarren?.projects).toEqual(enDarren?.projects)
    expect(enDarren?.directions).toEqual(zhDarren?.directions)
  })

  it('maps the drifted Chinese name 彭柯颖 back to the canonical peng-keying id', () => {
    const chinese = buildMemberDirectory(translations.zh.team)
    const member = findMember(chinese, 'peng-keying')
    expect(member?.name).toBe('彭柯颖')
    expect(member?.projects?.length).toBeGreaterThan(0)
  })

  it('does not conflate same-name members', () => {
    const chinese = buildMemberDirectory(translations.zh.team)
    const zhangs = chinese.filter(m => m.name === '张旺旺')
    expect(zhangs.map(m => m.id).sort()).toEqual([
      'zhang-wangwang-contributor',
      'zhang-wangwang-maintainer',
    ])
  })
})
