import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeader } from './SectionWrapper';
import type { TimelineItem } from '../hooks/usePortfolioData';

const typeConfig = {
  education: { label: 'Education', color: 'hsl(var(--accent))', dot: 'hsl(var(--accent))' },
  work: { label: 'Work', color: 'hsl(var(--primary))', dot: 'hsl(var(--primary))' },
  experience: { label: 'Experience', color: 'hsl(185 70% 60%)', dot: 'hsl(185 70% 60%)' },
};

interface LifeTimelineProps {
  items: TimelineItem[];
}

export function LifeTimeline({ items }: LifeTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef}>
      <SectionHeader
        label="// Journey"
        title="The Life Timeline"
        subtitle="Education, work, and experiences that have shaped the work. Each node is a place, a chapter, a lesson."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line track */}
        <div
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
          style={{ background: 'hsl(var(--border))' }}
        />
        {/* Animated fill line */}
        <motion.div
          className="absolute left-6 md:left-8 top-0 w-px origin-top"
          style={{
            height: lineHeight,
            background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--accent)))',
          }}
        />

        <div className="space-y-8 pl-16 md:pl-20">
          {items.map((item, idx) => {
            const config = typeConfig[item.type] ?? typeConfig.experience;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Dot */}
                <div
                  className="absolute -left-[52px] md:-left-[60px] top-5 w-4 h-4 rounded-full border-2 border-background"
                  style={{ background: config.dot, boxShadow: `0 0 12px ${config.dot}60` }}
                />

                <div
                  className="p-6 rounded-2xl transition-all duration-300 hover:border-opacity-50"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <span
                        className="font-mono text-xs uppercase tracking-wider mb-1 block"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                      <h3 className="font-display text-xl font-bold text-foreground leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-0.5">{item.organization}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-muted-foreground">{item.period}</p>
                      <p className="font-mono text-xs mt-1" style={{ color: config.color }}>
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>

                  {item.achievements.length > 0 && (
                    <ul className="space-y-1.5">
                      {item.achievements.slice(0, 3).map((ach, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: config.color }} />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.slice(0, 5).map(tag => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
