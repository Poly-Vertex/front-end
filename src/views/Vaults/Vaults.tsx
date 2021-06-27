import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR } from 'config'
import orderBy from 'lodash/orderBy'
import { provider } from 'web3-core'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, useVaults, usePriceWethBusd,  usePriceBtcBusd} from 'state/hooks'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import VaultRow from './components/VaultRow/VaultRow'
import PoolTabButtons from '../Pools/components/PoolTabButtons'
import Divider from '../Farms/components/Divider'

const Vaults: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const vaults = useVaults(account)
  const bnbPriceUSD = usePriceBnbBusd()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const wethPrice = usePriceWethBusd()
  const btcPrice = usePriceBtcBusd()
  const block = useBlock()

  const removed = false; // TODO

  const vaultsWithApy = vaults.map((vault) => {
    // const isBnbPool = vault.poolCategory === PoolCategory.BINANCE
    const apy = new BigNumber(0)
    return {
      ...vault,
      isFinished: vault.pid === 0 ? false : vault.isFinished || block > vault.endBlock,
      apy,
    }
  })

  const [finishedVaults, openVaults] = partition(vaultsWithApy, (vault) => vault.isFinished)

  return (
    <Page>
      <Hero>
        <div>
          <Heading as="h1" size="xxl" mb="16px">
            {TranslateString(999, 'Vaults')}
          </Heading>
          <ul>
            <li>{TranslateString(999, 'Auto-compounding.')}</li>
            <li>{TranslateString(999, 'Grow your deposit over time.')}</li>
            <li>{TranslateString(999, 'You can unstake at any time.')}</li>
            <li>{TranslateString(999, 'Compound every X minutes to maximize yield')}</li>
          </ul>
        </div>
        {/* <img src="/images/.png" alt="Vaults Icon width={410} height={191} /> */}
      </Hero>
      <PoolTabButtons />
      <Divider />
      <FlexLayout>
        <Route exact path={`${path}`}>
          <>
            {orderBy(openVaults, ['sortOrder']).map((vault) => (
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
            ))}
          </>
        </Route>
        <Route path={`${path}/history`}>
          {orderBy(finishedVaults, ['sortOrder']).map((vault) => (
            <VaultRow  
            key={vault.pid}
            vault={vault}
            removed={removed}
            bnbPrice={bnbPrice}
            cakePrice={cakePrice}
            ethereum={ethereum}
            account={account}
            wethPrice={wethPrice} />
          ))}
        </Route>
      </FlexLayout>
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
