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
  Skeleton,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Divider from 'views/Farms/components/Divider'
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
  usdStaked: BigNumber
  performanceFeeBP?: number
  vaultDepositFeeBP?: number
  vaultWithdrawalFeeBP?: number
  farmDepositFeeBP?: number
  farmWithdrawalFeeBP?: number
  burnRateBP?: number
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
  margin-right:1vw;
  white-space:pre;
  width:50px;
  text-align:right;
  justify-content:space-around;
  align-self:right;
  align-items:right;
  `
const FeeContainer = styled(Flex)`
  margin:auto;
  `
const FeeDivider = styled(Divider)`
  margin-bottom:2%;
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
  usdStaked,
  vaultDepositFeeBP,
  vaultWithdrawalFeeBP,
  farmDepositFeeBP,
  farmWithdrawalFeeBP,
  performanceFeeBP,
  burnRateBP,
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
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} vaultDepositFeeBP={vaultDepositFeeBP} farmDepositFeeBP={farmDepositFeeBP} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} vaultWithdrawalFeeBP={vaultWithdrawalFeeBP} farmWithdrawalFeeBP={farmWithdrawalFeeBP} />,
  )

  return (
    <Flex margin="auto" justifyContent="space-around" alignItems="center" justifyItems="center">
      <Flex flexDirection="column">
        <ActionButton deposit onClick={onPresentDeposit}>{TranslateString(999, 'Deposit')}</ActionButton>
        <FeeContainer flexDirection="column">
          <Label>&nbsp;</Label>
          <FeeLabel>Farm fee:     {(farmDepositFeeBP||0) / 100}%</FeeLabel>
          <FeeLabel>Vault fee:     {(vaultDepositFeeBP||0) / 100}%</FeeLabel>
          <FeeDivider/>
          <b><FeeLabel>Total fee:      {((vaultDepositFeeBP||0) + (farmDepositFeeBP||0) )/ 100}%</FeeLabel></b>
        
        </FeeContainer>


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
        <Label>&nbsp;</Label>
        <Label>&nbsp;</Label>
      <Label>Performance fee: {(performanceFeeBP||0) / 100}%</Label>
      {
        burnRateBP>0?
        <Label>Burned: {(performanceFeeBP||0) / 100}%</Label>
        :null
      }
    </Flex>
      <Flex flexDirection="column">
        <ActionButton onClick={onPresentWithdraw}>{TranslateString(999, 'Withdraw')}</ActionButton>
        <FeeContainer flexDirection="column">
          <Label>&nbsp;</Label>
          <FeeLabel>Farm fee:     {(farmWithdrawalFeeBP||0) / 100}%</FeeLabel>
          <FeeLabel>Vault fee:     {(vaultWithdrawalFeeBP||0) / 100}%</FeeLabel>
          <FeeDivider/>
          <b><FeeLabel>Total fee:      {((vaultWithdrawalFeeBP||0) + (farmWithdrawalFeeBP||0) )/ 100}%</FeeLabel></b>
        </FeeContainer>
      </Flex>
    </Flex>
  )
}

export default StakeAction
