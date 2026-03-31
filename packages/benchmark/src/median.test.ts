import { describe, expect, it } from 'vitest';
import { median } from './median.js';

describe('median', () => {
  it('returns the middle value for an odd-length array', () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it('returns the average of the two middle values for an even-length array', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('returns the single element for an array of length 1', () => {
    expect(median([5])).toBe(5);
  });

  it('returns the average for an array of length 2 with equal values', () => {
    expect(median([2, 2])).toBe(2);
  });

  it('returns NaN for an empty array', () => {
    expect(median([])).toBeNaN();
  });

  it('handles a larger odd-length array', () => {
    expect(median([10, 3, 7, 1, 5])).toBe(5);
  });

  it('handles a larger even-length array', () => {
    expect(median([6, 2, 4, 8])).toBe(5);
  });
});
