import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout , Button, ToastContainer} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useToast from 'hooks/useToast'
import Page from 'components/layout/Page'
import Divider from 'views/Farms/components/Divider'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import VertStats from './components/VertStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import SpecialCard from './components/SpecialCard'
import Background from '../Background'
import HomePageCountdown from '../HomePageCountdown'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/egg/3.png');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/egg/3.png'), url('/images/egg/3b.png');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`




const Home: React.FC = () => {
  const TranslateString = useI18n()


  return (
    <>

    <Page>
      <Hero>
        <Heading as="h1" size="xxl" mb="24px" color="secondary">
          {TranslateString(576, 'PolyVertex')}
        </Heading>
        <Text>{TranslateString(578, '')}</Text>
      
      </Hero>
      <div>
          <Divider/>
          {/* <SpecialCard /> */}
        <Cards>
          <FarmStakingCard />
          <TwitterCard/>
          <VertStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
    <Background/>

      </>
      )
    }
    
    export default Home
    