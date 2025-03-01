import { getWallets, runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { deployErc20 } from '@/modules/blockchain'
import { CHAINS, DEPLOY_SLEEP_RANGE } from '@data/config'

export const cmdDeployErc20 = async () => {
  try {
    const wallets = await getWallets()
    for (const wallet of wallets) {
      try {
        const erc20Contract = await deployErc20(CHAINS.EXPchain.rpcUrl, wallet.privateKey)
        logger.info(`(${wallet.id}) Deployed ERC-20 contract: ${CHAINS.EXPchain.explorerUrl}/tx/${erc20Contract?.hash}`)
      } catch (err) {
        logger.error(`(${wallet.id})`, err)
      }

      if (wallet === wallets[wallets.length - 1]) break
      await runSleep(DEPLOY_SLEEP_RANGE[0], DEPLOY_SLEEP_RANGE[1])
    }
  } catch (err) {
    logger.error('', err)
  }
}
