import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    lpSymbol: 'VERT-USDC QLP',
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
    exchange:"QuickSwap"

  },
 
  {
    pid: 15,
    risk: 999,
    lpSymbol: 'ROUTE-DFYN DLP',
    lpAddresses: {
      80001: '',
      137: '0xb0dc320ea9eea823a150763abb4a7ba8286cd08b',
    },
    tokenSymbol: 'DFYN',
    tokenAddresses: {
      80001: '0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97',
      137: '0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97',
    },
    quoteTokenSymbol: QuoteToken.ROUTE,
    quoteTokenAdresses: contracts.route,
    exchange:"DFYN"
  },
 
  {
    pid: 12,
    risk: 5,
    lpSymbol: 'VERT-ROUTE DLP',
    lpAddresses: {
      80001: '',
      137: '0xd4689694e9928564647ad483c075f271419b2a5f',
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: contracts.cake[80001],
      137: contracts.cake[137],
    },
    quoteTokenSymbol: QuoteToken.ROUTE,
    quoteTokenAdresses: contracts.route,
    exchange:"DFYN"
  },

  {
    pid: 1,
    risk: 5,
    lpSymbol: 'VERT-MATIC QLP',
    lpAddresses: {
      80001: '',
      137: '0xfCD877cb5C3ecBF51E329DF525213BCeEEF741Dd',
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: contracts.cake[80001],
      137: contracts.cake[137],
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 4,
    risk: 5,
    lpSymbol: 'VERT-WETH QLP',
    lpAddresses: {
      80001: '',
      137: '0xfef87340394bc37b8d54cde7c2b37e616d741b31', // vert-weth
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: '',
      137: contracts.cake[137], // vert
    },
    quoteTokenSymbol: QuoteToken.WETH,
    quoteTokenAdresses: contracts.weth,
    exchange:"QuickSwap"

  },
  {
    pid: 14,
    risk: 3,
    lpSymbol: 'PLATIN-USDC QLP',
    lpAddresses: {
      80001: '',
      137: '0x60beff3e9d3b4e8409471ecc58e568eb153f1e00',
    },
    tokenSymbol: 'PLATIN',
    tokenAddresses: {
      80001: '0x782eb3304F8b9adD877F13a5cA321f72c4AA9804',
      137: '0x782eb3304F8b9adD877F13a5cA321f72c4AA9804',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    exchange:"QuickSwap"

  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'WMATIC-USDC QLP',
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
    exchange:"QuickSwap"

  },
  {
    pid: 8,
    risk: 3,
    lpSymbol: 'WETH-USDC QLP',
    lpAddresses: {
      80001: '',
      137: '0x853ee4b2a13f8a742d64c8f088be7ba2131f670d',
    },
    tokenSymbol: 'WETH',
    tokenAddresses: {
      80001: '',
      137: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    exchange:"QuickSwap"

  },
  {
    pid: 10,
    risk: 3,
    lpSymbol: 'WBTC-USDC QLP',
    lpAddresses: {
      80001: '',
      137: '0xf6a637525402643b0654a54bead2cb9a83c8b498',
    },
    tokenSymbol: 'WBTC',
    tokenAddresses: {
      80001: '',
      137: contracts.wbtc[137],
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
    exchange:"QuickSwap"

  },
    
  {
    pid: 3,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'VERT',
    lpAddresses: {
      80001: '',
      137: "0x668269d6E5D2c2dE31D132Ac218044211643622B", // tVERT-USDC LP
      // 137: '0xe923959d9e2555513786797c94fb4ba5a4d9c900', // tVERT-USDC LP
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: '',
      137: contracts.cake[137],
    },
    quoteTokenSymbol: QuoteToken.CAKE,
    quoteTokenAdresses: contracts.cake,
  },
  {
    pid: 13, 
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'KOGE',
    lpAddresses: {
      80001: '',
      137: '0x1c5a040ea7b4df2c3e7370961491aab7b27e5ad8', // KOGE-USDC LP
    },
    tokenSymbol: 'KOGE',
    tokenAddresses: {
      80001: '',
      137: '0x13748d548D95D78a3c83fe3F32604B4796CFfa23', // KOGE
    },
    quoteTokenSymbol: QuoteToken.BUSD, 
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 5,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'USDC',
    lpAddresses: {
      80001: '',
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC (use USDC for pool)
    },
    tokenSymbol: 'USDC',
    tokenAddresses: {
      80001: '',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },

  {
    pid: 6,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'WMATIC',
    lpAddresses: {
      80001: '',
      137: '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827', // WMATIC-USDC LP
    },
    tokenSymbol: 'WMATIC',
    tokenAddresses: {
      80001: '',
      137: contracts.wbnb[137],
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 7,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'USDT',
    lpAddresses: {
      80001: '',
      137: '0x604229c960e5cacf2aaeac8be68ac07ba9df81c3', // USDT-WMATIC LP
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      80001: '',
      137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    },
    quoteTokenSymbol: QuoteToken.USDT,
    quoteTokenAdresses: contracts.usdt,
  },
  {
    pid: 9,
    risk: 2,
    isTokenOnly: true,
    lpSymbol: 'WBTC',
    lpAddresses: {
      80001: '',
      137: '0xf6a637525402643b0654a54bead2cb9a83c8b498', // BTCB-USDC LP
    },
    tokenSymbol: 'WBTC',
    tokenAddresses: {
      80001: '',
      137: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 11,
    risk: 2,
    isTokenOnly: true,
    lpSymbol: 'WETH',
    lpAddresses: {
      80001: '',
      137: '0x853ee4b2a13f8a742d64c8f088be7ba2131f670d', // ETH-USDC LP
    },
    tokenSymbol: 'WETH',
    tokenAddresses: {
      80001: '',
      137: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    },
    quoteTokenSymbol: QuoteToken.WETH,
    quoteTokenAdresses: contracts.weth,
  },


  // // {
  // //   pid: ,
  // //   risk: 2,
  // //   isTokenOnly: true,
  // //   lpSymbol: 'ETH',
  // //   lpAddresses: {
  // //     80001: '',
  // //     137: '', // ETH-BUSD LP
  // //   },
  // //   tokenSymbol: 'ETH',
  // //   tokenAddresses: {
  // //     80001: '',
  // //     137: '',
  // //   },
  // //   quoteTokenSymbol: QuoteToken.BUSD,
  // //   quoteTokenAdresses: contracts.busd,
  // // },
  // // {
  // //   pid: ,
  // //   risk: 1,
  // //   isTokenOnly: true,
  // //   lpSymbol: 'DAI',
  // //   lpAddresses: {
  // //     80001: '',
  // //     137: '0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc', // DAI-BUSD LP
  // //   },
  // //   tokenSymbol: 'DAI',
  // //   tokenAddresses: {
  // //     80001: '',
  // //     137: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  // //   },
  // //   quoteTokenSymbol: QuoteToken.BUSD,
  // //   quoteTokenAdresses: contracts.busd,
  // // },
  // // {
  // //   pid: ,
  // //   risk: 1,
  // //   isTokenOnly: true,
  // //   lpSymbol: 'USDC',
  // //   lpAddresses: {
  // //     80001: '',
  // //     137: '0x680dd100e4b394bda26a59dd5c119a391e747d18', // USDC-BUSD LP
  // //   },
  // //   tokenSymbol: 'USDC',
  // //   tokenAddresses: {
  // //     80001: '',
  // //     137: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  // //   },
  // //   quoteTokenSymbol: QuoteToken.BUSD,
  // //   quoteTokenAdresses: contracts.busd,
  // // },
  
 
]

export default farms
