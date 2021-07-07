import { Setup } from "../components/setup";
import { Container } from "@/components/Container";
import router from "next/router";
import { post } from "utils/fetch";

export default function Home() {
  const handleNewMatch = async (player1: string, player2: string) => {
    const { _id } = await post("api/match", { player1, player2 });
    router.push(`/${_id}`);
  };
  return (
    <Container>
      <Setup onSetup={handleNewMatch} />
    </Container>
  );
}
