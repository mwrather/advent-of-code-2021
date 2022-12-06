import getInput from '../../../utils/getInput';

const data = getInput('2022', '06');

const detectUniqueSubstring = (size: number, s: string): number => {
  for (let i = size; i < s.length; i += 1) {
    const substring = s.slice(i - size, i);
    if (new Set([...substring]).size === size) return i;
  }
  return 0;
}

function part1(data: string): number {
  return detectUniqueSubstring(4, data);
}

function part2(data: string): number {
  return detectUniqueSubstring(14, data);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

console.assert(part1('mjqjpqmgbljsphdztnvjfqwrcgsmlb') === 7);
console.assert(part2('mjqjpqmgbljsphdztnvjfqwrcgsmlb') === 19);
