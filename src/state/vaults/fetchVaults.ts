import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import vaultChefABI from 'config/abi/vaultChef.json'
import vaultStrategyABI from 'config/abi/vaultStrategy.json'
import strategyMasterchefABI from 'config/abi/strategyMasterchef.json'
import { fetchSingleFarm } from 'state/farms/fetchFarms'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getVaultChefAddress } from 'utils/addressHelpers'
import vaultsConfig from 'config/constants/vaults'
import { QuoteToken, FarmConfig } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchVaults = async () => {
  const data = await Promise.all(
    vaultsConfig.map(async (vaultConfig) => {
      const vaultChefAddr = getVaultChefAddress();
      if(vaultChefAddr == null){
        console.error("Could not retrieve vaultchef address")
      }
      const [info] = await multicall(vaultChefABI, [
        {
          address: vaultChefAddr,
          name: 'poolInfo',
          params: [vaultConfig.pid],
        },
      ])
      const token = info[0] // token
      const strategy = info[1] // strategy
      
      const [lpTokenBalanceVC] = await multicall(vaultStrategyABI, [
        {
          address: strategy,
          name: 'vaultSharesTotal',
          params: [],
        },
      ])

      // const lpAddress = vaultConfig.lpAddresses[CHAIN_ID] // unnecessary (use token instead)
      const lpAddress = token 
      const erc20Calls = [
        // Balance of token in the LP contract
        {
          address: vaultConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: vaultConfig.quoteTokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: vaultConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: vaultConfig.quoteTokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
      ]
      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals
      ] = await multicall(erc20, erc20Calls)

      let tokenAmount;
      let lpTotalInQuoteToken;
      let lpStakedTotal;
      let tokenPriceVsQuote;

      if(vaultConfig.isTokenOnly){
        tokenAmount = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals));
        
        if(vaultConfig.tokenSymbol === QuoteToken.BUSD && vaultConfig.quoteTokenSymbol === QuoteToken.BUSD){
          tokenPriceVsQuote = new BigNumber(1);          
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(10).pow(quoteTokenDecimals)).div(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)));
        }

        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
        
        lpStakedTotal = tokenAmount;
      }else{
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceVC).div(new BigNumber(lpTotalSupply))
        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatio)
        
        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP)
          .div(new BigNumber(10).pow(tokenDecimals))
          .times(lpTokenRatio)

        
        const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

          if(tokenAmount.comparedTo(0) > 0){
            tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
          }
        lpStakedTotal = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals)) 
      }

      // ONLY FOR MASTERCHEF STRATEGIES:


      const [masterChefAddr, masterchefPID] = await multicall(strategyMasterchefABI, [
        {
          address: strategy,
          name: 'masterchefAddress',
        },
        {
          address: strategy,
          name: 'pid',
        },
      ])

      if(masterChefAddr == null){
        console.error("Could not get masterchef address");
      }

      let farmConfig : FarmConfig = {
        pid: parseInt(masterchefPID),
        lpSymbol: vaultConfig.lpSymbol,
        lpAddresses: vaultConfig.lpAddresses,
        tokenSymbol: vaultConfig.tokenSymbol,
        tokenAddresses: vaultConfig.tokenAddresses,
        quoteTokenSymbol: vaultConfig.quoteTokenSymbol,
        quoteTokenAddresses: vaultConfig.quoteTokenAddresses,
        isTokenOnly: vaultConfig.isTokenOnly,
        isCommunity: vaultConfig.isCommunity,
        risk: vaultConfig.risk,
        dual: vaultConfig.dual,
        exchange:vaultConfig.exchange
      }

      if(farmConfig.pid !== undefined)
        farmConfig = await fetchSingleFarm(farmConfig);
    
      
      return {
        ...vaultConfig,
        tokenAmount: tokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        lpStakedTotal: lpStakedTotal.toJSON(),
        lpTokenBalanceChef: lpTokenBalanceVC,
        farm: farmConfig
      }
    }),
  )
  return data
}

export default fetchVaults
