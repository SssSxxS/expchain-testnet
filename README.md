# EXHchain-Testnet

A command-line interface tool for interacting with the EXHchain Testnet blockchain

[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?logo=telegram&logoColor=fff&style=flat-square)](https://t.me/yofomo)

![Interface](https://i.postimg.cc/8zM4YnL7/Screenshot-2025-03-01-161728.png)

<div align="center">

[![Windows](https://custom-icon-badges.demolab.com/badge/Windows-0078D6?logo=windows11&logoColor=white)](#) [![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff)](https://bun.sh/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)

</div>

## Prerequisites

- [Git](https://git-scm.com/downloads) for repository cloning and updates

- [Bun](https://bun.sh/) runtime

  ```
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

## Installation

1. Clone the repository:

```
git clone https://github.com/SssSxxS/expchain-testnet.git
```

2. Install dependencies and Start the application:

- Use the provided batch file:

```
START.bat
```

- Or do it manually

```
bun install && bun .\index.ts
```

## Getting Started

1. Initialize your wallet table by selecting "Create or Update Wallets Table"
2. Open the generated `wallets.xlsx` file in the `data` folder
3. Add your private keys, proxies (all formats), discord tokens to the table
4. Update the wallets information by selecting "Create or Update Wallets Table"
5. Toggle wallets "ON"/"OFF" as needed
6. Edit the `config.ts` file in the `data` folder as needed
   ![Config](https://i.postimg.cc/yNnm4qx8/Screenshot-2025-03-01-161934.png)
7. Use other menu options
