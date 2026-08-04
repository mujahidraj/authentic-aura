import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Building2, MapPin, Calendar, ChevronDown, Award, Sparkles } from 'lucide-react';
import type { TimelineItem } from '../hooks/usePortfolioData';

/* ─── Type configuration ─── */
const typeConfig = {
  education: {
    label: 'Education',
    icon: GraduationCap,
    gradient: 'from-cyan-500 to-blue-600',
    color: 'hsl(var(--accent))',
    bgAccent: 'hsl(var(--accent) / 0.08)',
    borderAccent: 'hsl(var(--accent) / 0.25)',
    dotGlow: 'hsl(var(--accent) / 0.4)',
  },
  work: {
    label: 'Work',
    icon: Building2,
    gradient: 'from-amber-500 to-orange-600',
    color: 'hsl(var(--primary))',
    bgAccent: 'hsl(var(--primary) / 0.08)',
    borderAccent: 'hsl(var(--primary) / 0.25)',
    dotGlow: 'hsl(var(--primary) / 0.4)',
  },
  experience: {
    label: 'Experience',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-600',
    color: 'hsl(280 60% 65%)',
    bgAccent: 'hsl(280 60% 65% / 0.08)',
    borderAccent: 'hsl(280 60% 65% / 0.25)',
    dotGlow: 'hsl(280 60% 65% / 0.4)',
  },
};

/* ─── Helpers ─── */
function getYear(dateStr: string): string {
  return dateStr.split('-')[0];
}

function isPresent(item: TimelineItem): boolean {
  return !item.endDate || item.period.toLowerCase().includes('present');
}

interface LifeTimelineProps {
  items: TimelineItem[];
}

export function LifeTimeline({ items }: LifeTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  // Group items by start year for year markers
  const yearGroups: { year: string; items: TimelineItem[] }[] = [];
  const sorted = [...items]; // already sorted desc by startDate from hook

  sorted.forEach(item => {
    const year = getYear(item.startDate);
    const existing = yearGroups.find(g => g.year === year);
    if (existing) {
      existing.items.push(item);
    } else {
      yearGroups.push({ year, items: [item] });
    }
  });

  // Filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'work' | 'experience'>('all');
  const filteredGroups = yearGroups
    .map(g => ({
      ...g,
      items: activeFilter === 'all' ? g.items : g.items.filter(i => i.type === activeFilter),
    }))
    .filter(g => g.items.length > 0);

  // Stats
  const stats = {
    total: items.length,
    education: items.filter(i => i.type === 'education').length,
    work: items.filter(i => i.type === 'work').length,
    experience: items.filter(i => i.type === 'experience').length,
  };

  return (
    <div ref={containerRef}>
      {/* ─── Section Header ─── */}
      <div className="mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-beacon" />
          <span className="section-label">Chronicle</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight text-foreground mb-6"
        >
          The Journey<br />
          <span className="text-gradient-primary text-glow-primary">So Far</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-light"
        >
          Education, work, and experiences that shaped the engineer. Each chapter is a place, a lesson, a transformation.
        </motion.p>
      </div>

      {/* ─── Stats Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
      >
        {[
          { label: 'Total Milestones', value: stats.total, icon: Sparkles, color: 'hsl(var(--foreground))' },
          { label: 'Education', value: stats.education, icon: GraduationCap, color: typeConfig.education.color },
          { label: 'Work', value: stats.work, icon: Building2, color: typeConfig.work.color },
          { label: 'Experience', value: stats.experience, icon: Briefcase, color: typeConfig.experience.color },
        ].map(stat => (
          <div
            key={stat.label}
            className="p-4 rounded-xl text-center transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.6)' }}
          >
            <stat.icon size={16} className="mx-auto mb-2 opacity-50" style={{ color: stat.color }} />
            <div className="font-mono text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ─── Filter Tabs ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center gap-1 mb-12 p-1.5 rounded-2xl w-fit"
        style={{ background: 'hsl(var(--muted) / 0.5)', border: '1px solid hsl(var(--border) / 0.5)' }}
      >
        {[
          { key: 'all' as const, label: 'All', count: stats.total },
          { key: 'education' as const, label: 'Education', count: stats.education },
          { key: 'work' as const, label: 'Work', count: stats.work },
          { key: 'experience' as const, label: 'Experience', count: stats.experience },
        ].map(tab => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="relative px-4 py-2 rounded-xl font-mono text-xs font-medium transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
              style={{ color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-timeline-filter"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'hsl(var(--primary))' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span className="relative z-10 text-[10px] opacity-60">({tab.count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* ─── Timeline ─── */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central vertical line */}
        <div
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
          style={{ background: 'hsl(var(--border) / 0.4)' }}
        />
        {/* Animated fill */}
        <motion.div
          className="absolute left-6 md:left-8 top-0 w-px origin-top"
          style={{
            height: lineHeight,
            background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--accent)), hsl(280 60% 65%))',
          }}
        />

        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group) => (
            <div key={group.year} className="mb-4">
              {/* ─── Year Marker ─── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="relative flex items-center gap-4 mb-6 pl-[8px] md:pl-[12px]"
              >
                {/* Year dot — larger */}
                <div className="relative z-10">
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-mono text-xs md:text-sm font-bold"
                    style={{
                      background: 'hsl(var(--background))',
                      border: '2px solid hsl(var(--primary))',
                      color: 'hsl(var(--primary))',
                      boxShadow: '0 0 20px hsl(var(--primary) / 0.2)',
                    }}
                  >
                    {group.year.slice(-2)}
                  </div>
                </div>

                {/* Year label */}
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {group.year}
                  </span>
                  <div className="h-px flex-1 min-w-[40px] bg-gradient-to-r from-primary/30 to-transparent" />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {group.items.length} event{group.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </motion.div>

              {/* ─── Items for this year ─── */}
              <div className="space-y-4 pl-[56px] md:pl-[72px] mb-10">
                {group.items.map((item, idx) => (
                  <TimelineCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>

        {/* ─── Timeline End Marker ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative flex items-center gap-4 pl-2"
        >
          <div className="relative z-10 pl-[8px] md:pl-[12px]">
            <div
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'hsl(var(--muted))',
                border: '2px solid hsl(var(--border))',
              }}
            >
              <Calendar size={14} className="text-muted-foreground" />
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground tracking-wider">
            The story continues...
          </span>
        </motion.div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   TIMELINE CARD — Expandable card with rich detail
   ═══════════════════════════════════════════════════════ */
function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[item.type] ?? typeConfig.experience;
  const Icon = config.icon;
  const current = isPresent(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Connector dot */}
      <div
        className="absolute -left-[25px] md:-left-[33px] top-6 w-3.5 h-3.5 rounded-full border-[2.5px] transition-all duration-300 group-hover:scale-125"
        style={{
          borderColor: config.color,
          background: expanded || current ? config.color : 'hsl(var(--background))',
          boxShadow: `0 0 12px ${config.dotGlow}`,
        }}
      />

      {/* Connector line to dot */}
      <div
        className="absolute -left-[12px] md:-left-[20px] top-[26px] h-px transition-all duration-300"
        style={{
          width: expanded ? '14px' : '10px',
          background: config.borderAccent,
        }}
      />

      {/* Card */}
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        className="relative overflow-hidden rounded-2xl transition-all duration-400 cursor-pointer"
        style={{
          background: expanded ? config.bgAccent : 'hsl(var(--card))',
          border: `1px solid ${expanded ? config.borderAccent : 'hsl(var(--border) / 0.6)'}`,
          boxShadow: expanded
            ? `0 12px 40px hsl(0 0% 0% / 0.3), 0 0 0 1px ${config.borderAccent}`
            : '0 2px 8px hsl(0 0% 0% / 0.1)',
        }}
      >
        {/* Current / Active badge */}
        {current && (
          <div
            className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-mono text-[10px] uppercase tracking-wider font-semibold"
            style={{ background: config.color, color: 'hsl(var(--background))' }}
          >
            Current
          </div>
        )}

        {/* Main content — always visible */}
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            {/* Type icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
              style={{
                background: config.bgAccent,
                border: `1px solid ${config.borderAccent}`,
              }}
            >
              <Icon size={18} style={{ color: config.color }} />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium"
                  style={{
                    background: config.bgAccent,
                    color: config.color,
                    border: `1px solid ${config.borderAccent}`,
                  }}
                >
                  {config.label}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar size={10} />
                  {item.period}
                </span>
              </div>

              <h3 className="font-display text-lg md:text-xl font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground font-medium">
                  {item.organization}
                </p>
                <span className="font-mono text-[11px] text-muted-foreground/60 flex items-center gap-1">
                  <MapPin size={10} />
                  {item.location}
                </span>
              </div>
            </div>

            {/* Expand chevron */}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 mt-1"
            >
              <ChevronDown size={16} className="text-muted-foreground" />
            </motion.div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-6 pt-0">
                {/* Divider */}
                <div
                  className="h-px mb-5"
                  style={{ background: `linear-gradient(to right, ${config.borderAccent}, transparent)` }}
                />

                {/* Description */}
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Achievements */}
                {item.achievements.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Award size={12} style={{ color: config.color }} />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Key Highlights
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {item.achievements.map((ach, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="flex items-start gap-2.5 text-sm text-foreground/90"
                        >
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: config.color }}
                          />
                          {ach}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium transition-all duration-200"
                      style={{
                        background: config.bgAccent,
                        color: config.color,
                        border: `1px solid ${config.borderAccent}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
