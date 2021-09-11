import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, ChevronDownIcon, ChevronUpIcon, Heading } from '@pancakeswap-libs/uikit'
// import { communityVaults } from 'config/constants'
import { Vault } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance, getBalanceNumber, getCorrectedNumber } from 'utils/formatBalance'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import { apyModalRoi, calculateCakeEarnedPerThousandDollars } from 'utils/compoundApyHelpers'
import { useVaultUser } from 'state/hooks'
import Loading from 'views/Lottery/components/Loading'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import { SciNumber } from './StakeAction'
import Spinner from './LoadingSpinner'

export interface VaultWithStakedValue extends Vault {
  apy?: BigNumber
  apr?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 8px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const VCard = styled.div`
  align-self: baseline;
  background: linear-gradient(
    to top left,
    ${(props) => props.theme.card.background.concat('C8')},
    ${(props) => props.theme.card.background.concat('FF')}
  );
  border-radius: 8px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: inline-block;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  position: relative;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-width: 90vw !important;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 90vw !important;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100% !important;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 100% !important;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  width: 100%;
  overflow: hidden;
  transition: height 1s;
  transition-timing-function: ease-in-out;
`
const Row = styled.div<{ clickable?: boolean; adjustForSize?: boolean }>`
  display: flex;
  width: 100%;
  max-width: 100% !important;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  text-align: center;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  ${({ theme }) => theme.mediaQueries.xs} {
    display: ${(props) => (props.adjustForSize ? 'grid' : 'flex')};
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: ${(props) => (props.adjustForSize ? 'grid' : 'flex')};
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`
const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  align: left;
  display: inline;
`
const Strike = styled.div`
  text-decoration: line-through;
  display: inline;
`
const APRInfo = styled.div`
  align-self: center;
  align-items: left;
  text-align: left;
  display: block;
  justify-content: space-between;
  margin: 1%;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    align-items: center;
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    align-items: center;
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const ApyButtonVault = styled(ApyButton)`
  padding: 0px;
  margin: 0px;
`
const ApyButtonContainer = styled.div`
  padding: 0px;
  margin: 0px;
  display: inline;
  vertical-align: sub;
`

const Bold = styled.div`
  font-weight: bold;
  display: inline;
  overflow: hidden;
`
const UpIcon = styled(ChevronUpIcon)`
  ${({ theme }) => theme.mediaQueries.xs} {
    position: absolute;
    bottom: -10px;
    right: 5%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    bottom: -10px;
    right: 5%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    position: relative;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    position: relative;
  }
`
const DownIcon = styled(ChevronDownIcon)`
  ${({ theme }) => theme.mediaQueries.xs} {
    position: absolute;
    bottom: -10px;
    right: 5%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    bottom: -10px;
    right: 5%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    position: relative;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    position: relative;
  }
`

interface VaultRowProps {
  vault: VaultWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
  btcPrice?: BigNumber
  wethPrice?: BigNumber
}

export const LoadingRow = () => {
  return (
    <VCard>
      <Flex flexDirection="row">
        <Spinner>
          <img alt="..." src="images/logo.svg" />
        </Spinner>
        <Heading>&nbsp;&nbsp;&nbsp;Loading...</Heading>
      </Flex>
    </VCard>
  )
}

const VaultRow: React.FC<VaultRowProps> = ({ vault, removed, cakePrice, bnbPrice, ethereum, account, wethPrice }) => {
  const TranslateString = useI18n()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { allowance, tokenBalance, stakedBalance } = useVaultUser(vault.pid)
  const vaultImage = `${vault.tokenSymbol.toLowerCase()}-${vault.quoteTokenSymbol.toLowerCase()}`

  const fullBalance = getBalanceNumber(tokenBalance, 18).toPrecision(9) // 18 because is LP

  const totalValue: BigNumber = useMemo(() => {
    if (!vault.lpTotalInQuoteToken) {
      return null
    }

    if (vault.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(vault.lpTotalInQuoteToken)
    }
    if (vault.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(vault.lpTotalInQuoteToken)
    }
    if (vault.quoteTokenSymbol === QuoteToken.WETH) {
      return wethPrice.times(vault.lpTotalInQuoteToken)
    }

    return vault.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, vault.lpTotalInQuoteToken, vault.quoteTokenSymbol, wethPrice])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = vault.lpSymbol

  const apy = vault.apy.times(new BigNumber(100)).toNumber()
  const apr = vault.apr.times(new BigNumber(100)).toNumber()

  let vaultAPY =
    vault.apy &&
    apy.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const oneThousandDollarsWorthOfReward = 1000 / vault.rewardTokenPrice
  const cakeEarnedPerThousand1D = calculateCakeEarnedPerThousandDollars({
    numberOfDays: 1,
    farmApy: apy,
    cakePrice: vault.rewardTokenPrice,
  })
  const oneDayROI = apyModalRoi({
    amountEarned: cakeEarnedPerThousand1D,
    amountInvested: oneThousandDollarsWorthOfReward,
  })

  const formats = [
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ]
  let formattedAPY = vaultAPY
  formats.forEach((format) => {
    if (vault.apy.times(new BigNumber(100).toNumber()).gt(format.value)) {
      formattedAPY =
        vault.apy &&
        vault.apy.times(new BigNumber(100)).div(format.value).toNumber().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      const parts = formattedAPY.match(/([\D]*)([\d.,]+)([\D]*)/)
      if (parts !== null) {
        formattedAPY = `${parts[1]}${parts[2]} ${format.symbol}${parts[3]}`
      }
    }
  })
  vaultAPY = formattedAPY

  let vaultAPR =
    vault.apr &&
    apr.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  let formattedAPR = vaultAPR
  formats.forEach((format) => {
    if (vault.apr.times(new BigNumber(100).toNumber()).gt(format.value)) {
      formattedAPR =
        vault.apr &&
        vault.apr.times(new BigNumber(100)).div(format.value).toNumber().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      const parts = formattedAPR.match(/([\D]*)([\d.,]+)([\D]*)/)
      if (parts !== null) {
        formattedAPR = `${parts[1]}${parts[2]} ${format.symbol}${parts[3]}`
      }
    }
  })
  vaultAPR = formattedAPR

  let usdPer1LP = new BigNumber(0)
  let usdStaked = new BigNumber(0)
  let usdWallet = new BigNumber(0)

  if (totalValue && vault.lpStakedTotal) {
    usdPer1LP = new BigNumber(totalValue).dividedBy(vault.lpTokenBalanceChef)
    usdStaked = stakedBalance.times(usdPer1LP) // TODO This value is wrong
    usdWallet = tokenBalance.times(usdPer1LP)
  }

  // Deposited Balance
  const rawStakedBalance = getBalanceNumber(stakedBalance, 18)
  const correctedStakeBalance = parseFloat(rawStakedBalance.toPrecision(4))
  const displayDepositedBalance = getCorrectedNumber(correctedStakeBalance)

  // Deposited USD
  const rawDepositedDisplayUsd = new BigNumber(usdStaked).toNumber()
  const correctedWalletDisplayUsd = parseFloat(rawDepositedDisplayUsd.toPrecision(4))
  const displayStakedUSD = getCorrectedNumber(correctedWalletDisplayUsd)

  // Wallet Balance
  const rawWalletBalance = getBalanceNumber(tokenBalance, 18)
  const correctedWalletBalance = parseFloat(rawWalletBalance.toPrecision(4))
  const displayWalletBalance = getCorrectedNumber(correctedWalletBalance)

  // Wallet USD
  const rawWalletDisplayUsd = new BigNumber(usdWallet).toNumber()
  const correctedDisplayUsd = parseFloat(rawWalletDisplayUsd.toPrecision(4))
  const displayWalletUSD = getCorrectedNumber(correctedDisplayUsd)

  const { quoteTokenAddresses, quoteTokenSymbol, tokenAddresses, risk, lpSymbol } = vault
  return (
    <VCard>
      {vault.tokenSymbol === 'VERT' && <StyledCardAccent />}
      <Row adjustForSize clickable onClick={() => setShowExpandableSection(!showExpandableSection)}>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={vault.multiplier}
          risk={risk}
          depositFee={vault.depositFeeBP}
          farmImage0={vault.tokenSymbol.toLowerCase()}
          farmImage1={vault.quoteTokenSymbol.toLowerCase()}
          tokenSymbol={vault.tokenSymbol}
          type={vault.type}
          exchange={vault.exchange}
        />
        {!removed && (
          <APRInfo>
            <Flex justifyContent="space-between" alignItems="left" flexDirection="column">
              <Label>{TranslateString(352, 'APR')}:</Label>
              <Text>{vault.apr ? <Strike>{vaultAPR}%</Strike> : <Skeleton height={24} width={80} />}</Text>
              <Label>&nbsp;&nbsp;</Label>
              <Label>{TranslateString(999, 'APY')}:</Label>
              <Text>
                {vault.apy ? (
                  <>
                    <Bold>{vaultAPY}%</Bold>
                  </>
                ) : (
                  <Skeleton height={24} width={80} />
                )}
                <ApyButtonContainer>
                  <ApyButtonVault
                    lpLabel={lpLabel}
                    quoteTokenAddresses={quoteTokenAddresses}
                    quoteTokenSymbol={quoteTokenSymbol}
                    tokenAddresses={tokenAddresses}
                    cakePrice={new BigNumber(vault.rewardTokenPrice)}
                    apy={vault.apy}
                    pid={vault.pid}
                  />
                </ApyButtonContainer>
              </Text>
            </Flex>
          </APRInfo>
        )}
        <Flex justifyContent="center" flexDirection="column">
          <Text>{TranslateString(999, 'Daily ROI')}:</Text>
          <Text bold>{oneDayROI}%</Text>
        </Flex>

        <Flex justifyContent="center" flexDirection="column">
          <Text>{TranslateString(999, 'Wallet')}:</Text>

          <Text bold>
            <SciNumber>
              {displayWalletBalance}
              {correctedWalletBalance < 1e-5 && correctedWalletBalance > 0 ? (
                <Label>
                  {'  '}e{correctedWalletBalance.toExponential(2).split('e')[1].toLocaleString()}
                </Label>
              ) : null}{' '}
            </SciNumber>{' '}
            <SciNumber>
              {tokenBalance.gt(0) && correctedDisplayUsd > 0 ? (
                <Label>
                  ~$
                  {displayWalletUSD}
                  {correctedWalletDisplayUsd < 1e-5 && correctedWalletDisplayUsd > 0 ? (
                    <Label>
                      {'  '}e{correctedWalletDisplayUsd.toExponential(2).split('e')[1].toLocaleString()}
                    </Label>
                  ) : null}{' '}
                  USD
                </Label>
              ) : null}
            </SciNumber>
          </Text>
        </Flex>

        <Flex justifyContent="center" flexDirection="column">
          <Text>{TranslateString(999, 'Deposited')}:</Text>
          <Text bold>
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
                  {displayStakedUSD.toString()}
                  {correctedDisplayUsd < 1e-5 && correctedDisplayUsd > 0 ? (
                    <Label>
                      {'  '}e{correctedDisplayUsd.toExponential(2).split('e')[1].toLocaleString()}
                    </Label>
                  ) : null}{' '}
                  USD
                </Label>
              ) : null}
            </SciNumber>
          </Text>
        </Flex>
        <Flex justifyContent="center" flexDirection="column">
          <Text>{TranslateString(999, 'TVL')}:</Text>
          <Text bold>{totalValueFormated}</Text>
        </Flex>

        {showExpandableSection ? <UpIcon /> : <DownIcon />}
      </Row>
      {showExpandableSection ? <Divider /> : null}
      <Row>
        <ExpandingWrapper expanded={showExpandableSection}>
          <CardActionsContainer
            vault={vault}
            ethereum={ethereum}
            account={account}
            totalValue={totalValue}
            allowance={allowance}
            tokenBalance={tokenBalance}
            stakedBalance={stakedBalance}
            usdStaked={usdStaked}
          />
          <DetailsSection
            removed={removed}
            isTokenOnly={vault.isTokenOnly}
            bscScanAddress={
              vault.isTokenOnly
                ? `https://polygonscan.com/token/${vault.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
                : `https://polygonscan.com/token/${vault.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
            }
            totalValueFormated={totalValueFormated}
            lpLabel={lpLabel}
            quoteTokenAddresses={quoteTokenAddresses}
            quoteTokenSymbol={quoteTokenSymbol}
            tokenAddresses={tokenAddresses}
            pid={vault.pid}
          />
        </ExpandingWrapper>
      </Row>
    </VCard>
  )
}

export default VaultRow
