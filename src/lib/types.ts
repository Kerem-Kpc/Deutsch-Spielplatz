import { z } from 'zod';

export type GameType = 'colors' | 'clothes' | 'numbers';

export type GameQuestion = {
  question: string;
  answer: string | string[];
  hint?: string;
  id?: string;
  description?: string;
};

export type HighScore = {
  id: string;
  name: string;
  score: number;
  gameType: GameType;
  createdAt: Date;
};

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const GermanTutorRequestSchema = z.object({
  history: z.array(ChatMessageSchema),
});

export type GermanTutorRequest = z.infer<typeof GermanTutorRequestSchema>;
