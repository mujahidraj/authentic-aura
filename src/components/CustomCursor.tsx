'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type CursorType = 'default' | 'ds' | 'publication' | 'link' | 'drag';

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

      // Detect element under cursor
      const el = e.target as HTMLElement;
      if (el.closest('[data-cursor="ds"]')) setCursorType('ds');
      else if (el.closest('[data-cursor="publication"]')) setCursorType('publication');
      else if (el.closest('a, button, [role="button"]')) setCursorType('link');
      else setCursorType('default');
    };

    const animate = () => {
      // Smooth follower
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.12;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${dotPos.current.x - 20}px, ${dotPos.current.y - 20}px)`;
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

  const getCursorContent = () => {
    switch (cursorType) {
      case 'ds': return '{}';
      case 'publication': return '◉';
      case 'link': return '↗';
      default: return null;
    }
  };

  return (
    <>
      {/* Outer ring / follower */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-10 h-10 rounded-full flex items-center justify-center will-change-transform"
        style={{
          border: cursorType === 'ds'
            ? '1.5px solid hsl(var(--accent))'
            : cursorType === 'publication'
            ? '1.5px solid hsl(var(--primary))'
            : cursorType === 'link'
            ? '1.5px solid hsl(var(--foreground))'
            : '1.5px solid hsl(var(--muted-foreground) / 0.5)',
          opacity: isVisible ? 1 : 0,
          transition: 'border-color 0.3s ease, width 0.3s ease, height 0.3s ease',
          width: cursorType !== 'default' ? '48px' : '40px',
          height: cursorType !== 'default' ? '48px' : '40px',
        }}
      >
        {getCursorContent() && (
          <span
            className="text-xs font-mono font-bold leading-none select-none"
            style={{
              color: cursorType === 'ds' ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
              fontSize: cursorType === 'link' ? '14px' : '11px',
            }}
          >
            {getCursorContent()}
          </span>
        )}
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full will-change-transform"
        style={{
          background: cursorType === 'ds'
            ? 'hsl(var(--accent))'
            : cursorType === 'publication'
            ? 'hsl(var(--primary))'
            : 'hsl(var(--foreground))',
          opacity: isVisible ? 0.9 : 0,
          transition: 'background 0.3s ease',
        }}
      />
    </>
  );
}
