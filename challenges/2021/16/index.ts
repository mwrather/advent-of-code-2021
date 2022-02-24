import getInput from '../../../utils/getInput';

type Packet = {
  type: number;
  version: number;
  data: Array<Packet | number>;
};

const data = getInput('2021', '16').trim();

const hexToBinary = (n: string) =>
  n
    .split('')
    .map((hex) => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
const getVersion = (data: string) => Number.parseInt(data.substring(0, 3), 2);
const getType = (data: string) => Number.parseInt(data.substring(3, 6), 2);
const padPacketLength = (n: number) => Math.ceil(n / 8) * 8;
const padPacketData = (data: string) =>
  data + '0'.repeat(padPacketLength(data.length) - data.length);

function parse(input: string): Packet {
  const type = getType(input);
  const version = getVersion(input);
  const packetLength = padPacketLength(getPacketLength(input));

  let packet: Packet['data'];
  if (type === 4) {
    packet = getLiteralValue(input.substring(0, packetLength));
  } else if (input[6] === '0') {
    packet = getValuesByLength(input.substring(0, packetLength));
  } else {
    packet = getValuesByNumber(input.substring(0, packetLength));
  }

  const data =
    packetLength === input.length
      ? packet
      : packet.concat(parse(input.substring(packetLength)));

  return {
    type,
    version,
    data,
  };
}

function getPacketLength(data: string): number {
  const type = getType(data);
  data = data.substring(6); // remove version and type

  if (type === 4) {
    let packetLength = 5;
    while (data[packetLength - 5] !== '0') {
      packetLength += 5;
    }

    return 6 + packetLength;
  }

  const lengthType = data[0];
  if (lengthType === '0') {
    const packetLength = Number.parseInt(data.substring(1, 16), 2);
    return 6 + 16 + packetLength;
  }

  if (lengthType === '1') {
    const numberOfItems = Number.parseInt(data.substring(1, 12), 2);
    let packetLength = 0;
    for (let i = 0; i < numberOfItems; i++) {
      const remainingSubItems = data.substring(12 + packetLength);
      const nextPacketLength = getPacketLength(remainingSubItems);
      packetLength += nextPacketLength;
    }
    return 6 + 12 + packetLength;
  }

  return NaN;
}

function getLiteralValue(data: string): [number] {
  data = data.substring(6);
  let result = '';

  for (let i = 0; i < data.length; i += 5) {
    result += data.substring(i + 1, i + 5);
    if (data[i] === '0') break;
  }

  return [Number.parseInt(result, 2)];
}

function getValuesByLength(data: string): Packet['data'] {
  const length = Number.parseInt(data.substring(7, 22), 2);
  let remainingData = data.substring(22, 22 + length);
  let subPackets: string[] = [];

  while (remainingData.length > 0) {
    const nextPacketLength = getPacketLength(remainingData);
    subPackets.push(remainingData.substring(0, nextPacketLength));
    remainingData = remainingData.substring(nextPacketLength);
  }

  return subPackets.map((p) => parse(padPacketData(p)));
}

function getValuesByNumber(data: string): Packet['data'] {
  let n = Number.parseInt(data.substring(7, 18), 2);
  let remainingData = data.substring(18);
  let subPackets: string[] = [];

  while (n--) {
    let nextPacketLength = getPacketLength(remainingData);
    subPackets.push(remainingData.substring(0, nextPacketLength));
    remainingData = remainingData.substring(nextPacketLength);
  }

  return subPackets.map((p) => parse(padPacketData(p)));
}

function sumVersions(tree: Packet): number {
  return (
    tree.version +
    tree.data.reduce<number>(
      (acc, curr) => (typeof curr === 'number' ? acc : acc + sumVersions(curr)),
      0
    )
  );
}

function calculate(tree: Packet | number): number {
  if (typeof tree === 'number') return tree;

  switch (tree.type) {
    case 4: // literal value
      return tree.data[0] as number;

    // arithmetic
    case 0:
      return tree.data.reduce<number>((acc, curr) => acc + calculate(curr), 0);
    case 1:
      return tree.data.reduce<number>((acc, curr) => acc * calculate(curr), 1);

    // max/min
    case 2:
      return Math.min(...tree.data.map(calculate));
    case 3:
      return Math.max(...tree.data.map(calculate));

    // logic
    case 5:
      return calculate(tree.data[0]) > calculate(tree.data[1]) ? 1 : 0;
    case 6:
      return calculate(tree.data[0]) < calculate(tree.data[1]) ? 1 : 0;
    case 7:
      return calculate(tree.data[0]) === calculate(tree.data[1]) ? 1 : 0;
  }

  return NaN;
}

function part1(data: string) {
  const tree = parse(hexToBinary(data));
  return sumVersions(tree);
}

function part2(data: string) {
  const tree = parse(hexToBinary(data));
  return calculate(tree);
}

console.log(`Solution 1: ${part1(data)}`);
console.log(`Solution 2: ${part2(data)}`);

for (const [input, result] of Object.entries({
  '8A004A801A8002F478': 16,
  '620080001611562C8802118E34': 12,
  C0015000016115A2E0802F182340: 23,
  A0016C880162017C3686B18A3D4780: 31,
})) {
  console.assert(
    sumVersions(parse(hexToBinary(input))) === result,
    `Versions of ${input} did not sum to ${result}`
  );
}

for (const [input, result] of Object.entries({
  C200B40A82: 3,
  '04005AC33890': 54,
  '880086C3E88112': 7,
  CE00C43D881120: 9,
  D8005AC2A8F0: 1,
  F600BC2D8F: 0,
  '9C005AC2F8F0': 0,
  '9C0141080250320F1802104A08': 1,
})) {
  console.assert(
    calculate(parse(hexToBinary(input))) === result,
    `${input} did not calculate as ${result}`
  );
}
