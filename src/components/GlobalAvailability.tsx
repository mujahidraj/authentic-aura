import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Clock, MapPin } from 'lucide-react';

// Configuration
const MY_TIMEZONE_OFFSET = 6; // Dhaka is UTC+6
const MY_LOCATION = { x: 74, y: 45 }; // Approximate % position of Dhaka on the map image

const GlobalAvailability = () => {
  const [sliderValue, setSliderValue] = useState(12); // 0 to 24 hours
  const [clientTime, setClientTime] = useState("");
  const [myTime, setMyTime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Map Image URL (Equirectangular projection - Standard dark map)
  // Using a reliable source for a dark topographic map
  const MAP_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg";

  useEffect(() => {
    updateTimeLabels(sliderValue);
    drawNightOverlay(sliderValue);
  }, [sliderValue]);

  const updateTimeLabels = (val: number) => {
    // Assume Slider is based on UTC for simplicity, or Client's Local Time
    // Let's make the slider represent "New York Time" (EST) as a reference, or UTC.
    // Let's stick to UTC for the logic to be accurate, but label it for clarity.
    
    // Calculate UTC hour
    const utcHour = val;
    
    // My Time (Dhaka UTC+6)
    let myHour = utcHour + MY_TIMEZONE_OFFSET;
    if (myHour >= 24) myHour -= 24;
    if (myHour < 0) myHour += 24;
    
    // Format Strings
    const format = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = Math.floor(h % 12) || 12;
      const displayM = Math.floor((h % 1) * 60).toString().padStart(2, '0');
      return `${displayH}:${displayM} ${ampm}`;
    };

    setClientTime(`UTC ${format(utcHour)}`); // Displaying UTC for reference
    setMyTime(format(myHour));
  };

  const getStatus = (hour: number) => {
    if (hour >= 24) hour -= 24;
    if (hour >= 9 && hour <= 18) return { text: "Business Hours", color: "text-emerald-400", icon: Sun };
    if (hour > 18 && hour <= 23) return { text: "Late Night / R&D", color: "text-amber-400", icon: Moon };
    return { text: "Sleeping", color: "text-gray-500", icon: Moon };
  };

  const drawNightOverlay = (utcHour: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Calculate Sun Position (Simple Approximation)
    // At UTC 12 (Noon), Sun is at Greenwich (Long 0). 
    // The "Shadow" is opposite the sun.
    // Map width = 360 degrees.
    const sunLong = ((12 - utcHour) / 24) * 360; 
    
    // Draw the Night Shape
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Shadow color
    ctx.beginPath();
    
    // Complex Sine Wave logic to simulate the terminator line curve
    // This draws the "Night" polygon
    for (let x = 0; x <= w; x++) {
      const long = (x / w) * 360 - 180; // -180 to 180
      // Calculate offset based on sun position
      const delta = long - sunLong;
      
      // Normalized simple terminator wave
      // Adjusting this math creates the "Sine" wave of daylight
      const y = (h / 2) + Math.sin((delta * Math.PI) / 180) * (h * 0.4); 
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Close the shape to fill the bottom (or top depending on season)
    // For a simple "Night" visualization, we usually fill the area *away* from the sun.
    // Let's do a simpler "Box" gradient approach for maximum performance and aesthetics
    // visual tweak: clear the canvas and draw a moving gradient instead of a complex polygon
    
    ctx.clearRect(0,0,w,h);
    
    // Determine the center of the night (Opposite to sun)
    const nightCenterX = ((utcHour + 12) % 24) / 24 * w;
    
    // Draw two rectangles for the night to handle wrapping around the map
    const drawShadow = (centerX: number) => {
        const gradient = ctx.createRadialGradient(centerX, h/2, 0, centerX, h/2, w * 0.6);
        gradient.addColorStop(0, 'rgba(0,0,0,0.85)'); // Deep night center
        gradient.addColorStop(0.4, 'rgba(0,0,0,0.5)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    };

    drawShadow(nightCenterX);
    // Handle wrap around
    if (nightCenterX < w/2) drawShadow(nightCenterX + w);
    if (nightCenterX > w/2) drawShadow(nightCenterX - w);
  };

  const currentStatus = getStatus((sliderValue + MY_TIMEZONE_OFFSET));

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-white/10 bg-[#050505]">
      {/* Background Map */}
      <div className="relative w-full aspect-[2/1] bg-[#111] overflow-hidden group">
        <img 
            src={MAP_IMAGE} 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity"
            alt="World Map" 
        />
        
        {/* Canvas Overlay for Shadows */}
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply"
        />

        {/* My Location Marker */}
        <div 
            className="absolute z-20 flex flex-col items-center group/marker"
            style={{ left: `${MY_LOCATION.x}%`, top: `${MY_LOCATION.y}%` }}
        >
            <div className="relative">
                <div className="w-3 h-3 bg-amber-500 rounded-full z-10 relative shadow-[0_0_10px_#f59e0b]" />
                <div className="absolute inset-0 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            </div>
            <div className="mt-2 px-2 py-1 bg-black/80 backdrop-blur text-[10px] font-mono rounded border border-white/10 opacity-0 group-hover/marker:opacity-100 transition-opacity">
                DHAKA
            </div>
        </div>

        {/* Grid Lines (Decoration) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 border border-white/5 m-4 rounded-xl" />
      </div>

      {/* Control Panel */}
      <div className="p-6 md:p-8 bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            
            {/* Info Area */}
            <div className="space-y-4 w-full md:w-1/3">
                <div className="flex items-center gap-2 text-amber-500">
                    <Clock size={16} />
                    <span className="text-xs font-mono tracking-widest uppercase">Availability Check</span>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{clientTime}</h3>
                    <p className="text-sm text-gray-400">Drag slider to check availability</p>
                </div>
            </div>

            {/* Slider */}
            <div className="w-full md:w-1/3 relative pt-6">
                <input
                    type="range"
                    min="0"
                    max="24"
                    step="0.1"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-600 mt-2 uppercase">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                </div>
            </div>

            {/* Result Status */}
            <div className="w-full md:w-1/3 flex justify-end">
                <motion.div 
                    key={currentStatus.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-right"
                >
                    <p className="text-xs text-gray-500 font-mono mb-1">MY LOCAL TIME: {myTime}</p>
                    <div className={`text-xl font-bold flex items-center justify-end gap-2 ${currentStatus.color}`}>
                        <currentStatus.icon size={20} />
                        {currentStatus.text}
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GlobalAvailability;