import getInput from '../../../utils/getInput';

const data = getInput('2023', '6').trim();

const testData = `Time:      7  15   30
Distance:  9  40  200`;

const processPart1 = (input: string) => {
  const [times, distances] = input
    .split('\n')
    .map((line) => line.replace(/^\D+/, '').split(/\s+/).map(Number));

  return times.map((t, i) => [t, distances[i]] as [number, number]);
};

const processPart2 = (input: string) =>
  input
    .split('\n')
    .map((line) => line.replace(/\D+/g, ''))
    .map(Number) as [number, number];

const numberOfWaysToWin = ([time, distance]: [number, number]) =>
  Array.from(
    { length: time },
    (_, i) => (i + 1) * (time - i - 1) > distance
  ).filter(Boolean).length;

function part1(input: string) {
  return processPart1(input)
    .map(numberOfWaysToWin)
    .reduce<number>((acc, curr) => acc * curr, 1);
}

function part2(input: string) {
  return numberOfWaysToWin(processPart2(input));
}

console.assert(part1(testData) === 288);
console.assert(part2(testData) === 71503);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
