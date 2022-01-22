import { useEffect, useLayoutEffect, useState } from "preact/hooks";

import words from "./words.json";

export const timestamp = 1642628391000;
export const todayWord = words[Math.floor((Date.now() - timestamp) / 86400000)];

const initialAnswers = window.localStorage.getItem(`answers${todayWord}`)
  ? JSON.parse(window.localStorage.getItem(`answers${todayWord}`))
  : ["", "", "", "", "", ""];
const initialTips = [[], [], [], [], [], []];
const initialChance = initialAnswers.findIndex((answer) => answer === "") || 0;
const initialGameover = window.localStorage.getItem("wordle") === todayWord;

export const useGame = () => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [tips, setTips] = useState(initialTips);
  const [keyTips, setKeyTips] = useState({});
  const [guess, setGuess] = useState("");
  const [chance, setChance] = useState(initialChance);
  const [gameover, setGameover] = useState(initialGameover);
  const [untilNextWord, setUntilNextWord] = useState("00:00:01");

  // Effect for updating tips
  useEffect(() => {
    const newTips = [...tips];
    const newKeyTips = { ...keyTips };
    answers.map((answer, i) => {
      if (answer !== "") {
        let word = todayWord;
        answer.split("").map((letter, j) => {
          if (!newKeyTips[letter]) {
            newKeyTips[letter] = { isAnswered: true };
          }
          if (letter === todayWord[j]) {
            newKeyTips[letter] = { isInPosition: true };
            newTips[i][j] = { isInPosition: true };
            word = word.replace(letter, "");
          } else if (word.includes(letter)) {
            newKeyTips[letter] = { isCorrect: true };
            newTips[i][j] = { isCorrect: true };
          }
        });
      }
    });
    setKeyTips(newKeyTips);
    setTips(newTips);
  }, [answers]);

  // Effect for countdown timer
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

  const handleGameover = () => {
    setGameover(true);
    window.localStorage.setItem("wordle", todayWord);
  };

  const handleLetter = (letter) => {
    if (guess.length < 5) {
      setGuess(guess + letter);
    }
  };

  const handleRemove = () => {
    if (guess.length > 0) {
      setGuess(guess.slice(0, -1));
    }
  };

  const handleEnter = () => {
    if (!gameover) {
      if (guess === todayWord) {
        handleGameover();
        alert("Жарайсын! Кешірек келсең жаңа сөз пайда болады");
      }
      if (chance === 5) {
        handleGameover();
        alert("Келесі рет сәті түсер");
      }
      if (guess.length < 5) {
        alert("5 әріпті толық еңгізу керек!");
      } else if (!words.includes(guess)) {
        alert("Мұндай сөз сөздікте жоқ :(");
      }
      if (words.includes(guess)) {
        let newAnswers = [...answers];
        newAnswers[chance] = guess;
        setAnswers(newAnswers);
        window.localStorage.setItem(
          `answers${todayWord}`,
          JSON.stringify(newAnswers)
        );
        setChance(chance + 1);
        setGuess("");
      }
    }
  };

  return {
    answers,
    guess,
    chance,
    gameover,
    untilNextWord,
    tips,
    keyTips,
    handleLetter,
    handleRemove,
    handleEnter,
  };
};
