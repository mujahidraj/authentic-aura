import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Research', href: '#research' },
  { label: 'Journey', href: '#journey' },
  { label: 'Pricing', href: '#pricing' },
];

interface NavBarProps {
  onContactOpen: () => void;
}

export function NavBar({ onContactOpen }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['work', 'research', 'journey', 'pricing'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
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
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500"
      style={{
        background: scrolled ? 'hsl(var(--background) / 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(var(--border) / 0.5)' : 'none',
      }}
    >
      {/* Logo */}
      <a href="#" className="font-display text-lg font-bold text-foreground tracking-tight">
        YN<span style={{ color: 'hsl(var(--primary))' }}>.</span>
      </a>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(link => {
          const sectionId = link.href.replace('#', '');
          const isActive = activeSection === sectionId;
          return (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest transition-colors duration-200 relative"
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
    </motion.header>
  );
}
