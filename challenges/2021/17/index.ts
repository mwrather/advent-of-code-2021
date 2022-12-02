import getInput from '../../../utils/getInput';

const data = getInput('2021', '17');

const getTargetCoords = (data: string) => {
  const [, x1, x2, y1, y2] = /x\=(-?\d+)..(-?\d+).*y\=(-?\d+)..(-?\d+)/.exec(
    data
  )!;

  return [[x1, x2].map(Number).sort(), [y1, y2].map(Number).sort()].flat();
};

const hit = (target: number[], [x, y]: [number, number]) => {
  const [x1, x2, y1, y2] = target;
  return x1 <= x && x <= x2 && y1 <= y && y <= y2;
};

const fire = (
  target: number[],
  [vx, vy]: [number, number],
  [x, y]: [number, number] = [0, 0],
  steps: [number, number][] = []
): string | [boolean, number] => {
  steps.push([x, y]);

  if (hit(target, [x, y])) {
    return [true, Math.max(...steps.map((s) => s[1]))];
  }

  const [x1, x2, y1, y2] = target;
  if (y < y1 || x > x2 || (x < x1 && vx === 0)) return [false, NaN];

  return fire(target, [Math.max(vx - 1, 0), vy - 1], [x + vx, y + vy], steps);
};

const findHightestPoint = (target: number[], vy = 0, vxMin = 1) => {
  while (fire(target, [vxMin, vy])[0] === false) vxMin++;
  return fire(target, [vxMin + 1, 0]);
};

function part1(data: string) {
  return findHightestPoint(getTargetCoords(data));
}

function part2(data: unknown) {
  return 'N/A';
}

const testData = 'target area: x=20..30, y=-10..-5';

console.log(`Solution 1: ${part1(testData)}`);
console.log(`Solution 2: ${part2(data)}`);

new Map<[number, number], boolean | string>([
  [[7, 2], true],
  [[6, 3], true],
  [[9, 0], true],
  [[17, -4], false],
]).forEach((result, v) =>
  console.assert(
    result === fire(getTargetCoords(testData), v)[0],
    `Didn't get ${result} for ${v.join()}`
  )
);
