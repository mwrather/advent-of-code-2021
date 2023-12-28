import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/${year}/${day}/input.txt',
  'utf-8'
).trim();

const testData = ``;

function part1(input: string) {
  return 0;
}

function part2(input: string) {
  return 0;
}

console.assert(part1(testData) === 0);
console.assert(part2(testData) === 0);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
