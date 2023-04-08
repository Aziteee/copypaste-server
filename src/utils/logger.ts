import pino from 'pino'
import fs from 'fs'
import path from 'path'

const logsPath = path.resolve('logs')

// 创建logs文件夹以存放日志
if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath)

const logger = pino(pino.transport({
  targets: [{
    level: 'debug',
    target: 'pino-pretty',
    options: { destination: 1 }
  },
  {
    level: 'trace',
    target: 'pino/file',
    options: { destination: path.join(logsPath, 'server.log') }
  }]
}))

export default logger
