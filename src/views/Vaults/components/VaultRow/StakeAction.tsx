import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Text, ToastContainer } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
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
const ActionButton = styled(Button)`
  margin: auto;
  width: 200px;
  padding: 10px;
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
}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance, 18)
  const correctedStakeBalance = parseFloat(rawStakedBalance.toPrecision(4))
  const displayBalance = getCorrectedNumber(correctedStakeBalance)

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
    <Flex justifyContent="center" alignItems="center" justifyItems="center" > 
      <ActionButton variant="secondary" onClick={onPresentDeposit}>
        <Text bold color="primary">
          Deposit
        </Text>
      </ActionButton>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Heading color={correctedStakeBalance === 0 ? 'textDisabled' : 'text'}>
          <SciNumber>
            {displayBalance}
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

        <ActionButton variant="secondary" onClick={onPresentWithdraw}>
          <Text bold color="primary">
            Withdraw
          </Text>
        </ActionButton>
    </Flex>
  )
}

export default StakeAction
