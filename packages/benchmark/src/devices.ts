/**
 * Lighthouse device configuration objects for mobile and desktop profiles.
 * Mobile uses Moto G4 emulation with simulated 4G throttling.
 * Desktop uses Lighthouse's standard desktop config.
 */

export interface LighthouseThrottling {
  rttMs: number;
  throughputKbps: number;
  cpuSlowdownMultiplier: number;
  requestLatencyMs: number;
  downloadThroughputKbps: number;
  uploadThroughputKbps: number;
}

export interface LighthouseFormFactor {
  formFactor: 'mobile' | 'desktop';
  screenEmulation: {
    mobile: boolean;
    width: number;
    height: number;
    deviceScaleFactor: number;
    disabled: boolean;
  };
  throttling: LighthouseThrottling;
  throttlingMethod: 'simulate' | 'devtools' | 'provided';
}

/** Moto G4 mobile profile with simulated 4G throttling */
export const MOBILE_CONFIG: LighthouseFormFactor = {
  formFactor: 'mobile',
  screenEmulation: {
    mobile: true,
    width: 360,
    height: 640,
    deviceScaleFactor: 2.625,
    disabled: false,
  },
  throttling: {
    rttMs: 150,
    throughputKbps: 1638.4,
    cpuSlowdownMultiplier: 4,
    requestLatencyMs: 562.5,
    downloadThroughputKbps: 1474.5600000000002,
    uploadThroughputKbps: 675,
  },
  throttlingMethod: 'simulate',
};

/** Standard Lighthouse desktop profile */
export const DESKTOP_CONFIG: LighthouseFormFactor = {
  formFactor: 'desktop',
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  throttling: {
    rttMs: 40,
    throughputKbps: 10240,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
  throttlingMethod: 'simulate',
};
