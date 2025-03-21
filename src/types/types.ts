export interface Token {
    address : string,
    name: string,
    symbol: string,
    decimals: number
  }

  export interface Ybt {
    baseToken: Token
    syToken: Token
    address : string,
    name: string,
    symbol: string,
    decimals: number
  }