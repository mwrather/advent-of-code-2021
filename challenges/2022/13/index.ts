import getInput from '../../../utils/getInput';

const data = getInput('2022', '13');

type List = (number | number[])[];

const parse = (data: string): [List, List][] =>
  data
    .split('\n\n')
    .map((pair) => pair.split('\n').map((s) => JSON.parse(s)) as [List, List]);

function compare(l: any, r: any): boolean | undefined {
  if (typeof l === 'number' && typeof r === 'number')
    return l === r ? undefined : l < r;

  if (Array.isArray(l) !== Array.isArray(r))
    return compare(([] as List).concat(l), ([] as List).concat(r));

  for (let i = 0; i < Math.max(l.length, r.length); i++) {
    if (l[i] === undefined) return true;
    if (r[i] === undefined) return false;
    const result = compare(l[i], r[i]);
    if (result !== undefined) return result;
  }

  return undefined;
}

function part1(data: string): number {
  return parse(data).reduce<number>(
    (acc, [left, right], i) => (compare(left, right) ? acc + (i + 1) : acc),
    0
  );
}

const PACKET_1 = '[[2]]';
const PACKET_2 = '[[6]]';

function part2(data: string) {
  const packets = data
    .replaceAll('\n\n', '\n')
    .split('\n')
    .concat([PACKET_1, PACKET_2])
    .sort((a, b) => (compare(JSON.parse(a), JSON.parse(b)) ? -1 : 1));

  return (packets.indexOf(PACKET_1) + 1) * (packets.indexOf(PACKET_2) + 1);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

console.assert(part1(testData) === 13);
console.assert(part2(testData) === 140);
