/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  RefreshCw,
  Cpu,
  Home,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogClose,
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";

// --- Types ---
type TabType = 'home' | 'services' | 'solutions' | 'contact';

interface ThemeConfig {
  primary: string;
  accent: string;
  bgFrom: string;
  bgTo: string;
  background: string;
  glow: string;
}

// --- Utility Functions ---
const scrollToId = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'auto' });
  }
};

const TAB_THEMES: Record<TabType, ThemeConfig> = {
  home: { 
    primary: '217 91% 60%', 
    accent: '217 91% 65%',
    background: '217 64% 6%',
    bgFrom: '#071120',
    bgTo: '#0b1b36',
    glow: 'rgba(59, 130, 246, 0.5)'
  },
  services: { 
    primary: '150 100% 40%', 
    accent: '150 100% 50%',
    background: '150 64% 4%',
    bgFrom: '#021a10',
    bgTo: '#052d1c',
    glow: 'rgba(16, 185, 129, 0.5)'
  },
  solutions: { 
    primary: '45 93% 55%', 
    accent: '45 93% 65%',
    background: '45 64% 4%',
    bgFrom: '#1a1202',
    bgTo: '#2d2005',
    glow: 'rgba(245, 158, 11, 0.5)'
  },
  contact: { 
    primary: '280 84% 60%', 
    accent: '280 84% 70%',
    background: '280 64% 4%',
    bgFrom: '#12021a',
    bgTo: '#20052d',
    glow: 'rgba(168, 85, 247, 0.5)' 
  },
};

// --- Components ---

const AnimatedPulse = ({ path, duration = 3 }: { path: string, duration?: number, key?: React.Key }) => (
  <g>
    <path d={path} stroke="var(--color-primary)" strokeWidth="0.5" fill="none" strokeOpacity="0.05" />
    <motion.path
      d={path}
      stroke="var(--color-primary)"
      strokeWidth="1.5"
      fill="none"
      filter="url(#circuit-glow-strong)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 0.3, 0.3, 0],
        pathOffset: [0, 0, 0.7, 1],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    />
  </g>
);

const CircuitBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.08] overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="circuit-glow-strong">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Dense Trace Network - Background Layer */}
        <g stroke="var(--color-primary)" fill="none" strokeWidth="0.3" strokeOpacity="0.2">
          {Array.from({ length: 25 }).map((_, i) => (
            <path 
              key={`bg-trace-${i}`}
              d={`M ${Math.random() * 100},${Math.random() * 100} L ${Math.random() * 100},${Math.random() * 100}`} 
              strokeDasharray="4 8"
            />
          ))}
        </g>

        {/* Thematic Logic Paths - Right Angle Exclusive */}
        <AnimatedPulse path="M 0,10 L 15,10 L 15,25 L 30,25" duration={8} />
        <AnimatedPulse path="M 100,85 L 85,85 L 85,70 L 70,70" duration={7} />
        <AnimatedPulse path="M 20,100 L 20,80 L 40,80 L 40,65 L 55,65" duration={9} />
        <AnimatedPulse path="M 80,0 L 80,15 L 65,15 L 65,30 L 50,30" duration={8} />
        
        {/* Horizontal Data Buses */}
        {[15, 35, 55, 75, 95].map((y) => (
           <AnimatedPulse key={y} path={`M 0,${y} L 100,${y}`} duration={12 + Math.random() * 5} />
        ))}

        {/* Glowing Logic Gates */}
        {[
          { x: 15, y: 10 }, { x: 30, y: 25 }, { x: 85, y: 85 }, { x: 70, y: 70 },
          { x: 40, y: 80 }, { x: 60, y: 20 }, { x: 50, y: 50 }, { x: 25, y: 55 }
        ].map((node, i) => (
          <g key={`gate-${i}`}>
            <motion.circle 
              cx={`${node.x}%`} cy={`${node.y}%`} 
              r="1.5" 
              fill="var(--color-primary)"
              filter="url(#circuit-glow-strong)"
              animate={{ 
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                delay: i * 0.5 
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

const Navbar = ({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRequest = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setActiveTab('contact');
      scrollToId('contact');
    }, 400);
  };

  const navLinks: { name: string; href: TabType }[] = [
    { name: 'Services & Calibration', href: 'services' },
    { name: 'Technical Solutions', href: 'solutions' },
    { name: 'Request Service', href: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 overflow-hidden ${isScrolled ? 'bg-background/95 border-b border-primary/20 shadow-md py-2 backdrop-blur-md' : 'bg-transparent py-4 lg:py-6'}`}>
      {isScrolled && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} className="absolute inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-scanline" />
        </motion.div>
      )}
      <div className="container flex justify-between items-center relative z-10 transition-all duration-300">
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); scrollToId('home'); }} className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center bg-[#071120] rounded-sm p-1 border border-primary/30 group-hover:border-primary transition-colors">
             <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,0 100,50 50,100 0,50" fill="currentColor" className="text-primary/20"/>
                <polygon points="50,9 91,50 50,91 9,50" fill="white"/>
                <polygon points="50,22 64,36 50,50 36,36" fill="currentColor" className="text-primary"/>
                <polygon points="30,44 44,58 44,84 16,56" fill="currentColor" className="text-secondary"/>
                <polygon points="70,44 56,58 56,84 84,56" fill="currentColor" className="text-secondary"/>
                <rect x="47" y="62" width="6" height="24" fill="currentColor" className="text-secondary"/>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          </div>
          <div className="flex flex-col leading-none font-display font-black text-[9px] sm:text-[11px] tracking-tighter text-foreground uppercase">
            <span>MYANMAR</span>
            <span className="video-text text-[11px] sm:text-[13px] leading-tight">PRECISION</span>
            <span>SYSTEMS</span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <button onClick={() => { setActiveTab(link.href); scrollToId(link.href); }} className="text-[10px] font-ui font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all hover:scale-105">
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-8 border-l border-white/10 pl-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-white tracking-tight">+959 428 014 092</span>
              <span className="text-[10px] font-mono text-white tracking-tight">+959 758 653 198</span>
            </div>
            <Button size="sm" className="relative overflow-hidden font-ui uppercase font-black tracking-widest text-[10px] h-10 px-6 rounded-none bg-primary hover:bg-primary-hover shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all group" disabled={isTransmitting} onClick={handleRequest}>
              <AnimatePresence mode="wait">
                {isTransmitting ? (
                  <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">Linking...</motion.div>
                ) : (
                  <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>REQUEST SERVICE</motion.span>
                )}
              </AnimatePresence>
              {isTransmitting && (
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }} />
              )}
            </Button>
          </div>
        </div>

        <button className="lg:hidden text-foreground p-2 border border-white/10 rounded-sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden absolute top-full left-0 w-full bg-secondary/95 border-b border-primary/20 backdrop-blur-xl py-8 px-6 flex flex-col gap-8 overflow-hidden">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => { setActiveTab(link.href); scrollToId(link.href); setIsMobileMenuOpen(false); }} className="text-3xl font-display font-black uppercase text-left tracking-tighter">
                {link.name}
              </button>
            ))}
            <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
              <Button className="w-full h-16 uppercase font-ui font-black tracking-[0.2em]" onClick={() => { setActiveTab('contact'); scrollToId('contact'); setIsMobileMenuOpen(false); }}>
                REQUEST SERVICE
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ isMobile = false, onRequestService, onTechnicalSolutions }: { isMobile?: boolean, onRequestService?: () => void, onTechnicalSolutions?: () => void }) => {
  const [isRequestingRepair, setIsRequestingRepair] = useState(false);

  const handleRequestRepair = () => {
    setIsRequestingRepair(true);
    setTimeout(() => {
      if (onRequestService) onRequestService();
      setIsRequestingRepair(false);
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="relative w-full flex flex-col justify-center">
      <section className={`relative ${isMobile ? 'min-h-[calc(100vh-96px)] pt-8' : 'min-h-[calc(100vh-80px)] pt-24'} w-full transition-all duration-1000 flex items-center`}>
        <div className="absolute inset-0 pcb-trace z-[1] pointer-events-none" />
        <div className="absolute top-40 left-10 pcb-label z-[2]">BOARD_ID: MPS_RECOVERY_L1</div>
        <div className="absolute bottom-40 right-10 pcb-label z-[2] rotate-90 origin-right">MCU_SLOT: ARM_CORTEX_M4</div>
        <div className="absolute top-1/4 right-[20%] pcb-label z-[2]">PWR_IN: 12V_REG</div>
        <div className="absolute top-[60vh] left-[5%] pcb-label z-[2]">BUS_SYSTEM: I2C_LOCKED</div>
        
        {!isMobile && (
          <>
            <motion.div initial={{ height: 0 }} animate={{ height: '20vh' }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute top-0 right-[15%] w-[1px] bg-primary/20 z-[2]" />
            <div className="absolute top-[20vh] right-[15%] w-4 h-4 border border-primary/40 rounded-full z-[2] flex items-center justify-center">
              <div className="w-1 h-1 bg-primary animate-pulse" />
            </div>
            <div className="absolute top-[21vh] right-[15%] pcb-label">TP_REF_01</div>
            <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 2, delay: 1 }} className="absolute bottom-[15%] left-0 h-[1px] bg-primary/20 z-[2]" />
            <div className="absolute bottom-[15%] left-[10%] w-2 h-2 bg-primary/40 rotate-45 z-[2]" />
            <div className="absolute bottom-[13%] left-[10%] pcb-label">GND_PLANE</div>
            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }} className="absolute top-[10%] left-[8%] w-[2px] h-[80%] bg-gradient-to-b from-transparent via-primary/30 to-transparent z-[1] origin-top" />
          </>
        )}

        <div className="absolute inset-0 z-0">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }} src="hero-background.png" alt="Myanmar Precision Systems Technical Laboratory" className="w-full h-full object-cover object-center opacity-60 contrast-110 brightness-95" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: [0, 0.4, 0.2, 0.5, 0.2], scaleX: [0, 1.2, 1, 1.5, 1], x: ['-5%', '5%', '0%'] }} transition={{ duration: 5, delay: 1, repeat: Infinity, repeatDelay: 4 }} className="anamorphic-flare top-1/4 left-0 h-[1px] bg-primary/40 shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
        </div>

        <div className={`container relative z-10 flex flex-col items-start text-left ${isMobile ? 'px-4' : ''}`}>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`${isMobile ? 'max-w-full p-6' : 'max-w-3xl p-6 md:p-8'} relative group isolate overflow-hidden`}>
            <div className="absolute inset-0 z-[-1] bg-black/10 backdrop-blur-[2px] opacity-20 pointer-events-none rounded-sm border-l-2 border-primary/20" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-primary/30 to-transparent" />
            <motion.div variants={itemVariants} className="hud-overline text-primary/80">LABORATORY · PRECISION</motion.div>
            <motion.h1 variants={itemVariants} className={`${isMobile ? 'text-2xl sm:text-3xl' : 'text-5xl md:text-7xl'} font-display font-black mb-4 leading-[1.1] tracking-tighter uppercase`}>
              <span className="text-foreground">MYANMAR</span><br />
              <span className="video-text animate-shimmer text-shadow-glow">PRECISION</span> <span className="text-foreground">SYSTEMS</span>
            </motion.h1>
            <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, delay: 0.8 }} className="h-1 bg-[#FBBF24] mb-6 max-w-[120px] sm:max-w-sm shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            <motion.p variants={itemVariants} className={`${isMobile ? 'text-sm' : 'text-lg'} text-foreground/90 font-medium mb-8 max-w-2xl leading-relaxed`}>
              Expert repair & calibration for survey, soil testing, and concrete testing instruments. NIST-traceable. Fast turnaround. Professional laboratory grade.
            </motion.p>
            <motion.div variants={itemVariants} className={`flex flex-col sm:flex-row gap-4 ${isMobile ? 'mb-10' : ''}`}>
              <Button size="lg" className="px-6 h-11 font-ui uppercase font-black text-[9px] tracking-[0.4em] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden" onClick={handleRequestRepair} disabled={isRequestingRepair}>
                <div className="absolute inset-x-0 top-0 h-[1px] bg-primary/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                {isRequestingRepair ? (<>Linking... <RefreshCw size={12} className="ml-2 animate-spin" /></>) : (<>REQUEST SERVICE <ArrowRight size={12} className="ml-2 group-hover:translate-x-2 transition-transform" /></>)}
              </Button>
              <Button size="lg" variant="outline" className="px-6 h-11 bg-primary/5 font-ui uppercase font-black text-[9px] tracking-[0.4em] border-primary/20 hover:border-primary transition-all backdrop-blur-md" onClick={() => onTechnicalSolutions ? onTechnicalSolutions() : null}>
                TECHNICAL SOLUTIONS
              </Button>
            </motion.div>
            <motion.div animate={{ top: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-40 z-20 pointer-events-none" />
            <div className="hero-glow absolute inset-0 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const TechnicalMatrix = ({ isMobile = false, onContactClick }: { isMobile?: boolean, onContactClick?: () => void }) => {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

  const laboratoryImages = [
    { url: "Survey instruments.jpeg", title: "SURVEY CALIBRATION", tag: "PRECISION", desc: "Total Stations & Theodolites", features: ["Angle accuracy verification", "EDM distance calibration", "Compensator adjustment", "Firmware system diagnostics"] },
    { url: "gps.png", title: "GPS & GNSS SYSTEMS", tag: "GEODETIC", desc: "Satellite Positioning Units", features: ["Antenna phase center check", "Receiver noise analysis", "Network connection test", "Signal tracking optimization"] },
    { url: "Compression machine.jpg", title: "COMPRESSION TESTING", tag: "NDT TESTING", desc: "Universal Testing Machines", features: ["Load cell verification", "MCU board revival & repair", "Piston speed monitoring", "Safety system audit"] },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200", title: "EMBEDDED SOLUTIONS", tag: "DEVELOPMENT", desc: "MCU Systems & Motor Control", features: ["Custom MCU integration", "DC Motor controlling", "Legacy system revival", "In-house board design"] },
    { url: "Construction Lab Equipment.jpg", title: "LAB EQUIPMENT", tag: "ANALYSIS", desc: "Testing & Measurement Tools", features: ["Balance & scale precision", "Oven temp uniformity", "Sieve mesh integrity", "Sensor validation"] }
  ];

  return (
    <section id="services" className={`relative overflow-hidden ${isMobile ? 'py-4' : 'py-8'} bg-[#020408]`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="absolute inset-0 pcb-trace" />
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[160px] rounded-full" />
      </div>
      <div className="container relative z-10 px-6 sm:px-12">
        <div className={`${isMobile ? 'flex flex-col' : 'grid lg:grid-cols-[0.5fr_2fr] gap-12 items-start'}`}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }} className={`${isMobile ? 'mb-4 text-center' : 'sticky top-24'}`}>
             <div className={`flex items-center gap-4 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: 32 }} transition={{ duration: 1, delay: 0.5 }} className="h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                <span className="text-[10px] font-mono font-black text-primary tracking-[0.4em] uppercase">PRECISION LAB</span>
             </div>
             <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black text-white mb-1 md:mb-2 tracking-tighter leading-none uppercase`}>
                TECHNICAL <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">SOLUTIONS</span>
             </h2>
             <div className={`${isMobile ? 'flex flex-row items-center gap-3 mb-4 mt-2' : 'space-y-6'} ${isMobile ? 'mx-auto justify-center' : ''}`}>
                <div className={`${isMobile ? 'px-2 py-1' : 'p-4'} bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col justify-center items-center h-fit`}>
                  <span className={`${isMobile ? 'text-lg' : 'text-3xl'} font-black text-white tracking-tighter block leading-none`}>15+</span>
                  <span className="text-[7px] font-mono font-bold text-white/20 uppercase tracking-widest">YEARS</span>
                </div>
                {!isMobile && (<div className="relative group"><div className="absolute left-0 top-0 bottom-0 w-[1px] bg-primary/20" /><p className="text-[13px] text-white/40 font-medium leading-relaxed pl-6">Professional calibration for precision instruments.</p></div>)}
                {isMobile && (<div className="px-2 py-1 bg-white/[0.02] border border-white/5 flex flex-col justify-center items-center h-fit"><ShieldCheck size={12} className="text-primary mb-1" /><span className="text-[8px] font-mono font-bold text-white/20 uppercase">TRUST</span></div>)}
             </div>
             <div className={`${isMobile ? 'hidden' : 'space-y-4'}`}>
                  <Button className={`${isMobile ? 'h-11 py-2' : 'h-12'} w-full uppercase font-black tracking-[0.3em] text-[10px] rounded-none bg-primary hover:bg-primary/90 text-black shadow-[0_5px_15px_rgba(var(--primary),0.2)] transition-all group/cta overflow-hidden relative`} onClick={() => onContactClick ? onContactClick() : scrollToId('contact')}>
                    <span className="relative z-10 flex items-center gap-3">REQUEST SERVICE <ArrowRight size={14} className="group-hover/cta:translate-x-2 transition-transform" /></span>
                  </Button>
                  <div className={`flex items-center gap-3 ${isMobile ? 'justify-center' : ''}`}>
                    <ShieldCheck size={12} className="text-primary" />
                    <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">NIST TRACEABLE LAB</span>
                  </div>
             </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
             {laboratoryImages.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }} viewport={{ once: true }} className={`group relative ${isMobile ? 'h-[320px]' : (i === 0 ? 'md:h-[720px] md:row-span-2' : 'md:h-[350px]')} overflow-hidden bg-black/60 border border-white/5 hover:border-primary/40 transition-all duration-700 shadow-2xl relative`}>
                  <Dialog open={openDialogIndex === i} onOpenChange={(open) => { if (!open) setOpenDialogIndex(null); }}>
                    <DialogTrigger asChild onClick={() => setOpenDialogIndex(i)}>
                      <button className="w-full h-full text-left p-0 border-0 bg-transparent cursor-pointer block relative group/card">
                        <div className="w-full h-full overflow-hidden relative bg-[#05070a]">
                        <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity">
                           <motion.div animate={{ x: [-2, 2, -2], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 0.1, repeat: Infinity }} className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                           <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-primary/20" />
                           <div className="absolute top-0 bottom-0 right-[20%] w-[1px] bg-primary/20" />
                        </div>
                        <div className="absolute inset-0 pcb-trace z-0" />
                        <div className="pcb-corner top-0 left-0 border-t border-l" />
                        <div className="pcb-corner top-0 right-0 border-t border-r" />
                        <div className="pcb-corner bottom-0 left-0 border-b border-l" />
                        <div className="pcb-corner bottom-0 right-0 border-b border-r" />
                        <div className="absolute top-2 left-2 pcb-label">S_ID_{i < 10 ? '0'+i : i}</div>
                        <div className="absolute bottom-2 right-12 pcb-label">REV_A.0</div>
                        <div className="absolute top-1/2 -right-4 pcb-label -rotate-90 origin-right text-[6px]">PIN_OUT: DIGITAL</div>
                        <div className="absolute inset-4 border border-white/[0.03] z-0 pointer-events-none" />
                        <img src={img.url} className={`w-full h-full object-contain ${i === 0 && !isMobile ? 'p-10' : 'p-4'} opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out z-10 relative`} alt={img.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-20" />
                        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />
                        <div className="absolute inset-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-0 left-0 w-10 h-[1px] bg-primary" />
                          <div className="absolute top-0 left-0 w-[1px] h-10 bg-primary" />
                          <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-primary" />
                          <div className="absolute bottom-0 right-0 w-[1px] h-10 bg-primary" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <div className="flex flex-col gap-2">
                              <span className="inline-flex w-fit px-3 py-1 bg-primary text-black text-[8px] font-black uppercase tracking-[0.2em] rounded-none">{img.tag}</span>
                              <div className="space-y-1">
                                <h4 className={`${i === 0 && !isMobile ? 'text-2xl' : 'text-lg'} font-black text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors`}>{img.title}</h4>
                                <p className="text-[10px] text-white/40 font-medium uppercase tracking-[0.2em] line-clamp-1">{img.desc}</p>
                              </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </DialogTrigger>
                    <DialogContent className="sm:max-w-[1100px] w-[98vw] bg-[#020408] border-primary/20 p-0 overflow-hidden text-foreground backdrop-blur-3xl [&>button]:hidden">
                      <div className="flex flex-col md:flex-row relative">
                        <div className="absolute top-4 left-4 pcb-label z-[50]">COMPONENT_VIEW: TOP_LAYER</div>
                        <div className="absolute bottom-4 right-4 pcb-label z-[50]">MOD_UID: XP-700-K</div>
                        <div className="md:w-[70%] aspect-video md:h-[500px] bg-[#000] p-1 md:p-3 flex items-center justify-center relative overflow-hidden border-r border-white/5">
                          <div className="absolute inset-0 pcb-trace" />
                          <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} src={img.url} className="w-full h-full object-contain relative z-10" alt={img.title} />
                        </div>
                        <div className="md:w-[30%] p-6 md:p-10 flex flex-col justify-between bg-gradient-to-br from-black to-[#05070a]">
                           <div className="space-y-6">
                             <div className="flex items-center gap-4"><span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.4em]">{img.tag}</span><div className="h-[1px] flex-1 bg-white/5" /></div>
                             <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">{img.title}</h2>
                             <div className="space-y-2.5">
                               {img.features.map((feat, idx) => (
                                 <div key={idx} className="flex items-start gap-3">
                                   <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                   <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{feat}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                           <div className="space-y-2 mt-8">
                             <DialogClose asChild>
                               <Button className="w-full h-12 uppercase font-black tracking-[0.3em] text-[10px] rounded-none bg-primary hover:bg-primary/90 text-black transition-all active:scale-95" onClick={() => { if (onContactClick) onContactClick(); scrollToId('contact'); setOpenDialogIndex(null); }}>START ENQUIRY</Button>
                             </DialogClose>
                             <DialogClose asChild>
                               <Button variant="ghost" className="w-full h-10 text-[9px] font-black text-white/20 hover:text-white/40 uppercase tracking-widest rounded-none" onClick={() => setOpenDialogIndex(null)}>CLOSE VIEW</Button>
                             </DialogClose>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
             ))}
          </div>
        </div>
        {!isMobile && (
          <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap gap-16 justify-center items-center opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
             <span className="text-sm font-mono font-bold tracking-[0.4em] text-white">LEICA.GEO</span>
             <span className="text-sm font-mono font-bold tracking-[0.4em] text-white">TOPCON.IND</span>
             <span className="text-sm font-mono font-bold tracking-[0.4em] text-white">SOKKIA.PRO</span>
             <span className="text-sm font-mono font-bold tracking-[0.4em] text-white">TRIMBLE.NX</span>
             <span className="text-sm font-mono font-bold tracking-[0.4em] text-white">NIKON.OPTICS</span>
          </div>
        )}
      </div>
    </section>
  );
};

// ✅ EMAILJS INTEGRATED CONTACT FORM
const ContactMinimal = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'complete'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('transmitting');
    emailjs.sendForm(
      'myanmarprecisionsystems',
      'template_qb60bf6',
      formRef.current!,
      'nAjrX8oMq7nJNLyE6'
    ).then(() => {
      setStatus('complete');
      setTimeout(() => setStatus('idle'), 3000);
    }).catch(() => {
      setStatus('idle');
      alert('Failed to send. Please try WhatsApp or call us directly.');
    });
  };

  return (
    <section id="contact" className={`${isMobile ? 'h-full py-6 flex flex-col overflow-y-auto pb-20 custom-scrollbar pr-1' : 'py-12 bg-transparent relative border-t border-primary/5'}`}>
      <div className={`container relative z-10 ${isMobile ? 'flex flex-col gap-10' : 'grid lg:grid-cols-2 gap-12 items-stretch'}`}>
        <div className="flex flex-col justify-center">
            <h2 className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-black mb-8 leading-tight uppercase`}>
                <span className="video-text animate-shimmer">REQUEST</span> <span className="text-foreground">SERVICE</span>
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-xl'} text-muted-foreground font-medium mb-12`}>Submit your instrument details for an immediate diagnostic roadmap and estimate.</p>
            <div className="space-y-6 mb-12">
               <div className="flex items-start gap-6 border-l-2 border-primary pl-10">
                  <div>
                    <h4 className="text-xs font-mono font-black uppercase tracking-[0.3em] text-primary mb-2">Service Hub</h4>
                    <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-foreground leading-relaxed`}>North Dagon Township, Yangon, Myanmar</p>
                    <a 
                      href="https://maps.app.goo.gl/AaqiFLavrhunhcWz9" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="mt-4 inline-flex items-center gap-3 px-6 py-4 bg-[#4285F4] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all w-fit"
                    >
                      <MapPin size={16} />View on Google Maps
                    </a>
                  </div>
               </div>
               <div className="flex items-start gap-6 border-l-2 border-primary pl-10">
                  <div>
                    <h4 className="text-xs font-mono font-black uppercase tracking-[0.3em] text-primary mb-2">Hotline Support</h4>
                    <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-foreground leading-tight`}>+959 428 014 092</p>
                    <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-foreground leading-tight`}>+959 758 653 198</p>
                  </div>
               </div>
               <div className="pl-10 flex flex-wrap gap-4">
                  <a href="https://wa.me/959428014092" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all">
                    <Phone size={16} />Message us on WhatsApp
                  </a>
                  <a href="https://viber.me/+959428014092" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-6 py-4 bg-[#7360F2] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                    <Phone size={16} />Message us on Viber
                  </a>
               </div>
            </div>
        </div>

        <form
          ref={formRef}
          className={`${isMobile ? 'p-6' : 'p-10 md:p-14'} bg-secondary/20 border border-primary/20 shadow-2xl relative overflow-hidden group`}
          onSubmit={handleSubmit}
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
               <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Full Name</Label>
                  <Input required name="from_name" className="h-10 bg-secondary/30 border-primary/30 rounded-none focus:border-primary backdrop-blur-sm pr-1 transition-all" placeholder="NAME" />
               </motion.div>
               <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Company Name</Label>
                  <Input required name="company" className="h-10 bg-secondary/30 border-primary/30 rounded-none focus:border-primary backdrop-blur-sm pr-1 transition-all" placeholder="COMPANY" />
               </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
               <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Phone Number</Label>
                  <Input required name="phone" type="tel" className="h-10 bg-secondary/30 border-primary/30 rounded-none focus:border-primary backdrop-blur-sm pr-1 transition-all" placeholder="+95" />
               </motion.div>
               <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Email Address</Label>
                  <Input required name="from_email" type="email" className="h-10 bg-secondary/30 border-primary/30 rounded-none focus:border-primary backdrop-blur-sm pr-1 transition-all" placeholder="EMAIL" />
               </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Equipment Type</Label>
                    <Select required name="equipment_type">
                        <SelectTrigger className="h-10 bg-secondary/30 border-primary/30 rounded-none uppercase font-black text-[10px] tracking-widest backdrop-blur-sm focus:border-primary transition-all">
                            <SelectValue placeholder="SELECT TYPE" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary/95 border-primary/30 text-foreground uppercase text-[10px] font-black backdrop-blur-xl">
                            <SelectItem value="survey">Survey Instrument</SelectItem>
                            <SelectItem value="soil">Soil Testing Equipment</SelectItem>
                            <SelectItem value="concrete">Concrete Testing Equipment</SelectItem>
                            <SelectItem value="industrial">Industrial Machine</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>
                <motion.div className="space-y-2" whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Service Required</Label>
                    <Select required name="service_type">
                        <SelectTrigger className="h-10 bg-secondary/30 border-primary/30 rounded-none uppercase font-black text-[10px] tracking-widest backdrop-blur-sm focus:border-primary transition-all">
                            <SelectValue placeholder="SELECT SERVICE" />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary/95 border-primary/30 text-foreground uppercase text-[10px] font-black backdrop-blur-xl">
                            <SelectItem value="cal">Calibration</SelectItem>
                            <SelectItem value="repair">Repair & Servicing</SelectItem>
                            <SelectItem value="recovery">Embedded Systems Recovery</SelectItem>
                            <SelectItem value="pm">Preventive Maintenance</SelectItem>
                            <SelectItem value="consult">Technical Consultation</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>
            </div>

            <motion.div className="space-y-2 mb-6" whileFocus={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Equipment Brand & Model</Label>
                <Input required name="equipment" className="h-10 bg-secondary/30 border-primary/30 rounded-none focus:border-primary backdrop-blur-sm pr-1 transition-all" placeholder="BRAND / MODEL" />
            </motion.div>

            <motion.div className="space-y-2 mb-6" whileFocus={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Fault Description</Label>
                <Textarea required name="message" className="h-20 bg-secondary/30 border-primary/30 rounded-none focus:border-primary p-4 resize-none backdrop-blur-sm pr-1 transition-all" placeholder="DESCRIBE THE ISSUE" />
            </motion.div>

            <div className="space-y-3 mb-8">
                <Label className="text-[10px] font-mono uppercase text-primary font-black tracking-widest">Preferred Contact</Label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="contact_pref" value="phone" className="w-3 h-3 accent-primary" defaultChecked />
                        <span className="text-[10px] font-black uppercase text-foreground/80 group-hover:text-primary transition-colors">Phone</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="contact_pref" value="whatsapp" className="w-3 h-3 accent-primary" />
                        <span className="text-[10px] font-black uppercase text-foreground/80 group-hover:text-primary transition-colors">WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="contact_pref" value="email" className="w-3 h-3 accent-primary" />
                        <span className="text-[10px] font-black uppercase text-foreground/80 group-hover:text-primary transition-colors">Email</span>
                    </label>
                </div>
            </div>

            <Button type="submit" disabled={status !== 'idle'} className={`relative overflow-hidden w-full h-14 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(68,157,251,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-500 rounded-none ${status === 'complete' ? 'bg-green-600' : 'bg-primary'}`}>
                <AnimatePresence mode="wait">
                  {status === 'idle' && (<motion.div key="idle" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-3"><span>SEND SERVICE REQUEST</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></motion.div>)}
                  {status === 'transmitting' && (<motion.div key="transmitting" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="flex items-center gap-3"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Compass size={18} /></motion.div><span>UPLOADING_DATA...</span></motion.div>)}
                  {status === 'complete' && (<motion.div key="complete" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white flex items-center gap-2"><ShieldCheck size={20} /><span>MISSION_SUCCESS_SENT</span></motion.div>)}
                </AnimatePresence>
            </Button>
        </form>
      </div>
    </section>
  );
};

const TechnicalSolutions = ({ isMobile = false, onContactClick }: { isMobile?: boolean, onContactClick?: () => void }) => {
  return (
    <section id="solutions" className={`relative overflow-hidden ${isMobile ? 'h-full py-6 flex flex-col overflow-y-auto pb-10 custom-scrollbar pr-1' : 'py-10'} bg-[#020408]`}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="absolute inset-0 pcb-trace" />
        <motion.div animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900/10 blur-[150px] rounded-full" />
      </div>
      <div className={`${isMobile ? 'px-4' : 'container px-6 sm:px-12'} relative z-10`}>
        <div className={`${isMobile ? 'flex flex-col' : 'grid lg:grid-cols-2'} ${isMobile ? 'gap-4' : 'gap-12 lg:gap-16'} items-center`}>
          <motion.div initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 10 : 0 }} whileInView={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className={`relative ${isMobile ? 'text-center mb-4' : ''}`}>
            <div className="absolute -top-6 left-0 pcb-label">COMPONENT: MCU_INTEGRATION_MODULE</div>
            <div className="absolute top-0 -left-6 pcb-label rotate-[-90deg] origin-top-left">PORT_A/B</div>
            {!isMobile && (<motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="absolute top-1/2 -left-12 w-12 h-[1px] bg-primary/40 z-0 origin-right" />)}
            <div className={`flex items-center gap-4 mb-2 ${isMobile ? 'justify-center' : ''}`}>
              <div className="h-[2px] w-12 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
              <span className="text-[10px] font-mono font-black text-primary tracking-[0.4em] uppercase">SYSTEM INTEGRATION</span>
            </div>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-black text-white mb-2 md:mb-6 tracking-tighter leading-none uppercase`}>
              EMBEDDED <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">SOLUTIONS</span>
            </h2>
            <div className={`space-y-2 mb-4 ${isMobile ? 'text-left' : 'mb-8 text-left'}`}>
              <div className={`${isMobile ? 'p-1.5 inline-block' : 'p-6'} bg-white/[0.02] border-l border-primary/40 border-y border-r border-white/5 backdrop-blur-sm relative overflow-hidden`}>
                <h4 className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">MACHINE REVIVAL & MCU DEV</h4>
                {isMobile && <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" /><span className="text-[6px] font-black text-blue-400 uppercase">BETA</span></div>}
              </div>
              <div className="space-y-1">
                <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-white/40 font-medium leading-tight uppercase`}>Reviving legacy machinery via custom MCU architectures. Specialized in Compression Machine board replacement and DC Motor control systems.</p>
                <div className="flex items-center gap-2">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[8px] font-bold text-primary uppercase tracking-tighter">MCU Fabrication & PCB Recovery Unit: IN_OPERATIONS</span>
                </div>
              </div>
              <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-2'} gap-1 md:gap-2 mt-4`}>
                {[{ title: "MCU DEV", desc: "Custom Control" }, { title: "DC MOTOR", desc: "Control Logic" }, { title: "BOARD REVIVE", desc: "PCB Recovery" }, { title: "IN DEV", desc: "Future Support" }].map((item, idx) => (
                  <div key={idx} className={`${isMobile ? 'p-1 justify-center' : 'p-4'} flex items-center gap-2 border border-white/5 bg-white/[0.01]`}>
                    <div className="w-[1px] h-3 bg-primary" />
                    <div>
                      <div className="text-[8px] font-black text-white uppercase tracking-tighter">{item.title}</div>
                      {!isMobile && <div className="text-[7px] font-medium text-white/30 uppercase tracking-widest">{item.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button className={`h-11 uppercase font-black tracking-[0.3em] text-[10px] rounded-none bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all group ${isMobile ? 'w-full' : 'px-10'}`} onClick={() => onContactClick ? onContactClick() : scrollToId('contact')}>
              CONSULT ENGINEER <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: true }} className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full animate-pulse" />
            <div className="relative aspect-square sm:aspect-video lg:aspect-square overflow-hidden bg-[#05070a] border border-white/10 p-4">
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scanline z-20" />
              <img src="images (6).jpeg" alt="Technical Maintenance Solutions" className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />
              <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                <div className="text-[8px] font-mono text-primary/60 tracking-widest uppercase">SYSTM_STUS: OPTIMAL</div>
                <div className="w-24 h-[1px] bg-primary/30" />
              </div>
              <div className="absolute bottom-8 left-8 flex items-center gap-4">
                 <div className="w-0.5 h-12 bg-primary" />
                 <div>
                   <div className="text-[10px] font-black text-white uppercase tracking-widest">UNIT DIAGNOSTIC</div>
                   <div className="text-[8px] font-mono text-white/40 uppercase">X-REF: 774-ALPHA</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CompactFooter = () => (
  <footer className="py-16 bg-background/50 border-t border-primary/10 backdrop-blur-sm">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-[#071120] border-2 border-primary/30 relative overflow-hidden group">
                  <svg className="w-10 h-10" viewBox="0 0 100 100">
                    <polygon points="50,0 100,50 50,100 0,50" fill="currentColor" className="text-primary/20"/>
                    <polygon points="50,9 91,50 50,91 9,50" fill="white"/>
                    <polygon points="50,22 64,36 50,50 36,36" fill="currentColor" className="text-primary"/>
                    <polygon points="30,44 44,58 44,84 16,56" fill="currentColor" className="text-secondary"/>
                    <polygon points="70,44 56,58 56,84 84,56" fill="currentColor" className="text-secondary"/>
                    <rect x="47" y="62" width="6" height="24" fill="currentColor" className="text-secondary"/>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
             </div>
            <div className="flex flex-col leading-none font-display font-black text-xl tracking-tighter text-foreground uppercase">
                <span>MYANMAR</span>
                <span className="video-text text-shadow-glow">PRECISION</span>
                <span>SYSTEMS</span>
            </div>
        </div>
        <div className="flex gap-12 text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> NETWORK STATUS: ACTIVE</span>
            <span className="flex items-center gap-2">SINCE: 2015</span>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">© 2025 Myanmar Precision Systems</p>
            <p className="text-[9px] text-primary italic font-black uppercase tracking-[0.2em]">Serving Myanmar's Structural Future</p>
        </div>
    </div>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showLetterbox, setShowLetterbox] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const currentTheme = TAB_THEMES[activeTab] || TAB_THEMES.home;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setTimeout(() => { setActiveTab(tab); setTimeout(() => scrollToId(tab), 50); }, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowLetterbox(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (<div className="min-h-full" id="home"><Hero isMobile={isMobile} onRequestService={() => handleTabChange('contact')} onTechnicalSolutions={() => handleTabChange('services')} /></div>);
      case 'services':
        return <TechnicalMatrix isMobile={isMobile} onContactClick={() => handleTabChange('contact')} />;
      case 'solutions':
        return <TechnicalSolutions isMobile={isMobile} onContactClick={() => handleTabChange('contact')} />;
      case 'contact':
        return <ContactMinimal isMobile={isMobile} />;
      default:
        return <Hero isMobile={isMobile} onTechnicalSolutions={() => handleTabChange('services')} />;
    }
  };

  return (
    <motion.div 
      className="min-h-screen w-screen bg-background selection:bg-primary selection:text-primary-foreground font-sans relative"
      animate={{ 
        '--primary': currentTheme.primary, 
        '--accent': currentTheme.accent, 
        '--ring': currentTheme.primary, 
        '--background': currentTheme.background, 
        '--theme-glow': currentTheme.glow, 
        '--bg-from': currentTheme.bgFrom, 
        '--bg-to': currentTheme.bgTo 
      } as any}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <AnimatePresence>
        {showLetterbox && (
          <>
            <motion.div initial={{ top: 0 }} animate={{ top: '-15%' }} exit={{ top: '-20%' }} transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }} className="fixed left-0 w-full h-[12vh] bg-primary/10 z-[2000] pointer-events-none border-b border-primary/10" />
            <motion.div initial={{ bottom: 0 }} animate={{ bottom: '-15%' }} exit={{ bottom: '-20%' }} transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }} className="fixed left-0 w-full h-[12vh] bg-primary/10 z-[2000] pointer-events-none border-t border-primary/10" />
          </>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-[100] noise opacity-[0.02] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[var(--bg-from)] via-[var(--bg-to)] to-[var(--bg-from)] pointer-events-none transition-colors duration-1000" />
      <CircuitBackground />
      
      <div className={`fixed ${isMobile ? 'inset-4' : 'inset-6 md:inset-10'} z-[105] pointer-events-none border border-primary/10 transition-colors duration-1000`}>
        <div className={`absolute top-0 left-0 ${isMobile ? 'w-6 h-6' : 'w-12 h-12'} border-t-2 border-l-2 border-primary/40 transition-colors duration-1000`} />
        <div className={`absolute top-0 right-0 ${isMobile ? 'w-6 h-6' : 'w-12 h-12'} border-t-2 border-r-2 border-primary/40 transition-colors duration-1000`} />
        <div className={`absolute bottom-0 left-0 ${isMobile ? 'w-6 h-6' : 'w-12 h-12'} border-b-2 border-l-2 border-primary/40 transition-colors duration-1000`} />
        <div className={`absolute bottom-0 right-0 ${isMobile ? 'w-6 h-6' : 'w-12 h-12'} border-b-2 border-r-2 border-primary/40 transition-colors duration-1000`} />
      </div>

      <Navbar setActiveTab={handleTabChange} />

      <main className="min-h-screen pt-24 lg:pt-20 pb-16 lg:pb-0 relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }} 
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-6 py-2 bg-black/60 backdrop-blur-md flex justify-between items-center border-y border-white/5">
        <div className="pcb-label">SIGNAL: STABLE</div>
        <div className="pcb-label">LATENCY: 12ms</div>
        <div className="pcb-label">V_CORE: 3.3V</div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary/90 border-t border-primary/20 backdrop-blur-lg px-2 py-4 flex justify-around items-center">
        <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'home' ? 'text-primary scale-110' : 'text-muted-foreground opacity-60'}`}>
          <Home size={18} className={activeTab === 'home' ? 'drop-shadow-[0_0_8px_rgba(68,157,251,0.8)]' : ''} />
          <span className="text-[7px] font-mono font-black uppercase tracking-widest">Base</span>
        </button>
        <button onClick={() => handleTabChange('services')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'services' ? 'text-primary scale-110' : 'text-muted-foreground opacity-60'}`}>
          <Settings size={18} className={activeTab === 'services' ? 'drop-shadow-[0_0_8px_rgba(68,157,251,0.8)]' : ''} />
          <span className="text-[7px] font-mono font-black uppercase tracking-widest">Tech</span>
        </button>
        <button onClick={() => handleTabChange('solutions')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'solutions' ? 'text-primary scale-110' : 'text-muted-foreground opacity-60'}`}>
          <Cpu size={18} className={activeTab === 'solutions' ? 'drop-shadow-[0_0_8px_rgba(68,157,251,0.8)]' : ''} />
          <span className="text-[7px] font-mono font-black uppercase tracking-widest">Solu</span>
        </button>
        <button onClick={() => handleTabChange('contact')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'contact' ? 'text-primary scale-110' : 'text-muted-foreground opacity-60'}`}>
          <Mail size={18} className={activeTab === 'contact' ? 'drop-shadow-[0_0_8px_rgba(68,157,251,0.8)]' : ''} />
          <span className="text-[7px] font-mono font-black uppercase tracking-widest">Form</span>
        </button>
      </div>

      {!isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-10 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-10 pointer-events-none">
          <div className="flex gap-12">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full pcb-pulse" /><span className="pcb-label">CORE_LINK: ACTIVE</span></div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 animate-pulse rounded-full delay-500" /><span className="pcb-label font-bold text-blue-400/80">TX: ...STREAMING</span></div>
            <div className="flex items-center gap-2"><span className="pcb-label text-white/20">BUFFER:</span><span className="pcb-label">1024KB</span></div>
            <div className="flex items-center gap-2"><span className="pcb-label text-white/20">FREQ:</span><span className="pcb-label">168MHz</span></div>
          </div>
          <div className="flex gap-12">
            <div className="pcb-label">MPS-OS v4.2.0-STABLE</div>
            <div className="pcb-label">DEVELOPED_BY: MYANMAR_PRECISION</div>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 0px; }
        @keyframes scan { 0% { top: 0%; opacity: 0.5; } 50% { opacity: 0.8; } 100% { top: 100%; opacity: 0.5; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .text-shadow-glow { text-shadow: 0 0 10px rgba(0, 180, 255, 0.6), 0 0 20px rgba(0, 180, 255, 0.2); }
        .hero-glow { background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 180, 255, 0.15) 0%, transparent 60%); }
        .h-screen-nav { height: calc(100vh - 80px); }
        @media (max-width: 1024px) { .h-screen-nav { height: calc(100vh - 150px); } }
      `}</style>
    </motion.div>
  );
}
