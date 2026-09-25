import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "preact/hooks";

import words from "../constants/words.json";

export const timestamp = 1764104842291;
const todayWordIndex = Math.floor((Date.now() - timestamp) / 86400000);
export const todayWord = words[todayWordIndex];

const MAX_CHANCES = 6;
// Time for a submitted row to finish flipping (5 tiles, 100ms stagger, 500ms flip).
const REVEAL_MS = 1000;
const WIN_BOUNCE_MS = 1000;

// Two-pass Wordle scoring: greens first, then yellows from the remaining letters.
export const score = (guess, answer) => {
  const result = Array.from({ length: guess.length }, () => ({}));
  const remaining = answer.split("");

  guess.split("").forEach((letter, i) => {
    if (letter === answer[i]) {
      result[i] = { isExact: true };
      remaining[i] = null;
    }
  });

  guess.split("").forEach((letter, i) => {
    if (result[i].isExact) return;
    const index = remaining.indexOf(letter);
    if (index !== -1) {
      result[i] = { isCorrect: true };
      remaining[index] = null;
    }
  });

  return result;
};

const initialAnswers =
  typeof window !== "undefined" &&
  window.localStorage.getItem(`answers${todayWord}`)
    ? JSON.parse(window.localStorage.getItem(`answers${todayWord}`))
    : ["", "", "", "", "", ""];
const initialTips = [[], [], [], [], [], []];
const firstEmpty = initialAnswers.findIndex((answer) => answer === "");
const initialChance = firstEmpty === -1 ? MAX_CHANCES : firstEmpty;
const initialGameover =
  (typeof window !== "undefined" &&
    window.localStorage.getItem("wordle") === todayWord) ||
  initialAnswers.includes(todayWord) ||
  initialChance >= MAX_CHANCES;

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const timeoutRef = useRef();

  const setToast = useCallback((message) => {
    setShowToast(true);
    setToastMessage(message);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

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
  const [untilNextWord, setUntilNextWord] = useState("");
  // Index of the row that was just submitted and should play the flip animation.
  const [revealRow, setRevealRow] = useState(-1);
  const [shake, setShake] = useState(false);
  const shakeTimeoutRef = useRef();

  const won = answers.includes(todayWord);
  const finished = gameover || won || chance >= MAX_CHANCES;

  // Effect for updating tips
  useEffect(() => {
    const newTips = [[], [], [], [], [], []];
    const newKeyTips = {};
    answers.forEach((answer, i) => {
      if (answer === "") return;
      newTips[i] = score(answer, todayWord);
      answer.split("").forEach((letter, j) => {
        const tip = newTips[i][j];
        const prev = newKeyTips[letter] || {};
        if (tip.isExact || prev.isExact) {
          newKeyTips[letter] = { isExact: true };
        } else if (tip.isCorrect || prev.isCorrect) {
          newKeyTips[letter] = { isCorrect: true };
        } else {
          newKeyTips[letter] = { isAnswered: true };
        }
      });
    });
    setKeyTips(newKeyTips);
    setTips(newTips);
  }, [answers]);

  // Effect for countdown timer
  useLayoutEffect(() => {
    if (untilNextWord === "00:00:00") {
      window.location.reload();
    }
  }, [untilNextWord]);

  useLayoutEffect(() => {
    if (gameover) {
      const tick = () => {
        const now = Date.now();
        const nextWordTime = timestamp + (todayWordIndex + 1) * 86400000;
        const diff = nextWordTime - now;

        if (diff < 0) {
          // Should reload or handle next word, but for now just show 00:00:00
          setUntilNextWord("00:00:00");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        let timeString = "";
        if (hours > 0) {
          timeString += `${hours} сағат `;
        }
        timeString += `${minutes} минут ${seconds} секунд`;

        setUntilNextWord(timeString);
      };
      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
  }, [gameover]);

  // Persist immediately, but let the last row finish animating before the
  // keyboard is swapped for the game-over panel.
  const onGameover = useCallback((delay) => {
    window.localStorage.setItem("wordle", todayWord);
    setTimeout(() => setGameover(true), delay);
  }, []);

  const shakeRow = useCallback(() => {
    setShake(true);
    clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setShake(false), 600);
  }, []);

  const onLetter = useCallback(
    (letter) => {
      if (finished) return;
      setGuess((prev) => (prev.length < 5 ? prev + letter : prev));
    },
    [finished],
  );

  const onRemove = useCallback(() => {
    if (finished) return;
    setGuess((prev) => prev.slice(0, -1));
  }, [finished]);

  const onEnter = useCallback(() => {
    if (finished) return;

    if (guess.length < 5) {
      shakeRow();
      setToast("5 әріпті толық еңгізу керек!");
      return;
    }
    if (!words.includes(guess)) {
      shakeRow();
      setToast("Мұндай сөз сөздікте жоқ :(");
      return;
    }

    const newAnswers = [...answers];
    newAnswers[chance] = guess;
    setAnswers(newAnswers);
    window.localStorage.setItem(
      `answers${todayWord}`,
      JSON.stringify(newAnswers),
    );
    setRevealRow(chance);
    setChance(chance + 1);
    setGuess("");

    if (guess === todayWord) {
      onGameover(REVEAL_MS + WIN_BOUNCE_MS);
      setTimeout(
        () => setToast("Жарайсың! Кешірек келсең жаңа сөз пайда болады."),
        REVEAL_MS,
      );
    } else if (chance + 1 >= MAX_CHANCES) {
      onGameover(REVEAL_MS);
      setTimeout(
        () =>
          setToast(`Келесі рет сәті түсер. Сөз: ${todayWord.toUpperCase()}`),
        REVEAL_MS,
      );
    }
  }, [finished, guess, answers, chance, onGameover, setToast, shakeRow]);

  // Updated on every render so the keydown listener never sees stale state,
  // even if the browser delays effects.
  const latest = useRef();
  latest.current = { finished, onEnter, onRemove, onLetter };

  useEffect(() => {
    // Support for keyboard input
    const handleKeyDown = (e) => {
      const { finished, onEnter, onRemove, onLetter } = latest.current;
      if (finished || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") {
        // Stop Enter from also "clicking" a focused on-screen key.
        e.preventDefault();
        onEnter();
      } else if (e.key === "Backspace") {
        onRemove();
      } else {
        const key = e.key.toLowerCase();
        if (key.length === 1 && /^[а-яәіңғүұқөһ]$/.test(key)) {
          onLetter(key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    showToast,
    toastMessage,
    setToast,

    answers,
    guess,
    chance,
    gameover,
    won,
    untilNextWord,
    revealRow,
    shake,
    tips,
    keyTips,
    onLetter,
    onRemove,
    onEnter,
  };
};
