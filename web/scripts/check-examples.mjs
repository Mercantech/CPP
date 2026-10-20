import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// This checks the delivered curriculum assets, not C++ semantics. The module is
// intentionally plain JavaScript with a .ts extension; importing its source this
// way evaluates String.raw exactly as the lesson does, without a build dependency.
const sourceUrl = new URL('../src/pages/h5/codeExamples.ts', import.meta.url)
const source = await readFile(sourceUrl, 'utf8')
const examples = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
const normalize = (text) => text.replaceAll('\r\n', '\n')

const downloads = {
  objectsCode: 'objekter.cpp',
  memoryCode: 'hukommelse.cpp',
  libraryCode: 'standardbibliotek.cpp',
  fileCode: 'filer.cpp',
  cmakeCode: 'CMakeLists.txt',
  projectHeaderCode: 'projekt/SensorLog.hpp',
  projectModelCode: 'projekt/SensorLog.cpp',
  projectMainCode: 'projekt/main.cpp',
  projectCmakeCode: 'projekt/CMakeLists.txt',
  projectData: 'projekt/measurements.csv',
  projectDockerCode: 'projekt/Dockerfile',
}

assert.deepEqual(Object.keys(examples).sort(), Object.keys(downloads).sort(),
  'Every displayed code export needs an explicitly checked download')

for (const [name, path] of Object.entries(downloads)) {
  const downloaded = await readFile(new URL(`../public/examples/h5/${path}`, import.meta.url), 'utf8')
  assert.equal(normalize(downloaded), normalize(examples[name]), `Displayed code differs from download: ${path}`)
}

// The introductory main is shown directly in Oversigt.tsx rather than exported.
// Verify that its displayed template evaluates to the same downloadable program.
const overview = await readFile(new URL('../src/pages/h5/Oversigt.tsx', import.meta.url), 'utf8')
const mainMatch = overview.match(/<CodeBlock>\{(`[^`]+`)\}<\/CodeBlock>/)
assert.ok(mainMatch, 'The overview must retain its complete first program')
const intro = await import(`data:text/javascript;base64,${Buffer.from(`export default ${mainMatch[1]}`).toString('base64')}`)
const downloadedIntro = await readFile(new URL('../public/examples/h5/main.cpp', import.meta.url), 'utf8')
assert.equal(normalize(downloadedIntro), normalize(intro.default), 'Overview main.cpp differs from its download')

console.log(`Verified ${Object.keys(downloads).length + 1} displayed examples against downloadable files. C++ compilation is a separate check.`)
