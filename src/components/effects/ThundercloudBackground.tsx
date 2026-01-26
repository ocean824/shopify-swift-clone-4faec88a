import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function ThundercloudBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';

    let animationId: number;
    let clouds: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      opacity: number;
      layers: number;
    }> = [];

    let lightning = {
      active: false,
      x: 0,
      y: 0,
      opacity: 0,
      branches: [] as Array<{ x1: number; y1: number; x2: number; y2: number }>,
    };

    let lastLightningTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initClouds();
    };

    const initClouds = () => {
      clouds = [];
      const cloudCount = Math.floor(canvas.width / 150);

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.6),
          width: 200 + Math.random() * 300,
          height: 80 + Math.random() * 120,
          speed: 0.1 + Math.random() * 0.3,
          opacity: 0.3 + Math.random() * 0.4,
          layers: 3 + Math.floor(Math.random() * 3),
        });
      }
    };

    const drawCloud = (cloud: typeof clouds[0]) => {
      const baseColor = isDark ? 30 : 180;
      
      for (let layer = 0; layer < cloud.layers; layer++) {
        const layerOffset = layer * 15;
        const layerOpacity = cloud.opacity * (1 - layer * 0.15);
        const shade = baseColor + (isDark ? layer * 8 : -layer * 15);
        
        ctx.beginPath();
        
        // Create cloud shape with multiple ellipses
        const segments = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < segments; i++) {
          const segX = cloud.x + (cloud.width / segments) * i + layerOffset;
          const segY = cloud.y + Math.sin(i * 0.8) * 20 + layerOffset;
          const segWidth = cloud.width / (segments - 1);
          const segHeight = cloud.height * (0.6 + Math.random() * 0.4);
          
          ctx.ellipse(
            segX,
            segY,
            segWidth * 0.6,
            segHeight * 0.5,
            0,
            0,
            Math.PI * 2
          );
        }
        
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${layerOpacity})`;
        ctx.fill();
      }
    };

    const generateLightning = () => {
      const startX = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
      const startY = canvas.height * 0.1;
      
      lightning.x = startX;
      lightning.y = startY;
      lightning.active = true;
      lightning.opacity = 1;
      lightning.branches = [];

      // Main bolt
      let currentX = startX;
      let currentY = startY;
      const endY = canvas.height * (0.4 + Math.random() * 0.3);

      while (currentY < endY) {
        const nextX = currentX + (Math.random() - 0.5) * 80;
        const nextY = currentY + 20 + Math.random() * 40;
        
        lightning.branches.push({
          x1: currentX,
          y1: currentY,
          x2: nextX,
          y2: nextY,
        });

        // Add sub-branches randomly
        if (Math.random() > 0.6) {
          const branchEndX = nextX + (Math.random() - 0.5) * 100;
          const branchEndY = nextY + 30 + Math.random() * 50;
          lightning.branches.push({
            x1: nextX,
            y1: nextY,
            x2: branchEndX,
            y2: branchEndY,
          });
        }

        currentX = nextX;
        currentY = nextY;
      }
    };

    const drawLightning = () => {
      if (!lightning.active) return;

      ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.opacity})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(200, 200, 255, ${lightning.opacity})`;

      lightning.branches.forEach((branch, index) => {
        const branchOpacity = lightning.opacity * (index < 5 ? 1 : 0.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${branchOpacity})`;
        ctx.lineWidth = index < 5 ? 3 : 1;
        
        ctx.beginPath();
        ctx.moveTo(branch.x1, branch.y1);
        ctx.lineTo(branch.x2, branch.y2);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;

      // Fade out
      lightning.opacity -= 0.05;
      if (lightning.opacity <= 0) {
        lightning.active = false;
      }
    };

    const drawFlash = () => {
      if (lightning.active && lightning.opacity > 0.7) {
        const flashOpacity = (lightning.opacity - 0.7) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const animate = () => {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a1a1a');
        gradient.addColorStop(1, '#0f0f0f');
      } else {
        gradient.addColorStop(0, '#e0e0e0');
        gradient.addColorStop(0.5, '#c8c8c8');
        gradient.addColorStop(1, '#b0b0b0');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width;
        }
        drawCloud(cloud);
      });

      // Trigger lightning randomly
      const now = Date.now();
      if (now - lastLightningTime > 3000 && Math.random() > 0.995) {
        generateLightning();
        lastLightningTime = now;
      }

      drawLightning();
      drawFlash();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    // Initial lightning after a short delay
    setTimeout(() => {
      generateLightning();
      lastLightningTime = Date.now();
    }, 1500);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
