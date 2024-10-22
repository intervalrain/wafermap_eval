interface DieInfo {
  width: number; // die 的寬度
  length: number; // die 的長度
  offsetX: number; // die(0,0) 中心點相對於 wafer 中心的 x 偏移
  offsetY: number; // die(0,0) 中心點相對於 wafer 中心的 y 偏移
}

interface WaferCoordParams {
  diexMin: number; // 最左邊的 x 座標（負數）
  diexMax: number; // 最右邊的 x 座標（正數）
  dieyMin: number; // 最下面的 y 座標（負數）
  dieyMax: number; // 最上面的 y 座標（正數）
  dieCountAtXmin: number; // x=diexMin 位置的 die 數量
  dieCountAtXmax: number; // x=diexMax 位置的 die 數量
  dieCountAtYmin: number; // y=dieyMin 位置的 die 數量
  dieCountAtYmax: number; // y=dieyMax 位置的 die 數量
  waferDiameter?: number; // 晶圓直徑，預設 300mm
}

export class WaferCalculator {
  private static readonly DEFAULT_WAFER_DIAMETER = 300; // mm

  /**
   * 從已知的 die 座標分布推導出 die 尺寸和位置
   */
  public static calculateFromCoordinates({
    diexMin,
    diexMax,
    dieyMin,
    dieyMax,
    dieCountAtXmin,
    dieCountAtXmax,
    dieCountAtYmin,
    dieCountAtYmax,
    waferDiameter = this.DEFAULT_WAFER_DIAMETER,
  }: WaferCoordParams): DieInfo {
    const radius = waferDiameter / 2;

    // 1. 計算 die 的寬度和長度
    // die 寬度 = 圓弦長度 / die 數量
    const getChordLength = (h: number): number => {
      // 從圓心到切點的垂直距離為 h，計算弦長
      return 2 * Math.sqrt(radius * radius - h * h);
    };

    // 計算 x 座標對應的垂直距離（y值）
    const getYFromX = (x: number): number => {
      return (radius * x) / Math.abs(x); // 回傳 +/- radius
    };

    // 計算最左和最右的弦長
    const leftChordLength = getChordLength(getYFromX(diexMin));
    const rightChordLength = getChordLength(getYFromX(diexMax));

    // 計算平均 die 寬度
    const dieWidth =
      (leftChordLength / dieCountAtXmin + rightChordLength / dieCountAtXmax) /
      2;

    // 同理計算 die 長度
    const bottomChordLength = getChordLength(getYFromX(dieyMin));
    const topChordLength = getChordLength(getYFromX(dieyMax));
    const dieLength =
      (bottomChordLength / dieCountAtYmin + topChordLength / dieCountAtYmax) /
      2;

    // 2. 計算 offset
    // 因為 die(0,0) 的中心要對齊計算出的網格
    const offsetX = (-(diexMin + diexMax) * dieWidth) / 2;
    const offsetY = (-(dieyMin + dieyMax) * dieLength) / 2;

    // 返回計算結果，四捨五入到4位小數
    return {
      width: this.roundToDecimal(dieWidth, 4),
      length: this.roundToDecimal(dieLength, 4),
      offsetX: this.roundToDecimal(offsetX, 4),
      offsetY: this.roundToDecimal(offsetY, 4),
    };
  }

  /**
   * 將數字四捨五入到指定小數位
   */
  private static roundToDecimal(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
}
