import React, { useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Button,
  Flex,
  Heading,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Text,
  ToastContainer,
  Skeleton,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Divider from 'views/Farms/components/Divider'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { useVaultStake } from 'hooks/useStake'
import { useVaultUnstake } from 'hooks/useUnstake'
import { useVaultFromPid, useVaultUser, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber, getCorrectedNumber } from 'utils/formatBalance'
import UnlockButton from 'components/UnlockButton'
import { useVaultApprove } from 'hooks/useApprove'
import { Vault } from 'state/types'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface VaultWithStakedValue extends Vault {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  usdStaked: BigNumber
  performanceFeeBP?: number
  vaultDepositFeeBP?: number
  vaultWithdrawalFeeBP?: number
  farmDepositFeeBP?: number
  farmWithdrawalFeeBP?: number
  burnRateBP?: number
  approved?: boolean
  unlocked?: boolean
  account?: string
  ethereum: provider
  allowance?: BigNumber
  vault: VaultWithStakedValue
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`
const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  text-align: left;
  display: inline;
`
const FeeLabel = styled(Label)`
  white-space: pre;
  width: 50px;
  text-align: left;
  justify-content: center;
  align-self: left;
`
const FeeContainer = styled(Flex)`
  margin: auto;
  justify-content:"space-around"
  @media (max-width: 576px) {
    margin:0px;

  }
`
const FeeDivider = styled(Divider)`
  margin-bottom: 2%;
`
const ActionButton = styled(Button)<{ deposit?: boolean }>`
  margin: auto;
  align-self:center;
  padding: 5%;
  max-width: 60%;
  width: 200px;
  font-size: 100%;
  ::after {
    content: ${(props) => (props.deposit ? '"Deposit"' : '"Withdraw"')};
  }
  @media (max-width: 576px) {
    align-items:center;
    margin:0px;
    width: 100px;
    font-size: 80%;
    ::after {
      content: ${(props) => (props.deposit ? '"+"' : '"-"')};
    }
  }
  
`
export const SciNumber = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  justify-content: center;
  align-items: baseline;
  white-space: pre;
`

const UnlockButtonVault = styled(UnlockButton)`
  padding:0px;
  margin:1px;
  max-width:95%;
  height:100px;
`
const ApproveButton = styled(Button)`
  padding:0px;
  margin:1px;
  max-width:95%;
  height:100px;
`

const renderUnlockOrApprove = (unlocked: boolean, requestedApproval, handleApprove) => {
  if (!unlocked) {
    return <UnlockButtonVault mt="8px" fullWidth />
  }

  return (
    <ApproveButton mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
      Approve Contract
    </ApproveButton>
  )
}

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  usdStaked,
  unlocked,
  account,
  ethereum,
  allowance,
  vault,
}) => {
  const TranslateString = useI18n()
  const {
    pid,
    lpAddresses,
    tokenAddresses,
    isTokenOnly,
    vaultDepositFeeBP,
    vaultWithdrawalFeeBP,
    farmDepositFeeBP,
    farmWithdrawalFeeBP,
    performanceFeeBP,
    burnRateBP
  } = useVaultFromPid(vault.pid)
  const { onStake } = useVaultStake(pid)
  const { onUnstake } = useVaultUnstake(pid)

  const lpName = vault.lpSymbol.toUpperCase()

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID]

  const cakePrice = usePriceCakeBusd()
  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum as provider, tokenAddress)
    }
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const [requestedApproval, setRequestedApproval] = useState(false)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
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

  // Deposited Balance
  const rawStakedBalance = getBalanceNumber(stakedBalance, 18)
  const correctedStakeBalance = parseFloat(rawStakedBalance.toPrecision(4))
  const displayDepositedBalance = getCorrectedNumber(correctedStakeBalance)

  // Deposited USD
  const rawDepositedDisplayUsd = new BigNumber(usdStaked).toNumber()
  const correctedWalletDisplayUsd = parseFloat(rawDepositedDisplayUsd.toPrecision(4))
  const displayStakedUSD = getCorrectedNumber(correctedWalletDisplayUsd)
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      vaultDepositFeeBP={vaultDepositFeeBP}
      farmDepositFeeBP={farmDepositFeeBP}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
      vaultWithdrawalFeeBP={vaultWithdrawalFeeBP}
      farmWithdrawalFeeBP={farmWithdrawalFeeBP}
    />,
  )

  return (
    <>
      {isApproved && unlocked ? (
        <Flex flexDirection="column">
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
            {lpName}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {TranslateString(999, 'deposited')}
          </Text>
        </Flex>
      ) : null}
      <Flex margin="auto" justifyContent="space-around" alignItems="center" justifyItems="center">
        <Flex flexDirection="column">
          {isApproved && unlocked ? (
            <ActionButton deposit onClick={onPresentDeposit}/>
          ) : null}

          <FeeContainer flexDirection="column">
            <Label>&nbsp;</Label>
            <FeeLabel>Farm fee: {(farmDepositFeeBP || 0) / 100}%</FeeLabel>
            <FeeLabel>Vault fee: {(vaultDepositFeeBP || 0) / 100}%</FeeLabel>
            <FeeDivider />
            <b>
              <FeeLabel>Total fee: {((vaultDepositFeeBP || 0) + (farmDepositFeeBP || 0)) / 100}%</FeeLabel>
            </b>
          </FeeContainer>
        </Flex>

        <Flex justifyContent="center" alignItems="center" flexDirection="column">
          {!isApproved || !unlocked ? (
            renderUnlockOrApprove(unlocked, requestedApproval, handleApprove)
          ) : (
            <Heading color={correctedStakeBalance === 0 ? 'textDisabled' : 'text'}>
              <SciNumber>
                {displayDepositedBalance}
                {correctedStakeBalance < 1e-5 && correctedStakeBalance > 0 ? (
                  <Label>
                    {'  '}e{correctedStakeBalance.toExponential(2).split('e')[1].toLocaleString()}
                  </Label>
                ) : null}{' '}
              </SciNumber>{' '}
              <SciNumber>
                {usdStaked.gt(0) ? (
                  <Label>
                    ~$
                    {displayStakedUSD}
                    {correctedWalletDisplayUsd < 1e-5 && correctedWalletDisplayUsd > 0 ? (
                      <Label>
                        {'  '}e{correctedWalletDisplayUsd.toExponential(2).split('e')[1].toLocaleString()}
                      </Label>
                    ) : null}{' '}
                    USD
                  </Label>
                ) : null}
              </SciNumber>
            </Heading>
          )}
          <Label>&nbsp;</Label>
          <Label>&nbsp;</Label>
          <Label>Performance fee: {(performanceFeeBP || 0) / 100}%</Label>
          {burnRateBP > 0 ? <Label>Burned: {(performanceFeeBP || 0) / 100}%</Label> : null}
        </Flex>
        <Flex flexDirection="column">
          {isApproved && unlocked ? (
            <ActionButton onClick={onPresentWithdraw}/>
          ) : null}

          <FeeContainer flexDirection="column">
            <Label>&nbsp;</Label>
            <FeeLabel>Farm fee: {(farmWithdrawalFeeBP || 0) / 100}%</FeeLabel>
            <FeeLabel>Vault fee: {(vaultWithdrawalFeeBP || 0) / 100}%</FeeLabel>
            <FeeDivider />
            <b>
              <FeeLabel>Total fee: {((vaultWithdrawalFeeBP || 0) + (farmWithdrawalFeeBP || 0)) / 100}%</FeeLabel>
            </b>
          </FeeContainer>
        </Flex>
      </Flex>
    </>
  )
}

export default StakeAction
