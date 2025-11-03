"use server";

import { revalidatePath } from 'next/cache';
import type { GameType, HighScore } from './types';

// This is a mock database. In a real app, you would use Firebase, Supabase, etc.
let mockScores: HighScore[] = [
    { id: '1', name: 'Alex', score: 80, gameType: 'numbers', createdAt: new Date('2024-07-20T10:00:00Z') },
    { id: '2', name: 'Maria', score: 90, gameType: 'colors', createdAt: new Date('2024-07-21T11:30:00Z') },
    { id: '3', name: 'Chris', score: 70, gameType: 'clothes', createdAt: new Date('2024-07-22T09:45:00Z') },
    { id: '4', name: 'Julia', score: 100, gameType: 'numbers', createdAt: new Date('2024-07-22T14:00:00Z') },
];

export async function getHighScores(): Promise<HighScore[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockScores.sort((a, b) => b.score - a.score);
}

export async function saveScore(data: { name: string; score: number; gameType: GameType }) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newScore: HighScore = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
  };

  mockScores.push(newScore);

  if (mockScores.length > 20) {
      mockScores = mockScores.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  revalidatePath('/high-scores');

  return { success: true, score: newScore };
}
