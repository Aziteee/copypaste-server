import pino from 'pino'

const logger = pino(pino.transport({
  targets: [{
    level: 'debug',
    target: 'pino-pretty',
    options: { destination: 1 }
  },
  {
    level: 'trace',
    target: 'pino/file',
    options: { destination: 'logs/server.log' }
  }]
}))

export default logger
