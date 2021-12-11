import getInput from '../../../utils/getInput';

const data = getInput('2021', '7').trim().split(',').map(Number);
console.log(data);
const sum = (a: number, b: number) => a + b;
const range = (low: number, high: number) =>
  Array.from({ length: high - low + 1 }, (_, i) => low + i);

const calculateLinearFuel = (pos: number) =>
  data.map((c) => Math.abs(c - pos)).reduce(sum);

const calculateIncreasingFuel = (pos: number) =>
  data
    .map((c) => {
      const d = Math.abs(c - pos);
      return (d * (d + 1)) / 2; // sum of integers from 1 to d
    })
    .reduce(sum);

function part1(data: number[]) {
  return range(Math.min(...data), Math.max(...data))
    .map(calculateLinearFuel)
    .sort((a, b) => a - b)[0];
}

function part2(data: number[]) {
  return range(Math.min(...data), Math.max(...data))
    .map(calculateIncreasingFuel)
    .sort((a, b) => a - b)[0];
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
