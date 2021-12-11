import getInput from '../../../utils/getInput';

const data: [string[], string[]][] = getInput('2021', '8')
  .trim()
  .split('\n')
  .map(
    (line) =>
      line.split(' | ').map((inputs) =>
        inputs
          .trim()
          .split(' ')
          .map((s) => s.split('').sort().join(''))
      ) as [string[], string[]]
  );

function part1() {
  return data
    .map(([, outputs]) => outputs)
    .flat()
    .map((s) => s.length)
    .filter((l) => [2, 3, 4, 7].includes(l)).length;
}

const countSegments = (inputs: string[]): Record<string, number> =>
  Object.entries(
    inputs.reduce<Record<string, number>>((acc, input) => {
      input.split('').forEach((char) => (acc[char] = (acc[char] || 0) + 1));
      return acc;
    }, {})
  ).reduce<Record<string, number>>((acc, [char, count]) => {
    if (count !== 7 && count !== 8) acc[char] = count;
    return acc;
  }, {});

const normalSegments = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg',
];
const normalSegmentCount = countSegments(normalSegments);

const getMappingFunction = (inputs: string[]) => {
  const map: Record<string, number> = {};

  let sevenSegments: string[];

  for (const [i, input] of [...inputs.entries()]) {
    switch (input.length) {
      case 2:
        map[input] = 1;
        break;
      case 3:
        map[input] = 7;
        sevenSegments = input.split('');
        break;
      case 4:
        map[input] = 4;
        break;
      case 7:
        map[input] = 8;
        break;
      default:
        break;
    }
  }

  const segmentMap: Record<string, string> = {};
  for (const [seg, count] of Object.entries(countSegments(inputs))) {
    for (const result in normalSegmentCount) {
      if (count === normalSegmentCount[result]) {
        segmentMap[seg] = result;
      }
    }
  }

  inputs
    .filter(({ length }) => ![2, 3, 4, 7].includes(length))
    .forEach((input) => {
      const partiallyDecoded = input
        .split('')
        .map((char) => segmentMap[char]?.toUpperCase() || char)
        .sort()
        .join('');

      if (partiallyDecoded.startsWith('E')) {
        map[input] = 2;
      } else if (partiallyDecoded.startsWith('F')) {
        map[input] = 3;
      } else if (partiallyDecoded.startsWith('BF')) {
        if (input.length === 6) {
          map[input] = 9;
        } else if (input.length === 5) {
          map[input] = 5;
        }
      } else if (
        sevenSegments.filter((seg) => input.includes(seg)).length === 3
      ) {
        map[input] = 0;
      } else {
        map[input] = 6;
      }
    });
  return (screwyInput: string) => map[screwyInput] ?? '?';
};

function part2() {
  return data
    .map(([inputs, outputs]) =>
      Number(outputs.map(getMappingFunction(inputs)).join(''))
    )
    .reduce((a, b) => a + b);
}

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
