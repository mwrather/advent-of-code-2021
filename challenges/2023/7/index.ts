import getInput from '../../../utils/getInput';

const data = getInput('2023', '7').trim();

const testData = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const cards = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
].reverse(); // higher cards higher

const cardsWithJokers = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
].reverse(); // higher cards higher

type CardCounter = (hand: string) => number[];

const countCards: CardCounter = (hand: string) =>
  Object.values(
    [...hand].reduce<Record<string, number>>((acc, curr) => {
      acc[curr] = (acc[curr] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b - a);

const countCardsWithJokers: CardCounter = (hand: string) => {
  const map = [...hand]
    .filter((card) => card !== 'J')
    .reduce<Record<string, number>>((acc, curr) => {
      acc[curr] = (acc[curr] ?? 0) + 1;
      return acc;
    }, {});
  const values = Object.values(map).sort((a, b) => b - a);

  let jokers = [...hand].filter((card) => card === 'J').length;
  values[0] = (values[0] ?? 0) + jokers;

  return values;
};

const getScorer = (countCards: CardCounter) => (hand: string) => {
  const values = countCards(hand);

  if (values[0] === 5) return 6;
  if (values[0] === 4) return 5;
  if (values[0] === 3)
    if (values[1] === 2) return 4;
    else return 3;
  if (values[0] === 2)
    if (values[1] === 2) return 2;
    else return 1;

  return 0;
};

const compareHighCard = (cards: string[]) =>
  function recur(a: string, b: string): number {
    if (a === '' && b === '') return 0;
    if (a[0] !== b[0]) return cards.indexOf(a[0]) - cards.indexOf(b[0]);

    return recur(a.slice(1), b.slice(1));
  };

const compareHand = (cardCounter: CardCounter, cards: string[]) => {
  const scoreHand = getScorer(cardCounter);

  return (a: string, b: string) => {
    const scoreDiff = scoreHand(a) - scoreHand(b);
    return !!scoreDiff ? scoreDiff : compareHighCard(cards)(a, b);
  };
};

const process = (input: string) =>
  input
    .split('\n')
    .map(
      (line) =>
        line
          .split(/\s/)
          .map((entry, i) => (!i ? entry : Number.parseInt(entry, 10))) as [
          string,
          number
        ]
    );

function part1(input: string) {
  const comparator = compareHand(countCards, cards);
  const data = process(input).sort(([a], [b]) => comparator(a, b));

  return data.reduce<number>((acc, curr, i) => acc + curr[1] * (i + 1), 0);
}

function part2(input: string) {
  const comparator = compareHand(countCardsWithJokers, cardsWithJokers);
  const data = process(input).sort(([a], [b]) => comparator(a, b));

  return data.reduce<number>((acc, curr, i) => acc + curr[1] * (i + 1), 0);
}

console.assert(part1(testData) === 6440);
console.assert(part2(testData) === 5905);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
