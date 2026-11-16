// Every interaction is local and also works after the connection is cut.
const toc = document.querySelector('.page-toc details')
function revealTarget() {
  if (!location.hash) return
  let id
  try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
  const target = document.getElementById(id)
  if (!target) return
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true
  }
  if (toc) toc.open = false
  requestAnimationFrame(() => {
    target.scrollIntoView({ block: 'start' })
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  })
}
window.addEventListener('hashchange', revealTarget)
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]')
  if (link && link.hash === location.hash) revealTarget()
})
revealTarget()

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copy).textContent
    const status = document.getElementById(button.getAttribute('aria-describedby'))
    try {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Fallback for a local file or a browser without Clipboard API permission.
        const input = document.createElement('textarea')
        input.className = 'clipboard-fallback'
        input.value = text
        input.setAttribute('aria-label', 'Texte à copier')
        document.body.append(input)
        input.select()
        const copied = document.execCommand('copy')
        input.remove()
        button.focus({ preventScroll: true })
        if (!copied) throw new Error('Clipboard unavailable')
      }
      button.textContent = 'Copié !'
      status.textContent = 'Texte copié.'
    } catch {
      status.textContent = 'Sélectionne le texte du bloc pour le copier.'
    }
  })
}

let closedBeforePrint = []
window.addEventListener('beforeprint', () => {
  closedBeforePrint = [...document.querySelectorAll('article details:not([open])')]
  closedBeforePrint.forEach(details => { details.open = true })
})
window.addEventListener('afterprint', () => {
  closedBeforePrint.forEach(details => { details.open = false })
})
