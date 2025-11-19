import { HeroSection, ImageGallery } from './generator-page/components'
import { Section2 } from '../sections/section2'
import { Timeline } from './ui/timeline'
import { SocialProof } from '../sections/SocialProof/SocialProof'
import { Pricing } from '../sections/Pricing/Pricing'
import { Footer } from './Footer'
import { Button } from './ui/button'
import styles from './GeneratorPage.module.css'
import { galleryDesigns, sectionHeadings, timelineSteps } from '../data'

interface LandingPageProps {
  onGoToGenerator: () => void
}

export function LandingPage({ onGoToGenerator }: LandingPageProps) {
  const allGalleryDesigns = galleryDesigns

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <Section2 />

      <div className="w-full bg-background">
        <div className="w-full space-y-8 md:space-y-10 pb-12 px-1.5 md:px-2.5">
          <ImageGallery
            galleryDesigns={allGalleryDesigns}
            onViewAll={() => {}}
          />

          <div className="mt-[70px] md:mt-[90px] space-y-6">
            <div className="flex justify-center">
              <h2 className={"text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[Akronim] text-white text-center uppercase mb-8 sm:mb-10 md:mb-12 lg:mb-16 tracking-[4px] px-2 " + styles.titleShadow}>
                Started from the Bottom
              </h2>
            </div>
            <Timeline
              data={timelineSteps.map((step) => ({
                title: step.title,
                content: (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="flex items-start gap-3">
                      <step.icon className="w-6 h-6 text-accent mt-1" />
                      <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>

          <div className="mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
            <SocialProof />
          </div>

          <div className="mt-[130px] sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
            <Pricing />
          </div>

          <div className="flex justify-center mt-12">
            <Button onClick={onGoToGenerator} className="h-14 px-8 font-[Orbitron] text-[20px] brand-gradient text-background shadow-lg shadow-accent/25">
              Start Generating
            </Button>
          </div>

          <div className="hidden lg:block mt-20 sm:mt-[100px] md:mt-[140px] lg:mt-[180px]">
            <div className={`relative overflow-hidden rounded-t-[40px] border-t-4 ${styles.footerTopShadow}`}>
              <Footer onNavigate={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:hidden w-full ${styles.mobileFooterWrapper}`}>
        <div className={`relative overflow-hidden rounded-t-4xl sm:rounded-t-[40px] border-t-4 w-full ${styles.footerTopShadow}`}>
          <Footer onNavigate={() => {}} />
        </div>
      </div>
    </div>
  )
}