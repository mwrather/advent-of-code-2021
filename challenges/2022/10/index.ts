import getInput from '../../../utils/getInput';

const data = getInput('2022', '10');



const flattenInstructions = (s: string) =>
  s
    .split('\n')
    .flatMap((i) => (i === 'noop' ? 0 : [0, Number(i.split(' ')[1])]));

const interpret = (ns: number[]) =>
  ns.reduce(
    (acc, curr) => {
      const { length, [length - 1]: last } = acc;
      return acc.concat(last + curr);
    },
    [1]
  );

const draw = (s: number[]): string =>
  Array.from({ length: 240 }, (_, i) =>
    Math.abs(s[i] - (i % 40)) <= 1 ? '#' : '.'
  ).reduce<string>(
    (acc, curr, i) => acc + (i % 40 === 0 ? '\n' : '') + curr,
    ''
  );

function part1(data: string) {
  const registers = interpret(flattenInstructions(data));
  return [20, 60, 100, 140, 180, 220].reduce<number>(
    (acc, i) => acc + i * registers[i - 1],
    0
  );
}

function part2(data: string): string {
  return draw(interpret(flattenInstructions(data)));
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

console.assert(part1(testData) === 13140);
console.assert(
  part2(testData) ===
  `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`
);
