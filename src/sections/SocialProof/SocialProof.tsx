import { Users, TrendingUp, Shield, Star } from 'lucide-react';
import { socialProofStats, testimonials, sectionHeadings } from '../../data';

const stats = socialProofStats;

export function SocialProof() {
  return (
    <section className="w-full px-4 space-y-16">
      <div className="text-center">
        <h2 
          className="text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white mb-4"
          style={{ 
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)', 
            letterSpacing: '4px' 
          }}
        >
          {sectionHeadings.trustedByThousands.title}
        </h2>
        <p className="text-xl text-muted-foreground">
          {sectionHeadings.trustedByThousands.description}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl border border-accent/20 p-6 text-center"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.03))',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="absolute top-2 right-2 opacity-10">
                <Icon className="w-12 h-12 md:w-16 md:h-16 text-accent" />
              </div>
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl text-accent mb-1" style={{ textShadow: '0 0 20px rgba(87, 241, 214, 0.5)' }}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-accent/20 p-6 md:p-8"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0.03))',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} fill="#57f1d6" color="#57f1d6" />
              ))}
            </div>
            <p className="text-white text-lg mb-6">{testimonial.text}</p>
            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-accent/30"
              />
              <div>
                <p className="text-white">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
