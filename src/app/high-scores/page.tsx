import { getHighScores } from '@/lib/actions';
import ScoreList from '@/components/high-scores/score-list';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HighScoresPage() {
  const highScores = await getHighScores();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-lg bg-card">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4">
                <Trophy className="w-10 h-10 text-primary"/>
                <CardTitle className="text-4xl font-headline">Bestenliste</CardTitle>
                <Trophy className="w-10 h-10 text-primary"/>
            </div>
        </CardHeader>
        <CardContent>
          <ScoreList scores={highScores} />
        </CardContent>
      </Card>
    </div>
  );
}
