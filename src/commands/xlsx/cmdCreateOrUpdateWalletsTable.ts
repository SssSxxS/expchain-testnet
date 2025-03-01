import { logger } from '@/lib/logger'
import { getAddressFromPrivateKey, getBalanceNative, getBalanceToken } from '@/modules/blockchain'
import { createWalletsXlsx, getWalletsData, type WalletXlsx } from '@/modules/xlsx'
import {
  BSC_TESTNET_RPC_URL,
  EXPCHAIN_TESTNET_EXPLORER_URL,
  EXPCHAIN_TESTNET_RPC_URL,
  SEPOLIA_TESTNET_RPC_URL,
  TZKJ_ADDRESS_BSC,
  TZKJ_ADDRESS_SEPOLIA,
} from '@data/config'

export const cmdCreateOrUpdateWalletsTable = async () => {
  try {
    if (await Bun.file('./data/wallets.xlsx').exists()) {
      const wallets = await getWalletsData()
      const updatedWallets: WalletXlsx[] = []

      for (const [index, wallet] of wallets.entries()) {
        try {
          const address = await getAddressFromPrivateKey(wallet.privateKey)
          const explorerUrl = `${EXPCHAIN_TESTNET_EXPLORER_URL}/address/${address}`
          const balanceTzkjExpchain = await getBalanceNative(EXPCHAIN_TESTNET_RPC_URL, address)
          const balanceTzkjSepolia = await getBalanceToken(SEPOLIA_TESTNET_RPC_URL, TZKJ_ADDRESS_SEPOLIA, address)
          const balanceTzkjBnb = await getBalanceToken(BSC_TESTNET_RPC_URL, TZKJ_ADDRESS_BSC, address)

          updatedWallets.push({
            ...wallet,
            id: index + 1,
            address: address,
            explorerUrl: explorerUrl,
            balanceTzkjExpchain: parseFloat(balanceTzkjExpchain),
            balanceTzkjSepolia: parseFloat(balanceTzkjSepolia),
            balanceTzkjBnb: parseFloat(balanceTzkjBnb),
          })
          logger.info(`(${index + 1}) ${address} pushed`)
        } catch (err) {
          updatedWallets.push({
            ...wallet,
            id: index + 1,
            toggle: 'OFF',
          })
          logger.error('', err)
          logger.warn(`(${index + 1}) Failed`)
        }
        await createWalletsXlsx(updatedWallets)
      }
      logger.success('Wallets table has been updated')
    } else {
      const defaultWallets: WalletXlsx[] = [
        {
          id: 1,
          toggle: 'ON',
          proxy: '127.0.0.1:8080:user1:pass1',
          privateKey: '0xac0...ChangeMe',
          address: '0xf39...',
          explorerUrl: '',
          balanceTzkjExpchain: 0,
          balanceTzkjSepolia: 0,
          balanceTzkjBnb: 0,
          discordToken: 'MTAyChangeMeNDU4MzQ3ODIzNjM4NTM5MA.GEcXjX.dJ8Tz_QwBxUQ3KJdSDwjPLXj9ZQUMDcT_Xabcd',
        },
        {
          id: 2,
          toggle: 'ON',
          proxy: 'user2:pass2@127.0.0.1:8081',
          privateKey: '0x59c...ChangeMe',
          address: '0x709...',
          explorerUrl: '',
          balanceTzkjExpchain: 0,
          balanceTzkjSepolia: 0,
          balanceTzkjBnb: 0,
          discordToken: 'MTAyChangeMeNDU4MzQ3ODIzNjM4NTM5MA.GEcXjX.dJ8Tz_QwBxUQ3KJdSDwjPLXj9ZQUMDcT_Xabcd',
        },
        {
          id: 3,
          toggle: 'ON',
          proxy: 'http://user3:pass3@127.0.0.1:8082',
          privateKey: '0x5de...ChangeMe',
          address: '0x3C4...',
          explorerUrl: '',
          balanceTzkjExpchain: 0,
          balanceTzkjSepolia: 0,
          balanceTzkjBnb: 0,
          discordToken: 'MTAyChangeMeNDU4MzQ3ODIzNjM4NTM5MA.GEcXjX.dJ8Tz_QwBxUQ3KJdSDwjPLXj9ZQUMDcT_Xabcd',
        },
      ]
      await createWalletsXlsx(defaultWallets)
      logger.success('Wallets table has been created')
    }
  } catch (err) {
    logger.error('', err)
  }
}
