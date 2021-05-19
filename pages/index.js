import { useEffect } from "react";
import { gameMachine } from "../lib/machines";
import { useMachine } from "@xstate/react";
import { Setup } from "../components/setup";
import { Winner } from "../components/winner";
import { Board } from "../components/board";
import { Container } from "@/components/Container";
import { signIn, signOut, useSession } from "next-auth/client";
import { connectToDatabase } from "util/mongodb";
import { User } from "@/components/user";

const validKeys = ["0", "1", "2"];

export default function Home({ isConnected, users }) {
  const [
    {
      context: { player1, player2, toServe, winner, timeline },
      value,
    },
    sendMachine,
  ] = useMachine(gameMachine);

  console.log(timeline);
  const [session, loading] = useSession();
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
        sendMachine("REMATCH");
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [value]);

  return (
    <Container>
      {users.map((user) => (
        <User key={user._id} user={user} />
      ))}
      {isConnected ? (
        <h2 className="subtitle">You are connected to MongoDB</h2>
      ) : (
        <h2 className="subtitle">
          You are NOT connected to MongoDB. Check the <code>README.md</code> for
          instructions.
        </h2>
      )}
      {!session && (
        <>
          <h1>You are not signed in</h1> <br />
          <button onClick={signIn}>Sign in</button>
        </>
      )}

      {session && (
        <>
          <h1>Signed in as {session.user.email} </h1> <br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}

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
          toServe={toServe}
          addPoint={(player) => sendMachine("POINT", { player })}
        />
      )}
      {value === "winner" && (
        <Winner
          name={winner === "player1" ? player1.name : player2.name}
          rematch={() => sendMachine("REMATCH")}
          newGame={() => sendMachine("NEW_GAME")}
        />
      )}
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { client, db } = await connectToDatabase();

  const isConnected = await client.isConnected();
  const users = await db.collection("users").find({}).toArray();

  return {
    props: { isConnected, users: JSON.parse(JSON.stringify(users)) },
  };
}
