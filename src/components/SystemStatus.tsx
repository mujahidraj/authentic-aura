import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Wifi, Zap, Disc, Play, Pause, SkipBack, SkipForward, Sparkles, X, ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 'xAR6N9N8e6U',
    title: 'Deep Focus Mix for Coding',
    artist: 'Chill Music Lab',
    url: 'https://youtu.be/xAR6N9N8e6U?si=azhFCicQM_OKG5cZ',
  },
  {
    id: 'kJ_UgmUu4Vc',
    title: 'The Best Developer Song',
    artist: 'ASIM ANSARI',
    url: 'https://youtu.be/kJ_UgmUu4Vc?si=HSDUqt-gkFDl8LDs',
  },
  {
    id: 'olz4yipZR1M',
    title: "Full Stack — Developer's Anthem",
    artist: 'Rawinhood09',
    url: 'https://youtu.be/olz4yipZR1M?si=luBLjUQazjKU1y4g',
  },
];

const CURRENT_FOCUS = [
  'Exploring No-Code AI Automation (n8n, Zapier, Make)',
  'Exploring LLMs & Prompt Workflows',
  'Building Full-Stack Web & Android Apps',
  'Future Goal: Coded AI Automation (In Shaa Allah)',
];

const SystemStatus = () => {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasLoadedIframe, setHasLoadedIframe] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentTrack = TRACKS[trackIdx];

  // Auto-update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate status based on Dhaka time (UTC+6)
  const getStatus = () => {
    const hours = time.getUTCHours() + 6;
    const adjustedHour = hours >= 24 ? hours - 24 : hours;

    if (adjustedHour >= 5 && adjustedHour < 9) return 'Recharging';
    if (adjustedHour >= 9 && adjustedHour < 18) return 'Online / Working';
    if (adjustedHour >= 18 && adjustedHour < 22) return 'Learning / R&D';
    return 'Deep Focus / Sleep';
  };

  const formattedTime = time.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const sendCommand = useCallback((func: 'playVideo' | 'pauseVideo') => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  }, []);

  // Ensure default playback starts on load and resumes on first user gesture if browser blocks initial unmuted autoplay
  useEffect(() => {
    const unlockAudio = () => {
      if (isPlayingRef.current) {
        sendCommand('playVideo');
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [sendCommand]);

  const togglePlay = () => {
    if (!hasLoadedIframe) {
      setHasLoadedIframe(true);
      setIsPlaying(true);
      return;
    }
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  };

  const selectTrack = (nextIndex: number) => {
    const normalized = (nextIndex + TRACKS.length) % TRACKS.length;
    setTrackIdx(normalized);
    setHasLoadedIframe(true);
    setIsPlaying(true);
  };

  const content = (
    <div className="fixed bottom-5 left-5 z-[300] font-mono text-xs md:text-sm">
      {/* Persistent hidden YouTube player so audio continues even when panel is closed */}
      {hasLoadedIframe && (
        <iframe
          ref={iframeRef}
          key={currentTrack.id}
          src={`https://www.youtube.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=1&playsinline=1&rel=0&loop=1&playlist=${currentTrack.id}`}
          title={currentTrack.title}
          allow="autoplay; encrypted-media"
          onLoad={() => {
            if (isPlayingRef.current) {
              setTimeout(() => sendCommand('playVideo'), 300);
            }
          }}
          className="w-1 h-1 opacity-0 pointer-events-none fixed -bottom-10 -left-10"
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2.5 w-[300px] sm:w-[330px] max-h-[calc(100vh-120px)] flex flex-col bg-black/95 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-white/5 px-3.5 py-2.5 flex justify-between items-center border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                </div>
                <span className="text-gray-300 text-[11px] tracking-wider uppercase font-semibold">
                  System &amp; Current Status
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close status panel"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-3.5 space-y-3 overflow-y-auto overscroll-contain">
              {/* Open to Work Banner */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-300 font-bold text-xs tracking-wide uppercase">
                    Currently Open to Work
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>

              {/* Currently Exploring / Focus */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
                  <Sparkles size={11} />
                  <span>Currently Exploring &amp; Building</span>
                </div>
                <ul className="space-y-1.5">
                  {CURRENT_FOCUS.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-[11px] text-gray-300 leading-snug bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-lg"
                    >
                      <span className="text-primary mt-0.5">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location, Time (AM/PM) & Activity Mode */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">LOC</span>
                  <span className="text-white">DHAKA, BD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">LOCAL TIME (UTC+6)</span>
                  <span className="text-amber-400 font-semibold">{formattedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">MODE</span>
                  <span className="text-emerald-400">{getStatus().toUpperCase()}</span>
                </div>
              </div>

              {/* Interactive Music Player */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">
                    Now Playing • Track {trackIdx + 1}/{TRACKS.length}
                  </span>
                  <a
                    href={currentTrack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                    title="Open on YouTube"
                  >
                    YouTube <ExternalLink size={10} />
                  </a>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 flex items-center justify-center shrink-0 transition-colors"
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {isPlaying ? (
                        <div className="flex gap-0.5 items-end h-3 shrink-0">
                          {[1, 2, 3].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [3, 11, 3] }}
                              transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.12 }}
                              className="w-0.5 bg-cyan-400 rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <Disc size={12} className="text-gray-400 shrink-0" />
                      )}
                      <p className="text-white font-semibold truncate text-xs">
                        {currentTrack.title}
                      </p>
                    </div>
                    <p className="text-gray-400 truncate text-[10px]">{currentTrack.artist}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => selectTrack(trackIdx - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 flex items-center justify-center transition-colors"
                      aria-label="Previous track"
                      title="Previous track"
                    >
                      <SkipBack size={12} />
                    </button>
                    <button
                      onClick={() => selectTrack(trackIdx + 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 flex items-center justify-center transition-colors"
                      aria-label="Next track"
                      title="Next track"
                    >
                      <SkipForward size={12} />
                    </button>
                  </div>
                </div>

                {/* Quick track switcher pills */}
                <div className="grid grid-cols-3 gap-1.5">
                  {TRACKS.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => selectTrack(i)}
                      className={`px-2 py-1 rounded-lg text-[10px] truncate border transition-all ${
                        i === trackIdx
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                          : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title={t.title}
                    >
                      #{i + 1} {t.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button (Always Visible on Bottom-Left) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-3 px-4 py-2.5 bg-black/75 backdrop-blur-md border border-white/15 rounded-full text-gray-200 hover:text-white hover:border-primary/50 transition-all shadow-xl group"
      >
        <div className="relative flex items-center">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
        </div>

        <span className="text-xs font-semibold tracking-wider">
          {isPlaying ? '♪ PLAYING • STATUS' : 'SYSTEM ONLINE • STATUS'}
        </span>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-400 border-l border-white/10 pl-3">
          <span className="text-amber-400">{formattedTime}</span>
          <span className="flex items-center gap-1"><Wifi size={10} /> 120ms</span>
          <span className="flex items-center gap-1"><Zap size={10} /> 98%</span>
        </div>
      </motion.button>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};

export default SystemStatus;
