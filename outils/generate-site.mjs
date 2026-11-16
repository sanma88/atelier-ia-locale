// Local, deterministic Markdown build. No network, dependency installation or publication.
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises'
import { dirname, resolve, relative, basename, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const here = dirname(fileURLToPath(import.meta.url))
const participants = resolve(here, '..')
const project = resolve(participants, '..')
const output = resolve(participants, 'docs')
const require = createRequire(resolve(project, 'presentation-slidev/package.json'))
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
const escape = md.utils.escapeHtml
const site = 'https://sanma88.github.io/atelier-ia-locale/'
const pages = [{ source: resolve(participants, 'README.md'), route: '' }]
for (const os of ['mac', 'windows', 'linux']) {
  for (const memory of ['moins-de-24-go', 'de-24-a-36-go', '36-go-et-plus']) {
    pages.push({ source: resolve(participants, os, memory, 'README.md'), route: `${os}/${memory}/` })
  }
}
pages.push({ source: resolve(project, 'depot-jour-j/README.md'), route: 'jour-j/' })
const sourceRoutes = new Map(pages.map(page => [page.source, page.route]))
const toRelative = (from, to) => {
  const path = posix.relative(from || '.', to || '.')
  return path ? `${path.replace(/\/$/, '')}/` : './'
}

function pageLink(href, page) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:')) return href
  const [path, hash = ''] = href.split('#')
  let route
  if (path.startsWith(site)) route = path.slice(site.length).replace(/(?:index\.html|README\.md)$/, '')
  if (/^https:\/\/github\.com\/sanma88\/atelier-ia-locale-jour-j\/?$/.test(path)) route = 'jour-j/'
  const github = path.match(/^https:\/\/github\.com\/sanma88\/atelier-ia-locale(?:\/(?:tree|blob)\/main(?:\/(.*))?)?\/?$/)
  if (github) route = (github[1] || '').replace(/^docs\//, '').replace(/README\.md$/, '').replace(/\/?$/, '/')
  if (!/^[a-z][a-z\d+.-]*:/i.test(path)) {
    const target = resolve(dirname(page.source), decodeURIComponent(path))
    route = sourceRoutes.get(target) ?? sourceRoutes.get(resolve(target, 'README.md'))
  }
  if (route === undefined) return href
  route = route.replace(/^\//, '')
  if (!pages.some(item => item.route === route.replace(/\/?$/, '/')) && route !== '') {
    throw new Error(`Unknown internal page: ${href} in ${page.source}`)
  }
  return toRelative(page.route, route) + (hash ? `#${hash}` : '')
}

function imageLink(src, page) {
  if (/^(?:[a-z]+:|\/\/)/i.test(src)) throw new Error(`External image: ${src}`)
  return `${toRelative(page.route, '')}assets/${basename(src)}`
}

md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  token.attrSet('href', pageLink(token.attrGet('href'), env.page))
  return renderer.renderToken(tokens, index, options)
}
const renderImage = md.renderer.rules.image
md.renderer.rules.image = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  token.attrSet('src', imageLink(token.attrGet('src'), env.page))
  // Images load with the page, including those in closed details, before going offline.
  token.attrSet('decoding', 'async')
  return renderImage(tokens, index, options, env, renderer)
}
md.renderer.rules.fence = (tokens, index, options, env) => {
  const token = tokens[index]
  const number = ++env.codeNumber
  const id = `code-${number}`
  env.blocks.push(token.content)
  return `<div class="code-block"><div class="code-tools"><button type="button" class="copy-button" aria-label="Copier le bloc ${number}" aria-describedby="${id}-status" data-copy="${id}">Copier</button><span id="${id}-status" role="status" aria-live="polite"></span></div><pre tabindex="0" aria-label="Bloc à copier ${number}"><code id="${id}">${escape(token.content)}</code></pre></div>\n`
}
md.renderer.rules.table_open = () => '<div class="table-scroll" role="region" aria-label="Tableau à faire défiler horizontalement" tabindex="0"><table>\n'
md.renderer.rules.table_close = () => '</table></div>\n'

const admonitions = { NOTE: 'Note', IMPORTANT: 'Important', WARNING: 'Attention', TIP: 'Astuce', CAUTION: 'Avertissement' }
function prepareTokens(tokens) {
  const toc = []
  const used = new Set()
  // Reserve every explicit anchor before assigning heading IDs.
  for (const token of tokens) for (const match of token.content.matchAll(/\bid="([^"]+)"/g)) used.add(match[1])
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'heading_open') {
      const title = tokens[i + 1].children.filter(t => ['text', 'code_inline'].includes(t.type)).map(t => t.content).join('')
      const slug = title.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').replace(/\s/g, '-')
      let id = slug, counter = 0
      while (used.has(id)) id = `${slug}-${++counter}`
      used.add(id)
      token.attrSet('id', id)
      if (token.tag === 'h2') {
        // Prefer the README's deliberate anchor directly before this section.
        const preceding = tokens[i - 1]?.type === 'html_block' ? tokens[i - 1].content
          : tokens[i - 1]?.type === 'paragraph_close' ? tokens[i - 2]?.content || '' : ''
        const anchor = [...preceding.matchAll(/<a id="([^"]+)"><\/a>/g)][0]?.[1]
        toc.push({ id: anchor || id, title })
      }
    }
    if (token.type === 'blockquote_open') {
      const inline = tokens[i + 2]
      const marker = inline?.type === 'inline' && inline.content.match(/^\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\](?:\n|$)/)
      if (!marker) continue
      const label = admonitions[marker[1]]
      token.type = 'html_block'
      token.content = `<aside class="admonition" aria-label="${label}"><p class="admonition-title">${label}</p>\n`
      inline.content = inline.content.slice(marker[0].length)
      inline.children = md.parseInline(inline.content, {})[0].children
      let depth = 1
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].type === 'blockquote_open') depth++
        if (tokens[j].type === 'blockquote_close' && --depth === 0) {
          tokens[j].type = 'html_block'
          tokens[j].content = '</aside>\n'
          break
        }
      }
    }
  }
  return toc
}

await mkdir(resolve(output, 'assets'), { recursive: true })
await cp(resolve(project, 'presentation-slidev/public/fonts'), resolve(output, 'assets/fonts'), { recursive: true })
await cp(resolve(project, 'presentation-slidev/public/visuels/logo-helmo.png'), resolve(output, 'assets/logo-helmo.png'))
await cp(resolve(project, 'depot-jour-j/assets'), resolve(output, 'assets'), { recursive: true })
for (const file of ['site.css', 'site.js']) await cp(resolve(here, file), resolve(output, 'assets', file))
await writeFile(resolve(output, '.nojekyll'), '')
const manifest = []
for (const page of pages) {
  const source = await readFile(page.source, 'utf8')
  const env = { page, codeNumber: 0, blocks: [] }
  const tokens = md.parse(source, env)
  // Move the source logo to the header, retaining its bytes and alternative text.
  for (const token of tokens) {
    if (token.type === 'html_block' && /^\s*(?:<p>)?<img [^>]*src="[^"]*logo-helmo\.png"[^>]*>(?:<\/p>)?\s*$/.test(token.content)) token.content = ''
  }
  const toc = prepareTokens(tokens)
  const titleIndex = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1')
  const title = tokens[titleIndex + 1].content
  const assets = `${toRelative(page.route, '')}assets/`
  const home = toRelative(page.route, '')
  const workshop = toRelative(page.route, 'jour-j/')
  const navigation = page.route === 'jour-j/' ? `<a class="main-link" href="${home}">Retour à l’installation</a>` : `<a class="main-link" href="${workshop}">Page de l’atelier</a>${page.route ? `<a href="${home}">Installation</a>` : ''}`
  const body = md.renderer.render(tokens, md.options, env)
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'">
<title>${escape(title)} | HELMo</title>
<link rel="icon" href="${assets}logo-helmo.png" type="image/png">
<link rel="stylesheet" href="${assets}site.css">
<script src="${assets}site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header"><a class="logo-zone" href="https://www.helmo.be/" aria-label="HELMo, site de la haute école"><img src="${assets}logo-helmo.png" alt="HELMo" width="120" height="120"></a><nav aria-label="Pages de l’atelier">${navigation}</nav></header>
<nav class="page-toc" aria-label="Étapes de cette page"><details><summary>Sommaire de la page</summary><ol>${toc.map(item => `<li><a href="#${escape(item.id)}">${escape(item.title)}</a></li>`).join('')}</ol></details></nav>
<main><article id="contenu" tabindex="-1">${body}</article></main>
</body>
</html>
`
  const destination = resolve(output, page.route)
  await mkdir(destination, { recursive: true })
  await writeFile(resolve(destination, 'index.html'), html)
  // A GitHub-readable fallback is delivered with the Pages output.
  await writeFile(resolve(destination, 'README.md'), source)
  if (page.route === 'jour-j/') await cp(resolve(project, 'depot-jour-j/assets'), resolve(destination, 'assets'), { recursive: true })
  manifest.push({ route: page.route, source: relative(project, page.source), sourceSha256: createHash('sha256').update(source).digest('hex'), codeBlocks: env.blocks.map(value => ({ bytes: Buffer.byteLength(value), sha256: createHash('sha256').update(value).digest('hex') })) })
}
await writeFile(resolve(output, 'build-manifest.json'), JSON.stringify({ pages: manifest }, null, 2) + '\n')
console.log(`Site généré : ${pages.length} pages dans ${relative(project, output)}/. README de secours, images, Open Sans et licence embarqués.`)
