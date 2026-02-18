import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Quote, Users } from 'lucide-react';
import { SectionHeader } from './SectionWrapper';
import type { PublicationItem } from '../hooks/usePortfolioData';

interface PublicationsSectionProps {
  publications: PublicationItem[];
}

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  publication: { label: 'Research Paper', color: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.1)' },
  talk: { label: 'Conference Talk', color: 'hsl(185 70% 60%)', bg: 'hsl(185 70% 60% / 0.1)' },
  preprint: { label: 'Preprint', color: 'hsl(38 80% 65%)', bg: 'hsl(38 80% 65% / 0.1)' },
};

export function PublicationsSection({ publications }: PublicationsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div data-cursor="publication">
      <SectionHeader
        label="// Research"
        title="Publications & Talks"
        subtitle="Peer-reviewed research, conference keynotes, and workshop proceedings. Building the knowledge layer for AI in underserved linguistic contexts."
      />

      <div className="space-y-5">
        {publications.map((pub, idx) => {
          const config = typeConfig[pub.type] ?? typeConfig.publication;
          const isHovered = hoveredId === pub.id;

          return (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(pub.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-cursor="publication"
              className="relative rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: 'hsl(var(--card))',
                border: `1px solid ${isHovered ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border))'}`,
                boxShadow: isHovered ? '0 16px 48px hsl(var(--primary) / 0.08)' : 'none',
              }}
            >
              {/* Left accent border on hover */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5"
                animate={{ background: isHovered ? config.color : 'transparent' }}
                transition={{ duration: 0.3 }}
              />

              <div className="p-6 md:p-8 pl-8 md:pl-10">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Thumbnail / year badge */}
                  <div className="shrink-0">
                    {pub.images?.[0] ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden">
                        <motion.img
                          src={pub.images[0]}
                          alt={pub.title}
                          className="w-full h-full object-cover"
                          animate={{ scale: isHovered ? 1.08 : 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center"
                        style={{ background: config.bg }}
                      >
                        <Quote size={28} style={{ color: config.color }} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="font-mono text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: config.bg, color: config.color }}
                      >
                        {config.label}
                      </span>
                      {/* Venue badge */}
                      <span
                        className="font-mono text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: 'hsl(var(--muted))',
                          color: 'hsl(var(--muted-foreground))',
                          border: '1px solid hsl(var(--border))',
                        }}
                      >
                        {pub.venue.split(',')[0]}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{pub.year}</span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-display text-xl md:text-2xl font-bold leading-tight mb-1.5 transition-colors duration-200"
                      style={{ color: isHovered ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.9)' }}
                    >
                      {pub.title}
                    </h3>

                    {/* Subtitle / venue full */}
                    <p className="font-mono text-xs text-muted-foreground italic mb-3">
                      {pub.subtitle}
                    </p>

                    {/* Authors */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <Users size={11} className="text-muted-foreground" />
                      <p className="font-mono text-xs text-muted-foreground">
                        {pub.authors.join(', ')}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {pub.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pub.tags.slice(0, 5).map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>

                    {/* Bottom row: citations + links */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Citation count */}
                      {pub.citations !== null && (
                        <div
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs"
                          style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
                        >
                          <span
                            className="font-bold text-sm"
                            style={{ color: config.color }}
                          >
                            {pub.citations}
                          </span>
                          citation{pub.citations !== 1 ? 's' : ''}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-2">
                        {pub.links.paper && (
                          <a
                            href={pub.links.paper}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                            style={{
                              background: isHovered ? config.color : 'hsl(var(--muted))',
                              color: isHovered ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                            }}
                          >
                            <ExternalLink size={11} />
                            Read Paper
                          </a>
                        )}
                        {pub.links.demo && (
                          <a
                            href={pub.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
                            style={{
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--muted-foreground))',
                            }}
                          >
                            <ExternalLink size={11} />
                            Watch Talk
                          </a>
                        )}
                        {pub.links.github && (
                          <a
                            href={pub.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
                            style={{
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--muted-foreground))',
                            }}
                          >
                            <Github size={11} />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story on hover */}
                <motion.div
                  animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-6 pt-5 border-t pl-5"
                    style={{
                      borderColor: 'hsl(var(--border))',
                      borderLeft: `2px solid ${config.color}`,
                    }}
                  >
                    <p className="font-display italic text-base leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
                      "{pub.story}"
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
