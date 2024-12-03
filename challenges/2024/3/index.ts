import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2024/3/input.txt',
  'utf-8'
).trim();

const testData = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const testData2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const re = /mul\((\d+),(\d+)\)/dg
const process = (input: string) => {
  const output: [number, number][] = [];

  let result;
  while ((result = re.exec(input)) !== null) {
    output.push([+result[1], +result[2]]);
  }

  return output;
}

const removeInvalidInstructions = (input: string) =>
  input.trim()
    .replace(/\n/g, '')
    .replace(/don't\(\).*?do\(\)/g, '');

function part1(input: string) {
  return process(input).reduce(
    (acc, [a, b]) => acc + a * b,
    0
  );
}

function part2(input: string) {
  const valid = removeInvalidInstructions(input);
  return part1(valid);
}

console.assert(part1(testData) === 161);
console.assert(part2(testData2) === 48);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
