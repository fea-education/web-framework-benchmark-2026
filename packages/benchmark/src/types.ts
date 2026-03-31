export type Device = 'desktop' | 'mobile';
export type LatencyPreset = 0 | 500 | 1500;

export interface RawRunResult {
  app: string;
  page: string;
  latency: LatencyPreset;
  device: Device;
  runIndex: number;
  metrics: {
    lcp: number;
    fcp: number;
    tbt: number;
    inp: number;
    cls: number;
    ttfb: number;
    performanceScore: number;
    jsBundleSize: number;
  };
}

export interface AggregatedResult {
  app: string;
  page: string;
  latency: LatencyPreset;
  device: Device;
  medianMetrics: RawRunResult['metrics'];
  modeUsed?: string;
}
