import { getWallets, runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { approveToken, bridgeTzkj, getBalanceToken } from '@/modules/blockchain'
import {
  BRIDGE_CHAINS,
  BRIDGE_SLEEP_RANGE_BETWEEN_CHAINS,
  BRIDGE_SLEEP_RANGE_BETWEEN_WALLETS,
  CHAINS,
} from '@data/config'

export const cmdBridgeTokensToExpchain = async () => {
  try {
    const wallets = await getWallets()

    for (const wallet of wallets) {
      try {
        for (const chainName of BRIDGE_CHAINS) {
          try {
            if (!CHAINS[chainName]) throw new Error(`(${wallet.id}) Unknown chain: ${chainName}`)

            const chain = CHAINS[chainName]
            const currentBalance = await getBalanceToken(chain.rpcUrl, chain.tzkjAddress!, wallet.address)
            logger.info(`(${wallet.id}) Trying to bridge ${currentBalance} $tZKJ from ${chain.name} to EXPchain`)

            /* -------------------------------------------------------------------------- */

            const approve = await approveToken(
              chain.rpcUrl,
              wallet.privateKey,
              chain.tzkjAddress!,
              chain.bridgeAddress!,
              currentBalance
            )
            logger.success(
              `(${wallet.id}) Approve ${currentBalance} $tZKJ to bridge: ${chain.explorerUrl}/tx/${approve.hash}`
            )

            /* -------------------------------------------------------------------------- */

            const bridge = await bridgeTzkj(
              chain.rpcUrl,
              wallet.privateKey,
              chain.bridgeAddress!,
              chain.tzkjAddress!,
              currentBalance,
              wallet.address
            )
            logger.success(`(${wallet.id}) Bridge ${currentBalance} $tZKJ: ${chain.explorerUrl}/tx/${bridge.hash}`)

            /* -------------------------------------------------------------------------- */
          } catch (err) {
            logger.error('', err)
          }

          if (chainName === BRIDGE_CHAINS[BRIDGE_CHAINS.length - 1]) break
          await runSleep(BRIDGE_SLEEP_RANGE_BETWEEN_CHAINS[0], BRIDGE_SLEEP_RANGE_BETWEEN_CHAINS[1])
        }
      } catch (err) {
        logger.error('', err)
      }

      if (wallet === wallets[wallets.length - 1]) break
      await runSleep(BRIDGE_SLEEP_RANGE_BETWEEN_WALLETS[0], BRIDGE_SLEEP_RANGE_BETWEEN_WALLETS[1])
    }
  } catch (err) {
    logger.error('', err)
  }
}
