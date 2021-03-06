import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig, VaultConfig } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: number
  depositFeeBP?: number
  eggPerBlock?: number
    userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  },
  lpStakedTotal?: BigNumber,
  tokenDecimals?: number,
  quoteTokenDecimals?: number,
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}
export interface Vault extends VaultConfig {
  tokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  farmLPTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  vaultDepositFeeBP?: number
  vaultWithdrawalFeeBP?: number
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  },
  performanceFeeBP?: number
  lpStakedTotal?: BigNumber
  isFinished?: boolean
  tokenDecimals?: number,
  quoteTokenDecimals?: number,
  lpTokenBalanceChef?: BigNumber,
  rewardTokenPrice?:number,
  farmDepositFeeBP?: number,
  farmWithdrawalFeeBP?: number,
  rewardTokenDecimals?: number,
  poolWeight? : number,
  rewardPerBlock?: BigNumber,
  burnRateBP?:number
}

// Slices states

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}
export interface VaultsState {
  data: Vault[]
}

// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
  vaults: VaultsState
}
