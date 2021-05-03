import { useRef } from "react";

export function Setup({ onSetup }) {
  const player1Ref = useRef();
  const player2Ref = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    onSetup({
      player1: player1Ref.current.value,
      player2: player2Ref.current.value,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-self-center">
      <input ref={player1Ref} placeholder="Player1" required />
      <input ref={player2Ref} placeholder="Player2" required />
      <button type="submit">New game</button>
    </form>
  );
}