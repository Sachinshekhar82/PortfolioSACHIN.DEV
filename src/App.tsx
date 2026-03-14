/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  Download,
  Upload,
  X,
  Menu,
  Award,
  BookOpen,
  Briefcase,
  User,
  Send,
  Code2,
  Copy,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { mockPortfolioData } from './constants';
import { PortfolioData, parseResume } from './services/geminiService';

// --- Components ---

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out" />
      <div ref={followerRef} className="fixed top-0 left-0 w-8 h-8 border border-accent/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out" />
    </>
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter"
        >
          SACHIN<span className="text-accent">.</span>DEV
        </motion.a>
        
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              {item.name}
            </motion.a>
          ))}
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted hover:text-accent"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleTheme}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-muted hover:text-accent"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          <motion.a
            href="#contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-5 py-2 rounded-full bg-ink text-bg text-sm font-bold hover:bg-accent hover:text-ink transition-all"
          >
            Hire Me
          </motion.a>
        </div>
      </div>
    </nav>
  );
};

const ScrollDropText = ({ text, className = "", size = "large" }: { text: string; className?: string; size?: "medium" | "large" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const words = text.split(" ");
  const sizeClasses = size === "medium" ? "text-xl md:text-3xl" : "text-4xl md:text-8xl";

  return (
    <div ref={containerRef} className={`min-h-[50vh] flex items-center justify-center overflow-hidden py-20 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {words.map((word, i) => {
          // Slower stagger for a more deliberate "dripping" feel
          const stagger = i * 0.002;
          const dropInStart = 0.01 + stagger;
          const dropInEnd = 0.04 + stagger;
          
          const dropOutStart = 0.9 + stagger;
          const dropOutEnd = 0.98 + stagger;

          // Vertical movement - dropping from high up
          const rawY = useTransform(
            scrollYProgress, 
            [dropInStart, dropInEnd, dropOutStart, dropOutEnd], 
            [-200, 0, 0, 100]
          );
          const y = useSpring(rawY, { stiffness: 120, damping: 20 });
          
          // Opacity fade in
          const opacity = useTransform(
            scrollYProgress, 
            [dropInStart, dropInEnd, dropOutStart, dropOutEnd], 
            [0, 1, 1, 0]
          );

          // Scale and Stretch effect
          const scale = useTransform(
            scrollYProgress,
            [dropInStart, dropInEnd],
            [0.5, 1]
          );

          // Simulating a "liquid" stretch as it falls
          const scaleY = useTransform(
            scrollYProgress,
            [dropInStart, dropInStart + (dropInEnd - dropInStart) / 2, dropInEnd],
            [1.8, 1.3, 1]
          );

          // Blur effect that clears as it settles
          const blurValue = useTransform(
            scrollYProgress,
            [dropInStart, dropInEnd],
            [20, 0]
          );
          const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

          return (
            <motion.span
              key={i}
              style={{ 
                y, 
                opacity, 
                scale, 
                scaleY,
                filter,
                transformOrigin: "top center"
              }}
              className={`${sizeClasses} font-bold tracking-tighter inline-block text-center text-ink`}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

const FloatingImage = ({ src, delay = 0, className = "" }: { src: string; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ 
      duration: 1, 
      delay,
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }}
    className={`absolute rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${className}`}
  >
    <img src={src} alt="Creative visual" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
  </motion.div>
);

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const mouse = { x: 0, y: 0, radius: 150 };

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 20) + 5;
        this.color = 'rgba(0, 242, 255, 0.4)';
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-20">
    <motion.span 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-accent font-mono text-xs uppercase tracking-[0.5em] mb-6 block font-bold"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] relative"
    >
      {title.split(' ').map((word, i) => (
        <span key={i} className={i % 2 !== 0 ? "text-accent italic font-serif font-light" : "text-ink"}>
          {word}{' '}
        </span>
      ))}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-accent/10 blur-[80px] -z-10" />
    </motion.h2>
  </div>
);

interface ProjectCardProps {
  project: PortfolioData['projects'][0];
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-15%", "15%"]);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-15%", "15%"]);
  
  const decorX = useTransform(mouseXSpring, [-0.5, 0.5], ["20px", "-20px"]);
  const decorY = useTransform(mouseYSpring, [-0.5, 0.5], ["20px", "-20px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.25, 1, 0.5, 1] 
      }}
      viewport={{ once: true, amount: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-[500px] sm:h-[600px] lg:h-[650px] w-full overflow-hidden rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] bg-bg border border-border transition-all duration-500 hover:border-accent/40 shadow-2xl"
    >
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: "translateZ(-50px)" }}>
        <motion.img 
          src={project.image}
          alt={project.title}
          style={{
            x: imgX,
            y: imgY,
            scale: 1.1, // Base scale
          }}
          className="h-full w-full object-cover opacity-40 grayscale blur-[4px] transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:blur-0 group-hover:scale-[1.15] group-hover:saturate-[1.6] group-hover:contrast-[1.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/60 to-bg transition-all duration-500 group-hover:via-bg/80 group-hover:to-bg" />
      </div>

      {/* Floating Decorative Element */}
      <motion.div 
        style={{
          x: decorX,
          y: decorY,
          transform: "translateZ(80px)",
        }}
        className="absolute top-1/2 right-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/40 transition-colors duration-500"
      />

      {/* Floating Index Number */}
      <div className="absolute top-8 left-8" style={{ transform: "translateZ(30px)" }}>
        <span className="font-serif italic text-6xl text-white/5 group-hover:text-accent/30 transition-colors duration-500">
          0{index + 1}
        </span>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10" style={{ transform: "translateZ(50px)" }}>
        <div className="translate-y-0 md:translate-y-12 transition-transform duration-700 ease-[0.16, 1, 0.3, 1] md:group-hover:translate-y-0">
          {/* Tags */}
          <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 opacity-100 md:opacity-0 transition-all duration-500 md:group-hover:opacity-100">
            {project.tags.map(tag => (
              <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Title & Description */}
          <h3 className="mb-3 sm:mb-4 font-serif text-3xl sm:text-4xl lg:text-5xl italic leading-tight text-white transition-colors duration-500 md:group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mb-6 sm:mb-10 max-w-sm text-sm sm:text-base leading-relaxed text-muted opacity-100 md:opacity-0 transition-all duration-700 delay-100 md:group-hover:opacity-100">
            {project.description}
          </p>

          {/* Action Button */}
          <motion.a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 sm:gap-4 rounded-full bg-accent px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-bg shadow-xl shadow-accent/20 transition-all duration-300 opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
          >
            Explore Project <Github className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.a>
        </div>
      </div>

      {/* Decorative Corner Glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/20 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
    </motion.div>
  );
};

const ResumeDownload = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <motion.a 
        href="/resume.pdf"
        download="Sachin_Shekhar_Resume.pdf"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-6 py-4 rounded-full bg-accent text-bg font-bold cursor-pointer shadow-2xl shadow-accent/20"
      >
        <Download className="w-5 h-5" />
        <span>Download Resume</span>
      </motion.a>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [data, setData] = useState<PortfolioData>(mockPortfolioData);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const targetId = anchor.hash.replace('#', '');
        const elem = document.getElementById(targetId);
        
        if (elem) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elemRect = elem.getBoundingClientRect().top;
          const elemPosition = elemRect - bodyRect;
          const offsetPosition = elemPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else if (anchor.hash === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => window.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <ResumeDownload />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ scale }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-accent),transparent_50%)] opacity-20"
          />
        </div>

        {/* Floating Creative Images - BIGGER */}
        <FloatingImage 
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80" 
          delay={0.5} 
          className="w-80 h-96 top-10 -right-20 rotate-12 hidden lg:block z-0 opacity-40 dark:opacity-60"
        />
        <FloatingImage 
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80" 
          delay={0.8} 
          className="w-96 h-72 bottom-10 -left-20 -rotate-12 hidden lg:block z-0 opacity-40 dark:opacity-60"
        />
        <FloatingImage 
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80" 
          delay={1.1} 
          className="w-72 h-72 top-1/4 left-1/4 -rotate-6 opacity-20 blur-[2px] hidden xl:block z-0"
        />

        <FloatingImage 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90" 
          delay={1.4} 
          className="w-[600px] h-[600px] top-20 -right-40 rotate-6 opacity-10 blur-[1px] hidden lg:block z-0"
        />

        <div className="max-w-7xl mx-auto px-6 z-10 w-full">
          <div className="max-w-4xl relative p-8 md:p-12 rounded-[50px] overflow-hidden">
            {/* Backdrop for text visibility */}
            <div className="absolute inset-0 bg-bg/40 backdrop-blur-md rounded-[50px] -z-10 border border-white/10" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-accent font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold"
              >
                Available for Projects
              </motion.span>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 relative drop-shadow-2xl text-ink">
                {data.personalInfo.name.split(' ')[0]}<br />
                <span className="text-accent italic font-serif font-light">{data.personalInfo.name.split(' ')[1]}</span>
                
                {/* Mini Floating Photos next to name */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -right-24 top-0 hidden xl:flex flex-col gap-6"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-accent/50 rotate-12 shadow-3xl">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-white/30 -rotate-12 shadow-3xl translate-x-12">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-accent/30 rotate-6 shadow-3xl -translate-x-4">
                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </motion.div>
              </h1>
              <p className="text-xl md:text-2xl text-ink/80 max-w-md mb-12 font-medium leading-relaxed drop-shadow-lg">
                {data.personalInfo.title}
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#contact" className="px-8 py-4 bg-accent text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/30">
                  Hire Me
                </a>
                <a href="#projects" className="px-8 py-4 border-2 border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-white transition-all">
                  View Work
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 bg-bg text-ink border-y border-border scroll-mt-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--color-accent),transparent_50%)] opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-24 text-center">
            <SectionHeading title="The Story So Far" subtitle="About Me" />
            <ScrollDropText text={data.personalInfo.about} className="text-ink !py-0" size="medium" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
              <div className="absolute -inset-8 bg-black/5 rounded-[60px] blur-3xl group-hover:bg-black/10 transition-all" />
              <div className="relative aspect-[3/4] rounded-[50px] overflow-hidden border border-black/10 shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=90" 
                  alt="Modern Workspace" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-white/60 font-mono text-xs uppercase tracking-[0.4em] mb-4">UI/UX Design</p>
                  <h3 className="text-white text-4xl font-bold tracking-tighter leading-none">Crafting Digital<br />Masterpieces</h3>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <div className="relative group">
                <div className="aspect-video rounded-[32px] overflow-hidden border border-black/10 shadow-xl mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=80" 
                    alt="Design Philosophy" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-12 text-center">
                    <p className="text-white text-2xl font-serif italic leading-relaxed">
                      "I believe that great design is invisible. It should feel natural, intuitive, and serve the user without being noticed."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/20" />
                  <p className="text-xs font-mono uppercase tracking-widest font-bold">Design Philosophy</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-ink font-mono text-xs uppercase tracking-[0.3em] mb-6 font-bold">Core Skills</h4>
                  <ul className="space-y-4">
                    {data.skills.slice(0, Math.ceil(data.skills.length / 2)).map(skill => (
                      <li key={skill} className="flex items-center gap-3 text-lg font-medium text-ink/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-ink font-mono text-xs uppercase tracking-[0.3em] mb-6 font-bold">& More</h4>
                  <ul className="space-y-4">
                    {data.skills.slice(Math.ceil(data.skills.length / 2)).map(skill => (
                      <li key={skill} className="flex items-center gap-3 text-lg font-medium text-ink/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-40 bg-bg scroll-mt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollDropText text="The foundation of my technical expertise and problem-solving mindset." className="text-muted !py-20 !min-h-0 mb-10" size="medium" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div>
              <SectionHeading title="Knowledge Base" subtitle="My Education" />
              <div className="relative mt-12 group">
                <div className="absolute -inset-4 bg-accent/10 rounded-[40px] blur-3xl group-hover:bg-accent/20 transition-all" />
                <div className="relative aspect-square rounded-[40px] overflow-hidden border border-border shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=90" 
                    alt="Laptop and Code" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                </div>
              </div>
            </div>
            
            <div className="space-y-16">
              {data.education.map((edu, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative pl-12 border-l border-border group"
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-bg group-hover:scale-150 transition-transform" />
                  <span className="font-mono text-sm text-accent mb-4 block">{edu.year}</span>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight text-ink">{edu.degree}</h3>
                  <p className="text-xl text-muted mb-6 font-medium">{edu.institution}</p>
                  <ScrollDropText text={edu.description} className="text-muted !py-0 !min-h-0" size="medium" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 bg-bg scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Selected Works" subtitle="My Projects" />
          <ScrollDropText text="Building the future of web and security through innovative code." className="text-muted !py-10 !min-h-0 mb-20" size="medium" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ perspective: "1000px" }}>
            {data.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Scroll Drop Text Feature */}
      <ScrollDropText text="Turning Complex Ideas Into Elegant Digital Realities" />

      {/* Certifications Section */}
      <section id="certifications" className="py-40 bg-bg scroll-mt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollDropText text="Validating my expertise through industry-recognized standards." className="text-ink/40 !py-20 !min-h-0 mb-10" size="medium" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div>
              <SectionHeading title="Expertise Verified" subtitle="Certifications" />
              <div className="relative mt-12 group">
                <div className="absolute -inset-4 bg-accent/10 rounded-[40px] blur-3xl group-hover:bg-accent/20 transition-all" />
                <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-border shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90" 
                    alt="Cyber Security Tech" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {data.certifications.map((cert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-10 rounded-3xl border border-border hover:bg-accent/5 transition-all group hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white dark:group-hover:text-bg transition-colors">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight mb-1 text-ink">{cert.name}</h3>
                      <p className="text-muted font-medium">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="font-mono text-lg text-muted font-bold">{cert.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Massive Laptop Visual Section */}
      <section className="py-60 bg-bg overflow-hidden relative">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="max-w-[1800px] mx-auto px-6 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-40 bg-accent/20 rounded-full blur-[200px] opacity-50" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[21/9] rounded-[80px] overflow-hidden border border-border shadow-3xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=2500&q=95" 
                alt="Massive Tech Visual" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-32 left-32">
                <h2 className="text-8xl md:text-[12rem] font-bold tracking-tighter text-ink/10 leading-none">WORKSPACE</h2>
                <p className="text-accent font-mono text-sm uppercase tracking-[0.5em] mt-8 font-bold">Where Innovation Happens</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-accent text-white dark:text-bg scroll-mt-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollDropText text="Ready to start a new project? Let's talk about it." className="text-white dark:text-bg !py-20 !min-h-0 mb-10" size="medium" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.4em] mb-6 block opacity-60 font-bold">Get In Touch</span>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-12">
                Let's Build<br />Something <span className="italic font-serif font-light">Great.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-4 text-2xl font-medium hover:translate-x-2 transition-transform">
                      <Mail className="w-8 h-8" /> {data.personalInfo.email}
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(data.personalInfo.email);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative group/copy"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      <AnimatePresence>
                        {copied && (
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white text-accent text-[10px] font-bold uppercase tracking-widest"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-2xl font-medium">
                  <MapPin className="w-8 h-8" /> {data.personalInfo.location}
                </div>
              </div>
            </div>
            <div className="p-10 bg-bg rounded-[40px] text-ink border border-border shadow-2xl">
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                  window.location.href = `mailto:${data.personalInfo.email}?subject=Portfolio Message from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
                }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Name</label>
                    <input name="name" type="text" required className="w-full bg-ink/5 border border-border rounded-2xl px-6 py-4 focus:border-accent outline-none transition-colors text-ink" placeholder="Your Name" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Email</label>
                    <input name="email" type="email" required className="w-full bg-ink/5 border border-border rounded-2xl px-6 py-4 focus:border-accent outline-none transition-colors text-ink" placeholder="Your Email" />
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Message</label>
                  <textarea name="message" rows={4} required className="w-full bg-ink/5 border border-border rounded-2xl px-6 py-4 focus:border-accent outline-none transition-colors text-ink resize-none" placeholder="How can I help you?" />
                </motion.div>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full py-5 rounded-2xl bg-accent text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all"
                >
                  Send Message <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

      <footer className="py-16 border-t border-border bg-bg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-10">
          <div className="flex gap-8">
            <a 
              href={data.personalInfo.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-ink/5 text-ink hover:bg-accent hover:text-white dark:hover:text-bg hover:scale-110 transition-all relative group border border-border shadow-sm"
            >
              <Github className="w-6 h-6" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-accent text-white dark:text-bg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-2xl z-20">
                GitHub
              </span>
            </a>
            <a 
              href={data.personalInfo.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-ink/5 text-ink hover:bg-accent hover:text-white dark:hover:text-bg hover:scale-110 transition-all relative group border border-border shadow-sm"
            >
              <Linkedin className="w-6 h-6" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-accent text-white dark:text-bg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-2xl z-20">
                LinkedIn
              </span>
            </a>
            <a 
              href={`mailto:${data.personalInfo.email}`} 
              className="p-3 rounded-full bg-accent text-white dark:text-bg hover:scale-110 transition-all relative group shadow-lg shadow-accent/20"
            >
              <Mail className="w-6 h-6" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-accent text-white dark:text-bg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-2xl z-20">
                Email
              </span>
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-ink font-bold text-lg tracking-tight">Sachin Shekhar</p>
            <p className="text-muted text-sm font-medium">© 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
