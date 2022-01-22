import "./style";

import words from "./words.json";
import keys from "./keys.json";

import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

import { useGame, todayWord } from "./hooks";

export default function App() {
  const {
    answers,
    setAnswers,
    guess,
    setGuess,
    chance,
    setChance,
    gameover,
    handleGameover,
    untilNextWord,
  } = useGame();

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
        const newAnswers = [...answers];
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

  return (
    <div class="wordle">
      <div class="header">
        <h1>Қазақша Wordle!</h1>
        {gameover && <small>Келесі сөзге дейін {untilNextWord}</small>}
        <hr />
      </div>
      <Board
        answers={answers}
        guess={guess}
        chance={chance}
        todayWord={todayWord}
      />
      {!gameover && (
        <Keyboard
          keys={keys}
          onLetter={handleLetter}
          onRemove={handleRemove}
          onEnter={handleEnter}
        />
      )}
    </div>
  );
}
