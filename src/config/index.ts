import BigNumber from 'bignumber.js/bignumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const CAKE_PER_BLOCK = new BigNumber(.05)
export const POLYGON_BLOCK_TIME = 2
export const BLOCKS_PER_YEAR = new BigNumber(365 * 24 * 60 * 60 / POLYGON_BLOCK_TIME) // 15768000
export const VERT_DECIMALS = 18;
export const CAKE_POOL_PID = 0
