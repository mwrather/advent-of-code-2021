import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2025/6/input.txt',
  'utf-8'
).trim();

type OpString = '*' | '+'
type OpFn = (a: number, b: number) => number
const reducers: Record<OpString, OpFn> = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b
}

const testData = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;

const process = (data: string): [number[][], OpString[]] => {
  const rows = data.trim().split('\n').map(
    line => line.trim().split(/\s+/)
  )

  const cols: number[][] = [];
  for (let i = 0; i < rows[0].length; i += 1) {
    const colNums: number[] = [];
    for (let j = 0; j < rows.length - 1; j += 1) {
      colNums.push(Number(rows[j][i]));
    }
    cols.push(colNums);
  }

  const ops = rows[rows.length - 1] as OpString[]
  return [cols, ops]
}

function part1(input: string): number {
  const [cols, ops] = process(input);

  return cols.map((ns, i) => ns.reduce(reducers[ops[i]]))
    .reduce((acc, curr) => acc + curr);

}


const processPartTwo = (data: string): [number[][], OpString[]] => {
  const rows = data.trim().split('\n');
  const rawNums = rows.slice(0, rows.length - 1);
  const ops = rows[rows.length - 1].split(/\s+/) as OpString[];

  const separators = [0];
  for (let i = 1; i < rawNums[0].length; i += 1) {
    const digitsAtIndex = rows.map(row => row[i]);
    if (digitsAtIndex.every(char => char === ' ')) {
      separators.push(i + 1)
    }
  }

  const nums: number[][] = separators.map((start, i) => {
    const raw = rawNums.map(row => row.slice(start, separators[i + 1]))
    const cols = raw[0].split('').map((_, i) => raw.map(
      row => row[i]).join('')).map(s => s.replace(/\s+/, '')
    )

    return cols.filter(Boolean).map(Number);
  })

  return [nums, ops]
}

function part2(input: string) {
  const [nums, ops] = processPartTwo(input);

  return nums.map((ns, i) =>
    ns.reduce (reducers[ops[i]])
  ).reduce((acc, curr) => acc + curr, 0)
}

console.assert(part1(testData) === 4277556);
console.assert(part2(testData) === 3263827);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
