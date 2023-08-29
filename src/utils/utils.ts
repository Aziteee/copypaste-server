import { type IMongoCompare, type MongoCompareParameter } from './types'
import dayjs from 'dayjs'

/**
 * 解析方式一：逐字解析
 */
// export function parseQueryCode(q: string): any {
//   const parsed: any = {
//     text: []
//   }

//   let start = 0
//   for (let i = 0; i < q.length; i++) {
//     const char = q[i]
//   }

//   return {}
// }

/**
 * 解析方式二：按空格分块解析
 */
export function parseQueryCode(q: string): Record<string, string> {
  const parsed: any = {}

  const chunks = q.split(' ')
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    if (/^[A-z]+:/.test(chunk)) {
      const param = chunk.split(':')[0]
      const value = chunk.split(':').pop()
      if (value !== undefined) {
        parsed[param] = value

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

export function parseStringToMongoCompareObj(str: string): IMongoCompare {
  const comparisonTable: Record<string, MongoCompareParameter> = {
    '>=': '$gte',
    '<=': '$lte',
    '>': '$gt',
    '<': '$lt'
  }

  const parsed: IMongoCompare = {}

  const chunks = str.split(';')
  for (const item of chunks) {
    for (const symbol of Object.keys(comparisonTable)) {
      if (item.startsWith(symbol)) {
        const value = item.replace(symbol, '')
        const key = comparisonTable[symbol]
        if (!isNaN(Number(value))) {
          parsed[key] = Number(value)
        } else if (dayjs(value).isValid()) {
          parsed[key] = dayjs(value).toDate()
        }

        if (key in parsed) break
      }
    }
  }

  return parsed
}
