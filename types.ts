
export enum Suit {
  Trumps = 'Trumps',
  Clubs = 'Clubs',
  Diamonds = 'Diamonds',
  Hearts = 'Hearts',
  Spades = 'Spades',
}

export type Rank =
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'Jack' | 'Cavalier' | 'Queen' | 'King'
  | 'Fool' | '21' | '20' | '19' | '18' | '17' | '16' | '15' | '14' | '13' | '12' | '11';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  pointValue: number;
  imageUrl: string;
  sortOrder: number; // Higher is better within a suit
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  capturedCards: Card[];
  isHuman: boolean;
}

export interface TrickCard {
  card: Card;
  playerId: number;
}

export enum GamePhase {
  LOADING = 'LOADING',
  DEALING = 'DEALING',
  PLAYING = 'PLAYING',
  TRICK_OVER = 'TRICK_OVER',
  ROUND_OVER = 'ROUND_OVER',
}

export interface GameState {
  players: Player[];
  deck: Card[];
  currentTrick: TrickCard[];
  currentPlayerId: number;
  leadPlayerId: number;
  phase: GamePhase;
  oudlersCapturedByTaker: Card[];
  takerId: number;
  contractPoints: number;
  roundResult: {
    takerScore: number;
    defenseScore: number;
    isSuccess: boolean;
    difference: number;
  } | null;
}
