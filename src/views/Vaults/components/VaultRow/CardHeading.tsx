import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image, Svg } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag, NoFeeTag, RiskTag, TextTag } from 'components/Tags'
import { existsSync } from 'fs'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  vaultDepositFeeBP?: number
  vaultWithdrawalFeeBP?: number
  farmImage0?: string
  farmImage1?: string
  tokenSymbol?: string
  exchange?: string
  type?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
  display: inline-block
  max-width:100%
`

const HeaderSection = styled(Flex)`
  max-width: 100%;
  min-width: 100%;
  width: 100%;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
  color: #ffffff;
`
const VaultImage = styled(Image)`
  ${({ theme }) => theme.mediaQueries.xs} {
    height:32px !important;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    height:45px !important;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    height:45 !important;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height:45 !important;
  }
`
function imageExists(imageUrl){

  const http = new XMLHttpRequest();

  http.open('HEAD', imageUrl, false);
  http.send();

  return http.status !== 404;
}

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage0,
  farmImage1,
  tokenSymbol,
  vaultDepositFeeBP,
  vaultWithdrawalFeeBP,
  type,
  exchange,
}) => {
  let image0 = `/images/vaults/${farmImage0}.svg`
  let image1 = `/images/vaults/${farmImage1}.svg`

  if(!imageExists(image0)){
    image0 = `/images/vaults/${farmImage0}.png`
  }
  if(!imageExists(image1)){
    image1 = `/images/vaults/${farmImage1}.png`
  }

  return (
    <Wrapper flexDirection="row" justifyContent="space-between" alignItems="center" mb="12px">
      <HeaderSection flexDirection="column" alignItems="center">
        <HeaderSection flexDirection="row" alignItems="center" justifyContent="center" mb="10px" >
          <VaultImage src={image0} alt="" width={45} height={45} margin="4px"/>
          <VaultImage src={image1} alt="" width={45} height={45} margin="4px"/>
        </HeaderSection>
        <Heading mb="7px" as="h2" size="sm">
          {lpLabel}
        </Heading>
        {/* {depositFee === 0 ? <NoFeeTag /> : null} */}
        {type === 'standard' ? null : <TextTag variant="primary" text={type.replace(type[0], type[0].toUpperCase())} />}
      </HeaderSection>
    </Wrapper>
  )
}

export default CardHeading
