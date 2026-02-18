import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Send, Loader2 } from 'lucide-react';
import type { PricingData } from '../hooks/usePortfolioData';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  projectType: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingData;
}

export function ContactPanel({ isOpen, onClose, pricing }: ContactPanelProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    console.log('Contact form:', data);
    setSending(false);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); reset(); onClose(); }, 3000);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl font-mono text-sm outline-none transition-all duration-200 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[400]"
            style={{ background: 'hsl(var(--background) / 0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[401] w-full max-w-md glass-strong noise-overlay overflow-y-auto"
          >
            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="section-label mb-2">// Contact</p>
                  <h2 className="font-display text-3xl font-bold text-foreground">Let's Talk</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Available for select freelance engagements.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
                >
                  <X size={16} />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-5xl mb-4">✦</div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent</h3>
                  <p className="text-muted-foreground font-mono text-sm">I'll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Name</label>
                    <input {...register('name')} placeholder="Your name" className={inputClass} />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                    <input {...register('email')} type="email" placeholder="your@email.com" className={inputClass} />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Project Type</label>
                    <select {...register('projectType')} className={inputClass}>
                      <option value="">Select a service...</option>
                      {pricing.categories.map(c => (
                        <option key={c.id} value={c.type}>{c.type} — {c.rateProject}</option>
                      ))}
                    </select>
                    {errors.projectType && <p className="text-red-400 text-xs mt-1 font-mono">{errors.projectType.message}</p>}
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell me about your project..."
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1 font-mono">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 rounded-xl font-mono text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 glow-primary"
                    style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}

              {/* Pricing teasers */}
              <div className="mt-10 pt-8 border-t" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">Rates</p>
                <div className="space-y-2">
                  {pricing.categories.map(c => (
                    <div key={c.id} className="flex items-center justify-between">
                      <span className="font-mono text-xs text-foreground">{c.type}</span>
                      <span className="font-mono text-xs" style={{ color: 'hsl(var(--primary))' }}>
                        ${c.rateHourly}/hr
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-4 leading-relaxed">{pricing.note}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
