import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchSingleFarm = async (_farmConfigIn, masterChefAddr) => {
  const lpAddress = _farmConfigIn.lpAddresses[CHAIN_ID]
  const calls = [
    // Balance of token in the LP contract
    {
      address: _farmConfigIn.tokenAddresses[CHAIN_ID],
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: _farmConfigIn.quoteTokenAddresses[CHAIN_ID],
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: _farmConfigIn.isTokenOnly ? _farmConfigIn.tokenAddresses[CHAIN_ID] : lpAddress,
      name: 'balanceOf',
      params: [masterChefAddr],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: _farmConfigIn.tokenAddresses[CHAIN_ID],
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: _farmConfigIn.quoteTokenAddresses[CHAIN_ID],
      name: 'decimals',
    },
  ]

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls)

  let tokenAmount
  let lpTotalInQuoteToken
  let lpStakedTotal
  let tokenPriceVsQuote

  if (_farmConfigIn.isTokenOnly) {
    tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))

    if (_farmConfigIn.tokenSymbol === QuoteToken.USDC && _farmConfigIn.quoteTokenSymbol === QuoteToken.USDC) {
      tokenPriceVsQuote = new BigNumber(1)
    } else {
      tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .div(new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)))
    }

    lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)

    lpStakedTotal = tokenAmount
  } else {
    // Ratio in % a LP tokens that are in staking, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

    // Total value in staking in quote token value
    lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(new BigNumber(2))
      .times(lpTokenRatio)

    // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
    tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)

    const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(lpTokenRatio)

    if (tokenAmount.comparedTo(0) > 0) {
      tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
    }
    lpStakedTotal = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(quoteTokenDecimals))
  }

  const [info, totalAllocPoint, eggPerBlock] = await multicall(masterchefABI, [
    {
      address: masterChefAddr,
      name: 'poolInfo',
      params: [_farmConfigIn.pid],
    },
    {
      address: masterChefAddr,
      name: 'totalAllocPoint',
    },
    {
      address: masterChefAddr,
      name: 'eggPerBlock',
    },
  ])

  const allocPoint = new BigNumber(info.allocPoint._hex)
  let poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
  if (tokenPriceVsQuote === undefined) {
    console.error(`Could not get token price for pool ${_farmConfigIn.pid} ${_farmConfigIn.lpSymbol}`)
    tokenPriceVsQuote = new BigNumber('0')
    poolWeight = new BigNumber(0)
  }
  return {
    ..._farmConfigIn,
    tokenAmount: tokenAmount.toJSON(),
    // quoteTokenAmount: quoteTokenAmount,
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
    poolWeight: poolWeight.toNumber(),
    multiplier: poolWeight.gt(0) ? `${allocPoint.div(100).toString()}X` : 'Failed to fetch',
    depositFeeBP: info.depositFeeBP,
    eggPerBlock: new BigNumber(eggPerBlock).toNumber(),
    lpStakedTotal: lpStakedTotal.toJSON(),
    tokenDecimals: new BigNumber(tokenDecimals).toNumber(),
    quoteTokenDecimals: new BigNumber(quoteTokenDecimals).toNumber(),
  }
}

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      return fetchSingleFarm(farmConfig, getMasterChefAddress())
    }),
  )
  return data
}

export {fetchFarms as default, fetchSingleFarm}
