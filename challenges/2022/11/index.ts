import getInput from '../../../utils/getInput';

const data = getInput('2022', '11');

const getMonkeyRules = (data: string) => {
  return data.split('\n\n').map((s) => ({
    operation: (old: number): number =>
      eval(/Operation: new = (.*)/.exec(s)![1]),
    test: Number(/Test: divisible by (\d+)/.exec(s)![1]),
    ifTrue: Number(/If true: throw to monkey (\d+)/.exec(s)![1]),
    ifFalse: Number(/If false: throw to monkey (\d+)/.exec(s)![1]),
  }));
};

const getMonkeyItems = (data: string) =>
  data
    .split('\n\n')
    .map((s) => /Starting items: (.+)/.exec(s)![1].split(', ').map(Number));

const getIterator =
  (
    rules: ReturnType<typeof getMonkeyRules>,
    onConsider: (n: number) => void = () => { },
    relief: (n: number) => number = (n) => n
  ) =>
    (ns: number[][]) => {
      for (let i = 0; i < ns.length; i += 1) {
        const { operation, test, ifTrue, ifFalse } = rules[i];

        while (ns[i][0] !== undefined) {
          const n = ns[i].shift()!;
          onConsider(i);
          const newWorry = relief(operation(n));
          ns[newWorry % test === 0 ? ifTrue : ifFalse].push(newWorry);
        }
      }

      return ns;
    };

function part1(data: string) {
  let items = getMonkeyItems(data);
  const considered = items.map(() => 0);
  const iterator = getIterator(
    getMonkeyRules(data),
    (i: number) => {
      considered[i] += 1;
    },
    (n: number) => Math.floor(n / 3)
  );

  for (let j = 0; j < 20; j++) items = iterator(items);

  return considered
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

function part2(data: string) {
  const rules = getMonkeyRules(data);
  let items = getMonkeyItems(data);
  const considered = items.map(() => 0);
  const mod = rules.reduce<number>((acc, { test }) => acc * test, 1);

  const iterator = getIterator(
    rules,
    (i: number) => {
      considered[i] += 1;
    },
    n => n % mod
  );

  for (let j = 0; j < 10000; j++) items = iterator(items);

  return considered
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

console.assert(part1(testData) === 10605);
console.assert(part2(testData) === 2713310158);
