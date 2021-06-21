import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
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
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'VERT-MATIC LP',
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
    lpSymbol: 'VERT-WETH LP',
    lpAddresses: {
      80001: '',
      137: '0xfef87340394bc37b8d54cde7c2b37e616d741b31', // vert-weth
    },
    tokenSymbol: 'VERT',
    tokenAddresses: {
      80001: '',
      137: contracts.cake[137], // vert
    },
    quoteTokenSymbol: QuoteToken.CAKE,
    quoteTokenAdresses: contracts.cake,
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
  },
  {
    pid: 8,
    risk: 3,
    lpSymbol: 'WETH-USDC LP',
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
  },
  {
    pid: 10,
    risk: 3,
    lpSymbol: 'WBTC-USDC LP',
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
    pid: 11, // **** TODO: TEST BEFORE PUSHING TO LIVE
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
    quoteTokenSymbol: QuoteToken.WETH, //  **** TODO: TEST BEFORE PUSHING TO LIVE
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
