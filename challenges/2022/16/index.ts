import getInput from '../../../utils/getInput';

type Map = Record<string, {
  flow: number;
  on: boolean;
  tunnels: string[];
}>

type State = {
  map: Map;
  cursor: string;
  path?: string[];
  total: number;
}

const data = getInput('2022', '16');

const lineRe = /Valve (.+) has flow rate\=(\d+); tunnels? leads? to valves? (.+)/i
const parseData = (data: string) =>
  data.trim().split('\n').map((line, i) => {
    const result = lineRe.exec(line);

    if (result === null) throw new Error(`Bad input: ${line} at index ${i}`);


    const [, valve, flow, tunnels] = result;
    return {
      [valve]: {
        flow: Number.parseInt(flow, 10),
        on: false,
        tunnels: tunnels.split(', ')
      }
    }
  }).reduce((acc, curr) => Object.assign(acc, curr), {})

const getInitialValve = (data: string) =>
  lineRe.exec(data)![1];

function getPathTo(state: State, from: string, to: string, soFar: string[] = []): string {
  const queue = [...state.map[from].tunnels].filter(n => !soFar.includes(n));
  if (queue.includes(to)) return soFar.concat(to).join('-');
  if (queue.length === 0) return '';

  return queue.flatMap(n => getPathTo(state, n, to, [...soFar, from]))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .pop() as string;
}

const calculatePath = (state: State, turnsRemaining: number): string[] => {
  const seen = new Set<string>();
  const candidates: Record<string, number> = {};
  const queue = [...state.map[state.cursor].tunnels];
  let maxFlow = 0;

  while (queue.length > 0) {
    const valveAddress = queue.pop()!;
    const valve = state.map[valveAddress];
    if (seen.has(valveAddress) || valve.on || valve.flow === 0) continue;

    for (const v of valve.tunnels) {
      if (!seen.has(v)) queue.push(v);
    }
    seen.add(valveAddress);
    if (valve.flow >= maxFlow) {
      maxFlow = valve.flow;
      candidates[getPathTo(state, state.cursor, valveAddress)] = valve.flow;
    }
  }

  return Object.entries(candidates)
    .filter(([, f]) => f === maxFlow)
    .sort(([a], [b]) => b.length - a.length)
    .pop()![0]
    .split('-')
};

const iterate = (state: State, turnsRemaining: number): void => {
  const flowRate = Object.entries(state.map)
    .filter(([, { on }]) => on)
    .reduce((acc, [, { flow }]) => acc + flow, 0);
  state.total += flowRate;
  console.log(`\n== minute ${30 - turnsRemaining} == `)
  console.log(`releasing ${flowRate} pressure`)

  if (state.path === undefined) {
    state.path = calculatePath(state, turnsRemaining);
  }

  if (state.path.length === 0) {
    if (state.map[state.cursor].on === false) {
      console.log('You open valve ' + state.cursor);
      state.path === undefined;
      state.map[state.cursor].on = true;
    }
  } else {
    const [next, ...rest] = state.path;
    state.cursor = next;
    state.path = rest;
    console.log('You move to valve ' + next);
  }
}

function part1(data: string): number {
  const map = parseData(data);
  const state: State = {
    map,
    cursor: getInitialValve(data),
    path: [],
    total: 0,
  };

  let i = 30;
  while (i) {
    iterate(state, i);
    i -= 1;
  }

  return state.total;
}

function part2(data: unknown) {
  return 'N/A';
}

// console.log(`Solution 1: ${part1(data)}`);
// console.log(`Solution 2: ${part2(data)}`);

const testData = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

console.assert(part1(testData) === 1651)