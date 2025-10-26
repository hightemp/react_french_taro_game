
import React from 'react';
import { Card } from '../types';

interface CardViewProps {
  card: Card | null;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  isTrickCard?: boolean; // To apply specific styling for cards in the trick
  playerIndex?: number; // To position trick cards correctly
}

const CardView: React.FC<CardViewProps> = ({ card, isFaceUp = false, onClick, isPlayable = false, className = '', isTrickCard = false, playerIndex }) => {
  const cardBackSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/120px-Card_back_01.svg.png";

  const getTrickCardPosition = () => {
    switch(playerIndex) {
      case 0: return 'translate-y-4'; // Bottom
      case 1: return '-translate-x-4'; // Left
      case 2: return '-translate-y-4'; // Top
      case 3: return 'translate-x-4';  // Right
      default: return '';
    }
  };

  return (
    <div
      className={`
        relative w-[75px] h-[110px] md:w-[90px] md:h-[132px] 
        transition-all duration-300 ease-in-out
        ${onClick ? 'cursor-pointer' : ''}
        ${isPlayable ? 'hover:-translate-y-4 hover:shadow-xl hover:shadow-cyan-400/50 ring-2 ring-cyan-400' : ''}
        ${isTrickCard ? getTrickCardPosition() : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <img
        src={isFaceUp && card ? card.imageUrl : cardBackSrc}
        alt={isFaceUp && card ? `${card.rank} of ${card.suit}` : 'Card back'}
        className="w-full h-full object-cover rounded-md shadow-lg border border-gray-600"
      />
    </div>
  );
};

export default CardView;
