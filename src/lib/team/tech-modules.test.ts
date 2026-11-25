import { describe, expect, it } from 'vitest'
import { deriveDirectionIds, keywordMatchesTag, TECH_MODULES } from './tech-modules'

describe('technical direction matching', () => {
  it('matches Chinese substrings and Latin boundaries', () => {
    expect(keywordMatchesTag('STM32', 'STM32 开发板 H7')).toBe(true)
    expect(keywordMatchesTag('AI', 'brain')).toBe(false)
    expect(keywordMatchesTag('嵌入式', '嵌入式开发')).toBe(true)
  })

  it('does not match Latin keyword inside another word', () => {
    expect(keywordMatchesTag('AI', 'brain')).toBe(false)
    expect(keywordMatchesTag('ROS', 'gross')).toBe(false)
  })

  it('deduplicates equivalent tags and uses skill names', () => {
    expect(deriveDirectionIds(['AI', '华为云AI'], [{ name: 'ROS', level: 80 }]))
      .toEqual(expect.arrayContaining(['ai', 'robotics']))
  })

  it('exposes 14 stable technical directions', () => {
    expect(TECH_MODULES).toHaveLength(14)
    expect(new Set(TECH_MODULES.map(m => m.id)).size).toBe(14)
  })
})
