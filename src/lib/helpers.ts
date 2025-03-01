import { getWalletsData } from '@/modules/xlsx'
import { SHUFFLE_WALLETS } from '@data/config'
import { logger } from './logger'
import { getRandomInt, shuffleArray } from './utils'

export const getWallets = async () => {
  let wallets = await getWalletsData()
  wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON')
  if (SHUFFLE_WALLETS) wallets = shuffleArray(wallets)
  logger.info(`[GOT ${wallets.length} WALLETS]`)
  return wallets
}

export const runSleep = async (min: number, max: number) => {
  const delay = getRandomInt(min, max)
  logger.info(`Sleeping for ${delay} seconds`)
  await Bun.sleep(delay * 1000)
}
