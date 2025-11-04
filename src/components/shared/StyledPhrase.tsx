interface StyledPhraseProps {
  line1: string;
  line2: string;
}

export function StyledPhrase({ line1, line2 }: StyledPhraseProps) {
  return (
    <div className="flex flex-col leading-none gap-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[Rock_Salt]" style={{ 
      color: '#57f1d6',
      textShadow: '0px 4px 8px rgba(0, 0, 0, 0.9), 0px 8px 16px rgba(0, 0, 0, 0.7), 0px 12px 24px rgba(0, 0, 0, 0.5)'
    }}>
      <span>{line1}</span>
      <span>{line2}</span>
    </div>
  );
}
