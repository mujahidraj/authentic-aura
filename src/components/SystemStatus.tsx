import { useState, useEffect } from 'react';
import { Wifi, Radio, Battery, Zap, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemStatus = () => {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Auto-update time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate status based on Dhaka time (UTC+6)
  const getStatus = () => {
    const hours = time.getUTCHours() + 6; // Dhaka Offset
    const adjustedHour = hours >= 24 ? hours - 24 : hours;

    if (adjustedHour >= 5 && adjustedHour < 9) return "Recharging";
    if (adjustedHour >= 9 && adjustedHour < 18) return "Online / Working";
    if (adjustedHour >= 18 && adjustedHour < 22) return "Learning / R&D";
    return "Deep Focus / Sleep";
  };

  // Mock Music Data (You can connect Last.fm API later)
  const currentTrack = {
    artist: "Daft Punk",
    song: "Veridis Quo",
    isPlaying: true
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 font-mono text-xs md:text-sm">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mb-4 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-white/5 p-3 flex justify-between items-center border-b border-white/5">
              <span className="text-gray-400">SYSTEM DIAGNOSTICS</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
              </div>
            </div>

            {/* Metrics */}
            <div className="p-4 space-y-4">
              {/* Location & Time */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">LOC</span>
                <span className="text-white">DHAKA, BD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">UTC+6</span>
                <span className="text-amber-500">
                  {time.toLocaleTimeString('en-US', { 
                    timeZone: 'Asia/Dhaka', 
                    hour12: false 
                  })}
                </span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">STATUS</span>
                <span className="text-emerald-400 animate-pulse">{getStatus().toUpperCase()}</span>
              </div>

              {/* Music Player */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded bg-white/5 ${currentTrack.isPlaying ? 'animate-spin-slow' : ''}`}>
                    <Disc size={16} className="text-cyan-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white truncate text-[10px] uppercase tracking-wider">Now Playing</p>
                    <div className="flex gap-1 items-center">
                       {/* Audio Bars Animation */}
                       {[1,2,3].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ height: [4, 12, 4] }}
                           transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                           className="w-1 bg-cyan-500 rounded-full"
                         />
                       ))}
                       <p className="text-gray-300 truncate ml-1">{currentTrack.artist} - {currentTrack.song}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button (Always Visible) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-white/20 transition-all shadow-lg group"
      >
        <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
        </div>
        
        <span className="hidden md:inline">SYSTEM ONLINE</span>
        
        {/* Decorative Specs */}
        <div className="hidden md:flex gap-2 text-[10px] text-gray-500 border-l border-white/10 pl-3 ml-1">
            <span className="flex items-center gap-1"><Wifi size={10} /> 120ms</span>
            <span className="flex items-center gap-1"><Zap size={10} /> 98%</span>
        </div>
      </motion.button>
    </div>
  );
};

export default SystemStatus;