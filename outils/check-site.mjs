// Vérifie le site généré, sans paquet à installer ni requête externe.
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { resolve, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const here = dirname(fileURLToPath(import.meta.url))
const project = resolve(here, '../..')
const root = resolve(project, 'depot-participants/docs')
const output = resolve(project, '.verification-v5/site')
const require = createRequire(resolve(project, 'presentation-slidev/package.json'))
const { chromium } = require('playwright-chromium')
const MarkdownIt = require('markdown-it')
const markdown = new MarkdownIt({ html: true, linkify: true, typographer: false })
const sha256 = value => createHash('sha256').update(value).digest('hex')
const views = [{ width: 1440, height: 900 }, { width: 390, height: 844 }]
const pages = [{ route: '', source: 'depot-participants/README.md' }]
for (const system of ['mac', 'windows', 'linux']) {
  for (const memory of ['moins-de-24-go', 'de-24-a-36-go', '36-go-et-plus']) {
    pages.push({ route: `${system}/${memory}/`, source: `depot-participants/${system}/${memory}/README.md` })
  }
}
pages.push({ route: 'jour-j/', source: 'depot-jour-j/README.md' })
await mkdir(resolve(output, 'tmp'), { recursive: true })
process.env.TMPDIR = resolve(output, 'tmp')
const report = {
  generatedAt: new Date().toISOString(), browser: '', pages: [], links: [], anchors: [],
  copy: [], exerciseBytes: [], print: [], externalRequests: [], failedResponses: [], errors: [],
  scope: 'Site servi localement sous /atelier-ia-locale/. Chromium, sans publication.',
  limits: ['Essai sur un téléphone physique et publication GitHub Pages non réalisés.', 'Contrôles de contraste limités au texte HTML; les pixels des captures restent leur contenu d’origine.'],
}
const fail = message => report.errors.push(message)
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' }
const basePath = '/atelier-ia-locale/'
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    if (!pathname.startsWith(basePath)) { res.writeHead(404).end(); return }
    let path = resolve(root, pathname.slice(basePath.length))
    if (path !== root && !path.startsWith(root + '/')) { res.writeHead(403).end(); return }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html')
    res.setHeader('Content-Type', contentTypes[extname(path)] || 'application/octet-stream')
    res.end(await readFile(path))
  } catch { res.writeHead(404).end() }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
const origin = `http://127.0.0.1:${server.address().port}`
const base = origin + basePath
const externalRequests = new Set()
const failedResponses = new Set()
const internalLinks = new Map()
let browser

// Mesure le débordement de la page. Les tableaux et les blocs de code peuvent
// défiler dans leur propre cadre, sans élargir le document.
async function geometry(page) {
  return page.evaluate(() => {
    const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
    const escaped = [...document.querySelectorAll('body *')].filter(element => {
      if (!visible(element)) return false
      const box = element.getBoundingClientRect()
      if (box.left >= -1 && box.right <= innerWidth + 1) return false
      for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(parent).overflowX)) return false
      }
      return true
    }).slice(0, 15).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent.slice(0, 80) }))
    return { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, escaped }
  })
}

async function contrast(page) {
  return page.evaluate(() => {
    const parse = color => {
      const values = color.match(/[\d.]+/g)?.map(Number) || [0, 0, 0]
      return [...values.slice(0, 3), values[3] ?? 1]
    }
    const blend = (top, bottom) => top.slice(0, 3).map((value, i) => value * top[3] + bottom[i] * (1 - top[3])).concat(1)
    const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0)
    const failures = []
    let minimum = 100
    let checked = 0
    for (const element of document.querySelectorAll('body *')) {
      if (!element.getClientRects().length || ![...element.childNodes].some(node => node.nodeType === 3 && node.textContent.trim())) continue
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden') continue
      const ancestors = []
      for (let node = element; node; node = node.parentElement) ancestors.unshift(node)
      let background = [255, 255, 255, 1]
      for (const ancestor of ancestors) background = blend(parse(getComputedStyle(ancestor).backgroundColor), background)
      const color = blend(parse(style.color), background)
      const a = luminance(color), b = luminance(background)
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      const size = parseFloat(style.fontSize), weight = parseInt(style.fontWeight) || 400
      const required = size >= 24 || (size >= 18.666 && weight >= 700) ? 3 : 4.5
      checked++
      minimum = Math.min(minimum, ratio)
      if (ratio + 0.01 < required) failures.push({ text: element.textContent.trim().slice(0, 100), ratio: +ratio.toFixed(2), required })
    }
    return { checked, minimum: +minimum.toFixed(2), failures }
  })
}

try {
  browser = await chromium.launch({ headless: true })
  report.browser = browser.version()
  for (const viewport of views) {
    const context = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'], locale: 'fr-BE' })
    await context.route('**/*', async route => {
      const url = route.request().url()
      if (url.startsWith(origin + '/') || /^(data:|blob:)/.test(url)) return route.continue()
      externalRequests.add(url)
      return route.abort()
    })
    context.on('response', response => { if (response.status() >= 400) failedResponses.add(`${response.status()} ${response.url()}`) })
    const page = await context.newPage()
    page.on('pageerror', error => fail(`${viewport.width}px : ${error.message}`))
    for (const entry of pages) {
      const label = entry.route || 'accueil/'
      const url = base + entry.route
      const source = await readFile(resolve(project, entry.source), 'utf8')
      const tokens = markdown.parse(source, {})
      const blocks = tokens.filter(token => token.type === 'fence' || token.type === 'code_block').map(token => token.content)
      const response = await page.goto(url, { waitUntil: 'networkidle' })
      if (!response?.ok()) fail(`${label}: page absente`)
      await page.evaluate(() => document.fonts.ready)
      const initial = await geometry(page)
      if (initial.document > viewport.width + 1 || initial.body > viewport.width + 1 || initial.escaped.length) fail(`${label} ${viewport.width}px: débordement initial`)
      const fonts = await page.evaluate(() => [...document.fonts].filter(font => /Open Sans/i.test(font.family)).map(font => ({ family: font.family, status: font.status })))
      if (!fonts.some(font => font.status === 'loaded')) fail(`${label} ${viewport.width}px: Open Sans non chargée`)
      const images = await page.locator('img').evaluateAll(elements => elements.map(element => ({ src: element.getAttribute('src'), alt: element.getAttribute('alt'), complete: element.complete && element.naturalWidth > 0 })))
      if (images.some(image => !image.complete || !image.alt)) fail(`${label}: image absente ou sans texte alternatif`)
      const screenshot = `${entry.route.replaceAll('/', '-').replace(/-$/, '') || 'accueil'}-${viewport.width}x${viewport.height}.png`
      const topScreenshot = `top-${screenshot}`
      await page.screenshot({ path: resolve(output, topScreenshot), fullPage: false })
      await page.screenshot({ path: resolve(output, screenshot), fullPage: true })
      const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => ({ raw: element.getAttribute('href'), href: element.href, text: element.textContent.trim() })))
      for (const link of links) {
        if (/github\.com\/sanma88\/atelier-ia-locale(?:-jour-j)?(?:[\/#]|$)/.test(link.href)) fail(`${label}: lien entre pages resté sur GitHub: ${link.raw}`)
        if (!link.href.startsWith(origin + '/')) continue
        if (link.raw.startsWith(origin) || link.raw.startsWith('https://sanma88.github.io/')) fail(`${label}: lien interne non relatif: ${link.raw}`)
        const target = new URL(link.href)
        const key = target.pathname + target.search + target.hash
        if (!internalLinks.has(key)) internalLinks.set(key, { from: label, raw: link.raw, href: link.href })
      }
      // Tous les identifiants du contenu sont aussi des destinations possibles,
      // même si aucun autre paragraphe de cette édition n'y renvoie encore.
      const contentIds = await page.locator('article [id], article[id]').evaluateAll(elements => elements.map(element => element.id))
      for (const id of contentIds) {
        const target = new URL(`#${encodeURIComponent(id)}`, url)
        const key = target.pathname + target.hash
        if (!internalLinks.has(key)) internalLinks.set(key, { from: label, raw: `#${id}`, href: target.href })
      }
      const contentCheck = await page.evaluate(reference => {
        const expected = document.createElement('div')
        expected.innerHTML = reference
        const actual = document.querySelector('article#contenu')?.cloneNode(true)
        if (!actual) return { equal: false, reason: 'article#contenu absent' }
        actual.querySelectorAll('.copy-button, [role="status"], .code-toolbar, .admonition-title, .callout-title, .alert-title').forEach(element => element.remove())
        const normal = value => value.replace(/\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]/g, '').replace(/\s+/g, ' ').trim()
        const a = normal(actual.textContent), b = normal(expected.textContent)
        let firstDifference = 0
        while (a[firstDifference] === b[firstDifference] && firstDifference < Math.min(a.length, b.length)) firstDifference++
        return { equal: a === b, characters: b.length, actualLength: a.length, firstDifference, actual: a.slice(Math.max(0, firstDifference - 50), firstDifference + 160), expected: b.slice(Math.max(0, firstDifference - 50), firstDifference + 160) }
      }, markdown.render(source))
      if (!contentCheck.equal) fail(`${label}: texte rendu différent du README: ${JSON.stringify(contentCheck)}`)
      const displayed = await page.locator('.code-block pre code').allTextContents()
      if (displayed.length !== blocks.length) fail(`${label}: ${displayed.length} blocs rendus pour ${blocks.length} blocs source`)
      blocks.forEach((text, index) => {
        if (!Buffer.from(text).equals(Buffer.from(displayed[index] || ''))) fail(`${label}: bloc ${index + 1} affiché différent à l’octet`)
      })
      const tableRegions = await page.locator('table').evaluateAll(tables => tables.map(table => ({ scrollable: !!table.closest('.table-scroll'), keyboard: table.closest('.table-scroll')?.getAttribute('tabindex') === '0', named: !!table.closest('.table-scroll')?.getAttribute('aria-label') })))
      if (tableRegions.some(table => !table.scrollable || !table.keyboard || !table.named)) fail(`${label}: tableau sans défilement clavier nommé`)
      // Le premier appui sur Tab doit rendre accessible le lien d’évitement.
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0) })
      await page.keyboard.press('Tab')
      const keyboard = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent.trim(), href: document.activeElement.getAttribute('href'), outline: getComputedStyle(document.activeElement).outlineStyle }))
      if (keyboard.tag !== 'A' || !keyboard.href?.startsWith('#')) fail(`${label}: lien d’évitement non accessible au premier Tab`)
      if (keyboard.outline === 'none') fail(`${label}: focus clavier sans contour visible`)
      const firstSummary = page.locator('article details > summary').first()
      if (await firstSummary.count()) {
        await firstSummary.focus()
        const before = await firstSummary.evaluate(element => element.parentElement.open)
        await firstSummary.press('Enter')
        if (await firstSummary.evaluate(element => element.parentElement.open) === before) fail(`${label}: volet non commandable au clavier`)
      }
      await page.evaluate(() => document.querySelectorAll('details').forEach(element => { element.open = true }))
      const expanded = await geometry(page)
      if (expanded.document > viewport.width + 1 || expanded.body > viewport.width + 1 || expanded.escaped.length) fail(`${label} ${viewport.width}px: débordement avec volets ouverts`)
      const colors = await contrast(page)
      if (colors.failures.length) fail(`${label} ${viewport.width}px: contraste texte sous AA ${JSON.stringify(colors.failures)}`)
      // Le réseau est coupé après chargement; la copie réelle passe par Clipboard.
      await context.setOffline(true)
      for (let index = 0; index < blocks.length; index++) {
        const button = page.locator('.copy-button').nth(index)
        await button.evaluate(element => element.scrollIntoView({ block: 'center' }))
        if (index === 0) { await button.focus(); await button.press('Enter') } else await button.click()
        const statusId = await button.getAttribute('aria-describedby')
        await page.waitForFunction(id => /copi[ée]/i.test(document.getElementById(id)?.textContent || ''), statusId, { timeout: 2000 }).catch(() => fail(`${label}: confirmation de copie absente au bloc ${index + 1}`))
        const copied = await page.evaluate(() => navigator.clipboard.readText())
        const exact = Buffer.from(copied).equals(Buffer.from(blocks[index]))
        report.copy.push({ page: label, viewport: viewport.width, block: index + 1, bytes: Buffer.byteLength(copied), sha256: sha256(copied), exact, offline: true })
        if (!exact) fail(`${label} ${viewport.width}px: presse-papier bloc ${index + 1} différent à l’octet`)
        if (entry.route === 'jour-j/' && /^(Raccourcis les formulations|Réécris ce mail fictif)/.test(blocks[index])) {
          const raw = [...source.matchAll(/^```text\r?\n([\s\S]*?)^```/gm)].map(match => match[1]).find(value => value.startsWith(blocks[index].split('\n')[0]))
          const rawExact = raw !== undefined && Buffer.from(copied).equals(Buffer.from(raw))
          const mail = raw?.slice(raw.indexOf('Bonjour Claire,'))
          const copiedMail = copied.slice(copied.indexOf('Bonjour Claire,'))
          const mailExact = !!mail && Buffer.from(mail).equals(Buffer.from(copiedMail))
          report.exerciseBytes.push({ viewport: viewport.width, block: index + 1, promptAndMailExact: rawExact, mailExact, bytes: Buffer.byteLength(copied), sha256: sha256(copied), mailSha256: sha256(copiedMail) })
          if (!rawExact || !mailExact) fail(`${label}: consigne ou mail de Sophie différent du texte brut`)
          const exercise = blocks[index].startsWith('Raccourcis') ? 'temps-1' : 'temps-2'
          if (exercise === 'temps-1') {
            await page.evaluate(() => { location.hash = '#bloc-complet' })
            await page.waitForTimeout(100)
          }
          await page.screenshot({ path: resolve(output, `exercice-${exercise}-copie-${viewport.width}x${viewport.height}.png`) })
        }
      }
      await context.setOffline(false)
      if (viewport.width === 1440) {
        await page.evaluate(() => document.querySelectorAll('article details').forEach(element => { element.open = false }))
        await page.emulateMedia({ media: 'print' })
        await page.evaluate(() => dispatchEvent(new Event('beforeprint')))
        const print = await page.evaluate(() => ({
          buttonsHidden: [...document.querySelectorAll('.copy-button')].every(element => !element.getClientRects().length),
          tocHidden: !document.querySelector('.page-toc')?.getClientRects().length,
          codeWraps: [...document.querySelectorAll('pre')].every(element => ['pre-wrap', 'break-spaces'].includes(getComputedStyle(element).whiteSpace)),
          allDetailsVisible: [...document.querySelectorAll('article details')].every(element => element.open || [...element.children].filter(child => child.tagName !== 'SUMMARY').every(child => child.getClientRects().length)),
          fixedElements: [...document.querySelectorAll('body *')].filter(element => element.getClientRects().length && ['fixed', 'sticky'].includes(getComputedStyle(element).position)).length,
        }))
        report.print.push({ page: label, ...print })
        if (!print.buttonsHidden || !print.tocHidden || !print.codeWraps || !print.allDetailsVisible || print.fixedElements) fail(`${label}: feuille d’impression incomplète ${JSON.stringify(print)}`)
        if (entry.route === 'jour-j/') await page.pdf({ path: resolve(output, 'jour-j-impression.pdf'), format: 'A4', printBackground: true })
        await page.evaluate(() => dispatchEvent(new Event('afterprint')))
        await page.emulateMedia({ media: 'screen' })
      }
      report.pages.push({ page: label, viewport, screenshot, topScreenshot, sourceSha256: sha256(source), initial, expanded, fonts, contentCheck, tableRegions, keyboard, contrast: colors })
      console.log(`OK parcours: ${label} ${viewport.width}×${viewport.height}, ${blocks.length} copies hors ligne`)
    }
    await context.close()
  }
  // Contrôle chaque destination une fois; les liens de toutes les pages ont été collectés.
  const context = await browser.newContext({ viewport: views[1] })
  await context.route('**/*', async route => {
    if (route.request().url().startsWith(origin + '/')) return route.continue()
    externalRequests.add(route.request().url())
    return route.abort()
  })
  const page = await context.newPage()
  const groups = new Map()
  for (const link of internalLinks.values()) {
    const url = new URL(link.href)
    const documentUrl = url.origin + url.pathname + url.search
    if (!groups.has(documentUrl)) groups.set(documentUrl, [])
    groups.get(documentUrl).push(link)
  }
  for (const [documentUrl, links] of groups) {
    const response = await page.goto(documentUrl, { waitUntil: 'networkidle' })
    const ok = response?.ok() || false
    report.links.push({ url: documentUrl.replace(origin, ''), status: response?.status(), ok })
    if (!ok) { fail(`Destination interne absente: ${documentUrl}`); continue }
    for (const link of links) {
      const hash = new URL(link.href).hash
      if (!hash) continue
      const id = decodeURIComponent(hash.slice(1))
      await page.evaluate(({ hash }) => {
        document.querySelectorAll('details').forEach(element => { element.open = false })
        history.replaceState(null, '', location.pathname + location.search)
        location.hash = hash
      }, { hash })
      await page.waitForFunction(id => {
        const element = document.getElementById(id)
        if (!element) return true
        for (let parent = element.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS' && !parent.open) return false
        return true
      }, id, { timeout: 2000 }).catch(() => {})
      await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
      const result = await page.evaluate(id => {
        const element = document.getElementById(id)
        if (!element) return { exists: false, opened: false }
        let opened = true, depth = 0
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
          if (parent.tagName === 'DETAILS') { depth++; if (!parent.open) opened = false }
        }
        const top = element.getBoundingClientRect().top
        const tocBottom = document.querySelector('.page-toc')?.getBoundingClientRect().bottom || 0
        return { exists: true, opened, detailsDepth: depth, top, tocBottom, navigationVisible: top >= tocBottom - 1 && top < innerHeight }
      }, id)
      report.anchors.push({ target: new URL(link.href).pathname + hash, from: link.from, ...result })
      if (!result.exists || !result.opened) fail(`Ancre absente ou volet fermé: ${link.href}`)
      if (/^(etape-\d+|bloc-complet)$/.test(id) && !result.navigationVisible) fail(`Ancre de travail masquée par le sommaire ou hors écran: ${link.href}`)
    }
  }
  // Arrivée directe sur une ancre placée dans un volet, sans navigation préalable.
  const nested = report.anchors.find(anchor => anchor.detailsDepth > 0)
  if (nested) {
    await page.goto(origin + nested.target, { waitUntil: 'networkidle' })
    await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
    const opened = await page.evaluate(() => {
      let element = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (!element) return false
      for (; element; element = element.parentElement) if (element.tagName === 'DETAILS' && !element.open) return false
      return true
    })
    report.directNestedAnchor = { target: nested.target, opened }
    if (!opened) fail(`Arrivée directe dans un volet fermé: ${nested.target}`)
    await page.evaluate(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      const details = target?.closest('details')
      if (details) { details.open = false; details.querySelector('summary')?.scrollIntoView({ block: 'center' }) }
    })
    await page.screenshot({ path: resolve(output, 'ancre-volet-ferme-390x844.png') })
    await page.evaluate(() => dispatchEvent(new HashChangeEvent('hashchange')))
    await page.waitForTimeout(100)
    await page.screenshot({ path: resolve(output, 'ancre-volet-revele-390x844.png') })
  }
  await context.close()
} catch (error) {
  fail(error.stack || String(error))
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
  report.externalRequests = [...externalRequests]
  report.failedResponses = [...failedResponses]
  if (report.externalRequests.length) fail(`${report.externalRequests.length} requête(s) vers un autre domaine`)
  if (report.failedResponses.length) fail(`${report.failedResponses.length} réponse(s) HTTP en erreur`)
  if (report.exerciseBytes.length !== 4) fail(`Deux consignes attendues à deux largeurs: ${report.exerciseBytes.length} contrôles réalisés`)
  report.ok = report.errors.length === 0 && report.pages.length === 22
  await writeFile(resolve(output, 'site-qa.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ ok: report.ok, pages: report.pages.length, fullPageScreenshots: report.pages.length, viewportScreenshots: report.pages.length, copies: report.copy.length, exercises: report.exerciseBytes.length, destinations: report.links.length, anchors: report.anchors.length, externalRequests: report.externalRequests.length, errors: report.errors }, null, 2))
  if (!report.ok) process.exitCode = 1
}
