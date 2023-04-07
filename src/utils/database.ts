import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(config.get<string>('mongodb.uri'))
    logger.info('connected to MongoDB')
  } catch (err) {
    logger.error(`MongoDB connection error\n${String(err)}`)
    process.exit(1)
  }
}
