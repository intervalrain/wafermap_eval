import { useState } from "react";
import WaferVisualizer from "./WaferVisualizer";
import { BoundaryInfo, calculateDieParameters, DieParameters } from "./api";

export interface WaferConfig {
  dieHeight: number;
  dieWidth: number;
  offsetX?: number;
  offsetY?: number;
  diameter?: number;
  scribeWidth?: number;
}

function App() {
  const diameter = 300;
  const scribeWidth = 0.8;
  const [boundaryInfo, setBoundaryInfo] = useState<BoundaryInfo>({
    xmin: -7,
    xmax: 7,
    ymin: -13,
    ymax: 11,
    xminCount: 6,
    xmaxCount: 11,
    yminCount: 4,
    ymaxCount: 5
  });
  
  const [calculatedParams, setCalculatedParams] = useState<DieParameters | null>(null);
  const [waferConfig, setWaferConfig] = useState<WaferConfig>({
    dieHeight: 24,
    dieWidth: 17,
    offsetX: 0,
    offsetY: 0,
    diameter: 300,
    scribeWidth: 0.8
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBoundaryInfo(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCalculate = () => {
    const params = calculateDieParameters(boundaryInfo, diameter, scribeWidth);
    setCalculatedParams(params);
    setWaferConfig(params);
  };

  return (
    <div>
      <WaferVisualizer 
        dieHeight={waferConfig.dieHeight} 
        dieWidth={waferConfig.dieWidth} 
        offsetX={waferConfig.offsetX} 
        offsetY={waferConfig.offsetY}
        scribeWidth={waferConfig.scribeWidth}
        diameter={waferConfig.diameter} />

      <div className="mt-8 max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 font-mono">
          Calculate Parameters from Boundary Info
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono mb-2">X Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="xmin"
                value={boundaryInfo.xmin}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="xmin"
              />
              <span>to</span>
              <input
                type="number"
                name="xmax"
                value={boundaryInfo.xmax}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="xmax"
              />
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="number"
                name="xminCount"
                value={boundaryInfo.xminCount}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="xmin count"
              />
              <span>to</span>
              <input
                type="number"
                name="xmaxCount"
                value={boundaryInfo.xmaxCount}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="xmax count"
              />
              <span className="text-sm text-gray-500">dies</span>
            </div>
          </div>

          <div>
            <label className="block font-mono mb-2">Y Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="ymin"
                value={boundaryInfo.ymin}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="ymin"
              />
              <span>to</span>
              <input
                type="number"
                name="ymax"
                value={boundaryInfo.ymax}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="ymax"
              />
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="number"
                name="yminCount"
                value={boundaryInfo.yminCount}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="ymin count"
              />
              <span>to</span>
              <input
                type="number"
                name="ymaxCount"
                value={boundaryInfo.ymaxCount}
                onChange={handleInputChange}
                className="w-20 p-1 border rounded"
                placeholder="ymax count"
              />
              <span className="text-sm text-gray-500">dies</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-mono"
        >
          Calculate Parameters
        </button>

        {calculatedParams && (
          <div className="mt-4 p-4 bg-gray-100 rounded font-mono">
            <h3 className="font-semibold">Calculated Parameters:</h3>
            <p>Die Width: {calculatedParams.dieWidth.toFixed(3)}mm</p>
            <p>Die Height: {calculatedParams.dieHeight.toFixed(3)}mm</p>
            <p>Offset X: {calculatedParams.offsetX.toFixed(3)}mm</p>
            <p>Offset Y: {calculatedParams.offsetY.toFixed(3)}mm</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
