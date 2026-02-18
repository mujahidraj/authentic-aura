'use client';
import { useEffect, useRef, useState } from 'react';

type CursorType = 'default' | 'ds' | 'publication' | 'link';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      const el = e.target as HTMLElement;
      if (el.closest('[data-cursor="ds"]')) setCursorType('ds');
      else if (el.closest('[data-cursor="publication"]')) setCursorType('publication');
      else if (el.closest('a, button, [role="button"]')) setCursorType('link');
      else setCursorType('default');
    };

    const animate = () => {
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.12;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${dotPos.current.x - 24}px, ${dotPos.current.y - 24}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', moveCursor);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Cursor ring color and content per type
  const ringColor =
    cursorType === 'ds' ? 'hsl(var(--accent))' :
    cursorType === 'publication' ? 'hsl(var(--primary))' :
    cursorType === 'link' ? 'hsl(var(--foreground))' :
    'hsl(var(--muted-foreground) / 0.5)';

  const dotColor =
    cursorType === 'ds' ? 'hsl(var(--accent))' :
    cursorType === 'publication' ? 'hsl(var(--primary))' :
    'hsl(var(--foreground))';

  const ringSize = cursorType !== 'default' ? 52 : 44;

  const CursorIcon = () => {
    if (cursorType === 'ds') return <span className="font-mono font-bold text-[11px]" style={{ color: 'hsl(var(--accent))' }}>{'{}'}</span>;
    if (cursorType === 'publication') return (
      // Eye icon SVG
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
    if (cursorType === 'link') return <span className="font-mono text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>↗</span>;
    return null;
  };

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center will-change-transform"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border: `1.5px solid ${ringColor}`,
          opacity: isVisible ? 1 : 0,
          transition: 'border-color 0.25s ease, width 0.25s ease, height 0.25s ease',
        }}
      >
        <CursorIcon />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full will-change-transform"
        style={{
          background: dotColor,
          opacity: isVisible ? 0.9 : 0,
          transition: 'background 0.25s ease',
        }}
      />
    </>
  );
}
