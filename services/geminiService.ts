
import { GoogleGenAI } from "@google/genai";
import { GameState, Card, Suit } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a message to the user or have a fallback.
  // For this context, we assume the key is available.
  console.warn("API-ключ Gemini не найден. Функция подсказок будет отключена.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const cardToString = (card: Card): string => {
  if (card.suit === Suit.Trumps) {
    return card.rank === 'Fool' ? 'Шут (Excuse)' : `Козырь ${card.rank}`;
  }
  return `${card.rank} ${card.suit}`;
};

export const getPlayHint = async (gameState: GameState, playerHand: Card[]): Promise<string> => {
  if (!API_KEY) {
    return "API-ключ не настроен. Подсказка недоступна.";
  }

  const { currentTrick, oudlersCapturedByTaker, contractPoints } = gameState;

  const prompt = `
Ты эксперт по карточной игре Французское Таро. Дай совет игроку.

Правила для справки:
1.  Игрок должен следовать ведущей масти.
2.  Если у игрока нет карт ведущей масти, он должен играть козырем, если он есть.
3.  Если играют козырем, и у игрока есть козыри, он должен сыграть козырем старше самого старшего козыря на столе, если это возможно.
4.  Если игрок не может выполнить ни одно из вышеперечисленных условий, он может сбросить любую карту.
5.  Цель игры - набрать определенное количество очков, зависящее от захваченных "удлеров" (козыри 1, 21 и Шут).

Текущая ситуация в игре:
- **Игрок является Разыгрывающим.**
- **Очки, необходимые для победы:** ${contractPoints}
- **Удлеры, захваченные Разыгрывающим:** ${oudlersCapturedByTaker.length > 0 ? oudlersCapturedByTaker.map(cardToString).join(', ') : 'Нет'}
- **Карты на столе (текущая взятка):** ${currentTrick.length > 0 ? currentTrick.map(c => cardToString(c.card)).join(', ') : 'Еще нет'}
- **Карты в руке игрока:** ${playerHand.map(cardToString).join('; ')}

**Задание:**
Проанализируй карты в руке игрока и текущую взятку. Посоветуй, какую карту лучше всего сыграть, и кратко объясни, почему. Ответ должен быть на русском языке.
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Ошибка при вызове Gemini API:", error);
    return "Не удалось получить подсказку от ИИ. Попробуйте еще раз.";
  }
};
