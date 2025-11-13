import { timelineSteps, sectionHeadings } from '../../data';

interface TimelineStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: TimelineStep[] = timelineSteps.map(step => ({
  icon: <step.icon className="w-7 h-7" />,
  title: step.title,
  description: step.description
}));

export function HowItWorks() {
  return (
    <div className="w-full max-w-6xl mx-auto px-1.5 md:px-2.5 py-20 md:py-32">
      {/* Title */}
      <h2 
        className="text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-center text-white mb-24 md:mb-32" 
        style={{ 
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', 
          letterSpacing: '4px' 
        }}
      >
        {sectionHeadings.howItWorks.title}
      </h2>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line - Centered */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/20 via-accent to-accent/20"
          style={{ 
            boxShadow: '0 0 30px rgba(87, 241, 214, 0.6)'
          }}
        ></div>

        {/* Steps - Alternating Layout */}
        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div key={index} className="relative">
                {/* Icon Circle - Centered on Line */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-accent text-accent flex-shrink-0"
                  style={{ 
                    background: 'radial-gradient(circle, rgba(12, 12, 13, 1) 0%, rgba(12, 12, 13, 0.95) 70%)',
                    boxShadow: '0 0 40px rgba(87, 241, 214, 0.7), inset 0 0 20px rgba(87, 241, 214, 0.2)'
                  }}
                >
                  {step.icon}
                </div>

                {/* Content Card - Alternating Left/Right */}
                <div className={`flex ${isLeft ? 'justify-start pr-[55%]' : 'justify-end pl-[55%]'}`}>
                  <div 
                    className="w-full pt-6 pb-8 px-8 md:px-10 rounded-[40px] border-2 border-accent/30 relative overflow-hidden"
                    style={{
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.12), hsla(0, 0%, 100%, 0.04))',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    {/* Gradient Overlay at Edges */}
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-[40px]"
                      style={{
                        background: isLeft 
                          ? 'linear-gradient(to right, rgba(87, 241, 214, 0.08) 0%, transparent 30%, transparent 70%, rgba(87, 241, 214, 0.03) 100%)'
                          : 'linear-gradient(to left, rgba(87, 241, 214, 0.08) 0%, transparent 30%, transparent 70%, rgba(87, 241, 214, 0.03) 100%)'
                      }}
                    ></div>

                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
