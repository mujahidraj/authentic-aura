import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Layers, Code2, Globe, FlaskConical, FileText, Sparkles } from 'lucide-react';
import { DetailOverlay } from './DetailOverlay';
import type { PortfolioItem } from '../hooks/usePortfolioData';

interface BentoGridProps {
  items: PortfolioItem[];
  allTags: string[];
}

/* ─── Category definitions with icons ─── */
const CATEGORIES = [
  { key: 'All', label: 'All Work', icon: Layers },
  { key: 'web', label: 'Web Apps', icon: Globe, types: ['web-app', 'e-commerce', 'agency', 'agency-platform', 'utility'] },
  { key: 'ds', label: 'Data Science', icon: FlaskConical, types: ['data-science'] },
  { key: 'wp', label: 'WordPress', icon: Code2, types: ['wordpress'] },
  { key: 'pub', label: 'Research', icon: FileText, types: ['publication'] },
];

export function BentoGrid({ items }: BentoGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => {
        const cat = CATEGORIES.find(c => c.key === activeCategory);
        return cat?.types?.includes(i.type);
      });

  // Separate featured items for the hero row
  const featured = filtered.filter(i => i.featured);
  const rest = filtered.filter(i => !i.featured);

  const handleSelect = useCallback((item: PortfolioItem) => setSelectedItem(item), []);

  return (
    <div>
      {/* ─── Section Header ─── */}
      <div className="mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-beacon" />
          <span className="section-label">Portfolio</span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-foreground mb-6"
        >
          Selected<br />
          <span className="text-gradient-primary text-glow-primary">Works</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed font-light"
        >
          A curated collection spanning full-stack engineering, data science, research publications, and digital craft.
        </motion.p>
      </div>

      {/* ─── Category Tabs ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-1 mb-12 p-1.5 rounded-2xl w-fit overflow-x-auto"
        style={{ background: 'hsl(var(--muted) / 0.5)', border: '1px solid hsl(var(--border) / 0.5)' }}
      >
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          const count = cat.key === 'All'
            ? items.length
            : items.filter(i => cat.types?.includes(i.type)).length;

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="relative px-4 md:px-5 py-2.5 rounded-xl font-mono text-xs md:text-sm font-medium transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
              style={{
                color: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-category-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'hsl(var(--primary))' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={14} />
                <span className="hidden md:inline">{cat.label}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ─── Results Count ─── */}
      <div className="flex items-center justify-between mb-8">
        <p className="font-mono text-xs text-muted-foreground">
          Showing <span className="text-primary font-semibold">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-primary/50" />
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">Featured first</span>
        </div>
      </div>

      {/* ─── Featured Hero Cards (Top Row) ─── */}
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {featured.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              {featured.slice(0, 2).map((item, idx) => (
                <FeaturedCard key={item.id} item={item} index={idx} onClick={() => handleSelect(item)} />
              ))}
            </motion.div>
          )}

          {/* Additional featured items in 3-col grid */}
          {featured.length > 2 && (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            >
              {featured.slice(2).map((item, idx) => (
                <StandardCard key={item.id} item={item} index={idx + 2} onClick={() => handleSelect(item)} />
              ))}
            </motion.div>
          )}

          {/* ─── Regular Grid ─── */}
          {rest.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {rest.map((item, idx) => (
                <StandardCard key={item.id} item={item} index={idx + featured.length} onClick={() => handleSelect(item)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
            <Layers size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-mono text-sm mb-2">No projects found</p>
          <p className="text-muted-foreground/60 font-mono text-xs">Try selecting a different category</p>
        </motion.div>
      )}

      <DetailOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   FEATURED CARD — Large hero-style card with cinematic hover
   ═══════════════════════════════════════════════════════ */
function FeaturedCard({ item, index, onClick }: { item: PortfolioItem; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSpotPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const typeLabel = getTypeLabel(item.type);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setSpotPos({ x: 50, y: 50 }); }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl cursor-none min-h-[380px] md:min-h-[420px]"
      style={{
        border: isHovered
          ? '1px solid hsl(var(--primary) / 0.4)'
          : '1px solid hsl(var(--border) / 0.6)',
        boxShadow: isHovered
          ? '0 25px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(var(--primary) / 0.15)'
          : '0 4px 20px hsl(0 0% 0% / 0.2)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Background Image */}
      {item.images?.[0] && (
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Spotlight follow effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${spotPos.x}% ${spotPos.y}%, hsl(var(--primary) / 0.08), transparent 60%)`,
        }}
      />

      {/* Top badges */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold backdrop-blur-md"
            style={{
              background: 'hsl(var(--primary) / 0.2)',
              color: 'hsl(var(--primary))',
              border: '1px solid hsl(var(--primary) / 0.3)',
            }}
          >
            ★ Featured
          </span>
          <span
            className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider backdrop-blur-md"
            style={{
              background: 'hsl(0 0% 0% / 0.4)',
              color: 'hsl(0 0% 80%)',
              border: '1px solid hsl(0 0% 100% / 0.1)',
            }}
          >
            {typeLabel}
          </span>
        </div>
        <span className="font-mono text-xs text-white/50">{item.year}</span>
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        <motion.div
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            {item.title}
          </h3>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
            {item.subtitle || item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.tags.slice(0, 5).map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium"
                style={{
                  background: 'hsl(0 0% 100% / 0.08)',
                  color: 'hsl(0 0% 100% / 0.7)',
                  border: '1px solid hsl(0 0% 100% / 0.1)',
                }}
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 5 && (
              <span className="px-2 py-0.5 font-mono text-[10px] text-white/40">+{item.tags.length - 5}</span>
            )}
          </div>

          {/* Action row */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-center gap-3"
          >
            {item.links?.demo && (
              <a
                href={item.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                <ExternalLink size={12} /> Live
              </a>
            )}
            {item.links?.github && (
              <a
                href={item.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-medium backdrop-blur-md transition-all duration-200 hover:scale-105"
                style={{
                  background: 'hsl(0 0% 100% / 0.1)',
                  color: 'hsl(0 0% 100% / 0.9)',
                  border: '1px solid hsl(0 0% 100% / 0.15)',
                }}
              >
                <Github size={12} /> Source
              </a>
            )}
            <span className="ml-auto font-mono text-xs text-primary flex items-center gap-1">
              View Details <ArrowUpRight size={12} />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   STANDARD CARD — Clean, compact card with 3D tilt
   ═══════════════════════════════════════════════════════ */
function StandardCard({ item, index, onClick }: { item: PortfolioItem; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;
    mouseX.set(xNorm);
    mouseY.set(yNorm);
    setSpotPos({ x: xNorm * 100, y: yNorm * 100 });
  };

  const isDS = item.type === 'data-science';
  const typeLabel = getTypeLabel(item.type);
  const typeColor = getTypeColor(item.type);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); mouseX.set(0.5); mouseY.set(0.5); setSpotPos({ x: 50, y: 50 }); }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-none min-h-[340px] flex flex-col"
      data-cursor={isDS ? 'ds' : item.type === 'publication' ? 'publication' : undefined}
    >
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: isDS ? 'hsl(220 15% 6%)' : 'hsl(var(--card))',
          border: `1px solid ${isHovered ? `hsl(${typeColor} / 0.4)` : 'hsl(var(--border) / 0.6)'}`,
          boxShadow: isHovered
            ? `0 20px 60px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(${typeColor} / 0.15)`
            : '0 2px 10px hsl(0 0% 0% / 0.1)',
        }}
      />

      {/* Hover spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${spotPos.x}% ${spotPos.y}%, hsl(${typeColor} / 0.06), transparent 60%)`,
        }}
      />

      {/* Image section */}
      {item.images?.[0] && !isDS && (
        <div className="relative h-44 overflow-hidden rounded-t-2xl shrink-0">
          <motion.img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 30%, ${isDS ? 'hsl(220 15% 6%)' : 'hsl(var(--card))'})`,
            }}
          />
        </div>
      )}

      {/* DS Code Preview */}
      {isDS && item.codeSnippet && (
        <div className="relative shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'hsl(var(--border) / 0.4)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
            <span className="font-mono text-[10px] ml-1" style={{ color: 'hsl(var(--accent))' }}>
              {item.notebookType === 'jupyter' ? '▶ notebook.ipynb' : 'script.py'}
            </span>
          </div>
          <div className="px-4 py-3 overflow-hidden" style={{ maxHeight: '120px' }}>
            <pre className="font-mono text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: 'hsl(var(--accent) / 0.7)' }}>
              {item.codeSnippet.split('\n').slice(0, 7).join('\n')}
            </pre>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{ background: 'linear-gradient(to bottom, transparent, hsl(220 15% 6%))' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-medium"
            style={{
              background: `hsl(${typeColor} / 0.1)`,
              color: `hsl(${typeColor})`,
              border: `1px solid hsl(${typeColor} / 0.2)`,
            }}
          >
            {typeLabel}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
        </div>

        {/* Title & subtitle */}
        <h3 className="font-display text-lg font-bold text-foreground mb-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {item.subtitle || item.description}
        </p>

        {/* Metrics for DS cards */}
        {isDS && item.metrics && (
          <div className="flex gap-4 mb-4">
            {Object.entries(item.metrics).slice(0, 3).map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="font-mono text-sm font-bold" style={{ color: 'hsl(var(--accent))' }}>{v}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{k}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`tag-pill text-[10px] ${isDS ? 'tag-pill-accent' : ''}`}>{tag}</span>
          ))}
          {item.tags.length > 3 && (
            <span className="font-mono text-[10px] text-muted-foreground self-center">+{item.tags.length - 3}</span>
          )}
        </div>

        {/* Hover action */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-1.5 font-mono text-xs font-medium"
          style={{ color: `hsl(${typeColor})` }}
        >
          {isDS ? 'View notebook' : item.type === 'publication' ? 'Read paper' : 'View details'}
          <ArrowUpRight size={12} />
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ─── Helpers ─── */
function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'web-app': 'Web App',
    'e-commerce': 'E-Commerce',
    'agency': 'Agency',
    'agency-platform': 'Platform',
    'utility': 'Utility',
    'data-science': 'Data Science',
    'wordpress': 'WordPress',
    'publication': 'Research',
  };
  return map[type] ?? type.replace('-', ' ');
}

function getTypeColor(type: string): string {
  const map: Record<string, string> = {
    'web-app': 'var(--primary)',
    'e-commerce': 'var(--primary)',
    'agency': 'var(--primary)',
    'agency-platform': 'var(--primary)',
    'utility': 'var(--primary)',
    'data-science': 'var(--accent)',
    'wordpress': '220 70% 65%',
    'publication': '280 60% 65%',
  };
  return map[type] ?? 'var(--muted-foreground)';
}
