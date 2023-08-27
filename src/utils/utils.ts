import { type IParsedQueryCode } from './types'

export function parseQueryCode(q: string): IParsedQueryCode {
  const parsed: IParsedQueryCode = {}

  const chunks = q.split(' ')
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    if (/^[a-z]+:/.test(chunk)) {
      const param = chunk.split(':')[0]
      const value = chunk.split(':').pop()
      if (value !== undefined) {
        if (param === 'uploader') parsed.uploader = value

        chunks.splice(i, 1)
        i--
      }
    }
  }

  const matchText = chunks.join(' ')
  if (matchText !== '') {
    parsed.text = RegExp(matchText)
  }

  return parsed
}
