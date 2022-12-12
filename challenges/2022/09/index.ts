import { tail } from 'shelljs';
import getInput from '../../../utils/getInput';

const data = getInput('2022', '09');

type Coordinate = [number, number];
type Move = [-1 | 0 | 1, -1 | 0 | 1];
type Positions = { H: Coordinate; T: Coordinate };
type Dir = 'R' | 'L' | 'U' | 'D';

const moves: Record<Dir, Move> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const processInput = (data: string) =>
  data
    .split('\n')
    .map((r) => r.split(' '))
    .reduce<Dir[]>(
      (acc, [dir, size]) => acc.concat(Array(+size).fill(dir)),
      []
    );

const serializePosition = (p: Coordinate) => p.map(String).join(',');

const moveHead = (H: Coordinate, m: Dir): Coordinate =>
  [H[0] + moves[m][0], H[1] + moves[m][1]]

const getNewPosition = (H: Coordinate, T: Coordinate): Coordinate => {
  const [diffX, diffY] = [H[0] - T[0], H[1] - T[1]];
  const [dirX, dirY] = [diffX > 0 ? 1 : -1, diffY > 0 ? 1 : -1];

  if (Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) return T;

  if (diffY === 0) {
    return [T[0] + dirX, T[1]];
  }

  if (diffX === 0) {
    return [T[0], T[1] + dirY];
  }

  return [T[0] + dirX, T[1] + dirY];
};

function part1(data: string): number {
  let positions: Positions = { H: [0, 0], T: [0, 0] };
  let tailPositions = new Set<string>(['0,0']);

  for (const move of processInput(data)) {
    const newH = moveHead(positions.H, move);
    positions = {
      H: newH,
      T: getNewPosition(newH, positions.T)
    };
    tailPositions.add(serializePosition(positions.T));
  }

  return tailPositions.size;
}

function part2(data: string): number {
  let positions: Coordinate[] = Array.from({ length: 10 }, () => [0, 0]);
  let tailPositions = new Set<string>(['0,0']);

  for (const move of processInput(data)) {
    positions[0] = moveHead(positions[0], move);
    for (let i = 1; i < positions.length; i += 1)
      positions[i] = getNewPosition(positions[i - 1], positions[i]);
    tailPositions.add(serializePosition(positions[9]));
  }

  return tailPositions.size;
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = 'R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2';
const testData2 = 'R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20'

console.assert(part1(testData) === 13, 'error in part 1');
console.assert(part2(testData) === 1, 'error in part 2');
console.assert(part2(testData2) === 36, 'error in part 2')
