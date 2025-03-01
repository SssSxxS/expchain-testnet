import { logger } from '@/lib/logger'
import { createWalletsXlsx, getWalletsData, type WalletXlsx } from '@/modules/xlsx'

export const cmdOnAll = async () => {
  try {
    const wallets = await getWalletsData()
    const updatedWallets: WalletXlsx[] = []

    for (const wallet of wallets) {
      updatedWallets.push({ ...wallet, toggle: 'ON' })
    }
    logger.info(`"ON" ${updatedWallets.length} wallets, "OFF" 0 wallets`)
    await createWalletsXlsx(updatedWallets)
  } catch (err) {
    logger.error('', err)
  }
}
