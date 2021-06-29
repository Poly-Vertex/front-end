import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '@pancakeswap-libs/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address } from 'config/constants/types'

export interface ExpandableSectionProps {
  isTokenOnly?: boolean
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address,
  pid: number
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`
const WhiteSpaceText= styled(Text)`
white-space:pre
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isTokenOnly,
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  pid
}) => {
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, pid })

  return (
    <Wrapper>
      <Flex justifyContent="center" flexDirection="row">
        <WhiteSpaceText >{TranslateString(316, 'Deposit')}: </WhiteSpaceText>
        <StyledLinkExternal href={
          isTokenOnly ?
            `https://quickswap.exchange/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
            :
          `https://quickswap.exchange/#/add/${liquidityUrlPathParts}`
        }>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>

      <Flex justifyContent="center">
        <Link external href={bscScanAddress} bold={false}>
          {TranslateString(356, 'View on PolygonScan')}
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
