import { useCallback, useLayoutEffect, useState } from "preact/hooks";

import words from "./words.json";

export const timestamp = 1642628391000;
export const todayWord = words[Math.floor((Date.now() - timestamp) / 86400000)];
export const havePlayed = window.localStorage.getItem("wordle") === todayWord;

export const useGame = () => {
  const [answers, setAnswers] = useState(
    window.localStorage.getItem(`answers${todayWord}`)
      ? JSON.parse(window.localStorage.getItem(`answers${todayWord}`))
      : ["", "", "", "", "", ""]
  );
  const [guess, setGuess] = useState("");
  const [chance, setChance] = useState(0);
  const [gameover, setGameover] = useState(havePlayed);
  const [untilNextWord, setUntilNextWord] = useState("00:00:01");

  useLayoutEffect(() => {
    if (untilNextWord === "00:00:00") {
      window.location.reload();
    }
    if (gameover) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = new Date(timestamp + 86400000 - now);
        const options = {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        setUntilNextWord(timeLeft.toLocaleTimeString("kk-KZ", options));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameover]);

  const handleGameover = useCallback(() => {
    setGameover(true);
    window.localStorage.setItem("wordle", todayWord);
  }, []);

  return {
    answers,
    setAnswers,
    guess,
    setGuess,
    chance,
    setChance,
    gameover,
    handleGameover,
    untilNextWord,
  };
};
