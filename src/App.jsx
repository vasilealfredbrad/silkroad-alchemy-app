import { Diamond, Sparkles, Zap, Flame, Star } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ParticleSystem from "./components/ParticleSystem";

import items from "./lib/items.json";

const GoldIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
    <circle
      cx="4"
      cy="6"
      r="3"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="0.5"
    />
    <circle
      cx="8"
      cy="4"
      r="3"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="0.5"
    />
    <circle
      cx="12"
      cy="6"
      r="3"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="0.5"
    />
  </svg>
);

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedElixir, setSelectedElixir] = useState(null);
  const [itemHover, setItemHover] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [isStrengthening, setIsStrengthening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [gold, setGold] = useState(1000000000000);
  const [autoStart, setAutoStart] = useState(false);
  const [particleType, setParticleType] = useState('success');
  const [screenShake, setScreenShake] = useState(false);
  const [goldChange, setGoldChange] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const [magicCircle, setMagicCircle] = useState(false);
  const [energyFlow, setEnergyFlow] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const itemRef = useRef(null);
  const smokeRef = useRef(null);
  const progressRef = useRef(null);
  const goldRef = useRef(null);
  const screenRef = useRef(null);
  const centerAreaRef = useRef(null);
  const energyFlowRef = useRef(null);
  const circularProgressRef = useRef(null);

  const getSuccessRate = (level) => {
    const rates = {
      0: 100,
      1: 100,
      2: 100,
      3: 100,
      4: 100,
      5: 100,
      6: 30,
      7: 20,
      8: 100,
      9: 85,
      10: 100,
      12: 88,
      13: 100,
      14: 70,
      15: 100,
    };
    return rates[level] || 20;
  };

  const getAllItems = () => {
    const allItems = [];
    Object.values(items[0].eu).forEach(categoryItems => {
      allItems.push(...categoryItems);
    });
    return allItems;
  };

  const selectRandomItem = () => {
    const allItems = getAllItems();
    const randomIndex = Math.floor(Math.random() * allItems.length);
    const randomItem = allItems[randomIndex];
    
    // Animate item selection
    if (itemRef.current) {
      gsap.fromTo(itemRef.current, 
        { scale: 0.5, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
    
    setSelectedItem(randomItem);
    setWeaponLevel(0);
  };

  // Removed old createParticles function - using Three.js ParticleSystem instead

  const screenShakeEffect = () => {
    setScreenShake(true);
    if (screenRef.current) {
      gsap.to(screenRef.current, {
        x: -5,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut",
        onComplete: () => {
          if (screenRef.current) {
            gsap.set(screenRef.current, { x: 0 });
          }
          setScreenShake(false);
        }
      });
    }
  };

  const animateGoldChange = (amount) => {
    setGoldChange(amount);
    if (goldRef.current) {
      gsap.fromTo(goldRef.current,
        { scale: 1.2, color: amount > 0 ? "#00ff00" : "#ff0000" },
        { scale: 1, color: "#FFD700", duration: 0.5, ease: "power2.out" }
      );
    }
    setTimeout(() => setGoldChange(0), 1000);
  };

  const animateProgressBar = () => {
    if (circularProgressRef.current) {
      gsap.fromTo(circularProgressRef.current,
        { strokeDashoffset: 175.9 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.out" }
      );
    }
  };

  const createFloatingParticles = () => {
    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: i,
        x: Math.random() * 120 - 60, // Smaller area around item
        y: Math.random() * 120 - 60,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        delay: Math.random() * 0.5, // Faster start
        duration: Math.random() * 1.5 + 1.5 // Shorter duration
      });
    }
    setFloatingParticles(particles);
  };

  const animateMagicCircle = () => {
    setMagicCircle(true);
    if (centerAreaRef.current) {
      gsap.fromTo(centerAreaRef.current, 
        { scale: 0.5, opacity: 0 },
        { scale: 1.2, opacity: 0.6, duration: 0.3, ease: "power2.out" }
      );
      gsap.to(centerAreaRef.current, {
        scale: 1,
        opacity: 0,
        duration: 0.8, // Much shorter
        ease: "power2.out",
        onComplete: () => setMagicCircle(false)
      });
    }
  };

  const animateEnergyFlow = () => {
    setEnergyFlow(true);
    if (energyFlowRef.current) {
      gsap.fromTo(energyFlowRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.to(energyFlowRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.2, // Shorter delay
        onComplete: () => setEnergyFlow(false)
      });
    }
  };

  const startStrengtheningEffects = () => {
    createFloatingParticles();
    animateMagicCircle();
    animateEnergyFlow();
    animateCircularProgress();
  };

  const animateCircularProgress = () => {
    if (circularProgressRef.current) {
      gsap.fromTo(circularProgressRef.current, 
        { strokeDashoffset: 175.9 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.out" }
      );
    }
  };

  const triggerParticleBurst = (type) => {
    setParticleType(type);
    setParticleTrigger(prev => prev + 1);
  };

  const handleParticleComplete = () => {
    // Reset particle trigger after animation completes (longer delay for smooth particles)
    setTimeout(() => {
      setParticleTrigger(0);
    }, 500);
  };

  // Auto-start effect
  React.useEffect(() => {
    if (autoStart && selectedItem && selectedElixir && !isStrengthening && gold >= 10) {
      const timer = setTimeout(() => {
        // Double-check conditions before proceeding
        if (autoStart && selectedItem && selectedElixir && !isStrengthening && gold >= 10) {
          handleStrengthen();
        }
      }, 5000); // Much longer delay to enjoy the beautiful particle animations
      return () => clearTimeout(timer);
    }
  }, [autoStart, selectedItem, selectedElixir, isStrengthening, gold]);

  const handleStrengthen = () => {
    if (!selectedItem || !selectedElixir || isStrengthening || gold < 10)
      return;
    
    setGold((prev) => prev - 10);
    animateGoldChange(-10);
    setIsStrengthening(true);
    setProgress(0);
    setLastResult(null);

    // Animate progress bar and start effects
    animateProgressBar();
    startStrengtheningEffects();

    const duration = 2000;
    const interval = 30;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min((elapsed / duration) * 100, 100));

      if (elapsed >= duration) {
        clearInterval(timer);

        const successRate = getSuccessRate(weaponLevel);
        const isSuccess = Math.random() * 100 < successRate;

        if (isSuccess) {
          // Success animations
          if (itemRef.current) {
            gsap.to(itemRef.current, {
              scale: 1.3,
              duration: 0.2,
              yoyo: true,
              repeat: 2,
              ease: "power2.inOut",
            });
          }
          
          // Level up glow effect
          if (itemRef.current) {
            gsap.fromTo(itemRef.current, {
              boxShadow: "0 0 0px #00ff00"
            }, {
              boxShadow: "0 0 20px #00ff00, 0 0 40px #00ff00",
              duration: 0.5,
              ease: "power2.out"
            });
          }
          
          setWeaponLevel((prev) => prev + 1);
          setLastResult("success");
          triggerParticleBurst("success");
          
          // Success visual feedback
          if (circularProgressRef.current) {
            gsap.to(circularProgressRef.current, {
              stroke: "#00ff00",
              duration: 0.3,
              ease: "power2.out"
            });
          }
          
        } else {
          // Failure animations
          screenShakeEffect();
          
          if (smokeRef.current) {
            gsap.set(smokeRef.current, { opacity: 1, scale: 0.5 });
            gsap.to(smokeRef.current, {
              scale: 2.5,
              opacity: 0,
              duration: 1.5,
              ease: "power2.out",
            });
          }

          if (itemRef.current) {
            gsap.to(itemRef.current, {
              x: -10,
              duration: 0.1,
              yoyo: true,
              repeat: 8,
              ease: "power2.inOut",
              onComplete: () => {
                if (itemRef.current) {
                  gsap.set(itemRef.current, { x: 0 });
                }
              },
            });
          }
          
          // Failure glow effect
          if (itemRef.current) {
            gsap.fromTo(itemRef.current, {
              boxShadow: "0 0 0px #ff0000"
            }, {
              boxShadow: "0 0 20px #ff0000, 0 0 40px #ff0000",
              duration: 0.5,
              ease: "power2.out"
            });
          }
          
          setLastResult("fail");
          setWeaponLevel(0);
          triggerParticleBurst("fail");
          
          // Failure visual feedback
          if (circularProgressRef.current) {
            gsap.to(circularProgressRef.current, {
              stroke: "#ff0000",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }

        setIsStrengthening(false);
        setProgress(0);
        
        // Clear particles after a shorter delay
        setTimeout(() => {
          setFloatingParticles([]);
        }, 2000); // Reduced from 3000ms to 2000ms
        
        // Reset glow and progress after animation
        setTimeout(() => {
          if (itemRef.current) {
            gsap.to(itemRef.current, {
              boxShadow: "0 0 0px transparent",
              duration: 0.5,
              ease: "power2.out"
            });
          }
          
          // Reset circular progress
          if (circularProgressRef.current) {
            gsap.to(circularProgressRef.current, {
              strokeDashoffset: 175.9,
              stroke: "url(#progressGradient)",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }, 1000);
      }
    }, interval);
  };

  return (
    <div 
      ref={screenRef}
      className={`min-h-screen bg-gradient-to-br from-black via-gray-800 to-black flex items-center justify-center gap-8 transition-all duration-100 ${
        screenShake ? 'animate-pulse' : ''
      }`}
    >
      <div className="rounded-lg shadow-2xl w-128 border-2 border-[#969383]">
        <div className="bg-[#0d0d0d] px-4 py-2 rounded-t-md flex justify-center items-center border-b-2 border-[#969383]">
          <h2 className="text-white font-bold text-sm">Alchemy</h2>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#302d2c] via-[#232126] to-[#2b292a]">
          <div className={`border-4 border-[#6c6554] mb-8 relative overflow-hidden bg-gradient-to-br from-[#1a1a0a] to-[#0f0f0a] transition-all duration-300 ${
            isStrengthening ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : ''
          }`}>
            {/* Magic Circle Effect */}
            {magicCircle && (
              <div
                ref={centerAreaRef}
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.2) 30%, transparent 60%)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  width: '180px',
                  height: '180px',
                  boxShadow: '0 0 30px rgba(255,215,0,0.4)'
                }}
              />
            )}
            
            {/* Floating Particles */}
            {floatingParticles.map((particle) => (
              <div
                key={particle.id}
                className="absolute pointer-events-none z-20 animate-particle-float"
                style={{
                  left: `calc(50% + ${particle.x}px)`,
                  top: `calc(50% + ${particle.y}px)`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}40`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  filter: 'brightness(1.2)'
                }}
              />
            ))}
            
            {/* Energy Flow Effect */}
            {energyFlow && (
              <div
                ref={energyFlowRef}
                className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent pointer-events-none z-15 animate-energy-flow"
                style={{
                  transform: 'translateY(-50%)',
                  boxShadow: '0 0 20px #FFD700, 0 0 40px #FFA500',
                  background: 'linear-gradient(90deg, transparent 0%, #FFD700 20%, #FFA500 50%, #FFD700 80%, transparent 100%)'
                }}
              />
            )}
            
            <div className="grid grid-cols-[64px_1fr] gap-3 p-3 relative z-10">
              <div className="relative flex items-center justify-center">
                {/* Circular Progress Bar */}
                <div className="relative w-16 h-16">
                  <svg className="absolute inset-0 -rotate-90 w-16 h-16">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#eab308" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#403e3e"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      ref={circularProgressRef}
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="175.9"
                      strokeDashoffset="175.9"
                      className={`${isStrengthening ? 'animate-circular-glow' : ''}`}
                      style={{
                        filter: isStrengthening ? 'drop-shadow(0 0 10px #eab308)' : 'none'
                      }}
                    />
                  </svg>
                  
                  {/* Item Slot */}
                  <div
                    ref={itemRef}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a07] border-2 border-[#403e3e] flex items-center justify-center relative ${
                      isStrengthening ? "animate-glow" : ""
                    }`}
                    onMouseEnter={() => setItemHover(true)}
                    onMouseLeave={() => setItemHover(false)}
                  >
                    {/* Sparkle Effects During Strengthening */}
                    {isStrengthening && (
                      <>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle-twinkle" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-1/2 -left-2 w-1 h-1 bg-yellow-300 rounded-full animate-sparkle-twinkle" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 -right-2 w-1 h-1 bg-orange-300 rounded-full animate-sparkle-twinkle" style={{ animationDelay: '1.5s' }}></div>
                      </>
                    )}
                    {selectedItem && (
                    <>
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className={`w-full h-full object-contain ${
                          isStrengthening ? "animate-glow-img" : ""
                        }`}
                      />
                      <span
                        className={`absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded shadow border border-yellow-700 bg-yellow-400 text-black ${
                          isStrengthening ? "animate-glow-badge" : ""
                        }`}
                      >
                        +{weaponLevel}
                      </span>

                      {itemHover && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 min-w-[300px] bg-[#00174e]/50 text-white rounded-lg shadow-lg p-3 z-10 text-xs backdrop-blur-sm border border-slate-600">
                          <div className="font-bold text-sm flex gap-2 items-start mb-4">
                            <img src={selectedItem.image} alt="" />
                            <div>
                              {selectedItem.name}{" "}
                              {weaponLevel > 0 ? `(+${weaponLevel})` : ""}
                            </div>
                          </div>
                          <div className="mb-1">
                            Psychical Attack:{" "}
                            <span className="font-semibold">
                              {selectedItem.psy_attack}
                            </span>
                          </div>
                          <div className="mb-1">
                            Magical Attack:{" "}
                            <span className="font-semibold">
                              {selectedItem.mag_attack}
                            </span>
                          </div>
                          <div className="mb-8">
                            Durability:{" "}
                            <span className="font-semibold">
                              {selectedItem.durability}
                            </span>
                          </div>
                          <div>
                            Level:{" "}
                            <span className="font-semibold">
                              {selectedItem.level}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                    )}
                  </div>
                </div>

                <div
                  ref={smokeRef}
                  className="absolute inset-0 pointer-events-none opacity-0 z-20"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,0,0,0.9) 20%, rgba(40,40,40,0.8) 40%, rgba(80,80,80,0.4) 60%, transparent 80%)",
                    width: "60px",
                    height: "60px",
                    left: "-25px",
                    top: "-25px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div>
                <p className="text-[#a8a887] text-sm leading-relaxed">
                  Able to upgrade Equipment with Alchemy Stone, Attribute Stone
                  or Elixir.
                </p>
                <p className="text-[#a8a887] text-sm leading-relaxed">
                  Place Equipment and other alchemy requirements.
                </p>
                <p className="text-[#a8a887] text-sm leading-relaxed">
                  (Items of the 12th grade and higher can only be reinforced
                  with an Enhancer.)
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="border-3 border-[#403e3e] bg-[#0a0a07] w-12 h-12">
              <img src={`${selectedElixir}`} alt="" className="w-12" />
            </div>
            <div className="border-3 border-[#403e3e] bg-[#11110a] w-12 h-12 flex justify-center items-center">
              <Diamond color="#232322" fill="#232322" />
            </div>
            <div className="border-3 border-[#403e3e] bg-[#11110a] w-12 h-12 flex justify-center items-center">
              <Diamond color="#232322" fill="#232322" />
            </div>
            <div className="border-3 border-[#403e3e] bg-[#11110a] w-12 h-12 flex justify-center items-center">
              <Diamond color="#232322" fill="#232322" />
            </div>
          </div>

          {/* Particle System Overlay - Only in center area */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <ParticleSystem 
              type={particleType}
              trigger={particleTrigger}
              onComplete={handleParticleComplete}
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-2">
            <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold mb-1">
              <GoldIcon />
              <span 
                ref={goldRef}
                className={`transition-all duration-300 ${
                  goldChange !== 0 ? 'scale-110' : ''
                }`}
              >
                {gold}
                {goldChange !== 0 && (
                  <span className={`ml-2 text-sm ${
                    goldChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {goldChange > 0 ? '+' : ''}{goldChange}
                  </span>
                )}
              </span>
            </div>
            {selectedItem && selectedElixir && (
              <div className="text-xs text-[#a8a887]">
                <div className="flex items-center gap-2">
                  <span>Success Rate:</span>
                  <span className={`font-bold px-2 py-1 rounded ${
                    getSuccessRate(weaponLevel) >= 80 ? 'bg-green-600 text-white' :
                    getSuccessRate(weaponLevel) >= 60 ? 'bg-yellow-600 text-white' :
                    getSuccessRate(weaponLevel) >= 40 ? 'bg-orange-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {getSuccessRate(weaponLevel)}%
                  </span>
                  <span>| Cost: 10 Gold</span>
                </div>
                {autoStart && (
                  <div className="text-green-400 font-bold mt-1 animate-pulse">
                    <Sparkles className="inline w-4 h-4 mr-1" />
                    AUTO-STRENGTHENING ACTIVE
                  </div>
                )}
              </div>
            )}
            <button
              className={`text-white text-sm py-1 px-4 rounded-md cursor-pointer transition-colors duration-200 
                ${
                  selectedItem &&
                  selectedElixir &&
                  !isStrengthening &&
                  gold > 10
                    ? "bg-[#9b7700] hover:bg-[#735906] shadow-yellow-800 shadow-md text-black"
                    : "bg-[#636363] opacity-60 cursor-not-allowed"
                }
              `}
              disabled={
                !(selectedItem && selectedElixir) ||
                isStrengthening ||
                gold < 10
              }
              onClick={handleStrengthen}
            >
              Strengthen
            </button>
            {lastResult && (
              <div
                className={`text-sm font-bold mt-2 px-3 py-1 rounded-full transition-all duration-500 ${
                  lastResult === "success" 
                    ? "text-green-400 bg-green-400/10 border border-green-400/30 animate-bounce" 
                    : "text-red-400 bg-red-400/10 border border-red-400/30 animate-bounce"
                }`}
              >
                {lastResult === "success" ? (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 animate-spin" />
                    SUCCESS!
                    <Star className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 animate-pulse" />
                    FAILED!
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow-2xl w-128 border-2 border-[#969383]">
        <div className="bg-[#0d0d0d] px-4 py-2 rounded-t-md flex justify-center items-center border-b-2 border-[#969383]">
          <h2 className="text-white font-bold text-sm">Inventory</h2>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#302d2c] via-[#232126] to-[#2b292a]">
          <div className="flex gap-2 mb-4">
            <button
              onClick={selectRandomItem}
              className="text-white text-xs py-2 px-4 rounded-md bg-gradient-to-r from-[#9b7700] to-[#b8860b] hover:from-[#735906] hover:to-[#8b6914] shadow-yellow-800 shadow-lg text-black transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Random Item
            </button>
            <button
              onClick={() => setAutoStart(!autoStart)}
              className={`text-xs py-2 px-4 rounded-md transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                autoStart 
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-800 shadow-lg" 
                  : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg"
              }`}
            >
              {autoStart ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  Auto ON
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Auto OFF
                </>
              )}
            </button>
          </div>
          <div className="border-4 border-[#6c6554] mb-8 py-2 px-4 max-h-64 overflow-y-scroll">
            <h4 className="text-sm text-[#efffc5] font-bold mb-4">Weapons</h4>
            {Object.entries(items[0].eu).map(([categoryKey, categoryItems]) => (
              <div key={categoryKey} className="mb-4">
                <h5 className="text-xs text-[#c4c4c4] font-semibold mb-2 uppercase underline">
                  {categoryKey}
                </h5>
                <div className="flex gap-2 items-center flex-wrap">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`cursor-pointer border-2 h-12 w-12 ${
                          selectedItem && selectedItem.id === item.id
                            ? "border-yellow-400"
                            : "border-transparent"
                        } rounded`}
                        onClick={() => {
                          setSelectedItem(item);
                          setWeaponLevel(0);
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      />
                      {hoveredItem === item.id && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 min-w-[300px] bg-[#00174e]/50 text-white rounded-lg shadow-lg p-3 z-10 text-xs backdrop-blur-sm border border-slate-600">
                          <div className="font-bold text-sm mb-2">
                            {item.name}
                          </div>
                          <div className="mb-1">
                            Psychical Attack:{" "}
                            <span className="font-semibold">
                              {item.psy_attack}
                            </span>
                          </div>
                          <div className="mb-1">
                            Magical Attack:{" "}
                            <span className="font-semibold">
                              {item.mag_attack}
                            </span>
                          </div>
                          <div className="mb-8">
                            Durability:{" "}
                            <span className="font-semibold">
                              {item.durability}
                            </span>
                          </div>
                          <div>
                            Level:{" "}
                            <span className="font-semibold">{item.level}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-4 border-[#6c6554] mb-8 p-4">
            <h4 className="text-sm text-[#efffc5] font-bold mb-4">Alchemy</h4>
            <img
              src="/alchemy/elixir.jpg"
              alt=""
              className={`cursor-pointer border-2 h-12 w-12 ${
                selectedElixir ? "border-yellow-400" : "border-transparent"
              } rounded`}
              onClick={() => setSelectedElixir("/alchemy/elixir.jpg")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
