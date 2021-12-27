import getInput from '../../../utils/getInput';

type Coordinate = [number, number];
type Grid = number[][];

const getData = (): Grid =>
  getInput('2021', '11')
    .trim()
    .split('\n')
    .map((rowText) => rowText.split('').map(Number));

const ADJACENT_CELLS: Coordinate[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function* getAdjacentCells([y, x]: Coordinate, data: Grid) {
  for (const [dy, dx] of ADJACENT_CELLS) {
    const [ny, nx] = [y + dy, x + dx];
    if (data[ny]?.[nx]) {
      yield [ny, nx];
    }
  }
}

const step = (data: Grid) => {
  const flashed = new Set<string>();
  const serialize = ([a, b]: Coordinate) => `${a},${b}`;

  // increase all grid cells by 1
  for (const y in data) {
    for (const x in data[y]) {
      data[y][x] += 1;
    }
  }

  // while there are still cells to flash, flash them and increase their neighbors
  let flashesRemaining = true;
  while (flashesRemaining) {
    data.forEach((row, y) =>
      row.forEach((n, x) => {
        if (n > 9 && !flashed.has(serialize([y, x]))) {
          flashed.add(serialize([y, x]));
          for (const [ny, nx] of getAdjacentCells([y, x], data)) {
            data[ny][nx] += 1;
          }
        }
      })
    );

    flashesRemaining = data.some((row, y) =>
      row.some((n, x) => n > 9 && !flashed.has(serialize([y, x])))
    );
  }

  for (const coords of flashed) {
    const [y, x] = coords.split(',').map(Number);
    data[y][x] = 0;
  }

  return flashed.size;
};

function part1(data: Grid) {
  let result = 0;
  for (let i = 0; i < 100; i++) {
    result += step(data);
  }
  return result;
}

function part2(data: Grid) {
  let steps = 1;
  const everyone = data.length * data[0].length;
  while (step(data) < everyone) {
    steps++;
  }
  return steps;
}

console.log(`Solution 1: ${part1(getData())}`);
console.log(`Solution 2: ${part2(getData())}`);
