import getInput from '../../../utils/getInput';

const [calls, ...boards] = getInput('2021', '4')
  .split('\n\n')
  .map((row, i) =>
    i === 0
      ? // calls
        row.split(',')
      : // boards
        row
          .split('\n')
          .map((nums) => nums.split(' ').filter((cell) => cell !== ''))
          .filter((row) => row.length !== 0)
  ) as [string[], ...string[][][]];

console.log(`Solution 1: ${part1(calls, boards)}`);
console.log(`Solution 2: ${part2(calls, boards)}`);

function markBoards(boards: string[][][], call: string): string[][][] {
  return boards.map((board) =>
    board.map((row) => row.map((cell) => (cell === call ? 'X' : cell)))
  );
}

function isWinner(board: string[][]) {
  if (board.some((row) => row.every((cell) => cell === 'X'))) {
    return true;
  }
  for (const i in board[0]) {
    if (board.map((row) => row[i]).every((cell) => cell === 'X')) {
      return true;
    }
  }
  return false;
}

function findWinner(boards: string[][][]): string[][] | undefined {
  for (const i in boards) {
    if (isWinner(boards[i])) return boards[i];
  }
}

function calculateScore(winningBoard: string[][], call: number) {
  return (
    call *
    winningBoard
      .flat()
      .filter((cell) => cell !== 'X')
      .map(Number)
      .reduce((a, b) => a + b)
  );
}

function part1(calls: string[], boards: string[][][]) {
  for (const call of calls) {
    boards = markBoards(boards, call);
    const winner = findWinner(boards);
    if (winner !== undefined) {
      return calculateScore(winner, Number(call));
    }
  }
}

function part2(calls: string[], boards: string[][][]) {
  for (const i in calls) {
    boards = markBoards(boards, calls[i]);
    if (boards.length > 1) {
      boards = boards.filter((board) => !isWinner(board));
    }

    if (boards.length === 1 && isWinner(boards[0])) {
      return calculateScore(boards[0], Number(calls[i]));
    }
  }
}
