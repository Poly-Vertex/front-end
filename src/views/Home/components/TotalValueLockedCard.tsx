import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useTotalValue } from '../../../state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  const {farms:totalValueFarms, vaults:totalValueVaults} = useTotalValue();

  
  return (
    <StyledTotalValueLockedCard>
      <CardBody>
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
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
