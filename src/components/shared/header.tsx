import Link from 'next/link';
import { BookOpenCheck, Medal, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <BookOpenCheck className="w-7 h-7 md:w-8 md:h-8" />
          <span className="text-lg md:text-xl font-bold font-headline">Deutsch Spielplatz</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/chat" aria-label="Chat">
              <MessageCircle className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Chat</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/high-scores" aria-label="Bestenliste">
              <Medal className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Bestenliste</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
