import React from 'react';
import { GameState } from '../types';

interface ScoreboardProps {
    gameState: GameState;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ gameState }) => {
    const { phase, currentPlayerId, players, roundResult, contractPoints, oudlersCapturedByTaker } = gameState;

    const currentPlayer = players.find(p => p.id === currentPlayerId);

    return (
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 p-4 rounded-lg shadow-xl border border-gray-700 text-sm z-10">
            <h2 className="text-lg font-bold border-b border-gray-600 pb-2 mb-2">Информация об игре</h2>
            
            {phase === 'PLAYING' && currentPlayer && (
                <p className="mb-2">
                    <span className="font-semibold">Ход игрока:</span> 
                    <span className="text-cyan-300"> {currentPlayer.name}</span>
                </p>
            )}
            
            <div className="mb-2">
                <p className="font-semibold">Контракт:</p>
                <p>
                    <span className="text-yellow-300">{contractPoints}</span> очков требуется для победы.
                </p>
                <p>
                    Захвачено удлеров: <span className="text-yellow-300">{oudlersCapturedByTaker.length}</span>
                </p>
            </div>
            
            {roundResult && (
                 <div className="mt-2 pt-2 border-t border-gray-600">
                     <h3 className="font-bold text-lg mb-1">
                        {roundResult.isSuccess ? '🎉 Контракт выполнен! 🎉' : '😥 Контракт провален 😥'}
                     </h3>
                     <p>Разыгрывающий набрал: <span className="font-bold text-green-400">{roundResult.takerScore.toFixed(1)}</span></p>
                     <p>Защита набрала: <span className="font-bold text-red-400">{roundResult.defenseScore.toFixed(1)}</span></p>
                     <p>Разница: <span className="font-bold">{roundResult.difference.toFixed(1)}</span></p>
                 </div>
            )}
        </div>
    );
};

export default Scoreboard;