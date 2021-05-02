import Head from "next/head";
import { useEffect } from "react";
import { gameMachine } from "../lib/machines";
import { useMachine } from "@xstate/react";
import { Setup } from "../components/setup";
import { Winner } from "../components/winner";
import { Board } from "../components/board";

const validKeys = ["0", "1", "2"];

export default function Home() {
  const [
    {
      context: { player1, player2, toServe, winner },
      value,
    },
    sendMachine,
  ] = useMachine(gameMachine);

  useEffect(() => {
    function handleKeyboardEvent(e) {
      if (!validKeys.includes(e.key)) return;

      if (value === "toServe") {
        var player = e.key === "1" ? "player1" : "player2";
        sendMachine("SERVE_WON", { player });
        return;
      }

      if (e.key === "1") {
        sendMachine("POINT", { player: "player1" });
      }
      if (e.key === "2") {
        sendMachine("POINT", { player: "player2" });
      }
      if (e.key === "0") {
        sendMachine("NEW_GAME");
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [value]);

  return (
    <div className="h-screen grid items-center ">
      <Head>
        <title>Pong</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {value === "setup" && (
        <Setup
          onSetup={({ player1, player2 }) =>
            sendMachine("NEW_GAME", { player1, player2 })
          }
        />
      )}
      {(value === "toServe" || value == "playing") && (
        <Board player1={player1} player2={player2} toServe={toServe} />
      )}
      {value === "winner" && (
        <Winner
          name={winner === "player1" ? player1.name : player2.name}
          rematch={() => sendMachine("REMATCH")}
          newGame={() => sendMachine("NEW_GAME")}
        />
      )}
    </div>
  );
}
