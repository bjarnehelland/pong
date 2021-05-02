export function Winner({ name, rematch, newGame }) {
  return (
    <div className="flex flex-col justify-self-center">
      <div style={{ fontSize: "10vw" }}>The winner is {name}</div>
      <button onClick={() => rematch()}>Rematch</button>
      <button onClick={() => newGame()}>New game</button>
    </div>
  );
}
