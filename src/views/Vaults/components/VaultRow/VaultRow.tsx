import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm, Vault } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface VaultWithStakedValue extends Vault {
  apy?: BigNumber
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
  background: linear-gradient(45deg,
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
  rgba(255, 0, 0, 1) 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
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
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface VaultRowProps {
  vault: VaultWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
  btcPrice?:BigNumber
  wethPrice?:BigNumber
}

const VaultRow: React.FC<VaultRowProps> = ({ vault, removed, cakePrice, bnbPrice, ethereum, account, wethPrice }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const farmImage = `${vault.tokenSymbol.toLowerCase()}-${vault.quoteTokenSymbol.toLowerCase()}`

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
  const earnLabel = 'VERT'
  let farmAPY = vault.apy && vault.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const formats = [
    { value: 1e3, symbol: "K" } , 
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  let formatted = farmAPY;
  formats.forEach(format => {
    if(vault.apy.times(new BigNumber(100).toNumber()).gt(format.value)){
      formatted = vault.apy && vault.apy.times(new BigNumber(100)).div(format.value).toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      const parts = formatted.match(/([\D]*)([\d.,]+)([\D]*)/)
      formatted=`${parts[1]}${parts[2]} ${format.symbol}${parts[3]}`
    }
  });

  farmAPY = formatted;


  
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk, lpSymbol } = vault
  return (
    <VCard>
      {vault.tokenSymbol === 'VERT' && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={vault.multiplier}
        risk={risk}
        depositFee={vault.depositFeeBP}
        farmImage={farmImage}
        tokenSymbol={vault.tokenSymbol}
      />
      {!removed && (
        <Flex justifyContent='space-between' alignItems='center'>
          <Text>{TranslateString(352, 'APR')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {vault.apy ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  quoteTokenAdresses={quoteTokenAdresses}
                  quoteTokenSymbol={quoteTokenSymbol}
                  tokenAddresses={tokenAddresses}
                  cakePrice={cakePrice}
                  apy={vault.apy}
                  pid={vault.pid}
                />
                {farmAPY}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent='space-between'>
        <Text>{TranslateString(318, 'Earn')}:</Text>
        <Text bold>{earnLabel}</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text style={{ fontSize: '24px' }}>{TranslateString(10001, 'Deposit Fee')}:</Text>
        <Text bold style={{ fontSize: '24px' }}>{(vault.depositFeeBP / 100)}%</Text>
      </Flex>
      <CardActionsContainer farm={vault} ethereum={ethereum} account={account} totalValue={totalValue} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          isTokenOnly={vault.isTokenOnly}
          bscScanAddress={
            vault.isTokenOnly ?
              `https://polygonscan.com/token/${vault.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              :
              `https://polygonscan.com/token/${vault.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
          pid={vault.pid}
        />
      </ExpandingWrapper>
    </VCard>
  )
}

export default VaultRow
