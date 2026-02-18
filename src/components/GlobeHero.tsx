import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

const BANGLADESH = { lat: 23.685, lng: 90.3563 };

export function GlobeHero({ onScrollToWork }: { onScrollToWork?: () => void }) {
  const globeRef = useRef<HTMLDivElement>(null);
  const [GlobeComponent, setGlobeComponent] = useState<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const globeInstance = useRef<any>(null);

  useEffect(() => {
    // Dynamically import globe to avoid SSR issues
    import('react-globe.gl').then((mod) => {
      setGlobeComponent(() => mod.default);
    });
  }, []);

  const markers = [
    {
      lat: BANGLADESH.lat,
      lng: BANGLADESH.lng,
      size: 0.8,
      color: 'hsl(38, 95%, 60%)',
      label: 'Dhaka, Bangladesh',
    },
  ];

  const arcs = [
    { startLat: BANGLADESH.lat, startLng: BANGLADESH.lng, endLat: 42.36, endLng: -71.09, color: ['hsl(38,95%,60%)', 'hsl(185,100%,50%)'] },
    { startLat: BANGLADESH.lat, startLng: BANGLADESH.lng, endLat: 48.85, endLng: 2.35, color: ['hsl(38,95%,60%)', 'hsl(185,100%,50%)'] },
    { startLat: BANGLADESH.lat, startLng: BANGLADESH.lng, endLat: 1.35, endLng: 103.82, color: ['hsl(38,95%,60%)', 'hsl(185,100%,50%)'] },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, hsl(38 95% 60% / 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Globe container */}
      <div
        ref={globeRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: globeReady ? 1 : 0, transition: 'opacity 1.2s ease' }}
      >
        {GlobeComponent && (
          <GlobeComponent
            ref={globeInstance}
            width={typeof window !== 'undefined' ? window.innerWidth : 1200}
            height={typeof window !== 'undefined' ? window.innerHeight : 800}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            atmosphereColor="hsl(38, 95%, 60%)"
            atmosphereAltitude={0.12}
            pointsData={markers}
            pointAltitude={0.02}
            pointRadius="size"
            pointColor="color"
            pointLabel="label"
            arcsData={arcs}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={3000}
            arcStroke={0.4}
            arcAltitude={0.15}
            onGlobeReady={() => {
              setGlobeReady(true);
              if (globeInstance.current) {
                // Center on Bangladesh
                globeInstance.current.pointOfView(
                  { lat: BANGLADESH.lat, lng: BANGLADESH.lng, altitude: 2.2 },
                  1000
                );
                // Auto-rotate
                globeInstance.current.controls().autoRotate = true;
                globeInstance.current.controls().autoRotateSpeed = 0.5;
                globeInstance.current.controls().enableZoom = false;
                globeInstance.current.controls().enablePan = false;
              }
            }}
          />
        )}
      </div>

      {/* Hero text overlay */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label mb-6 tracking-[0.5em]">
            Full-Stack Engineer · Data Scientist · Researcher
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-6"
        >
          <span className="text-foreground">Your</span>{' '}
          <span className="text-gradient-primary text-glow-primary">Name</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Building intelligent systems at the intersection of data, design & the Global South.{' '}
          <span style={{ color: 'hsl(var(--primary))' }}>Based in Dhaka, Bangladesh.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="flex items-center justify-center gap-4 pointer-events-auto"
        >
          <MagneticButton>
            <button
              onClick={onScrollToWork}
              className="px-8 py-3.5 rounded-full font-mono text-sm font-medium transition-all duration-300 glow-primary"
              style={{
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              View My Work ↓
            </button>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full font-mono text-sm font-medium border transition-all duration-300"
              style={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            >
              Let's Talk
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bangladesh beacon overlay */}
      {globeReady && (
        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
          <div className="relative w-3 h-3">
            <div
              className="absolute inset-0 rounded-full animate-pulse-beacon"
              style={{ background: 'hsl(var(--primary))' }}
            />
            <div
              className="absolute inset-0 rounded-full animate-beacon-ring"
              style={{ background: 'hsl(var(--primary) / 0.4)' }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Dhaka, Bangladesh · 23.68°N 90.35°E
          </span>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.6), transparent)' }}
        />
        <span className="font-mono text-xs text-muted-foreground tracking-widest">SCROLL</span>
      </motion.div>
    </div>
  );
}
