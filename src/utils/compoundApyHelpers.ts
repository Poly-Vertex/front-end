const roundToTwoDp = (number) => Math.round(number * 100) / 100


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

export const calculateCakeEarnedPerThousandDollars = ({ numberOfDays, farmApy, cakePrice, timesCompounded=365 }) => {
  // Everything here is worked out relative to a year, with the asset compounding daily
  //   We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const apyAsDecimal = farmApy / 100
  const daysAsDecimalOfYear = numberOfDays / 365
  //   Calculate the starting VERT balance with a dollar balance of $1000.
  const principal = 1000 / cakePrice

  // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
  // const finalAmount = principal * (1 + apyAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)
  const finalAmount = principal * fastPow((1 + apyAsDecimal / timesCompounded), (timesCompounded * daysAsDecimalOfYear))

  // To get the vert earned, deduct the amount after compounding (finalAmount) from the starting VERT balance (principal)
  const interestEarned = finalAmount - principal
  return roundToTwoDp(interestEarned)
}

export const apyModalRoi = ({ amountEarned, amountInvested }) => {
  const percentage = (amountEarned / amountInvested) * 100
  return percentage.toFixed(2)
}
