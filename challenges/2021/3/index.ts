import getInput from '../../../utils/getInput';

const data = getInput('2021', '3').split('\n');
console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

function part1(data: string[]) {
  let mostCommon = '';
  let leastCommon = '';

  for (let digitIndex = 0; digitIndex < data[0].length; digitIndex++) {
    const count = bitCount(data, digitIndex);
    if (count[0] > count[1]) {
      mostCommon += '0';
      leastCommon += '1';
    } else {
      mostCommon += '1';
      leastCommon += '0';
    }
  }
  return Number.parseInt(mostCommon, 2) * Number.parseInt(leastCommon, 2);
}

function part2(data: string[]) {
  const oxygen = calculateRating(data, ([zeros, ones]) =>
    zeros > ones ? '0' : '1'
  );

  const co2 = calculateRating(data, ([zeros, ones]) =>
    zeros > ones ? '1' : '0'
  );

  return oxygen * co2;
}

function bitCount(arr: string[], index: number) {
  return arr
    .map((row) => Number(row[index]))
    .reduce<[number, number]>(
      (acc, curr) => {
        acc[curr]++;
        return acc;
      },
      [0, 0]
    );
}

function calculateRating(
  arr: string[],
  getMatch: (count: [number, number]) => string,
  index = 0
): number {
  if (arr.length === 1) {
    return Number.parseInt(arr[0], 2);
  }

  if (index >= arr[0].length) {
    throw new Error('out of bounds!');
  }

  const count = bitCount(arr, index);
  const match = getMatch(count);
  const filteredArr = arr.filter((n) => n[index] === match);
  return calculateRating(filteredArr, getMatch, index + 1);
}
