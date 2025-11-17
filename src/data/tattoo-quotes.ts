export interface TattooQuoteDisplay {
  id: 'question_one' | 'question_two';
  blocks: Array<{ text: string; size: number; align?: 'left' | 'center' | 'right' }>;
  fontFamily: string;
  colorClass: string;
  textShadow: string;
}

export const tattooQuotes: Record<'question_one' | 'question_two', TattooQuoteDisplay> = {
  question_one: {
    id: 'question_one',
    blocks: [
      { text: "This Is Not Just A Tattoo, Its A Fucking Statement", size: 36, align: 'center' },
    ],
    fontFamily: 'Rock Salt',
    colorClass: 'text-accent',
    textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
  },
  question_two: {
    id: 'question_two',
    blocks: [
      { text: 'Your', size: 48, align: 'center' },
      { text: 'Life , Journer , Power , Pain', size: 36, align: 'center' },
    ],
    fontFamily: 'Rock Salt',
    colorClass: 'text-accent',
    textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
  }
};