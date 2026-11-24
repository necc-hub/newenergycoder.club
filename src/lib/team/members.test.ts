import { describe, expect, it } from 'vitest'
import { assertUniqueMemberIds, memberProfilePath } from './members'
import { maintainers, developers, designers, contributors } from '@/lib/i18n/constants/team'
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
  it('has 70 unique, valid ids across all groups', () => {
    const all = [...maintainers, ...developers, ...designers, ...contributors]
    expect(all).toHaveLength(70)
    assertUniqueMemberIds(all)
    expect(new Set(all.map(m => m.id)).size).toBe(70)
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
