import getInput from '../../../utils/getInput';

const data = getInput('2022', '01');

const add = (a: number, b: number) => a + b;

const getCalories = (data: string) =>
  data.trim().split('\n\n').map(
    row => row.split('\n').map(n => Number.parseInt(n))
      .reduce(add, 0)
  );

const part1 = (data: string) =>
  Math.max(...getCalories(data));

const part2 = (data: string) =>
  getCalories(data).sort((b, a) => a - b).slice(0, 3).reduce(add, 0);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
