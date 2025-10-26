
import React from 'react';
import { Card } from '../types';
import CardView from './CardView';

interface PlayerHandProps {
  cards: Card[];
  isHuman: boolean;
  onCardClick: (card: Card) => void;
  playableCards: Card[];
  position: 'bottom' | 'top' | 'left' | 'right';
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards, isHuman, onCardClick, playableCards, position }) => {
  const isPlayable = (card: Card) => playableCards.some(pc => pc.id === card.id);
  
  const getPositionClasses = () => {
    switch (position) {
        case 'top': return 'justify-center w-full';
        case 'left': return 'flex-col justify-center h-full items-center';
        case 'right': return 'flex-col justify-center h-full items-center';
        case 'bottom':
        default: return 'justify-center w-full';
    }
  }

  const getCardOffset = (index: number) => {
    const totalCards = cards.length;
    if (isHuman) {
        const overlap = totalCards > 12 ? 45 : 35;
        const totalWidth = totalCards * overlap - overlap;
        const startOffset = -totalWidth / 2;
        return { marginLeft: `${index === 0 ? 0 : -overlap}px` };
    } else {
         if (position === 'left' || position === 'right') {
            const overlap = totalCards > 10 ? 60 : 50;
            return { marginTop: `${index === 0 ? 0 : -overlap}px` };
         } else {
            const overlap = totalCards > 10 ? 70 : 60;
            return { marginLeft: `${index === 0 ? 0 : -overlap}px` };
         }
    }
  }


  return (
    <div className={`flex ${getPositionClasses()}`}>
      {cards.map((card, index) => (
        <div key={card.id} style={getCardOffset(index)}>
          <CardView
            card={card}
            isFaceUp={isHuman}
            onClick={isHuman && isPlayable(card) ? () => onCardClick(card) : undefined}
            isPlayable={isHuman && isPlayable(card)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
