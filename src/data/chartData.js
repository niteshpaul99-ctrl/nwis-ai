// ============================================================
// NWIS.AI - Chart & Analytics Data Generator
// ============================================================

export const generateDepthTorqueData = (currentDepth = 2410) => {
  const data = [];
  for (let d = 1800; d <= 3500; d += 25) {
    const isFuture = d > currentDepth;
    const barailTransition = d > 1850;
    const kopiliTransition = d > 2700;
    const sylhetTransition = d > 3100;

    const baseActual = 10
      + (barailTransition ? 3 : 0)
      + (kopiliTransition ? 4 : 0)
      + (sylhetTransition ? 2 : 0)
      + Math.sin(d / 150) * 2;

    const actual = isFuture ? null : +(baseActual + (Math.random() * 2.4 - 1.2)).toFixed(2);
    const predicted = +(baseActual + (Math.random() * 1.2 - 0.6) + (d >= 2440 && d <= 2500 ? 4 : 0)).toFixed(2);
    const w45_torque = +(baseActual + 1.2 + Math.sin(d / 200) * 1.5 + (d >= 2440 && d <= 2500 ? 6 : 0)).toFixed(2);
    const w48_torque = +(baseActual - 0.8 + Math.cos(d / 180) * 1.8).toFixed(2);
    const w61_torque = +(baseActual + 0.4 + Math.sin(d / 120) * 1.1).toFixed(2);

    data.push({ depth: d, actual, predicted, offset_W45: w45_torque, offset_W48: w48_torque, offset_W61: w61_torque });
  }
  return data;
};

export const generateDepthROPData = (currentDepth = 2410) => {
  const data = [];
  for (let d = 1800; d <= 3500; d += 25) {
    const isFuture = d > currentDepth;
    const base = 22 - (d > 2700 ? 6 : 0) - (d > 3100 ? 3 : 0);
    data.push({
      depth: d,
      actual: isFuture ? null : +(base + (Math.random() * 5 - 2.5)).toFixed(1),
      predicted: +(base + (Math.random() * 3 - 1.5)).toFixed(1),
      w45: +(base + 2.2 + Math.random() * 3).toFixed(1),
      w61: +(base - 1.1 + Math.random() * 3).toFixed(1),
    });
  }
  return data;
};

export const generateDepthMudWeightData = (currentDepth = 2410) => {
  const data = [];
  for (let d = 0; d <= 3500; d += 50) {
    const isFuture = d > currentDepth;
    data.push({
      depth: d,
      active: isFuture ? null : +(1.10 + d / 10000 + (Math.random() * 0.01 - 0.005)).toFixed(3),
      w45: +(1.12 + d / 10500).toFixed(3),
      w61: +(1.15 + d / 9500).toFixed(3),
      fracture: +(1.45 + d / 18000).toFixed(3),
      pore: +(1.08 + d / 11000).toFixed(3),
    });
  }
  return data;
};

export const generateTimeSeriesData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    const t = new Date(now - i * 60000);
    const label = t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0');
    const base = 16;
    data.push({
      time: label,
      torque: +(base + Math.sin(i / 5) * 3 + Math.random() * 1.5).toFixed(2),
      rop: +(18 + Math.cos(i / 8) * 4 + Math.random() * 2).toFixed(1),
      spp: +(2840 + Math.sin(i / 4) * 120 + Math.random() * 60).toFixed(0),
      ecd: +(1.22 + Math.sin(i / 10) * 0.02 + Math.random() * 0.005).toFixed(3),
    });
  }
  return data;
};

export const DEPTH_TORQUE_DATA = generateDepthTorqueData();
export const DEPTH_ROP_DATA = generateDepthROPData();
export const DEPTH_MUDWEIGHT_DATA = generateDepthMudWeightData();
export const TIME_SERIES_DATA = generateTimeSeriesData();
