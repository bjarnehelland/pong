import { Machine, assign } from "xstate";

export const gameMachine = Machine(
  {
    id: "game",
    initial: "setup",
    context: {
      player1: null,
      player2: null,
      score: [0, 0],
      history: [],
      startToServe: null,
      winner: null,
    },
    states: {
      setup: {
        on: {
          NEW_GAME: {
            target: "toServe",
            actions: ["setupGame"],
          },
        },
      },
      toServe: {
        on: {
          POINT: {
            target: "playing",
            actions: ["serveWon", "announceServe"],
          },
        },
      },
      playing: {
        always: {
          target: `winner`,
          cond: "hasWinner",
        },
        on: {
          POINT: {
            actions: ["point", "announcePoint"],
          },
          UNDO: {
            actions: ["undo"],
          },
        },
      },
      winner: {
        onEntry: ["winner", "announceWinner"],
        on: {
          NEW_GAME: {
            target: "setup",
            actions: "reset",
          },
          REMATCH: {
            target: "toServe",
            actions: "reset",
          },
        },
      },
    },
  },
  {
    actions: {
      setupGame: assign((_, event) => {
        return {
          player1: event.player1,
          player2: event.player2,
          score: [0, 0],
        };
      }),
      point: assign((context, event) => {
        const newScore = [
          context.score[0] + (event.player === "player1" ? 1 : 0),
          context.score[1] + (event.player === "player2" ? 1 : 0),
        ];
        return {
          score: newScore,
          history: [...context.history, newScore],
        };
      }),
      undo: assign((context) => {
        const newHistory = [...context.history];
        newHistory.pop();
        return {
          history: newHistory,
          score:
            newHistory.length === 0
              ? [0, 0]
              : newHistory[newHistory.length - 1],
        };
      }),
      reset: assign((context) => ({
        score: [0, 0],
        toServe: null,
        winner: null,
      })),
      winner: assign({
        winner: ({ score }) => (score[0] > score[1] ? "player1" : "player2"),
      }),
      log: (context, event) => {
        console.log(context, event);
      },
      serveWon: assign({
        startToServe: (_, event) => event.player,
      }),
      announceServe: (context) => {
        const announce = `${context[context.startToServe]} won the serve.`;
        speak(announce);
      },
      announcePoint: (context) => {
        const score = `${context.score[0]} ${context.score[1]}.`;

        let announce = score;

        if (!hasWinner(context.score)) {
          if (isMatchPoint(context.score)) {
            announce += "match point.";
          }

          const toServe = serve(context);
          announce += `${context[toServe]} to serve.`;
        }
        speak(announce);
      },
      announceWinner: (context) => {
        const announce = `${context[context.winner]} won the match.`;
        speak(announce);
      },
    },
    guards: {
      hasWinner: ({ score }) => hasWinner(score),
    },
  }
);

export function serve({ score, startToServe }) {
  const totalScore = score.reduce((total, s) => total + s, 0);

  const toServe = Math.floor((totalScore / 2) % 2)
    ? startToServe === "player1"
      ? "player2"
      : "player1"
    : startToServe;

  return toServe;
}

function hasWinner(score) {
  return (
    (score[0] >= 11 && score[0] - 1 > score[1]) ||
    (score[1] >= 11 && score[1] - 1 > score[0])
  );
}

function isMatchPoint(score) {
  return (
    (score[0] >= 10 && score[0] > score[1]) ||
    (score[1] >= 10 && score[1] > score[0])
  );
}

function speak(announce) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(announce));
}

function canSpeak() {
  return "speechSynthesis" in window;
}
