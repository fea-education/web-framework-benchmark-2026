import { describe, expect, it } from 'vitest';
import { aggregate } from './aggregator.js';
import type { RawRunResult } from './types.js';

// Small fixture: 2 apps × 1 page × 1 latency × 1 device, 3 runs each
const BASE_METRICS = {
  lcp: 0,
  fcp: 0,
  tbt: 0,
  inp: 0,
  cls: 0,
  ttfb: 0,
  performanceScore: 0,
  jsBundleSize: 0,
};

function makeRun(
  app: string,
  page: string,
  latency: 0 | 500 | 1500,
  device: 'desktop' | 'mobile',
  runIndex: number,
  lcpOverride: number,
  fcpOverride: number,
): RawRunResult {
  return {
    app,
    page,
    latency,
    device,
    runIndex,
    metrics: {
      ...BASE_METRICS,
      lcp: lcpOverride,
      fcp: fcpOverride,
    },
  };
}

// 3 runs for "nextjs-app" / "listing" / 0ms latency / desktop
// LCP values: 100, 200, 300 → median 200
// FCP values: 50, 60, 70 → median 60
const nextjsRuns: RawRunResult[] = [
  makeRun('nextjs-app', 'listing', 0, 'desktop', 0, 100, 50),
  makeRun('nextjs-app', 'listing', 0, 'desktop', 1, 300, 70),
  makeRun('nextjs-app', 'listing', 0, 'desktop', 2, 200, 60),
];

// 3 runs for "astro-app" / "listing" / 500ms latency / mobile
// LCP values: 400, 600, 500 → median 500
// FCP values: 200, 300, 250 → median 250
const astroRuns: RawRunResult[] = [
  makeRun('astro-app', 'listing', 500, 'mobile', 0, 400, 200),
  makeRun('astro-app', 'listing', 500, 'mobile', 1, 600, 300),
  makeRun('astro-app', 'listing', 500, 'mobile', 2, 500, 250),
];

const allRuns = [...nextjsRuns, ...astroRuns];

describe('aggregate', () => {
  it('groups runs by (app × page × latency × device)', () => {
    const results = aggregate(allRuns);
    expect(results).toHaveLength(2);

    const apps = results.map((r) => r.app).sort();
    expect(apps).toEqual(['astro-app', 'nextjs-app']);
  });

  it('computes correct median LCP for nextjs-app group', () => {
    const results = aggregate(allRuns);
    const nextjs = results.find(
      (r) => r.app === 'nextjs-app' && r.device === 'desktop',
    );
    expect(nextjs).toBeDefined();
    expect(nextjs?.medianMetrics.lcp).toBe(200);
  });

  it('computes correct median FCP for nextjs-app group', () => {
    const results = aggregate(allRuns);
    const nextjs = results.find(
      (r) => r.app === 'nextjs-app' && r.device === 'desktop',
    );
    expect(nextjs?.medianMetrics.fcp).toBe(60);
  });

  it('computes correct median LCP for astro-app group', () => {
    const results = aggregate(allRuns);
    const astro = results.find(
      (r) => r.app === 'astro-app' && r.device === 'mobile',
    );
    expect(astro).toBeDefined();
    expect(astro?.medianMetrics.lcp).toBe(500);
  });

  it('computes correct median FCP for astro-app group', () => {
    const results = aggregate(allRuns);
    const astro = results.find(
      (r) => r.app === 'astro-app' && r.device === 'mobile',
    );
    expect(astro?.medianMetrics.fcp).toBe(250);
  });

  it('preserves group metadata (page, latency, device)', () => {
    const results = aggregate(allRuns);
    const astro = results.find((r) => r.app === 'astro-app');
    expect(astro?.page).toBe('listing');
    expect(astro?.latency).toBe(500);
    expect(astro?.device).toBe('mobile');
  });

  it('returns empty array for empty input', () => {
    expect(aggregate([])).toEqual([]);
  });

  it('handles a single run as its own group with medians equal to its values', () => {
    const single = makeRun('vue-app', 'detail', 1500, 'desktop', 0, 999, 111);
    const results = aggregate([single]);
    expect(results).toHaveLength(1);
    expect(results[0]?.medianMetrics.lcp).toBe(999);
    expect(results[0]?.medianMetrics.fcp).toBe(111);
  });
});
