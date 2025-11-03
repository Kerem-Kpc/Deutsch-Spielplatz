"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveScore } from '@/lib/actions';
import type { GameType } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface GameOverDialogProps {
  score: number;
  gameType: GameType;
}

export default function GameOverDialog({ score, gameType }: GameOverDialogProps) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveScore = async () => {
    if (!name.trim()) {
      toast({ title: "Bitte gib deinen Namen ein.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await saveScore({ name, score, gameType });
      toast({ title: "Punktzahl gespeichert!", description: "Überprüfe die Bestenliste.", className: 'bg-accent text-accent-foreground border-accent' });
      router.push('/high-scores');
    } catch (error) {
      toast({ title: "Fehler beim Speichern", description: "Bitte versuche es erneut.", variant: "destructive" });
      setIsSaving(false);
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl md:text-3xl text-center">Spiel Vorbei!</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg md:text-xl">
            Dein Endergebnis: <span className="font-bold text-primary">{score}</span> Punkte
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {score > 0 && (
          <div className="space-y-4 py-4">
              <p className="text-sm text-center text-muted-foreground">Speichere deine Punktzahl in der Bestenliste!</p>
              <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                  <Label htmlFor="name" className='text-left'>Dein Name</Label>
                  <Input 
                      id="name" 
                      type="text" 
                      placeholder="Spieler" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSaving}
                  />
              </div>
              <Button onClick={handleSaveScore} disabled={isSaving || !name} className="w-full max-w-sm mx-auto flex">
                  {isSaving ? "Speichern..." : "Punktzahl Speichern"}
              </Button>
          </div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row sm:justify-center pt-4 gap-2">
              <Button variant="outline" onClick={() => router.push('/')}>Startseite</Button>
              <Button onClick={handlePlayAgain}>Nochmal Spielen</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
