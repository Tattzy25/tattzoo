interface TattooImageCardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

export function TattooImageCard({ image, title, onClick }: TattooImageCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-[40px] border border-border bg-card/50 backdrop-blur-md hover:border-accent/50 transition-all duration-300 cursor-pointer flex-shrink-0"
      style={{ width: '280px' }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden m-[10px] rounded-[30px]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
      </div>
      
      {/* Title at Bottom */}
      <div className="relative h-20 flex items-center justify-center p-4">
        <h3 
          className="text-center font-[Orbitron] text-white text-[20px]" 
          style={{ 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            letterSpacing: '2px'
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}
