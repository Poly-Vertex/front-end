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
    endBlock: 1000000000000
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'WMATIC-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    },
    tokenSymbol: 'WMATIC',
    tokenAddresses: {
      80001: '',
      137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    endBlock: 1000000000000
  },
]

export default farms
