import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    function handleKeyboardEvent(e) {
      if (e.key === "1") {
        setHomeScore((score) => score + 1);
      }
      if (e.key === "2") {
        setAwayScore((score) => score + 1);
      }
      if (e.key === "0") {
        setHomeScore(0);
        setAwayScore(0);
      }
    }
    document.addEventListener("keydown", handleKeyboardEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
    };
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Pong</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>{homeScore}</h1>
      <h1>-</h1>
      <h1>{awayScore}</h1>
    </div>
  );
}
