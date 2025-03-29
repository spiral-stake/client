import { useState, useEffect, useRef } from 'react';

const CircularProgressClock = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(0);

  // Start/stop the stopwatch
  const toggleStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - time * 1000;
      intervalRef.current = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    setIsRunning(!isRunning);
  };

  // Reset the stopwatch
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Calculate progress percentage (0-100)
  const progress = (time % 60) / 60 * 100;
  const displaySeconds = time % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-64 h-64 mb-8">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-300 bg-black shadow-lg"></div>
        
        {/* Second markers (every 5 seconds) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90; // -90 to start from top
          const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
          const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
          const value = i * 5;
          
          return (
            <div 
              key={i}
              className="absolute w-6 h-6 flex items-center justify-center text-sm font-bold"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {value}
            </div>
          );
        })}
        
        {/* Progress track (full circle) */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle 
            cx="50%" 
            cy="50%" 
            r="45%" 
            fill="transparent" 
            stroke="#e5e7eb" 
            strokeWidth="8" 
            strokeDasharray="0 100"
          />
        </svg>
        
        {/* Progress indicator */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle 
            cx="50%" 
            cy="50%" 
            r="45%" 
            fill="transparent" 
            stroke="#3b82f6" 
            strokeWidth="8" 
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Digital display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold">
            {displaySeconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm">seconds</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={toggleStopwatch}
          className={`px-6 py-2 rounded-md font-medium text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={resetStopwatch}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-md font-medium text-white"
          disabled={isRunning}
        >
          Reset
        </button>
      </div>

      {/* Lap counter */}
      {time > 0 && (
        <div className="mt-4 text-gray-700">
          Total time: {Math.floor(time / 60)}:{displaySeconds.toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

export default CircularProgressClock;