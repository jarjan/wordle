import { useEffect, useLayoutEffect, useState } from "preact/hooks";

import words from "../constants/words.json";

export const timestamp = 1642628391000;
export const todayWord = words[Math.floor((Date.now() - timestamp) / 86400000)];

const initialAnswers = window.localStorage.getItem(`answers${todayWord}`)
  ? JSON.parse(window.localStorage.getItem(`answers${todayWord}`))
  : ["", "", "", "", "", ""];
const initialTips = [[], [], [], [], [], []];
const initialChance = initialAnswers.findIndex((answer) => answer === "") || 0;
const initialGameover = window.localStorage.getItem("wordle") === todayWord;

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const setToast = (message) => {
    setShowToast(true);
    setToastMessage(message);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return { showToast, toastMessage, setToast };
};

export const useGame = () => {
  const { showToast, toastMessage, setToast } = useToast();

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
            word = word.replace(letter, "X");
          } else if (word.includes(letter) && !newKeyTips[letter].isExact) {
            newKeyTips[letter] = { isCorrect: true };
            newTips[i][j] = { isCorrect: true };
            word = word.replace(letter, "X");
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

  const onGameover = () => {
    setGameover(true);
    window.localStorage.setItem("wordle", todayWord);
  };

  const onLetter = (letter) => {
    if (guess.length < 5) {
      setGuess(guess + letter);
    }
  };

  const onRemove = () => {
    if (guess.length > 0) {
      setGuess(guess.slice(0, -1));
    }
  };

  const onEnter = () => {
    if (!gameover) {
      if (guess === todayWord) {
        onGameover();
        setToast("Жарайсын! Кешірек келсең жаңа сөз пайда болады");
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
    if (chance > 5) {
      onGameover();
      setToast("Келесі рет сәті түсер");
    }
  };

  return {
    showToast,
    toastMessage,
    setToast,

    answers,
    guess,
    chance,
    gameover,
    untilNextWord,
    tips,
    keyTips,
    onLetter,
    onRemove,
    onEnter,
  };
};
