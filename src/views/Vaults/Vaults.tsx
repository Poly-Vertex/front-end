import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Dropdown, Heading, Text, InfoIcon, Button, Flex, Link } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, VERT_DECIMALS } from 'config'
import orderBy from 'lodash/orderBy'
import { provider } from 'web3-core'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import useBlock from 'hooks/useBlock'
import { apyModalRoi, calculateCakeEarnedPerThousandDollars } from 'utils/compoundApyHelpers'
import { fetchVaultUserDataAsync } from 'state/vaults'
import { useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import LabelButton from 'views/Ifos/components/IfoCard/LabelButton'
import { getBalanceNumber } from 'utils/formatBalance'
import {
  useFarms,
  usePriceBnbBusd,
  usePriceCakeBusd,
  useVaults,
  usePriceWethBusd,
  usePriceBtcBusd,
  usePriceRouteBusd,
} from 'state/hooks'

import { QuoteToken, PoolCategory } from 'config/constants/types'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import VaultRow, { VaultWithStakedValue, LoadingRow } from './components/VaultRow/VaultRow'
import VaultTabButtons from './components/VaultTabButtons'
import Divider from '../Farms/components/Divider'

const LockedFlex = styled(FlexLayout)`
`
const Note = styled(Text)`
  font-size: 12px;
`
const animateLogo = keyframes`
  0% {
      transform: translate3d(0%, 3%, 0px) rotate(0deg) scale(100%);
      animation-timing-function: ease-in;
    }
    50% {
      transform: translate3d(0%, 3%, 0px) rotate(2deg) scale(101%);
      animation-timing-function: ease-out;
    }
    100% {
      transform: translate3d(0%, 3%, 0px) rotate(0deg) scale(100%);
  }
`
const VaultLogoBackground = styled.img`
  grid-row: 1;
  grid-column: 1;
  max-width: 100%;
  width: 100%;
`
const VaultLogoForeground = styled.img`
  max-width: 100%;
  width: 80%;
  grid-row: 1;
  grid-column: 1;
  animation: 2s ${animateLogo} ease-out infinite;
  margin-left: 10%;
  :hover {
    width: 82%;
    margin-left: 9%;
  }
`
const LogoContainer = styled.div`
  display: grid;
`
const TitleSection = styled.div`
  max-width:250px
`
const SortDropdown = styled(Dropdown)`
  max-width: 33%;
  margin: auto;
  justify-content: center;
  text-align: center;
  display: block;
  padding:5%!important;
  `

const Label = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  text-align: left;
  display: flex;
  vertical-align:center;
  margin:auto;
  margin-right:10%;
  padding-right:2%;
`
const SortButton = styled(Button)`
  margin: auto;
  vertical-align: middle;
  white-space:pre;
  
`
const ControlFlex = styled(Flex)`
  max-width: 100%;
  justify-content: center;
  align-self: center;
  align-items:center;
  margin:auto;
  padding:2%;
  /* margin-bottom:1%; */
  vertical-align:center;
  flex-wrap: wrap;
`
const SortFlex = styled(Flex)`
  margin-bottom: 32px;
  margin-left:16px;
  padding:2%;

`
const SortLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};

  :hover {
      text-decoration: underline;
  }

`

/* eslint-disable no-bitwise, eqeqeq, no-param-reassign */
const fastPow = (n: number, exp: number) => {
  let prod = 1
  while (exp > 0) {
    if ((exp & 1) != 0) prod *= n
    n *= n
    exp >>= 1 // black magic
  }
  return prod
}

const Vaults: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const vaults = useVaults()
  const block = useBlock()
  const bnbPriceUSD = usePriceBnbBusd()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const wethPrice = usePriceWethBusd()
  const btcPrice = usePriceBtcBusd()
  const routePrice = usePriceRouteBusd()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh() // was fast
  useEffect(() => {
    if (account) {
      dispatch(fetchVaultUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const defaultState = {stakedOnly:false, sortOrder:"Default"}
  const [state, setState] = useState(defaultState)

  // const url = window.location.href
  // if (url.includes('&sort=')) {
  //   sortOrder = url.substring(url.indexOf('&sort=') + 6, url.length)
  // }

  const activeVaults = vaults.filter(
    (vault) => true,
    // (vault) => vault.paused == undefined || vault.paused == false,
  )
  const finishedVaults = vaults.filter((vault) => vault.paused == true)

  const stakedOnlyVaultsActive = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )
  const stakedOnlyVaultsFinished = finishedVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )
  const vaultsList = useCallback(
    (vaultsToDisplay, removed: boolean) => {
      const vaultsToDisplayWithAPY: VaultWithStakedValue[] = vaultsToDisplay.map((vault) => {
        if (vault === undefined) {
          return null
        }
        if (vault.type !== 'standard' && vault.type !== 'burn') {
          return vault
        }
        if (vault.rewardTokenPrice === undefined) {
          return null
        }
        const vaultRewardPerBlock = new BigNumber(vault.rewardPerBlock || 1)
          .times(new BigNumber(vault.poolWeight))
          .div(new BigNumber(10).pow(vault.rewardTokenDecimals))

        const vaultRewardPerYear = vaultRewardPerBlock.times(BLOCKS_PER_YEAR)
        let apr = vault.rewardTokenPrice.times(vaultRewardPerYear)

        let totalFarmValue = new BigNumber(vault.farmLPTotalInQuoteToken || 0)
        let tvl = new BigNumber(vault.lpTotalInQuoteToken|| 0)

        if (vault.quoteTokenSymbol === QuoteToken.BNB) {
          totalFarmValue = totalFarmValue.times(bnbPrice)
          tvl =  bnbPrice.times(tvl)

        }
        if (vault.quoteTokenSymbol === QuoteToken.CAKE) {
          totalFarmValue = totalFarmValue.times(cakePrice)
          tvl =  cakePrice.times(tvl)

        }
        if (vault.quoteTokenSymbol === QuoteToken.WETH) {
          totalFarmValue = totalFarmValue.times(wethPrice)
          tvl =  wethPrice.times(tvl)
          
        }
        if (vault.quoteTokenSymbol === QuoteToken.ROUTE) {
          totalFarmValue = totalFarmValue.times(routePrice)
          tvl =  routePrice.times(tvl)
        }

        if (totalFarmValue.comparedTo(0) > 0) {
          apr = apr.div(totalFarmValue)
        }

          
        const totalFeeDecimal =
          ((vault.performanceFeeBP || 0) +
            (vault.farmDepositFeeBP || 0) +
            (vault.farmWithdrawalFeeBP || 0) +
            (vault.burnRateBP || 0)) /
          10000

        // const NUM_COMPOUNDS_PER_PERIOD = 1000
        const PROFIT_MARGIN = 4;
        const TX_FEE = .004;
        let timesCompoundedPerYear = 365 * (tvl.toNumber() * (apr.toNumber()/365) * totalFeeDecimal) * (1-PROFIT_MARGIN/(PROFIT_MARGIN+1))/TX_FEE*bnbPrice.toNumber()
        if (timesCompoundedPerYear<365*24){
          timesCompoundedPerYear = 365*24
  } 

      // const apy = new BigNumber(
      //   fastPow(1 + apr.div(timesCompoundedPerYear).toNumber() * (1 - totalFeeDecimal), timesCompoundedPerYear) -
      //     1,
      // )
      const cakeEarnedPerThousand365 = calculateCakeEarnedPerThousandDollars({
        numberOfDays: 365,
        farmApy: apr*100,
        cakePrice: vault.rewardTokenPrice,
        timesCompounded: timesCompoundedPerYear
      })
      const oneThousandDollarsWorthOfReward = 1000 / vault.rewardTokenPrice
    
      const oneYearROI = apyModalRoi({
        amountEarned: cakeEarnedPerThousand365,
        amountInvested: oneThousandDollarsWorthOfReward,
      })
        
      const apy = new BigNumber(oneYearROI).dividedBy(100);

        return { ...vault, apy, apr, tvl }
      })
      let orderedVaults = vaultsToDisplayWithAPY
      if (state.sortOrder == 'APY') {
        orderedVaults = orderBy(vaultsToDisplayWithAPY, (vault) => vault!= undefined? vault.apy.toNumber() : 0, "desc")
      }
      if (state.sortOrder == 'TVL') {
        orderedVaults = orderBy(vaultsToDisplayWithAPY, (vault) => vault!= undefined? vault.tvl.toNumber() : 0, "desc")
      }

      let i = -1
      return orderedVaults.map((vault) => {
        i++
        if (vault === null || vault === undefined) {
          return <LoadingRow key={`loading-${i}`} />
        }
        return vault.type === 'standard' || vault.type === 'burn' ? (
          <VaultRow
            key={vault.pid}
            vault={vault}
            removed={removed}
            bnbPrice={bnbPrice}
            cakePrice={cakePrice}
            ethereum={ethereum}
            account={account}
            wethPrice={wethPrice}
          />
        ) : null
      })
    },
    [bnbPrice, account, cakePrice, ethereum, wethPrice, routePrice, state],
  )
  return (
    <Page>
      <Hero>
        <TitleSection>
          <Heading as="h1" size="xxl" mb="16px">
            {TranslateString(999, 'Vaults')}
          </Heading>
          <ul>
            <li key="0">{TranslateString(999, 'Auto-compounding.')}</li>
            <li key="1">{TranslateString(999, 'Grow your deposit over time.')}</li>
            <li key="2">{TranslateString(999, 'Unstake at any time.')}</li>
            <li key="3">{TranslateString(999, 'Compound optimally to maximize yield.')}</li>
            <li key="4">{TranslateString(999, '1% performance fee on harvests.')}</li>
            {/* <li key="5"><Link href="/vaults/endowment">{TranslateString(999, 'Check out our Endowment vaults')}</Link></li> */}
          </ul>
        </TitleSection>
        <LogoContainer>
          <VaultLogoBackground
            src="/images/vaults/matic-no-background.svg"
            alt="Vaults Icon"
            width={360}
            height={360}
          />
          <VaultLogoForeground src="/images/vaults/vert.svg" alt="Vaults Icon" width={310} height={310} />
        </LogoContainer>
      </Hero>
      <ControlFlex flexDirection="row" justify-content="center">
      <VaultTabButtons stakedOnly={state.stakedOnly} setStakedOnly={(so)=>setState({stakedOnly:so, sortOrder:state.sortOrder})} />
      {/* <SortDropdown key={0} position="bottom" target={<Flex flex-direction="column" justifyContent="center"><Heading size="s">Sort Order:</Heading><SortButton>{sortOrder}</SortButton></Flex>}> */}
      <SortFlex flex-direction="column">
      <SortDropdown
        key={0}
        position="bottom"
        target={
          <Flex flex-direction="column" justifyContent="space-between">
            <Label>Sort:</Label>
            <SortButton variant="subtle">{state.sortOrder}</SortButton>
          </Flex>
        }
        >
          
        <SortLink onClick={()=>setState({stakedOnly:state.stakedOnly, sortOrder:"Default"})}href="#">Default</SortLink>
        <SortLink onClick={()=>setState({stakedOnly:state.stakedOnly, sortOrder:"APY"})}href="#">APY</SortLink>
        <SortLink onClick={()=>setState({stakedOnly:state.stakedOnly, sortOrder:"TVL"})}href="#">TVL</SortLink>
      </SortDropdown>
          </SortFlex>
        </ControlFlex>
      <Note>
        <i>
          Note that our partner projects may have additional fees not listed here. Always check the underlying project
          and DYOR.
        </i>
      </Note>
      <Divider />
      <LockedFlex>
        <Route exact path={`${path}`}>
          <>{state.stakedOnly ? vaultsList(stakedOnlyVaultsActive, false) : vaultsList(activeVaults, false)}</>
        </Route>
        <Route path={`${path}/history`}>
          {state.stakedOnly ? vaultsList(stakedOnlyVaultsFinished, false) : vaultsList(finishedVaults, false)}
        </Route>
      </LockedFlex>
    </Page>
  )
}

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

export default Vaults
