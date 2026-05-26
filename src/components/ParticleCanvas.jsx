import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ activeImage, deviceType }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const activeImageRef = useRef(activeImage);
  const transitionTimerRef = useRef(0);
  
  // Set particle count based on device selection for maximum performance
  const PARTICLE_COUNT = deviceType === 'mobile' ? 1600 : 3800;
  
  // Offscreen canvas dimensions for sampling
  const SAMPLE_SIZE = deviceType === 'mobile' ? 100 : 160;

  useEffect(() => {
    activeImageRef.current = activeImage;
    // Reset/Spike transition timer to trigger the disintegration explosion
    transitionTimerRef.current = 120; // 120 frames of explosion/fade drift
  }, [activeImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set and manage canvas sizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize particles array with static positions
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        tx: Math.random() * window.innerWidth, // Target X
        ty: Math.random() * window.innerHeight, // Target Y
        vx: 0,
        vy: 0,
        r: Math.random() * 1.5 + 1.2, // size
        color: { r: 234, g: 184, b: 184, a: 0.8 }, // initial soft rose color
        targetColor: { r: 234, g: 184, b: 184, a: 0.8 },
        angle: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRadius: Math.random() * 10 + 5,
        phase: Math.random() * 100
      });
    }
    particlesRef.current = particles;

    // Load and sample image function
    const loadedImages = {};
    const sampleImagePixels = (imgSrc) => {
      if (loadedImages[imgSrc]) {
        applyTargets(loadedImages[imgSrc]);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = SAMPLE_SIZE;
        offCanvas.height = SAMPLE_SIZE;
        const offCtx = offCanvas.getContext('2d');
        
        // Draw image keeping aspect ratio
        const scale = Math.min(SAMPLE_SIZE / img.width, SAMPLE_SIZE / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (SAMPLE_SIZE - w) / 2;
        const y = (SAMPLE_SIZE - h) / 2;
        
        offCtx.clearRect(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        offCtx.drawImage(img, x, y, w, h);
        
        const imgData = offCtx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const validPixels = [];
        
        // Extract pixels that have some alpha/color density
        for (let py = 0; py < SAMPLE_SIZE; py++) {
          for (let px = 0; px < SAMPLE_SIZE; px++) {
            const idx = (py * SAMPLE_SIZE + px) * 4;
            const alpha = imgData.data[idx + 3];
            if (alpha > 40) { // pixel threshold
              validPixels.push({
                x: px,
                y: py,
                r: imgData.data[idx],
                g: imgData.data[idx + 1],
                b: imgData.data[idx + 2],
                a: alpha / 255
              });
            }
          }
        }
        
        loadedImages[imgSrc] = validPixels;
        applyTargets(validPixels);
      };
      img.src = imgSrc;
    };

    const applyTargets = (pixels) => {
      const parts = particlesRef.current;
      if (!parts.length || !pixels.length) return;

      // Scale factor to map pixels to visible canvas centered
      const scale = Math.min(canvas.width * 0.72, canvas.height * 0.44) / SAMPLE_SIZE;
      const offsetX = (canvas.width - SAMPLE_SIZE * scale) / 2;
      
      // Keep it centered but slightly pushed upwards on desktop to make room for titles
      const offsetY = canvas.height > 768 
        ? (canvas.height - SAMPLE_SIZE * scale) / 2 - 40
        : (canvas.height - SAMPLE_SIZE * scale) / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = parts[i];
        // Sample in a loop if pixel count differs from particle pool size
        const pix = pixels[i % pixels.length];
        
        p.tx = pix.x * scale + offsetX + (Math.random() * 6 - 3);
        p.ty = pix.y * scale + offsetY + (Math.random() * 6 - 3);
        
        // Darken white or very bright colors to make particles visible on light background
        let targetR = pix.r;
        let targetG = pix.g;
        let targetB = pix.b;
        if (targetR > 230 && targetG > 230 && targetB > 230) {
          targetR = 201; targetG = 76; targetB = 76; // tint them romantic-dark
        }
        
        p.targetColor = {
          r: targetR,
          g: targetG,
          b: targetB,
          a: pix.a * 0.85
        };
      }
    };

    // Primary Physics Loop
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timer = transitionTimerRef.current;
      // High timer = high drift, low ease (explode/dissolve)
      // Low timer = low drift, high ease (reassemble/reform)
      let driftFactor = 1.0;
      let ease = 0.08;

      if (timer > 0) {
        // Splitting into: 0-60 frames (explosion/decay) and 60-120 frames (reassemble ease-in)
        if (timer > 60) {
          driftFactor = 1.0 + (timer - 60) * 0.35; // spike drift up to 22x
          ease = 0.008; // very loose attraction during flight
        } else {
          driftFactor = 1.0 + timer * 0.12; // tapering off drift
          ease = 0.008 + (60 - timer) * 0.0012; // ramping up ease to lock target
        }
        transitionTimerRef.current--;
      }

      // Load active image if targets need remapping
      sampleImagePixels(activeImageRef.current);

      const parts = particlesRef.current;
      const len = parts.length;
      const time = Date.now() * 0.001;

      for (let i = 0; i < len; i++) {
        const p = parts[i];
        
        // 1. Anti-Gravity Floating offset (sine/cosine)
        const angleOffset = time * p.floatSpeed + p.phase;
        const fx = Math.sin(angleOffset) * p.floatRadius * driftFactor;
        const fy = Math.cos(angleOffset * 0.8) * p.floatRadius * driftFactor;

        // 2. Spring Physics Ease pull to Target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        
        p.x += dx * ease + fx * 0.06;
        p.y += dy * ease + fy * 0.06;

        // 3. Smooth Color Interpolation
        p.color.r += (p.targetColor.r - p.color.r) * 0.1;
        p.color.g += (p.targetColor.g - p.color.g) * 0.1;
        p.color.b += (p.targetColor.b - p.color.b) * 0.1;
        p.color.a += (p.targetColor.a - p.color.a) * 0.1;

        // 4. Drawing the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Add subtle neon/romantic glow to the dark/red particles
        if (p.color.r > 150) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = `rgba(${Math.floor(p.color.r)}, ${Math.floor(p.color.g)}, ${Math.floor(p.color.b)}, ${p.color.a})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [deviceType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10 select-none opacity-90 transition-opacity duration-1000"
    />
  );
}
