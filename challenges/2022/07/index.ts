import getInput from '../../../utils/getInput';

const data = getInput('2022', '07');

function calculateSizes(
  cmds: string[],
): Record<string, number> {
  let currentPath: string[] = [];
  const sizes: Record<string, number> = { '/': 0 };

  for (const cmd of cmds) {
    // `$ ls` is a no-op
    if (cmd === '$ cd /') currentPath = []
    else if (cmd === '$ cd ..') currentPath.pop();
    else if (cmd.startsWith('$ cd ')) currentPath.push(cmd.slice(5));
    else if (cmd.startsWith('dir ')) {
      const cwd = `/${currentPath.concat(cmd.slice(4)).join('/')}`
      sizes[cwd] = 0;
    }
    else if (/^\d+/.test(cmd)) {
      const [, size] = /^(\d+)/.exec(cmd)!;

      for (let i = 0; i <= currentPath.length; i += 1) {
        const cwd = `/${currentPath.slice(0, currentPath.length - i).join('/')}`
        sizes[cwd] += Number.parseInt(size, 10);
      }
    }
  }

  return sizes;
}

function part1(data: string): number {
  const sizes = calculateSizes(data.split('\n'));
  return Object.values(sizes)
    .filter(s => s <= 100000)
    .reduce<number>((acc, n) => acc + n, 0);
}

function part2(data: string): number {
  const sizes = calculateSizes(data.split('\n'));
  const target = 30000000 - (70000000 - sizes['/']);

  return Object.values(sizes).filter(n => n >= target).sort((a, b) => b - a).pop()!;
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

const testData = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

console.assert(part1(testData) === 95437);
console.assert(part2(testData) === 24933642);
