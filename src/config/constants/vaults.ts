import contracts from './contracts'
import { VaultConfig, QuoteToken } from './types'

const farms: VaultConfig[] = [
    {
    pid: 0,
    risk: 3,
    lpSymbol: 'VERT-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x668269d6E5D2c2dE31D132Ac218044211643622B',
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: '',
      137: contracts.cake[137],
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000,
    exchange:"QuickSwap"
  },
  
]

export default farms
