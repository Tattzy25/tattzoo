import React from 'react';
import { HERO_BACKGROUND } from '../constants';
import styles from '../../GeneratorPage.module.css';

const HeroSection: React.FC = () => {
  return (
    <section
      className={
        "relative min-h-[60vh] md:min-h-[75vh] lg:min-h-[calc(90vh+55px)] flex items-center justify-center overflow-hidden rounded-b-[40px] md:rounded-b-[70px] lg:rounded-b-[100px] border-b-4 " +
        styles.heroBorderShadow
      }
    >
      <div className="absolute inset-0">
        <img
          src={HERO_BACKGROUND}
          alt="TaTTTy Generator"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.08),transparent_50%)] bg-[rgba(0,0,0,0.61)]"></div>

      <div className="relative z-10 w-full flex items-center justify-center min-h-[50vh] px-4">
        {/* Hero content */}
      </div>
    </section>
  );
};

export default HeroSection;