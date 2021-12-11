import getInput from '../../../utils/getInput';

const data: number[][] = getInput('2021', '9')
  .trim()
  .split('\n')
  .map((row) => row.split('').map(Number));

const isLowPoint = (x: number, y: number) =>
  Math.min(
    ...[
      data[x + 1]?.[y],
      data[x - 1]?.[y],
      data[x]?.[y + 1],
      data[x]?.[y - 1],
    ].filter((v) => v !== undefined)
  ) > data[x][y];

const flood = (point: [number, number]) => {
  const queue: [number, number][] = [point];
  const visited: Set<string> = new Set();

  while (queue.length) {
    const [x, y] = queue.shift()!;

    if (
      visited.has(`${x},${y}`) ||
      data[x]?.[y] === undefined ||
      data[x][y] === 9
    ) {
      continue;
    }

    visited.add(`${x},${y}`);

    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }

  return visited.size;
};

function part1() {
  return data.reduce(
    (sum, row, x) =>
      sum +
      row.reduce((sum, col, y) => sum + (isLowPoint(x, y) ? col + 1 : 0), 0),
    0
  );
}

function part2() {
  return data
    .reduce<number[]>((acc, row, x) => {
      for (const [y] of row.entries()) {
        if (isLowPoint(x, y)) {
          acc.push(flood([x, y]));
        }
      }
      return acc;
    }, [])
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);
}

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
