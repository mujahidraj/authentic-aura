import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, MessageCircle } from 'lucide-react';
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
import { usePortfolioData } from '../hooks/usePortfolioData';

const Index = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const { allPortfolioItems, allTags, timeline, pricing, publications } = usePortfolioData();

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const divider = (
    <div
      aria-hidden
      className="w-full"
      style={{ height: '1px', background: 'linear-gradient(to right, transparent, hsl(var(--border)), transparent)' }}
    />
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CustomCursor />
      <NavBar onContactOpen={() => setContactOpen(true)} />

      {/* ── Hero ── */}
      <GlobeHero onScrollToWork={scrollToWork} />

      {/* ── Works Grid ── */}
      <div ref={workRef} id="work">
        {divider}
        <SectionWrapper className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <BentoGrid items={allPortfolioItems} allTags={allTags} />
        </SectionWrapper>
      </div>

      {/* ── Publications ── */}
      <div id="research">
        {divider}
        <SectionWrapper className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <PublicationsSection publications={publications} />
        </SectionWrapper>
      </div>

      {/* ── Life Timeline ── */}
      <div id="journey">
        {divider}
        <SectionWrapper className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <LifeTimeline items={timeline} />
        </SectionWrapper>
      </div>

      {/* ── Pricing ── */}
      <div id="pricing">
        {divider}
        <SectionWrapper className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
          <PricingSection pricing={pricing} onContact={() => setContactOpen(true)} />
        </SectionWrapper>
      </div>

      {/* ── Footer ── */}
      {divider}
      <footer className="px-6 md:px-12 lg:px-20 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display text-3xl font-bold text-foreground mb-1">
              Your Name<span style={{ color: 'hsl(var(--primary))' }}>.</span>
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Dhaka, Bangladesh · Available for select projects
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 md:gap-10">
            {[
              { label: 'Work', href: '#work' },
              { label: 'Research', href: '#research' },
              { label: 'Journey', href: '#journey' },
              { label: 'Pricing', href: '#pricing' },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 uppercase tracking-widest"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-start md:items-end gap-2">
            <MagneticButton>
              <button
                onClick={() => setContactOpen(true)}
                className="flex items-center gap-2 font-mono text-xs px-5 py-2.5 rounded-full glow-primary"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                <MessageCircle size={12} />
                Let's Work Together
              </button>
            </MagneticButton>
            <p className="font-mono text-xs text-muted-foreground">
              © {new Date().getFullYear()} — Built with intention.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Floating Actions ── */}
      <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-3 items-end">
        <AnimatePresence>
          {!contactOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="flex flex-col gap-3 items-end"
            >
              <MagneticButton>
                <button
                  onClick={() => setContactOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium shadow-2xl glow-primary"
                  style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                >
                  <MessageCircle size={15} />
                  Let's Talk
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium glass border transition-all duration-200"
                  style={{ color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }}
                >
                  <Download size={15} />
                  Download CV
                </button>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Contact Panel ── */}
      <ContactPanel
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        pricing={pricing}
      />
    </div>
  );
};

export default Index;
