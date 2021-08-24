import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout , Button, ToastContainer, Image} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useToast from 'hooks/useToast'
import Page from 'components/layout/Page'
import Divider from 'views/Farms/components/Divider'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import VertStats from './components/VertStats'
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

const TitleImage = styled.img`
  width:60%;
  height:auto;
  padding:5%;
  margin:auto;
  
  ${({ theme }) => theme.mediaQueries.xs} {
    display: block;
    margin-top:5%;
    width:100%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-top:5%;
    width:100%;
  }
  
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    width:60%;
  };
  content:url(${({theme})=>theme.isDark ? `images/title_home_dark.png`:`images/title_home_light.png`})

  `




const Home: React.FC = () => {
  const TranslateString = useI18n()


  return (
    <>

    <Page>
      <Hero>
          <TitleImage alt="PolyVertex"/>
          

      </Hero>
        <i><Heading size="sm">{TranslateString(999, 'The most community-led yield farm on Polygon')}</Heading></i>
      <div>
          <Divider/>
          {/* <SpecialCard /> */}
        <Cards>
          <FarmStakingCard />
          <TwitterCard/>
          <VertStats />
        </Cards>
      </div>
    </Page>
    <Background/>

      </>
      )
    }
    
    export default Home
    