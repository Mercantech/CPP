// Read-only route and rendered-content integrity check. Run: node scripts/check-routes.mjs
import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const appSource = await readFile(path.join(root, 'src/App.tsx'), 'utf8')
const componentImports = new Map(
  [...appSource.matchAll(/import\s+(\w+)\s+from\s+['"](\.[^'"]+)['"]/g)]
    .map((match) => [match[1], `/src/${match[2].replace(/^\.\//, '')}.tsx`]),
)
const routes = [...appSource.matchAll(/<Route\s+(index|path="([^"]+)")\s+element=\{<(\w+)\s*\/>\}/g)]
  .map((match) => ({ path: match[1] === 'index' ? '/' : match[2] === '*' ? '*' : `/${match[2]}`, component: match[3] }))
assert(routes.length > 0, 'No routes found: adapt this check if the App route syntax changes')
const canonicalRoutes = new Set(routes.filter((route) => route.path !== '*').map((route) => route.path))
const failures = []
const rendered = new Map()
const publicFiles = new Set()
const linkedRoutes = new Set()
let internalLinks = 0
let fragmentLinks = 0
let downloads = 0

function decode(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'")
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]))
}

async function fileExists(file) {
  try { return (await stat(file)).isFile() } catch { return false }
}

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: Layout } = await server.ssrLoadModule(componentImports.get('Layout'))
  const loaded = await Promise.all(routes.map(async (route) => {
    const modulePath = componentImports.get(route.component)
    assert(modulePath, `No default import found for ${route.component}`)
    const { default: Component } = await server.ssrLoadModule(modulePath)
    assert.equal(typeof Component, 'function', `${route.component} must export a component`)
    return { ...route, Component }
  }))

  for (const route of loaded) {
    const pathname = route.path === '*' ? '/qa-unknown-route' : route.path
    const html = renderToString(createElement(MemoryRouter, { initialEntries: [pathname] },
      createElement(Routes, null,
        createElement(Route, { element: createElement(Layout) },
          ...loaded.map((entry) => createElement(Route, { key: entry.path, path: entry.path, element: createElement(entry.Component) })),
        ),
      ),
    ))
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    if (new Set(ids).size !== ids.length) failures.push(`${pathname}: duplicate HTML ids`)
    if ((html.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${pathname}: expected exactly one h1`)
    if (!html.includes('id="indhold"')) failures.push(`${pathname}: main/skip-link target missing`)
    if (html.includes('[object Object]')) failures.push(`${pathname}: an object appears to have been rendered as text`)
    rendered.set(pathname, { html, ids: new Set(ids) })
  }

  for (const [pathname, page] of rendered) {
    for (const tag of page.html.matchAll(/<a\b[^>]*>/g)) {
      const attr = attributes(tag[0])
      if (!attr.href || /^(?:mailto:|tel:|data:|blob:)/i.test(attr.href)) continue
      const target = new URL(attr.href, `https://course.test${pathname}`)
      if (target.origin !== 'https://course.test') continue
      internalLinks += 1
      const decodedPath = decodeURIComponent(target.pathname)
      if (canonicalRoutes.has(decodedPath) || decodedPath === '/qa-unknown-route') {
        linkedRoutes.add(decodedPath)
        if (target.hash) {
          fragmentLinks += 1
          const destination = rendered.get(decodedPath)
          const id = decodeURIComponent(target.hash.slice(1))
          if (!destination?.ids.has(id)) failures.push(`${pathname}: missing anchor ${attr.href}`)
        }
      } else {
        const asset = path.join(root, 'public', decodedPath)
        if (!(await fileExists(asset))) failures.push(`${pathname}: broken internal link/download ${attr.href}`)
        else {
          publicFiles.add(decodedPath)
          if (/\bdownload(?:[\s=>]|$)/.test(tag[0])) downloads += 1
        }
      }
    }
    for (const tag of page.html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
      const attr = attributes(tag[0])
      if (!attr.src || !attr.src.startsWith('/')) continue
      const clean = decodeURIComponent(attr.src.split('?')[0])
      const asset = path.join(root, clean.startsWith('/src/') ? '' : 'public', clean)
      if (!(await fileExists(asset))) failures.push(`${pathname}: missing local asset ${attr.src}`)
      else publicFiles.add(clean)
    }
  }

  for (const route of canonicalRoutes) {
    if (route !== '/' && !linkedRoutes.has(route)) failures.push(`${route}: no internal link reaches this route`)
  }
  const h5Examples = await server.ssrLoadModule('/src/pages/h5/codeExamples.ts')
  const h3Examples = await server.ssrLoadModule('/src/data/mission.ts')
  const examples = [
    [h5Examples.objectsCode, 'h5/objekter.cpp'],
    [h5Examples.memoryCode, 'h5/hukommelse.cpp'],
    [h5Examples.libraryCode, 'h5/standardbibliotek.cpp'],
    [h5Examples.fileCode, 'h5/filer.cpp'],
    [h5Examples.projectHeaderCode, 'h5/projekt/SensorLog.hpp'],
    [h5Examples.projectModelCode, 'h5/projekt/SensorLog.cpp'],
    [h5Examples.projectMainCode, 'h5/projekt/main.cpp'],
    [h5Examples.projectCmakeCode, 'h5/projekt/CMakeLists.txt'],
    [h5Examples.projectData, 'h5/projekt/measurements.csv'],
    [h5Examples.projectDockerCode, 'h5/projekt/Dockerfile'],
    [h3Examples.signalStationSolution, 'h3/Signalstation/Signalstation.ino'],
  ]
  for (const [displayed, file] of examples) {
    const downloaded = await readFile(path.join(root, 'public/examples', file), 'utf8')
    if (typeof displayed !== 'string' || displayed.replaceAll('\r\n', '\n') !== downloaded.replaceAll('\r\n', '\n')) {
      failures.push(`Displayed example differs from download: ${file}`)
    }
  }
  if (failures.length) {
    console.error(failures.join('\n'))
    process.exitCode = 1
  } else {
    console.log(`Route QA passed: ${canonicalRoutes.size} routes + 404 render; ${internalLinks} internal links, ${fragmentLinks} anchors, ${downloads} download links and ${publicFiles.size} local files verified. ${examples.length} displayed examples match downloads.`)
  }
} finally {
  await server.close()
}
