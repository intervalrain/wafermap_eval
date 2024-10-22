import React, { useState } from 'react';
import { WaferCalculator } from './algo';

interface Wafer {
  die_height: number;
  die_width: number;
  offset_x: number;
  offset_y: number;
  diameter: number;
}

interface Die {
  diex: number;
  diey: number;
}

interface CoordConfig {
  diexMin: number;
  diexMax: number;
  dieyMin: number;
  dieyMax: number;
  dieCountAtXmin: number;
  dieCountAtXmax: number;
  dieCountAtYmin: number;
  dieCountAtYmax: number;
}

const WaferMapGenerator = () => {
  const [coordConfig, setCoordConfig] = useState<CoordConfig>({
    diexMin: -3,
    diexMax: 2,
    dieyMin: -6,
    dieyMax: 5,
    dieCountAtXmin: 8,
    dieCountAtXmax: 8,
    dieCountAtYmin: 2,
    dieCountAtYmax: 2
  });

  const [waferConfig, setWaferConfig] = useState<Wafer>(() => {
    const result = WaferCalculator.calculateFromCoordinates(coordConfig);
    return {
      die_height: result.length,
      die_width: result.width,
      offset_x: result.offsetX,
      offset_y: result.offsetY,
      diameter: 300
    };
  });

  const [displayConfig, setDisplayConfig] = useState<Wafer>(waferConfig);
  const [dies, setDies] = useState<Die[]>([]);

  const calculateDies = () => {
    const radius = displayConfig.diameter / 2;
    const newDies: Die[] = [];
    
    // 使用座標系的範圍來決定遍歷範圍
    for (let x = coordConfig.diexMin - 1; x <= coordConfig.diexMax + 1; x++) {
      for (let y = coordConfig.dieyMin - 1; y <= coordConfig.dieyMax + 1; y++) {
        const corners = [
          {
            x: x * displayConfig.die_width + displayConfig.offset_x,
            y: y * displayConfig.die_height + displayConfig.offset_y
          },
          {
            x: (x + 1) * displayConfig.die_width + displayConfig.offset_x,
            y: y * displayConfig.die_height + displayConfig.offset_y
          },
          {
            x: x * displayConfig.die_width + displayConfig.offset_x,
            y: (y + 1) * displayConfig.die_height + displayConfig.offset_y
          },
          {
            x: (x + 1) * displayConfig.die_width + displayConfig.offset_x,
            y: (y + 1) * displayConfig.die_height + displayConfig.offset_y
          }
        ];

        const isInWafer = corners.every(corner => {
          const distance = Math.sqrt(corner.x * corner.x + corner.y * corner.y);
          return distance <= radius;
        });

        if (isInWafer) {
          newDies.push({ diex: x, diey: y });
        }
      }
    }
    
    setDies(newDies);
  };

  const handleSubmit = () => {
    const result = WaferCalculator.calculateFromCoordinates(coordConfig);
    const newWaferConfig = {
      ...waferConfig,
      die_height: result.length,
      die_width: result.width,
      offset_x: result.offsetX,
      offset_y: result.offsetY
    };
    
    setWaferConfig(newWaferConfig);
    setDisplayConfig(newWaferConfig);
    calculateDies();
  };

  // Scale factor for display (1mm = 2px)
  const SCALE_FACTOR = 2;

  return (
    <div className="w-full max-w-5xl p-6">
      <div className="text-2xl font-bold mb-6">Wafer Map Generator</div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">X Min Coordinate</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.diexMin}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                diexMin: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">X Max Coordinate</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.diexMax}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                diexMax: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dies at X Min</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieCountAtXmin}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieCountAtXmin: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dies at X Max</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieCountAtXmax}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieCountAtXmax: Number(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Y Min Coordinate</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieyMin}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieyMin: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y Max Coordinate</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieyMax}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieyMax: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dies at Y Min</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieCountAtYmin}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieCountAtYmin: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dies at Y Max</label>
            <input
              type="number"
              className="w-full p-2 rounded border"
              value={coordConfig.dieCountAtYmax}
              onChange={(e) => setCoordConfig({
                ...coordConfig,
                dieCountAtYmax: Number(e.target.value)
              })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Die Height (mm)</label>
            <div className="w-full p-2 bg-gray-100 rounded">
              {waferConfig.die_height.toFixed(4)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Die Width (mm)</label>
            <div className="w-full p-2 bg-gray-100 rounded">
              {waferConfig.die_width.toFixed(4)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Offset X (mm)</label>
            <div className="w-full p-2 bg-gray-100 rounded">
              {waferConfig.offset_x.toFixed(4)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Offset Y (mm)</label>
            <div className="w-full p-2 bg-gray-100 rounded">
              {waferConfig.offset_y.toFixed(4)}
            </div>
          </div>
        </div>
        
        <button 
          className="w-32 bg-blue-400 py-2 rounded-md text-white shadow-xl hover:bg-blue-500"
          onClick={handleSubmit}
        >
          Calculate
        </button>
        
        <div className="flex justify-center">
          <div 
            className="relative rounded-full overflow-hidden"
            style={{
              width: displayConfig.diameter * SCALE_FACTOR,
              height: displayConfig.diameter * SCALE_FACTOR,
              border: '1px solid #ccc'
            }}
          >
            {dies.map((die, index) => (
              <div
                key={index}
                className="absolute border border-gray-400 bg-blue-100"
                style={{
                  width: displayConfig.die_width * SCALE_FACTOR,
                  height: displayConfig.die_height * SCALE_FACTOR,
                  left: `${(die.diex * displayConfig.die_width + displayConfig.offset_x + displayConfig.diameter/2) * SCALE_FACTOR}px`,
                  top: `${(die.diey * displayConfig.die_height + displayConfig.offset_y + displayConfig.diameter/2) * SCALE_FACTOR}px`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="text-lg font-medium">
          Total Dies: {dies.length}
        </div>
      </div>
    </div>
  );
};

export default WaferMapGenerator;