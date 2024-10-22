interface BoundaryInfo {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    xminCount: number;  // Number of valid dies in xmin column
    xmaxCount: number;  // Number of valid dies in xmax column
    yminCount: number;  // Number of valid dies in ymin row
    ymaxCount: number;  // Number of valid dies in ymax row
  }
  
  interface DieParameters {
    dieWidth: number;
    dieHeight: number;
    offsetX: number;
    offsetY: number;
    diameter: number;
    scribeWidth: number;
  }
  
  export function calculateDieParameters(
    boundaryInfo: BoundaryInfo,
    diameter: number = 300,
    scribeWidth: number = 0.8
  ): DieParameters {
    const {
      xmin, xmax, ymin, ymax,
      xminCount, xmaxCount, yminCount, ymaxCount
    } = boundaryInfo;
  
    // Step 1: Calculate die dimensions
    // For X direction:
    // Total span = (xmax - xmin) * (dieWidth + scribeWidth)
    // We can solve for dieWidth knowing the span must fit within the wafer
    const xSpan = xmax - xmin;
    const ySpan = ymax - ymin;
  
    // Step 2: Calculate die width and height
    // Using the fact that we know the number of valid dies at the extremes
    // and these must be related to the intersection of the wafer circle
    const calculateDieSize = (
      span: number,
      minCount: number,
      maxCount: number,
      minPos: number,
      maxPos: number
    ): { size: number; offset: number } => {
      // Given that the wafer is circular, the difference in valid die counts
      // at the extremes helps us determine the die size and offset
      
      // First, calculate approximate die size
      const size = diameter / (span + 2); // Initial approximation
      
      // Calculate center position that would give us the observed counts
      // at the extremes
      const minPosDistance = Math.abs(minPos * (size + scribeWidth));
      const maxPosDistance = Math.abs(maxPos * (size + scribeWidth));
      
      // Use the counts to adjust the offset
      const offset = (maxPosDistance * minCount - minPosDistance * maxCount) / 
                    (minCount + maxCount);
      
      return {
        size: Number(size.toFixed(3)),
        offset: Number(offset.toFixed(3))
      };
    };
  
    // Calculate for both directions
    const xResult = calculateDieSize(xSpan, xminCount, xmaxCount, xmin, xmax);
    const yResult = calculateDieSize(ySpan, yminCount, ymaxCount, ymin, ymax);
  
    // Step 3: Return the final parameters
    return {
      dieWidth: xResult.size,
      dieHeight: yResult.size,
      offsetX: xResult.offset,
      offsetY: yResult.offset,
      diameter,
      scribeWidth
    };
  }
  
  // Test with the given example
  const example: BoundaryInfo = {
    xmin: -7,
    xmax: 7,
    ymin: -13,
    ymax: 11,
    xminCount: 6,
    xmaxCount: 11,
    yminCount: 4,
    ymaxCount: 5
  };
  
  const result = calculateDieParameters(example);
  console.log("Wafer diameter:", result.diameter + "mm");
  console.log("Die size:", result.dieWidth + "mm ×", result.dieHeight + "mm");
  console.log("Scribe width:", result.scribeWidth + "mm");
  console.log("Offset: (" + result.offsetX + "mm, " + result.offsetY + "mm)");
  
  // Function to verify if a die would be inside the wafer
  function isDieInside(
    x: number,
    y: number,
    params: DieParameters
  ): 'inside' | 'edge' | 'outside' {
    const { dieWidth, dieHeight, offsetX, offsetY, diameter, scribeWidth } = params;
    const radius = diameter / 2;
    
    // Calculate die center position
    const centerX = x * (dieWidth + scribeWidth) - offsetX;
    const centerY = y * (dieHeight + scribeWidth) - offsetY;
    
    // Check all corners
    const corners = [
      { x: centerX - dieWidth/2, y: centerY - dieHeight/2 },
      { x: centerX + dieWidth/2, y: centerY - dieHeight/2 },
      { x: centerX - dieWidth/2, y: centerY + dieHeight/2 },
      { x: centerX + dieWidth/2, y: centerY + dieHeight/2 }
    ];
    
    const insideCorners = corners.filter(corner => {
      const dist = Math.sqrt(corner.x * corner.x + corner.y * corner.y);
      return dist <= radius;
    }).length;
    
    if (insideCorners === 4) return 'inside';
    if (insideCorners > 0) return 'edge';
    return 'outside';
  }
  
  // Verify the result by checking the boundary dies
  const verificationResult = {
    xmin: isDieInside(example.xmin, 0, result),
    xmax: isDieInside(example.xmax, 0, result),
    ymin: isDieInside(0, example.ymin, result),
    ymax: isDieInside(0, example.ymax, result)
  };
  
  console.log("\nVerification result:", verificationResult);