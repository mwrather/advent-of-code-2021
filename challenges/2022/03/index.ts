import getInput from '../../../utils/getInput';

const data = getInput('2022', '03');

const getPriority = (s: string): number => {
  if (/^[a-z]$/.test(s)) return s.charCodeAt(0) - 96;
  if (/^[A-Z]$/.test(s)) return s.charCodeAt(0) - 38;
  return 0;
};

function part1(data: string): number {
  return data
    .split('\n')
    .map((r) => [r.slice(0, r.length / 2), r.slice(r.length / 2)])
    .map(
      ([first, second]) => [...second].find((c) => first.includes(c)) as string
    )
    .reduce<number>((acc, curr) => acc + getPriority(curr), 0);
}

function part2(data: string): number {
  const sacks = data.split('\n');
  const badges: string[] = [];

  for (let i = 2; i < sacks.length; i += 3) {
    badges.push(
      [...sacks[i]].find(
        (c) => sacks[i - 1].includes(c) && sacks[i - 2].includes(c)
      ) as string
    );
  }

  return badges.reduce<number>((acc, curr) => acc + getPriority(curr), 0);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

console.assert(part1(testData) === 157, 'Error in part 1');
console.assert(part2(testData) === 70, 'Error in part 2');
