import getInput from '../../../utils/getInput';

const data = getInput('2022', '05');

type Stacks = Record<number, string[]>
type Move = [number, number, number]

function processData(data: string): [Stacks, Move[]] {
  const [stackText, moveText] = data.split('\n\n');
  const stacks: Stacks = {};

  const stackRows = stackText.split('\n').reverse().slice(1);
  for (let i = 1; i < stackRows[0].length; i += 4) {
    const index = (i + 3) / 4;
    stacks[index] = stacks[index] || [];

    for (const row of stackRows) {
      if (row[i] !== ' ') stacks[index].push(row[i]);
    }
  }

  const movesRe = /move\s(\d+)\sfrom\s(\d+)\sto\s(\d+)/
  const moves: Move[] = moveText.split('\n')
    .map(r => {
      const [, a, b, c] = movesRe.exec(r)!;

      return [a, b, c].map(n => Number.parseInt(n)) as [number, number, number]
    })

  return [stacks, moves];
}

function reduceOneAtATime(stacks: Stacks, moves: Move[]) {
  for (const [reps, from, to] of moves) {
    for (let i = 0; i < reps; i += 1) {
      stacks[to].push(stacks[from].pop()!);
    }
  }
  return stacks;
}

function reduceInGroups(stacks: Stacks, moves: Move[]) {
  for (const [num, from, to] of moves) {
    stacks[to] = stacks[to].concat(stacks[from].slice(-num));
    stacks[from] = stacks[from].slice(0, -num);
  }
  return stacks;
}

const getTops = (stacks: Stacks): string => {
  let result = '';
  let i = 1;
  while (stacks[i]) {
    result += stacks[i].pop() ?? '';
    i += 1;
  }

  return result;
}

function part1(data: string) {
  return getTops(reduceOneAtATime(...processData(data)));
}

function part2(data: string) {
  return getTops(reduceInGroups(...processData(data)));
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

console.assert(part1(testData) === 'CMZ', 'error in part 1')
console.assert(part2(testData) === 'MCD', 'error in part 2')