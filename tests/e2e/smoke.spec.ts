import { test, expect } from '@playwright/test'

const routes = ['/', '/team', '/projects', '/resources', '/join', '/learning']

for (const route of routes) {
  test(`${route} mounts without console errors`, async ({ page }) => {
    const errors: string[] = []
    const failedRequests: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('response', (res) => {
      if (res.status() === 404) failedRequests.push(res.url())
    })

    await page.goto(route)
    await expect(page.locator('#root')).not.toBeEmpty()
    await page.waitForTimeout(2500) // allow lazy chunks + entrance animations
    expect(errors, `console errors on ${route}; 404s: ${failedRequests.join(', ')}`).toEqual([])
    if (route === '/projects') {
      expect(failedRequests, 'unexpected 404s on /projects').toEqual([])
    }
  })
}

test('markdown viewer renders code blocks on demand', async ({ page }) => {
  await page.goto('/markdown')
  await expect(page.locator('#root')).not.toBeEmpty()
  await expect(page.locator('pre').first()).toBeVisible({ timeout: 15_000 })
  expect(await page.locator('code').count()).toBeGreaterThan(0)
})

test('technical docs load markdown and syntax highlighting', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('/docs/technical/development-guide')
  await expect(page.locator('h1').first()).toContainText('开发指南', {
    timeout: 15_000,
  })
  expect(await page.locator('pre').count()).toBeGreaterThan(10)
  expect(errors).toEqual([])
})

test('light and dark themes apply distinct background colors', async ({ page }) => {
  await page.goto('/')

  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark')
    location.reload()
  })
  await page.waitForTimeout(1500)
  const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

  await page.evaluate(() => {
    localStorage.setItem('theme', 'light')
    location.reload()
  })
  await page.waitForTimeout(1500)
  const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

  expect(darkBg).not.toEqual(lightBg)
  expect(darkBg).toBe('rgb(2, 8, 23)')
  expect(lightBg).toBe('rgb(248, 250, 252)')
})

test('SPA navigation to team renders without a full reload error', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('/')
  await expect(page.locator('#root')).not.toBeEmpty()
  await page.goto('/team')
  await expect(page.locator('#root')).not.toBeEmpty()
  await page.waitForTimeout(2000)
  expect(errors).toEqual([])
})
