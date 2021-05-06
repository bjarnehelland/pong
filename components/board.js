export function Board({ player1, player2, toServe, addPoint }) {
  return (
    <div
      style={{ fontSize: "14vw", lineHeight: 1.2 }}
      className="grid grid-cols-board gap-y-4 font-mono m-4"
    >
      <Player
        player={player1}
        toServe={toServe === "player1"}
        addPoint={() => addPoint("player1")}
      />
      <Player
        player={player2}
        toServe={toServe === "player2"}
        addPoint={() => addPoint("player2")}
      />
    </div>
  );
}

function Player({ player, toServe, addPoint }) {
  return (
    <>
      <div className="shadow-xl rounded-lg px-2 bg-gray-200">{player.name}</div>
      <div className={toServe ? "visible" : "invisible"}>{"•"}</div>
      <button
        className="shadow-xl rounded-lg px-2 bg-gray-200 text-right"
        onClick={addPoint}
      >
        {player.score}
      </button>
    </>
  );
}
