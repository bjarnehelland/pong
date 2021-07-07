import { createMachine } from "xstate";
import { createModel, ModelContextFrom } from "xstate/lib/model";

export const gameModel = createModel(
  {
    player1: null as string | null,
    player2: null as string | null,
    score: [0, 0] as [number, number],
    history: [] as Array<[number, number]>,
    startToServe: null as string | null,
    winner: null as string | null,
  },
  {
    events: {
      POINT: (player: string) => ({ player }),
      UNDO: () => ({}),
    },
  }
);

export const gameMachine = createMachine<typeof gameModel>({
  id: "game",
  initial: "toServe",
  context: gameModel.initialContext,
  states: {
    toServe: {
      on: {
        POINT: {
          target: "playing",
          actions: gameModel.assign({
            startToServe: (_, e) => e.player,
          }),
        },
      },
    },
    playing: {
      always: {
        target: `winner`,
        cond: ({ score }) =>
          (score[0] >= 11 && score[0] - 1 > score[1]) ||
          (score[1] >= 11 && score[1] - 1 > score[0]),
      },
      on: {
        POINT: {
          actions: gameModel.assign((context, event) => {
            const newScore: [number, number] = [
              context.score[0] + (event.player === "player1" ? 1 : 0),
              context.score[1] + (event.player === "player2" ? 1 : 0),
            ];
            return {
              score: newScore,
              history: [...context.history, newScore],
            };
          }),
        },
        UNDO: {
          actions: gameModel.assign((context) => {
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
        },
      },
    },
    winner: {
      // onEntry: gameModel.assign({
      //   winner: ({ score }) => (score[0] > score[1] ? "player1" : "player2"),
      // }),
    },
  },
});

export function serve({
  score,
  startToServe,
}: ModelContextFrom<typeof gameModel>) {
  const totalScore = score.reduce((total, s) => total + s, 0);

  const toServe = Math.floor((totalScore / 2) % 2)
    ? startToServe === "player1"
      ? "player2"
      : "player1"
    : startToServe;

  return toServe;
}
