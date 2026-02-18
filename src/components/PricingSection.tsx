import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionWrapper';
import type { PricingData } from '../hooks/usePortfolioData';

interface PricingSectionProps {
  pricing: PricingData;
  onContact: () => void;
}

const categoryAccents: Record<string, string> = {
  'Machine Learning & AI': 'hsl(var(--accent))',
  'Full-Stack Development': 'hsl(var(--primary))',
  'Data Engineering & Analytics': 'hsl(185 70% 60%)',
  'WordPress & CMS': 'hsl(220 70% 65%)',
  'Strategy & Consulting': 'hsl(38 80% 75%)',
};

export function PricingSection({ pricing, onContact }: PricingSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader
        label="// Pricing"
        title={pricing.headline}
        subtitle={pricing.note}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pricing.categories.map((cat, idx) => {
          const accent = categoryAccents[cat.type] ?? 'hsl(var(--primary))';
          const isHovered = hoveredId === cat.id;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300"
              style={{
                background: 'hsl(var(--card))',
                border: `1px solid ${isHovered ? accent + '55' : 'hsl(var(--border))'}`,
                boxShadow: isHovered ? `0 20px 60px ${accent}18` : 'none',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1 w-full transition-all duration-500"
                style={{ background: isHovered ? accent : 'transparent' }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-5">
                  <span
                    className="font-mono text-xs uppercase tracking-widest mb-3 block"
                    style={{ color: accent }}
                  >
                    {cat.type}
                  </span>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span
                      className="font-display text-4xl font-black leading-none"
                      style={{ color: accent }}
                    >
                      ${cat.rateHourly}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">/hr</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{cat.rateProject}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* Timeline */}
                <div
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-5 text-sm font-mono"
                  style={{ background: 'hsl(var(--muted))' }}
                >
                  <Clock size={13} style={{ color: accent }} />
                  <span className="text-muted-foreground text-xs">Timeline:</span>
                  <span className="text-foreground text-xs font-medium">{cat.timeline}</span>
                </div>

                {/* Deliverables */}
                <div className="mb-6 flex-1">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Deliverables
                  </p>
                  <ul className="space-y-2">
                    {cat.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check
                          size={13}
                          className="mt-0.5 shrink-0"
                          style={{ color: accent }}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: isHovered ? `${accent}18` : 'hsl(var(--muted))',
                        color: isHovered ? accent : 'hsl(var(--muted-foreground))',
                        border: `1px solid ${isHovered ? accent + '40' : 'hsl(var(--border))'}`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={onContact}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm font-medium transition-all duration-300"
                  style={{
                    background: isHovered ? accent : 'hsl(var(--muted))',
                    color: isHovered ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  Start a Project
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-xs text-muted-foreground mt-10"
      >
        All rates in {pricing.currency}. Project rates vary based on scope. Book a free 30-min discovery call.
      </motion.p>
    </div>
  );
}
