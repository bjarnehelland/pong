import { useEffect } from "react";
import { gameMachine, gameModel, serve } from "../lib/machines";
import { useMachine } from "@xstate/react";
import { Winner } from "../components/winner";
import { Board } from "../components/board";
import { Container } from "@/components/Container";
import { put } from "utils/fetch";
import { useRouter } from "next/router";
import { connectToDatabase } from "utils/mongodb";
import { GetServerSideProps } from "next";
const validKeys = ["0", "1", "2"];
function useKeyboard(sendMachine: any) {
  useEffect(() => {
    function handleKeyboardEvent(e: KeyboardEvent) {
      if (!validKeys.includes(e.key)) return;

      if (e.key === "1") {
        sendMachine(gameModel.events.POINT("player1"));
      }
      if (e.key === "2") {
        sendMachine(gameModel.events.POINT("player2"));
      }
      if (e.key === "0") {
        sendMachine(gameModel.events.UNDO());
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [sendMachine]);
}

type Props = any;

export default function Match(props: Props) {
  const router = useRouter();
  const [state, sendMachine] = useMachine(gameMachine, {
    context: props,
    value: props.value,
  });

  const { context, value } = state;
  const { player1, player2, score, winner } = context;
  const toServe = serve(context);

  useKeyboard(sendMachine);

  useEffect(() => {
    const id = router.query.matchId as string;
    put(`api/match/${id}`, { ...context, value });
  }, [context, router.query.matchId, value]);

  return (
    <Container>
      {(value === "toServe" || value == "playing") && (
        <Board
          player1={player1}
          player2={player2}
          score={score}
          toServe={toServe}
          addPoint={(player: string) =>
            sendMachine(gameModel.events.POINT(player))
          }
        />
      )}
      {value === "winner" && (
        <Winner
          name={winner === "player1" ? player1 : player2}
          rematch={() => router.push("/")}
          newGame={() => router.push("/")}
        />
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.matchId;
  const { db } = await connectToDatabase();
  const data = await db.collection("matches").findOne({ _id: id });

  return {
    props: data,
  };
};
