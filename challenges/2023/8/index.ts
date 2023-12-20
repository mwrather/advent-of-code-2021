import getInput from '../../../utils/getInput';

const data = getInput('2023', '8').trim();

const testData = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const testData2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const process = (input: string): [string, Record<string, [string, string]>] => {
  const [instructions, rawMap] = input.split('\n\n');
  const map = Object.fromEntries(
    rawMap
      .split('\n')
      .map<[string, [string, string]]>((line) => [
        line.substring(0, 3),
        [line.substring(7, 10), line.substring(12, 15)],
      ])
  );
  return [instructions, map];
};

function part1(data: string) {
  const [instructions, map] = process(data);
  let steps = 0;
  let location = 'AAA';

  while (location !== 'ZZZ') {
    location =
      map[location][
        instructions[steps++ % instructions.length] === 'L' ? 0 : 1
      ];
  }

  return steps;
}

function part2(data: string) {
  const [instructions, map] = process(data);
  return Object.keys(map)
    .filter((loc) => loc.slice(-1) === 'A')
    .map<number>((loc) => {
      let steps = 0;
      while (loc.slice(-1) !== 'Z') {
        loc =
          map[loc][instructions[steps++ % instructions.length] === 'L' ? 0 : 1];
      }

      return steps;
    })
    .reduce<number>((acc, curr) => {
      let hcf = 1;

      for (let i = 2; i <= acc && i <= curr; i++)
        if (acc % i === 0 && curr % i === 0) hcf = i;

      return (acc * curr) / hcf;
    }, 1);
}

console.assert(part1(testData) === 2);
console.assert(part2(testData2) === 6);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
