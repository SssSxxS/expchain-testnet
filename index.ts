import { main } from '@/main'
import chalk from 'chalk'

const art =
  chalk.whiteBright(`
░█▀▀░█░█░█▀█░█▀▀░█░█░█▀█░▀█▀░█▀█
░█▀▀░▄▀▄░█▀▀░█░░░█▀█░█▀█░░█░░█░█
░▀▀▀░▀░▀░▀░░░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀`) +
  chalk.blackBright(`
░▀█▀░█▀▀░█▀▀░▀█▀░█▀█░█▀▀░▀█▀    
░░█░░█▀▀░▀▀█░░█░░█░█░█▀▀░░█░    
░░▀░░▀▀▀░▀▀▀░░▀░░▀░▀░▀▀▀░░▀░    `) +
  chalk.whiteBright(`
https://t.me/yofomo\n`)

console.log(art)

main()
