import { readFileSync } from 'fs';

const data = readFileSync(
  'challenges/2023/15/input.txt',
  'utf-8'
).trim();

const testData = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const hash = (s: string) =>
  [...s].reduce((acc, curr) => ((acc + curr.charCodeAt(0)) * 17) % 256, 0)

type Lens = [string, number];
type Boxes = Array<Lens[]>

const adjustLens = (boxes: Boxes, instruction: string) => {
  const [lens] = /^[^=\-]+/.exec(instruction)!;
  const index = hash(lens);
  boxes[index] = boxes[index] ?? [];
  if (instruction[lens.length] === '=') {
    const existingIndex = boxes[index].findIndex(([l]) => l === lens);
    const newLens: Lens = [lens, Number(instruction.slice(lens.length + 1))];
    if (existingIndex !== -1)
      boxes[index][existingIndex] = newLens;
    else
      boxes[index].push(newLens);
  } else {
    boxes[index] = boxes[index].filter(([l]) => l !== lens)
  }

  return boxes;
}

function part1(input: string) {
  return input.split(',').map(hash).reduce((a, b) => a + b, 0)
}

function part2(input: string) {
  const boxes = input.split(',').reduce<Boxes>(adjustLens, [])
  const values = boxes.map((box, i) =>
    !box ? [0] : box.map(([, l], j) => (i + 1) * (j + 1) * l)
  ).flat().reduce((a, b) => a + b)

  return values;
}

console.assert(part1(testData) === 1320);
console.assert(part2(testData) === 145);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
