import React from 'react'
import { Card, CardBody, Heading, Text, Link, Image } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { useMediaQuery } from 'react-responsive';
import { getCakeAddress } from 'utils/addressHelpers'
import useTheme from 'hooks/useTheme'
import Divider from 'views/Farms/components/Divider'
import TotalValueLockedCard from './TotalValueLockedCard'
import CardValue from './CardValue'
import { useFarms, usePriceCakeBusd } from '../../../state/hooks'
import VertCharts from './VertCharts'

const StyledVertStats = styled(Card)<{isMobile:boolean}>`
  margin-left: auto;
  margin-right: auto;
  width:100%;
  ${(props)=>!props.isMobile? "grid-column: span 12 !important;" : ""}
  border-radius:8px;
  
`
const ColumnLayout = styled(CardBody)<{isMobile:boolean}>`
  column-count:${(props)=>props.isMobile?"1":"3"}
`


const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`
const Column = styled.div`
  align-items: left;
  display: block;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
  
`

const LinkRow = styled.a`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
  :hover{
    text-decoration: underline;
  }
`

const LinkedText = styled(Text)`
  display: flexbox;
  white-space:pre;
`


const InvertedImage = styled(Image)`
    filter:invert(100%);
  `

  const StatsHeading = styled(Heading)`
  column-span: all;
  `

  const StatsDivider = styled(Divider)`
    width:80%;
  `

const VertStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const farms = useFarms();
  const eggPrice = usePriceCakeBusd();
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0);
  const cakeSupply = getBalanceNumber(circSupply);
  const marketCap = eggPrice.times(circSupply);
  const isDark = useTheme().isDark;
  const isMobile = useMediaQuery({ query: `(max-width: 900px)` }); 

  let eggPerBlock = 0;
  if(farms && farms[0] && farms[0].eggPerBlock){
    eggPerBlock = new BigNumber(farms[0].eggPerBlock).div(new BigNumber(10).pow(18)).toNumber();
  }


  return (
    <StyledVertStats isMobile={isMobile}>
      <ColumnLayout isMobile={isMobile}>
        <StatsHeading size="xl" mb="24px">
          {TranslateString(534, 'VERT Stats')}
        </StatsHeading>
        <Column>
        
          <Row>
            <Text fontSize="14px">{TranslateString(10005, 'Market Cap')}</Text>
            <CardValue fontSize="14px" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />
          </Row>
          <Row>
            <Text fontSize="14px">{TranslateString(536, 'Total Minted')}</Text>
            {totalSupply && <CardValue fontSize="14px" value={getBalanceNumber(totalSupply)} decimals={0} />}
          </Row>
            <LinkRow target= "_blank" href="https://polygonscan.com/token/0x72572ccf5208b59f4bcc14e6653d8c31cd1fc5a0?a=0x000000000000000000000000000000000000dEaD">
            <LinkedText fontSize="14px">{TranslateString(538, 'Total Burned')}{"   "}
              {isDark? <InvertedImage width={20} height={20} alt="external link" src="https://img.icons8.com/windows/32/000000/share-arrow-squared.png"/>:
              <Image width={20} height={20} alt="external link" src="https://img.icons8.com/windows/32/000000/share-arrow-squared.png"/>}
            </LinkedText>

            <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} decimals={0} />
          </LinkRow>
          <Row>
            <Text fontSize="14px">{TranslateString(10004, 'Circulating Supply')}</Text>
            {cakeSupply && <CardValue fontSize="14px" value={cakeSupply} decimals={0} />}
          </Row>
          <Row>
            <Text fontSize="14px">{TranslateString(540, 'New VERT/block')}</Text>
            <Text bold fontSize="14px">{eggPerBlock}</Text>
          </Row>
          <Row>
            <Text fontSize="14px">{TranslateString(999, 'Max Supply')}</Text>
            <Text bold fontSize="14px">500,000 VERT</Text>
          </Row>
        </Column>
        <Column>
          <TotalValueLockedCard />
        </Column>
      </ColumnLayout>
      <StatsDivider/>

      <VertCharts/>
    </StyledVertStats>
  )
}

export default VertStats
