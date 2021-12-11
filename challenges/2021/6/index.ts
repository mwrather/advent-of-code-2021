import getInput from '../../../utils/getInput';

const data = getInput('2021', '6')
  .trim()
  .split(',')
  .reduce(
    (acc, age) => ((acc[Number(age)] += 1), acc),
    Array<number>(9).fill(0)
  );

const add = (a: number, b: number) => a + b;

const permute = (buckets: number[], days: number) => {
  for (let i = 0; i < days; i++) {
    buckets[8] = buckets.shift() as number;
    buckets[6] += buckets[8];
  }
  return buckets;
};

function part1(data: number[]) {
  return permute(Array.from(data), 80).reduce(add);
}

function part2(data: number[]) {
  return permute(Array.from(data), 256).reduce(add);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
