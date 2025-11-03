import { notFound } from 'next/navigation';
import { getGameData, gameInfos } from '@/lib/game-data';
import type { GameType } from '@/lib/types';
import GameClient from '@/components/game/game-client';

const validGameTypes: GameType[] = ['colors', 'clothes', 'numbers'];

export default function GamePage({ params }: { params: { gameType: string } }) {
  const { gameType } = params;

  if (!validGameTypes.includes(gameType as GameType)) {
    notFound();
  }

  const typedGameType = gameType as GameType;
  const questions = getGameData(typedGameType);
  const gameInfo = gameInfos[typedGameType];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <GameClient
        initialQuestions={questions}
        gameType={typedGameType}
        gameInfo={gameInfo}
      />
    </div>
  );
}

export function generateStaticParams() {
  return validGameTypes.map((gameType) => ({
    gameType,
  }));
}
