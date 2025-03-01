import { runSleep } from '@/lib/helpers'
import { logger } from '@/lib/logger'
import { parseProxyString } from '@/lib/utils'
import { MAX_RETRY_ATTEMPTS, RETRY_SLEEP_RANGE } from '@data/config'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios, { isAxiosError } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

export class BaseClient {
  protected client: AxiosInstance

  constructor(proxy?: string) {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        Priority: 'u=1, i',
        'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      },
    }
    if (proxy) {
      const proxyConfig = parseProxyString(proxy)
      const proxyUrl =
        proxyConfig.username && proxyConfig.password
          ? `http://${proxyConfig.username}:${proxyConfig.password}@${proxyConfig.host}:${proxyConfig.port}`
          : `http://${proxyConfig.host}:${proxyConfig.port}`
      const httpsAgent = new HttpsProxyAgent(proxyUrl)
      config.proxy = false
      config.httpAgent = httpsAgent
      config.httpsAgent = httpsAgent
    }
    this.client = axios.create(config)
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | undefined> {
    for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
      try {
        const response = await this.client.get<T>(url, config)
        return response
      } catch (err) {
        if (isAxiosError(err)) {
          logger.warn(`Failed request: %o`, err.response?.data)
          if (i === MAX_RETRY_ATTEMPTS - 1) break
          if (err.code === '401') break
          await runSleep(RETRY_SLEEP_RANGE[0], RETRY_SLEEP_RANGE[1])
        } else {
          logger.error(`Unexpected error: %o`, err)
        }
      }
    }
  }

  async post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | undefined> {
    for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
      try {
        const response = await this.client.post<T>(url, data, config)
        return response
      } catch (err) {
        if (isAxiosError(err)) {
          logger.warn(`Failed request: %o`, err.response?.data)
          if (i === MAX_RETRY_ATTEMPTS - 1) break
          await runSleep(RETRY_SLEEP_RANGE[0], RETRY_SLEEP_RANGE[1])
        } else {
          logger.error(`Unexpected error: %o`, err)
        }
      }
    }
  }
}
