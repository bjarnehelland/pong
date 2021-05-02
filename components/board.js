export function Board({ player1, player2, toServe }) {
  return (
    <div
      style={{ fontSize: "14vw" }}
      className="grid grid-cols-board gap-8  font-mono border border-gray-300 m-8"
    >
      <div className="truncate">{player1.name}</div>
      <div>{toServe === "player1" && "•"}</div>
      <div className="text-right">{player1.score}</div>
      <div className="truncate">{player2.name}</div>
      <div>{toServe === "player2" && "•"}</div>
      <div className="text-right">{player2.score}</div>
    </div>
  );
}
