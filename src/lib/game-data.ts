import type { GameQuestion, GameType } from './types';
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

const colors: GameQuestion[] = [
    { question: '#FF0000', answer: 'rot' },
    { question: '#0000FF', answer: 'blau' },
    { question: '#008000', answer: 'grün' },
    { question: '#FFFF00', answer: 'gelb' },
    { question: '#FFA500', answer: 'orange' },
    { question: '#FFC0CB', answer: 'rosa' },
    { question: '#C8A2C8', answer: 'lila' },
    { question: '#8A2BE2', answer: 'violett' },
    { question: '#FFFFFF', answer: ['weiss', 'weiß'] },
    { question: '#000000', answer: 'schwarz' },
    { question: '#808080', answer: 'grau' },
    { question: '#A52A2A', answer: 'braun' },
];

const clothesMap: Record<string, string[]> = {
  'kleidung-hose': ['hose'],
  'kleidung-bluse': ['bluse'],
  'kleidung-t-shirt': ['t-shirt'],
  'kleidung-pullover': ['pullover'],
  'kleidung-anorak': ['anorak'],
  'kleidung-muetze': ['mütze'],
  'kleidung-schal': ['schal'],
  'kleidung-handschuhe': ['handschuhe'],
  'kleidung-jeans': ['jeans'],
  'kleidung-jeansjacke': ['jeansjacke'],
  'kleidung-kappe': ['kappe'],
  'kleidung-socken': ['socken'],
  'kleidung-schuhe': ['schuhe'],
  'kleidung-hemd': ['hemd'],
  'kleidung-guertel': ['gürtel'],
  'kleidung-kopftuch': ['kopftuch'],
};

const clothes: GameQuestion[] = PlaceHolderImages
  .filter(img => img.id.startsWith('kleidung-'))
  .map((img: ImagePlaceholder) => ({
    question: img.imageUrl,
    answer: clothesMap[img.id] || [],
    hint: img.imageHint,
    id: img.id,
    description: img.description,
  }));

const numberWords: { [key: number]: string } = {
    0: 'null', 1: 'eins', 2: 'zwei', 3: 'drei', 4: 'vier', 5: 'fünf',
    6: 'sechs', 7: 'sieben', 8: 'acht', 9: 'neun', 10: 'zehn',
    11: 'elf', 12: 'zwölf', 13: 'dreizehn', 14: 'vierzehn', 15: 'fünfzehn',
    16: 'sechzehn', 17: 'siebzehn', 18: 'achtzehn', 19: 'neunzehn', 20: 'zwanzig',
    30: 'dreißig', 40: 'vierzig', 50: 'fünfzig', 60: 'sechzig', 70: 'siebzig',
    80: 'achtzig', 90: 'neunzig', 100: 'hundert'
};

function numberToGermanWord(n: number): string {
    if (n in numberWords) return numberWords[n];
    if (n > 20 && n < 100) {
        const unit = n % 10;
        const ten = n - unit;
        if (unit === 0) return numberWords[ten];
        const unitWord = (unit === 1) ? 'ein' : numberWords[unit];
        return `${unitWord}und${numberWords[ten]}`;
    }
    return n.toString();
}

function generateNumberQuestions(count: number): GameQuestion[] {
  const questions: GameQuestion[] = [];
  const usedNumbers = new Set<number>();
  while (questions.length < count) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      questions.push({
        question: num.toString(),
        answer: numberToGermanWord(num),
      });
    }
  }
  return questions;
}

function shuffleAndTake<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getGameData(gameType: GameType): GameQuestion[] {
  const GAME_LENGTH = 10;
  switch (gameType) {
    case 'colors':
      return shuffleAndTake(colors, colors.length);
    case 'clothes':
      return shuffleAndTake(clothes, clothes.length > GAME_LENGTH ? GAME_LENGTH : clothes.length);
    case 'numbers':
      return generateNumberQuestions(GAME_LENGTH);
    default:
      return [];
  }
}

export const gameInfos = {
    colors: { title: "Farben Spiel", instruction: "Schreibe den deutschen Namen für die angezeigte Farbe." },
    clothes: { title: "Kleidung Spiel", instruction: "Schreibe den deutschen Namen für das Kleidungsstück." },
    numbers: { title: "Zahlen Spiel", instruction: "Schreibe die angezeigte Zahl als deutsches Wort." }
}
