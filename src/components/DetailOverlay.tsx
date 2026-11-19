import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Github, FileText, ChevronLeft, ChevronRight, Calendar,
  Activity, Layers, Globe, Maximize2, Smartphone, Code2, Sparkles, ArrowUpRight, ArrowDown,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { PortfolioItem } from '../hooks/usePortfolioData';

interface DetailOverlayProps {
  item: PortfolioItem | null;
  onClose: () => void;
  /** Ordered list of items shown in the grid — enables prev/next navigation */
  items?: PortfolioItem[];
  onNavigate?: (item: PortfolioItem) => void;
}

const TYPE_LABELS: Record<string, string> = {
  'web-app': 'Web Application',
  'e-commerce': 'E-Commerce',
  'agency': 'Company Website',
  'agency-platform': 'Business Platform',
  'utility': 'Utility',
  'mobile-app': 'Mobile App',
  'data-science': 'Data Science',
  'wordpress': 'WordPress',
  'publication': 'Research',
};

function hostname(url: string | null | undefined) {
  if (!url) return null;
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

export function DetailOverlay({ item, onClose, items = [], onNavigate }: DetailOverlayProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isTallImg, setIsTallImg] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = item?.images ?? [];
  const index = item ? items.findIndex(i => i.id === item.id) : -1;
  const prev = index > 0 ? items[index - 1] : null;
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : null;

  const go = useCallback((target: PortfolioItem | null, dir: number) => {
    if (!target || !onNavigate) return;
    setDirection(dir);
    onNavigate(target);
  }, [onNavigate]);

  const selectImg = useCallback((nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= images.length || nextIdx === imgIdx) return;
    setImgIdx(nextIdx);
    setImgLoaded(false);
    setIsTallImg(false);
  }, [images.length, imgIdx]);

  // Reset per item + lock body scroll
  useEffect(() => {
    if (item) {
      setImgIdx(0);
      setImgLoaded(false);
      setIsTallImg(false);
      setLightbox(false);
      scrollRef.current?.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox) setLightbox(false);
        else onClose();
      } else if (lightbox) {
        if (e.key === 'ArrowLeft') selectImg(imgIdx - 1);
        else if (e.key === 'ArrowRight') selectImg(imgIdx + 1);
      } else {
        if (e.key === 'ArrowLeft') go(prev, -1);
        else if (e.key === 'ArrowRight') go(next, 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose, go, prev, next, lightbox, selectImg, imgIdx]);

  const isMobile = item?.type === 'mobile-app';
  const domain = hostname(item?.links?.demo);
  const typeLabel = item ? (TYPE_LABELS[item.type] ?? item.type.replace('-', ' ')) : '';

  const handleImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgLoaded(true);
    setIsTallImg(img.naturalHeight / (img.naturalWidth || 1) > 0.85);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {item && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'hsl(0 0% 0% / 0.82)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl h-[94vh] md:h-[88vh] flex flex-col overflow-hidden rounded-t-3xl md:rounded-3xl"
            style={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 40px 120px hsl(0 0% 0% / 0.7), 0 0 0 1px hsl(var(--primary) / 0.06)',
            }}
          >
            {/* ─── Top bar ─── */}
            <div
              className="relative z-20 flex items-center gap-3 px-4 md:px-6 h-14 shrink-0 border-b"
              style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card) / 0.9)', backdropFilter: 'blur(10px)' }}
            >
              {/* Mobile drag handle */}
              <div className="md:hidden absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/15" />

              <span
                className="px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold"
                style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.25)' }}
              >
                {typeLabel}
              </span>
              {index >= 0 && items.length > 1 && (
                <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                  {String(index + 1).padStart(2, '0')} <span className="opacity-40">/ {String(items.length).padStart(2, '0')}</span>
                </span>
              )}

              <div className="ml-auto flex items-center gap-1.5">
                {onNavigate && items.length > 1 && (
                  <>
                    <IconButton label="Previous project (←)" disabled={!prev} onClick={() => go(prev, -1)}>
                      <ChevronLeft size={17} />
                    </IconButton>
                    <IconButton label="Next project (→)" disabled={!next} onClick={() => go(next, 1)}>
                      <ChevronRight size={17} />
                    </IconButton>
                    <div className="w-px h-5 mx-1.5" style={{ background: 'hsl(var(--border))' }} />
                  </>
                )}
                <IconButton label="Close (Esc)" onClick={onClose}>
                  <X size={17} />
                </IconButton>
              </div>
            </div>

            {/* ─── Scrollable body ─── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={item.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid lg:grid-cols-[1.35fr_1fr] gap-0"
                >
                  {/* ─── LEFT: Interactive Scrollable Preview ─── */}
                  <div
                    className="p-4 md:p-6 lg:p-8 lg:border-r"
                    style={{ borderColor: 'hsl(var(--border))', background: 'radial-gradient(circle at 30% 0%, hsl(var(--primary) / 0.06), transparent 60%)' }}
                  >
                    <div className="lg:sticky lg:top-8 space-y-4">
                      {images.length > 0 ? (
                        isMobile ? (
                          <PhoneFrame
                            src={images[imgIdx]}
                            alt={`${item.title} preview ${imgIdx + 1}`}
                            loaded={imgLoaded}
                            onLoad={handleImgLoad}
                            onExpand={() => setLightbox(true)}
                            imgIdx={imgIdx}
                            total={images.length}
                            onPrev={() => selectImg(imgIdx - 1)}
                            onNext={() => selectImg(imgIdx + 1)}
                          />
                        ) : (
                          <BrowserFrame
                            src={images[imgIdx]}
                            alt={`${item.title} preview ${imgIdx + 1}`}
                            domain={domain ?? hostname(item.links?.github) ?? 'preview'}
                            loaded={imgLoaded}
                            onLoad={handleImgLoad}
                            onExpand={() => setLightbox(true)}
                            imgIdx={imgIdx}
                            total={images.length}
                            onPrev={() => selectImg(imgIdx - 1)}
                            onNext={() => selectImg(imgIdx + 1)}
                          />
                        )
                      ) : (
                        <div className="aspect-video rounded-2xl flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
                          <Code2 size={40} className="text-muted-foreground" />
                        </div>
                      )}

                      {/* Thumbnail gallery strip */}
                      {images.length > 1 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              Screenshots · {imgIdx + 1} / {images.length}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground/70">
                              Click to switch preview
                            </span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-1.5">
                            {images.map((src, i) => (
                              <button
                                key={src}
                                onClick={() => selectImg(i)}
                                className={`relative shrink-0 rounded-lg overflow-hidden transition-all ${
                                  isMobile ? 'w-11 h-20' : 'w-24 h-14'
                                }`}
                                style={{
                                  background: 'hsl(0 0% 5%)',
                                  outline: i === imgIdx ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                                  outlineOffset: i === imgIdx ? '1px' : '0px',
                                  opacity: i === imgIdx ? 1 : 0.55,
                                }}
                                aria-label={`View screenshot ${i + 1}`}
                              >
                                <img
                                  src={src}
                                  alt=""
                                  loading="lazy"
                                  className="w-full h-full object-cover object-top"
                                />
                                <span
                                  className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold"
                                  style={{ background: 'hsl(0 0% 0% / 0.75)', color: 'hsl(0 0% 95%)' }}
                                >
                                  {i + 1}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metrics */}
                      {item.metrics && Object.keys(item.metrics).length > 0 && (
                        <div className="grid grid-cols-3 gap-2.5">
                          {Object.entries(item.metrics).map(([key, value]) => (
                            <div key={key} className="p-3.5 rounded-xl border" style={{ background: 'hsl(var(--muted) / 0.6)', borderColor: 'hsl(var(--border))' }}>
                              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{key}</p>
                              <p className="font-mono text-sm md:text-base font-bold leading-snug" style={{ color: 'hsl(var(--primary))' }}>{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─── RIGHT: Info ─── */}
                  <div className="p-5 md:p-8 flex flex-col gap-7">
                    {/* Title */}
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-black text-foreground leading-[1.05] tracking-tight mb-2">
                        {item.title}
                      </h2>
                      <p className="text-base md:text-lg" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>{item.subtitle}</p>
                    </div>

                    {/* CTAs */}
                    {item.links && (item.links.demo || item.links.github || item.links.paper) && (
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        {item.links.demo && (
                          <a
                            href={item.links.demo} target="_blank" rel="noopener noreferrer"
                            className="group flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', boxShadow: '0 8px 24px hsl(var(--primary) / 0.25)' }}
                          >
                            <Globe size={16} /> Visit Live Site
                            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        )}
                        {item.links.github && (
                          <a
                            href={item.links.github} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
                            style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                          >
                            <Github size={16} /> Source Code
                          </a>
                        )}
                        {item.links.paper && (
                          <a
                            href={item.links.paper} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5"
                            style={{ borderColor: 'hsl(var(--accent) / 0.4)', color: 'hsl(var(--accent))' }}
                          >
                            <FileText size={16} /> Paper
                          </a>
                        )}
                      </div>
                    )}

                    {/* Quick facts */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <Fact icon={<Layers size={14} />} label="Category" value={typeLabel} />
                      {item.year && <Fact icon={<Calendar size={14} />} label="Year" value={item.year} />}
                      {item.status && (
                        <Fact
                          icon={<Activity size={14} />}
                          label="Status"
                          value={
                            <span className="inline-flex items-center gap-1.5 capitalize">
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(140 70% 50%)' }} />
                              {item.status}
                            </span>
                          }
                        />
                      )}
                      <Fact
                        icon={isMobile ? <Smartphone size={14} /> : <Globe size={14} />}
                        label={isMobile ? 'Platform' : domain ? 'Live at' : 'Availability'}
                        value={isMobile ? 'Android' : domain ?? 'Source only'}
                      />
                    </div>

                    {/* Overview */}
                    <Section title="Overview">
                      <p className="leading-relaxed text-[15px]" style={{ color: 'hsl(var(--foreground) / 0.82)' }}>
                        {item.description}
                      </p>
                    </Section>

                    {/* Under the hood */}
                    {item.story && (
                      <Section title="Under the Hood">
                        <div
                          className="relative p-4 rounded-xl border overflow-hidden"
                          style={{ background: 'hsl(var(--primary) / 0.04)', borderColor: 'hsl(var(--primary) / 0.15)' }}
                        >
                          <Sparkles size={14} className="absolute top-4 right-4" style={{ color: 'hsl(var(--primary) / 0.5)' }} />
                          <p className="leading-relaxed text-[14.5px] pr-6" style={{ color: 'hsl(var(--foreground) / 0.75)' }}>
                            {item.story}
                          </p>
                        </div>
                      </Section>
                    )}

                    {/* Tech stack */}
                    <Section title={`Tech Stack · ${item.tags.length}`}>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 rounded-lg font-mono text-xs font-medium border"
                            style={{ background: 'hsl(var(--muted) / 0.6)', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground) / 0.85)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Section>

                    {/* Code snippet */}
                    {item.codeSnippet && (
                      <Section title="Code Snippet">
                        <div className="code-window overflow-hidden" data-cursor="ds">
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
                            customStyle={{ margin: 0, background: 'hsl(220 15% 7%)', fontSize: '12.5px', lineHeight: '1.6', padding: '18px' }}
                          >
                            {item.codeSnippet}
                          </SyntaxHighlighter>
                        </div>
                      </Section>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ─── Prev / Next footer ─── */}
              {onNavigate && (prev || next) && (
                <div className="grid grid-cols-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                  <NavTile item={prev} dir="prev" onClick={() => go(prev, -1)} />
                  <NavTile item={next} dir="next" onClick={() => go(next, 1)} />
                </div>
              )}
            </div>

            {/* ─── Scrollable Lightbox ─── */}
            <AnimatePresence>
              {lightbox && images[imgIdx] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col"
                  style={{ background: 'hsl(0 0% 0% / 0.94)' }}
                >
                  {/* Lightbox top bar */}
                  <div
                    className="flex items-center justify-between px-4 md:px-6 h-14 shrink-0 border-b"
                    style={{ borderColor: 'hsl(var(--border))', background: 'hsl(0 0% 5% / 0.9)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-semibold text-sm text-white truncate">{item.title}</span>
                      {images.length > 1 && (
                        <span className="font-mono text-xs text-white/50">
                          {imgIdx + 1} / {images.length}
                        </span>
                      )}
                      {isTallImg && !isMobile && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-white/10 text-white/75">
                          <ArrowDown size={10} /> Scrollable full-page preview
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {images.length > 1 && (
                        <>
                          <IconButton label="Previous screenshot (←)" disabled={imgIdx === 0} onClick={() => selectImg(imgIdx - 1)}>
                            <ChevronLeft size={17} />
                          </IconButton>
                          <IconButton label="Next screenshot (→)" disabled={imgIdx === images.length - 1} onClick={() => selectImg(imgIdx + 1)}>
                            <ChevronRight size={17} />
                          </IconButton>
                          <div className="w-px h-5 mx-1" style={{ background: 'hsl(var(--border))' }} />
                        </>
                      )}
                      <IconButton label="Close preview (Esc)" onClick={() => setLightbox(false)}>
                        <X size={17} />
                      </IconButton>
                    </div>
                  </div>

                  {/* Lightbox scrollable stage */}
                  <div
                    className={`flex-1 overflow-y-auto overscroll-contain p-4 md:p-8 flex justify-center ${
                      isTallImg && !isMobile ? 'items-start' : 'items-center'
                    }`}
                    onClick={(e) => { if (e.target === e.currentTarget) setLightbox(false); }}
                  >
                    <motion.img
                      key={images[imgIdx]}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={images[imgIdx]}
                      alt={`${item.title} full preview`}
                      className={
                        isTallImg && !isMobile
                          ? 'w-full max-w-5xl h-auto rounded-xl shadow-2xl border border-white/10'
                          : 'max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10'
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

function IconButton({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none"
      style={{ color: 'hsl(var(--foreground) / 0.8)', border: '1px solid hsl(var(--border))' }}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
      </div>
      {children}
    </section>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl border min-w-0" style={{ background: 'hsl(var(--muted) / 0.45)', borderColor: 'hsl(var(--border))' }}>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}

function BrowserFrame({
  src, alt, domain, loaded, onLoad, onExpand, imgIdx, total, onPrev, onNext,
}: {
  src: string; alt: string; domain: string; loaded: boolean;
  onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onExpand: () => void;
  imgIdx: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });
    setCanScroll(false);
    setHasScrolled(false);
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onLoad(e);
    requestAnimationFrame(() => {
      const el = viewportRef.current;
      if (el) setCanScroll(el.scrollHeight > el.clientHeight + 16);
    });
  };

  return (
    <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(0 0% 5%)' }}>
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-3.5 h-10 border-b" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(0 0% 9%)' }}>
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        </div>

        <div className="flex-1 flex justify-center min-w-0">
          <div className="px-3 py-1 rounded-md font-mono text-[11px] text-muted-foreground truncate max-w-[90%]" style={{ background: 'hsl(0 0% 13%)' }}>
            🔒 {domain}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {total > 1 && (
            <>
              <button
                onClick={onPrev}
                disabled={imgIdx === 0}
                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                aria-label="Previous screenshot"
                title="Previous screenshot"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-mono text-[10px] text-muted-foreground px-0.5">
                {imgIdx + 1}/{total}
              </span>
              <button
                onClick={onNext}
                disabled={imgIdx === total - 1}
                className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-colors"
                aria-label="Next screenshot"
                title="Next screenshot"
              >
                <ChevronRight size={14} />
              </button>
            </>
          )}
          <button
            onClick={onExpand}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors ml-0.5"
            aria-label="Expand fullscreen preview"
            title="Expand fullscreen"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable website viewport */}
      <div className="relative" style={{ background: 'hsl(0 0% 4%)' }}>
        <div
          ref={viewportRef}
          onScroll={(e) => { if (e.currentTarget.scrollTop > 20) setHasScrolled(true); }}
          className="relative w-full max-h-[60vh] min-h-[220px] overflow-y-auto overscroll-contain"
        >
          {!loaded && <div className="absolute inset-0 animate-pulse" style={{ background: 'hsl(0 0% 11%)' }} />}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            className="w-full h-auto block transition-opacity duration-500"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        </div>

        {/* Scroll hint badge for full-page screenshots */}
        {canScroll && !hasScrolled && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-medium text-white bg-black/80 border border-white/15 backdrop-blur-md shadow-lg">
            <ArrowDown size={12} className="animate-bounce" style={{ color: 'hsl(var(--primary))' }} />
            Scroll to explore full page
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneFrame({
  src, alt, loaded, onLoad, onExpand, imgIdx, total, onPrev, onNext,
}: {
  src: string; alt: string; loaded: boolean;
  onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onExpand: () => void;
  imgIdx: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });
  }, [src]);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center justify-center gap-3 w-full">
        {total > 1 && (
          <IconButton label="Previous screen" disabled={imgIdx === 0} onClick={onPrev}>
            <ChevronLeft size={18} />
          </IconButton>
        )}

        <div
          className="relative inline-flex flex-col items-center rounded-[2.25rem] p-2.5 shadow-2xl"
          style={{ background: 'linear-gradient(145deg, hsl(0 0% 18%), hsl(0 0% 8%))', border: '1px solid hsl(0 0% 22%)' }}
        >
          <div
            ref={viewportRef}
            className="relative w-[240px] sm:w-[270px] max-h-[58vh] rounded-[1.75rem] overflow-y-auto overscroll-contain"
            style={{ background: 'hsl(0 0% 4%)' }}
          >
            {!loaded && <div className="w-full h-[460px] animate-pulse" style={{ background: 'hsl(0 0% 11%)' }} />}
            <img
              src={src}
              alt={alt}
              onLoad={onLoad}
              className="w-full h-auto block"
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity .4s' }}
            />
          </div>

          <button
            onClick={onExpand}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/70 hover:bg-black/90 backdrop-blur-md transition-colors"
            aria-label="Expand fullscreen preview"
            title="Expand fullscreen"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {total > 1 && (
          <IconButton label="Next screen" disabled={imgIdx === total - 1} onClick={onNext}>
            <ChevronRight size={18} />
          </IconButton>
        )}
      </div>
    </div>
  );
}

function NavTile({ item, dir, onClick }: { item: PortfolioItem | null; dir: 'prev' | 'next'; onClick: () => void }) {
  if (!item) return <div className={dir === 'prev' ? 'border-r' : ''} style={{ borderColor: 'hsl(var(--border))' }} />;
  const isNext = dir === 'next';
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 p-4 md:p-6 text-left transition-colors hover:bg-white/[0.03] ${isNext ? 'flex-row-reverse text-right' : 'border-r'}`}
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all group-hover:border-primary group-hover:text-primary"
        style={{ borderColor: 'hsl(var(--border))' }}
      >
        {isNext ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </span>
      {item.images?.[0] && (
        <div className="hidden md:flex items-center justify-center w-20 h-12 rounded-lg overflow-hidden border p-0.5 shrink-0" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(0 0% 4%)' }}>
          <img src={item.images[0]} alt="" className="w-full h-full object-contain" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{isNext ? 'Next project' : 'Previous project'}</p>
        <p className="font-semibold text-sm md:text-base text-foreground truncate group-hover:text-primary transition-colors">{item.title}</p>
      </div>
    </button>
  );
}
