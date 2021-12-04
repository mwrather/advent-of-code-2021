import getInput from '../../../utils/getInput';

const data = getInput('2021', '2').split('\n');

const part1 = () => {
  const position = data.reduce<[number, number]>(
    (acc, curr) => {
      const [cmd, n] = curr.split(' ').map((x) => Number(x) || x) as [
        string,
        number
      ];

      switch (cmd) {
        case 'forward':
          acc[0] += n;
          break;
        case 'up':
          acc[1] -= n;
          break;
        case 'down':
          acc[1] += n;
          break;
      }

      return acc;
    },
    [0, 0]
  );

  return position[0] * position[1];
};

const part2 = () => {
  const positionAndAim = data.reduce<[number, number, number]>(
    (acc, curr) => {
      const [cmd, n] = curr.split(' ').map((x) => Number(x) || x) as [
        string,
        number
      ];

      switch (cmd) {
        case 'forward':
          acc[0] += n;
          acc[1] += acc[2] * n;
          break;
        case 'up':
          acc[2] -= n;
          break;
        case 'down':
          acc[2] += n;
          break;
      }

      return acc;
    },
    [0, 0, 0]
  );

  return positionAndAim[0] * positionAndAim[1];
};

console.log(`Solution 1: ${part1()}`);
console.log(`Solution 2: ${part2()}`);
