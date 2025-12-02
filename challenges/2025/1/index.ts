import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2025/1/input.txt',
  'utf-8'
).trim().split('\n')
  .map(line => line.trim())
  .map(line => {
    const sign = line[0] === 'R' ? 1 : -1;
    return sign * Number(line.slice(1))
  });

function part1(input: number[]) {
  const [, zeroes] = input.reduce(([position, zeroes], curr) => {
    const newPosition = position + curr;
    return [newPosition, newPosition % 100 === 0 ? zeroes + 1 : zeroes]
  }, [50, 0]);

  return zeroes;
}

function part2(input: number[]) {
  // brute force!
  return part1(data.flatMap(n =>
    Array(Math.abs(n)).fill(n > 0 ? 1 : -1)
  ));
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
