import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Quote } from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

const AudioTestimonials = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (id: string, audioSrc: string) => {
    if (activeId === id) {
      // Pause current
      audioRef.current?.pause();
      setActiveId(null);
    } else {
      // Play new
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
        setActiveId(id);
      }
    }
  };

  useEffect(() => {
    // Handle audio ending
    const audio = audioRef.current;
    const handleEnded = () => setActiveId(null);
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-32 px-4">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="mb-12 text-center">
        <h3 className="text-3xl font-display font-bold text-white mb-2">Sonic Trust</h3>
        <p className="text-gray-400 font-mono text-sm">Client Voice Notes • Authenticated Feedback</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.map((t) => {
          const isPlaying = activeId === t.id;
          
          return (
            <motion.div
              key={t.id}
              whileHover={{ y: -5 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                isPlaying 
                ? 'bg-zinc-900 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12 rotate-180" />

              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-none mb-1">{t.name}</h4>
                  <p className="text-xs text-gray-500 font-mono">{t.role} @ {t.company}</p>
                </div>
              </div>

              {/* Text Snippet */}
              <p className="text-gray-300 text-sm italic mb-6 leading-relaxed opacity-80">
                "{t.text}"
              </p>

              {/* Audio Player UI */}
              <div 
                onClick={() => togglePlay(t.id, t.audio)}
                className="w-full bg-black/50 rounded-xl p-2 flex items-center gap-3 cursor-pointer group hover:bg-white/5 transition-colors border border-white/5"
              >
                {/* Play Button */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isPlaying ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black'
                }`}>
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </div>

                {/* The Visualizer Bars */}
                <div className="flex-1 h-8 flex items-center gap-[2px] overflow-hidden mask-image-gradient">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      // Animate height if playing, otherwise static small height
                      animate={{ 
                        height: isPlaying ? [4, Math.random() * 24 + 4, 4] : 4,
                        backgroundColor: isPlaying ? '#10b981' : '#3f3f46'
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: i * 0.05 // Stagger effect
                      }}
                      className="w-1 rounded-full"
                    />
                  ))}
                </div>
                
                <span className="text-[10px] font-mono text-gray-500">
                   {isPlaying ? "PLAYING" : "0:14"}
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTestimonials;