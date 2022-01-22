import "./style";

import keys from "./keys.json";

import Board from "./components/Board";
import Keyboard from "./components/Keyboard";

import { useGame } from "./hooks";

export default function App() {
  const {
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
  } = useGame();

  return (
    <div class="wordle">
      <div class="header">
        <h1>Қазақша Wordle!</h1>
        {gameover && <small>Келесі сөзге дейін {untilNextWord}</small>}
        <hr />
      </div>
      <Board answers={answers} guess={guess} chance={chance} tips={tips} />
      {!gameover && (
        <Keyboard
          keys={keys}
          onLetter={handleLetter}
          onRemove={handleRemove}
          onEnter={handleEnter}
          keyTips={keyTips}
        />
      )}
    </div>
  );
}
