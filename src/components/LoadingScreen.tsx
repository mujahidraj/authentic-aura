import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';

const loadingTexts = [
  "Initializing Neural Core...",
  "Loading Modules...",
  "Verifying System Integrity...",
  "Establishing Secure Connection...",
  "Access Granted."
];

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    // Cycle through status texts based on progress
    const totalTexts = loadingTexts.length;
    const step = 100 / totalTexts;
    const currentText = Math.floor(progress / step);
    if (currentText < totalTexts) {
      setTextIndex(currentText);
    }
  }, [progress]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Slight delay at 100% before lifting
          return 100;
        }
        // Random increment for realistic "loading" feel
        const increment = Math.random() * 2 + 0.5; 
        return Math.min(prev + increment, 100);
      });
    }, 30); // Base speed

    return () => clearInterval(timer);
  }, [onComplete]);

  // "Turbo Mode" - Clicking speeds up the loader
  const handleTurbo = () => {
    setProgress((prev) => Math.min(prev + 15, 100));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white cursor-pointer"
      onClick={handleTurbo}
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Custom bezier for smooth "heavy" lift
      }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
        
        {/* Profile Image & Rings */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Rotating Rings (Decorative) */}
          <motion.div 
            className="absolute inset-0 border-t-2 border-primary/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 border-r-2 border-primary/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Static Profile Image */}
          <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
            <img 
              src="https://github.com/mujahidraj.png" 
              alt="Mujahid Rashid" 
              className="w-full h-full object-cover filter "
            />
          </div>
        </div>

        {/* Name & Identity */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-display font-bold text-white tracking-wide">
            Moizuddin Mohamamd Mujahid Rashid
          </h2>
          <p className="text-xs font-mono text-primary/80 uppercase tracking-[0.2em]">
            System Online
          </p>
        </div>

        {/* Counter & Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-end">
            <motion.span 
              key={textIndex} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-muted-foreground uppercase tracking-widest"
            >
              {loadingTexts[textIndex]}
            </motion.span>
            <span className="font-display font-bold text-4xl text-white/20">
              {Math.round(progress).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] font-mono text-gray-600 animate-pulse mt-4">
          Click anywhere to accelerate
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;