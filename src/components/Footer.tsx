/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, MessageCircle, Send, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

const Footer = ({ navLinks, onContactOpen }: { navLinks: any[], onContactOpen: () => void }) => {
  return (
    <footer className="relative border-t border-white/10 bg-[#050505] pt-16 pb-8 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="px-6 md:px-12 lg:px-20 max-w-8xl mx-auto">
        
        {/* TOP SECTION: Identity */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-4">
            {/* Logo placeholder - Replace src with your actual logo path */}
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-display font-bold text-black text-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              M
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white leading-none">Mujahid Rashid</h2>
              <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mt-1">Full Stack Engineer</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {[
              { icon: <Linkedin size={16} />, href: "#" },
              { icon: <Twitter size={16} />, href: "#" },
              { icon: <Instagram size={16} />, href: "#" },
              { icon: <MessageCircle size={16} />, href: "https://wa.me/8801796059406" },
            ].map((social, i) => (
              <a key={i} href={social.href} className="p-2 bg-white/5 border border-white/5 rounded-lg text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* LEFT SECTION: Nav & Contact Info */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-display text-sm font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
              <nav className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group">
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-white font-display text-sm font-bold mb-4 uppercase tracking-wider">Office</h4>
                <p className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                  <MapPin size={14} className="text-primary" /> Dhaka, Bangladesh
                </p>
              </div>
              <div>
                <h4 className="text-white font-display text-sm font-bold mb-4 uppercase tracking-wider">Direct</h4>
                <a href="mailto:mujahidraj65@gmail.com" className="block text-sm text-muted-foreground hover:text-primary font-mono mb-2">mujahidraj65@gmail.com</a>
                <a href="tel:+8801796059406" className="block text-sm text-muted-foreground hover:text-primary font-mono">+8801796059406</a>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: The Form (More Compact) */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-display font-bold text-white mb-4">Send a quick inquiry</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all" />
                <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all" />
                <textarea placeholder="Your message..." rows={2} className="md:col-span-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all resize-none" />
                <button className="md:col-span-2 group flex items-center justify-center gap-2 bg-primary text-black font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-all text-xs uppercase tracking-widest">
                  Send Inquiry <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider">
              Developed by <span className="text-primary">TechWisdom Technologies</span> & <span className="text-primary">Mujahid Rashid</span>
            </p>
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] opacity-40 mt-1">
              © {new Date().getFullYear()} — All Rights Reserved
            </p>
          </div>

          <MagneticButton>
            <button 
              onClick={onContactOpen}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-all group"
            >
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Status: Active
            </button>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
};

export default Footer;