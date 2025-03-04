import { getWallets, runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { getRandomFloat } from '@/lib/utils'
import { exchangeCurve } from '@/modules/blockchain'
import { CHAINS, SWAP_AMOUNT, SWAP_SLEEP_RANGE } from '@data/config'

export const cmdSwapTzkjToWtzkj = async () => {
  try {
    const wallets = await getWallets()
    for (const wallet of wallets) {
      try {
        const amount = String(Number(getRandomFloat(SWAP_AMOUNT[0], SWAP_AMOUNT[1]).toFixed(3)))
        const route = [
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          '0xB671A1B90CD11Fb9554F6BA8bad1cc13129E3BB2',
          '0xB671A1B90CD11Fb9554F6BA8bad1cc13129E3BB2',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
        ]
        const swapParams = [
          ['0', '0', '8', '0'],
          ['0', '0', '0', '0'],
          ['0', '0', '0', '0'],
          ['0', '0', '0', '0'],
          ['0', '0', '0', '0'],
        ]
        const exchange = await exchangeCurve(
          CHAINS.EXPchain.rpcUrl,
          wallet.privateKey,
          '0xB4c6A1e8A14e9Fe74c88b06275b747145DD41206',
          route,
          swapParams,
          amount
        )
        logger.success(
          `(${wallet.id}) Swap ${amount} $tZKJ to $wtZKJ ${CHAINS.EXPchain.explorerUrl}/tx/${exchange.hash}`
        )
      } catch (err) {
        logger.error('', err)
      }

      if (wallet === wallets[wallets.length - 1]) break
      await runSleep(SWAP_SLEEP_RANGE[0], SWAP_SLEEP_RANGE[1])
    }
  } catch (err) {
    logger.error('', err)
  }
}
