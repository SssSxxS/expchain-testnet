export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

/* -------------------------------------------------------------------------- */

export interface ProxyConfig {
  host: string
  port: string
  username?: string
  password?: string
}

export const parseProxyString = (proxyString: string): ProxyConfig => {
  // Handle different proxy formats:
  // username:password@host:port
  // host:port:username:password
  // host:port

  const cleanProxyString = proxyString.replace(/^https?:\/\//, '')

  let host: string = ''
  let port: string = ''
  let username: string = ''
  let password: string = ''

  if (cleanProxyString.includes('@')) {
    // username:password@host:port
    const [credentials, hostPort] = cleanProxyString.split('@')
    ;[username, password] = credentials.split(':')
    ;[host, port] = hostPort.split(':')
  } else {
    const parts = cleanProxyString.split(':')
    if (parts.length === 2)
      // host:port
      [host, port] = parts
    else if (parts.length === 4)
      // host:port:username:password
      [host, port, username, password] = parts
  }

  if (!host || !port) {
    throw new Error('Invalid proxy format.')
  }

  return { host, port, username, password }
}

/* -------------------------------------------------------------------------- */
