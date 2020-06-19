export enum SuitEnum {
  spades = 1,
  hearts,
  diamonds,
  clubs
}

export interface Card {
  id: string | number
  naipe: number
  value: number
  rank: string
  suit: SuitEnum | string
  shortRank?: string
  shortSuit?: string
}