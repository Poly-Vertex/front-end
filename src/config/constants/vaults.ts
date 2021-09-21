import BigNumber from 'bignumber.js'
import contracts from './contracts'
import { VaultConfig, QuoteToken } from './types'

const vaults: VaultConfig[] = [
  {
    pid: 6,
    risk: 3,
    lpSymbol: 'VERT-USDC QLP',
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
    rewardToken: "0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0",
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "eggPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
  },
  {
    pid: 11,
    risk: 3,
    lpSymbol: 'MAI-USDC QLP',
    lpAddresses: {
      80001: '',
      137: '0x160532d2536175d65c03b97b0630a9802c274dad',
    },
    tokenSymbol: 'MAI',
    tokenAddresses: {
      80001: '',
      137: '0xa3fa99a148fa48d14ed51d610c367c61876997f1', // miMATIC
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000,
    exchange: 'Quickswap',
    type: 'standard',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "rewardPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    rewardToken: "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
  },
]

export default vaults
