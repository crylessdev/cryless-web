'use client';

import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-neutral-900/50 border border-neutral-800/60 rounded-2xl backdrop-blur-sm shadow-xl hover:border-neutral-700 transition duration-300">
      <span className="text-4xl font-extrabold tracking-tight text-white">
        {count.toLocaleString()}+
      </span>
      <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mt-2">{label}</span>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<'sakura' | 'void' | 'matrix'>('sakura');
  const [currentMerch, setCurrentMerch] = useState<'kura' | 'zen' | 'shibuya'>('kura');
  const [shibuyaSubSelection, setShibuyaSubSelection] = useState<'tee' | 'longsleeve'>('tee');
  const [activeCape, setActiveCape] = useState<'sakura' | 'void' | 'matrix'>('sakura');
  const [isFireActive, setIsFireActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Context references for synthesizing cozy background soundscapes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const fireplaceIntervalRef = useRef<any>(null);

  const themes = {
    sakura: {
      accent: 'text-pink-400',
      bgAccent: 'bg-pink-400 hover:bg-pink-300 text-neutral-950',
      outlineAccent: 'border-pink-500/30 hover:border-pink-400 text-pink-400 bg-pink-500/5',
      badge: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      glow: 'shadow-pink-500/20',
      textAccent: 'text-pink-400',
    },
    void: {
      accent: 'text-violet-400',
      bgAccent: 'bg-violet-400 hover:bg-violet-300 text-neutral-950',
      outlineAccent: 'border-violet-500/30 hover:border-violet-400 text-violet-400 bg-violet-500/5',
      badge: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      glow: 'shadow-violet-500/20',
      textAccent: 'text-violet-400',
    },
    matrix: {
      accent: 'text-emerald-400',
      bgAccent: 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950',
      outlineAccent: 'border-emerald-500/30 hover:border-emerald-400 text-emerald-400 bg-emerald-500/5',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-emerald-500/20',
      textAccent: 'text-emerald-400',
    }
  };

  const currentColors = themes[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class SakuraPetal {
      x = Math.random() * width;
      y = Math.random() * height - height;
      size = Math.random() * 8 + 4;
      speedY = Math.random() * 1.5 + 0.8;
      speedX = Math.random() * 1 - 0.5;
      rotation = Math.random() * 360;
      rotationSpeed = Math.random() * 2 - 1;

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.5;
        this.rotation += this.rotationSpeed;
        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
    }

    class VoidParticle {
      x = Math.random() * width;
      y = Math.random() * height;
      size = Math.random() * 4 + 1;
      speedY = -(Math.random() * 0.5 + 0.2);
      speedX = Math.random() * 0.4 - 0.2;
      opacity = Math.random() * 0.5 + 0.2;

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    class MatrixStream {
      x = Math.random() * width;
      y = Math.random() * height - height;
      speed = Math.random() * 3 + 2;
      chars = '01'.split('');
      opacity = Math.random() * 0.4 + 0.1;

      update() {
        this.y += this.speed;
        if (this.y > height) {
          this.y = -50;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
        ctx.font = '10px monospace';
        const char = this.chars[Math.floor(Math.random() * this.chars.length)];
        ctx.fillText(char, this.x, this.y);
      }
    }

    const particles: any[] = [];
    const initParticles = () => {
      particles.length = 0;
      const count = theme === 'sakura' ? 60 : theme === 'void' ? 85 : 120;
      for (let i = 0; i < count; i++) {
        if (theme === 'sakura') particles.push(new SakuraPetal());
        else if (theme === 'void') particles.push(new VoidParticle());
        else particles.push(new MatrixStream());
      }
    };

    initParticles();

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 8, 12, 0.2)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playFurin = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const frequencies = [1200, 1550, 2180];
    frequencies.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5 + i);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 5);
    });
  };

  const toggleFireplace = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isFireActive) {
      clearInterval(fireplaceIntervalRef.current);
      setIsFireActive(false);
    } else {
      setIsFireActive(true);
      fireplaceIntervalRef.current = setInterval(() => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80 + Math.random() * 60, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.08);
      }, 260);
    }
  };

  return (
    <main className="min-h-screen bg-[#08080c] text-neutral-100 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Canvas Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Header & Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-neutral-900 border border-pink-500/30 ${currentColors.glow}`}>
              <span className="text-sm">🌸</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Cryless Visuals
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-neutral-400">
            <a href="#roadmap" className="hover:text-white transition">Roadmap</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#performance" className="hover:text-white transition">Performance</a>
            <a href="#merch" className="hover:text-white transition">Capsule Merch</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          {/* Theme Selector Widget */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/80 border border-neutral-800 rounded-full">
              <button
                onClick={() => setTheme('void')}
                className={`w-5 h-5 rounded-full bg-violet-500 transition-all ${theme === 'void' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                title="Void Theme"
              />
              <button
                onClick={() => setTheme('matrix')}
                className={`w-5 h-5 rounded-full bg-emerald-500 transition-all ${theme === 'matrix' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                title="Matrix Theme"
              />
              <button
                onClick={() => setTheme('sakura')}
                className={`w-5 h-5 rounded-full bg-pink-500 transition-all ${theme === 'sakura' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
                title="Sakura Theme"
              />
            </div>
            <a
              href="#download"
              className={`hidden sm:inline-block px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs transition duration-300 ${currentColors.bgAccent} ${currentColors.glow}`}
            >
              Get Mod
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center z-10">
        <div className={`mb-6 inline-block px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-neutral-900/80 border border-neutral-800 ${currentColors.accent}`}>
          ESP & RADAR UPDATE IS LIVE
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter max-w-5xl leading-tight">
          Next-Gen Visuals <br />
          <span className={`transition duration-500 ${currentColors.accent}`}>With 50% FPS Boost</span>
        </h1>
        <p className="mt-8 text-neutral-400 max-w-2xl text-lg leading-relaxed">
          An advanced, highly optimized client-side Fabric mod designed to provide crystal-clear radar tracking, customizable ESP overlays, and a built-in GUI configuration.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="https://modrinth.com/mod/cryless-visuals"
            target="_blank"
            rel="noreferrer"
            className={`px-8 py-4 font-bold rounded-xl transition duration-300 shadow-xl text-sm uppercase tracking-widest ${currentColors.bgAccent} ${currentColors.glow}`}
          >
            Direct Downloads
          </a>
          <a
            href="https://modrinth.com/mod/cryless-visuals"
            target="_blank"
            rel="noreferrer"
            className={`px-8 py-4 font-bold border rounded-xl transition duration-300 text-sm uppercase tracking-widest ${currentColors.outlineAccent}`}
          >
            View Modrinth Guide
          </a>
        </div>

        {/* Real Dynamic Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-20">
          <AnimatedCounter target={5700} label="Total Views" />
          <AnimatedCounter target={1200} label="Downloads" />
          <AnimatedCounter target={10} label="Active Discord" />
        </div>
      </section>

      {/* Section: The Next Chapter Roadmap */}
      <section id="roadmap" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-800/40 relative z-10">
        <div className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${currentColors.accent}`}>Development Status</span>
          <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-white">THE NEXT CHAPTER IS HERE</h2>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto text-sm">
            Development is in full swing. We are introducing a massive suite of features, modernizations, and game stability enhancements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Main updates card */}
          <div className="p-8 bg-neutral-900/30 border border-neutral-800/80 rounded-3xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-bold text-white">Technical Roadmap & Support</h3>
              </div>
              <ul className="space-y-4 text-neutral-400 text-sm">
                <li className="flex items-start gap-3">
                  <span className={`mt-1 text-xs ${currentColors.accent}`}>●</span>
                  <div>
                    <strong className="text-neutral-200">Minecraft 1.21.4 Support</strong> — Core support is completed, offering compatibility with latest features.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-1 text-xs ${currentColors.accent}`}>●</span>
                  <div>
                    <strong className="text-neutral-200">1.21.11 Performance</strong> — Specialized rendering improvements to boost stability and reduce frametime latency.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-1 text-xs ${currentColors.accent}`}>●</span>
                  <div>
                    <strong className="text-neutral-200">Polished Sakura UI</strong> — Cleaner configuration panels, smoother fading animations, and optimized controls.
                  </div>
                </li>
              </ul>
            </div>
            <div className={`mt-8 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/60 ${currentColors.badge}`}>
              <div className="font-bold text-xs uppercase tracking-wider mb-1">Current Milestone:</div>
              <div className="text-xs text-neutral-300">Sakura v4.0 Release candidate testing.</div>
            </div>
          </div>

          {/* Core Capes Card */}
          <div className="p-8 bg-neutral-900/30 border border-neutral-800/80 rounded-3xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🧥</span>
                <h3 className="text-xl font-bold text-white">Built-in Premium Capes</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                No external visual mods or extensions needed. We are bringing native, lag-free built-in cape rendering support directly within the main client for these versions:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {['1.21.4', '1.21.10', '1.21.11'].map((v) => (
                  <div key={v} className="bg-neutral-950/60 border border-neutral-800 py-3 rounded-xl text-center text-xs font-mono font-bold text-neutral-200">
                    {v}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-neutral-800/60 pt-6">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-3">Content Strategy & Devlogs</span>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-neutral-300">
                <div className="flex items-center gap-2">🌸 Devlogs</div>
                <div className="flex items-center gap-2">🎬 Cinematics</div>
                <div className="flex items-center gap-2">⚔️ PvP Compare</div>
                <div className="flex items-center gap-2">📱 YouTube Shorts</div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW CAPE PREVIEWER INTERACTIVE MODULE */}
        <div className="p-8 bg-neutral-900/20 border border-neutral-800/60 rounded-[2rem] backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${currentColors.accent}`}>Cape Fitting Stand</span>
              <h3 className="text-3xl font-black text-white mt-2 mb-4">BUILT-IN CAPE PREVIEWER</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Try on our exclusive, fluid-animating cape concepts designed to fly natively without any extra cosmetic client overhead. Select a cosmetic preset to view its movement.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveCape('sakura')}
                  className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition ${
                    activeCape === 'sakura' ? 'bg-pink-500/20 text-pink-400 border-pink-500/40 shadow-lg' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  🌸 Sakura Bloom
                </button>
                <button
                  onClick={() => setActiveCape('void')}
                  className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition ${
                    activeCape === 'void' ? 'bg-violet-500/20 text-violet-400 border-violet-500/40 shadow-lg' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  🌌 Void Rift
                </button>
                <button
                  onClick={() => setActiveCape('matrix')}
                  className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition ${
                    activeCape === 'matrix' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  🟢 Matrix Code
                </button>
              </div>
            </div>

            {}
            <div className="lg:col-span-5 flex justify-center">
              {/* Animated Cape & Player back-side CSS illustration */}
              <div className="relative w-48 h-64 bg-neutral-950/60 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden">
                {/* Simulated Grid Floor */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-neutral-900 to-transparent opacity-50"></div>
                
                {/* Character Silhouette back view */}
                <div className="relative flex flex-col items-center">
                  {/* Head */}
                  <div className="w-12 h-12 bg-neutral-800 rounded-sm mb-1 border border-neutral-700"></div>
                  {/* Body & Cape assembly */}
                  <div className="relative w-24 h-24 flex justify-center">
                    {/* Shoulders / Torso */}
                    <div className="absolute inset-0 bg-neutral-800 rounded-md border border-neutral-700 z-10"></div>
                    
                    {/* Flowing animated Cape */}
                    <div
                      className="absolute top-0 w-16 h-28 rounded-b-md z-20 origin-top shadow-2xl transition-all duration-500 overflow-hidden"
                      style={{
                        animation: 'drift 4s ease-in-out infinite',
                        background:
                          activeCape === 'sakura'
                            ? 'linear-gradient(to bottom, #e05cb3, #c24697, #9d2d75)'
                            : activeCape === 'void'
                            ? 'linear-gradient(to bottom, #0d0624, #1e0b3d, #4c1d95)'
                            : 'linear-gradient(to bottom, #010c05, #02200d, #064e3b)',
                        boxShadow:
                          activeCape === 'sakura'
                            ? '0 10px 25px rgba(236,72,153,0.4)'
                            : activeCape === 'void'
                            ? '0 10px 25px rgba(139,92,246,0.4)'
                            : '0 10px 25px rgba(16,185,129,0.4)'
                      }}
                    >
                      {/* Sakura Cape Details with beautiful Cherry Blossom branch and CV monogram */}
                      {activeCape === 'sakura' && (
                        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
                          {/* Pixelated Minecraft style backdrop matching image_d3a5e5.png exactly */}
                          <svg 
                            className="absolute inset-0 w-full h-full opacity-95" 
                            viewBox="0 0 12 24" 
                            fill="none" 
                            style={{ shapeRendering: 'crispEdges' }}
                          >
                            {/* Base hot pink */}
                            <rect width="12" height="24" fill="#e05cb3" />
                            
                            {/* Light pink/white decorative pixel border from reference image_d3a5e5.png */}
                            <path d="M2,0 h8 M1,1 h1 M10,1 h1 M1,2 v2 M10,2 v2 M1,4 h2 M9,4 h2 M1,5 v1 M10,5 v1 M1,6 h2 M9,6 h2 M1,7 v3 M10,7 v3 M1,10 h2 M9,10 h2 M1,11 v1 M10,11 v1 M1,12 h2 M9,12 h2 M1,13 v3 M10,13 v3 M1,16 h2 M9,16 h2 M1,17 v1 M10,17 v1 M1,18 h2 M9,18 h2 M1,19 v2 M10,19 v2 M2,21 h8 M3,22 h2 M7,22 h2 M4,23 h4" fill="none" stroke="#ffd3ed" strokeWidth="1" />
                            
                            {/* Center Diamond Pixel Flower Shape from reference image_d3a5e5.png */}
                            <rect x="5" y="11" width="2" height="1" fill="#ffd3ed" />
                            <rect x="4" y="12" width="4" height="1" fill="#ffd3ed" />
                            <rect x="5" y="13" width="2" height="1" fill="#ffd3ed" />
                          </svg>

                          {/* Elegant organic Sakura Tree Branch OVERLAID ON TOP */}
                          <svg className="absolute top-1 inset-x-0 w-full h-12 text-pink-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-10" viewBox="0 0 100 100" fill="none">
                            {/* Wooden Branch Path */}
                            <path d="M10,40 Q35,20 65,35 T95,20" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                            <path d="M35,28 Q45,10 60,8" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
                            <path d="M60,35 Q70,50 85,42" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
                            
                            {/* Beautiful Cherry blossoms on the branch */}
                            <circle cx="22" cy="36" r="6" fill="#f472b6" />
                            <circle cx="22" cy="36" r="2.5" fill="#fdf2f8" />
                            
                            <circle cx="45" cy="20" r="5" fill="#f472b6" />
                            <circle cx="45" cy="20" r="2" fill="#fdf2f8" />

                            <circle cx="58" cy="8" r="4.5" fill="#f472b6" />
                            <circle cx="58" cy="8" r="1.5" fill="#fdf2f8" />

                            <circle cx="70" cy="36" r="5.5" fill="#f472b6" />
                            <circle cx="70" cy="36" r="2" fill="#fdf2f8" />

                            <circle cx="82" cy="42" r="5" fill="#f472b6" />
                            <circle cx="82" cy="42" r="1.5" fill="#fdf2f8" />

                            <circle cx="88" cy="22" r="4" fill="#f472b6" />
                            <circle cx="88" cy="22" r="1.2" fill="#fdf2f8" />
                          </svg>

                          {/* Beautiful bold CV Monogram branding at the bottom center */}
                          <div className="absolute bottom-2 inset-x-0 text-center z-10 select-none">
                            <span className="text-white font-black text-[10px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-white/20 px-1.5 py-0.5 rounded bg-pink-900/40">
                              CV
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Void Rift Cape Details */}
                      {activeCape === 'void' && (
                        <div className="relative w-full h-full overflow-hidden">
                          {/* Swirling Void Rift core */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-2 border-dashed border-violet-500 animate-[spin_8s_linear_infinite] opacity-70"></div>
                            <div className="absolute w-5 h-5 rounded-full border border-dotted border-fuchsia-400 animate-[spin_4s_linear_infinite_reverse] opacity-80"></div>
                            <div className="absolute w-3 h-3 bg-neutral-950 rounded-full shadow-[0_0_15px_3px_rgba(139,92,246,0.8)]"></div>
                          </div>
                          {/* Tiny floating void particles */}
                          <div className="absolute top-2 left-3 w-1 h-1 bg-violet-400 rounded-full animate-ping opacity-80"></div>
                          <div className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-70"></div>
                          <div className="absolute top-1/3 right-2 w-1 h-1 bg-fuchsia-400 rounded-full animate-bounce opacity-90"></div>
                        </div>
                      )}

                      {/* Matrix Cape Details - Hacker style WITHOUT CV monogram */}
                      {activeCape === 'matrix' && (
                        <div className="relative w-full h-full overflow-hidden flex flex-col justify-around">
                          {/* Absolute Matrix Digital Rain Streams */}
                          <div className="absolute inset-0 flex justify-between px-1 opacity-90 font-mono text-[7px] leading-none text-emerald-400 pointer-events-none select-none">
                            <div className="flex flex-col animate-[bounce_1.5s_infinite] delay-100">
                              <span>1</span><span>0</span><span>1</span><span>0</span>
                            </div>
                            <div className="flex flex-col animate-[bounce_2.2s_infinite] delay-300">
                              <span>0</span><span>1</span><span>0</span><span>1</span>
                            </div>
                            <div className="flex flex-col animate-[bounce_1.8s_infinite] delay-500">
                              <span>1</span><span>1</span><span>0</span><span>0</span>
                            </div>
                            <div className="flex flex-col animate-[bounce_2.5s_infinite] delay-200">
                              <span>0</span><span>0</span><span>1</span><span>1</span>
                            </div>
                          </div>
                          {/* Cybernetic bottom border code block */}
                          <div className="absolute bottom-1 inset-x-0 text-center font-mono text-[5px] text-emerald-500/40 select-none">
                            SYSTEM_SECURE
                          </div>
                        </div>
                      )}

                      {/* 3D Fabric Crease Overlay (Gives the cape highly realistic depth) */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-40 mix-blend-multiply opacity-50"
                        style={{
                          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0.02) 51%, rgba(255,255,255,0.0) 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-800/40 relative z-10">
        <div className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${currentColors.accent}`}>Tailored Optimization</span>
          <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-white">KEY CLIENT TWEAKS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 rounded-3xl hover:border-neutral-700 transition duration-300 backdrop-blur-md">
            <h3 className={`text-xl font-bold mb-3 ${currentColors.accent}`}>Sakura UI Preset</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Elegant minimalist layout styled with soft pastel overlays, giving your game HUD a modern and atmospheric visual look.
            </p>
          </div>
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 rounded-3xl hover:border-neutral-700 transition duration-300 backdrop-blur-md">
            <h3 className={`text-xl font-bold mb-3 ${currentColors.accent}`}>Gamma & Radar</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Gain tactical advantages with a clean customizable overhead radar layout, precise gamma boost options, and built-in crosshair editor.
            </p>
          </div>
          <div className="p-8 bg-neutral-900/30 border border-neutral-800 rounded-3xl hover:border-neutral-700 transition duration-300 backdrop-blur-md">
            <h3 className={`text-xl font-bold mb-3 ${currentColors.accent}`}>Zero Stutter Engine</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Designed around raw performance hooks on top of Fabric API. Eliminates garbage collector micro-stutter spikes completely.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Section with corrected Y-axis coordinates */}
      <section id="performance" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-800/40 relative z-10">
        <div className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${currentColors.accent}`}>Frametime Benchmark</span>
          <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-white">BUILT FOR PERFORMANCE</h2>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto text-sm">
            Comparing milliseconds between frames during intensive gameplay. A lower and flatter line indicates zero micro-stuttering.
          </p>
        </div>

        {}
        <div className="p-8 rounded-3xl bg-neutral-900/30 border border-neutral-800/80 max-w-3xl mx-auto backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Frametime Spikes Comparison (Lower is Better)
            </span>
            <div className="flex gap-4 text-xs font-semibold">
              <span className={`flex items-center gap-1.5 ${currentColors.accent}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-current inline-block"></span> Cryless v4.0
              </span>
              <span className="flex items-center gap-1.5 text-neutral-500">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block"></span> Vanilla Minecraft
              </span>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-end">
            {/* Grid Line Separators */}
            <div className="absolute inset-x-0 bottom-0 border-b border-neutral-800/60 h-0"></div>
            <div className="absolute inset-x-0 bottom-1/4 border-b border-neutral-800/30 h-0"></div>
            <div className="absolute inset-x-0 bottom-2/4 border-b border-neutral-800/30 h-0"></div>
            <div className="absolute inset-x-0 bottom-3/4 border-b border-neutral-800/30 h-0"></div>

            {/* SVG Visual Graph Lines - CORRECTED LOWER IS BETTER LOGIC */}
            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Vanilla Spike Line (Unstable, spiky and visually higher up on the graph area) */}
              <path
                d="M 0,20 L 10,60 L 20,15 L 30,70 L 40,25 L 50,80 L 60,30 L 70,65 L 80,15 L 90,75 L 100,20"
                fill="none"
                stroke="#4b5563"
                strokeWidth="1.5"
                strokeDasharray="2"
              />
              {/* Cryless Smooth Line (Ultra-stable, flat and visually lower down, meaning low latency / low values) */}
              <path
                d="M 0,85 L 10,84 L 20,86 L 30,83 L 40,85 L 50,84 L 60,86 L 70,83 L 80,85 L 90,84 L 100,85"
                fill="none"
                stroke="currentColor"
                className={`${currentColors.textAccent} transition-all duration-500`}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="flex justify-between mt-6 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <span>Spawn / Lobby</span>
            <span>Chunk Loading</span>
            <span>Heavy PvP Fight</span>
            <span>Max Render distance</span>
          </div>
        </div>
      </section>

      {/* Section: Botanical Streetwear Capsule */}
      <section id="merch" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-800/40 relative z-10">
        <div className="text-center mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest ${currentColors.accent}`}>S/S Capsule Collection</span>
          <h2 className="text-5xl font-black tracking-tight mt-2 text-white uppercase">BOTANICAL STREETWEAR</h2>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Highly limited heavyweight cotton garments tailored to premium minimalist layouts. Featuring gorgeous Sakura illustrations and subtle brand hallmarks.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Menu Selection Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">Select Garment Setup</span>
            
            {/* Design I Toggle */}
            <button
              onClick={() => setCurrentMerch('kura')}
              className={`w-full text-left p-6 rounded-2xl border transition duration-300 backdrop-blur-md flex flex-col justify-between ${
                currentMerch === 'kura'
                  ? `bg-neutral-900 border-pink-500/30 ${currentColors.glow}`
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="font-bold text-white text-lg">Kura Centerpiece</span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-pink-400">Heavyweight Tee</span>
              </div>
              <p className="text-neutral-400 text-xs mt-3 leading-relaxed">
                An organic canvas showcasing a detailed horizontal hand-drawn Sakura branch print running proudly across the chest. Engineered for oversized structure.
              </p>
              <div className="flex gap-2 mt-4 text-[9px] font-extrabold tracking-wider uppercase">
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">280 GSM</span>
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">Premium Print</span>
              </div>
            </button>

            {/* Design II Toggle */}
            <button
              onClick={() => setCurrentMerch('zen')}
              className={`w-full text-left p-6 rounded-2xl border transition duration-300 backdrop-blur-md flex flex-col justify-between ${
                currentMerch === 'zen'
                  ? `bg-neutral-900 border-pink-500/30 ${currentColors.glow}`
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="font-bold text-white text-lg">Zen Minimalist</span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-pink-400">Signature Tee</span>
              </div>
              <p className="text-neutral-400 text-xs mt-3 leading-relaxed">
                For the architectural purist. Exhibits a smaller Sakura blossom branch sitting gently on the left breast, styled on a crisp luxury fabric context.
              </p>
              <div className="flex gap-2 mt-4 text-[9px] font-extrabold tracking-wider uppercase">
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">280 GSM</span>
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">Premium Print</span>
              </div>
            </button>

            {/* Design III Toggle */}
            <button
              onClick={() => setCurrentMerch('shibuya')}
              className={`w-full text-left p-6 rounded-2xl border transition duration-300 backdrop-blur-md flex flex-col justify-between ${
                currentMerch === 'shibuya'
                  ? `bg-neutral-900 border-pink-500/30 ${currentColors.glow}`
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="font-bold text-white text-lg">Shibuya Cherry Series</span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-pink-400">Flatlay Selection</span>
              </div>
              <p className="text-neutral-400 text-xs mt-3 leading-relaxed">
                Cozy streetwear layout displaying organic prints. Switch layouts to view either our classic signature tee flatlay or the ultra-relaxed heavyweight long sleeve.
              </p>
              <div className="flex gap-2 mt-4 text-[9px] font-extrabold tracking-wider uppercase">
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">320 GSM</span>
                <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300">Premium Print</span>
              </div>
            </button>

            {/* Additional Info Box */}
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900/80">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">Garment Details</span>
              <div className="flex justify-between text-xs py-1.5 border-b border-neutral-900/60">
                <span className="text-neutral-400">Sleeve Monogram</span>
                <span className="font-semibold text-neutral-200">
                  {currentMerch === 'kura' && 'Single (CV) circle stamp'}
                  {currentMerch === 'zen' && 'Double circle ((CV)) stamp'}
                  {currentMerch === 'shibuya' && 'Lowercase (cv) stamp detail'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1.5">
                <span className="text-neutral-400">Composition</span>
                <span className="font-semibold text-neutral-200">100% Organic Cotton</span>
              </div>
            </div>
          </div>

          {}
          {/* Interactive Image Frame Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* If Shibuya is selected, show sub-selectors */}
            {currentMerch === 'shibuya' && (
              <div className="flex gap-3 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  onClick={() => setShibuyaSubSelection('tee')}
                  className={`flex-1 py-3 text-center rounded-xl font-bold uppercase tracking-wider text-[10px] transition duration-300 ${
                    shibuyaSubSelection === 'tee'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🌸 Standard T-Shirt Flatlay
                </button>
                <button
                  onClick={() => setShibuyaSubSelection('longsleeve')}
                  className={`flex-1 py-3 text-center rounded-xl font-bold uppercase tracking-wider text-[10px] transition duration-300 ${
                    shibuyaSubSelection === 'longsleeve'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🛏️ French Terry Longsleeve
                </button>
              </div>
            )}

            {/* Image Container with precise shadows and border accents */}
            <div className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden border-2 border-neutral-800 bg-[#0c0c11] shadow-2xl transition-all duration-500 ${currentColors.glow}`}>
              {currentMerch === 'kura' && (
                <img
                  src="/photo_2026-07-18_08-49-40.jpg"
                  alt="Kura Centerpiece Heavyweight Tee on wood hanger"
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x600/18181b/ffffff?text=Kura+Centerpiece+Tee';
                  }}
                />
              )}
              {currentMerch === 'zen' && (
                <img
                  src="/photo_2026-07-18_08-49-27.jpg"
                  alt="Zen Minimalist Signature Tee with bamboo casting shade"
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x600/18181b/ffffff?text=Zen+Minimalist+Tee';
                  }}
                />
              )}
              {currentMerch === 'shibuya' && shibuyaSubSelection === 'tee' && (
                <img
                  src="/photo_2026-07-18_08-49-35.jpg"
                  alt="Shibuya Cherry T-Shirt Flatlay with cherries and petals"
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x600/18181b/ffffff?text=Shibuya+Cherry+Tee';
                  }}
                />
              )}
              {currentMerch === 'shibuya' && shibuyaSubSelection === 'longsleeve' && (
                <img
                  src="/cryless_visuals_sakura_merch.png"
                  alt="Shibuya Cherry French Terry Longsleeve on bed layout"
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x600/18181b/ffffff?text=Shibuya+Cherry+Longsleeve';
                  }}
                />
              )}

              {/* Decorative tags overlay */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                <span className="px-3 py-1 bg-neutral-950/80 text-[10px] font-bold tracking-widest uppercase border border-neutral-800 rounded-lg backdrop-blur-sm text-neutral-300">
                  Capsule v4.0
                </span>
                <span className="px-3 py-1 bg-neutral-950/80 text-[10px] font-bold tracking-widest uppercase border border-neutral-800 rounded-lg backdrop-blur-sm text-neutral-300">
                  {currentMerch === 'shibuya' ? 'Flawless Flatlay' : 'Window Shadow Studio'}
                </span>
              </div>
            </div>

            {/* Design Spec details */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-neutral-900/60 border border-neutral-800 text-neutral-400">
                ✦ Linen Flatlay Arrangement
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-neutral-900/60 border border-neutral-800 text-neutral-400">
                ✦ Surrounded by premium dark cherries and petals
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-neutral-900/60 border border-neutral-800 text-neutral-400">
                ✦ Rich French Terry fabric for the longsleeve version
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="max-w-6xl mx-auto px-6 py-24 border-t border-neutral-800/40 text-center relative z-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">READY TO RUN CRYLESS?</h2>
        <p className="text-neutral-400 mb-10 max-w-xl mx-auto">
          Optimized client assembly installer for Fabric loaders on Minecraft 1.21.11, 1.21.10 and legacy versions.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://modrinth.com/mod/cryless-visuals"
            target="_blank"
            rel="noreferrer"
            className={`px-8 py-4 font-bold rounded-xl transition duration-300 shadow-xl uppercase tracking-widest text-sm ${currentColors.bgAccent} ${currentColors.glow}`}
          >
            Modrinth Page
          </a>
          <a
            href="https://www.curseforge.com/minecraft/mc-mods/cryless-visuals"
            target="_blank"
            rel="noreferrer"
            className={`px-8 py-4 font-bold border rounded-xl transition duration-300 uppercase tracking-widest text-sm ${currentColors.outlineAccent}`}
          >
            CurseForge Page
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-neutral-800/40 relative z-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-center text-white mb-16">FREQUENTLY ASKED</h2>
        <div className="space-y-6">
          <div className="p-8 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl backdrop-blur-md">
            <h4 className="font-bold text-white text-lg">Are built-in capes visible to other players?</h4>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Yes, they are visible to anyone using the Cryless Visuals client across 1.21.4, 1.21.10, and 1.21.11! No additional configurations needed.
            </p>
          </div>
          <div className="p-8 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl backdrop-blur-md">
            <h4 className="font-bold text-white text-lg">Is it compatible with sodium and other optimizations?</h4>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Absolutely. Cryless works right alongside standard performance mods, and focuses purely on removing frametime stutter spikes and tailoring advanced client visuals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/60 py-12 text-center text-xs text-neutral-500 relative z-10">
        © 2026 Cryless Development. Crafted with premium details. All rights reserved.
      </footer>

      {/* Cozy Atmospheric Audio Dock */}
      <div className="fixed bottom-6 right-6 z-50 p-1.5 rounded-2xl bg-neutral-950/90 border border-neutral-800/80 backdrop-blur-md shadow-2xl flex flex-col gap-2 min-w-[200px]">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Atmosphere Deck</span>
        </div>
        <button
          onClick={playFurin}
          className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/60 rounded-xl transition text-left"
        >
          <span className="text-xs text-neutral-300 font-bold uppercase">🎐 Furin Chime</span>
          <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${currentColors.badge}`}>Strike</span>
        </button>
        <button
          onClick={toggleFireplace}
          className={`w-full flex items-center justify-between p-3 border rounded-xl transition text-left ${
            isFireActive ? 'bg-orange-500/10 border-orange-500/30' : 'bg-neutral-900 border-neutral-800/60 hover:bg-neutral-800'
          }`}
        >
          <span className="text-xs text-neutral-300 font-bold uppercase">🔥 Hearth Fire</span>
          <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${isFireActive ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-950 text-neutral-500'}`}>
            {isFireActive ? 'Active' : 'Off'}
          </span>
        </button>
      </div>
    </main>
  );
}