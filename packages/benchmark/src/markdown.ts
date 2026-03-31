import type { AggregatedResult } from './types.js';

const HEADER =
  '| App | Page | Latency (ms) | Device | LCP | FCP | TBT | INP | CLS | TTFB | Score | JS Bundle | Mode Used |';
const SEPARATOR =
  '|-----|------|-------------|--------|-----|-----|-----|-----|-----|------|-------|-----------|-----------|';

function fmtMs(value: number): string {
  return `${value.toFixed(0)} ms`;
}

function fmtBytes(bytes: number): string {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} kB`;
}

function fmtCls(value: number): string {
  return value.toFixed(3);
}

function fmtScore(value: number): string {
  return value.toFixed(0);
}

/**
 * Generates a valid CommonMark Markdown table from aggregated benchmark results.
 * Includes columns: App, Page, Latency (ms), Device, LCP, FCP, TBT, INP, CLS,
 * TTFB, Score, JS Bundle, Mode Used.
 */
export function generateMarkdown(results: AggregatedResult[]): string {
  const rows = results.map((r) => {
    const m = r.medianMetrics;
    const mode = r.modeUsed ?? 'N/A';
    return [
      `| ${r.app}`,
      r.page,
      String(r.latency),
      r.device,
      fmtMs(m.lcp),
      fmtMs(m.fcp),
      fmtMs(m.tbt),
      fmtMs(m.inp),
      fmtCls(m.cls),
      fmtMs(m.ttfb),
      fmtScore(m.performanceScore),
      fmtBytes(m.jsBundleSize),
      `${mode} |`,
    ].join(' | ');
  });

  return [HEADER, SEPARATOR, ...rows].join('\n') + '\n';
}
