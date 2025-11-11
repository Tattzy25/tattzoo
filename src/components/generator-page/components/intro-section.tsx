import React from 'react';
import { StyledPhrase } from '../../shared/StyledPhrase';
import { HOME_PAGE_STATS } from '../constants';

const IntroSection: React.FC = () => {
  return (
    <div>
      <div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 lg:gap-12 items-center justify-items-center justify-center">
          <StyledPhrase line1="Your" line2="Story" />
          <StyledPhrase line1="Your" line2="Pain" />
          <StyledPhrase line1="Into" line2="Ink" />
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 px-2 sm:px-4">
          {HOME_PAGE_STATS.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-12">
              {index > 0 && <div className="h-8 md:h-10 lg:h-12 w-px bg-border"></div>}
              <div className="text-center">
                <div className="font-[Orbitron] text-accent mb-1 text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px]">{stat.value}</div>
                <div className="text-muted-foreground text-[16px] sm:text-[20px] md:text-[28px] lg:text-[36px]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSection;