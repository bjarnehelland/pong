import { useEffect } from "react";
import { gameMachine } from "../lib/machines";
import { useMachine } from "@xstate/react";
import { Setup } from "../components/setup";
import { Winner } from "../components/winner";
import { Board } from "../components/board";
import { Container } from "@/components/Container";
import { inspect } from "@xstate/inspect";

const isDev = process.env.NODE_ENV === "development";
if (typeof window !== "undefined" && isDev) {
  inspect({
    url: "https://statecharts.io/inspect",
    iframe: false,
  });
}
const validKeys = ["0", "1", "2"];

function serve({ history, startToServe }) {
  const totalScore = history.length;

  const toServe = Math.floor((totalScore / 2) % 2)
    ? startToServe === "player1"
      ? "player2"
      : "player1"
    : startToServe;

  return toServe;
}

export default function Home() {
  const [{ context, value }, sendMachine] = useMachine(gameMachine, {
    devTools: isDev,
  });
  const { player1, player2, score, winner } = context;
  const toServe = serve(context);
  useEffect(() => {
    function handleKeyboardEvent(e) {
      if (!validKeys.includes(e.key)) return;

      if (e.key === "1") {
        sendMachine("POINT", { player: "player1" });
      }
      if (e.key === "2") {
        sendMachine("POINT", { player: "player2" });
      }
      if (e.key === "0") {
        sendMachine("UNDO");
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [value]);
  return (
    <Container>
      {value === "setup" && (
        <Setup
          onSetup={({ player1, player2 }) =>
            sendMachine("NEW_GAME", { player1, player2 })
          }
        />
      )}
      {(value === "toServe" || value == "playing") && (
        <Board
          player1={player1}
          player2={player2}
          score={score}
          toServe={toServe}
          addPoint={(player) => sendMachine("POINT", { player })}
        />
      )}
      {value === "winner" && (
        <Winner
          name={winner === "player1" ? player1 : player2}
          rematch={() => sendMachine("REMATCH")}
          newGame={() => sendMachine("NEW_GAME")}
        />
      )}
    </Container>
  );
}
