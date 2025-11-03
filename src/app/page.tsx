import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush, Shirt, Hash } from 'lucide-react';

const games = [
  {
    name: 'Farben',
    description: 'Errate die Farbe auf Deutsch!',
    href: '/game/colors',
    icon: <Paintbrush className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Kleidung',
    description: 'Was ist das auf Deutsch?',
    href: '/game/clothes',
    icon: <Shirt className="w-12 h-12 text-primary" />,
  },
  {
    name: 'Zahlen',
    description: 'Erkenne die Zahl auf Deutsch!',
    href: '/game/numbers',
    icon: <Hash className="w-12 h-12 text-primary" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">Willkommen!</h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Wähle ein Spiel und beginne deine Reise, um die deutsche Sprache auf spielerische Weise zu meistern.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
        {games.map((game) => (
          <Card key={game.name} className="flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl bg-card">
            <CardHeader className="flex flex-col items-center text-center">
              {game.icon}
              <CardTitle className="mt-4 text-2xl font-headline">{game.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center flex-grow">
              <p className="text-muted-foreground mb-6">{game.description}</p>
              <Button asChild className="w-full mt-auto">
                <Link href={game.href}>Spielen</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
