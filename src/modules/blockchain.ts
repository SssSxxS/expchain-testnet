import { abiERC20Token, abiERC721Token } from '@/contracts/abis'
import { bytecodeERC20Token, bytecodeERC721Token } from '@/contracts/bytecodes'
import { getRandomName } from '@/contracts/names'
import { getRandomSymbol } from '@/contracts/symbols'
import { getRandomInt } from '@/lib/utils'
import { ethers } from 'ethers'

export const getAddressFromPrivateKey = async (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

export const getGasPrice = async (rpcUrl: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const feeData = await provider.getFeeData()
  if (!feeData.gasPrice) throw new Error('Gas price is undefined')
  const gasPrice = ethers.formatUnits(feeData.gasPrice, 'gwei')
  return gasPrice
}

export const getBalanceNative = async (rpcUrl: string, walletAddress: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const balanceWei = await provider.getBalance(walletAddress)
  const balanceEther = ethers.formatEther(balanceWei)
  return balanceEther
}

export const getBalanceToken = async (rpcUrl: string, tokenAddress: string, walletAddress: string) => {
  const tokenAbi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
  ]

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider)

  const balance = await tokenContract.balanceOf(walletAddress)
  const decimals = await tokenContract.decimals()

  return ethers.formatUnits(balance, decimals)
}

export const approveToken = async (
  rpcUrl: string,
  privateKey: string,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) => {
  const tokenAbi = [
    'function approve(address spender, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
  ]

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)
  const decimals = await tokenContract.decimals()
  const amountWithDecimals = ethers.parseUnits(amount, decimals)

  const tx = await tokenContract.approve(spenderAddress, amountWithDecimals)
  const receipt = await tx.wait()

  return receipt
}

export const bridgeTzkj = async (
  rpcUrl: string,
  privateKey: string,
  bridgeAddress: string,
  tokenAddress: string,
  amount: string,
  recipient: string,
  dstChainId: number = 131,
  poolId: number = 1
) => {
  const bridgeAbi = [
    'function transferToken(uint16 dstChainId, uint256 poolId, uint256 amount, address recipient) payable',
  ]
  const tokenAbi = ['function decimals() view returns (uint8)']

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const bridgeContract = new ethers.Contract(bridgeAddress, bridgeAbi, wallet)
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet)
  const decimals = await tokenContract.decimals()
  const amountWithDecimals = ethers.parseUnits(amount, decimals)

  const tx = await bridgeContract.transferToken(dstChainId, poolId, amountWithDecimals, recipient, {
    value: ethers.parseEther('0.002'),
  })
  const receipt = await tx.wait()

  return receipt
}

export const deployErc20 = async (rpcUrl: string, privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const contractFactory = new ethers.ContractFactory(abiERC20Token, bytecodeERC20Token, wallet)

  const name = getRandomName()
  const symbol = getRandomSymbol()
  const initialSupply = ethers.parseUnits(String(getRandomInt(1000000, 1000000000)), 18)

  const contract = await contractFactory.deploy(name, symbol, initialSupply)
  const deployedContract = await contract.waitForDeployment()
  const receipt = await deployedContract.deploymentTransaction()

  return receipt
}

export const deployErc721 = async (rpcUrl: string, privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const contractFactory = new ethers.ContractFactory(abiERC721Token, bytecodeERC721Token, wallet)

  const name = getRandomName()
  const symbol = getRandomSymbol()

  const contract = await contractFactory.deploy(name, symbol)
  const deployedContract = await contract.waitForDeployment()
  const receipt = await deployedContract.deploymentTransaction()

  return receipt
}

export const exchangeCurve = async (
  rpcUrl: string,
  privateKey: string,
  routerAddress: string,
  route: string[],
  swapParams: string[][],
  amount: string
) => {
  const curveAbi = [
    'function exchange(address[11] _route, uint256[4][5] _swap_params, uint256 _amount, uint256 _min_dy) payable returns (uint256)',
  ]

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)
  const routerContract = new ethers.Contract(routerAddress, curveAbi, wallet)

  route = [
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
  swapParams = [
    ['0', '0', '8', '0'],
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0'],
  ]

  const minDy = String(parseFloat(amount) - parseFloat(amount) * 0.1)
  const amountBigInt = ethers.parseEther(amount)
  const minDyBigInt = ethers.parseEther(minDy)

  const tx = await routerContract.exchange(route, swapParams, amountBigInt, minDyBigInt, {
    value: amountBigInt,
  })
  const receipt = await tx.wait()

  return receipt
}
