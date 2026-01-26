import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export function BeamsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawBeams = () => {
      const time = Date.now() * 0.0003;
      
      // Draw multiple beams - adapt to theme
      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createLinearGradient(
          canvas.width * 0.5 + Math.sin(time + i) * 200,
          0,
          canvas.width * 0.5 + Math.cos(time + i * 0.7) * 300,
          canvas.height
        );
        
        const beamColor = isDark ? '30%' : '70%';
        gradient.addColorStop(0, `hsla(0, 0%, ${beamColor}, 0)`);
        gradient.addColorStop(0.5, `hsla(0, 0%, ${beamColor}, ${0.04 + Math.sin(time * 2 + i) * 0.02})`);
        gradient.addColorStop(1, `hsla(0, 0%, ${beamColor}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const drawParticles = () => {
      // Use white particles on dark, dark particles on light
      const particleColor = isDark ? '100%' : '20%';
      
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, ${particleColor}, ${particle.opacity})`;
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBeams();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.6 }}
      />
      {/* Static gradient overlay beams - greyscale */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          animate={{
            x: ['0%', '200%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -right-1/4 top-0 h-full w-1/3 bg-gradient-to-l from-transparent via-muted-foreground/3 to-transparent"
          animate={{
            x: ['0%', '-200%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </>
  );
}
