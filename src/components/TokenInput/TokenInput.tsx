import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js/bignumber'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from '../../hooks/useI18n'
import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
  depositFeeBP?: number
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value, depositFeeBP = 0 }) => {
  const TranslateString = useI18n()
  const useValue = value
  const useMax = max
  // if(useValue && (symbol === 'USDT' || symbol === 'USDC')){
  //   // USDT or USDC
  //   useValue = new BigNumber("1000000000000").multipliedBy(value).toString();
  // }

  // if(useMax && (symbol === 'USDT' || symbol === 'USDC')){
  //   useMax = new BigNumber("1000000000000").multipliedBy(max).toString();
  // }
  // if(useValue && symbol === 'WBTC'){
  //   useValue = new BigNumber("10000000000").multipliedBy(value).toString();
  // }

  // if(useMax && symbol === 'WBTC'){
  //   useMax = new BigNumber("10000000000").multipliedBy(max).toString();
  // }

  return (
    <StyledTokenInput>
      <StyledMaxText>
        {useMax.toLocaleString()} {symbol} {TranslateString(526, 'Available')}
       
      </StyledMaxText>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
            <StyledSpacer />
            <div>
              <Button size="sm" onClick={onSelectMax}>
                {TranslateString(452, 'Max')}
              </Button>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={useValue}
      />
      {depositFeeBP > 0 ? (
        <StyledMaxText>
          {TranslateString(10001, 'Deposit Fee')}: {new BigNumber(useValue || 0).times(depositFeeBP / 10000).toString()}{' '}
          {symbol}
        </StyledMaxText>
      ) : null}
       {symbol === 'USDT' || symbol === 'USDC' ? (
          <div>
            <br />
            <p>
            *Note that these number displays are off by 12 decimals
            </p>
            Use <a href="https://vfat.tools/polygon/polyvertex/">www.vfat.tools</a> to
            confirm the amount
          </div>
        ) : null}
       {symbol === 'WBTC'?(
          <div>
            <br />
            <p>
            *Note that these number displays are off by 10 decimals
            </p>
            Use <a href="https://vfat.tools/polygon/polyvertex/">www.vfat.tools</a> to
            confirm the amount
          </div>
        ) : null}
    </StyledTokenInput>
  )
}

const StyledTokenInput = styled.div``

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`

export default TokenInput
