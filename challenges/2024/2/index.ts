import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2024/2/input.txt',
  'utf-8'
).trim();

const testData = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const process = (input: string) => input
  .trim()
  .split('\n')
  .map((row: string) => row.split(/\s+/).map(s => Number.parseInt(s, 10)));

const calculateDiffs = (row: number[]) => {
  const diffs = [];

  for (let i = 1; i < row.length; i += 1) {
    diffs.push(row[i] - row[i-1]);
  }

  return diffs;
}

const rowIsSafe = (diffs: number[]) =>
  diffs.every(n => n > 0 && n < 4) ||
  diffs.every(n => n < 0 && n > -4);

function rowIsSafeWithRemoval (ns: number[], index = 0): boolean {
  if (index === ns.length) return false;

  const nsWithRemoval = [...ns.slice(0, index), ...ns.slice(index + 1)];

  return rowIsSafe(calculateDiffs(nsWithRemoval)) || rowIsSafeWithRemoval(ns, index + 1);
}

function part1(input: string) {
  const rows = process(input);
  const diffs = rows.map(calculateDiffs);
  const safeRows = diffs.map(rowIsSafe).filter(Boolean);

  return safeRows.length;
}

function part2(input: string) {
  const rows = process(input);
  const safeRows = rows
    .map((row) => rowIsSafe(calculateDiffs(row)) || rowIsSafeWithRemoval(row))
    .filter(Boolean);

    return safeRows.length;
}

console.assert(part1(testData) === 2);
console.assert(part2(testData) === 4);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
