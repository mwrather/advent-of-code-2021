import getInput from '../../../utils/getInput';

type Pairs = Record<string, number>;
type Rules = Record<string, string>;

const [seq, rulesString] = getInput('2021', '14').split('\n\n');

const getPairs = ((seq) => {
  const pairs = {} as Pairs;
  for (let i = 0; i < seq.length; i++) {
    const pair = seq.slice(i, i + 2);
    pairs[pair] = (pairs[pair] ?? 0) + 1;
  }
  return () => pairs;
})(seq);

const rules: Rules = Object.fromEntries(
  rulesString.split('\n').map((line) => line.split(' -> '))
);

const permute = (pairs: Pairs, n: number): Pairs => {
  if (n === 0) return pairs;

  const result = Object.entries(pairs).reduce<Pairs>((acc, [pair, count]) => {
    const insert = rules[pair];

    if (!insert) {
      return Object.assign(acc, { [pair]: count });
    }

    acc[pair[0] + insert] = (acc[pair[0] + insert] ?? 0) + count;
    acc[insert + pair[1]] = (acc[insert + pair[1]] ?? 0) + count;

    return acc;
  }, {});

  return permute(result, n - 1);
};

const countElementsAndSubtract = (pairs: Pairs) => {
  const counts = Object.entries(pairs).reduce<Pairs>((acc, [pair, count]) => {
    acc[pair[0]] = (acc[pair[0]] ?? 0) + count;
    return acc;
  }, {});

  const elementCounts = Object.values(counts);

  return Math.max(...elementCounts) - Math.min(...elementCounts);
};

function part1() {
  return countElementsAndSubtract(permute(getPairs(), 10));
}

function part2() {
  return countElementsAndSubtract(permute(getPairs(), 40));
}

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
