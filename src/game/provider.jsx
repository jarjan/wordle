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
  won: false,
  untilNextWord: "",
  revealRow: -1,
  shake: false,
  tips: [],
  keyTips: {},
  onLetter: () => {},
  onRemove: () => {},
  onEnter: () => {},
});

export const GameProvider = ({ children }) => {
  const game = useGame();

  return (
    <div class="wordle">
      <GameContext.Provider value={game}>{children}</GameContext.Provider>
    </div>
  );
};
