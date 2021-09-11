import contracts from './contracts'
import { VaultConfig, QuoteToken } from './types'

const vaults: VaultConfig[] = [
  {
    pid: 1,
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
    exchange: 'QuickSwap',
    type: 'standard',
    rewardPerBlock:50000000000000000,
    poolWeight: 10000/56340,
    rewardToken: "0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0",
    farmDepositFee: 0,
    farmWithdrawalFee: 0,
  },
  // {
  //   pid: 2,
  //   risk: 3,
  //   lpSymbol: 'ENDOW VERT-USDC LP',
  //   lpAddresses: {
  //     80001: '',
  //     137: '0x668269d6E5D2c2dE31D132Ac218044211643622B',
  //   },
  //   tokenSymbol: 'VERT',
  //   tokenAddresses: {
  //     80001: '',
  //     137: contracts.cake[137],
  //   },
  //   isTokenOnly: false,
  //   quoteTokenSymbol: QuoteToken.BUSD,
  //   quoteTokenAddresses: contracts.busd,
  //   endBlock: 1000000000000,
  //   exchange: 'QuickSwap',
  //   type: 'endowment',
  //   rewardPerBlock:0.05,
  //   poolWeight: 1,
  //   farmDepositFee: 0,
  //   farmWithdrawalFee: 0,
  // },
  {
    pid: 4,
    risk: 3,
    lpSymbol: 'GFI-USDC GLP',
    lpAddresses: {
      80001: '',
      137: '0x96d6f7afff161e7152bec4272b51cc007e4417ae',
    },
    tokenSymbol: 'GFI',
    tokenAddresses: {
      80001: '',
      137: contracts.cake[137],
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000,
    exchange: 'Gravity',
    type: 'standard',
    rewardPerBlock:50000000000000000,
    poolWeight: 1,
    rewardToken: "0x874e178A2f3f3F9d34db862453Cd756E7eAb0381",
    farmDepositFee: 0,
    farmWithdrawalFee: 0,
  },
]

export default vaults
