import { Dir, readFileSync } from 'fs';
import { serialize } from 'v8';

const data = readFileSync('challenges/2023/16/input.txt', 'utf-8').trim();

const testData = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

const process = (input: string) =>
  input.split('\n').map((line) => line.split('')) as Operator[][];

type Coord = [number, number];
type Operator = '.' | '/' | '\\' | '-' | '|';
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
type BeamState = [Coord, Direction];

const deltas: Record<Direction, Coord> = {
  [Direction.UP]: [-1, 0],
  [Direction.DOWN]: [1, 0],
  [Direction.LEFT]: [0, -1],
  [Direction.RIGHT]: [0, 1],
};

const key: Record<Operator, Record<Direction, Direction[]>> = {
  '.': {
    [Direction.UP]: [Direction.UP],
    [Direction.DOWN]: [Direction.DOWN],
    [Direction.LEFT]: [Direction.LEFT],
    [Direction.RIGHT]: [Direction.RIGHT],
  },
  '/': {
    [Direction.UP]: [Direction.RIGHT],
    [Direction.DOWN]: [Direction.LEFT],
    [Direction.LEFT]: [Direction.DOWN],
    [Direction.RIGHT]: [Direction.UP],
  },
  '\\': {
    [Direction.UP]: [Direction.LEFT],
    [Direction.DOWN]: [Direction.RIGHT],
    [Direction.LEFT]: [Direction.UP],
    [Direction.RIGHT]: [Direction.DOWN],
  },
  '-': {
    [Direction.UP]: [Direction.LEFT, Direction.RIGHT],
    [Direction.DOWN]: [Direction.LEFT, Direction.RIGHT],
    [Direction.LEFT]: [Direction.LEFT],
    [Direction.RIGHT]: [Direction.RIGHT],
  },
  '|': {
    [Direction.UP]: [Direction.UP],
    [Direction.DOWN]: [Direction.DOWN],
    [Direction.LEFT]: [Direction.UP, Direction.DOWN],
    [Direction.RIGHT]: [Direction.UP, Direction.DOWN],
  },
};

const getNextDirections = (c: Operator, d: Direction) => key[c][d];

const getNextCoord = ([y, x]: Coord, dir: Direction) =>
  (([dy, dx]) => [y + dy, x + dx] as Coord)(deltas[dir]);

const isCoordinateValid = (map: Operator[][], [y, x]: Coord) =>
  y >= 0 && x >= 0 && y < map.length && x < map[0].length;

const getEnergizedTiles = (
  map: Operator[][],
  initialState: BeamState = [[0, 0], Direction.RIGHT]
) => {
  let queue: BeamState[] = [initialState];
  let seen: Record<string, Direction[]> = {};

  while (queue.length) {
    queue.forEach(([coord, dir]) => {
      const serialized = coord.join();
      seen[serialized] = seen[serialized] || [];
      seen[serialized].push(dir);
    });

    queue = queue.flatMap(([[y, x], dir]) =>
      getNextDirections(map[y][x], dir)
        .map<BeamState>((dir) => [getNextCoord([y, x], dir), dir])
        .filter(
          ([coord, direction]) =>
            isCoordinateValid(map, coord) &&
            !seen[coord.join()]?.includes(direction)
        )
    );
  }

  return Object.keys(seen).length;
};

const getStartingPoints = (map: unknown[][]): BeamState[] =>
  [
    Array.from(map[0], (_, i) => [[0, i], Direction.DOWN] as BeamState),
    Array.from(map, (_, i) => [[i, 0], Direction.RIGHT] as BeamState),
    Array.from(
      map,
      (_, i) => [[i, map[0].length - 1], Direction.LEFT] as BeamState
    ),
    Array.from(
      map[0],
      (_, i) => [[map.length - 1, i], Direction.UP] as BeamState
    ),
  ].flat();

function part1(input: string) {
  const map = process(input);
  return getEnergizedTiles(map);
}

function part2(input: string) {
  const map = process(input);
  const startingPoints = getStartingPoints(map);
  const energized = startingPoints.map((p) => getEnergizedTiles(map, p));
  return Math.max(...energized);
}

console.assert(part1(testData) === 46);
console.assert(part2(testData) === 51);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
