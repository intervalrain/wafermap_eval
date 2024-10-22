import React, { useEffect, useState } from "react";
import { WaferConfig } from "./App";

type Status = 'inside' | 'edge' | 'outside';

const WaferVisualizer: React.FC<WaferConfig> = ({
  dieWidth,
  dieHeight,
  offsetX = 0,
  offsetY = 0,
  diameter = 300,
  scribeWidth = 0.8,
}) => {
  const [dies, setDies] = useState<Array<{ x: number; y: number; status: Status }>>([]);
  
  const SCALE = 1.5;
  const radius = diameter / 2;
  const effRadius = radius - 7.3;
  const scaledDiameter = diameter * SCALE;
  const scaledDieWidth = dieWidth * SCALE;
  const scaledDieHeight = dieHeight * SCALE;
  const scaledRadius = scaledDiameter / 2;
  const scaledEffRadius = effRadius * SCALE;
  
  const viewBoxSize = scaledDiameter + 100;
  const center = viewBoxSize / 2;

  useEffect(() => {
    const calculateDies = () => {
      const newDies: Array<{ x: number; y: number; status: Status }> = [];
      const nx = Math.ceil(diameter / dieWidth) + 2;
      const ny = Math.ceil(diameter / dieHeight) + 2;

      for (let x = -nx; x <= nx; x++) {
        for (let y = -ny; y <= ny; y++) {
          const cx = x * (dieWidth + scribeWidth) - offsetX;
          const cy = y * (dieHeight + scribeWidth) - offsetY;
          const corners = [
            { x: cx - dieWidth / 2, y: cy - dieHeight / 2 },
            { x: cx + dieWidth / 2, y: cy - dieHeight / 2 },
            { x: cx - dieWidth / 2, y: cy + dieHeight / 2 },
            { x: cx + dieWidth / 2, y: cy + dieHeight / 2 },
          ];

          const cornersInside = corners.filter(corner => {
            const dist = Math.sqrt(corner.x * corner.x + corner.y * corner.y);
            return dist <= effRadius;
          }).length;

          let status: Status = 'outside';
          if (cornersInside === 4) {
            status = 'inside';
          } else if (cornersInside > 0) {
            status = 'edge';
          }

          if (status !== 'outside') {
            newDies.push({ x, y, status });
          }
        }
      }
      setDies(newDies);
    };

    calculateDies();
  }, [dieWidth, dieHeight, offsetX, offsetY, diameter, scribeWidth]);

  const getDieColor = (status: Status) => {
    switch (status) {
      case 'inside':
        return '#008000';
      case 'edge':
        return '#AAAAAA';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-mono font-semibold">Wafer Visualizer</h1>
      <div className="w-full max-w-4xl mx-auto items-center p-2 bg-stone-500 shadow-md">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full border border-gray-300 bg-white"
        >
          {dies.map(({ x, y, status }) => (
            <g key={`${x}-${y}`} transform={`translate(${center}, ${center})`}>
              <rect
                x={(x * (scaledDieWidth + scribeWidth * SCALE)) - (scaledDieWidth / 2) - (offsetX * SCALE)}
                y={(y * (scaledDieHeight + scribeWidth * SCALE)) - (scaledDieHeight / 2) - (offsetY * SCALE)}
                width={scaledDieWidth}
                height={scaledDieHeight}
                fill={getDieColor(status)}
                stroke="#999"
                strokeWidth={1}
              />
              {status === 'inside' && (
                <text
                  x={(x * (scaledDieWidth + scribeWidth * SCALE)) - (offsetX * SCALE)}
                  y={(y * (scaledDieHeight + scribeWidth * SCALE)) - (offsetY * SCALE)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#333"
                >
                  ({x},{y})
                </text>
              )}
            </g>
          ))}
          <circle
            cx={center}
            cy={center}
            r={scaledRadius}
            fill="none"
            stroke="#666"
            strokeWidth={2}
          />
          <circle
            cx={center}
            cy={center}
            r={scaledEffRadius}
            fill="none"
            stroke="#555"
            strokeWidth={1}
          />
          <g stroke="#f00" strokeWidth="1">
            <line x1={center-10} y1={center} x2={center+10} y2={center} />
            <line x1={center} y1={center-10} x2={center} y2={center+10} />
          </g>
        </svg>
        <div className="mt-4 text-sm text-black font-mono">
          <p>Wafer diameter: {diameter}mm</p>
          <p>Die size: {dieWidth}mm × {dieHeight}mm</p>
          <p>Scribe width: {scribeWidth}mm</p>
          <p>Offset: ({offsetX}mm, {offsetY}mm)</p>
        </div>
      </div>
    </div>
  );
};

export default WaferVisualizer;