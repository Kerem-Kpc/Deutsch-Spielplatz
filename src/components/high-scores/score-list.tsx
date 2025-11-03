import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { HighScore, GameType } from "@/lib/types";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const gameTypeLabels: Record<GameType, string> = {
    colors: 'Farben',
    clothes: 'Kleidung',
    numbers: 'Zahlen',
};

const gameTypeVariants: Record<GameType, "default" | "secondary" | "outline" | "destructive" | null | undefined> = {
    colors: 'default',
    clothes: 'secondary',
    numbers: 'outline',
}

export default function ScoreList({ scores }: { scores: HighScore[] }) {
    if (scores.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Noch keine Highscores vorhanden. Spiel ein Spiel, um der Erste zu sein!</p>;
    }

  return (
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Spiel</TableHead>
                <TableHead className="text-right">Punkte</TableHead>
                <TableHead className="text-right hidden md:table-cell">Datum</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {scores.map((score, index) => (
                <TableRow key={score.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{score.name}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={gameTypeVariants[score.gameType]}>{gameTypeLabels[score.gameType]}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">{score.score}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                        {format(new Date(score.createdAt), "dd. MMM yyyy", { locale: de })}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
