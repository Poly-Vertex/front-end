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



const getPriceVaultReward = async (address): Promise<BigNumber> => {
  const url = `https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${address}&vs_currencies=usd`
  return fetch(url, null)
  .then(response => response.json())
  .then(data => {
    const dataAddress = address.toLowerCase()
    return new BigNumber(data[dataAddress].usd);
  });
}

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
        // Reward token decimals
        {
          address: vaultConfig.rewardToken,
          name: 'decimals',
        },
      ]
      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
        rewardTokenDecimals
      ] = await multicall(erc20, erc20Calls)

      // ONLY FOR MASTERCHEF STRATEGIES:
      const [masterChefAddr] = await multicall(strategyMasterchefABI, [
        {
          address: strategy,
          name: 'masterchefAddress',
        },
      ])
      const mcCalls = [
       // Balance of LP tokens in the master chef contract
        {
          address: vaultConfig.isTokenOnly ? vaultConfig.tokenAddresses[CHAIN_ID] : lpAddress,
          name: 'balanceOf',
          params: [masterChefAddr[0]],
        },
      ]
      const [
        lpTokenBalanceMC
      ] = await multicall(erc20, mcCalls)


      let tokenAmountVC;
      let tokenAmountMC;
      let lpTotalInQuoteTokenVC;
      let lpTotalInQuoteTokenMC;
      let lpStakedVCTotal;
      let lpStakedMCTotal;
      let tokenPriceVsQuote;

      if(vaultConfig.isTokenOnly){
        tokenAmountVC = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals));
        tokenAmountMC = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        
        if(vaultConfig.tokenSymbol === QuoteToken.BUSD && vaultConfig.quoteTokenSymbol === QuoteToken.BUSD){
          tokenPriceVsQuote = new BigNumber(1);          
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(10).pow(quoteTokenDecimals)).div(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)));
        }

        lpTotalInQuoteTokenVC = tokenAmountVC.times(tokenPriceVsQuote);
        lpTotalInQuoteTokenMC = tokenAmountMC.times(tokenPriceVsQuote);
        
        lpStakedVCTotal = tokenAmountVC;
        lpStakedMCTotal = tokenAmountMC;
      }else{
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatioVC = new BigNumber(lpTokenBalanceVC).div(new BigNumber(lpTotalSupply))
        const lpTokenRatioMC = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking (vault) in quote token value
        lpTotalInQuoteTokenVC = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatioVC)
        
        // Total value in staking (farm) in quote token value
        lpTotalInQuoteTokenMC = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatioMC)
        
        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmountVC = new BigNumber(tokenBalanceLP)
          .div(new BigNumber(10).pow(tokenDecimals))
          .times(lpTokenRatioVC)
        tokenAmountMC = new BigNumber(tokenBalanceLP)
          .div(new BigNumber(10).pow(tokenDecimals))
          .times(lpTokenRatioMC)

        
        const quoteTokenAmountVC = new BigNumber(quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatioVC)

          if(tokenAmountMC.comparedTo(0) > 0){
            tokenPriceVsQuote = quoteTokenAmountVC.div(tokenAmountVC);
          }
        lpStakedVCTotal = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals)) 
        lpStakedMCTotal = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals)) 
      }

    

      // if(masterChefAddr == null){
      //   console.error("Could not get masterchef address");
      // }

      // let farmConfig : FarmConfig = {
      //   pid: parseInt(masterchefPID),
      //   lpSymbol: vaultConfig.lpSymbol,
      //   lpAddresses: vaultConfig.lpAddresses,
      //   tokenSymbol: vaultConfig.tokenSymbol,
      //   tokenAddresses: vaultConfig.tokenAddresses,
      //   quoteTokenSymbol: vaultConfig.quoteTokenSymbol,
      //   quoteTokenAddresses: vaultConfig.quoteTokenAddresses,
      //   isTokenOnly: vaultConfig.isTokenOnly,
      //   isCommunity: vaultConfig.isCommunity,
      //   risk: vaultConfig.risk,
      //   dual: vaultConfig.dual,
      //   exchange:vaultConfig.exchange
      // }

      // if(farmConfig.pid !== undefined)
      //   farmConfig = await fetchSingleFarm(farmConfig, masterChefAddr[0]);
      
      const rewardTokenPrice = await getPriceVaultReward(vaultConfig.rewardToken)
      return {
        ...vaultConfig,
        tokenAmount: tokenAmountVC.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteTokenVC.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote!==undefined?tokenPriceVsQuote.toJSON() : new BigNumber(0).toJSON(),
        lpStakedTotal: lpStakedVCTotal.toJSON(),
        lpTokenBalanceChef: lpTokenBalanceVC,
        farmLPTotalInQuoteToken: lpTotalInQuoteTokenMC.toJSON(),
        rewardTokenDecimals,
        rewardTokenPrice,
        // farm: farmConfig
      }
    }),
  )
  return data
}

export default fetchVaults
