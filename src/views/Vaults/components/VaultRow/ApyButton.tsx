import React from 'react'
import BigNumber from 'bignumber.js'
import { CalculateIcon, IconButton, useModal } from '@pancakeswap-libs/uikit'
import { Address } from 'config/constants/types'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  cakePrice?: BigNumber
  apy?: BigNumber
  quoteTokenAddresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
  pid: number
  timesCompoundedPerYear: number
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  quoteTokenAddresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  apy,
  pid,
  timesCompoundedPerYear
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAddresses={quoteTokenAddresses}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
      cakePrice={cakePrice}
      apy={apy}
      pid={pid}
      timesCompoundedPerYear={timesCompoundedPerYear}
    />,
  )

  return (
    <IconButton onClick={(event)=>{event.stopPropagation(); onPresentApyModal()}} variant="text" size="sm" ml="4px">
      <CalculateIcon />
    </IconButton>
  )
}

export default ApyButton
