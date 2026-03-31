/**
 * Calculates the median of a numeric array.
 *
 * - Odd length: returns the middle value of the sorted array.
 * - Even length: returns the average of the two middle values of the sorted array.
 * - Empty array: returns NaN.
 */
export function median(values: number[]): number {
  if (values.length === 0) {
    return NaN;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    // Odd length — return the middle element
    // noUncheckedIndexedAccess requires a non-undefined check
    const middle = sorted[mid];
    if (middle === undefined) {
      return NaN;
    }
    return middle;
  }

  // Even length — return average of the two middle elements
  const lo = sorted[mid - 1];
  const hi = sorted[mid];
  if (lo === undefined || hi === undefined) {
    return NaN;
  }
  return (lo + hi) / 2;
}
