import { Machine, assign } from "xstate";

const setupGame = assign((_, event) => {
  return {
    player1: event.player1,
    player2: event.player2,
  };
});

const point = assign((context, event) => {
  const newHistory = [
    ...context.history,
    { point: event.player, timestamp: Date.now() },
  ];
  return {
    score: calculateScore(newHistory),
    history: newHistory,
  };
});

const undo = assign((context) => {
  const newHistory = [...context.history];
  newHistory.pop();
  return {
    score: calculateScore(newHistory),
    history: newHistory,
  };
});

const calculateScore = (history) =>
  history.reduce(
    (acc, item) => {
      if (item.point === "player1") return [acc[0] + 1, acc[1]];
      if (item.point === "player2") return [acc[0], acc[1] + 1];
    },
    [0, 0]
  );

const reset = assign(() => ({
  score: [0, 0],
  history: [],
  startToServe: null,
  winner: null,
}));

const winner = assign({
  winner: ({ history }) => {
    const score = calculateScore(history);
    return score[0] > score[1] ? "player1" : "player2";
  },
});

const serveWon = assign({
  startToServe: (_, event) => event.player,
});

const hasWinner = ({ score, pointsToWin }) =>
  (score[0] >= pointsToWin && score[0] - 1 > score[1]) ||
  (score[1] >= pointsToWin && score[1] - 1 > score[0]);

const gameStarted = assign({
  gameStarted: () => Date.now(),
});

export const gameMachine = Machine({
  id: "game",
  initial: "setup",
  context: {
    player1: null,
    player2: null,
    score: [0, 0],
    history: [],
    startToServe: null,
    winner: null,
    pointsToWin: 4,
    gameStarted: null,
  },
  states: {
    setup: {
      on: {
        NEW_GAME: {
          target: "toServe",
          actions: [setupGame],
        },
      },
    },
    toServe: {
      on: {
        POINT: {
          target: "playing",
          actions: [serveWon],
        },
      },
    },
    playing: {
      entry: [gameStarted],
      always: {
        target: `winner`,
        cond: hasWinner,
      },
      on: {
        POINT: {
          actions: [point],
        },
        UNDO: {
          actions: [undo],
        },
      },
    },
    winner: {
      onEntry: [winner],
      on: {
        NEW_GAME: {
          target: "setup",
          actions: reset,
        },
        REMATCH: {
          target: "toServe",
          actions: reset,
        },
      },
    },
  },
});
