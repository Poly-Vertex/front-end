import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag, NoFeeTag, RiskTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  tokenSymbol?: string
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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
}) => {
  return (
    <Wrapper flexDirection="row" justifyContent="space-between" alignItems="center" mb="12px">
      <HeaderSection flexDirection="column" alignItems="center">
        <Image src={`/images/vaults/${farmImage}.png`} alt={tokenSymbol} width={64} height={64} />
        <Heading mb="7px" as="h2" size="sm" >{lpLabel}</Heading>
        {/* {depositFee === 0 ? <NoFeeTag /> : null} */}
      {/* <MultiplierTag variant="success" >{multiplier}</MultiplierTag> */}
      </HeaderSection>
    </Wrapper>
  )
}

export default CardHeading
