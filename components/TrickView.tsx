
import React from 'react';
import { TrickCard } from '../types';
import CardView from './CardView';

interface TrickViewProps {
  trick: TrickCard[];
  leadPlayerId: number;
}

const TrickView: React.FC<TrickViewProps> = ({ trick, leadPlayerId }) => {
    // This function maps the absolute player ID (0-3) to a table position (0-3) relative to the human player (who is always at the bottom, position 0).
    // Human is player 0.
    // Player 1 (West) is on the left (position 1)
    // Player 2 (North) is on top (position 2)
    // Player 3 (East) is on the right (position 3)
    const getRelativePosition = (playerId: number) => {
        // Assuming human player is always ID 0
        return playerId;
    }

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {trick.map(({ card, playerId }) => (
        <div key={card.id} className="absolute">
            <CardView 
                card={card} 
                isFaceUp={true} 
                isTrickCard={true}
                playerIndex={getRelativePosition(playerId)}
            />
        </div>
      ))}
    </div>
  );
};

export default TrickView;
