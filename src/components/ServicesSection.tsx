/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Code, PenTool, Cloud, MessageSquare, ArrowRight } from 'lucide-react'; // Import icons
import servicesData from '../data/services.json';
import { SectionWrapper } from './SectionWrapper';

// Icon Map
const iconMap: any = {
  Code,
  PenTool,
  Cloud,
  MessageSquare
};

const ServicesSection = () => {
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
          {servicesData.map((service, i) => {
            const Icon = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div className="absolute top-8 right-8 text-white/10 group-hover:text-primary/20 transition-colors duration-300">
                   <Icon size={64} strokeWidth={1} />
                </div>

                <div className="relative z-10">
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

                  <div className="flex items-center gap-2 text-sm font-bold text-white opacity-60 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300 cursor-pointer">
                    <span>Learn more</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </SectionWrapper>
    </section>
  );
};

export default ServicesSection;