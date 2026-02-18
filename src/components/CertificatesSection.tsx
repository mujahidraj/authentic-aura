import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, Hash } from 'lucide-react';
import certificatesData from '../data/certificates.json';
// Assuming you have a SectionWrapper component, otherwise use a simple div
import { SectionWrapper } from './SectionWrapper'; 

const CertificatesSection = () => {
  return (
    <section id="achievements" className="scroll-mt-20">
      <SectionWrapper className="w-full px-4 md:px-8 max-w-7xl mx-auto py-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Achievements<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm max-w-md leading-relaxed">
              VALIDATED EXPERTISE • INDUSTRY RECOGNITION
            </p>
          </div>
          <div className="hidden md:block h-[1px] flex-1 bg-white/10 mx-8 relative top-[-10px]" />
          <div className="font-mono text-xs text-primary/80 border border-primary/20 px-3 py-1 rounded-full">
            {certificatesData.length} CREDENTIALS
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificatesData.map((cert, i) => (
            <motion.a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative flex flex-col justify-between p-6 h-full min-h-[220px] bg-white/5 border border-white/10 hover:border-primary/50 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] overflow-hidden"
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top Row: Icon & Date */}
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300 text-primary">
                  <Award size={24} />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                  <Calendar size={10} />
                  <span>{cert.date}</span>
                </div>
              </div>

              {/* Middle Row: Content */}
              <div className="relative z-10 space-y-2 mb-6">
                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  {cert.issuer}
                </p>
              </div>

              {/* Bottom Row: Footer Info */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <Hash size={10} />
                  <span className="truncate max-w-[120px]">{cert.credentialId}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs font-bold text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span>Verify</span>
                  <ExternalLink size={12} />
                </div>
              </div>

            </motion.a>
          ))}
        </div>

      </SectionWrapper>
    </section>
  );
};

export default CertificatesSection;