import ExcelJS from 'exceljs'

export interface WalletXlsx {
  id: number
  toggle: string
  proxy: string
  privateKey: string
  address: string
  explorerUrl: string
  balanceTzkjExpchain: number
  balanceTzkjSepolia: number
  balanceTzkjBnb: number
  discordToken: string
}

const walletsXlsxPath = './data/wallets.xlsx'

export const createWalletsXlsx = async (wallets: WalletXlsx[]) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Wallets')
  sheet.columns = [
    { header: 'ID', key: 'id', width: 5, style: { alignment: { horizontal: 'right' } } },
    { header: 'Toggle', key: 'toggle', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Proxy (optional)', key: 'proxy', width: 10 },
    { header: 'Private Key', key: 'privateKey', width: 10 },
    { header: 'Address', key: 'address', width: 45 },
    { header: 'Explorer', key: 'explorerUrl', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'EXPchain $tZKJ balance', key: 'balanceTzkjExpchain', width: 12 },
    { header: 'Sepolia $tZKJ balance', key: 'balanceTzkjSepolia', width: 12 },
    { header: 'BSC $tZKJ balance', key: 'balanceTzkjBnb', width: 12 },
    { header: '', key: 'empty', width: 9 },
    { header: '', key: 'empty', width: 9 },
    { header: '', key: 'empty', width: 9 },
    { header: 'Discord token', key: 'discordToken', width: 10 },
    { header: '', key: 'empty', width: 9 },
  ]
  /*
  1. ID
  2. Toggle
  3. Proxy  
  4. Private Key
  5. Address
  6. Explorer
  7. Balance $tZKJ EXPchain
  8. Balance $tZKJ Sepolia
  9. Balance $tZKJ BNB
  10. empty
  11. empty
  12. empty
  13. Discord token
  14. empty
  */

  wallets.forEach((wallet) => {
    const row = sheet.addRow(wallet)
    if (wallet.explorerUrl) row.getCell(6).value = { text: 'LINK', hyperlink: wallet.explorerUrl }
    row.getCell(10).value = ''
    row.getCell(14).value = ''
  })

  await workbook.xlsx.writeFile(walletsXlsxPath)
}

export const getWalletsData = async () => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(walletsXlsxPath)
  const sheet = workbook.getWorksheet('Wallets')
  if (!sheet) throw new Error('Sheet "Wallets" not found')

  const wallets: WalletXlsx[] = []
  sheet.eachRow((row, rowIndex) => {
    if (rowIndex > 1) {
      const wallet: WalletXlsx = {
        id: parseInt(String(row.getCell(1).value || 0)),
        toggle: String(row.getCell(2).value || 'OFF').toUpperCase(),
        proxy: String(row.getCell(3).value || ''),
        privateKey: String(row.getCell(4).value || ''),
        address: String(row.getCell(5).value || ''),
        explorerUrl: String(row.getCell(6).value || ''),
        balanceTzkjExpchain: parseFloat(String(row.getCell(7).value || 0)),
        balanceTzkjSepolia: parseFloat(String(row.getCell(8).value || 0)),
        balanceTzkjBnb: parseFloat(String(row.getCell(9).value || 0)),
        discordToken: String(row.getCell(13).value || ''),
      }
      wallets.push(wallet)
    }
  })
  return wallets
}
