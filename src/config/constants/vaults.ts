import contracts from './contracts'
import { VaultConfig, QuoteToken } from './types'

const farms: VaultConfig[] = [
  {
    pid: 0,
    risk: 5,
    lpSymbol: 'VERT-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x668269d6E5D2c2dE31D132Ac218044211643622B',
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: contracts.cake[80001],
      137: contracts.cake[137],
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    endBlock: 10000000
  },
]

export default farms
