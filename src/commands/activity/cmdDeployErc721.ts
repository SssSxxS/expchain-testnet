import { getWallets, runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { deployErc721 } from '@/modules/blockchain'
import { CHAINS, DEPLOY_SLEEP_RANGE } from '@data/config'

export const cmdDeployErc721 = async () => {
  try {
    const wallets = await getWallets()
    for (const wallet of wallets) {
      try {
        const erc721Contract = await deployErc721(CHAINS.EXPchain.rpcUrl, wallet.privateKey)
        logger.info(
          `(${wallet.id}) Deployed ERC-721 contract: ${CHAINS.EXPchain.explorerUrl}/tx/${erc721Contract?.hash}`
        )
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
