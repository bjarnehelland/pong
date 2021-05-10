import { Machine, assign } from "xstate";

export const gameMachine = Machine(
  {
    id: "game",
    initial: "setup",
    context: {
      player1: { score: 0 },
      player2: { score: 0 },
      toServe: null,
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
            actions: ["point", "serve", "announcePoint"],
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
          player1: {
            name: event.player1,
            score: 0,
          },
          player2: {
            name: event.player2,
            score: 0,
          },
        };
      }),
      serve: assign((context) => {
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
      }),
      point: assign((context, event) => ({
        [event.player]: {
          ...context[event.player],
          score: context[event.player].score + 1,
        },
      })),
      reset: assign((context) => ({
        player1: { ...context.player1, score: 0 },
        player2: { ...context.player2, score: 0 },
        toServe: null,
        winner: null,
      })),
      winner: assign({
        winner: ({ player1, player2 }) =>
          player1.score > player2.score ? "player1" : "player2",
      }),
      log: (context, event) => {
        console.log(context, event);
      },
      serveWon: assign({
        toServe: (_, event) => event.player,
      }),
      announceServe: (context) => {
        const announce = `${context[context.toServe].name} won the serve.`;
        speak(announce);
      },
      announcePoint: (context) => {
        const score = `${context.player1.score} ${context.player2.score}.`;

        let announce = score;

        if (!hasWinner(context.player1, context.player2)) {
          if (isMatchPoint(context.player1, context.player2)) {
            announce += "match point.";
          }

          announce += `${context[context.toServe].name} to serve.`;
        }
        speak(announce);
      },
      announceWinner: (context) => {
        const announce = `${context[context.winner].name} won the match.`;
        speak(announce);
      },
    },
    guards: {
      hasWinner: ({ player1, player2 }) => hasWinner(player1, player2),
    },
  }
);

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

function speak(announce) {
  const canSpeak = "speechSynthesis" in window;
  if (!canSpeak) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(announce));
}
