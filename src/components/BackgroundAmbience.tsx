'use client';

import { motion } from 'framer-motion';

export function BackgroundAmbience() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[1000px] h-[800px] bg-primary/10 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-[800px] left-[-200px] w-[800px] h-[800px] bg-accent/10 blur-[120px] rounded-full" 
      />
    </div>
  );
}
