import Confetti from "react-confetti";
export function Winner({ name, rematch, newGame }) {
  return (
    <div className="flex flex-col justify-self-center gap-4">
      <Confetti />
      <div style={{ fontSize: "10vw" }}>The winner is {name}</div>
      <button className="text-4xl" onClick={() => rematch()}>
        Rematch
      </button>
      <button className="text-4xl" onClick={() => newGame()}>
        New game
      </button>
    </div>
  );
}
