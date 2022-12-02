import getInput from '../../../utils/getInput';

const data = getInput('2022', '02');

type ElfMove = 'A' | 'B' | 'C';
type YouMove = 'X' | 'Y' | 'Z';


const moves = {
  elf: ['A', 'B', 'C'] as ElfMove[],
  you: ['X', 'Y', 'Z'] as YouMove[],
}

function getIndices([elf, you]: [ElfMove, YouMove]): [number, number] {
  return [
    moves.elf.indexOf(elf),
    moves.you.indexOf(you)
  ]
}

function scoreRound([elfMove, youMove]: [number, number]) {
  const draw = elfMove === youMove;
  const win = (youMove - elfMove === 1) || (elfMove - youMove === 2);

  return (youMove + 1) + (draw ? 3 : (win ? 6 : 0));
}

/**
 * Transform from a tuple of elfMove and outcome [lose, draw, win]
 * to a touple of elfMove & yourMove
 */
function transformIndices([elfMove, desiredOutcome]: [number, number]): [number, number] {
  if (desiredOutcome === 0) // lose
    return [elfMove, (elfMove + 2) % 3];

  if (desiredOutcome === 2) // win
    return [elfMove, (elfMove + 1) % 3];

  return [elfMove, elfMove]
}

function part1(data: string) {
  return data.trim().split('\n')
    .map(r => r.split(' ') as [ElfMove, YouMove])
    .map(getIndices)
    .map(scoreRound)
    .reduce((acc, curr) => acc + curr, 0)
}

function part2(data: string) {
  return data.trim().split('\n')
    .map(r => r.split(' ') as [ElfMove, YouMove])
    .map(getIndices)
    .map(transformIndices)
    .map(scoreRound)
    .reduce((acc, curr) => acc + curr, 0);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

console.assert(part1('A Y\nB X\nC Z') === 15, 'part 1 is not correct');
console.assert(part2('A Y\nB X\nC Z') === 12, 'part 2 is not correct');
