import getInput from '../../../utils/getInput';

type Opener = '(' | '{' | '[' | '<';
type Closer = ')' | '}' | ']' | '>';

const openers: Opener[] = ['(', '{', '[', '<'];
const closers: Record<Opener, Closer> = {
  '(': ')',
  '{': '}',
  '[': ']',
  '<': '>',
};
const invalidPoints: Record<Closer, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const autoCompletePoints: Record<Closer, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const data = getInput('2021', '10')
  .trim()
  .split('\n')
  .map((row) => row.split('')) as Array<Opener | Closer>[];

const isOpener = (char: string): char is Opener =>
  openers.includes(char as Opener);

const findIllegalCharacter = (
  row: Array<Opener | Closer>
): Closer | Array<Opener> => {
  const stack: Array<Opener> = [];
  for (const char of row) {
    if (isOpener(char)) {
      stack.push(char);
    } else {
      const expected = closers[stack.pop() as Opener];
      if (char !== expected) {
        return char as Closer;
      }
    }
  }
  return stack;
};

function part1() {
  return data
    .map(findIllegalCharacter)
    .filter((result) => !Array.isArray(result))
    .reduce<number>((sum, char) => sum + invalidPoints[char as Closer], 0);
}

function part2() {
  const results = data
    .map(findIllegalCharacter)
    .filter((result): result is Array<Opener> => Array.isArray(result))
    .map((stack) =>
      stack
        .reverse()
        .map((char) => autoCompletePoints[closers[char]])
        .reduce((sum, points) => sum * 5 + points, 0)
    )
    .sort((a, b) => a - b);

  return results[Math.floor(results.length / 2)];
}

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
