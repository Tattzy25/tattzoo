import heroBackground from 'figma:asset/f1e905eeec2209fc44a6e8116683d1e15b57433e.png';

interface HeroProps {
  // Props will be added as we extract the hero content
}

export function Hero({}: HeroProps) {
  return (
    <section 
      className="relative min-h-[calc(90vh+55px)] flex items-center justify-center overflow-hidden rounded-b-[100px] border-b-4" 
      style={{ 
        borderColor: '#57f1d6', 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)' 
      }}
    >
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="TaTTTy Generator" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.08),transparent_50%)] bg-[rgba(0,0,0,0.61)]"></div>
      
      <div className="relative z-10 w-full flex items-center justify-center min-h-[50vh] px-4">
        {/* Hero content - will be populated */}
      </div>
    </section>
  );
}
