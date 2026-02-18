import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { PortfolioItem } from '../hooks/usePortfolioData';

interface DetailOverlayProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export function DetailOverlay({ item, onClose }: DetailOverlayProps) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (item) {
      setImgIdx(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const images = item?.images ?? [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'hsl(var(--background) / 0.92)', backdropFilter: 'blur(20px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
            style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
            >
              <X size={18} />
            </button>

            {/* Image gallery */}
            {images.length > 0 && (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl md:rounded-t-3xl">
                <img
                  src={images[imgIdx]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, hsl(var(--card)))' }} />
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center glass"
                      disabled={imgIdx === 0}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center glass"
                      disabled={imgIdx === images.length - 1}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-10">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="section-label">{item.type.replace('-', ' ')}</span>
                {item.year && (
                  <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
                )}
                {item.status && (
                  <span
                    className="font-mono text-xs px-2.5 py-0.5 rounded-full border"
                    style={{
                      borderColor: 'hsl(var(--accent) / 0.4)',
                      color: 'hsl(var(--accent))',
                      background: 'hsl(var(--accent) / 0.08)',
                    }}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {item.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">{item.subtitle}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map(tag => (
                  <span key={tag} className="tag-pill tag-pill-primary">{tag}</span>
                ))}
              </div>

              {/* Links */}
              {item.links && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {item.links.demo && (
                    <a href={item.links.demo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-medium transition-all duration-200 glow-primary"
                      style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {item.links.github && (
                    <a href={item.links.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-medium border transition-all duration-200"
                      style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
                      <Github size={14} /> Source Code
                    </a>
                  )}
                  {item.links.paper && (
                    <a href={item.links.paper} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-medium border transition-all duration-200"
                      style={{ borderColor: 'hsl(var(--accent) / 0.4)', color: 'hsl(var(--accent))' }}>
                      <FileText size={14} /> Research Paper
                    </a>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-invert max-w-none mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Overview</h3>
                <div className="text-foreground leading-relaxed text-base">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              </div>

              {/* Story */}
              {item.story && (
                <div className="mb-8 pl-5 border-l-2" style={{ borderColor: 'hsl(var(--primary) / 0.4)' }}>
                  <h3 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    The Story Behind It
                  </h3>
                  <p className="font-display italic text-lg leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
                    "{item.story}"
                  </p>
                </div>
              )}

              {/* Metrics */}
              {item.metrics && Object.keys(item.metrics).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {Object.entries(item.metrics).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-xl" style={{ background: 'hsl(var(--muted))' }}>
                      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">{key}</p>
                      <p className="font-mono text-xl font-bold" style={{ color: 'hsl(var(--primary))' }}>{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippet (DS items) */}
              {item.codeSnippet && (
                <div data-cursor="ds">
                  <h3 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Code Snippet
                  </h3>
                  <div className="code-window overflow-hidden">
                    <div className="code-window-header">
                      <div className="code-dot" style={{ background: '#ff5f57' }} />
                      <div className="code-dot" style={{ background: '#febc2e' }} />
                      <div className="code-dot" style={{ background: '#28c840' }} />
                      <span className="font-mono text-xs text-muted-foreground ml-2">
                        {item.notebookType === 'jupyter' ? 'notebook.ipynb' : 'script.py'}
                      </span>
                    </div>
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        background: 'hsl(220 15% 7%)',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        padding: '20px',
                      }}
                    >
                      {item.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
