import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync } from './actions'
import { State, Farm, Pool, Vault } from './types'
import { QuoteToken } from '../config/constants/types'
import { fetchVaultsPublicDataAsync } from './vaults'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchVaultsPublicDataAsync())
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}


// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Vaults 

export const useVaults = (): Vault[] => {
  const vaults = useSelector((state: State) => state.vaults.data)
  return vaults
}

export const useVaultFromPid = (pid): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((p) => p.pid === pid))
  return vault
}

export const useVaultFromSymbol = (lpSymbol: string): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((f) => f.lpSymbol === lpSymbol))
  return vault
}

export const useVaultUser = (pid) => {
  const vault = useVaultFromPid(pid)
  return {
    allowance: vault.userData ? new BigNumber(vault.userData.allowance) : new BigNumber(0),
    tokenBalance: vault.userData ? new BigNumber(vault.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: vault.userData ? new BigNumber(vault.userData.stakedBalance) : new BigNumber(0),
  }
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 2 // USDC-MATIC LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

// works 
export const usePriceCakeBusd = (): BigNumber => {
  const pid = 0; // VERT-USDC LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
}
export const usePriceWethBusd = (): BigNumber => {
  const pid = 8; // ETH-USDC LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
}
export const usePriceBtcBusd = (): BigNumber => {
  const pid = 10; // BTC-USDC LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
}

export const useTotalValue = (): {farms:BigNumber, vaults:BigNumber} => {
  const farms = useFarms();
  const vaults = useVaults();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  const ethPrice = usePriceWethBusd();
  const btcPrice = usePriceBtcBusd();
  let farmsValue = new BigNumber(0);
  let vaultsValue = new BigNumber(0);
  
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteTokenSymbol === QuoteToken.BTC) {
        val = (btcPrice.times(farm.lpTotalInQuoteToken));
       
      }else{
        val = (farm.lpTotalInQuoteToken); // USDC etc
      }
      farmsValue = farmsValue.plus(val);
    }
  
  }

  for (let i = 0; i < vaults.length; i++) {
    const vault = vaults[i]
    if (vault.lpTotalInQuoteToken) {
      let val;
      if (vault.quoteTokenSymbol === QuoteToken.BNB) {
        val = (bnbPrice.times(vault.lpTotalInQuoteToken));
      }else if (vault.quoteTokenSymbol === QuoteToken.CAKE) {
        val = (cakePrice.times(vault.lpTotalInQuoteToken));
      }else if (vault.quoteTokenSymbol === QuoteToken.BTC) {
        val = (btcPrice.times(vault.lpTotalInQuoteToken));
       
      }else{
        val = (vault.lpTotalInQuoteToken); // USDC etc
      }
      vaultsValue = vaultsValue.plus(val);
    }
  
  }
  const farmsOutput = farmsValue.toString() === Infinity.toString() ? new BigNumber(0): farmsValue;
  const vaultsOutput = vaultsValue.toString() === Infinity.toString() ? new BigNumber(0): vaultsValue;
  return {farms:farmsOutput, vaults:vaultsOutput};
}