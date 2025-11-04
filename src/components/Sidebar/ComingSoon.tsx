export function ComingSoon() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>COMING</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>SOON</div>
      </div>
      
      <div className="space-y-4">
        {/* Cover ups */}
        <div 
          className="p-6 rounded-2xl border-2 border-accent/20 text-center"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <p className="text-[24px] font-[Orbitron] mb-2">
            Cover ups
          </p>
          <p className="text-[16px] text-foreground/70">
            Turn your ex's name into a masterpiece
          </p>
        </div>
        
        {/* Extend your art */}
        <div 
          className="p-6 rounded-2xl border-2 border-accent/20 text-center"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <p className="text-[24px] font-[Orbitron] mb-2">
            Extend your art
          </p>
          <p className="text-[16px] text-foreground/70">
            Expand what you've got into something legendary
          </p>
        </div>
        
        {/* His & Her */}
        <div 
          className="p-6 rounded-2xl border-2 border-accent/20 text-center"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <p className="text-[24px] font-[Orbitron] mb-2">
            His & Her
          </p>
          <p className="text-[16px] text-foreground/70">
            Matching ink that bonds you forever
          </p>
        </div>
        
        {/* A Ton of More Cool Shit */}
        <div 
          className="p-6 rounded-2xl border-2 border-accent/20 text-center"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <p className="text-[32px] font-[Orbitron]">
            A Ton of More Cool Shit
          </p>
        </div>
      </div>
    </div>
  );
}
