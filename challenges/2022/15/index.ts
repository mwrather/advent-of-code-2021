import getInput from '../../../utils/getInput';

type Coords = [number, number];

const data = getInput('2022', '15');

const getCoordinates = (data: string) =>
  data.split('\n').map(
    (row) =>
      row.split(':').map((raw) => {
        const [, x, y] = /x=(-?\d+), y=(-?\d+)/.exec(raw)!;

        return [x, y].map(Number);
      }) as [Coords, Coords]
  );

const getCoverageInRow = (coordinates: [Coords, Coords][], row: number) => {
  const rowMembers = new Map<number, string>();

  for (const [[x1, y1], [x2, y2]] of coordinates) {
    const distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);

    if (y1 === row) rowMembers.set(x1, 'S');
    if (y2 === row) rowMembers.set(x2, 'B');

    for (let x = x1 - distance; x <= x1 + distance; x += 1) {
      if (
        !rowMembers.has(x) &&
        Math.abs(x1 - x) + Math.abs(y1 - row) <= distance
      ) {
        rowMembers.set(x, '#');
      }
    }
  }

  return rowMembers;
};

const getIsOutOfRange =
  (coordinates: [Coords, Coords][]) =>
    (x: number, y: number): boolean =>
      coordinates.every(
        ([[x1, y1], [x2, y2]]) =>
          // distance from the sensor to the point is greater than
          Math.abs(x1 - x) + Math.abs(y1 - y) >
          // distance from sensor to its closest beacon
          Math.abs(x2 - x1) + Math.abs(y2 - y1)
      );

function part1(data: string, rowNumber: number): number {
  const coordinates = getCoordinates(data);
  const coverage = getCoverageInRow(coordinates, rowNumber);

  return [...coverage.entries()].filter(([, v]) => v === '#').length;
}

function part2(data: string, max: number) {
  const coordinates = getCoordinates(data);
  const isOutOfRange = getIsOutOfRange(coordinates);

  for (const [[x1, y1], [x2, y2]] of coordinates) {
    const scanDistance = Math.abs(x2 - x1) + Math.abs(y2 - y1) + 1; // juuuust outside of range!

    // scan around the edge just beyond each sensor's range
    // @todo this may need a more robust approach
    for (let x = x1 - scanDistance; x <= x1 + scanDistance; x += 1) {
      const yRange = scanDistance - Math.abs(x1 - x);
      for (const y of [y1 + yRange, y1 - yRange]) { // just check the edges
        if ([x, y].every(n => n >= 0 && n <= max) && isOutOfRange(x, y)) {
          return x * 4000000 + y;
        }
      }
    }
  }

  return Infinity;
}

console.log(`Solution 1: ${part1(data, 2000000)}`);
console.log(`Solution 2: ${part2(data, 4000000)}`);

const testData = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

console.assert(part1(testData, 10) === 26);
console.assert(part2(testData, 20) === 56000011);
