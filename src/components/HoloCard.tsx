import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const HoloCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 1. Smooth Physics (Springs)
  // These create the "weight" feeling when you move the mouse
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  // 2. Map Mouse Position to Rotation
  // Moving mouse left rotates card y-axis right, etc.
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // 3. Map Mouse to Sheen/Glare Position
  // The "Foil" gradient moves opposite to the rotation for realism
  const sheenPosition = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    
    const mouseXRel = e.clientX - rect.left;
    const mouseYRel = e.clientY - rect.top;
    
    // Normalize values between -0.5 and 0.5
    const xPct = (mouseXRel / width) - 0.5;
    const yPct = (mouseYRel / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Snap back to center when mouse leaves
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex justify-center items-center py-32 perspective-[1000px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[340px] h-[220px] rounded-xl bg-black group cursor-pointer"
      >
        {/* --- FRONT OF CARD --- */}
        <div 
          className="absolute inset-0 rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col justify-between p-6 backface-hidden shadow-2xl"
          style={{ transform: "translateZ(1px)" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-display font-bold text-white tracking-wide">MUJAHID RAJ</h3>
              <p className="text-xs font-mono text-emerald-400 tracking-widest mt-1">FULL STACK ENGINEER</p>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Texture Overlay (Noise) */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          {/* Middle Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Footer / Socials */}
          <div className="relative z-10 flex justify-between items-end">
            <div className="flex gap-4 text-gray-400">
               <a href="https://github.com/mujahidraj" target="_blank" rel="noreferrer">
                 <Github size={18} className="hover:text-white transition-colors" />
               </a>
               <a href="mailto:mujahidraj65@gmail.com">
                 <Mail size={18} className="hover:text-white transition-colors" />
               </a>
               <a href="#" target="_blank">
                 <Linkedin size={18} className="hover:text-white transition-colors" />
               </a>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-mono text-gray-500">DHAKA, BD</p>
               <p className="text-[10px] font-mono text-gray-500">23.68° N, 90.35° E</p>
            </div>
          </div>
        </div>

        {/* --- HOLOGRAPHIC FOIL LAYER --- */}
        <motion.div 
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none mix-blend-color-dodge"
            style={{
                // Rainbow gradient
                background: `linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.4) 45%, rgba(16, 185, 129, 0.6) 50%, rgba(59, 130, 246, 0.6) 55%, transparent 80%)`,
                backgroundSize: "200% 200%",
                backgroundPositionX: sheenPosition, // Moves with mouse
                transform: "translateZ(2px)"
            }}
        />

        {/* --- BACK GLOW (Ambient Light) --- */}
        <div 
            className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-emerald-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
        />

      </motion.div>
    </div>
  );
};

export default HoloCard;