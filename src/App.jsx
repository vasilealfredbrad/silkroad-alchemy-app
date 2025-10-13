import { Diamond } from "lucide-react";
import { useState, useRef } from "react";
import { gsap } from "gsap";

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
  const [gold, setGold] = useState(100);
  const itemRef = useRef(null);
  const smokeRef = useRef(null);

  const getSuccessRate = (level) => {
    const rates = {
      0: 90,
      1: 80,
      2: 70,
      3: 60,
      4: 50,
    };
    return rates[level] || 5;
  };

  const handleStrengthen = () => {
    if (!selectedItem || !selectedElixir || isStrengthening || gold < 10)
      return;
    setGold((prev) => prev - 10);
    setIsStrengthening(true);
    setProgress(0);
    setLastResult(null);

    const duration = 1500;
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
          gsap.to(itemRef.current, {
            scale: 1.2,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
          setWeaponLevel((prev) => prev + 1);
          setLastResult("success");
        } else {
          gsap.set(smokeRef.current, { opacity: 1, scale: 0.5 });
          gsap.to(smokeRef.current, {
            scale: 2,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          });

          gsap.to(itemRef.current, {
            x: -5,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: "power2.inOut",
            onComplete: () => gsap.set(itemRef.current, { x: 0 }),
          });
          setLastResult("fail");
          setWeaponLevel(0);
        }

        setIsStrengthening(false);
        setProgress(0);
      }
    }, interval);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black flex items-center justify-center gap-8">
      <div className="rounded-lg shadow-2xl w-128 border-2 border-[#969383]">
        <div className="bg-[#0d0d0d] px-4 py-2 rounded-t-md flex justify-center items-center border-b-2 border-[#969383]">
          <h2 className="text-white font-bold text-sm">Alchemy</h2>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#302d2c] via-[#232126] to-[#2b292a]">
          <div className="border-4 border-[#6c6554] mb-8">
            <div className="grid grid-cols-[42px_1fr] gap-3 p-3">
              <div className="relative">
                <div
                  ref={itemRef}
                  className={`w-10 h-10 bg-[#0a0a07] border-2 border-[#403e3e] flex items-center justify-center relative ${
                    isStrengthening ? "animate-glow" : ""
                  }`}
                  onMouseEnter={() => setItemHover(true)}
                  onMouseLeave={() => setItemHover(false)}
                >
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

          <div className="progress overflow-hidden">
            <div className="bg-black py-1 border-2 border-[#403e3e] rounded-md overflow-hidden">
              <div
                className="h-4 bg-yellow-600 transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  transition: isStrengthening ? "width 0.03s linear" : "none",
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-2">
            <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold mb-1">
              <GoldIcon />
              {gold}
            </div>
            {selectedItem && selectedElixir && (
              <div className="text-xs text-[#a8a887]">
                Success Rate: {getSuccessRate(weaponLevel)}% | Cost: 10 Gold
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
                className={`text-xs font-bold mt-1 ${
                  lastResult === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {lastResult === "success" ? "SUCCESS!" : "FAILED!"}
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
