"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Heart, SkipForward, TimerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameOverDialog from './game-over-dialog';
import type { GameQuestion, GameType } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const INITIAL_LIVES = 3;
const INITIAL_PASSES = 3;
const TIME_PER_QUESTION = 15;
const POINTS_PER_CORRECT_ANSWER = 10;

interface GameClientProps {
  initialQuestions: GameQuestion[];
  gameType: GameType;
  gameInfo: { title: string; instruction: string; };
}

export default function GameClient({ initialQuestions, gameType, gameInfo }: GameClientProps) {
  const [questions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [userInput, setUserInput] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'idle'>('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const isComponentMounted = useRef(true);

  const currentQuestion = questions[currentQuestionIndex];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (!isComponentMounted.current) return;

    stopTimer();
    setFeedback('idle');
    setUserInput('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
    }
  }, [currentQuestionIndex, questions.length, stopTimer]);
  
  const startTimer = useCallback(() => {
    stopTimer(); 
    setTimeLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      stopTimer();
    };
  }, [stopTimer]);

  useEffect(() => {
    if (feedback === 'idle' && !isGameOver) {
      startTimer();
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [currentQuestionIndex, feedback, isGameOver, startTimer]);
  
  useEffect(() => {
    if (timeLeft <= 0 && feedback === 'idle' && !isGameOver) {
      setFeedback('incorrect');
      setLives(prev => prev - 1);
      toast({
        title: "Zeit abgelaufen!",
        description: `Die richtige Antwort war: ${Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer}`,
        variant: "destructive",
      });
      
      const timeoutId = setTimeout(() => {
        if (isComponentMounted.current) {
          handleNextQuestion();
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [timeLeft, feedback, isGameOver, handleNextQuestion, currentQuestion.answer, toast]);

  useEffect(() => {
    if (lives <= 0) {
      setIsGameOver(true);
    }
  }, [lives]);
  
  useEffect(() => {
    if (isGameOver) {
      stopTimer();
    }
  }, [isGameOver, stopTimer]);

  const checkAnswer = (answer: string) => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer.map(a => a.toLowerCase())
      : [currentQuestion.answer.toLowerCase()];
    return correctAnswers.includes(normalizedAnswer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== 'idle' || !userInput.trim()) return;
    
    stopTimer();

    if (checkAnswer(userInput)) {
      setFeedback('correct');
      const pointsWon = POINTS_PER_CORRECT_ANSWER;
      setScore(prev => prev + pointsWon);
       toast({
        title: "Richtig!",
        description: `+${pointsWon} Punkte`,
        className: 'bg-accent text-accent-foreground border-accent'
      });
    } else {
      setFeedback('incorrect');
      setLives(prev => prev - 1);
      toast({
        title: "Falsch!",
        description: `Die richtige Antwort war: ${Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer}`,
        variant: "destructive",
      });
    }

    const timeoutId = setTimeout(() => {
      if(isComponentMounted.current) {
        handleNextQuestion();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  };

  const handlePass = () => {
    if (passes > 0 && feedback === 'idle') {
      stopTimer();
      setPasses(prev => prev - 1);
      handleNextQuestion();
    }
  };

  if (isGameOver) {
    return <GameOverDialog score={score} gameType={gameType} />;
  }

  if (!currentQuestion) {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-3 h-3 bg-primary rounded-full animate-pulse delay-0"></span>
                <span className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></span>
                <span className="w-3 h-3 bg-primary rounded-full animate-pulse delay-300"></span>
                <span className="ml-2">Spiel wird geladen...</span>
            </div>
        </div>
    );
  }

  const feedbackClasses = {
    correct: 'ring-2 ring-green-500 border-green-500',
    incorrect: 'ring-2 ring-red-500 border-red-500',
    idle: 'focus-visible:ring-ring',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl font-headline">{gameInfo.title}</CardTitle>
        <div className="flex justify-between items-center text-sm md:text-lg pt-4">
          <div className="flex items-center gap-2" title="Punkte">
             <span className="font-bold text-primary">{score}</span>Punkte
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1" title="Leben">
              <span className="font-bold text-base">{lives}</span>
              <Heart className="text-red-500 fill-current w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center gap-1" title="Pässe">
                <span className="font-bold text-base">{passes}</span>
                <SkipForward className="text-gray-500 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
        <div className="relative pt-2">
            <Progress value={(timeLeft / TIME_PER_QUESTION) * 100} className="h-2 md:h-3" />
            <TimerIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/80" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="text-center mb-4 md:mb-6">
          <p className="text-muted-foreground text-sm md:text-base">{gameInfo.instruction}</p>
        </div>
        
        <div className="flex-grow flex items-center justify-center min-h-[180px] md:min-h-[250px] bg-muted/50 rounded-lg p-4 mb-4 md:mb-6">
            {gameType === 'colors' && (
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-lg border-4 border-card" style={{ backgroundColor: currentQuestion.question }}></div>
            )}
            {gameType === 'clothes' && (
                <Image
                priority
                src={currentQuestion.question}
                alt={currentQuestion.description || 'Kleidungsstück'}
                data-ai-hint={currentQuestion.hint}
                width={250}
                height={250}
                className="object-contain rounded-lg h-40 w-40 md:h-64 md:w-64"
                />
            )}
            {gameType === 'numbers' && (
                <div className="text-6xl md:text-8xl font-bold text-primary">{currentQuestion.question}</div>
            )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 mt-auto">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Deine Antwort..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`text-center text-base md:text-lg h-11 md:h-12 transition-all ${feedbackClasses[feedback]}`}
              disabled={feedback !== 'idle'}
              autoComplete="off"
              aria-label="Antwort eingeben"
            />
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Button type="submit" size="lg" className="h-11" disabled={!userInput.trim() || feedback !== 'idle'}>
                    Bestätigen
                </Button>
                <Button type="button" size="lg" variant="outline" className="h-11" onClick={handlePass} disabled={passes <= 0 || feedback !== 'idle'}>
                    Passen ({passes})
                </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
