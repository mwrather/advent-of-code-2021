import getInput from '../../../utils/getInput';

const data = getInput('2023', '5').trim();

const testData = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const process = (data: string): [number[], number[][][]] => {
  const [seeds, ...maps] = data.split('\n\n');

  return [
    seeds.replace(/^\D+/, '').split(' ').map(Number),
    maps.map((map) =>
      map
        .split('\n')
        .slice(1)
        .map((line) => line.split(' ').map(Number))
    ),
  ];
};

const evaluateSeeds = (maps: number[][][]) => (seed: number) =>
  maps.reduce<number>((value, map) => {
    for (const line of map) {
      const [output, input, range] = line;
      if (value >= input && value < input + range) {
        const diff = value - input;
        return output + diff;
      }
    }
    return value;
  }, seed);

const findSegment = (n: number, map: number[][]) =>
  map.find(
    ([, inputStart, inputLength]) =>
      n >= inputStart && n < inputStart + inputLength
  );

const evaluateRanges = (maps: number[][][], ranges: [number, number][]) =>
  maps.reduce<[number, number][]>(
    (ranges, map) =>
      ranges.flatMap(([start, end]) => {
        const mappedRanges: [number, number][] = [];

        while (start <= end) {
          const segment = findSegment(start, map);

          if (segment) {
            const [outputStart, inputStart, inputLength] = segment;
            const inputEnd = inputStart + inputLength - 1;
            const shift = outputStart - inputStart;

            const rangeEnd = Math.min(end, inputEnd);

            mappedRanges.push([start + shift, rangeEnd + shift]);
            start = rangeEnd + 1;
          } else {
            let cursor = start + 1;
            while (cursor <= end && findSegment(cursor + 1, map) === undefined)
              cursor++;

            mappedRanges.push([start, cursor - 1]);
            start = cursor;
          }
        }
        return mappedRanges;
      }),
    ranges
  );

function part1(data: string) {
  const [seeds, maps] = process(data);
  const results = seeds.map(evaluateSeeds(maps));
  return Math.min(...results);
}

// very slow
function part2(data: string) {
  const [seedRangesRaw, maps] = process(data);
  const seedRanges: [number, number][] = [];
  for (let i = 0; i < seedRangesRaw.length; i += 2) {
    const [start, length] = seedRangesRaw.slice(i, i + 2);
    seedRanges.push([start, start + length - 1]);
  }

  const mappedRanges = evaluateRanges(maps, seedRanges);

  return Math.min(...mappedRanges.map(([n]) => n));
}

console.assert(part1(testData) === 35);
console.assert(part2(testData) === 46);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
