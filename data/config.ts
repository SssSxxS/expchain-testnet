/* ---------------------------------- Extra --------------------------------- */
export const SHUFFLE_WALLETS = true // true / false Shuffle wallets before use

/* --------------------------------- Faucet --------------------------------- */
export const FAUCET_CHAINS = ['EXPchain', 'Sepolia', 'BSC'] // ['EXPchain', 'Sepolia', 'BSC'] Testnet chains for faucet requests
export const FAUCET_SLEEP_RANGE_BETWEEN_CHAINS = [10, 30] // [min, max] in seconds
export const FAUCET_SLEEP_RANGE_BETWEEN_WALLETS = [100, 300] // [min, max] in seconds
export const MAX_RETRY_ATTEMPTS = 5 // Number of retry attempts for failed requests
export const RETRY_SLEEP_RANGE = [3, 9] // [min, max] in seconds

/* --------------------------------- Bridge --------------------------------- */
// Native tokens (SepoliaETH for Sepolia, tBNB for BSC) are required for gas fees
export const BRIDGE_CHAINS = ['Sepolia', 'BSC'] // ['Sepolia', 'BSC'] Testnet chains for bridge to EXPchain Testnet
export const BRIDGE_SLEEP_RANGE_BETWEEN_CHAINS = [10, 30] // [min, max] in seconds
export const BRIDGE_SLEEP_RANGE_BETWEEN_WALLETS = [100, 300] // [min, max] in seconds

/* --------------------------------- Deploy --------------------------------- */
export const DEPLOY_SLEEP_RANGE = [100, 300] // [min, max] in seconds

/* -------------------------- Swap $tZKJ to $wtZKJ -------------------------- */
export const SWAP_AMOUNT = [0.001, 0.009] // [min, max] in $tZKJ
export const SWAP_SLEEP_RANGE = [100, 300] // [min, max] in seconds

/* ---------------------------------- Const --------------------------------- */
// If you don't know what you are doing, don't change this
export const EXPCHAIN_TESTNET_RPC_URL = 'https://rpc0-testnet.expchain.ai' // https://rpc0-testnet.expchain.ai / https://rpc1-testnet.expchain.ai
export const EXPCHAIN_TESTNET_EXPLORER_URL = 'https://blockscout-testnet.expchain.ai'
export const SEPOLIA_TESTNET_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com'
export const SEPOLIA_TESTNET_EXPLORER_URL = 'https://sepolia.etherscan.io'
export const BSC_TESTNET_RPC_URL = 'https://bsc-testnet-rpc.publicnode.com'
export const BSC_TESTNET_EXPLORER_URL = 'https://testnet.bscscan.com'

export const TZKJ_ADDRESS_SEPOLIA = '0x465C15e9e2F3837472B0B204e955c5205270CA9E'
export const TZKJ_ADDRESS_BSC = '0xbBF8F565995c3fDF890120e6AbC48c4f818b03c2'

export interface ChainConfig {
  name: string
  id: number
  rpcUrl: string
  explorerUrl: string
  tzkjAddress?: string
  bridgeAddress?: string
}

export const CHAINS: Record<string, ChainConfig> = {
  EXPchain: {
    name: 'EXPchain',
    id: 18880,
    rpcUrl: 'https://rpc0-testnet.expchain.ai',
    explorerUrl: 'https://blockscout-testnet.expchain.ai',
  },
  Sepolia: {
    name: 'Sepolia',
    id: 11155111,
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    tzkjAddress: '0x465C15e9e2F3837472B0B204e955c5205270CA9E',
    bridgeAddress: '0x38C967856d17E900042Af447B3346bfF26C8ed4B',
  },
  BSC: {
    name: 'BSC',
    id: 97,
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    explorerUrl: 'https://testnet.bscscan.com',
    tzkjAddress: '0xbBF8F565995c3fDF890120e6AbC48c4f818b03c2',
    bridgeAddress: '0xFbbc73da1f8a6C4b0344Ef1dB01BCb9AC36c3012',
  },
}
