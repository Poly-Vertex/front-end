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
    rewardToken: "0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0",
    type: 'standard',
    strategy: 'masterchef',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "eggPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    underlyingProject:"",
    rewardUsesCoinGecko: true
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
    strategy: 'masterchef',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "rewardPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    rewardToken: "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
    underlyingProject:"https://app.mai.finance/farm",
    rewardUsesCoinGecko: true
  },
  {
    pid: 12,
    risk: 3,
    lpSymbol: 'QI-WMATIC QLP',
    lpAddresses: {
      80001: '',
      137: '0x9a8b2601760814019b7e6ee0052e25f1c623d1e6',
    },
    tokenSymbol: 'QI',
    tokenAddresses: {
      80001: '',
      137: '0x580a84c73811e1839f75d86d75d88cca0c241ff4', // QI
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAddresses: contracts.wbnb,
    endBlock: 1000000000000,
    exchange: 'Quickswap',
    type: 'standard',
    strategy: 'masterchef',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "rewardPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    rewardToken: "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
    rewardUsesCoinGecko: true,
    underlyingProject:"https://app.mai.finance/farm"
  },
  {
    pid: 13,
    risk: 3,
    lpSymbol: 'COLLAR-USDC pWINGS-LP',
    lpAddresses: {
      80001: '',
      137: '0x23e5d894177840dd25De6b37752593a9c5DcC762',
    },
    tokenSymbol: 'COLLAR',
    tokenAddresses: {
      80001: '',
      137: '0x8DF26a1BD9bD98e2eC506fc9d8009954716A05DC', // Collar
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAddresses: contracts.busd,
    endBlock: 1000000000000,
    exchange: 'Jetswap',
    type: 'standard',
    strategy: 'masterchef',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "CollarPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    rewardToken: "0x8DF26a1BD9bD98e2eC506fc9d8009954716A05DC",
    underlyingProject:"https://polypup.finance/farms",
    rewardUsesCoinGecko: false
  },
  {
    pid: 14,
    risk: 3,
    lpSymbol: 'COLLAR-MATIC SLP',
    lpAddresses: {
      80001: '',
      137: '0xbBe5F4998Cc537A91e7b90C7925D1c7C5bAb7ee0',
    },
    tokenSymbol: 'COLLAR',
    tokenAddresses: {
      80001: '',
      137: '0x8DF26a1BD9bD98e2eC506fc9d8009954716A05DC', // Collar
    },
    isTokenOnly: false,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAddresses: contracts.wbnb,
    endBlock: 1000000000000,
    exchange: 'Sushiswap',
    type: 'standard',
    strategy: 'masterchef',
    farmUsesPoolInfo: true,
    farmRewardPerBlockCallName: "CollarPerBlock",
    farmTotalAllocCallName: "totalAllocPoint",
    farmFeeCallName:"depositFeeBP",
    farmPoolAllocName:"allocPoint",
    rewardToken: "0x8DF26a1BD9bD98e2eC506fc9d8009954716A05DC",
    underlyingProject:"https://polypup.finance/farms",
    rewardUsesCoinGecko: false
  },
]

export default vaults
