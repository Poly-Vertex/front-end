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
  stakedBalance?: BigNumber
}

const CardActions: React.FC<VaultCardActionsProps> = ({ vault, ethereum, account, totalValue, allowance, tokenBalance, stakedBalance }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useVaultFromPid(vault.pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = vault.lpSymbol.toUpperCase()
  
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const cakePrice = usePriceCakeBusd();
  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useVaultApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])
  
  let usdStaked = stakedBalance;
   
  if(totalValue){
    usdStaked = usdStaked.times(new BigNumber(totalValue).div(vault.lpStakedTotal)).div(10**6); // TODO Wrong value
  }    

  

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <>
      <Flex flexDirection="column">
      <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
        {lpName}
      </Text>
      <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
        {TranslateString(999, 'deposited')}
      </Text>

    </Flex>
      <StakeAction stakedBalance={stakedBalance} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} usdStaked={usdStaked}  />
      </>
      ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
       {!account ? <UnlockButton mt="8px" fullWidth /> :(
       <>
      {renderApprovalOrStakeButton()}
      </>
      )
      }
     
    </Action>
  )
}

export default CardActions
