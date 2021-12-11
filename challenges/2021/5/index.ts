import { stringify } from 'querystring';
import getInput from '../../../utils/getInput';

type Line = [[number, number], [number, number]];

const data: Line[] = getInput('2021', '5')
  .split('\n')
  .filter(Boolean)
  .map((pair) =>
    pair.split(' -> ').map((xy) => xy.split(',').map(Number))
  ) as Line[];

const isHorizontalOrVertical = ([[x1, y1], [x2, y2]]: Line): boolean =>
  x1 === x2 || y1 === y2;

const range = (p1: number, p2: number): number[] =>
  Array.from({ length: Math.abs(p2 - p1) + 1 }, (_, i) =>
    p1 < p2 ? p1 + i : p1 - i
  );

const getPoints = (line: Line): string[] => {
  const [[x1, y1], [x2, y2]] = line;
  if (x1 === x2) {
    return range(y1, y2).map((y) => `${x1},${y}`);
  } else if (y1 === y2) {
    return range(x1, x2).map((x) => `${x},${y1}`);
  } else {
    const ys = range(y1, y2);
    return range(x1, x2).map((x, i) => `${x},${ys[i]}`);
  }
};

const calculateIntersections = (data: Line[]): number => {
  const grid: Record<string, number> = {};
  for (const point of data.map(getPoints).flat()) {
    grid[point] = (grid[point] || 0) + 1;
  }

  return Object.values(grid).filter((v) => v > 1).length;
};

const part1 = (data: Line[]) =>
  calculateIntersections(data.filter(isHorizontalOrVertical));

const part2 = calculateIntersections;

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
