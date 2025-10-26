import { Card, Suit, Rank } from './types';

const SUITS = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
const RANKS: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Cavalier', 'Queen', 'King'];
const TRUMP_RANKS: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

// FIX: Removed duplicate '1' key from POINT_VALUES to resolve error.
// The value for '1' is now 4.5, which is correct for the Trump '1' (Petit).
// The logic in createDeck is updated to handle the Ace of suits correctly.
const POINT_VALUES: Record<Rank, number> = {
  'King': 4.5, 'Queen': 3.5, 'Cavalier': 2.5, 'Jack': 1.5,
  '2': 0.5, '3': 0.5, '4': 0.5, '5': 0.5, '6': 0.5, '7': 0.5, '8': 0.5, '9': 0.5, '10': 0.5,
  '21': 4.5, '1': 4.5, 'Fool': 4.5,
  '20': 0.5, '19': 0.5, '18': 0.5, '17': 0.5, '16': 0.5, '15': 0.5, '14': 0.5, '13': 0.5, '12': 0.5, '11': 0.5
};

const RANK_SORT_ORDER: Record<Rank, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'Jack': 11, 'Cavalier': 12, 'Queen': 13, 'King': 14,
  'Fool': 0, '21': 21, '20': 20, '19': 19, '18': 18, '17': 17, '16': 16, '15': 15, '14': 14, '13': 13, '12': 12, '11': 11
};

const IMAGE_URLS: Record<string, string> = {
  // Trumps (Major Arcana)
  'Trumps-Fool': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/RWS_Tarot_00_Fool.jpg/250px-RWS_Tarot_00_Fool.jpg',
  'Trumps-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/RWS_Tarot_01_Magician.jpg/250px-RWS_Tarot_01_Magician.jpg',
  'Trumps-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/250px-RWS_Tarot_02_High_Priestess.jpg',
  'Trumps-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/RWS_Tarot_03_Empress.jpg/250px-RWS_Tarot_03_Empress.jpg',
  'Trumps-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/RWS_Tarot_04_Emperor.jpg/250px-RWS_Tarot_04_Emperor.jpg',
  'Trumps-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RWS_Tarot_05_Hierophant.jpg/250px-RWS_Tarot_05_Hierophant.jpg',
  'Trumps-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RWS_Tarot_06_Lovers.jpg/250px-RWS_Tarot_06_Lovers.jpg',
  'Trumps-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/RWS_Tarot_07_Chariot.jpg/250px-RWS_Tarot_07_Chariot.jpg',
  'Trumps-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/RWS_Tarot_08_Strength.jpg/250px-RWS_Tarot_08_Strength.jpg',
  'Trumps-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/RWS_Tarot_09_Hermit.jpg/250px-RWS_Tarot_09_Hermit.jpg',
  'Trumps-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg/250px-RWS_Tarot_10_Wheel_of_Fortune.jpg',
  'Trumps-11': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/RWS_Tarot_11_Justice.jpg/250px-RWS_Tarot_11_Justice.jpg',
  'Trumps-12': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/RWS_Tarot_12_Hanged_Man.jpg/250px-RWS_Tarot_12_Hanged_Man.jpg',
  'Trumps-13': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/RWS_Tarot_13_Death.jpg/250px-RWS_Tarot_13_Death.jpg',
  'Trumps-14': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/RWS_Tarot_14_Temperance.jpg/250px-RWS_Tarot_14_Temperance.jpg',
  'Trumps-15': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/RWS_Tarot_15_Devil.jpg/250px-RWS_Tarot_15_Devil.jpg',
  'Trumps-16': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/RWS_Tarot_16_Tower.jpg/250px-RWS_Tarot_16_Tower.jpg',
  'Trumps-17': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RWS_Tarot_17_Star.jpg/250px-RWS_Tarot_17_Star.jpg',
  'Trumps-18': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/RWS_Tarot_18_Moon.jpg/250px-RWS_Tarot_18_Moon.jpg',
  'Trumps-19': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/RWS_Tarot_19_Sun.jpg/250px-RWS_Tarot_19_Sun.jpg',
  'Trumps-20': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/RWS_Tarot_20_Judgement.jpg/250px-RWS_Tarot_20_Judgement.jpg',
  'Trumps-21': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/RWS_Tarot_21_World.jpg/250px-RWS_Tarot_21_World.jpg',
  // Clubs (Wands)
  'Clubs-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Wands01.jpg/250px-Wands01.jpg',
  'Clubs-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Wands02.jpg/250px-Wands02.jpg',
  'Clubs-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Wands03.jpg/250px-Wands03.jpg',
  'Clubs-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Wands04.jpg/250px-Wands04.jpg',
  'Clubs-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Wands05.jpg/250px-Wands05.jpg',
  'Clubs-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Wands06.jpg/250px-Wands06.jpg',
  'Clubs-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Wands07.jpg/250px-Wands07.jpg',
  'Clubs-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Wands08.jpg/250px-Wands08.jpg',
  'Clubs-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Tarot_Nine_of_Wands.jpg/250px-Tarot_Nine_of_Wands.jpg',
  'Clubs-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Wands10.jpg/250px-Wands10.jpg',
  'Clubs-Jack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Wands11.jpg/250px-Wands11.jpg',
  'Clubs-Cavalier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Wands12.jpg/250px-Wands12.jpg',
  'Clubs-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Wands13.jpg/250px-Wands13.jpg',
  'Clubs-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Wands14.jpg/250px-Wands14.jpg',
  // Hearts (Cups)
  'Hearts-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cups01.jpg/250px-Cups01.jpg',
  'Hearts-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Cups02.jpg/250px-Cups02.jpg',
  'Hearts-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cups03.jpg/250px-Cups03.jpg',
  'Hearts-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cups04.jpg/250px-Cups04.jpg',
  'Hearts-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cups05.jpg/250px-Cups05.jpg',
  'Hearts-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cups06.jpg/250px-Cups06.jpg',
  'Hearts-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cups07.jpg/250px-Cups07.jpg',
  'Hearts-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cups08.jpg/250px-Cups08.jpg',
  'Hearts-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Cups09.jpg/250px-Cups09.jpg',
  'Hearts-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Cups10.jpg/250px-Cups10.jpg',
  'Hearts-Jack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Cups11.jpg/250px-Cups11.jpg',
  'Hearts-Cavalier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Cups12.jpg/250px-Cups12.jpg',
  'Hearts-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Cups13.jpg/250px-Cups13.jpg',
  'Hearts-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cups14.jpg/250px-Cups14.jpg',
  // Spades (Swords)
  'Spades-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Swords01.jpg/250px-Swords01.jpg',
  'Spades-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Swords02.jpg/250px-Swords02.jpg',
  'Spades-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Swords03.jpg/250px-Swords03.jpg',
  'Spades-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Swords04.jpg/250px-Swords04.jpg',
  'Spades-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Swords05.jpg/250px-Swords05.jpg',
  'Spades-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Swords06.jpg/250px-Swords06.jpg',
  'Spades-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Swords07.jpg/250px-Swords07.jpg',
  'Spades-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Swords08.jpg/250px-Swords08.jpg',
  'Spades-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Swords09.jpg/250px-Swords09.jpg',
  'Spades-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Swords10.jpg/250px-Swords10.jpg',
  'Spades-Jack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Swords11.jpg/250px-Swords11.jpg',
  'Spades-Cavalier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Swords12.jpg/250px-Swords12.jpg',
  'Spades-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Swords13.jpg/250px-Swords13.jpg',
  'Spades-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Swords14.jpg/250px-Swords14.jpg',
  // Diamonds (Pentacles)
  'Diamonds-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Pents01.jpg/250px-Pents01.jpg',
  'Diamonds-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pents02.jpg/250px-Pents02.jpg',
  'Diamonds-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pents03.jpg/250px-Pents03.jpg',
  'Diamonds-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pents04.jpg/250px-Pents04.jpg',
  'Diamonds-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Pents05.jpg/250px-Pents05.jpg',
  'Diamonds-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pents06.jpg/250px-Pents06.jpg',
  'Diamonds-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pents07.jpg/250px-Pents07.jpg',
  'Diamonds-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pents08.jpg/250px-Pents08.jpg',
  'Diamonds-9': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pents09.jpg/250px-Pents09.jpg',
  'Diamonds-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pents10.jpg/250px-Pents10.jpg',
  'Diamonds-Jack': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pents11.jpg/250px-Pents11.jpg',
  'Diamonds-Cavalier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pents12.jpg/250px-Pents12.jpg',
  'Diamonds-Queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pents13.jpg/250px-Pents13.jpg',
  'Diamonds-King': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Pents14.jpg/250px-Pents14.jpg',
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];

  // Suit cards
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const cardId = `${suit}-${rank}`;
      deck.push({
        id: cardId,
        suit,
        rank,
        pointValue: rank === '1' ? 0.5 : POINT_VALUES[rank],
        imageUrl: IMAGE_URLS[cardId],
        sortOrder: RANK_SORT_ORDER[rank],
      });
    }
  }

  // Trump cards
  for (const rank of TRUMP_RANKS) {
    const cardId = `${Suit.Trumps}-${rank}`;
    deck.push({
      id: cardId,
      suit: Suit.Trumps,
      rank,
      pointValue: POINT_VALUES[rank] || 0.5,
      imageUrl: IMAGE_URLS[cardId],
      sortOrder: RANK_SORT_ORDER[rank],
    });
  }

  // The Fool (Excuse)
  const foolId = `${Suit.Trumps}-Fool`;
  deck.push({
    id: foolId,
    suit: Suit.Trumps,
    rank: 'Fool',
    pointValue: 4.5,
    imageUrl: IMAGE_URLS[foolId],
    sortOrder: RANK_SORT_ORDER['Fool'],
  });

  return deck;
};

export const FULL_DECK = createDeck();

export const OUDLERS: { rank: Rank; suit: Suit }[] = [
  { rank: '1', suit: Suit.Trumps },
  { rank: '21', suit: Suit.Trumps },
  { rank: 'Fool', suit: Suit.Trumps },
];

export const CONTRACT_POINTS_REQUIRED: Record<number, number> = {
    0: 56,
    1: 51,
    2: 41,
    3: 36,
};
