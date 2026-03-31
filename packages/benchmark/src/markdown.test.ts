import { describe, expect, it } from 'vitest';
import { generateMarkdown } from './markdown.js';
import type { AggregatedResult } from './types.js';

const fixtureResults: AggregatedResult[] = [
  {
    app: 'nextjs-app',
    page: 'listing',
    latency: 0,
    device: 'desktop',
    medianMetrics: {
      lcp: 1200,
      fcp: 800,
      tbt: 50,
      inp: 30,
      cls: 0.05,
      ttfb: 200,
      performanceScore: 95,
      jsBundleSize: 102400,
    },
    modeUsed: 'SSG',
  },
  {
    app: 'astro-app',
    page: 'detail',
    latency: 500,
    device: 'mobile',
    medianMetrics: {
      lcp: 2500,
      fcp: 1800,
      tbt: 120,
      inp: 80,
      cls: 0.1,
      ttfb: 600,
      performanceScore: 78,
      jsBundleSize: 204800,
    },
    // modeUsed intentionally omitted → should show N/A
  },
];

describe('generateMarkdown', () => {
  it('produces a string output', () => {
    const md = generateMarkdown(fixtureResults);
    expect(typeof md).toBe('string');
  });

  it('includes a pipe-delimited header row', () => {
    const md = generateMarkdown(fixtureResults);
    const lines = md.split('\n').filter((l) => l.length > 0);
    // First line should be the header
    expect(lines[0]).toContain('App');
    expect(lines[0]).toContain('Page');
    expect(lines[0]).toContain('LCP');
    expect(lines[0]).toContain('FCP');
    expect(lines[0]).toContain('Mode Used');
  });

  it('includes a separator row as the second line', () => {
    const md = generateMarkdown(fixtureResults);
    const lines = md.split('\n').filter((l) => l.length > 0);
    // Second line should be the separator (all dashes and pipes)
    expect(lines[1]).toMatch(/^[|\-\s]+$/);
  });

  it('includes data rows for each result', () => {
    const md = generateMarkdown(fixtureResults);
    expect(md).toContain('nextjs-app');
    expect(md).toContain('astro-app');
  });

  it('includes the "Mode used" column in the output', () => {
    const md = generateMarkdown(fixtureResults);
    expect(md).toContain('Mode Used');
    expect(md).toContain('SSG');
  });

  it('uses N/A for missing modeUsed', () => {
    const md = generateMarkdown(fixtureResults);
    expect(md).toContain('N/A');
  });

  it('includes latency values in the rows', () => {
    const md = generateMarkdown(fixtureResults);
    expect(md).toContain('0');
    expect(md).toContain('500');
  });

  it('every data line starts and ends with a pipe character', () => {
    const md = generateMarkdown(fixtureResults);
    const lines = md.split('\n').filter((l) => l.length > 0);
    // Skip header (index 0) and separator (index 1)
    for (const line of lines.slice(2)) {
      expect(line.trim().startsWith('|')).toBe(true);
      expect(line.trim().endsWith('|')).toBe(true);
    }
  });

  it('returns only a header and separator for empty input', () => {
    const md = generateMarkdown([]);
    const lines = md.split('\n').filter((l) => l.length > 0);
    expect(lines).toHaveLength(2);
  });
});
