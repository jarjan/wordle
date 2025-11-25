import { createContext } from "preact";

import { useGame } from "./hooks";

export const GameContext = createContext({
  setToast: () => {},
  showToast: false,
  toastMessage: "",

  answers: [],
  guess: "",
  chance: 0,
  gameover: false,
  untilNextWord: "",
  tips: [],
  keyTips: {},
  onLetter: () => {},
  onRemove: () => {},
  onEnter: () => {},
});

export const GameProvider = ({ children }) => {
  const {
    setToast,
    showToast,
    toastMessage,
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
  } = useGame();

  return (
    <div class="wordle">
      <GameContext.Provider
        value={{
          setToast,
          showToast,
          toastMessage,
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
        }}
      >
        {children}
      </GameContext.Provider>
    </div>
  );
};
