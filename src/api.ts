export interface BoundaryInfo {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    xminCount: number;
    xmaxCount: number;
    yminCount: number;
    ymaxCount: number;
  }
  
  export interface DieParameters {
    dieWidth: number;
    dieHeight: number;
    offsetX: number;
    offsetY: number;
    diameter: number;
    scribeWidth: number;
  }
  
  export const calculateDieParameters = (
    boundaryInfo: BoundaryInfo,
    diameter: number = 300,
    scribeWidth: number = 0.8
  ): DieParameters => {
    const {
      xmin, xmax, ymin, ymax,
      xminCount, xmaxCount, yminCount, ymaxCount
    } = boundaryInfo;
  
    const xSpan = xmax - xmin;
    const ySpan = ymax - ymin;
  
    const calculateDieSize = (
      span: number,
      minCount: number,
      maxCount: number,
      minPos: number,
      maxPos: number
    ): { size: number; offset: number } => {
      const size = diameter / (span + 2);
      const minPosDistance = Math.abs(minPos * (size + scribeWidth));
      const maxPosDistance = Math.abs(maxPos * (size + scribeWidth));
      const offset = (maxPosDistance * minCount - minPosDistance * maxCount) / 
                    (minCount + maxCount);
      
      return {
        size: Number(size.toFixed(3)),
        offset: Number(offset.toFixed(3))
      };
    };
  
    const xResult = calculateDieSize(xSpan, xminCount, xmaxCount, xmin, xmax);
    const yResult = calculateDieSize(ySpan, yminCount, ymaxCount, ymin, ymax);
  
    return {
      dieWidth: xResult.size,
      dieHeight: yResult.size,
      offsetX: xResult.offset,
      offsetY: yResult.offset,
      diameter,
      scribeWidth
    };
  };