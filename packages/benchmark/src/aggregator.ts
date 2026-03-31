import { median } from './median.js';
import type { AggregatedResult, RawRunResult } from './types.js';

type MetricKey = keyof RawRunResult['metrics'];

const METRIC_KEYS: MetricKey[] = [
  'lcp',
  'fcp',
  'tbt',
  'inp',
  'cls',
  'ttfb',
  'performanceScore',
  'jsBundleSize',
];

/**
 * Groups raw Lighthouse run results by (app × page × latency × device) and
 * computes the median for each metric across all runs in the group.
 */
export function aggregate(runs: RawRunResult[]): AggregatedResult[] {
  // Build a map keyed by group signature
  const groups = new Map<string, RawRunResult[]>();

  for (const run of runs) {
    const key = `${run.app}|${run.page}|${run.latency}|${run.device}`;
    const existing = groups.get(key);
    if (existing !== undefined) {
      existing.push(run);
    } else {
      groups.set(key, [run]);
    }
  }

  const results: AggregatedResult[] = [];

  for (const [, groupRuns] of groups) {
    // All runs in a group share the same (app, page, latency, device)
    const first = groupRuns[0];
    if (first === undefined) continue;

    const medianMetrics = {} as RawRunResult['metrics'];

    for (const key of METRIC_KEYS) {
      const values = groupRuns.map((r) => r.metrics[key]);
      (medianMetrics as Record<string, number>)[key] = median(values);
    }

    results.push({
      app: first.app,
      page: first.page,
      latency: first.latency,
      device: first.device,
      medianMetrics,
    });
  }

  return results;
}
