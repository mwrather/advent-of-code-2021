import getInput from '../../../utils/getInput';

const data = getInput('2023', '10').trim();

const testData1 = `.....
.S-7.
.|.|.
.L-J.
.....`;

const testData2 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const testData3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const testData4 = `OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO`;

type Coord = [number, number];
type SerializedCoord = string;

const process = (input: string) =>
  input.split('\n').map((line) => line.split(''));

const findStart = (input: string[][]): Coord => {
  const y = input.findIndex((row) => row.includes('S'));
  const x = input[y].findIndex((char) => char === 'S');
  return [y, x];
};

const neighbors: Record<string, Coord[]> = {
  S: [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ],
  '-': [
    [0, 1],
    [0, -1],
  ],
  '|': [
    [-1, 0],
    [1, 0],
  ],
  F: [
    [0, 1],
    [1, 0],
  ],
  L: [
    [0, 1],
    [-1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  '7': [
    [0, -1],
    [1, 0],
  ],
};

const validNeighbors: Record<SerializedCoord, string[]> = {
  '0,1': ['-', '7', 'J'],
  '0,-1': ['-', 'F', 'L'],
  '1,0': ['|', 'L', 'J'],
  '-1,0': ['|', 'F', '7'],
};

const serialize = (pos: Coord): string => pos.join(',') as SerializedCoord;
const unserialize = (s: string) => s.split(',').map(Number) as Coord;

const getValidNeighbors = (
  [y, x]: Coord,
  map: string[][],
  seen: Map<string, number>
) =>
  neighbors[map[y][x]]
    .filter(([dy, dx]) => {
      const newY = y + dy;
      const newX = x + dx;
      const serialized = serialize([newY, newX]);

      if (seen.has(serialized)) return false;

      if (
        newX < 0 ||
        newY < 0 ||
        newY >= map.length ||
        newX >= map[newY].length
      ) {
        return false;
      }

      if (!validNeighbors[serialize([dy, dx])].includes(map[newY][newX]))
        return false;

      return true;
    })
    .map(([dy, dx]) => [y + dy, x + dx]) as Coord[];

const walk = (map: string[][], start: Coord): Map<SerializedCoord, number> => {
  const seen = new Map<SerializedCoord, number>();
  seen.set(serialize(start), 0);
  const queue: Coord[] = [start];

  while (queue.length > 0) {
    const coord = queue.shift()!;
    const neighbors = getValidNeighbors(coord, map, seen);

    for (const c of neighbors) {
      queue.push(c);
      seen.set(serialize(c), seen.get(serialize(coord))! + 1);
    }
  }

  return seen;
};

const drawLoop = (
  map: string[][],
  distanceMap: Map<string, number>
): string[][] =>
  Array.from(map, (_, y) =>
    Array.from(
      map[y],
      (_, x) => (distanceMap.has(serialize([y, x])) ? map[y][x] : '.') // not handling special case, "S"
    )
  );

const countEnclosedSquares = (map: string[][]): number => {
  let result = 0;

  for (const row of map) {
    const processedRow = row
      .join('')
      .replace(/-+/g, '')
      .replace(/^\.+|\.+$/g, '')
      // F7 LJ don't change parity
      .replace(/F7|LJ/g, '')
      // FJ L7 do change parity
      .replace(/FJ|L7/g, '|');

    let oddParity = false;

    for (const char of processedRow) {
      if (char !== '.') {
        oddParity = !oddParity;
        continue;
      }
      if (oddParity) result++;
    }
  }

  return result;
};

const visualize = (
  map: string[][],
  distanceMap: Map<SerializedCoord, number>
) =>
  map
    .map((row, y) =>
      [
        map[y].join(''),
        row.map((_, x) => distanceMap.get(serialize([y, x])) ?? '.').join(''),
      ].join(' | ')
    )
    .join('\n');

function part1(input: string) {
  const map = process(input);
  const start = findStart(map);
  const distanceMap = walk(map, start);

  return Math.max(...distanceMap.values());
}

function part2(input: string) {
  const map = process(input);
  const start = findStart(map);
  const distanceMap = walk(map, start);
  const loopMap = drawLoop(map, distanceMap);

  return countEnclosedSquares(loopMap);
}

console.assert(part1(testData1) === 4);
console.assert(part1(testData2) === 8);
console.assert(part2(testData3) === 4);
console.assert(part2(testData4) === 8);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
