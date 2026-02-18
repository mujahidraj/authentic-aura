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
import { usePortfolioData } from '../hooks/usePortfolioData';

const Index = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const { allPortfolioItems, allTags, timeline, pricing } = usePortfolioData();

  const scrollToWork = () => {
    workRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CustomCursor />

      {/* Hero */}
      <GlobeHero onScrollToWork={scrollToWork} />

      {/* Works Grid */}
      <div ref={workRef} id="work">
        <SectionWrapper className="px-6 md:px-12 lg:px-20 py-24">
          <BentoGrid items={allPortfolioItems} allTags={allTags} />
        </SectionWrapper>
      </div>

      {/* Life Timeline */}
      <div style={{ borderTop: '1px solid hsl(var(--border))' }}>
        <SectionWrapper id="journey" className="px-6 md:px-12 lg:px-20 py-24">
          <LifeTimeline items={timeline} />
        </SectionWrapper>
      </div>

      {/* Footer */}
      <footer
        className="px-6 md:px-12 lg:px-20 py-16"
        style={{ borderTop: '1px solid hsl(var(--border))' }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-bold text-foreground mb-1">Your Name</p>
            <p className="font-mono text-xs text-muted-foreground">
              Dhaka, Bangladesh · Available for select projects
            </p>
          </div>
          <nav className="flex items-center gap-8">
            {['Work', 'Journey', 'Contact'].map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} — Built with intention.
          </p>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-3 items-end">
        <AnimatePresence>
          {!contactOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col gap-3 items-end"
            >
              <MagneticButton>
                <button
                  onClick={() => setContactOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium shadow-2xl glow-primary"
                  style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  }}
                >
                  <MessageCircle size={16} />
                  Let's Talk
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={() => alert('PDF generation will be wired up with @react-pdf/renderer')}
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-mono text-sm font-medium glass border transition-all duration-200"
                  style={{
                    color: 'hsl(var(--foreground))',
                    borderColor: 'hsl(var(--border))',
                  }}
                >
                  <Download size={16} />
                  Download CV
                </button>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Panel */}
      <ContactPanel
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        pricing={pricing}
      />
    </div>
  );
};

export default Index;
