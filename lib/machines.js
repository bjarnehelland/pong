import { Machine, assign } from "xstate";

const setupGame = assign((_, event) => ({
  player1: {
    name: event.player1,
    score: 0,
  },
  player2: {
    name: event.player2,
    score: 0,
  },
}));

const serve = assign((context) => {
  const totalScore = context.player1.score + context.player2.score;
  const toServe =
    totalScore % 2 === 0
      ? context.toServe === "player1"
        ? "player2"
        : "player1"
      : context.toServe;
  return {
    toServe,
  };
});

const point = assign((context, event) => ({
  timeline: [
    ...context.timeline,
    { player: event.player, point: 1, timestamp: Date.now() },
  ],
  [event.player]: {
    ...context[event.player],
    score: context[event.player].score + 1,
  },
}));

const reset = assign((context) => ({
  player1: { ...context.player1, score: 0 },
  player2: { ...context.player2, score: 0 },
  toServe: null,
  winner: null,
}));

const winner = assign({
  winner: ({ player1, player2 }) =>
    player1.score > player2.score ? "player1" : "player2",
});

const log = (context, event) => {
  console.log(context, event);
};

const serveWon = assign({
  toServe: (_, event) => event.player,
});

const announceServe = (context) => {
  const announce = `${context[context.toServe].name} won the serve.`;
  speak(announce);
};

const announcePoint = (context) => {
  const score = `${context.player1.score} ${context.player2.score}.`;

  let announce = score;

  if (!hasWinner(context.player1, context.player2)) {
    if (isMatchPoint(context.player1, context.player2)) {
      announce += "match point.";
    }

    announce += `${context[context.toServe].name} to serve.`;
  }
  speak(announce);
};

const announceWinner = (context) => {
  const announce = `${context[context.winner].name} won the match.`;
  speak(announce);
};

function hasWinner(player1, player2) {
  return (
    (player1.score >= 11 && player1.score - 1 > player2.score) ||
    (player2.score >= 11 && player2.score - 1 > player1.score)
  );
}

function isMatchPoint(player1, player2) {
  return (
    (player1.score >= 10 && player1.score > player2.score) ||
    (player2.score >= 10 && player2.score > player1.score)
  );
}

const speak = (announce) => {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(announce));
};

const canSpeak = () => "speechSynthesis" in window;

const hasWinnerGuard = ({ player1, player2 }) => hasWinner(player1, player2);

export const gameMachine = Machine({
  id: "game",
  initial: "setup",
  context: {
    player1: { score: 0 },
    player2: { score: 0 },
    timeline: [],
    toServe: null,
    winner: null,
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
          actions: [serveWon, announceServe],
        },
      },
    },
    playing: {
      always: {
        target: "winner",
        cond: hasWinnerGuard,
      },
      on: {
        POINT: {
          actions: [point, serve, announcePoint],
        },
      },
    },
    winner: {
      onEntry: [winner, announceWinner],
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
