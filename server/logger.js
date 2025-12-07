import winston from 'winston'
import { join } from 'path'
import fs from 'fs'

const logsDir = join(process.cwd(), 'server', 'logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new winston.transports.File({ filename: join(logsDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: join(logsDir, 'combined.log') }),
  ],
  exitOnError: false,
})

export default logger
