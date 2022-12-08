import getInput from '../../../utils/getInput';

const data = getInput('2022', '08');

const calculateVisiblity = (data: string): boolean[][] => {
  const numbers = data.split('\n').map((r) => r.split('').map(Number));

  const visibility = numbers.map((row, i, rows) =>
    row.map(
      (n, j) =>
        i === 0 ||
        j === 0 ||
        i === rows.length - 1 ||
        j === row.length - 1 ||
        row.slice(0, j).every((h) => h < n) ||
        row.slice(j + 1).every((h) => h < n) ||
        rows
          .map((r) => r[j])
          .slice(0, i)
          .every((h) => h < n) ||
        rows
          .map((r) => r[j])
          .slice(i + 1)
          .every((h) => h < n)
    )
  );

  return visibility;
};

const calculateViewScore = (data: string): number[][] => {
  const numbers = data.split('\n').map((r) => r.split('').map(Number));

  const takeUntilGte = (n: number) => (xs: number[]) => {
    const result: number[] = [];
    for (const x of xs) {
      result.push(x);
      if (x >= n) break;
    }
    return result;
  };

  return numbers.map((row, i, rows) =>
    row.map((n, j) => {
      const col = rows.map((r) => r[j]);
      const getVisibilityInDirection = takeUntilGte(n);

      return [
        row.slice(0, j).reverse(),
        row.slice(j + 1),
        col.slice(0, i).reverse(),
        col.slice(i + 1),
      ]
        .map(getVisibilityInDirection)
        .reduce<number>((acc, curr) => acc * curr.length, 1);
    })
  );
};

function part1(data: string): number {
  return calculateVisiblity(data)
    .flatMap((x) => x)
    .filter(Boolean).length;
}

function part2(data: string) {
  return calculateViewScore(data)
    .flatMap((x) => x)
    .reduce<number>((a, b) => Math.max(a, b), -Infinity);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `30373
25512
65332
33549
35390`;

console.assert(part1(testData) === 21);
console.assert(part2(testData) === 8);
