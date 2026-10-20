import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import c from 'highlight.js/lib/languages/c'
import csharp from 'highlight.js/lib/languages/csharp'
import arduino from 'highlight.js/lib/languages/arduino'

hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', c)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('arduino', arduino)
hljs.registerLanguage('ino', arduino)

const ALIASES: Record<string, string> = {
  'c++': 'cpp',
  cxx: 'cpp',
  h: 'cpp',
  ino: 'arduino',
  cs: 'csharp',
}

export function highlightCode(
  code: string,
  language?: string,
): { html: string; language: string | undefined } {
  const trimmed = code.replace(/\n$/, '')
  if (!language || language === 'text' || language === 'plain') {
    return { html: escapeHtml(trimmed), language: undefined }
  }

  const resolved = ALIASES[language] ?? language
  try {
    if (hljs.getLanguage(resolved)) {
      return {
        html: hljs.highlight(trimmed, { language: resolved, ignoreIllegals: true }).value,
        language,
      }
    }
  } catch {
    /* fall through */
  }

  return { html: escapeHtml(trimmed), language }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
