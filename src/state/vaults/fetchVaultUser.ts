import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import vaultsConfig from 'config/constants/vaults'
import { getMasterChefAddress } from 'utils/addressHelpers'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchVaultUserAllowances = async (account: string) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = vaultsConfig.map((vault) => {
    const lpContractAddress = vault.isTokenOnly ? vault.tokenAddresses[CHAIN_ID] : vault.lpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchVaultUserTokenBalances = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpContractAddress = vault.isTokenOnly ? vault.tokenAddresses[CHAIN_ID] : vault.lpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchVaultUserStakedBalances = async (account: string) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = vaultsConfig.map((vault) => {
    return {
      address: masterChefAdress,
      name: 'userInfo',
      params: [vault.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchVaultUserEarnings = async (account: string) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = vaultsConfig.map((vault) => {
    return {
      address: masterChefAdress,
      name: 'pendingEgg',
      params: [vault.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
