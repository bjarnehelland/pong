export function Board({ player1, player2, score, toServe, addPoint }) {
  return (
    <div
      style={{ fontSize: "14vw", lineHeight: 1.2 }}
      className="grid grid-cols-board gap-y-4 font-mono m-4"
    >
      <Player
        player={player1}
        score={score[0]}
        toServe={toServe === "player1"}
        addPoint={() => addPoint("player1")}
      />
      <Player
        player={player2}
        score={score[1]}
        toServe={toServe === "player2"}
        addPoint={() => addPoint("player2")}
      />
    </div>
  );
}

function Player({ player, score, toServe, addPoint }) {
  return (
    <>
      <div className="shadow-xl rounded-lg px-2 bg-gray-200">{player}</div>
      <div className={toServe ? "visible" : "invisible"}>{"•"}</div>
      <button
        className="shadow-xl rounded-lg px-2 bg-gray-200 text-right"
        onClick={addPoint}
      >
        {score}
      </button>
    </>
  );
}
