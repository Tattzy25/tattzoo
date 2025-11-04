import { ReactNode } from 'react';

interface FrostCardProps {
  image: string;
  source?: string;
  timeAgo?: string;
  title: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export function FrostCard({
  image,
  source,
  timeAgo,
  title,
  description,
  onClick,
  className = '',
}: FrostCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[3rem] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[400px] ${className}`}
    >
      {/* Content Container - smaller, positioned on top */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pt-6 pb-0">
        <div className="rounded-[70px] px-5 pt-5 pb-[50px] bg-black/30">
          {/* Image on top of frost */}
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-[2.5rem] mb-4"
          />
          
          {/* Title */}
          <h3 className="text-white mb-2 line-clamp-2 text-[20px] text-center px-[10px] py-[0px] font-[Rock_Salt]">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-white/70 line-clamp-2 text-[16px] font-[Philosopher] no-underline text-[rgba(102,232,199,0.7)] px-[20px] py-[0px]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface FrostCardGridProps {
  children: ReactNode;
}

export function FrostCardGrid({ children }: FrostCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
