import getInput from '../../../utils/getInput';

type Coords = [number, number];
type Extremes = [number, number, number];

const data = getInput('2022', '14');

const ORIGIN_X = 500;
const ORIGIN_Y = 0;

const parse = (data: string): Coords[][] =>
  data
    .split('\n')
    .map((r) => r.split(' -> ').map((p) => p.split(',').map(Number) as Coords));

function getExtremes(lines: Coords[][]): [number, number, number] {
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  for (const line of lines) {
    for (const [x, y] of line) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return [minX, maxX, maxY];
}

const drawGrid = (lines: Coords[][], [, maxX, maxY]: Extremes): boolean[][] => {
  const grid = Array.from({ length: maxX + 1 }, () =>
    Array(maxY + 1).fill(false)
  );

  for (const line of lines) {
    let [x, y] = line[0];
    for (const [x1, y1] of line.slice(1)) {
      while (x !== x1 || y !== y1) {
        grid[x][y] = true;
        x = x + (x === x1 ? 0 : (x1 - x) / Math.abs(x1 - x));
        y = y + (y === y1 ? 0 : (y1 - y) / Math.abs(y1 - y));
      }
    }
    grid[x][y] = true;
  }

  return grid;
};

const drawGridWithFloor = (lines: Coords[][], extremes: Extremes): boolean[][] => {
  const [, maxX, maxY] = extremes;

  return drawGrid(lines, extremes)
    .concat(Array.from({ length: (maxX - ORIGIN_X) + maxY + 2 }, () => Array.from({ length: maxY + 1 }, () => false)))
    .map(col => col.concat(false, true));
}

const draw = (grid: boolean[][], sand: boolean[][], [minX]: Extremes): string => {
  return Array.from(grid[0], (_, i) =>
    grid
      .slice(minX)
      .map((col, x): string => (col[i] ? '#' : sand[x + minX][i] ? 'o' : '.'))
      .join('')
  ).join('\n');
};

const drop = (grid: boolean[][], maxY: number) => {
  let x = ORIGIN_X, newX = ORIGIN_X;
  let y = ORIGIN_Y, newY = ORIGIN_Y;

  do {
    y = newY; // drop the sand
    x = newX;

    newX = [x, x - 1, x + 1].find(candidateX => !grid[candidateX][y + 1]) ?? -1;
    newY = newX < 0 ? y : y + 1;
  } while (newY !== y && newY < maxY);

  if (y < maxY) {
    grid[x][y] = true;
  }

  return newY < maxY;
}

function part1(data: string) {
  const lines = parse(data);
  const extremes = getExtremes(lines);
  const grid = drawGrid(lines, extremes);
  // const walls = [...grid.map(r => [...r])];

  let grains = 0;
  while (drop(grid, extremes[2])) {
    grains += 1;
  }

  // console.log(draw(walls, grid, extremes))
  return grains;
}

function part2(data: string): number {
  const lines = parse(data);
  const extremes = getExtremes(lines);
  const grid = drawGridWithFloor(lines, extremes);
  // const walls = [...grid.map(r => [...r])];

  let grains = 0;
  while (grid[ORIGIN_X][ORIGIN_Y] === false) {
    drop(grid, extremes[2] + 2);
    grains += 1;
  }

  // console.log(draw(walls, grid, [extremes[0] - extremes[2] - 2, 0, 0]));
  return grains;
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

console.assert(part1(testData) === 24);
console.assert(part2(testData) === 93);
