import getInput from '../../../utils/getInput';

const data = getInput('2023', '12').trim();

const testData = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const process = (input: string) =>
  input.split('\n').map((line) => {
    const [data, runs] = line.split(' ');
    return [data, runs.split(',').map(Number)] as [string, number[]];
  });

const processQuintuple = (input: string) =>
  input.split('\n').map((line) => {
    const [data, runs] = line.split(' ');
    return [
      Array(5).fill(data).join('?'),
      Array(5).fill(runs).join(',').split(',').map(Number),
    ] as [string, number[]];
  });

function trimStart(s: string) {
  return s.startsWith('.')
    ? s
        .split(/(?<=\.)(?=[^.])/)
        .slice(1)
        .join('')
    : s;
}

const cache: Record<string, number> = {};
function findCombinations([row, runs]: [string, number[]]): number {
  const key = row + runs.join();
  if (cache[key]) return cache[key];

  if (runs.length <= 0) return Number(!row.includes('#'));

  // if we don't have enough row left
  if (row.length - runs.reduce((a, b) => a + b, 0) - runs.length + 1 < 0)
    return 0;

  const damagedOrUnknown = !row.slice(0, runs[0]).includes('.');
  if (row.length === runs[0]) return Number(damagedOrUnknown);

  return (cache[key] =
    (row[0] !== '#' ? findCombinations([trimStart(row.slice(1)), runs]) : 0) +
    (damagedOrUnknown && row[runs[0]] !== '#'
      ? findCombinations([trimStart(row.slice(runs[0] + 1)), runs.slice(1)])
      : 0));
}

function part1(input: string) {
  return process(input)
    .map(findCombinations)
    .reduce<number>((a, b) => a + b, 0);
}

function part2(input: string) {
  return processQuintuple(input)
    .map(findCombinations)
    .reduce<number>((a, b) => a + b, 0);
}

console.assert(part1(testData) === 21);
console.assert(part2(testData) === 525152);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
