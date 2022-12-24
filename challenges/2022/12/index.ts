import getInput from '../../../utils/getInput';

type Coords = [number, number];

const data = getInput('2022', '12');

const getGraph = (data: string) =>
  data
    .split('\n')
    .map((r) =>
      r
        .split('')
        .map((c) => (c === 'S' ? 0 : c === 'E' ? 27 : c.charCodeAt(0) - 96))
    );

const serialize = ([x, y]: Coords) => `${x},${y}`;
const unserialize = (s: string) => s.split(',').map(Number) as Coords;

const getNeighborsOf =
  (nodes: number[][]) =>
    ([x, y]: Coords) =>
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]
        .map(([nx, ny]) => [x + nx, y + ny] as Coords)
        .filter(
          ([nx, ny]) =>
            nx >= 0 &&
            ny >= 0 &&
            nx < nodes.length &&
            ny < nodes[x].length &&
            nodes[nx][ny] <= nodes[x][y] + 1
        )
        .map(serialize);

const getCoordinates = (nodes: number[][], n: number): string => {
  for (let x = 0; x < nodes.length; x++) {
    for (let y = 0; y < nodes[x].length; y++) {
      if (nodes[x][y] === n) return serialize([x, y]);
    }
  }
  return '';
};

const walk = (nodes: number[][], start: string, end: string) => {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const distances = new Map<string, number>();
  distances.set(start, 0);

  const neighborsOf = getNeighborsOf(nodes);

  while (queue.length) {
    const current = queue.pop()!;

    for (const n of neighborsOf(unserialize(current))) {
      if (visited.has(current)) continue;
      distances.set(
        n,
        Math.min(distances.get(n) ?? Infinity, distances.get(current)! + 1)
      );
      queue.push(n);
    }

    visited.add(current);

    if (visited.has(end)) {
      return distances.get(end)!;
    }

    queue.sort((a, b) => distances.get(b)! - distances.get(a)!);
  }

  return Infinity;
};

function part1(data: string) {
  const graph = getGraph(data);

  return walk(graph, getCoordinates(graph, 0), getCoordinates(graph, 27));
}

function part2(data: string) {
  const graph = getGraph(data);
  const end = getCoordinates(graph, 27);

  const starts = graph.reduce<string[]>(
    (acc, row, x) =>
      acc.concat(
        row.reduce<string[]>(
          (acc, n, y) => (n > 1 ? acc : acc.concat(serialize([x, y]))),
          []
        )
      ),
    []
  );

  return starts
    .map((start) => walk(graph, start, end))
    .sort((a, b) => b - a)
    .pop();
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

console.assert(part1(testData) === 31);
console.assert(part2(testData) === 29);
