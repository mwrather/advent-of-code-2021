import { match } from 'assert';
import getInput from '../../../utils/getInput';

const data = getInput('2023', '13').trim();

const testData = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const process = (input: string) =>
  input.split('\n\n').map((grid) => grid.split('\n'));

const hasHoriztonalReflection = (grid: string[], i: number) => {
  const size = Math.min(i, grid.length - i);
  const above = grid
    .slice(Math.max(0, i - size), i)
    .reverse()
    .join('');
  const below = grid.slice(i, i + size).join('');

  return above === below;
};

const cache: Record<string, string[]> = {};
const rotateGrid = (grid: string[]): string[] => {
  const key = grid.join('');
  if (cache[key]) return cache[key];

  return (cache[key] = Array.from(grid[0], (_, i) =>
    grid.map((row) => row[i]).join('')
  ));
};

const findReflections = (grid: string[]): number => {
  for (let i = 1; i < grid.length; i++)
    if (hasHoriztonalReflection(grid, i)) return 100 * i;

  for (let i = 1; i < grid[0].length; i++)
    if (hasHoriztonalReflection(rotateGrid(grid), i)) return i;

  throw new Error('Grid has no reflection.');
};

const switchCharAt = (index: number, line: string) =>
  line.slice(0, index) +
  (line[index] === '.' ? '#' : '.') +
  line.slice(index + 1);

const checkSmudges = (grid: string[], i: number) => {
  for (let j = 0; j < grid[0].length; j++) {
    const candidateLine = switchCharAt(j, grid[i - 1]);
    const matchingLineIndex = grid
      .slice(i)
      .findIndex((line) => line === candidateLine);
    if (matchingLineIndex === -1 || matchingLineIndex % 2 === 1) continue;
    const newReflectionLine = i + matchingLineIndex / 2;
    const newReflectionLineSize = Math.min(
      newReflectionLine,
      grid.length - newReflectionLine
    );
    if (Math.abs(newReflectionLine - i) > newReflectionLineSize) continue;
    if (
      hasHoriztonalReflection(
        grid.map((line, index) => (index === i - 1 ? candidateLine : line)),
        newReflectionLine
      )
    )
      return newReflectionLine;
  }

  return -1;
};

const findReflectionsWithSmudges = (grid: string[]): number => {
  for (let i = 1; i < grid.length; i++) {
    const newIndex = checkSmudges(grid, i);
    if (newIndex !== -1) return newIndex * 100;
  }

  for (let i = 1; i < grid[0].length; i++) {
    const newIndex = checkSmudges(rotateGrid(grid), i);
    if (newIndex !== -1) return newIndex;
  }

  throw new Error('Grid has no reflection.');
};

function part1(input: string) {
  return process(input)
    .map(findReflections)
    .reduce((a, b) => a + b);
}

function part2(input: string) {
  return process(input)
    .map(findReflectionsWithSmudges)
    .reduce((a, b) => a + b);
}

console.assert(part1(testData) === 405);
console.assert(part2(testData) === 400);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
