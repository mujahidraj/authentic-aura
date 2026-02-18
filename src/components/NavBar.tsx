import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

const NAV_LINKS = [
  { label: 'Home', href: '#home' }, // Added Home
  { label: 'Work', href: '#work' },
  { label: 'Service', href: '#service' },
  { label: 'Journey', href: '#journey' },
  { label: 'Publications', href: '#research' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Library', href: '#library' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },


];

interface NavBarProps {
  onContactOpen: () => void;
}

export function NavBar({ onContactOpen }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // 1. Get all section IDs from our links
    const sectionIds = NAV_LINKS.map(link => link.href.replace('#', ''));

    // 2. Create an observer that triggers when a section crosses the MIDDLE of the screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // This margin creates a "line" in the middle of the screen (45% from top, 45% from bottom)
        // The observer triggers only when an element crosses this center zone.
        rootMargin: '-45% 0px -45% 0px', 
        threshold: 0 
      }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500"
      style={{
        background: scrolled ? 'hsl(var(--background) / 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(var(--border) / 0.5)' : 'none',
      }}
    >
      {/* Logo */}
      <a href="#home" className="font-display text-lg font-bold text-foreground tracking-tight shrink-0">
        <span style={{ color: 'hsl(var(--primary))' }}><img src="https://i.postimg.cc/d0LwTwVh/Raj_1.png" className='border-2 border-primary w-10 rounded-full' alt="" /></span>
      </a>

      {/* Nav links (Hidden on mobile, visible on XL screens) */}
      <nav className="hidden xl:flex items-center gap-6">
        {NAV_LINKS.map(link => {
          const sectionId = link.href.replace('#', '');
          const isActive = activeSection === sectionId;
          return (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-widest transition-colors duration-200 relative px-1 py-1"
              style={{ color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
            >
              {link.label}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'hsl(var(--primary))' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="shrink-0">
        <MagneticButton>
          <button
            onClick={onContactOpen}
            className="px-5 py-2 rounded-full font-mono text-xs font-medium border transition-all duration-200"
            style={{
              borderColor: scrolled ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
              color: scrolled ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            }}
          >
            Contact →
          </button>
        </MagneticButton>
      </div>
    </motion.header>
  );
}