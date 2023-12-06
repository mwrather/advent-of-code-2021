import getInput from '../../../utils/getInput';

const data = getInput('2023', '01');

const testInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const testInputTwo = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const processInput = (data: string): string[] =>
  data.trim().split('\n');

const getFirstAndLastDigit = (data:string) => {
  const digits = data.replace(/\D/g, '');
  return Number.parseInt(
    digits[0] + digits[digits.length - 1]
  );
}

function part1(data: string) {
  return processInput(data)
    .map(getFirstAndLastDigit)
    .reduce((a, b) => a + b, 0);
}

const digitMap: Record<string, string> = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9'
}

const convertTextDigits = (line: string): string => {
  for (let i = 0; i < line.length; i++) {
    for (const digit of Object.keys(digitMap)) {
      if (line.substring(i).startsWith(digit)) {
        // insert the digit AFTER the first letter of the word,
        // so that overlapping digits like oneight become o1ne8ight
        line = line.substring(0, i + 1) + digitMap[digit] + line.substring(i + 1);
      }
    }
  }

  return line;
}

function part2(data: string) {
  return processInput(data)
    .map(convertTextDigits)
    .map(getFirstAndLastDigit)
    .reduce((a, b) => a + b, 0);
}

console.assert(part1(testInput) === 142);
console.assert(part2(testInputTwo) === 281);

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);
