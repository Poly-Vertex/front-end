import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/special.jpg');
  background-repeat: no-repeat;
  background-position: middle center;
  min-height: 300px;
  min-width: 750px;
  padding:0px;
  margin:0px;
  height:400px
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const SpecialCard = () => {


  return (
    <StyledFarmStakingCard>
      <a href="/nests">
      <CardBody>
        {/* <CardImage src="/images/special.jpg" alt="special logo" width={64} height={64} /> */}
      </CardBody>
      </a>
    </StyledFarmStakingCard>
  )
}

export default SpecialCard
