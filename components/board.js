export function Board({ player1, player2, toServe }) {
  return (
    <div
      style={{ fontSize: "14vw", lineHeight: 1.2 }}
      className="grid grid-cols-board gap-y-4 font-mono m-4"
    >
      <Player player={player1} toServe={toServe === "player1"} />
      <Player player={player2} toServe={toServe === "player2"} />
    </div>
  );
}

function Player({ player, toServe }) {
  return (
    <>
      <Box className="truncate px-4">{player.name}</Box>
      <div>{toServe && "•"}</div>
      <Box className="text-right">{player.score}</Box>
    </>
  );
}

function Box({ children, className }) {
  return (
    <div className={`rounded-lg bg-gray-200 ${className}`}>{children}</div>
  );
}
