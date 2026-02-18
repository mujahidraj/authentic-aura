import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { PortfolioItem } from '../hooks/usePortfolioData';

interface ProjectCardProps {
  item: PortfolioItem;
  onClick: () => void;
  index: number;
}

export function ProjectCard({ item, onClick, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0); setIsHovered(false);
  };

  const isDS = item.type === 'data-science';
  const sizeClasses = {
    large: 'md:col-span-2 md:row-span-2',
    medium: 'md:col-span-1 md:row-span-2',
    small: 'md:col-span-1 md:row-span-1',
  };

  const getCursorAttr = () => {
    if (isDS) return 'ds';
    if (item.type === 'publication') return 'publication';
    return undefined;
  };

  const cardBg = isDS ? 'hsl(220 15% 7%)' : 'hsl(var(--card))';
  const cardBorder = isDS ? '1px solid hsl(var(--accent) / 0.2)' : '1px solid hsl(var(--border))';
  const cardShadow = isHovered
    ? isDS
      ? '0 20px 60px hsl(var(--accent) / 0.12), 0 0 0 1px hsl(var(--accent) / 0.3)'
      : '0 20px 60px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(var(--primary) / 0.15)'
    : 'none';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        background: cardBg,
        border: cardBorder,
        cursor: 'none',
        boxShadow: cardShadow,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={getCursorAttr()}
      className={`relative overflow-hidden rounded-2xl transition-shadow duration-300 ${sizeClasses[item.size ?? 'medium']}`}
    >
      {isDS ? (
        <DSCardInner item={item} isHovered={isHovered} />
      ) : (
        <StandardCardInner item={item} isHovered={isHovered} />
      )}
    </motion.div>
  );
}

function DSCardInner({ item, isHovered }: { item: PortfolioItem; isHovered: boolean }) {
  return (
    <div className="h-full flex flex-col min-h-[280px]">
      {/* Window chrome */}
      <div className="code-window-header shrink-0">
        <div className="code-dot" style={{ background: '#ff5f57' }} />
        <div className="code-dot" style={{ background: '#febc2e' }} />
        <div className="code-dot" style={{ background: '#28c840' }} />
        <span className="font-mono text-xs ml-2" style={{ color: 'hsl(var(--accent))' }}>
          {item.notebookType === 'jupyter' ? '▶ In [1]:' : 'python'}
        </span>
        <span className="font-mono text-xs text-muted-foreground ml-auto">{item.year}</span>
      </div>

      {/* Code preview */}
      {item.codeSnippet ? (
        <div className="relative overflow-hidden flex-1" style={{ maxHeight: '160px' }}>
          <SyntaxHighlighter
            language="python"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              background: 'transparent',
              fontSize: '11px',
              lineHeight: '1.5',
              padding: '12px 16px',
            }}
          >
            {item.codeSnippet.split('\n').slice(0, 10).join('\n')}
          </SyntaxHighlighter>
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{ background: 'linear-gradient(to bottom, transparent, hsl(220 15% 7%))' }}
          />
        </div>
      ) : (
        <div className="flex-1 p-4">
          {item.metrics && (
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(item.metrics).slice(0, 3).map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="font-mono text-sm font-bold" style={{ color: 'hsl(var(--accent))' }}>{v}</div>
                  <div className="font-mono text-xs text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
        <h3 className="font-mono text-sm font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h3>
        <p className="font-mono text-xs text-muted-foreground line-clamp-2 mb-3">{item.subtitle}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-pill tag-pill-accent text-[10px] px-2 py-0.5">{tag}</span>
          ))}
        </div>

        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
          transition={{ duration: 0.2 }}
          className="mt-3 font-mono text-xs"
          style={{ color: 'hsl(var(--accent))' }}
        >
          View notebook →
        </motion.div>
      </div>
    </div>
  );
}

function StandardCardInner({ item, isHovered }: { item: PortfolioItem; isHovered: boolean }) {
  const typeColor: Record<string, string> = {
    project: 'hsl(var(--primary))',
    demo: 'hsl(185 70% 60%)',
    wordpress: 'hsl(220 70% 65%)',
    publication: 'hsl(var(--primary))',
  };
  const color = typeColor[item.type] ?? 'hsl(var(--muted-foreground))';

  return (
    <div className="h-full flex flex-col min-h-[240px]">
      {/* Hero image */}
      {item.images && item.images[0] && (
        <div className="relative h-40 overflow-hidden">
          <motion.img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, hsl(var(--card)))' }}
          />
          {item.featured && (
            <div
              className="absolute top-3 right-3 font-mono text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'hsl(var(--primary) / 0.9)', color: 'hsl(var(--primary-foreground))' }}
            >
              Featured
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color }}>
            {item.type.replace('-', ' ')}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mb-1.5 line-clamp-2 leading-tight">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {item.subtitle}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {item.tags.length > 4 && (
            <span className="tag-pill text-muted-foreground">+{item.tags.length - 4}</span>
          )}
        </div>

        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xs font-medium"
          style={{ color: 'hsl(var(--primary))' }}
        >
          View Details →
        </motion.div>
      </div>
    </div>
  );
}
