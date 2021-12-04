import getInput from '../../../utils/getInput';

const data: Array<number> = getInput('2021', '1').split('\n').map(Number);

const windowsOfThree: Array<number> = [];
for (let i = 0; i <= data.length - 3; i += 1) {
  windowsOfThree.push(data.slice(i, i + 3).reduce((acc, curr) => acc + curr));
}

const calculateIncreases = (data: Array<number>) =>
  data.reduce(
    (acc, curr, i, data) => (i > 0 && curr > data[i - 1] ? acc + 1 : acc),
    0
  );

const part1 = () => calculateIncreases(data);

const part2 = () => calculateIncreases(windowsOfThree);

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
