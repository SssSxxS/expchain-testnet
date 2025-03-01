import { getWallets, runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { BaseClient } from '@/modules/client'
import {
  CHAINS,
  FAUCET_CHAINS,
  FAUCET_SLEEP_RANGE_BETWEEN_CHAINS,
  FAUCET_SLEEP_RANGE_BETWEEN_WALLETS,
} from '@data/config'

export const cmdGetTokensFromFaucet = async () => {
  try {
    const wallets = await getWallets()
    for (const wallet of wallets) {
      try {
        const client = new BaseClient(wallet.proxy)

        /* -------------------------------------------------------------------------- */

        type DiscordAuthResponse = {
          location: string
        }
        logger.info(`(${wallet.id}) Trying to get discord auth code`)
        const discordAuthResponse = await client.post<DiscordAuthResponse>(
          'https://discord.com/api/v9/oauth2/authorize?client_id=1324639318278406267&response_type=code&redirect_uri=https%3A%2F%2Ffaucet-api.expchain.ai%2Fapi%2Fv1%2Fdiscord%2Fcallback&scope=identify%20email',
          {
            permissions: '0',
            authorize: true,
            integration_type: 0,
            location_context: { guild_id: '10000', channel_id: '10000', channel_type: 10000 },
          },
          {
            headers: {
              Authorization: wallet.discordToken,
            },
          }
        )
        if (!discordAuthResponse?.data) throw new Error(`(${wallet.id}) Discord auth failed`)
        const code = new URL(discordAuthResponse.data.location).searchParams.get('code')
        logger.info(`(${wallet.id}) Discord auth code: ${code}`)

        /* -------------------------------------------------------------------------- */

        logger.info(`(${wallet.id}) Trying to get faucet auth token`)
        const faucetTokenResponse = await client.get(
          `https://faucet-api.expchain.ai/api/v1/discord/callback?code=${code}`,
          {
            maxRedirects: 0,
            headers: {
              Referer: 'https://discord.com/',
            },
            validateStatus: (status) => status === 302,
          }
        )
        if (!faucetTokenResponse?.headers?.location) throw new Error(`(${wallet.id}) Faucet auth token failed`)
        const token = new URL(faucetTokenResponse.headers.location).searchParams.get('msg')?.split('/')[1]
        logger.info(`(${wallet.id}) Faucet auth token: ${token}`)

        /* -------------------------------------------------------------------------- */
        type FaucetResponse = {
          code: number
          message: string
          data: string
        }
        for (const chainName of FAUCET_CHAINS) {
          try {
            if (!CHAINS[chainName]) throw new Error(`(${wallet.id}) Unknown chain: ${chainName}`)
            const chainID = CHAINS[chainName].id

            logger.info(`(${wallet.id}) Trying to get faucet tokens for ${chainName}`)
            const faucetResponse = await client.post<FaucetResponse>(
              'https://faucet-api.expchain.ai/api/faucet',
              {
                chain_id: chainID,
                to: wallet.address,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Origin: 'https://faucet.expchain.ai',
                  Referer: 'https://faucet.expchain.ai/',
                },
              }
            )
            if (!faucetResponse?.data) throw new Error(`(${wallet.id}) Faucet request for ${chainName} failed`)
            if (faucetResponse.data.code === 2004)
              logger.warn(`(${wallet.id}) Faucet response for ${chainName}: %o`, faucetResponse.data)
            else logger.success(`(${wallet.id}) Faucet response for ${chainName}: %o`, faucetResponse.data)

            /* -------------------------------------------------------------------------- */
          } catch (err) {
            logger.error('', err)
          }

          if (chainName === FAUCET_CHAINS[FAUCET_CHAINS.length - 1]) break
          await runSleep(FAUCET_SLEEP_RANGE_BETWEEN_CHAINS[0], FAUCET_SLEEP_RANGE_BETWEEN_CHAINS[1])
        }

        if (wallet === wallets[wallets.length - 1]) break
        await runSleep(FAUCET_SLEEP_RANGE_BETWEEN_WALLETS[0], FAUCET_SLEEP_RANGE_BETWEEN_WALLETS[1])
      } catch (err) {
        logger.error('', err)
      }
    }
  } catch (err) {
    logger.error('', err)
  }
}
