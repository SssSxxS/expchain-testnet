import {
  cmdBridgeTokensToExpchain,
  cmdCreateOrUpdateWalletsTable,
  cmdDeployErc20,
  cmdDeployErc721,
  cmdExit,
  cmdGetGasPrice,
  cmdGetTokensFromFaucet,
  cmdOffAll,
  cmdOffZeroBalance,
  cmdOnAll,
  cmdOnZeroBalance,
  cmdSwapTzkjToWtzkj,
} from '@/commands'
import { logger } from '@/lib/logger'
import { select, Separator } from '@inquirer/prompts'
import chalk from 'chalk'

interface MenuCommand {
  name: string
  action: () => Promise<void>
  disabled?: boolean
  addSeparator?: boolean
}

const menuCommands: MenuCommand[] = [
  {
    name: 'Get Gas Price',
    action: async () => await cmdGetGasPrice(),
    addSeparator: true,
  },
  {
    name: 'Create or Update Wallets Table',
    action: async () => await cmdCreateOrUpdateWalletsTable(),
  },
  {
    name: '"ON" Wallets with zero balance',
    action: async () => await cmdOnZeroBalance(),
  },
  {
    name: '"OFF" Wallets with zero balance',
    action: async () => await cmdOffZeroBalance(),
  },
  {
    name: '"ON" All Wallets',
    action: async () => await cmdOnAll(),
  },
  {
    name: '"OFF" All Wallets',
    action: async () => await cmdOffAll(),
    addSeparator: true,
  },
  {
    name: 'Get $tZKJ Tokens from Faucet',
    action: async () => await cmdGetTokensFromFaucet(),
  },
  {
    name: 'Bridge $tZKJ Tokens to EXPchain',
    action: async () => await cmdBridgeTokensToExpchain(),
  },
  {
    name: 'Deploy ERC-20 Contract',
    action: async () => await cmdDeployErc20(),
  },
  {
    name: 'Deploy ERC-721 Contract',
    action: async () => await cmdDeployErc721(),
  },
  {
    name: 'Swap $tZKJ to $wtZKJ | https://curve.fi/dex/#/expchain/swap',
    action: async () => await cmdSwapTzkjToWtzkj(),
    addSeparator: true,
  },
  {
    name: 'Exit',
    action: async () => await cmdExit(),
  },
]

const choices = menuCommands.flatMap((item, index) => [
  {
    name: item.name,
    short: chalk.bold(item.name),
    value: index,
    disabled: item.disabled,
  },
  ...(item.addSeparator ? [new Separator(' ')] : []),
])

export const main = async () => {
  while (true) {
    try {
      const choice = await select({
        message: 'MENU:',
        choices: choices,
        pageSize: 99,
        loop: false,
      })
      await menuCommands[choice].action()
    } catch (err) {
      logger.error('%o', err)
    }
  }
}
