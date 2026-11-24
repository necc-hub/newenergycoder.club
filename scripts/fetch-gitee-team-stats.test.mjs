import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const SCRIPT_SOURCE = fileURLToPath(new URL('./fetch-gitee-team-stats.mjs', import.meta.url))
const OLD_REMOTE_URL = 'https://github.com/new-energy-coder-club/new_energy_coder_club.git'
const NEW_REMOTE_URL = 'https://github.com/necc-hub/new_energy_coder_club.git'

function runGit(cwd, args, env = process.env) {
  return execFileSync('git', args, { cwd, env, encoding: 'utf8' }).trim()
}

test('updates an existing github-project remote after the repository moves', (t) => {
  const repo = mkdtempSync(path.join(tmpdir(), 'nec-team-stats-'))
  t.after(() => rmSync(repo, { recursive: true, force: true }))

  const scriptsDir = path.join(repo, 'scripts')
  mkdirSync(scriptsDir)
  const script = path.join(scriptsDir, path.basename(SCRIPT_SOURCE))
  copyFileSync(SCRIPT_SOURCE, script)

  const bareRepo = path.join(repo, 'mirror.git')
  runGit(repo, ['init'])
  runGit(repo, ['init', '--bare', bareRepo])

  const seed = path.join(repo, 'seed')
  mkdirSync(seed)
  runGit(seed, ['init'])
  runGit(seed, ['config', 'user.name', 'Test User'])
  runGit(seed, ['config', 'user.email', 'test@example.com'])
  writeFileSync(path.join(seed, 'README.md'), 'test\n')
  runGit(seed, ['add', 'README.md'])
  runGit(seed, ['commit', '-m', 'Initial commit'])
  runGit(seed, ['push', bareRepo, 'HEAD:master'])

  runGit(repo, ['remote', 'add', 'github-project', OLD_REMOTE_URL])

  // Redirect both GitHub URLs to a local bare repository so the test never
  // depends on network access or changes the user's actual repository.
  const env = {
    ...process.env,
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: `url.${bareRepo}.insteadOf`,
    GIT_CONFIG_VALUE_0: OLD_REMOTE_URL,
    GIT_CONFIG_KEY_1: `url.${bareRepo}.insteadOf`,
    GIT_CONFIG_VALUE_1: NEW_REMOTE_URL,
  }
  const fetchStub = path.join(repo, 'disable-network.mjs')
  writeFileSync(fetchStub, "globalThis.fetch = async () => { throw new Error('Network disabled in test') }\n")

  const result = spawnSync(process.execPath, ['--import', fetchStub, script], {
    cwd: repo,
    env,
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  assert.equal(runGit(repo, ['config', '--get', 'remote.github-project.url'], env), NEW_REMOTE_URL)
})
