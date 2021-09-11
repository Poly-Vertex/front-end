import React from 'react'
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
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useVaultStake } from 'hooks/useStake'
import { useVaultUnstake } from 'hooks/useUnstake'
import { getBalanceNumber, getCorrectedNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
  usdStaked: BigNumber
  withdrawalFeeBP?: number
  performanceFeeBP?: number
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
  align: left;
  display: inline;
`
const ActionButton = styled(Button)<{deposit?:boolean}>`
  margin: auto;
  padding: 5%;
  max-width: 60%;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 150px;
    font-size:80%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 150px;
    font-size:80%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 200px;
    font-size:100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 200px;
    font-size:100%;
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
const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  depositFeeBP,
  usdStaked,
  withdrawalFeeBP,
  performanceFeeBP,
}) => {
  const TranslateString = useI18n()
  const { onStake } = useVaultStake(pid)
  const { onUnstake } = useVaultUnstake(pid)

  // Deposited Balance
  const rawStakedBalance = getBalanceNumber(stakedBalance, 18)
  const correctedStakeBalance = parseFloat(rawStakedBalance.toPrecision(4))
  const displayDepositedBalance = getCorrectedNumber(correctedStakeBalance)

  // Deposited USD
  const rawDepositedDisplayUsd = new BigNumber(usdStaked).toNumber()
  const correctedWalletDisplayUsd = parseFloat(rawDepositedDisplayUsd.toPrecision(4))
  const displayStakedUSD = getCorrectedNumber(correctedWalletDisplayUsd)

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  return (
    <Flex margin="auto" justifyContent="space-around" alignItems="center" justifyItems="center">
      <Flex flexDirection="column">
        <ActionButton deposit onClick={onPresentDeposit}>{TranslateString(999, 'Deposit')}</ActionButton>
        <Label>&nbsp;</Label>
        <Label>Fee: {depositFeeBP / 100}%</Label>
      </Flex>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
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
      </Flex>
      <Flex flexDirection="column">
        <ActionButton onClick={onPresentWithdraw}>{TranslateString(999, 'Withdraw')}</ActionButton>
        <Label>&nbsp;</Label>
        <Label>Fee: {withdrawalFeeBP / 100}%</Label>
      </Flex>
    </Flex>
  )
}

export default StakeAction
