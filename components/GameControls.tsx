import React, { useState } from 'react';

interface GameControlsProps {
    onNewGame: () => void;
    onGetHint: () => void;
    hint: string | null;
    isHintLoading: boolean;
    isHumanTurn: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame, onGetHint, hint, isHintLoading, isHumanTurn }) => {
    const [isHintVisible, setIsHintVisible] = useState(false);

    const handleGetHint = () => {
        onGetHint();
        setIsHintVisible(true);
    };

    return (
        <>
            <div className="absolute top-4 right-4 flex flex-col items-end gap-3 z-10">
                <button
                    onClick={onNewGame}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg font-bold transition-transform transform hover:scale-105"
                >
                    Новая игра
                </button>
                {isHumanTurn && (
                    <button
                        onClick={handleGetHint}
                        disabled={isHintLoading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md shadow-lg font-bold transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isHintLoading ? 'Думаю...' : '💡 Подсказка'}
                    </button>
                )}
            </div>

            {isHintVisible && hint && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setIsHintVisible(false)}
                >
                    <div 
                        className="bg-gray-800 border border-purple-500 rounded-xl p-6 m-4 max-w-lg w-full shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-purple-300 mb-4">Подсказка от ИИ</h3>
                        <p className="text-gray-200 whitespace-pre-wrap">{hint}</p>
                        <button
                            onClick={() => setIsHintVisible(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        >
                            &#x2715;
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameControls;