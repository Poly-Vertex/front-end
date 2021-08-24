import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const darkGradient = "rgb(40, 56, 61), rgb(61, 40, 55)"

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }
  body {
    background: linear-gradient(
      10deg,
      ${({ theme }) => theme.isDark? darkGradient:`rgb(244, 255, 254), ${theme.colors.background}`}
      );

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
