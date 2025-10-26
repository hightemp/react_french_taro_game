
import { Card, Player, Suit, TrickCard, Rank } from '../types';
import { FULL_DECK, OUDLERS, CONTRACT_POINTS_REQUIRED } from '../constants';

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (): { players: Player[], deck: Card[] } => {
    const shuffledDeck = shuffleDeck(FULL_DECK);
    const players: Player[] = [
        { id: 0, name: 'Вы', hand: [], capturedCards: [], isHuman: true },
        { id: 1, name: 'Запад', hand: [], capturedCards: [], isHuman: false },
        { id: 2, name: 'Север', hand: [], capturedCards: [], isHuman: false },
        { id: 3, name: 'Восток', hand: [], capturedCards: [], isHuman: false },
    ];
    
    // In a real game, cards are dealt 3 at a time, but for simulation, we can deal one by one.
    // 18 cards per player, 6 for the "chien" (dog/kitty). We'll ignore the chien for this simplified version.
    for (let i = 0; i < 18 * 4; i++) {
        players[i % 4].hand.push(shuffledDeck[i]);
    }

    const remainingDeck = shuffledDeck.slice(18 * 4);

    // Sort hands for better UX
    players.forEach(player => {
        player.hand.sort((a, b) => {
            if (a.suit === b.suit) {
                return a.sortOrder - b.sortOrder;
            }
            if (a.suit === Suit.Trumps) return -1;
            if (b.suit === Suit.Trumps) return 1;
            const suitOrder = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
            return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
        });
    });

    return { players, deck: remainingDeck };
};

export const getLeadSuit = (trick: TrickCard[]): Suit | null => {
    if (trick.length === 0) return null;
    // The Fool doesn't set the suit
    const firstRealCard = trick.find(tc => tc.card.rank !== 'Fool');
    return firstRealCard ? firstRealCard.card.suit : null;
};

export const getPlayerCardsOfSuit = (hand: Card[], suit: Suit): Card[] => {
    return hand.filter(card => card.suit === suit);
};

export const hasHigherTrump = (hand: Card[], rank: number): boolean => {
    return hand.some(card => card.suit === Suit.Trumps && card.sortOrder > rank);
};

export const getHighestTrumpInTrick = (trick: TrickCard[]): Card | null => {
    return trick
        .map(tc => tc.card)
        .filter(card => card.suit === Suit.Trumps)
        .reduce((highest, card) => (highest === null || card.sortOrder > highest.sortOrder ? card : highest), null);
};


export const isValidPlay = (cardToPlay: Card, hand: Card[], trick: TrickCard[]): boolean => {
    const leadSuit = getLeadSuit(trick);

    // If it's the first card of the trick, any card is valid.
    if (!leadSuit) return true;

    const playerSuitCards = getPlayerCardsOfSuit(hand, leadSuit);
    const playerTrumps = getPlayerCardsOfSuit(hand, Suit.Trumps);

    // If the lead suit is not Trumps
    if (leadSuit !== Suit.Trumps) {
        if (playerSuitCards.length > 0) {
            // Must follow suit
            return cardToPlay.suit === leadSuit;
        } else if (playerTrumps.length > 0) {
            // Can't follow suit, must play a trump if available
            const highestTrumpInTrick = getHighestTrumpInTrick(trick);
            if (highestTrumpInTrick) {
                const playerHasHigherTrump = hasHigherTrump(playerTrumps, highestTrumpInTrick.sortOrder);
                if (playerHasHigherTrump) {
                    // Must over-trump if possible
                    return cardToPlay.suit === Suit.Trumps && cardToPlay.sortOrder > highestTrumpInTrick.sortOrder;
                }
            }
            // If no higher trump, any trump is fine. If no trumps in trick, any trump is fine.
            return cardToPlay.suit === Suit.Trumps;
        } else {
            // No cards of lead suit, no trumps. Can play anything.
            return true;
        }
    }
    // If the lead suit is Trumps
    else {
        if (playerTrumps.length > 0) {
            const highestTrumpInTrick = getHighestTrumpInTrick(trick);
            const playerHasHigherTrump = highestTrumpInTrick ? hasHigherTrump(playerTrumps, highestTrumpInTrick.sortOrder) : true;
            
            if (playerHasHigherTrump) {
                 // Must play a higher trump if possible
                return cardToPlay.suit === Suit.Trumps && (!highestTrumpInTrick || cardToPlay.sortOrder > highestTrumpInTrick.sortOrder);
            } else {
                // Cannot play higher, any trump is valid.
                return cardToPlay.suit === Suit.Trumps;
            }
        } else {
            // No trumps. Can play anything.
            return true;
        }
    }
};

export const getTrickWinner = (trick: TrickCard[]): number => {
    if (trick.length === 0) throw new Error("Cannot determine winner of an empty trick.");

    // The Fool (L'Excuse) special case: belongs to the player who played it, unless it's the last trick.
    // For simplicity here, we'll treat it as a non-winning card and handle its capture separately.
    const trickWithoutFool = trick.filter(tc => tc.card.rank !== 'Fool');
    if (trickWithoutFool.length === 0) {
        // This can happen if only the Fool was played, though rare. The leader takes it.
        return trick[0].playerId;
    }

    const trumpsInTrick = trickWithoutFool.filter(tc => tc.card.suit === Suit.Trumps);
    
    let winner: TrickCard;

    if (trumpsInTrick.length > 0) {
        // If there are trumps, the highest trump wins
        winner = trumpsInTrick.reduce((a, b) => a.card.sortOrder > b.card.sortOrder ? a : b);
    } else {
        // Otherwise, the highest card of the lead suit wins
        const leadSuit = getLeadSuit(trickWithoutFool);
        const leadSuitCards = trickWithoutFool.filter(tc => tc.card.suit === leadSuit);
        winner = leadSuitCards.reduce((a, b) => a.card.sortOrder > b.card.sortOrder ? a : b);
    }

    return winner.playerId;
};

export const isOudler = (card: Card): boolean => {
    return OUDLERS.some(oudler => oudler.rank === card.rank && oudler.suit === card.suit);
};

export const calculateRoundScore = (takerId: number, players: Player[]) => {
    const taker = players[takerId];
    const defense = players.filter(p => p.id !== takerId);
    
    let takerScore = taker.capturedCards.reduce((sum, card) => sum + card.pointValue, 0);
    let defenseScore = defense.flatMap(p => p.capturedCards).reduce((sum, card) => sum + card.pointValue, 0);

    const oudlersCapturedByTaker = taker.capturedCards.filter(isOudler);
    const pointsRequired = CONTRACT_POINTS_REQUIRED[oudlersCapturedByTaker.length];
    
    const isSuccess = takerScore >= pointsRequired;
    const difference = Math.abs(takerScore - pointsRequired);

    return { takerScore, defenseScore, isSuccess, difference, oudlersCapturedByTaker, pointsRequired };
};

export const getBotMove = (player: Player, trick: TrickCard[]): Card => {
    const hand = player.hand;
    const validMoves = hand.filter(card => isValidPlay(card, hand, trick));

    if(validMoves.length === 0) {
      // This should not happen if logic is correct, but as a fallback, play any card.
      return hand[0];
    }
    
    const leadSuit = getLeadSuit(trick);
    const highestTrumpInTrick = getHighestTrumpInTrick(trick);
    
    // Simple AI:
    // 1. If can win with the lowest possible winning card, do it.
    // 2. If can't win, play the lowest value card possible.

    const winningMoves = validMoves.filter(move => {
        const tempTrick = [...trick, { card: move, playerId: player.id }];
        return getTrickWinner(tempTrick) === player.id;
    });

    if (winningMoves.length > 0) {
        // Play the "cheapest" winning card
        return winningMoves.sort((a, b) => a.sortOrder - b.sortOrder)[0];
    } else {
        // Can't win, throw away a low-value card
        return validMoves.sort((a,b) => a.pointValue - b.pointValue)[0];
    }
};
