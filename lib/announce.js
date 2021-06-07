import { calculateScore, hasWinner, serve, transformScore } from "./machines";

export function announceServe(context) {
  const announce = `${context[context.startToServe]} won the serve.`;
  speak(announce);
}

function tennisScore(context) {
  const score = calculateScore(context.history).map(transformScore);

  if (score[0] === score[1] && score[0] === 40) {
    return `Deuce.`;
  }

  if (score[0] === score[1]) {
    return `${score[0]} love.`;
  }

  if (score[0] === "adv") {
    return `advantage ${context.player1}.`;
  }
  if (score[1] === "adv") {
    return `advantage ${context.player2}.`;
  }

  return `${score[0]} ${score[1]}.`;
}
export function announcePoint(context) {
  //let announce = `${score[0]} ${score[1]}.`;
  let announce = tennisScore(context);

  if (!hasWinner(context)) {
    if (isMatchPoint(context)) {
      announce += "match point.";
    }

    const toServe = serve(context);
    announce += `${context[toServe]} to serve.`;
  }
  speak(announce);
}

export function announceWinner(context) {
  const announce = `${context[context.winner]} won the match.`;
  speak(announce);
}

function isMatchPoint({ history, pointsToWin }) {
  const score = calculateScore(history);
  return (
    (score[0] >= pointsToWin - 1 && score[0] > score[1]) ||
    (score[1] >= pointsToWin - 1 && score[1] > score[0])
  );
}

function speak(announce) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(announce));
}

function canSpeak() {
  return "speechSynthesis" in window;
}
