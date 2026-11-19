/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, PenTool, Cloud, MessageSquare, BarChart3, ArrowRight, Settings, Globe, Bot,
  X, ChevronLeft, ChevronRight, CheckCircle2, Wrench, Briefcase, ArrowUpRight, Sparkles,
} from 'lucide-react';
import servicesData from '../data/services.json';
import { SectionWrapper } from './SectionWrapper';

interface ProvenWork {
  name: string;
  summary: string;
  url: string | null;
}

interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  whatICanDo: string[];
  whatIKnow: string[];
  provenWork: ProvenWork[];
}

const services = servicesData as ServiceItem[];

// Icon Map
const iconMap: Record<string, any> = {
  Code,
  PenTool,
  Cloud,
  MessageSquare,
  BarChart3,
  Settings,
  Globe,
  Bot,
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="service" className="scroll-mt-24">
      <SectionWrapper className="w-full px-4 md:px-8 max-w-7xl mx-auto py-24">

        {/* Header */}
        <div className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Services<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive solutions tailored to elevate your digital presence and optimize operations.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => setSelectedService(service)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedService(service);
                  }
                }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:bg-white/[0.07] cursor-pointer text-left"
              >
                <div className="absolute top-8 right-8 text-white/10 group-hover:text-primary/20 transition-colors duration-300">
                  <Icon size={64} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white opacity-70 group-hover:opacity-100 group-hover:text-primary group-hover:gap-3 transition-all duration-300">
                    <span>Explore capabilities</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </SectionWrapper>

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   SERVICE DETAIL MODAL — Portal-rendered, keyboard-navigable
   ═══════════════════════════════════════════════════════ */
function ServiceDetailModal({
  service,
  onClose,
  onNavigate,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onNavigate: (s: ServiceItem) => void;
}) {
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const index = service ? services.findIndex(s => s.id === service.id) : -1;
  const prev = index > 0 ? services[index - 1] : null;
  const next = index >= 0 && index < services.length - 1 ? services[index + 1] : null;

  const go = useCallback((target: ServiceItem | null, dir: number) => {
    if (!target) return;
    setDirection(dir);
    onNavigate(target);
  }, [onNavigate]);

  useEffect(() => {
    if (service) {
      scrollRef.current?.scrollTo({ top: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [service]);

  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(prev, -1);
      else if (e.key === 'ArrowRight') go(next, 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [service, onClose, go, prev, next]);

  const Icon = service ? (iconMap[service.icon] || Code) : Code;

  const modalContent = (
    <AnimatePresence>
      {service && (
        <motion.div
          key="service-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'hsl(0 0% 0% / 0.82)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={service.title}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[88vh] flex flex-col overflow-hidden rounded-t-3xl md:rounded-3xl"
            style={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 40px 120px hsl(0 0% 0% / 0.7), 0 0 0 1px hsl(var(--primary) / 0.08)',
            }}
          >
            {/* ─── Top Bar ─── */}
            <div
              className="relative z-20 flex items-center gap-3 px-4 md:px-6 h-14 shrink-0 border-b"
              style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--card) / 0.92)', backdropFilter: 'blur(10px)' }}
            >
              <div className="md:hidden absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/15" />

              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold"
                style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.25)' }}
              >
                <Sparkles size={11} /> Service Capabilities
              </span>

              <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                {String(index + 1).padStart(2, '0')} <span className="opacity-40">/ {String(services.length).padStart(2, '0')}</span>
              </span>

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => go(prev, -1)}
                  disabled={!prev}
                  title="Previous service (←)"
                  aria-label="Previous service"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none"
                  style={{ color: 'hsl(var(--foreground) / 0.8)', border: '1px solid hsl(var(--border))' }}
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  onClick={() => go(next, 1)}
                  disabled={!next}
                  title="Next service (→)"
                  aria-label="Next service"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none"
                  style={{ color: 'hsl(var(--foreground) / 0.8)', border: '1px solid hsl(var(--border))' }}
                >
                  <ChevronRight size={17} />
                </button>
                <div className="w-px h-5 mx-1" style={{ background: 'hsl(var(--border))' }} />
                <button
                  onClick={onClose}
                  title="Close (Esc)"
                  aria-label="Close"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ color: 'hsl(var(--foreground) / 0.8)', border: '1px solid hsl(var(--border))' }}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* ─── Scrollable Content ─── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={service.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 35 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -35 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 md:p-8 space-y-8"
                >
                  {/* Hero Header */}
                  <div
                    className="relative p-6 rounded-2xl border overflow-hidden"
                    style={{
                      background: 'radial-gradient(circle at top right, hsl(var(--primary) / 0.12), transparent 65%), hsl(var(--muted) / 0.35)',
                      borderColor: 'hsl(var(--border))',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.3)' }}
                      >
                        <Icon size={28} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1">
                          {service.title}
                        </h3>
                        <p className="text-sm md:text-base font-medium mb-3" style={{ color: 'hsl(var(--primary))' }}>
                          {service.tagline}
                        </p>
                        <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.78)' }}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* What I Can Do */}
                  <section>
                    <div className="flex items-center gap-2.5 mb-4">
                      <CheckCircle2 size={15} style={{ color: 'hsl(var(--primary))' }} />
                      <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        What I Can Do
                      </h4>
                      <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.whatICanDo.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-xl border"
                          style={{ background: 'hsl(var(--muted) / 0.35)', borderColor: 'hsl(var(--border))' }}
                        >
                          <span
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold mt-0.5"
                            style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* What I Know */}
                  <section>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Wrench size={15} style={{ color: 'hsl(var(--primary))' }} />
                      <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        What I Know · Stack &amp; Tools ({service.whatIKnow.length})
                      </h4>
                      <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.whatIKnow.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-lg font-mono text-xs font-medium border"
                          style={{
                            background: 'hsl(var(--muted) / 0.55)',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground) / 0.88)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Proven Work */}
                  {service.provenWork.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2.5 mb-4">
                        <Briefcase size={15} style={{ color: 'hsl(var(--primary))' }} />
                        <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Proven In Real Work
                        </h4>
                        <div className="flex-1 h-px" style={{ background: 'hsl(var(--border))' }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.provenWork.map((work) => {
                          const CardTag = work.url ? 'a' : 'div';
                          return (
                            <CardTag
                              key={work.name}
                              {...(work.url ? { href: work.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className={`group p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-2 ${
                                work.url ? 'hover:border-primary/50 hover:bg-white/[0.04]' : ''
                              }`}
                              style={{ background: 'hsl(var(--muted) / 0.3)', borderColor: 'hsl(var(--border))' }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                  {work.name}
                                </span>
                                {work.url && (
                                  <ArrowUpRight
                                    size={14}
                                    className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                                  />
                                )}
                              </div>
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {work.summary}
                              </p>
                            </CardTag>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ─── Prev / Next Footer ─── */}
              <div className="grid grid-cols-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                {prev ? (
                  <button
                    onClick={() => go(prev, -1)}
                    className="group flex items-center gap-3 p-4 md:p-5 text-left border-r transition-colors hover:bg-white/[0.03]"
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    <span
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border group-hover:border-primary group-hover:text-primary transition-colors"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <ChevronLeft size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Previous</p>
                      <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{prev.title}</p>
                    </div>
                  </button>
                ) : (
                  <div className="border-r" style={{ borderColor: 'hsl(var(--border))' }} />
                )}

                {next ? (
                  <button
                    onClick={() => go(next, 1)}
                    className="group flex items-center justify-end gap-3 p-4 md:p-5 text-right transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Next</p>
                      <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{next.title}</p>
                    </div>
                    <span
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border group-hover:border-primary group-hover:text-primary transition-colors"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <ChevronRight size={16} />
                    </span>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export default ServicesSection;
