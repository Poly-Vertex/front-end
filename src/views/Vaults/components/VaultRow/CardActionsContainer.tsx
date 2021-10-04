import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text} from '@pancakeswap-libs/uikit'
import { Vault } from 'state/types'
import { useVaultFromPid, useVaultUser, usePriceCakeBusd } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { getCorrectedNumber } from 'utils/formatBalance'
import { useVaultApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface VaultWithStakedValue extends Vault {
  apy?: BigNumber
}

interface VaultCardActionsProps {
  vault: VaultWithStakedValue,
  ethereum?: provider,
  account?: string,
  totalValue?: BigNumber,
  allowance?: BigNumber,
  tokenBalance?: BigNumber, 
  stakedBalance?: BigNumber,
  usdStaked?:BigNumber
}

const CardActions: React.FC<VaultCardActionsProps> = ({ vault, ethereum, account, totalValue, allowance, tokenBalance, stakedBalance, usdStaked }) => {
  const TranslateString = useI18n()
  // const { pid, lpAddresses, tokenAddresses, isTokenOnly, vaultDepositFeeBP, vaultWithdrawalFeeBP, farmDepositFeeBP, farmWithdrawalFeeBP, performanceFeeBP, burnRateBP } = useVaultFromPid(vault.pid)


   
  const renderApprovalOrStakeButton = () => {
      return <StakeAction ethereum={ethereum} vault={vault} account={account} allowance={allowance} stakedBalance={stakedBalance} tokenBalance={tokenBalance} usdStaked={usdStaked} unlocked={account!==null}/>
  }

  return (
    <Action>
      {renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
