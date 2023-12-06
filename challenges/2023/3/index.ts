import getInput from '../../../utils/getInput';

const data = getInput('2023', '3');

const testData = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const process = (data: string) => data.trim().split('\n');
const isDigit = (char: string) => /^\d$/.test(char);

type Number = {
  row: number;
  start: number;
  end: number;
  value: number;
};

type Coordinate = [number, number];

const getNumbers = (data: string[]) => {
  const numbers: Number[] = [];

  for (let y = 0; y < data.length; y += 1) {
    for (let x = 0; x < data.length; x += 1) {
      if (isDigit(data[y][x])) {
        const start = x;
        const digits: string[] = [];

        while (
          data[y][x] !== undefined &&
          isDigit(data[y][x]) &&
          x < data[y].length
        ) {
          digits.push(data[y][x]);
          x += 1;
        }

        numbers.push({
          row: y,
          start,
          end: x - 1,
          value: Number.parseInt(digits.join(''), 10),
        });
      }
    }
  }

  return numbers;
};

const isAdjacentToSymbol = (n: Number, data: string[]) =>
  data
    .slice(Math.max(0, n.row - 1), Math.min(n.row + 2, data.length))
    .map((row: string) =>
      row.slice(Math.max(n.start - 1, 0), Math.min(n.end + 2, row.length - 1))
    )
    .join('')
    .replace(/\.|\d/g, '').length > 0;

const getGears = (rows: string[]) => {
  const stars: Coordinate[] = [];

  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows.length; x += 1) {
      if (rows[y][x] === '*') {
        stars.push([y, x]);
      }
    }
  }

  return stars.reduce<Coordinate[]>((acc, star) => {
    const neighborRows = getNeighbors(star, rows).map((row) =>
      row.map((n) => getCharAtNeighbors(n, rows)).join('')
    );

    if (
      neighborRows.filter((row) => /\d/.test(row)).length > 1 ||
      neighborRows.some((row) => /^\d\D\d$/.test(row))
    ) {
      acc.push(star);
    }

    return acc;
  }, []);
};

const getNeighbors = ([y, x]: Coordinate, rows: string[]) =>
  [
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
    [
      [0, -1],
      [0, 0], // include the point itself to make a easier
      [0, 1],
    ],
    [
      [1, -1],
      [1, 0],
      [1, 1],
    ],
  ].map((row) =>
    row
      .map<Coordinate>(([dy, dx]) => [y + dy, x + dx] as Coordinate)
      .filter(
        ([y, x]) => y >= 0 && x >= 0 && y < rows.length && x < rows[0].length
      )
  ) as Coordinate[][];

const getCharAtNeighbors = ([y, x]: Coordinate, rows: string[]) => rows[y][x];

const getGearRatio = ([y, x]: Coordinate, rows: string[]) => {
  const numbers: number[] = [];
  const [minY, maxY, minX, maxX] = [
    Math.max(y - 1, 0),
    Math.min(y + 1, rows.length - 1),
    Math.max(x - 1, 0),
    Math.min(x + 1, rows[0].length - 1),
  ];

  for (let i = minY; i <= maxY; i++) {
    for (let j = minX; j <= maxX; j++) {
      if (/\d/.test(rows[i][j])) {
        numbers.push(getNumberAt([i, j], rows));
        while (/\d/.test(rows[i][j + 1])) j += 1;
      }
    }
  }

  if (numbers.length < 2) {
    console.assert(
      numbers.length === 2,
      `Gear at [${y}, ${x}] has neighbors ${getNeighbors([y, x], rows)
        .map((row) => row.map((n) => getCharAtNeighbors(n, rows)).join(''))
        .join('')} and numbers ${numbers}`
    );
  }

  return numbers[0] * numbers[1];
};

const getNumberAt = ([y, x]: Coordinate, rows: string[]) => {
  let start = x;
  let end = x;

  while (/\d/.test(rows[y][start - 1])) start--;
  while (/\d/.test(rows[y][end])) end++;

  return Number.parseInt(rows[y].substring(start, end), 10);
};

function part1(data: string) {
  const rows = process(data);
  const numbers = getNumbers(rows);
  return numbers
    .filter((n) => isAdjacentToSymbol(n, rows))
    .reduce<number>((acc, { value }) => acc + value, 0);
}

function part2(data: string) {
  const rows = process(data);
  const gears = getGears(rows);

  return gears
    .map((gear) => getGearRatio(gear, rows))
    .reduce((acc, curr) => acc + curr, 0);
}

console.assert(part1(testData) === 4361);
console.assert(part2(testData) === 467835);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
