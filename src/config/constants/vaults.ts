import contracts from './contracts'
import { VaultConfig, QuoteToken } from './types'

const farms: VaultConfig[] = [
  // TODO these are all for testing based off of polycat's contracts
  // {
  //   pid: 0,
  //   risk: 5,
  //   lpSymbol: 'VERT-USDC LP',
  //   lpAddresses: {
  //     80001: '',
  //     137: '0x668269d6E5D2c2dE31D132Ac218044211643622B',
  //   },
  //   tokenSymbol: 'VERT',
  //   tokenAddresses: {
  //     80001: contracts.cake[80001],
  //     137: contracts.cake[137],
  //   },
  //   quoteTokenSymbol: QuoteToken.BUSD,
  //   quoteTokenAddresses: contracts.busd,
  //   endBlock: 1000000000000
  // },

  {
    pid: 33,
    risk: 3,
    lpSymbol: 'FISH-USDC LP',
    lpAddresses: {
      80001: '',
      137: '0x0df9e46c0eaedf41b9d4bbe2cea2af6e8181b033',
    },
    tokenSymbol: 'FISH',
    tokenAddresses: {
      80001: '',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000
  },
  {
    pid: 20,
    risk: 5,
    lpSymbol: 'USDC-WETH SLP',
    lpAddresses: {
      80001: '',
      137: '0x34965ba0ac2451A34a0471F04CCa3F990b8dea27',
    },
    tokenSymbol: 'USDC',
    tokenAddresses: {
      137: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000
  },
  {
    pid: 5,
    risk: 5,
    lpSymbol: 'USDC-WETH QLP',
    lpAddresses: {
      80001: '',
      137: '0x853ee4b2a13f8a742d64c8f088be7ba2131f670d',
    },
    tokenSymbol: 'USDC',
    tokenAddresses: {
      137: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000
  },
]

export default farms
