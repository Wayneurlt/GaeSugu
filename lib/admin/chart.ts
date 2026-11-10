/** A round number a little above the highest bar, so the tallest bar fills most of the chart. */
export function niceTop(max: number) {
  const target = Math.max(4, max * 1.25);
  const steps = [1, 2, 2.5, 5, 10];
  const magnitude = 10 ** Math.floor(Math.log10(target / 4));
  for (const s of steps) if (s * magnitude * 4 >= target) return s * magnitude * 4;
  return 40 * magnitude;
}
