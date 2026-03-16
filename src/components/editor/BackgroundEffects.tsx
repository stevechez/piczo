'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEditorStore } from '@/store/useEditorStore';

export const BackgroundEffects = () => {
  const [init, setInit] = useState(false);
  const { bgEffect } = useEditorStore();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init || bgEffect === 'none') return null;

  // Configuration for "Modern Piczo" Hearts
  const configs: Record<string, any> = {
    hearts: {
      particles: {
        number: { value: 30 },
        shape: { type: "heart" },
        color: { value: "#ff007f" },
        opacity: { value: 0.5 },
        size: { value: { min: 10, max: 20 } },
        move: { enable: true, speed: 2, direction: "bottom" }
      }
    },
    stars: {
      particles: {
        number: { value: 100 },
        shape: { type: "star" },
        color: { value: "#ffff00" },
        opacity: { value: 0.8 },
        size: { value: { min: 2, max: 5 } },
        move: { enable: true, speed: 1, direction: "none", random: true },
        twinkle: { particles: { enable: true, frequency: 0.05, opacity: 1 } }
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles id="tsparticles" options={configs[bgEffect] || {}} />
    </div>
  );
};