import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://quickswap.exchange/#/swap?outputCurrency=0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0',
      },
      {
        label: 'Liquidity',
        href: 'https://quickswap.exchange/#/add/ETH/0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/nests',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Chart',
        // href: 'https://quickchart.app/token/0x72572CCf5208b59f4BcC14e6653d8c31Cd1fC5a0',
        href: 'https://dex.guru/token/0x72572ccf5208b59f4bcc14e6653d8c31cd1fc5a0-polygon',
      },
      {
        label: 'VFAT Tools',
        href: 'https://vfat.tools/polygon/polyvertex',
      },
      {
        label: 'DappRadar',
        href: 'https://dappradar.com/polygon/defi/polyvertex-yield-farm',
      },
      {
        label: 'CoinGecko',
        href: 'https://www.coingecko.com/en/coins/polyvertex',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      // {
      //   label: 'Github',
      //   href: '#',
      // },
      {
        label: 'Docs',
        href: 'https://docs.polyvertex.finance/',
      },
      // {
      //   label: 'Review by RugDoc',
      //   href: 'https://rugdoc.io/project/polyvertex/ ',
      // },
    
       
      // {
      //   label: 'Blog',
      //   href: '#',
      // },
    ],
  },
  // {
  //   label: 'Partnerships/IFO',
  //   icon: 'GooseIcon',
  //   href: 'https://docs.google.com/forms/d/e/1FAIpQLSe7ycrw8Dq4C5Vjc9WNlRtTxEhFDB1Ny6jlAByZ2Y6qBo7SKg/viewform?usp=sf_link',
  // },
  {
    icon: 'AuditIcon',
    label: 'Audit by TechRate',
    href: 'https://github.com/TechRate/Smart-Contract-Audits/blob/main/PolyVertex%20Full%20Smart%20Contract%20Security%20Audit.pdf',
  },
  // {
    //   label: 'Review by RugDoc',
    //   icon: 'AuditIcon',
    //   href: 'https://rugdoc.io/project/polyvertex/ ',
    // },
    // {
      //   label: 'Audit by CertiK',
      //   icon: 'AuditIcon',
      //   href: 'https://certik.org/projects/goose-finance',
      // },
      {
        icon: 'CommunityIcon',
        label: 'Support PolyVertex',
        href: 'https://docs.polyvertex.finance/support-vertex',
      },
]

export default config
