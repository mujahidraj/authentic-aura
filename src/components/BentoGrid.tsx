import { useState, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { DetailOverlay } from './DetailOverlay';
import { SectionHeader } from './SectionWrapper';
import type { PortfolioItem } from '../hooks/usePortfolioData';

interface BentoGridProps {
  items: PortfolioItem[];
  allTags: string[];
}

export function BentoGrid({ items, allTags }: BentoGridProps) {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filtered = activeTag === 'All'
    ? items
    : items.filter(i => i.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));

  const priorityTags = ['All', 'React', 'Python', 'Machine Learning', 'NLP', 'WordPress', 'TypeScript', 'FastAPI', 'D3.js'];
  const displayTags = ['All', ...allTags.filter(t => priorityTags.includes(t) && t !== 'All').slice(0, 14)];

  const handleSelect = useCallback((item: PortfolioItem) => setSelectedItem(item), []);

  return (
    <div>
      <SectionHeader
        label="// Selected Works"
        title="The Work"
        subtitle="A curated collection spanning machine learning, full-stack engineering, data science, and digital craft."
      />

      {/* Tag filter bar */}
      <div className="flex flex-wrap gap-2 mb-10">
        {displayTags.map(tag => (
          <motion.button
            key={tag}
            onClick={() => setActiveTag(tag)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-1.5 rounded-full font-mono text-xs font-medium transition-all duration-200"
            style={{
              background: activeTag === tag ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              color: activeTag === tag ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
              border: activeTag === tag ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
            }}
          >
            {tag}
          </motion.button>
        ))}
        <span className="ml-auto font-mono text-xs text-muted-foreground self-center">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bento grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <ProjectCard
                key={item.id}
                item={item}
                index={idx}
                onClick={() => handleSelect(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-muted-foreground font-mono text-sm"
        >
          No items found for "{activeTag}"
        </motion.div>
      )}

      <DetailOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
