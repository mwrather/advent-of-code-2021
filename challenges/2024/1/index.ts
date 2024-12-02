import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2024/1/input.txt',
  'utf-8'
).trim();

const testData = `3   4
4   3
2   5
1   3
3   9
3   3`;

const processInput = (input: string) =>
  input
    .trim()
      .split('\n')
      .reduce<[number[], number[]]>((acc, curr) => {
        const [a, b] = curr.replace(/\s+/g, ' ').split(' ');

        acc[0].push(+a);
        acc[1].push(+b);

        return acc;
      }, [[], []]);

const diffLists = ([l1, l2]: [number[], number[]]) =>
  l1.map((n, i) => Math.abs(n - l2[i]));

const mapFrequencies = (ns: number[]) =>
  ns.reduce<Record<string, number>>((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {});

function part1(input: string) {
  const ls = processInput(input)
    .map(ns => ns.sort()) as [number[], number[]];
  const diffs = diffLists(ls);
  const sum = diffs.reduce((a, b) => a + b, 0);

  return sum;
}

function part2(input: string) {
  const [l1, l2] = processInput(input);
  const l2Frequencies = mapFrequencies(l2);
  const similarity = l1.reduce<number>(
    (acc, curr) => acc + curr * (l2Frequencies[curr] ?? 0),
    0
  );

  return similarity;
}

console.assert(part1(testData) === 11);
console.assert(part2(testData) === 31);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
