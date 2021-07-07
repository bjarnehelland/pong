// function speak(announce) {
//   if (!canSpeak()) return;
//   const synth = window.speechSynthesis;
//   synth.cancel();
//   synth.speak(new SpeechSynthesisUtterance(announce));
// }

// function canSpeak() {
//   return "speechSynthesis" in window;
// }

// function announceServe(context) {
//   const announce = `${context[context.startToServe]} won the serve.`;
//   speak(announce);
// }

// function announcePoint(context) {
//   const score = `${context.score[0]} ${context.score[1]}.`;

//   let announce = score;

//   if (!hasWinner(context)) {
//     if (isMatchPoint(context)) {
//       announce += "match point.";
//     }

//     const toServe = serve(context);
//     announce += `${context[toServe]} to serve.`;
//   }
//   speak(announce);
// }

// function announceWinner(context) {
//   const announce = `${context[context.winner]} won the match.`;
//   speak(announce);
// }

// function hasWinner({ score }: GameContext) {
//   return (
//     (score[0] >= 11 && score[0] - 1 > score[1]) ||
//     (score[1] >= 11 && score[1] - 1 > score[0])
//   );
// }

// function isMatchPoint({ score }: GameContext) {
//   return (
//     (score[0] >= 10 && score[0] > score[1]) ||
//     (score[1] >= 10 && score[1] > score[0])
//   );
// }
