import React, { useEffect, useRef, useState } from "react";
import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react-util";
import Pusher from "pusher-js";

const isDev = process.env.NODE_ENV === "development";

export default function Home() {
  const [rep, setRep] = useState(null);

  useEffect(async () => {
    const rep = new Replicache({
      pushURL: "/api/replicache-push",
      pullURL: "/api/replicache-pull",
      // The .dev.wasm version is nice during development because it has
      // symbols and additional debugging info. The .wasm version is smaller
      // and faster.
      wasmModule: isDev ? "/replicache.dev.wasm" : "/replicache.wasm",
      mutators: {
        async createMatch(tx, { id, player1, player2, order }) {
          await tx.put(`match/${id}`, {
            player1,
            player2,
            order,
          });
        },
      },
    });

    // TODO: https://github.com/rocicorp/replicache/issues/328
    rep.pull();
    listen(rep);
    setRep(rep);
  }, []);

  console.log(process.env.NODE_ENV);

  return rep && <Chat rep={rep} />;
}

function Chat({ rep }) {
  const matches = useSubscribe(
    rep,
    async (tx) => {
      const list = await tx.scan({ prefix: "match/" }).entries().toArray();

      return list;
    },
    []
  );

  const player1Ref = useRef();
  const player2Ref = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const last = matches.length && matches[matches.length - 1][1];
    const order = (last?.order ?? 0) + 1;
    rep.mutate.createMatch({
      // Easy unique ID. In a real app use a GUID.
      id: Math.random().toString(32).substr(2),
      player1: player1Ref.current.value,
      player2: player2Ref.current.value,
      order,
    });
    player1Ref.current.value = "";
    player2Ref.current.value = "";
  };

  console.log(matches);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          ref={player1Ref}
          placeholder="Player 1"
          className="p-4 mx-3 text-lg"
          required
        />
        <input
          ref={player2Ref}
          placeholder="Player 2"
          className="p-4 mx-3 text-lg"
          required
        />
        <input type="submit" />
      </form>
      <MessageList messages={matches} />
    </div>
  );
}

function MessageList({ messages }) {
  return messages.map(([k, v]) => {
    return (
      <div key={k}>
        {v.player1}:{v.player2}
      </div>
    );
  });
}

function listen(rep) {
  console.log("listening");
  // Listen for pokes, and pull whenever we get one.
  Pusher.logToConsole = true;
  const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
  });
  const channel = pusher.subscribe("default");
  channel.bind("poke", () => {
    console.log("got poked");
    rep.pull();
  });
}
