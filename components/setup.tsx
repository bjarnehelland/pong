import { FormEvent, useRef } from "react";

type Props = {
  onSetup: (player1: string, player2: string) => void;
};
export function Setup({ onSetup }: Props) {
  const player1Ref = useRef<HTMLInputElement>();
  const player2Ref = useRef<HTMLInputElement>();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSetup(player1Ref.current?.value, player2Ref.current?.value);
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
