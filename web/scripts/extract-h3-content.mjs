import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/pages/h3')

const files = [
  ['Oversigt.tsx', 'Oversigt', 'OversigtContent'],
  ['Funktioner.tsx', 'Funktioner', 'FunktionerContent'],
  ['Datatyper.tsx', 'Datatyper', 'DatatyperContent'],
  ['Scope.tsx', 'Scope', 'ScopeContent'],
  ['Filer.tsx', 'Filer', 'FilerContent'],
  ['Kodestandarder.tsx', 'Kodestandarder', 'KodestandarderContent'],
  ['Refaktorering.tsx', 'Refaktorering', 'RefaktoreringContent'],
  ['VidenstjekPage.tsx', 'VidenstjekPage', 'VidenstjekContent'],
]

for (const [file, defName, contentName] of files) {
  const p = path.join(dir, file)
  let s = fs.readFileSync(p, 'utf8')
  if (s.includes(`export function ${contentName}`)) {
    console.log('skip', file)
    continue
  }

  const marker = `export default function ${defName}() {`
  const start = s.indexOf(marker)
  if (start < 0) {
    console.error('NO FUNC', file)
    continue
  }

  const layoutStart = s.indexOf('<LessonLayout module="h3">', start)
  const layoutEnd = s.lastIndexOf('</LessonLayout>')
  if (layoutStart < 0 || layoutEnd < 0) {
    console.error('NO LAYOUT', file)
    continue
  }

  const innerStart = layoutStart + '<LessonLayout module="h3">'.length
  const body = s.slice(innerStart, layoutEnd)
  const before = s.slice(0, start)
  const after = s.slice(layoutEnd + '</LessonLayout>'.length)
  // strip trailing `)\n}` from original return
  const afterClean = after.replace(/^\s*\)\s*\n\s*\}/, '')

  const next =
    before +
    `export function ${contentName}() {\n  return (\n    <>` +
    body +
    `</>\n  )\n}\n\nexport default function ${defName}() {\n  return (\n    <LessonLayout module="h3">\n      <${contentName} />\n    </LessonLayout>\n  )\n}\n` +
    afterClean

  fs.writeFileSync(p, next)
  console.log('ok', file)
}
