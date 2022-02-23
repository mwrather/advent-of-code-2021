import getInput from '../../../utils/getInput';

type Cursor = [number, number];

const NEIGHBORS = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];

const data: string = getInput('2021', '15');

const testData = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const serialize = (cursor: Cursor): string => `${cursor[0]},${cursor[1]}`;
const unserialize = (s: string) => s.split(',').map(Number) as Cursor;

const grid = data
  .trim()
  .split('\n')
  .map((row) => row.split('').map(Number));

const getWeights = (grid: number[][]) =>
  Object.fromEntries(
    grid.flatMap((row, x) => row.map((v, y) => [serialize([x, y]), v]))
  );

const getNeighbors = (
  k: string,
  weights: Record<string, number>,
  visited: Set<string>
) => {
  const [x, y] = unserialize(k);
  return NEIGHBORS.map(([dx, dy]) => serialize([x + dx, y + dy])).filter(
    (xy) => !visited.has(xy) && weights[xy] !== undefined
  );
};

class PriorityQueue<T = string> {
  private queue: [number, T][] = [];

  constructor(initialValues: Iterable<[number, T]> = []) {
    for (const [w, v] of initialValues) {
      this.add(w, v);
    }
  }

  public add(priority: number, key: T) {
    this.queue = this.queue.filter(([, k]) => k !== key); // for overwrites
    this.queue.push([priority, key]);
    this.queue.sort((a, b) => b[0] - a[0]);
  }

  public get(): T | undefined {
    const [, v] = this.queue.pop()!;
    return v;
  }

  public has(value: T): boolean {
    return this.queue.some(([p, k]) => k === value);
  }

  public get size(): number {
    return this.queue.length;
  }
}

const lowestRisk = (grid: number[][]) => {
  const weights = getWeights(grid);
  const maxX = grid.length - 1;
  const maxY = grid[maxX].length - 1;
  const target = serialize([maxX, maxY]);

  const queue = new PriorityQueue<string>();
  const visited = new Set<string>();
  const distances = new Map<string, number>([['0,0', 0]]);
  queue.add(0, '0,0');

  while (queue.size > 0) {
    const current = queue.get()!;
    visited.add(current);

    if (current === target) {
      return distances.get(current);
    }

    for (const n of getNeighbors(current, weights, visited)) {
      distances.set(
        n,
        Math.min(
          distances.get(current)! + weights[n],
          distances.get(n) ?? Infinity
        )
      );
      queue.add(distances.get(n)!, n);
    }
  }
};

const increaseRisk = (n: number) => (n === 9 ? 1 : n + 1);

const expandGrid = (grid: number[][]) => {
  for (const row of grid) {
    const l = row.length;
    for (let i = l; i < l * 5; i++) {
      row.push(increaseRisk(row[i - l]));
    }
  }
  const l = grid.length;
  for (let i = l; i < l * 5; i++) {
    grid.push(grid[i - l].map(increaseRisk));
  }

  return grid;
};

function part1(grid: number[][]) {
  return lowestRisk(grid);
}

function part2(grid: number[][]) {
  return lowestRisk(expandGrid(grid));
}

console.log(`Solution 1: ${part1(grid)}`);
console.log(`Solution 2: ${part2(grid)}`);
