import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Heart } from 'lucide-react';
import DevicePopup from './components/DevicePopup';
import Loader from './components/Loader';
import FloatingHearts from './components/FloatingHearts';
import ParticleCanvas from './components/ParticleCanvas';
import StoryCard from './components/StoryCard';

export default function App() {
  const [step, setStep] = useState('hero'); // 'hero', 'popup', 'loading', 'story'
  const [deviceType, setDeviceType] = useState('laptop');
  // Starts with hero_1_bg.png.jpeg so that the Welcome Screen intro header uses the unique transition background after selector
  const [activeImage, setActiveImage] = useState('/hero_1_bg.png.jpeg');
  
  // Section refs for scroll tracking
  const introRef = useRef(null);
  const childRef = useRef(null);
  const schoolRef = useRef(null);
  const lifeRef = useRef(null);

  // Background Music Feature States & Refs
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentTrackKey, setCurrentTrackKey] = useState('hero'); // 'hero', 'childhood', 'schooling', 'life'
  
  const musicEnabledRef = useRef(false);
  const activeTrackRef = useRef('hero');
  const audioTracks = useRef({});
  const fadeIntervals = useRef({});
  const targetVolume = 0.35; // Subtle and elegant volume

  // Keep ref synchronized with state to prevent stale closures in asynchronous scroll timers
  useEffect(() => {
    musicEnabledRef.current = musicEnabled;
  }, [musicEnabled]);

  // Preload classical music audio tracks on mount
  useEffect(() => {
    audioTracks.current = {
      hero: new Audio('https://www.mfiles.co.uk/mp3-downloads/chopin-nocturne-op9-no2.mp3'),
      childhood: new Audio('https://www.mfiles.co.uk/mp3-downloads/schumann-traumerei.mp3'),
      schooling: new Audio('https://www.mfiles.co.uk/mp3-downloads/fur-elise.mp3'),
      life: new Audio('https://www.mfiles.co.uk/mp3-downloads/liszt-liebestraum-3.mp3')
    };

    // Pre-configure loop options and silence all tracks
    Object.entries(audioTracks.current).forEach(([key, track]) => {
      track.loop = true;
      track.preload = 'auto';
      track.volume = 0;
    });

    return () => {
      // Pause all tracks on unmount
      if (audioTracks.current) {
        Object.values(audioTracks.current).forEach(track => {
          track.pause();
        });
      }
      if (fadeIntervals.current) {
        Object.values(fadeIntervals.current).forEach(interval => {
          clearInterval(interval);
        });
      }
    };
  }, []);

  // Smooth Crossfading Volume Algorithm
  const transitionMusic = (nextKey) => {
    const tracks = audioTracks.current;
    if (!tracks || !tracks.hero) return; // not loaded yet

    const currentKey = activeTrackRef.current;
    if (currentKey === nextKey) return; // already active

    // Update references
    activeTrackRef.current = nextKey;
    setCurrentTrackKey(nextKey);

    // Clear fade timers for safety
    if (fadeIntervals.current[currentKey]) clearInterval(fadeIntervals.current[currentKey]);
    if (fadeIntervals.current[nextKey]) clearInterval(fadeIntervals.current[nextKey]);

    // If music is disabled, just swap track pointers in absolute silence
    if (!musicEnabledRef.current) {
      Object.entries(tracks).forEach(([key, track]) => {
        if (key !== nextKey) {
          track.pause();
          track.volume = 0;
        }
      });
      return;
    }

    // 1. Fade Out Current Active Track
    if (currentKey) {
      const curTrack = tracks[currentKey];
      fadeIntervals.current[currentKey] = setInterval(() => {
        if (curTrack.volume > 0.02) {
          curTrack.volume = Math.max(0, curTrack.volume - 0.02);
        } else {
          curTrack.volume = 0;
          curTrack.pause();
          clearInterval(fadeIntervals.current[currentKey]);
        }
      }, 40);
    }

    // 2. Fade In Next Active Track
    const nextTrack = tracks[nextKey];
    if (nextTrack.paused) {
      nextTrack.play().catch(err => console.log("Audio play blocked by browser:", err));
    }
    
    fadeIntervals.current[nextKey] = setInterval(() => {
      if (nextTrack.volume < targetVolume - 0.02) {
        nextTrack.volume = Math.min(targetVolume, nextTrack.volume + 0.02);
      } else {
        nextTrack.volume = targetVolume;
        clearInterval(fadeIntervals.current[nextKey]);
      }
    }, 40);
  };

  // Toggle Music button action (Play/Pause with fading)
  const toggleMusic = () => {
    const tracks = audioTracks.current;
    if (!tracks || !tracks.hero) return;

    const currentKey = activeTrackRef.current;
    const curTrack = tracks[currentKey];

    if (musicEnabled) {
      // Disable music: Fade out current track
      setMusicEnabled(false);
      musicEnabledRef.current = false;
      
      if (fadeIntervals.current[currentKey]) clearInterval(fadeIntervals.current[currentKey]);
      fadeIntervals.current[currentKey] = setInterval(() => {
        if (curTrack.volume > 0.02) {
          curTrack.volume = Math.max(0, curTrack.volume - 0.02);
        } else {
          curTrack.volume = 0;
          curTrack.pause();
          clearInterval(fadeIntervals.current[currentKey]);
        }
      }, 40);
    } else {
      // Enable music: Fade in current track
      setMusicEnabled(true);
      musicEnabledRef.current = true;

      // Force silence on any background tracks
      Object.entries(tracks).forEach(([key, track]) => {
        if (key !== currentKey) {
          track.pause();
          track.volume = 0;
        }
      });

      if (fadeIntervals.current[currentKey]) clearInterval(fadeIntervals.current[currentKey]);
      
      if (curTrack.paused) {
        curTrack.play().catch(err => console.log("Audio play blocked by browser:", err));
      }
      
      fadeIntervals.current[currentKey] = setInterval(() => {
        if (curTrack.volume < targetVolume - 0.02) {
          curTrack.volume = Math.min(targetVolume, curTrack.volume + 0.02);
        } else {
          curTrack.volume = targetVolume;
          clearInterval(fadeIntervals.current[currentKey]);
        }
      }, 40);
    }
  };

  // Trigger popup selection modal after 5.2 seconds to allow the centered intro text to display and fade out beautifully
  useEffect(() => {
    if (step === 'hero') {
      const timer = setTimeout(() => {
        setStep('popup');
      }, 5200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle device selection and trigger romantic loading stage
  const handleDeviceSelect = (type) => {
    setDeviceType(type);
    setStep('loading');
    
    // Smooth transition from loader to narrative story after 2.8 seconds
    setTimeout(() => {
      setStep('story');
    }, 2800);
  };

  // Scroll observer setup to trigger background particle morphing AND music crossfading
  useEffect(() => {
    if (step !== 'story') return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // triggers when the card enters the active core of screen
      threshold: 0.15
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'intro-header') {
            setActiveImage('/hero_1_bg.png.jpeg');
            transitionMusic('hero');
          } else if (entry.target.id === 'childhood-section') {
            setActiveImage('/childhood.png');
            transitionMusic('childhood');
          } else if (entry.target.id === 'schooling-section') {
            setActiveImage('/schooling.png');
            transitionMusic('schooling');
          } else if (entry.target.id === 'life-section') {
            setActiveImage('/life_with_him.png');
            transitionMusic('life');
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (introRef.current) observer.observe(introRef.current);
    if (childRef.current) observer.observe(childRef.current);
    if (schoolRef.current) observer.observe(schoolRef.current);
    if (lifeRef.current) observer.observe(lifeRef.current);

    return () => {
      observer.disconnect();
    };
  }, [step]);

  return (
    <div className="relative min-h-screen select-none overflow-x-hidden">
      
      {/* 1. HERO BG LAYER WITH KEN BURNS EFFECT */}
      {(step === 'hero' || step === 'popup') && (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-ken-burns scale-105 opacity-85 transition-opacity duration-1000"
            style={{ backgroundImage: "url('/hero_bg.png')" }}
          />
          {/* Subtle warm pink overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-romantic-pastel/30 via-transparent to-black/30 pointer-events-none" />
        </div>
      )}

      {/* 2. HERO CENTRED TEXT OVERLAY */}
      <AnimatePresence>
        {step === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1.5, duration: 1.4, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center p-6 z-10 pointer-events-none"
          >
            <h1 className="text-center font-serif text-3xl md:text-5xl lg:text-6xl text-[#F9E4E4] font-light leading-relaxed select-none tracking-wide text-glow-romantic drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] max-w-3xl">
              This is Nimnitha… <br />
              <span className="italic font-normal opacity-90 text-2xl md:text-4xl lg:text-5xl mt-3 block">witness my story</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DEVICE SELECTION POPUP STAGE */}
      <AnimatePresence>
        {step === 'popup' && (
          <DevicePopup onSelect={handleDeviceSelect} />
        )}
      </AnimatePresence>

      {/* 3. ROMANTIC CIRCULAR LOADER STAGE */}
      <AnimatePresence>
        {step === 'loading' && (
          <Loader />
        )}
      </AnimatePresence>

      {/* 4. MAIN NARRATIVE SCROLL STORY STAGE */}
      {step === 'story' && (
        <>
          {/* Fixed Cinematic Fullscreen Background Image with Romantic Tint Overlay */}
          <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out scale-105 filter blur-[2.5px]"
              style={{ 
                backgroundImage: `url('${activeImage}')`,
                backgroundAttachment: 'fixed'
              }}
            />
            {/* Soft overlay on top of the background image with #C94C4C and ~0.24 opacity */}
            <div className="absolute inset-0 bg-[#C94C4C]/24 mix-blend-multiply" />
          </div>

          {/* Fixed Background Canvas Particle Morphing Layer */}
          <ParticleCanvas activeImage={activeImage} deviceType={deviceType} />

          {/* Fixed Background Atmospheric floating hearts */}
          <FloatingHearts />

          {/* Scrollable Story Content Layer */}
          <div className="relative z-20 min-h-screen">
            
            {/* HERO STORY INTRO HEADER */}
            <header id="intro-header" ref={introRef} className="min-h-screen flex flex-col items-center justify-between py-12 px-4 text-center relative">
              {/* Top spacer */}
              <div />

              {/* Central Romantic Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl px-6 py-10 rounded-3xl glass-panel-glow border border-romantic-accent/40 relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-romantic-dark text-white font-sans font-semibold text-xs tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 fill-white/20 animate-pulse" />
                  <span>Happy Birthday</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4 mb-5 text-romantic-dark leading-tight">
                  The Cinematic <br className="hidden md:inline" />
                  <span className="text-glow-romantic italic font-normal">Story of Us</span>
                </h1>
                
                <p className="text-romantic-text text-sm md:text-lg max-w-lg mx-auto font-sans leading-relaxed">
                  Nee Jeevitham lo unna prathi kshanam, neeku vacche prathi chirunavvu, nuvvu peelche prathi shwasa, neekosam mathrame ayyi undaali. Never let your innerself die❤️.
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-romantic-dark fill-romantic-dark animate-pulse" />
                  <span className="text-xs font-semibold text-romantic-dark font-sans uppercase tracking-widest">
                    Scroll down to explore
                  </span>
                </div>
              </motion.div>

              {/* Bottom Scrolling Cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="flex flex-col items-center text-romantic-dark/80 group cursor-pointer"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight * 0.95,
                    behavior: 'smooth'
                  });
                }}
              >
                <span className="text-xs uppercase tracking-widest font-semibold mb-2 group-hover:text-romantic-dark transition-colors font-sans">
                  Scroll to see our story
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full bg-white/60 border border-romantic-accent/40 flex items-center justify-center hover:bg-romantic-pastel/60 transition-colors shadow-sm"
                >
                  <ChevronDown className="w-4 h-4 text-romantic-dark" />
                </motion.div>
              </motion.div>
            </header>

            {/* STORY SECTIONS CONTAINER */}
            <main className="max-w-4xl mx-auto px-4 pb-32">
              
              {/* SECTION 1: CHILDHOOD */}
              <div 
                id="childhood-section" 
                ref={childRef} 
                className="min-h-screen flex items-center justify-center py-20"
              >
                <StoryCard
                  index={0}
                  chapter="Chapter I"
                  title="Wandering Innocence"
                  iconType="sparkles"
                  storyText={`26 May 2005, mottamodhati saari ee prapanchaanni anubhavinchi bhayapadinappudu. Em cheyyaleni amayakapu bhavana lo edchinappudu. Neeku yetuvanti sambandham leni vaaru ninnu andari kante mundu etthukunnappudu. Thommidi nelalu mee amma nee kosam eduruchusinappudu. Intiki Mahalakshmi vacchindi ani mee nanna santhoshinchinappudu.\n\nNee generation lone first child vacchindi ani mee family anthaaa aadandinchinappude, nee jeevithaaniki oka bandhaanni, balagaanni kalipesinaru...`}
                />
              </div>

              {/* SECTION 2: SCHOOLING */}
              <div 
                id="schooling-section" 
                ref={schoolRef} 
                className="min-h-screen flex items-center justify-center py-20"
              >
                <StoryCard
                  index={1}
                  chapter="Chapter II"
                  title="Nostalgia & Early Dreams"
                  iconType="book"
                  storyText={`Perigi peddaga avuthu maatalu nerchinappudu. Nadakatho paatu nadatha nerchi meppinchinappudu. Jeevitham lo modati saari Chaduvu avasaram anipinchinappudu. Vellali ani lekunna tharagathi gadhi loki ninnu nettinappudu.\n\nVaalla gurinchi em teliyakunna neeku nuvvu gaa vallani yenchukunnappudu. Roju roju ku vallalo ninnu kalupukunnappudu. Emi teliyani amayakathvam nunchi lokam erigi thiragavacchinnappudu. Prathi adugu loo neeku thodu gaa unnappudu. Teliyakunda ne vallani nee family lo kalupukunnav...`}
                />
              </div>

              {/* SECTION 3: LIFE WITH HIM */}
              <div 
                id="life-section" 
                ref={lifeRef} 
                className="min-h-screen flex items-center justify-center py-20"
              >
                <StoryCard
                  index={2}
                  chapter="Chapter III"
                  title="Our Hand-In-Hand Symphony"
                  iconType="heart"
                  storyText={`Illu vidichi modhati saari telisina vaaru lekunda unnappudu. Kottha parichayaalu, kottha snehithulani chesukundam anukunnappudu. Raaboye naalugendlu evari tho gadapaali anipinchinnappudu, thodu kosam okarini vethikinappudu.\n\nLab mate gaa parichayam ayyi, recordlu pampamani adigaadokadu. College vishayaale kaaka bayatavishayaalu matladinaadathadu. Thanaki abbailenthano nuvvu anthe annadathadu. Taravata nuvve naa bestfriend anukunnadu. Ponu ponu istam penchukunnadathadu. Pattu patti nannu kooda padesinaadathadu.....`}
                />
              </div>

            </main>

            {/* CINEMATIC OUTRO FOOTER */}
            <footer className="py-12 border-t border-romantic-accent/20 bg-white/40 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-romantic-pastel/10 pointer-events-none" />
              <div className="relative z-10 max-w-md mx-auto px-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-romantic-dark fill-romantic-dark" />
                  <span className="font-serif italic text-romantic-dark font-semibold">Forever & Always</span>
                  <Heart className="w-4 h-4 text-romantic-dark fill-romantic-dark" />
                </div>
                <p className="text-xs text-romantic-text/60 font-sans tracking-wide">
                  Designed with love, devotion, and cosmic stardust.<br />
                  Happy Birthday! 🎂✨
                </p>
              </div>
            </footer>

          </div>

          {/* 5. FLOATING CINEMATIC MUSIC CONTROLLER */}
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Soft glass waves visualizer active when unmuted */}
            <AnimatePresence>
              {musicEnabled && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex items-end gap-0.5 h-7 bg-white/60 backdrop-blur-md border border-romantic-accent/40 rounded-full px-3 py-2 shadow-sm"
                >
                  <div className="visualizer-bar" />
                  <div className="visualizer-bar" />
                  <div className="visualizer-bar" />
                  <div className="visualizer-bar" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleMusic}
              className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-md transition-colors ${
                musicEnabled 
                  ? 'bg-romantic-dark text-white border-romantic-dark' 
                  : 'bg-white/75 backdrop-blur-md text-romantic-dark border-romantic-accent/50 animate-bounce'
              }`}
              style={{ animationDuration: '2.5s' }}
              title={musicEnabled ? "Mute Background Music" : "Enable Background Music"}
            >
              {musicEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.875c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.875c0 1.141.922 2.062 2.063 2.062h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 5.222 5.222 0 000-7.38.75.75 0 011.06-1.06 6.722 6.722 0 010 9.5z" />
                  <path d="M21.39 20.29a.75.75 0 11-1.06-1.06 9.223 9.223 0 000-13.06.75.75 0 011.06-1.06 10.723 10.723 0 010 15.18z" />
                </svg>
              )}
            </motion.button>
          </div>
        </>
      )}

    </div>
  );
}
