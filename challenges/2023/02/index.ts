import * as R from 'ramda';

import getInput from '../../../utils/getInput';
import { match } from 'assert';

const data = getInput('2023', '02');

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green;`

const process = (input: string) => {
  return input.split('\n').map((line) => {
    const matchResult = line.match(/^Game (\d+): (.*);?$/)

    if (matchResult === null) {
      throw new Error("Couldn't parse input");
    }

    return matchResult.slice(1,3);
  });
}

//
function part1(data: string) {
  return process(data).filter(([, results]) => {
    const reds = results.match(/\d+(?= red)/g);
    const greens = results.match(/\d+(?= green)/g);
    const blues = results.match(/\d+(?= blue)/g);


    return reds?.every(r => +r <= 12) && greens?.every(g => +g <= 13) && blues?.every(b => +b <= 14);
  })
  .reduce<number>((acc, [index]) => acc + +index, 0);
}

function part2(data: string) {
  return process(data).map(([, results]) =>
    [
      results.match(/\d+(?= red)/g)?.map(Number) as number[],
      results.match(/\d+(?= green)/g)?.map(Number) as number[],
      results.match(/\d+(?= blue)/g)?.map(Number) as number[]
    ].map<number>(ns => Math.max(...ns)))
    .map(ns => ns.reduce((acc, curr) => acc * curr, 1))
  .reduce<number>((acc, n) => acc + n, 0);
}

console.assert(part1(testInput) === 8);
console.assert(part2(testInput) === 2286);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
