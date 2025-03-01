import { logger } from '@/lib/logger'

export const cmdExit = async () => {
  logger.success('Exiting...')
  process.exit(0)
}
