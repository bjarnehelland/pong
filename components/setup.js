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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-self-center gap-4 overflow-hidden pt-1 max-w-full"
    >
      <input
        ref={player1Ref}
        placeholder="Player 1"
        required
        className="p-4 mx-3 text-6xl"
      />
      <input
        ref={player2Ref}
        placeholder="Player 2"
        required
        className="p-4 mx-3 text-6xl"
      />
      <button className="text-4xl" type="submit">
        New game
      </button>
    </form>
  );
}
