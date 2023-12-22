import getInput from '../../../utils/getInput';

const data = getInput('2023', '9');

const testData = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const process = (input: string) =>
  input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((n) => Number.parseInt(n, 10))
    );

const getNextLine = (ns: number[]) => ns.slice(1).map((n, i) => n - ns[i]);

const getDeltas = (ns: number[]) => {
  const result: number[][] = [[...ns]];

  do {
    result.push(getNextLine(result[result.length - 1]));
  } while (!result[result.length - 1].every((n) => n === 0));

  return result;
};

const getNextTerm = (ns: number[]) =>
  getDeltas(ns).reduce<number>((acc, row) => acc + row[row.length - 1], 0);

const getPreviousTerm = (ns: number[]) =>
  getDeltas(ns)
    .reverse()
    .reduce<number>((acc, row) => row[0] - acc, 0);

function part1(input: string) {
  return process(input)
    .map(getNextTerm)
    .reduce((a, b) => a + b, 0);
}

function part2(input: string) {
  return process(input)
    .map(getPreviousTerm)
    .reduce((a, b) => a + b, 0);
}

console.assert(part1(testData) === 114);
console.assert(part2(testData) === 2);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
