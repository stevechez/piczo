'use client';

import confetti from 'canvas-confetti';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BuilderElement } from '@/types/builder';

export const ConfettiBlock = ({ element }: { element: BuilderElement }) => {
  const handleFire = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Fire a professional-grade burst
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <Button 
      onClick={handleFire}
      className={`relative group overflow-hidden transition-all active:scale-95 shadow-lg ${element.styles.backgroundColor || 'bg-gradient-to-r from-pink-500 to-violet-500'} ${element.styles.color || 'text-white'} rounded-full px-8 py-6 h-auto font-black text-lg`}
    >
      <div className="flex items-center gap-3">
        <PartyPopper className="animate-bounce" />
        {element.content || "SURPRISE!"}
      </div>
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
};