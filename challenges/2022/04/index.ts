import getInput from '../../../utils/getInput';

const data = getInput('2022', '04');

const rowRe = /(\d+)-(\d+),(\d+)-(\d+)/;
const getSections = (data: string): [number, number, number, number][] =>
  data.split('\n').map(
    (r) =>
      rowRe
        .exec(r)!
        .slice(1, 5)
        .map((s) => Number.parseInt(s)) as [number, number, number, number]
  );

function part1(data: string): number {
  return getSections(data).filter(
    ([x1, x2, y1, y2]) =>
      (x1 >= y1 && x1 <= y2 && x2 >= y1 && x2 <= y2) ||
      (y1 >= x1 && y1 <= x2 && y2 >= x1 && y2 <= x2)
  ).length;
}

function part2(data: string): number {
  return getSections(data).filter(([x1, x2, y1, y2]) => (
    (x1 >= y1 && x1 <= y2) || (x2 >= y1 && x2 <= y2) ||
    (y1 >= x1 && y1 <= x2) || (y2 >= x1 && y2 <= x2)
  )).length;
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

console.assert(part1(testData) === 2, 'Error in part 1');
console.assert(part2(testData) === 4, 'Error in part 2');
