import getInput from '../../../utils/getInput';

const data = getInput('2023', '14').trim();

const testData = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const process = (input: string) => input.split('\n');

function roll(col: string[], i = 1): string[] {
  if (i >= col.length) return col;
  if (col[i] === 'O' && col[i - 1] === '.')
    return roll([...col.slice(0, i - 1), 'O', '.', ...col.slice(i + 1)], i - 1);
  return roll(col, i + 1);
}

type BeforeFn = (input: string[]) => string[][];
type AfterFn = (input: string[][]) => string[];

const getRoller = (before: BeforeFn, after: AfterFn) => (input: string[]) =>
  after(before(input).map((cs) => roll(cs)));

const rollNorth = getRoller(
  (input) => Array.from(input[0], (_, i) => input.map((row) => row[i])),
  (cols) => Array.from(cols[0], (_, i) => cols.map((c) => c[i]).join(''))
);

const rollSouth = getRoller(
  (input) =>
    Array.from(input[0], (_, i) => input.map((row) => row[i]).reverse()),
  (cols) =>
    Array.from(cols[0], (_, i) => cols.map((c) => c[i]).join('')).reverse()
);

const rollWest = getRoller(
  (input) => input.map((row) => row.split('')),
  (output) => output.map((row) => row.join(''))
);

const rollEast = getRoller(
  (input) => input.map((row) => row.split('').reverse()),
  (output) => output.map((row) => row.reverse().join(''))
);

const cycle = (input: string[]) =>
  rollEast(rollSouth(rollWest(rollNorth(input))));

const sum = (a: number, b: number) => a + b;

const calculateNorthLoad = (rows: string[]) =>
  rows
    .map((row, i) => row.replaceAll(/[^O]/g, '').length * (rows.length - i))
    .reduce(sum);

function part1(input: string) {
  const cols = process(input);
  const rolled = rollNorth(cols);

  return calculateNorthLoad(rolled);
}

function part2(input: string) {
  let data = process(input);
  let serialized = data.join('');

  const cache = new Map<string, string[]>();
  cache.set(serialized, data);

  while (true) {
    data = cycle(data);
    serialized = data.join('');

    if (cache.has(serialized)) break;
    cache.set(serialized, data);
  }
  const results = [...cache.entries()].map(([key]) => key);
  const cycleStartIndex = results.indexOf(serialized);
  const cycleLength = cache.size - cycleStartIndex;

  const endIndex =
    cycleStartIndex + ((1_000_000_000 - cycleStartIndex) % cycleLength);
  const endState = cache.get(results[endIndex])!;

  return calculateNorthLoad(endState);
}

console.assert(part1(testData) === 136);
console.assert(part2(testData) === 64);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
