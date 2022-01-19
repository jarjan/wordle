import { useState } from "preact/hooks";

import "./style";

import words from "./words.json";

import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

const timestamp = 1642628391000;

export default function App() {
  const todayWord = words[parseInt((Date.now() - timestamp) / 86400000, 10)];
  const havePlayed = localStorage.getItem("wordle") === todayWord;

  const [answers, setAnswers] = useState(
    havePlayed
      ? JSON.parse(window.localStorage.getItem("answers"))
      : ["", "", "", "", "", ""]
  );
  const [guess, setGuess] = useState("");
  const [chance, setChance] = useState(0);
  const [gameover, setGameover] = useState(havePlayed);

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
        alert("Жарайсын! Кешірек келсең жаңа сөз пайда болады");
        handleGameover();
      }
      if (chance === 5) {
        alert("Келесі рет сәті түсер");
        handleGameover();
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
        window.localStorage.setItem("answers", JSON.stringify(newAnswers));
        setChance(chance + 1);
        setGuess("");
      }
    }
  };

  return (
    <div class="wordle">
      <div class="header">
        <h1>Қазақша Wordle!</h1>
        {gameover && (
          <small>
            Келесі сөзге дейін{" "}
            {24 - parseInt((Date.now() - timestamp) / 3600000, 10)} сағат
          </small>
        )}
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
          onLetter={handleLetter}
          onRemove={handleRemove}
          onEnter={handleEnter}
        />
      )}
    </div>
  );
}
