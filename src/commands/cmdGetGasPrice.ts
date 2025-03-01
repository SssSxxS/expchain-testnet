import { logger } from '@/lib/logger'
import { getGasPrice } from '@/modules/blockchain'
import { CHAINS } from '@data/config'

export const cmdGetGasPrice = async () => {
  try {
    const gasPriceExpchain = await getGasPrice(CHAINS.EXPchain.rpcUrl)
    const gasPriceSepolia = await getGasPrice(CHAINS.Sepolia.rpcUrl)
    const gasPriceBsc = await getGasPrice(CHAINS.BSC.rpcUrl)

    logger.success('Gas Price:')
    logger.success(`  • EXPchain: ${gasPriceExpchain} gwei`)
    logger.success(`  • Sepolia:  ${gasPriceSepolia} gwei`)
    logger.success(`  • BSC:      ${gasPriceBsc} gwei`)
  } catch (err) {
    logger.error('', err)
  }
}
