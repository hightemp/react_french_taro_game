import React, { useState, useEffect, useCallback } from 'react';
import { Card, GameState, GamePhase, Player, TrickCard, Suit } from './types';
import * as gameLogic from './services/gameLogic';
import { getPlayHint } from './services/geminiService';
import PlayerHand from './components/PlayerHand';
import TrickView from './components/TrickView';
import Scoreboard from './components/Scoreboard';
import GameControls from './components/GameControls';
import { CONTRACT_POINTS_REQUIRED } from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playableCards, setPlayableCards] = useState<Card[]>([]);
    const [hint, setHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState<boolean>(false);

    const setupNewGame = useCallback(() => {
        const { players } = gameLogic.dealCards();
        const takerId = 0; // Human player is always the taker in this version
        const taker = players[takerId];

        const oudlersInHand = taker.hand.filter(gameLogic.isOudler);
        const pointsRequired = CONTRACT_POINTS_REQUIRED[oudlersInHand.length];
        
        setGameState({
            players,
            deck: [],
            currentTrick: [],
            currentPlayerId: 0,
            leadPlayerId: 0,
            phase: GamePhase.PLAYING,
            takerId: takerId,
            oudlersCapturedByTaker: [],
            contractPoints: pointsRequired,
            roundResult: null,
        });
        setHint(null);
    }, []);

    useEffect(() => {
        setupNewGame();
    }, [setupNewGame]);

    useEffect(() => {
        if (!gameState || gameState.phase !== GamePhase.PLAYING) {
            setPlayableCards([]);
            return;
        }

        const humanPlayer = gameState.players.find(p => p.id === 0);
        if (humanPlayer && gameState.currentPlayerId === 0) {
            const validMoves = humanPlayer.hand.filter(card =>
                gameLogic.isValidPlay(card, humanPlayer.hand, gameState.currentTrick)
            );
            setPlayableCards(validMoves);
        } else {
            setPlayableCards([]);
        }
    }, [gameState]);

    const handleCardPlay = (card: Card) => {
        if (!gameState || gameState.phase !== GamePhase.PLAYING || gameState.currentPlayerId !== 0) return;

        const player = gameState.players[0];
        if (gameLogic.isValidPlay(card, player.hand, gameState.currentTrick)) {
            const newHand = player.hand.filter(c => c.id !== card.id);
            const newTrick = [...gameState.currentTrick, { card, playerId: 0 }];
            
            const updatedPlayers = [...gameState.players];
            updatedPlayers[0] = { ...player, hand: newHand };

            setGameState(prevState => ({
                ...prevState!,
                players: updatedPlayers,
                currentTrick: newTrick,
                currentPlayerId: (prevState!.currentPlayerId + 1) % 4,
            }));
        }
    };
    
    const handleBotTurn = useCallback(() => {
        if (!gameState || gameState.players[gameState.currentPlayerId].isHuman || gameState.phase !== GamePhase.PLAYING) return;

        setTimeout(() => {
            setGameState(prevState => {
                if (!prevState || prevState.players[prevState.currentPlayerId].isHuman) return prevState;

                const player = prevState.players[prevState.currentPlayerId];
                const cardToPlay = gameLogic.getBotMove(player, prevState.currentTrick);
                
                const newHand = player.hand.filter(c => c.id !== cardToPlay.id);
                const newTrick = [...prevState.currentTrick, { card: cardToPlay, playerId: player.id }];

                const updatedPlayers = [...prevState.players];
                updatedPlayers[player.id] = { ...player, hand: newHand };

                return {
                    ...prevState,
                    players: updatedPlayers,
                    currentTrick: newTrick,
                    currentPlayerId: (prevState.currentPlayerId + 1) % 4,
                };
            });
        }, 1000);
    }, [gameState]);


    useEffect(() => {
        if (!gameState || gameState.phase !== GamePhase.PLAYING) return;
        
        if (gameState.currentTrick.length === 4) {
            setGameState(prevState => ({ ...prevState!, phase: GamePhase.TRICK_OVER }));

            setTimeout(() => {
                setGameState(prevState => {
                    if (!prevState) return null;
                    
                    const trickWinnerId = gameLogic.getTrickWinner(prevState.currentTrick);
                    const winner = prevState.players[trickWinnerId];
                    const wonCards = prevState.currentTrick.map(tc => tc.card);
                    
                    const updatedPlayers = [...prevState.players];
                    updatedPlayers[trickWinnerId] = { 
                        ...winner, 
                        capturedCards: [...winner.capturedCards, ...wonCards] 
                    };

                    const isRoundOver = updatedPlayers[0].hand.length === 0;

                    if (isRoundOver) {
                        const result = gameLogic.calculateRoundScore(prevState.takerId, updatedPlayers);
                        return {
                            ...prevState,
                            players: updatedPlayers,
                            currentTrick: [],
                            phase: GamePhase.ROUND_OVER,
                            roundResult: {
                                takerScore: result.takerScore,
                                defenseScore: result.defenseScore,
                                isSuccess: result.isSuccess,
                                difference: result.difference,
                            },
                            oudlersCapturedByTaker: result.oudlersCapturedByTaker
                        };
                    } else {
                        const taker = updatedPlayers[prevState.takerId];
                        const oudlersCaptured = taker.capturedCards.filter(gameLogic.isOudler);
                        const pointsRequired = CONTRACT_POINTS_REQUIRED[oudlersCaptured.length];
                        
                        return {
                            ...prevState,
                            players: updatedPlayers,
                            currentTrick: [],
                            currentPlayerId: trickWinnerId,
                            leadPlayerId: trickWinnerId,
                            phase: GamePhase.PLAYING,
                            oudlersCapturedByTaker: oudlersCaptured,
                            contractPoints: pointsRequired,
                        };
                    }
                });
            }, 1500);
        } else if (!gameState.players[gameState.currentPlayerId].isHuman) {
            handleBotTurn();
        }

    }, [gameState, handleBotTurn]);

    const handleGetHint = async () => {
        if (!gameState) return;
        setIsHintLoading(true);
        setHint(null);
        const humanPlayer = gameState.players.find(p => p.isHuman);
        if (humanPlayer) {
            const hintText = await getPlayHint(gameState, humanPlayer.hand);
            setHint(hintText);
        }
        setIsHintLoading(false);
    };

    if (!gameState) {
        return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
    }

    const { players, currentTrick, leadPlayerId } = gameState;
    const human = players.find(p => p.isHuman)!;
    const west = players.find(p => p.id === 1)!;
    const north = players.find(p => p.id === 2)!;
    const east = players.find(p => p.id === 3)!;

    const calculateScore = (player: Player) => player.capturedCards.reduce((acc, card) => acc + card.pointValue, 0).toFixed(1);

    return (
        <main className="bg-green-800 bg-opacity-80 min-h-screen flex flex-col items-center justify-center p-2 relative overflow-hidden">
            <div className="w-full h-full absolute bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-20"></div>
            
            <Scoreboard gameState={gameState} />
            <GameControls 
                onNewGame={setupNewGame}
                onGetHint={handleGetHint}
                hint={hint}
                isHintLoading={isHintLoading}
                isHumanTurn={gameState.currentPlayerId === 0 && gameState.phase === GamePhase.PLAYING}
            />

            <div className="absolute top-8">
                <PlayerHand cards={north.hand} isHuman={false} onCardClick={() => {}} playableCards={[]} position="top" />
                <div className="text-center font-bold mt-2">{north.name} ({north.hand.length}) - Очки: {calculateScore(north)}</div>
            </div>

            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                 <PlayerHand cards={west.hand} isHuman={false} onCardClick={() => {}} playableCards={[]} position="left" />
                 <div className="text-center font-bold mt-2">{west.name} ({west.hand.length}) - Очки: {calculateScore(west)}</div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <PlayerHand cards={east.hand} isHuman={false} onCardClick={() => {}} playableCards={[]} position="right" />
                <div className="text-center font-bold mt-2">{east.name} ({east.hand.length}) - Очки: {calculateScore(east)}</div>
            </div>
            
            <div className="absolute bottom-8">
                <div className="text-center font-bold mb-2">{human.name} ({human.hand.length}) - Очки: {calculateScore(human)}</div>
                <PlayerHand cards={human.hand} isHuman={true} onCardClick={handleCardPlay} playableCards={playableCards} position="bottom" />
            </div>

            <div className="flex items-center justify-center">
                <TrickView trick={currentTrick} leadPlayerId={leadPlayerId} />
            </div>
            
            {gameState.phase === GamePhase.ROUND_OVER && gameState.roundResult && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
                    <div className="bg-gray-800 border border-yellow-500 rounded-xl p-8 text-center shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4">
                            {gameState.roundResult.isSuccess ? '🎉 Победа! 🎉' : '😥 Поражение 😥'}
                        </h2>
                        <p className="text-lg">Вы набрали: <span className="font-bold text-green-400">{gameState.roundResult.takerScore.toFixed(1)}</span></p>
                        <p className="text-lg mb-6">Требовалось: <span className="font-bold">{gameState.contractPoints}</span></p>
                        <button
                            onClick={setupNewGame}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg font-bold text-xl transition-transform transform hover:scale-105"
                        >
                            Играть снова
                        </button>
                    </div>
                 </div>
            )}
        </main>
    );
};

export default App;