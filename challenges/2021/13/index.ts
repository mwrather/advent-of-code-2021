import getInput from '../../../utils/getInput';

type Point = { x: number; y: number };
type Axis = 'x' | 'y';

const getPointsAndInstructions = () => {
  const [coordStrings, instructionsStrings] = getInput('2021', '13')
    .trim()
    .split('\n\n');

  const points = coordStrings.split('\n').map((lineString) => {
    const [x, y] = lineString.split(',').map(Number);
    return { x, y };
  });

  const instructions = instructionsStrings.split('\n').map(
    (lineString) =>
      lineString
        .replace('fold along ', '')
        .split('=')
        .map((x) => Number(x) || x) as [Axis, number]
  );

  return [points, instructions] as [Point[], [Axis, number][]];
};

const fold = (points: Point[], [axis, value]: [Axis, number]) => {
  for (const point of points) {
    if (point[axis] < value) continue;

    point[axis] = point[axis] - 2 * (point[axis] - value);
  }

  return points; // may contian duplicates. who cares?
};

const visualize = (ps: Point[]): string => {
  const maxX = 1 + Math.max(...ps.map(({ x }) => x));
  const maxY = 1 + Math.max(...ps.map(({ y }) => y));

  const grid = Array.from({ length: maxY }, () =>
    Array.from({ length: maxX }, () => ' ')
  );

  for (const { x, y } of ps) {
    grid[y][x] = '#';
  }

  return grid.map((row) => row.join('')).join('\n');
};

const part1 = ([points, [instruction]]: [Point[], [Axis, number][]]) => {
  const result = new Set<string>();
  for (const { x, y } of fold(points, instruction)) {
    result.add(`${x},${y}`);
  }
  return result.size;
};

const part2 = ([points, instructions]: [Point[], [Axis, number][]]) =>
  visualize(instructions.reduce((ps, i) => fold(ps, i), points));

console.log(`Solution 1: ${part1(getPointsAndInstructions())}`);
console.log(`Solution 2:\n${part2(getPointsAndInstructions())}`);
