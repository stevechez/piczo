'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only generate a sparkle every few pixels to avoid clutter
      if (Math.random() > 0.3) return;

      const newSparkle: Sparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 15 + 5,
        color: ['#ff00ff', '#00ffff', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)],
      };

      setSparkles((prev) => [...prev.slice(-20), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup old sparkles
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkles((prev) => prev.filter((s) => Date.now() - s.id < 800));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 180, y: sparkle.y + 20 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              color: sparkle.color,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};