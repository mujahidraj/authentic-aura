import { useState, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, MessageCircle, Quote } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

// Core Components
import { GlobeHero } from '../components/GlobeHero';
import { BentoGrid } from '../components/BentoGrid';
import { LifeTimeline } from '../components/LifeTimeline';
import { ContactPanel } from '../components/ContactPanel';
import { CustomCursor } from '../components/CustomCursor';
import { SectionWrapper } from '../components/SectionWrapper';
import { MagneticButton } from '../components/MagneticButton';
import { NavBar } from '../components/NavBar';
import { PricingSection } from '../components/PricingSection';
import { PublicationsSection } from '../components/PublicationsSection';
import { Skeleton } from '@/components/ui/skeleton';

// New Components
import ServicesSection from '@/components/ServicesSection';
import CertificatesSection from '@/components/CertificatesSection';
import WhyChooseMe from '@/components/WhyChooseMe'; // Import new section

// Hooks & Data
import { usePortfolioData } from '../hooks/usePortfolioData';
import Footer from '@/components/Footer';

// Lazy Loaded Components
const TechConstellation = lazy(() => import('@/components/TechConstellation'));
const SystemStatus = lazy(() => import('@/components/SystemStatus'));
const GlobalAvailability = lazy(() => import('@/components/GlobalAvailability'));
const TheLibrary = lazy(() => import('@/components/TheLibrary'));
const AudioTestimonials = lazy(() => import('@/components/AudioTestimonials'));
const CommandPalette = lazy(() => import('@/components/CommandPalette'));

const Index = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  
  const { allPortfolioItems, allTags, timeline, pricing, publications } = usePortfolioData();

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Updated Navigation Links
  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Service', href: '#service' },
    { label: 'Why Me', href: '#why-me' }, // New Link
    { label: 'Journey', href: '#journey' },
    { label: 'Publications', href: '#research' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Library', href: '#library' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      <CustomCursor />
      <NavBar onContactOpen={() => setContactOpen(true)} /> 

      <Suspense fallback={null}>
         <CommandPalette />
      </Suspense>

      <GlobeHero onScrollToWork={scrollToWork} />

      <main className="relative z-10 flex flex-col pb-20">
        
        {/* 1. Quote Section */}
        <SectionWrapper className="w-full px-4 md:px-8 max-w-5xl mx-auto py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
             <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-background">
                   <img 
                     src="https://github.com/mujahidraj.png" 
                     alt="Profile" 
                     className="w-full h-full object-cover filter  transition-all duration-500"
                   />
                </div>
             </div>
             <div className="flex-1 text-center md:text-left space-y-6">
                <Quote className="w-12 h-12 text-primary/20 mx-auto md:mx-0" />
                <h3 className="text-2xl md:text-4xl font-display font-medium leading-relaxed">
                   "I am a Full Stack Engineer majored in Information System.  <span className="text-primary italic">I build digital experiences that are both functional and meaningful</span> — blending data, design, and global insights to create solutions that resonate."
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                   <div className="h-[1px] w-12 bg-primary/50 hidden md:block" />
                   <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
                      Mujahid Raj • Full Stack Engineer
                   </p>
                </div>
             </div>
          </div>
        </SectionWrapper>

        {/* 2. Projects */}
        <div ref={workRef} id="work" className="scroll-mt-24 bg-black/20 py-24 border-y border-white/5">
           <SectionWrapper className="px-4 md:px-8 lg:px-16 max-w-8xl mx-auto">
             
             <BentoGrid items={allPortfolioItems} allTags={allTags} />
           </SectionWrapper>
        </div>

        {/* 3. Services */}
        <ServicesSection />

        {/* 4. Why Choose Me (NEW) */}
        <WhyChooseMe />

        {/* 5. Tech Stack */}
        <SectionWrapper className="w-full px-4 md:px-8 max-w-7xl mx-auto py-32">
          <div className="mb-12 text-center">
             <h3 className="text-2xl font-mono uppercase tracking-widest text-muted-foreground">Tech Ecosystem</h3>
          </div>
          <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-3xl bg-white/5" />}>
            <TechConstellation />
          </Suspense>
        </SectionWrapper>

        {/* 6. Journey */}
        <div id="journey" className="scroll-mt-24 bg-gradient-to-b from-transparent to-black/30 py-24">
           <SectionWrapper className="px-4 md:px-8 lg:px-16 max-w-6xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-display font-bold">The Journey</h2>
             </div>
             <LifeTimeline items={timeline} />
           </SectionWrapper>
        </div>

        {/* 7. Research */}
        <div id="research" className="scroll-mt-24 py-24">
            <SectionWrapper className="px-4 md:px-8 lg:px-16 max-w-8xl mx-auto">
               <PublicationsSection publications={publications} />
            </SectionWrapper>
        </div>

        {/* 8. Achievements */}
        <div id="achievements" className="scroll-mt-24">
           <CertificatesSection />
        </div>

        {/* 9. Library */}
        <div id="library" className="scroll-mt-24 py-24">
            <SectionWrapper className="w-full px-4 md:px-8 max-w-8xl mx-auto">
              <Suspense fallback={<div className="h-64 w-full bg-white/5 rounded-xl animate-pulse" />}>
                <TheLibrary />
              </Suspense>
            </SectionWrapper>
        </div>

        {/* 10. Testimonials */}
        <div id="testimonials" className="scroll-mt-24 pb-24">
            <SectionWrapper className="w-full px-4 md:px-8 max-w-8xl mx-auto">
              <Suspense fallback={<div className="h-64 w-full bg-white/5 rounded-xl animate-pulse" />}>
                <AudioTestimonials />
              </Suspense>
            </SectionWrapper>
        </div>

        {/* 11. Global Context */}
        <div className="relative py-32 border-t border-white/5 overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
           <SectionWrapper className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h2 className="text-4xl font-display font-bold">Global Availability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                       Operating from Dhaka, collaborating worldwide. 
                       I work across time zones to deliver exceptional results.
                    </p>
                    <Suspense fallback={null}><SystemStatus /></Suspense>
                 </div>
                 <div className="w-full">
                    <Suspense fallback={<div className="h-96 w-full bg-white/5 rounded-3xl animate-pulse" />}>
                      <GlobalAvailability />
                    </Suspense>
                 </div>
              </div>
           </SectionWrapper>
        </div>

        {/* 12. Pricing */}
        <div id="pricing" className="scroll-mt-24 py-24 bg-black/40">
           <SectionWrapper className="px-4 md:px-8 lg:px-16 max-w-8xl mx-auto">
             <PricingSection pricing={pricing} onContact={() => setContactOpen(true)} />
           </SectionWrapper>
        </div>
      </main>
      {/* 11. FAQ Section (NEW) */}
    <FAQSection />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black backdrop-blur-lg pt-20 pb-10">
      <Footer navLinks={navLinks} onContactOpen={() => setContactOpen(true)} />
      </footer>

      {/* Floating UI Elements */}
      <div className="fixed bottom-8 right-8 z-[50] flex flex-col gap-4 items-end pointer-events-none">
        <AnimatePresence>
          {!contactOpen && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex flex-col gap-3 items-end pointer-events-auto">
              <MagneticButton>
                <button onClick={() => setContactOpen(true)} className="group flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-sm font-medium bg-primary text-black shadow-2xl hover:scale-105 transition-all">
                  <MessageCircle size={16} className="group-hover:animate-bounce" /> Let's Talk
                </button>
              </MagneticButton>
              <MagneticButton>
                <a href="/resume.pdf" download className="flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-sm font-medium bg-background/80 backdrop-blur-md border border-white/10 text-foreground hover:bg-white/10 transition-all shadow-xl">
                  <Download size={16} /> Download CV
                </a>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContactPanel isOpen={contactOpen} onClose={() => setContactOpen(false)} pricing={pricing} />
    </div>
  );
};

export default Index;