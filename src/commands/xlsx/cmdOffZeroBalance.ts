import { logger } from '@/lib/logger'
import { createWalletsXlsx, getWalletsData, type WalletXlsx } from '@/modules/xlsx'

export const cmdOffZeroBalance = async () => {
  try {
    const wallets = await getWalletsData()
    const updatedWallets: WalletXlsx[] = []

    let onCount = 0
    let offCount = 0
    for (const wallet of wallets) {
      if (wallet.balanceTzkjExpchain === 0) {
        updatedWallets.push({ ...wallet, toggle: 'OFF' })
        offCount++
      } else {
        updatedWallets.push({ ...wallet, toggle: 'ON' })
        onCount++
      }
    }
    logger.info(`"ON" ${onCount} wallets, "OFF" ${offCount} wallets`)
    await createWalletsXlsx(updatedWallets)
  } catch (err) {
    logger.error('', err)
  }
}
