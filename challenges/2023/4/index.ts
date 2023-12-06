import getInput from '../../../utils/getInput';

const data = getInput('2023', '4');

const testData = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const process = (data: string) =>
  data
    .trim()
    .split('\n')
    .map((line) =>
      line
        .replace(/^card\s+\d+:\s+/i, '')
        .split(' | ')
        .map((ns) =>
          ns
            .trim()
            .split(/\s+/)
            .map((n) => Number.parseInt(n, 10))
        )
    ) as [number[], number[]][];

const getWinningNumbers = ([key, entries]: [number[], number[]]) =>
  ((keySet) => entries.filter((n) => keySet.has(n)))(new Set(key));

const scoreCards = (winningNumbers: number[]) =>
  winningNumbers.length === 0 ? 0 : Math.pow(2, winningNumbers.length - 1);

function part1(data: string) {
  return process(data)
    .map((card) => getWinningNumbers(card))
    .map((k) => scoreCards(k))
    .reduce((acc, curr) => acc + curr, 0);
}

function part2(data: string) {
  const cards = process(data).map((card) => [
    1,
    getWinningNumbers(card).length,
  ]);

  for (let i = 0; i < cards.length; i++) {
    const [copies, winningNumbers] = cards[i];
    if (winningNumbers === 0) continue;

    for (let j = i + 1; j < cards.length && j <= i + winningNumbers; j++) {
      cards[j][0] += copies;
    }
  }

  return cards.map(([n]) => n).reduce((acc, curr) => acc + curr, 0);
}

console.assert(part1(testData) === 13);
console.assert(part2(testData) === 30);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
