import { readFileSync } from 'fs';
import { add, countBy, memoizeWith } from 'ramda';

const data = readFileSync(
  'challenges/2025/2/input.txt',
  'utf-8'
).trim();

const process = (input: string) =>
  input.split(',')
    .map<[number, number]>(s => s.split('-').map(Number) as [number, number])
    .flatMap(([low, high]) => Array.from({ length: (high - low) + 1 },
      (_, i) => low + i
    ))


const testData = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

const isInvalidInputPart1 = (n: number) => {
  const s = n.toString();
  return s.length % 2 === 0 && s.slice(0, s.length / 2) === s.slice(s.length / 2);
}

function part1(input: string) {
  return process(input).filter(isInvalidInputPart1).reduce(add, 0)
}

// every invalid input will be a rotation of itself
const isInvalidInputPart2 = (n: number) => {
  const s = n.toString();
  for (let i = 1; i < s.length; i += 1) {
    const candidate = s.slice(i) + s.slice(0, i);
    if (candidate === s) return true;
  }
  return false
}

function part2(input: string) {
  return process(input)
    .filter(isInvalidInputPart2).reduce(add, 0);
}

console.assert(part1(testData) === 1227775554);
console.assert(part2(testData) === 4174379265);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
