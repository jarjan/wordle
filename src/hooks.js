import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";

import words from "./words.json";

import { ToastContext } from "./components/Toast";

export const timestamp = 1642628391000;
export const todayWord = words[Math.floor((Date.now() - timestamp) / 86400000)];

const initialAnswers = window.localStorage.getItem(`answers${todayWord}`)
  ? JSON.parse(window.localStorage.getItem(`answers${todayWord}`))
  : ["", "", "", "", "", ""];
const initialTips = [[], [], [], [], [], []];
const initialChance = initialAnswers.findIndex((answer) => answer === "") || 0;
const initialGameover = window.localStorage.getItem("wordle") === todayWord;

export const useGame = () => {
  const { setToast } = useContext(ToastContext);
  const [answers, setAnswers] = useState(initialAnswers);
  const [tips, setTips] = useState(initialTips);
  const [keyTips, setKeyTips] = useState({});
  const [guess, setGuess] = useState("");
  const [chance, setChance] = useState(initialChance);
  const [gameover, setGameover] = useState(initialGameover);
  const [untilNextWord, setUntilNextWord] = useState("23:59:59");

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
            newKeyTips[letter] = { isExact: true };
            newTips[i][j] = { isExact: true };
            word = word.replace(letter, "");
          } else if (word.includes(letter) && !newKeyTips[letter].isExact) {
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
        setToast("Жарайсын! Кешірек келсең жаңа сөз пайда болады");
      }
      if (chance === 5) {
        handleGameover();
        setToast("Келесі рет сәті түсер");
      }
      if (guess.length < 5) {
        setToast("5 әріпті толық еңгізу керек!");
      } else if (!words.includes(guess)) {
        setToast("Мұндай сөз сөздікте жоқ :(");
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
