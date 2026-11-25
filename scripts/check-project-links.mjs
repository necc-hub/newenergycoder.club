#!/usr/bin/env node
/**
 * 校验 src/data/projects.ts 里的 GitHub 链接是否仍然存在。
 *
 * 背景：项目库的链接曾因仓库目录重构大面积失效（/tree/master/projects/ai/... 等）。
 * 这个脚本把“链接漂移”变成可自动发现的问题，而不是等用户点到 404。
 *
 * 用法：
 *   node scripts/check-project-links.mjs          # 需要本机已登录 gh
 *   node scripts/check-project-links.mjs --dry    # 只列出链接，不请求
 *
 * 说明：使用 gh api 而不是裸 fetch，既复用本机凭据，也避开 GitHub 的匿名限流。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataFile = resolve(root, 'src/data/projects.ts')
const dryRun = process.argv.includes('--dry')

const source = readFileSync(dataFile, 'utf8')
const urls = [...new Set([...source.matchAll(/https:\/\/[^\s'"]+/g)].map(m => m[0]))]
  .filter(url => url.startsWith('https://github.com/'))

/** 把 github.com 页面地址转成 gh api 端点 */
function toApiPath(url) {
  const parts = url.replace('https://github.com/', '').split('/')
  const [owner, repo] = parts
  const [, kind, ref, ...rest] = parts
  if (kind === 'tree' || kind === 'blob') {
    return `repos/${owner}/${repo}/contents/${rest.join('/')}?ref=${ref}`
  }
  return `repos/${owner}/${repo}`
}

if (urls.length === 0) {
  console.error('未在 projects.ts 中找到任何 GitHub 链接')
  process.exit(1)
}

let failed = 0
for (const url of urls) {
  if (dryRun) {
    console.log(`DRY  ${url}`)
    continue
  }
  try {
    execFileSync(
      'gh',
      ['api', toApiPath(url), '--jq', 'if type=="array" then .[0].path else .name end'],
      { stdio: 'pipe' }
    )
    console.log(`OK   ${url}`)
  } catch {
    failed += 1
    console.error(`FAIL ${url}`)
  }
}

if (dryRun) {
  console.log(`\n共 ${urls.length} 条链接（未校验）`)
  process.exit(0)
}

console.log(`\n共 ${urls.length} 条链接，失败 ${failed} 条`)
process.exit(failed === 0 ? 0 : 1)