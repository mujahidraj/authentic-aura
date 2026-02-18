import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import faqData from '../data/faq.json';
import { SectionWrapper } from './SectionWrapper';

const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="scroll-mt-24 py-24 bg-black/20 border-y border-white/5">
      <SectionWrapper className="px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest">
            <HelpCircle size={14} />
            Got Questions?
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Frequently Asked Questions<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item) => (
            <div 
              key={item.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openId === item.id 
                ? 'bg-white/[0.05] border-primary/40' 
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-bold text-white pr-8">
                  {item.question}
                </span>
                <div className={`shrink-0 p-1 rounded-full transition-colors ${openId === item.id ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                  {openId === item.id ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-white/5 mt-2 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-muted-foreground font-mono text-sm">
                Still have questions? <span className="text-primary underline cursor-pointer hover:text-primary/80">Drop me a message</span>
            </p>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default FAQSection;