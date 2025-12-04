import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2025/4/input.txt',
  'utf-8'
).trim();

const testData = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const process = (s: string) =>
  s.split('\n').map(line => line.split(''))

const NEIGHBORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]

const getNeighborValues = (grid: string[][], y: number, x: number): string[] =>
  NEIGHBORS.map(([dy, dx]) => [dy + y, dx + x])
    .filter(([y, x]) => y >= 0 && x >= 0 && y < grid.length && x < grid[0].length)
    .map(([y, x]) => grid[y][x])

const getCoordinatesThatCanBeRemoved = (grid: string[][]) => {
  let coords: [number, number][] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '.') continue;
      const neighborRollsCount = getNeighborValues(grid, y, x).filter(s => s === '@').length
      if (neighborRollsCount < 4) {
        coords.push([y, x])
      }
    }
  }

  return coords;
}

const removeRolls = (grid: string[][], coords: [number, number][]) => {
  const newGrid = Array.from(grid, (_, i) => [...grid[i]]);
  for (const [y, x] of coords) {
    newGrid[y][x] = '.'
  }
  return newGrid;
}

function part1(input: string) {
  return getCoordinatesThatCanBeRemoved(process(input)).length;
}

function part2(input: string) {
  let count = 0;
  let grid = process(input);
  while (true) {
    const removable = getCoordinatesThatCanBeRemoved(grid);

    if (removable.length === 0) break;

    count += removable.length;
    grid = removeRolls(grid, removable);
  }

  return count;
}

console.assert(part1(testData) === 13);
console.assert(part2(testData) === 43);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
