import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import vaultChefABI from 'config/abi/vaultChef.json'
import vaultStrategyABI from 'config/abi/baseStrategy.json'
import strategyMasterchefABI from 'config/abi/strategyMasterchef.json'
import { POLYGON_BLOCK_TIME } from 'config'
import multicall from 'utils/multicall'
import { getVaultChefAddress } from 'utils/addressHelpers'
import vaultsConfig from 'config/constants/vaults'
import { QuoteToken, FarmConfig, VaultConfig } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
const MAX_VAULTS_PER_BATCH = 6

const fetchRewardTokenPriceCoinGecko = async (rewardToken, chainID) => {
  let chain = ""
  switch (chainID) {
    case 137:
      chain = "polygon-pos"
      break;
    case 56:
      chain = "binance-smart-chain"
      break;
    default:
      break;
  }
  const url = `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${rewardToken}&vs_currencies=usd`
  const result = await fetch(url, null)
  const data = await result.json()
  const dataAddress = rewardToken.toString().toLowerCase()
  if (result.status === 200 && data[dataAddress] !== undefined) {
    return new BigNumber(data[dataAddress].usd)
  }

  return new BigNumber(0)
}

const masterchefCalls = async (vaultConfig: VaultConfig, masterchefAddr: string, pid: number) => {
  let farmDepositFeeBP;
  let farmRewardPerBlock;
  let poolWeight;
  
  if (vaultConfig.strategy === 'masterchef') {
    const [poolInfo, farmRewardPerBlockInfo, totalAllocPoint] = await multicall(
      [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'poolInfo',
          outputs: [
            {
              internalType: 'contract IERC20',
              name: 'lpToken',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: vaultConfig.farmPoolAllocName,
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'lastRewardBlock',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'accRewardPerShare',
              type: 'uint256',
            },
            {
              internalType: 'uint16',
              name: vaultConfig.farmFeeCallName,
              type: 'uint16',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: vaultConfig.farmTotalAllocCallName,
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: vaultConfig.farmRewardPerBlockCallName,
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      [
        {
          address: masterchefAddr,
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: masterchefAddr,
          name: vaultConfig.farmRewardPerBlockCallName,
          params: [],
        },
        {
          address: masterchefAddr,
          name: vaultConfig.farmTotalAllocCallName,
          params: [],
        },
      ],
    )

    farmDepositFeeBP = poolInfo[vaultConfig.farmFeeCallName]
    farmRewardPerBlock = farmRewardPerBlockInfo
    poolWeight = poolInfo[vaultConfig.farmPoolAllocName] / totalAllocPoint
  }

  if ((vaultConfig.strategy === 'masterchef-apeswap')) {
    const [poolInfo, farmRewardPerBlockInfo, totalAllocPoint] = await multicall(
      [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'poolInfo',
          outputs: [
            {
              internalType: 'uint128',
              name: 'accBananaPerShare',
              type: 'uint128',
            },
            {
              internalType: 'uint64',
              name: 'lastRewardTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: vaultConfig.farmPoolAllocName,
              type: 'uint64',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: vaultConfig.farmTotalAllocCallName,
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: vaultConfig.farmRewardPerBlockCallName,
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      [
        {
          address: masterchefAddr,
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: masterchefAddr,
          name: vaultConfig.farmRewardPerBlockCallName,
          params: [],
        },
        {
          address: masterchefAddr,
          name: vaultConfig.farmTotalAllocCallName,
          params: [],
        },
      ],
    )
    

    const [rewarder] = await multicall( 
      [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewarder","outputs":[{"internalType":"contract IRewarder","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
      [{
        address: masterchefAddr,
        name: 'rewarder',
        params: [pid],
      }]
      )
      const [rewarderPoolInfo, rewarderRewardPerBlockInfo,  rewarderRewardToken] = await multicall(
        [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            name: 'poolInfo',
            outputs: [
              {
                internalType: 'uint128',
                name: 'accBananaPerShare',
                type: 'uint128',
              },
              {
                internalType: 'uint64',
                name: 'lastRewardTime',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: vaultConfig.farmPoolAllocName,
                type: 'uint64',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
                    {
            inputs: [],
            name: 'rewardPerSecond',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'rewardToken',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        [
          {
            address: rewarder[0],
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: rewarder[0],
            name: 'rewardPerSecond',
            params: [],
          },
                   {
            address: rewarder[0],
            name: 'rewardToken',
            params: [],
          },
        ],
      )
      

    const bananaUSD = await fetchRewardTokenPriceCoinGecko(vaultConfig.rewardTokenCoinGecko || vaultConfig.rewardToken, vaultConfig.coinGeckoChain || parseInt(CHAIN_ID))
    const rewarderUSD = await fetchRewardTokenPriceCoinGecko(rewarderRewardToken, parseInt(CHAIN_ID))

    const bananaPerReward = new BigNumber(bananaUSD).dividedBy(rewarderUSD);
    let extraRewardBanana = new BigNumber(rewarderRewardPerBlockInfo)
    extraRewardBanana = extraRewardBanana.multipliedBy(bananaPerReward)
      
    farmDepositFeeBP = 0
    farmRewardPerBlock = new BigNumber(farmRewardPerBlockInfo).multipliedBy(POLYGON_BLOCK_TIME) 
    farmRewardPerBlock= farmRewardPerBlock.plus(extraRewardBanana);
    poolWeight = poolInfo[vaultConfig.farmPoolAllocName] / totalAllocPoint

  }

  return [farmDepositFeeBP, farmRewardPerBlock, poolWeight]
}

const fetchMasterChefData = async (vaultConfig, strategy, lpAddress) => {
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
  const balanceCall = [
    // Balance of LP tokens in the master chef contract
    {
      address: vaultConfig.isTokenOnly ? vaultConfig.tokenAddresses[CHAIN_ID] : lpAddress,
      name: 'balanceOf',
      params: [masterChefAddr[0]],
    },
  ]
  const [lpTokenBalanceMC] = await multicall(erc20, balanceCall)

 

  const [farmDepositFeeBP, farmRewardPerBlock, poolWeight] = await masterchefCalls(
    vaultConfig,
    masterChefAddr[0],
    parseInt(masterchefPID),
  )
  
  

  return [lpTokenBalanceMC, farmDepositFeeBP, farmRewardPerBlock, poolWeight]
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const fetchVaults = async () => {
  let count = 0
  const data = await Promise.all(
    vaultsConfig.map(async (vaultConfig) => {
      if (count % MAX_VAULTS_PER_BATCH === 0) {
        await sleep(1000)
      }
      count++
      const vaultChefAddr = getVaultChefAddress()
      if (vaultChefAddr == null) {
        console.error('Could not retrieve vaultchef address')
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

      const [
        lpTokenBalanceVC,
        performanceFee,
        withdrawalFeeFactor,
        withdrawalFeeFactorMax,
        depositFeeFactor,
        depositFeeFactorMax,
        buyBackBP,
        isPaused,
      ] = await multicall(vaultStrategyABI, [
        {
          address: strategy,
          name: 'vaultSharesTotal',
          params: [],
        },
        {
          address: strategy,
          name: 'controllerFee',
          params: [],
        },

        {
          address: strategy,
          name: 'withdrawFeeFactor',
          params: [],
        },
        {
          address: strategy,
          name: 'withdrawFeeFactorMax',
          params: [],
        },
        {
          address: strategy,
          name: 'depositFeeFactor',
          params: [],
        },
        {
          address: strategy,
          name: 'depositFeeFactorMax',
          params: [],
        },
        {
          address: strategy,
          name: 'buyBackRate',
          params: [],
        },
        {
          address: strategy,
          name: 'paused',
          params: [],
        },
      ])

      const vaultWithdrawalFee = (withdrawalFeeFactorMax - withdrawalFeeFactor) / withdrawalFeeFactorMax
      const vaultWithdrawalFeeBP = vaultWithdrawalFee * 10000 // decimal -> basis points
      const vaultDepositFee = (depositFeeFactorMax - depositFeeFactor) / depositFeeFactorMax
      const vaultDepositFeeBP = vaultDepositFee * 10000 // decimal -> basis points

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
        rewardTokenDecimals,
      ] = await multicall(erc20, erc20Calls)

      let lpTokenBalanceMC
      let farmDepositFeeBP
      let farmRewardPerBlock
      let poolWeight

      // Get data for MasterChef strategies:
      if (vaultConfig.strategy.includes('masterchef')) {
        [lpTokenBalanceMC, farmDepositFeeBP, farmRewardPerBlock, poolWeight] = await fetchMasterChefData(
          vaultConfig,
          strategy,
          lpAddress,
        )
      }
     
      let tokenAmountVC
      let tokenAmountMC
      let lpTotalInQuoteTokenVC
      let lpTotalInQuoteTokenMC
      let lpStakedVCTotal
      let lpStakedMCTotal
      let tokenPriceVsQuote

      if (vaultConfig.isTokenOnly) {
        tokenAmountVC = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals))
        tokenAmountMC = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))

        if (vaultConfig.tokenSymbol === QuoteToken.BUSD && vaultConfig.quoteTokenSymbol === QuoteToken.BUSD) {
          tokenPriceVsQuote = new BigNumber(1)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP)
            .div(new BigNumber(10).pow(quoteTokenDecimals))
            .div(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)))
        }

        lpTotalInQuoteTokenVC = tokenAmountVC.times(tokenPriceVsQuote)
        lpTotalInQuoteTokenMC = tokenAmountMC.times(tokenPriceVsQuote)

        lpStakedVCTotal = tokenAmountVC
        lpStakedMCTotal = tokenAmountMC
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatioVC = new BigNumber(lpTokenBalanceVC).div(new BigNumber(lpTotalSupply))
        const lpTokenRatioMC = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        if (vaultConfig.tokenSymbol === QuoteToken.BUSD && vaultConfig.quoteTokenSymbol === QuoteToken.BUSD) {
          tokenPriceVsQuote = new BigNumber(1)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP)
            .div(new BigNumber(10).pow(quoteTokenDecimals))
            .div(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)))
        }

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
        tokenAmountVC = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatioVC)
        tokenAmountMC = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatioMC)

        const quoteTokenAmountVC = new BigNumber(quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatioVC)

        // if (tokenAmountMC.comparedTo(0) > 0) {
        //   tokenPriceVsQuote = quoteTokenAmountVC.div(tokenAmountVC)
        // }

        lpStakedVCTotal = new BigNumber(lpTokenBalanceVC).div(new BigNumber(10).pow(tokenDecimals))
        lpStakedMCTotal = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))
      }

      let rewardTokenPrice = new BigNumber(0)
      if (vaultConfig.rewardUsesCoinGecko) {
        rewardTokenPrice = await fetchRewardTokenPriceCoinGecko(vaultConfig.rewardTokenCoinGecko || vaultConfig.rewardToken, vaultConfig.coinGeckoChain || parseInt(CHAIN_ID))
      } else if(vaultConfig.tokenAddresses[CHAIN_ID] === vaultConfig.rewardToken) {
        rewardTokenPrice = tokenPriceVsQuote
      }

      const vault = {
        ...vaultConfig,
        rewardTokenPrice,
        tokenAmount: tokenAmountVC.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteTokenVC.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote !== undefined ? tokenPriceVsQuote.toJSON() : new BigNumber(0).toJSON(),
        lpStakedTotal: lpStakedVCTotal.toJSON(),
        lpTokenBalanceChef: new BigNumber(lpTokenBalanceVC).toJSON(),
        farmLPTotalInQuoteToken: lpTotalInQuoteTokenMC.toJSON(),
        rewardTokenDecimals,
        performanceFeeBP: parseInt(performanceFee),
        vaultWithdrawalFeeBP,
        vaultDepositFeeBP,
        farmDepositFeeBP,
        rewardPerBlock: new BigNumber(farmRewardPerBlock).toJSON(),
        poolWeight,
        burnRateBP: parseInt(buyBackBP),
        paused: isPaused,
      }
      return vault
    }),
  )
  return data
}

export default fetchVaults
