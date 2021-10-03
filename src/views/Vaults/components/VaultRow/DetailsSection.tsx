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
  quoteTokenAddresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address,
  underlyingProject: string,
  pid: number,
  exchange?: string
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
  quoteTokenAddresses,
  quoteTokenSymbol,
  tokenAddresses,
  underlyingProject,
  pid,
  exchange
}) => {
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddresses, quoteTokenSymbol, tokenAddresses, pid })



  let swapURLFirstPart = "https://quickswap.exchange/#/swap"
  let addURLFirstPart = "https://quickswap.exchange/#/add"

  switch (exchange) {
    case "DFYN":
      swapURLFirstPart = "https://exchange.dfyn.network/#/swap"
      addURLFirstPart = "https://exchange.dfyn.network/#/add"
      break;
    case "SushiSwap":
      swapURLFirstPart = "https://app.sushi.com/swap"
      addURLFirstPart = "https://app.sushi.com/add"
      break;
    case "JetSwap":
      swapURLFirstPart = "https://polygon-exchange.jetswap.finance/#/swap"
      addURLFirstPart = "https://polygon-exchange.jetswap.finance/#/add"
      break;
    case "QuickSwap":
    default:
      break;
  }

  return (
    <Wrapper>
      <Flex justifyContent="center" flexDirection="row">
        <WhiteSpaceText >{TranslateString(316, 'Deposit')}: </WhiteSpaceText>
        <StyledLinkExternal  href={
          isTokenOnly ?
          `${swapURLFirstPart}/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
          :
        `${addURLFirstPart}/${liquidityUrlPathParts}`
        }>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
       

      <Flex justifyContent="center">
        <StyledLinkExternal external href={bscScanAddress} bold={false}>
          {TranslateString(356, 'View on PolygonScan')}
        </StyledLinkExternal>
      </Flex>
        { underlyingProject!==""?
           <Flex justifyContent="center" flexDirection="row"><StyledLinkExternal href={underlyingProject}> 
          Visit project
        </StyledLinkExternal></Flex>
        : null
      }
    </Wrapper>
  )
}

export default DetailsSection
