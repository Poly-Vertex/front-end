import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { useMediaQuery } from 'react-responsive';
import { useTotalValue } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)<{isMobile:boolean}>`
  justify-content:space-around;
  display: inline-block;
  flex: 1;
  width:${(props)=>props.isMobile?"100%":"200%"};
  box-shadow: none;

`
const StyledCardBody = styled(CardBody)`
  box-shadow: none;
  text-align:center
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  const {farms:totalValueFarms, vaults:totalValueVaults} = useTotalValue();
  // const data = useGetStats()
  const totalValue = useTotalValue();
  // const tvl = totalValue.toFixed(2);
  const isMobile = useMediaQuery({ query: `(max-width: 900px)` }); 

  
  return (
    <StyledTotalValueLockedCard isMobile={isMobile}>
      <StyledCardBody>
        <Heading size="lg" mb="24px">
          {TranslateString(999, 'Total Value Locked (TVL)')}
        </Heading>
        <>
          {/* <Heading size="xl">{`$${tvl}`}</Heading> */}
          {/* <Heading size="xl"> */}
            <CardValue value={totalValueFarms.toNumber() + totalValueVaults.toNumber()} prefix="$" decimals={2}/>
          {/* </Heading> */}
          <Text color="textSubtle"><b>{TranslateString(999, 'Farms and pools')}:</b> <CardValue value={totalValueFarms.toNumber()} prefix="$" decimals={2} fontSize="20px"/></Text>
          <Text color="textSubtle"><b>{TranslateString(999, 'Vaults')}:</b> <CardValue value={totalValueVaults.toNumber()} prefix="$" decimals={2} fontSize="20px"/></Text>
        </>
      </StyledCardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
