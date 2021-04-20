import Head from "next/head";
import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import styles from "../styles/Home.module.css";

export default function Home() {
  const state = useStore();

  useEffect(() => {
    function handleKeyboardEvent(e) {
      if (e.key === "1") {
        state.pointPlayerOne();
      }
      if (e.key === "2") {
        state.pointPlayerTwo();
      }
      if (e.key === "0") {
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

      <h1>{state.score[0]}</h1>
      <h1>-</h1>
      <h1>{state.score[1]}</h1>
    </div>
  );
}
