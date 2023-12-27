import getInput from '../../../utils/getInput';

const data = getInput('2023', '11').trim();

const testData = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const process = (input: string) =>
  input.split('\n').map((row) => row.split(''));

const getScoringMap = (map: string[][], expansionFactor: number) => {
  const scoringMap: number[][] = Array.from(map, (row) =>
    Array.from(row, () => (row.every((c) => c === '.') ? expansionFactor : 1))
  );

  for (let i = 0; i < map[0].length; i++) {
    if (map.map((row) => row[i]).some((c) => c !== '.')) continue;

    for (const row of scoringMap) {
      row[i] *= expansionFactor;
    }
  }

  return scoringMap;
};

const getGalaxyCoordinates = (input: string[][]) => {
  const coords = new Map<number, [number, number]>();
  let cursor = 1;
  input.forEach((row, i) =>
    row.forEach((char, j) => {
      if (char === '#') coords.set(cursor++, [i, j]);
    })
  );

  return coords;
};

const getDistancesFromScoringMap = (
  scoringMap: number[][],
  coords: Map<number, [number, number]>
) =>
  [...coords.keys()]
    .reduce<[number, number][]>((acc, curr, i, arr) => {
      for (const pair of arr.slice(i + 1)) acc.push([curr, pair]);
      return acc;
    }, [])
    .map<number>(([a, b]) => {
      const [ay, ax] = coords.get(a)!;
      const [by, bx] = coords.get(b)!;
      let distance = 0;

      const startY = ay < by ? ay : by;
      const endY = ay < by ? by : ay;
      const startX = ax < bx ? ax : bx;
      const endX = ax < bx ? bx : ax;

      for (let i = startY; i < endY; i++) distance += scoringMap[i + 1][startX];
      for (let i = startX; i < endX; i++) distance += scoringMap[endY][i + 1];

      return distance;
    });

function part1(input: string) {
  const startingMap = process(input);
  const scoringMap = getScoringMap(startingMap, 2);
  const coords = getGalaxyCoordinates(startingMap);

  return getDistancesFromScoringMap(scoringMap, coords).reduce((a, b) => a + b);
}

function part2(input: string, expansionFactor = 1000000) {
  const startingMap = process(input);
  const scoringMap = getScoringMap(startingMap, expansionFactor);
  const coords = getGalaxyCoordinates(startingMap);

  return getDistancesFromScoringMap(scoringMap, coords).reduce((a, b) => a + b);
}

console.assert(part1(testData) === 374);
console.assert(part2(testData, 10) === 1030);
console.assert(part2(testData, 100) === 8410);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
